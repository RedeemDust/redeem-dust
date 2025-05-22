import { ethers} from "ethers";
import { Position } from "./types";
import { safeAbi } from "./safeAbi";
import {
  CONDITIONAL_TOKENS_FRAMEWORK_ADDRESS,
  NEG_RISK_ADAPTER_ADDRESS,
  USDC_ADDRESS,
  USDCE_DIGITS
} from "./constants";
import { encodeRedeem, encodeRedeemNegRisk, encodeErc20Transfer } from "./encode";
import { SafeTransaction, OperationType } from "./types";
import { aggregateTransaction, aggregateTransaction2} from "./safehelpers";
import { signSafeTx, debugSafeSignature } from "./sign";


export async function getProvider(): Promise<ethers.providers.Web3Provider | null> {
  if (window.ethereum) {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      return provider;
    } catch (error) {
      console.error("Error connecting to provider:", error);
      return null;
    }
  }
  return null;
}

export async function connectWallet(): Promise<string[] | null> {
  const provider = await getProvider();
  if (!provider) {
    throw new Error("No Ethereum provider found. Please install MetaMask.");
  }

  try {
    const accounts = await provider.send("eth_requestAccounts", []);
    return accounts;
  } catch (error) {
    console.error("Error connecting to wallet:", error);
    throw new Error("Failed to connect to wallet. Please try again.");
  }
}

export async function executeBatchRedeem(
  positions: Position[],
  safeAddress: string,
  fee: number = 0
): Promise<string | null> {
  try {
    const provider = await getProvider();
    if (!provider) {
      throw new Error("No provider available");
    }

    const signer = provider.getSigner();

    // Create SafeTransactions for each position
    const txns: SafeTransaction[] = positions.slice(0, 30).map(
      ({ marketId, negRisk, outcomeIndex, quantity }) => {
        // turn your `quantity` (e.g. 0.009511) into a 6-decimals BigNumber string
        const amountStr = ethers.utils
          .parseUnits(quantity.toString(), 6)
          .toString();

        // for a two-outcome market: if outcomeIndex is 0, [amount, 0]; else [0, amount]
        const outcomeAmounts: [string, string] =
          outcomeIndex === 0 ? [amountStr, "0"] : ["0", amountStr];

        console.log("orderamounts", outcomeAmounts);
        console.log("negRisk", negRisk);

        // pick the right calldata builder
        const data = negRisk
          ? encodeRedeemNegRisk(marketId, outcomeAmounts)
          : encodeRedeem(USDC_ADDRESS, marketId);

        // pick the right adapter address
        const to = negRisk
          ? NEG_RISK_ADAPTER_ADDRESS
          : CONDITIONAL_TOKENS_FRAMEWORK_ADDRESS;

        return {
          to,
          value: "0",
          data,
          operation: OperationType.Call,
        };
      },
    ); // Limit to 10 transactions for testing
    
    // Service fee destination address 
    const serviceFeeAddress = "0x4745BED9080A47cdf2e8280fD57Dd49237305916"; 
    
    // Convert fee from number (e.g., 0.05) to the proper USDC BigNumber format with 6 decimals
    const feeValue = ethers.utils.parseUnits(fee.toString(), USDCE_DIGITS);
    
    // Transfers the service fee as an ERC20 token out of the Safe to the service fee address
    const data = encodeErc20Transfer(serviceFeeAddress, feeValue);

    const safeTxn: SafeTransaction = {
        to: USDC_ADDRESS,
        data: data,
        operation: OperationType.Call,
        value: "0",
    };
    txns.push(safeTxn);
    console.error("txns:", txns);


    
    // whole batch
    
    // const batchTxn = aggregateTransaction2(txns);
    // Bundle into one multisend transaction
    const batchTxn = aggregateTransaction(txns);

    // Setup Safe contract
    const safe = new ethers.Contract(safeAddress, safeAbi, signer);
    const signerAddress = await signer.getAddress();
    const isOwner = await safe.isOwner(signerAddress);
    console.error("Is signer owner?", isOwner);

    // Get transaction parameters
    const nonce = (await safe.nonce()).toString();
    console.error("nonce", nonce);
    const safeTxGas = "0";
    const baseGas = "0";
    const gasPrice = "0";
    const gasToken = ethers.constants.AddressZero;
    const refundReceiver = ethers.constants.AddressZero;

    // Get transaction hash
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
      nonce,
    );
    console.error("value", batchTxn.value);
    console.error("operation", batchTxn.operation);

    const txData: SafeTxData = {
      to: batchTxn.to,
      value: batchTxn.value,
      data: batchTxn.data,
      operation: batchTxn.operation,
      safeTxGas,
      baseGas,
      gasPrice,
      gasToken,
      refundReceiver,
      nonce,
    };
    if (!validateTxData(txData)) {
      console.error("txData:", txData);
      throw new Error("txData validation failed – see console for details");
    }
    // const signature = await signSafeTx(safeAddress, txData);
    const signature = await signSafeTx(safeAddress, txData);

    // 2) If you still hit GS026, run the debugger:
    await debugSafeSignature(safeAddress, txData, signature);
    // Sign transaction hash with MetaMask
    console.error(
      "sig ok?",
      ethers.utils.isHexString(signature) &&
        ethers.utils.hexDataLength(signature) === 65,
    ); // → true

    try {
      await safe.callStatic.execTransaction(
        txData.to,
        txData.value,
        txData.data,
        txData.operation,
        txData.safeTxGas,
        txData.baseGas,
        txData.gasPrice,
        txData.gasToken,
        txData.refundReceiver,
        signature,
      );
      console.log("✅ Signature is valid (callStatic passed)");
    } catch (err: any) {
      console.error("❌ callStatic failed:", err.reason || err);
    }

    // const signature = await signer.signMessage(ethers.utils.arrayify(txHash));
    // Execute transaction
    const txResponse = await safe.execTransaction(
      txData.to,
      txData.value,
      txData.data,
      txData.operation,
      txData.safeTxGas,
      txData.baseGas,
      txData.gasPrice,
      txData.gasToken,
      txData.refundReceiver,
      signature,
    );

    // Wait for transaction confirmation
    await txResponse.wait();

    return txResponse.hash;
  } catch (error) {
    console.error("Error executing batch redeem:", error);
    throw error;
  }
}

// 3) Build your message payload
interface SafeTxData {
  to: string;
  value: string;
  data: string;
  operation: number;
  safeTxGas: string;
  baseGas: string;
  gasPrice: string;
  gasToken: string;
  refundReceiver: string;
  nonce: string;
}

function validateTxData(txData: SafeTxData): boolean {
  const errors: string[] = [];

  // address checks
  if (!ethers.utils.isAddress(txData.to)) {
    errors.push(`"to" is not a valid address: ${txData.to}`);
  }
  if (!ethers.utils.isAddress(txData.gasToken)) {
    errors.push(`"gasToken" is not a valid address: ${txData.gasToken}`);
  }
  if (!ethers.utils.isAddress(txData.refundReceiver)) {
    errors.push(
      `"refundReceiver" is not a valid address: ${txData.refundReceiver}`,
    );
  }

  // hex‐bytes check
  if (!ethers.utils.isHexString(txData.data)) {
    errors.push(`"data" is not a hex string: ${txData.data}`);
  }

  // decimal‐string checks
  for (const field of [
    "value",
    "safeTxGas",
    "baseGas",
    "gasPrice",
    "nonce",
  ] as const) {
    const val = txData[field];
    if (!/^[0-9]+$/.test(val)) {
      errors.push(
        `"${field}" must be a non-negative integer string, got: ${val}`,
      );
    }
  }

  // operation must be 0 or 1
  if (
    !Number.isInteger(txData.operation) ||
    (txData.operation !== 0 && txData.operation !== 1)
  ) {
    errors.push(`"operation" must be 0 or 1, got: ${txData.operation}`);
  }

  // report
  if (errors.length) {
    console.error("Invalid SafeTxData:", errors.join("\n  • "));
    return false;
  }
  return true;
}

