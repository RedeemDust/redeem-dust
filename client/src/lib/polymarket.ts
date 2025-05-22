import { Position } from "./types";

const POSITIONS_ENDPOINT =
  import.meta.env.VITE_POSITIONS_ENDPOINT ||
  "https://data-api.polymarket.com/positions";
const DEFAULT_SIZE_THRESHOLD = Number(
  import.meta.env.VITE_SIZE_THRESHOLD_DEFAULT || 0,
);
const RPC_URL = import.meta.env.VITE_RPC_URL || "";

/**
 * Fetches dust positions for a given Safe address
 * @param safeAddress The Ethereum address of the Safe
 * @param sizeThreshold Minimum size threshold in USDC
 * @returns Array of Position objects
 */
export async function fetchPositions(
  safeAddress: string,
  sizeThreshold: number = DEFAULT_SIZE_THRESHOLD,
): Promise<Position[]> {
  try {
    const url = `${POSITIONS_ENDPOINT}?user=${safeAddress}&sizeThreshold=${sizeThreshold}&redeemable=true&sortBy=CURRENT&sortDirection=DESC&limit=500`;
    console.error("url:", url);
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.error("data:", data);

    // Filter for positions that are:
    // 1. Redeemable
    // 2. Have outcomeBalance < 1e-6 (dust)
    const dustPositions: Position[] = data
      .filter((pos: any) => pos.curPrice == 1)
      .map((pos: any) => ({
        marketId: pos.conditionId,
        marketTitle: pos.title || "Unknown Market",
        quantity: pos.size || 0,
        value: pos.currentValue || 0,
        redeemable: pos.redeemable,
        negRisk: pos.negativeRisk || false,
        outcomeIndex: pos.outcomeIndex ?? 1,
        icon: pos.icon || null,
        outcome: pos.outcome || null,
        endDate: pos.endDate || null,
        slug: pos.slug || null
      }));
    console.error("dustpostions:", dustPositions);

    return dustPositions;
  } catch (error) {
    console.error("Error fetching positions:", error);
    throw new Error("Failed to fetch positions from Polymarket");
  }
}

/**
 * TODO: Build transaction for batch redeeming dust positions
 * This will be implemented later with Safe Core SDK integration
 */
export async function buildBatchRedeemTransaction(
  safeAddress: string,
  positions: Position[],
): Promise<void> {
  // This is just a stub for the MVP
  console.log("Would build batch redeem transaction for:", {
    safeAddress,
    positions,
    rpcUrl: RPC_URL,
  });

  // TODO: Use ethers.js and Safe Core SDK to:
  // 1. Build MultiSend calldata
  // 2. Create Safe transaction
  // 3. Execute transaction
}
