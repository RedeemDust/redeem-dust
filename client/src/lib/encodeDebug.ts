import { ethers } from "ethers";
import { abiEncodePacked2, joinHexData } from "./safehelpers";
import { Interface } from "ethers/lib/utils";
import { multisendAbi } from "./abis";

function safeBig(slice: Uint8Array) {
  // Convert “empty” => 0 so we don’t crash
  return slice.length ? ethers.BigNumber.from(slice) : ethers.constants.Zero;
}

function walkBlob(blob: string) {
  const bytes = ethers.utils.arrayify(blob);
  let i = 0;
  const out: any[] = [];

  while (i < bytes.length) {
    // Guard: abort loop if there isn’t enough data for the fixed-size header
    if (i + 85 > bytes.length) {
      console.error(
        `Truncated header at offset ${i} (blob ends at ${bytes.length})`,
      );
      break;
    }

    const op = bytes[i];
    const to = ethers.utils.hexlify(bytes.slice(i + 1, i + 21));
    const val = safeBig(bytes.slice(i + 21, i + 53));
    const len = safeBig(bytes.slice(i + 53, i + 85)).toNumber();

    // Guard: abort loop if declared len runs past the end
    if (i + 85 + len > bytes.length) {
      console.error(`dataLen (${len}) at offset ${i} overruns blob end`);
      break;
    }

    const data = ethers.utils.hexlify(bytes.slice(i + 85, i + 85 + len));
    out.push({
      i,
      op,
      to,
      val: val.toString(),
      len,
      dataBytes: ethers.utils.hexDataLength(data),
    });
    i += 85 + len;
  }
  return out;
}

/** Call right before you create the Interface.encodeFunctionData(...) */
function debugTxns(txns) {
  const packedArr = txns.map((tx) =>
    abiEncodePacked2(
      { type: "uint8", value: tx.operation },
      { type: "address", value: tx.to },
      { type: "uint256", value: tx.value },
      { type: "uint256", value: ethers.utils.hexDataLength(tx.data) },
      { type: "bytes", value: tx.data },
    ),
  );
  const payload = joinHexData(packedArr);
  console.table(walkBlob(payload));
  console.log("payload bytes =", (payload.length - 2) / 2);
}

export { debugTxns };
