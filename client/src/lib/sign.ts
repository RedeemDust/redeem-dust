// safeSigner.ts
import { ethers, Contract } from "ethers";
import { safeAbi } from "./safeAbi";

// ----------------------------------------------------------------------------
// 0.  Types
// ----------------------------------------------------------------------------
export interface SafeTxData {
  to: string;
  value: ethers.BigNumberish;
  data: string;
  operation: number;
  safeTxGas: ethers.BigNumberish;
  baseGas: ethers.BigNumberish;
  gasPrice: ethers.BigNumberish;
  gasToken: string;
  refundReceiver: string;
  nonce: ethers.BigNumberish;
}

// ----------------------------------------------------------------------------
// 1.  EIP-712 tables
// ----------------------------------------------------------------------------
const SIGN_TYPES = {
  EIP712Domain: [
    // { name: "name", type: "string" },
    // { name: "version", type: "string" },
    { name: "chainId", type: "uint256" },
    { name: "verifyingContract", type: "address" },
  ],
  SafeTx: [
    { name: "to", type: "address" },
    { name: "value", type: "uint256" },
    { name: "data", type: "bytes" },
    { name: "operation", type: "uint8" },
    { name: "safeTxGas", type: "uint256" },
    { name: "baseGas", type: "uint256" },
    { name: "gasPrice", type: "uint256" },
    { name: "gasToken", type: "address" },
    { name: "refundReceiver", type: "address" },
    { name: "nonce", type: "uint256" },
  ],
} as const;

const VERIFY_TYPES = { SafeTx: SIGN_TYPES.SafeTx } as const;

// ----------------------------------------------------------------------------
// 2.  Build domain (pulling VERSION() live)
// ----------------------------------------------------------------------------
async function getSafeDomain(
  safeAddress: string,
  provider: ethers.providers.Provider,
) {
  const safe = new ethers.Contract(safeAddress, safeAbi, provider);
  const version: string = await safe.VERSION();
  const { chainId } = await provider.getNetwork();
  return {
    // name: "Gnosis Safe",
    // version,
    chainId,
    verifyingContract: safeAddress,
  };
}

// ----------------------------------------------------------------------------
// 3.  Sign + sanity-check
// ----------------------------------------------------------------------------
export async function signSafeTx(
  safeAddress: string,
  txData: SafeTxData,
): Promise<string> {
  const provider = new ethers.providers.Web3Provider(window.ethereum as any);
  await provider.send("eth_requestAccounts", []);
  const signer = provider.getSigner();
  const signerAddr = await signer.getAddress();

  const domain = await getSafeDomain(safeAddress, provider);
  const message = { ...txData };

  const rawSig: string = await (window.ethereum as any).request({
    method: "eth_signTypedData_v4",
    params: [
      signerAddr,
      JSON.stringify({
        domain,
        types: SIGN_TYPES,
        primaryType: "SafeTx",
        message,
      }),
    ],
  });

  // normalize v to 27/28
  const { r, s, v: rawV } = ethers.utils.splitSignature(rawSig);
  const v = rawV < 27 ? rawV + 27 : rawV;
  const sig = ethers.utils.joinSignature({ r, s, v });

  // local sanity-check
  const recovered = ethers.utils.verifyTypedData(
    domain,
    VERIFY_TYPES,
    message,
    sig,
  );
  if (recovered.toLowerCase() !== signerAddr.toLowerCase()) {
    throw new Error(
      `Bad signature; recovered ${recovered}, expected ${signerAddr}`,
    );
  }

  return sig;
}

// ----------------------------------------------------------------------------
// 4.  Debug helper (safe on missing DOMAIN_SEPARATOR)
// ----------------------------------------------------------------------------
// EIP-1967 implementation slot (bytes32(uint256(keccak256('eip1967.proxy.implementation')) - 1))
const IMPL_SLOT =
  "0x360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc";

async function getSafeImplementation(
  provider: ethers.providers.Provider,
  proxyAddress: string,
): Promise<string> {
  const raw = await provider.getStorageAt(proxyAddress, IMPL_SLOT);
  return ethers.utils.getAddress("0x" + raw.slice(26));
}

async function fetchOnChainDomainSeparator(
  provider: ethers.providers.Provider,
  proxyAddress: string,
): Promise<string> {
  const impl = await getSafeImplementation(provider, proxyAddress);
  const implContract = new ethers.Contract(
    impl,
    ["function DOMAIN_SEPARATOR() view returns (bytes32)"],
    provider,
  );
  return implContract.DOMAIN_SEPARATOR();
}

export async function debugSafeSignature(
  safeAddress: string,
  txData: SafeTxData,
  rawSig: string,
) {
  const provider = new ethers.providers.Web3Provider(window.ethereum as any);
  const signerAddr = await provider.getSigner().getAddress();

  // 1) Get on-chain domain details
  const safe = new Contract(safeAddress, safeAbi, provider);
  const versionOnChain = await safe.VERSION();
  const { chainId } = await provider.getNetwork();
  console.log("Chain ID:", chainId);
  
  // Get on-chain DOMAIN_SEPARATOR
  const onChainDS = await safe.domainSeparator();
  console.log("On-chain DOMAIN_SEPARATOR:", onChainDS);

  // 2) Build local domain
  const domain = {
    // name: "Gnosis Safe",
    // version: versionOnChain,
    chainId,
    verifyingContract: safeAddress,
  };
  console.log("Local domain config:", domain);

  // 3) Compute local DOMAIN_SEPARATOR and compare
  const offChainDS = ethers.utils._TypedDataEncoder.hashDomain(domain);
  console.log("Off-chain DOMAIN_SEPARATOR:", offChainDS);
  
  if (onChainDS !== offChainDS) {
    console.error("❌ DOMAIN_SEPARATOR mismatch!");
    console.error("This indicates EIP-712 domain parameters are incorrect");
    console.table({
      "On-chain": onChainDS,
      "Off-chain": offChainDS,
    });
  }

  // 4) Compare transaction digests
  const offChainDigest = ethers.utils._TypedDataEncoder.hash(
    domain,
    { SafeTx: SIGN_TYPES.SafeTx },
    txData,
  );
  const onChainDigest = await safe.getTransactionHash(
    txData.to,
    txData.value,
    txData.data,
    txData.operation,
    txData.safeTxGas,
    txData.baseGas,
    txData.gasPrice,
    txData.gasToken,
    txData.refundReceiver,
    txData.nonce,
  );
  console.log("\nTransaction digest comparison:");
  console.log("Off-chain:", offChainDigest);
  console.log("On-chain :", onChainDigest);

  // 5) Verify signature
  const { r, s, v: rawV } = ethers.utils.splitSignature(rawSig);
  const vNorm = rawV < 27 ? rawV + 27 : rawV;
  
  // Try recovering with both digests
  const recoveredOff = ethers.utils.recoverAddress(offChainDigest, { r, s, v: vNorm });
  const recoveredOn = ethers.utils.recoverAddress(onChainDigest, { r, s, v: vNorm });
  
  console.log("\nSignature details:");
  console.log("Raw signature:", rawSig);
  console.log("Components - r:", r, "s:", s, "v:", `${rawV} → ${vNorm}`);
  console.log("Expected signer:", signerAddr);
  console.log("Recovered (off-chain):", recoveredOff);
  console.log("Recovered (on-chain) :", recoveredOn);

  // 6) Final diagnosis
  const sigMatch = recoveredOn.toLowerCase() === signerAddr.toLowerCase();
  const digestMatch = offChainDigest === onChainDigest;
  const domainMatch = onChainDS === offChainDS;

  if (!domainMatch) {
    console.error("❌ Domain mismatch - check domain parameters");
  }
  if (!digestMatch) {
    console.error("❌ Digest mismatch - transaction data encoding differs");
  }
  if (!sigMatch) {
    console.error("❌ Signature mismatch - recovered address doesn't match signer");
  }
  if (domainMatch && digestMatch && sigMatch) {
    console.log("✅ All checks passed - signature should be valid");
  }
}
