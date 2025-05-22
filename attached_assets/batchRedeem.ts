import { config as dotenvConfig } from "dotenv";
import { resolve } from "path";
import { ethers, Wallet, Contract } from "ethers";

import { safeAbi } from "../../src/abis";
import {
  CONDITIONAL_TOKENS_FRAMEWORK_ADDRESS,
  NEG_RISK_ADAPTER_ADDRESS,
  USDC_ADDRESS,
} from "../../src/constants";
import { encodeRedeem, encodeRedeemNegRisk } from "../../src/encode";

import {
  SafeTransaction,
  OperationType,
} from "../../src/types";                    // where SafeTransaction lives

import {
  aggregateTransaction,
  signTransactionHash,
  abiEncodePacked,
} from "../../src/safe-helpers";          // your helper functions

import { buildSafeEthSignSignature } from "./showPayload";


dotenvConfig({ path: resolve(__dirname, "../../.env") });

async function main() {
  const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL);
  const signer   = new Wallet(process.env.PK!, provider);
  const safeAddr = process.env.SAFE_ADDRESS!;
  const safe     = new Contract(safeAddr, safeAbi, signer);

  // --- 1) Prepare your batch of redeems ---
  // Suppose you want to redeem two positions:
  const positions = [
    { conditionId: "0x630144bbbc9272583cac1e6fb1c3dd9bca5005165470d6231f59c683e2858734", negRisk: false,  amounts: ["0","1000000"] },  // replace with real
    { conditionId: "0xfc5845e6e0ba2712914af770fa2b3668a7819e06e2f1dab759c2135f8fcdf5de", negRisk: false,   amounts: ["0","2500000"] },
  ];

  const txns: SafeTransaction[] = positions.map(({ conditionId, negRisk, amounts }) => {
    const data = negRisk
      ? encodeRedeemNegRisk(conditionId, amounts)
      : encodeRedeem(USDC_ADDRESS, conditionId);
    const to   = negRisk
      ? NEG_RISK_ADAPTER_ADDRESS
      : CONDITIONAL_TOKENS_FRAMEWORK_ADDRESS;

    return {
      to,
      value: "0",
      data,
      operation: OperationType.Call,
    };
  });

  // --- 2) Bundle into one multisend if length > 1 ---
  const batchTxn = aggregateTransaction(txns);

  // --- 3) Compute Safe’s EIP-712 hash and sign it ---
  // const nonce = await safe.nonce(); // have to use this to make it work and gas price and old way of sign
  const nonce ="46";
  const safeTxGas      = "0";
  const baseGas        = "0";
  const gasPrice       = "0"; // 200000000000
  const gasToken       = ethers.constants.AddressZero;
  const refundReceiver = ethers.constants.AddressZero;

  const txHash = await safe.getTransactionHash(
    batchTxn.to,
    batchTxn.value,
    batchTxn.data,
    batchTxn.operation,
    safeTxGas,
    baseGas,
    gasPrice,
    gasToken,
    refundReceiver,
    nonce
  );

  const signature = await buildSafeEthSignSignature(signer, txHash);
  const { r, s, v } = await signTransactionHash(signer as Wallet, txHash);
  const packedSig = abiEncodePacked(
    { type: "uint256", value: r },
    { type: "uint256", value: s },
    { type: "uint8",   value: v }
  );

  if (signature === packedSig) {
    console.log("✅ signature and packedSig are exactly the same.");
  } else {
    console.log("❌ signature and packedSig are different.");
    console.log("signature:", signature);
    console.log("packedSig:", packedSig);
  }

  const payload = {
    from: signer.address,
    to: batchTxn.to,
    proxyWallet: safeAddr,
    data: batchTxn.data,
    nonce: nonce.toString(),
    signature,           // the 0x…65-byte raw sig from buildSafeEthSignSignature()
    signatureParams: {
      safeTxnGas: safeTxGas,        // e.g. "0"
      baseGas,           // e.g. "0"
      gasPrice,          // e.g. "0"
      gasToken,          // ethers.constants.AddressZero
      refundReceiver,    // ethers.constants.AddressZero
      operation: batchTxn.operation.toString()
    },
    type: "SAFE"
  };

  console.log("=== RELAYER PAYLOAD ===");
  console.log(JSON.stringify(payload, null, 2));

  // --- 4) Static-call the batch on your Safe (no gas, no state change) ---
    try {
      await safe.callStatic.execTransaction(
    batchTxn.to,
    batchTxn.value,
    batchTxn.data,
    batchTxn.operation,
    safeTxGas,
    baseGas,
    gasPrice,
    gasToken,
    refundReceiver,
    signature
    // packedSig
      );
    } catch (err) {
      // err is inferred as unknown, so you may need to coerce:
      const e = err as { reason?: string; errorArgs?: any; data?: string };
      console.error("❌ callStatic reverted!", {
        reason:    e.reason,
        errorArgs: e.errorArgs,
        data:      e.data,
      });
    }


}

main().catch(console.error);
