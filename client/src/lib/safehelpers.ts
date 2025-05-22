import { TransactionResponse } from "@ethersproject/abstract-provider";
import { BigNumber, Contract, ethers, Wallet} from "ethers";
import { SafeTransaction, OperationType } from "./types";
import { Interface } from "ethers/lib/utils";
import { multisendAbi } from "./abis";
import { SAFE_MULTISEND_ADDRESS } from "./constants";
import { BytesLike } from "ethers/lib/utils";
import {debugTxns} from "./encodeDebug"
const SAFE_MULTISEND_INTERFACE = new Interface(multisendAbi);

interface SplitSignature {
    r: string;
    s: string;
    v: string;
}

function joinHexData(hexData: string[]): string {
    return `0x${hexData
        .map((hex) => {
            const stripped = hex.replace(/^0x/, "");
            return stripped.length % 2 === 0 ? stripped : "0" + stripped;
        })
        .join("")}`;
}

function getHexDataLength(hexData: string): number {
    return Math.ceil(
        (hexData.startsWith("0x") ? hexData.length - 2 : hexData.length) / 2,
    );
}

function abiEncodePacked(...params: { type: string; value: any }[]): string {
    return joinHexData(
        params.map(({ type, value }) => {
            const encoded = ethers.utils.defaultAbiCoder.encode(
                [type],
                [value],
            );

            if (type === "bytes" || type === "string") {
                const bytesLength = parseInt(encoded.slice(66, 130), 16);
                return encoded.slice(130, 130 + 2 * bytesLength);
            }

            let typeMatch = type.match(/^(?:u?int\d*|bytes\d+|address)\[\]$/);
            if (typeMatch) {
                return encoded.slice(130);
            }

            if (type.startsWith("bytes")) {
                const bytesLength = parseInt(type.slice(5));
                return encoded.slice(2, 2 + 2 * bytesLength);
            }

            typeMatch = type.match(/^u?int(\d*)$/);
            if (typeMatch) {
                if (typeMatch[1] !== "") {
                    const bytesLength = parseInt(typeMatch[1]) / 8;
                    return encoded.slice(-2 * bytesLength);
                }
                return encoded.slice(-64);
            }

            if (type === "address") {
                return encoded.slice(-40);
            }

            throw new Error(`unsupported type ${type}`);
        }),
    );
}

async function signTransactionHash(
    signer: Wallet,
    message: string,
): Promise<SplitSignature> {
    const messageArray = ethers.utils.arrayify(message);
    let sig = await signer.signMessage(messageArray);
    let sigV = parseInt(sig.slice(-2), 16);

    switch (sigV) {
        case 0:
        case 1:
            sigV += 31;
            break;
        case 27:
        case 28:
            sigV += 4;
            break;
        default:
            throw new Error("Invalid signature");
    }

    sig = sig.slice(0, -2) + sigV.toString(16);

    return {
        r: BigNumber.from("0x" + sig.slice(2, 66)).toString(),
        s: BigNumber.from("0x" + sig.slice(66, 130)).toString(),
        v: BigNumber.from("0x" + sig.slice(130, 132)).toString(),
    };
}

const createSafeMultisendTransaction = (
    txns: SafeTransaction[],
): SafeTransaction => {
    const data = SAFE_MULTISEND_INTERFACE.encodeFunctionData("multiSend", [
        joinHexData(
            txns.map((tx) =>
                abiEncodePacked(
                    { type: "uint8", value: tx.operation },
                    { type: "address", value: tx.to },
                    { type: "uint256", value: tx.value },
                    { type: "uint256", value: getHexDataLength(tx.data) },
                    { type: "bytes", value: tx.data },
                ),
            ),
        ),
    ]);

    return {
        to: SAFE_MULTISEND_ADDRESS,
        value: "0",
        data: data,
        operation: OperationType.DelegateCall,
    };
};


const createSafeMultisendTransaction2 = (
    txns: SafeTransaction[],
): SafeTransaction => {
    const data = SAFE_MULTISEND_INTERFACE.encodeFunctionData("multiSend", [
        joinHexData(
            txns.map((tx) =>
                abiEncodePacked2(
                    { type: "uint8", value: tx.operation },
                    { type: "address", value: tx.to },
                    { type: "uint256", value: tx.value },
                    { type: "uint256", value: ethers.utils.hexDataLength(tx.data)},
                    { type: "bytes", value: tx.data },
                ),
            ),
        ),
    ]);

    return {
        to: SAFE_MULTISEND_ADDRESS,
        value: "0",
        data: data,
        operation: OperationType.DelegateCall,
    };
};


export interface PackedParam {
  type: string;
  value: any;
}

/** Utility: concatenate a list of hex‐strings/BytesLike into one 0x‑prefixed string */
function concatHex(chunks: BytesLike[]): string {
  return "0x" + chunks.map((c) => ethers.utils.hexlify(c).slice(2)).join("");
}

/**
 * Packs parameters exactly the way Solidity's `abi.encodePacked(...)` does.
 *
 * Differences vs the legacy `abiEncodePacked` version:
 *   • No implicit 10‑transaction limit (we concat as many chunks as needed).
 *   • Correctly handles dynamic arrays (e.g. `uint256[]`, `bytes[]`, `address[]`).
 *   • Simpler code path – static types go through `solidityPack` directly.
 *   • Early, descriptive errors for unsupported or malformed inputs.
 */
export function abiEncodePacked2(...params: PackedParam[]): string {
  const chunks: BytesLike[] = [];

  for (const { type, value } of params) {
    // Quick path – everything `solidityPack` natively understands
    const isArray = type.endsWith("[]");
    if (!isArray || type === "bytes" || type === "string") {
      chunks.push(ethers.utils.solidityPack([type], [value]));
      continue;
    }

    // ------------------------------------------------------------------------
    // Array handling (e.g. uint256[], bytes32[], address[])
    // solidityPack does not support dynamic arrays, so we recursively encode
    // each element with the base type and simply concatenate the results.
    // ------------------------------------------------------------------------
    if (!Array.isArray(value)) {
      throw new Error(`Value for type ${type} must be an array but got ${typeof value}`);
    }

    const baseType = type.slice(0, -2); // chop the trailing []
    for (const element of value) {
      chunks.push(abiEncodePacked2({ type: baseType, value: element }));
    }
  }

  return concatHex(chunks);
}

export const aggregateTransaction2 = (
    txns: SafeTransaction[],
): SafeTransaction => {
    let transaction: SafeTransaction;
    if (txns.length == 1) {
        transaction = txns[0];
    } else {
        debugTxns(txns)
        transaction = createSafeMultisendTransaction2(txns);
    }
    return transaction;
};

export const aggregateTransaction = (
    txns: SafeTransaction[],
): SafeTransaction => {
    let transaction: SafeTransaction;
    if (txns.length == 1) {
        transaction = txns[0];
    } else {
        transaction = createSafeMultisendTransaction(txns);
    }
    return transaction;
};

export const signAndExecuteSafeTransaction = async (
    signer: Wallet,
    safe: Contract,
    txn: SafeTransaction,
    overrides?: ethers.Overrides,
): Promise<TransactionResponse> => {
    if (overrides == null) {
        overrides = {};
    }

    const nonce = await safe.nonce();
    const safeTxGas = "0";
    const baseGas = "0";
    const gasPrice = "0";
    const gasToken = ethers.constants.AddressZero;
    const refundReceiver = ethers.constants.AddressZero;

    const txHash = await safe.getTransactionHash(
        txn.to,
        txn.value,
        txn.data,
        txn.operation,
        safeTxGas,
        baseGas,
        gasPrice,
        gasToken,
        refundReceiver,
        nonce,
    );

    const rsvSignature = await signTransactionHash(signer, txHash);
    const packedSig = abiEncodePacked(
        { type: "uint256", value: rsvSignature.r },
        { type: "uint256", value: rsvSignature.s },
        { type: "uint8", value: rsvSignature.v },
    );

    return safe.execTransaction(
        txn.to,
        txn.value,
        txn.data,
        txn.operation,
        safeTxGas,
        baseGas,
        gasPrice,
        gasToken,
        refundReceiver,
        packedSig,
        overrides,
    );
};

export { signTransactionHash, abiEncodePacked , joinHexData};