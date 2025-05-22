// Fee calculation constants
export const FEE_PERCENTAGE = 0.025; // 2.5%
export const MIN_FEE = 0.05; // 0.05 USDC
export const MAX_FEE = 1.0; // 1.0 USDC

/**
 * Calculate the service fee based on the total USDC amount
 * @param totalAmount The total amount of USDC to redeem
 * @returns The calculated fee (2.5%, minimum 0.05 USDC, maximum 1 USDC)
 */
export function calculateFee(totalAmount: number): number {
  const calculatedFee = totalAmount * FEE_PERCENTAGE;
  
  if (calculatedFee < MIN_FEE) {
    return MIN_FEE;
  }
  
  if (calculatedFee > MAX_FEE) {
    return MAX_FEE;
  }
  
  return calculatedFee;
}

/**
 * Format number to USDC display format (6 decimals with rounding)
 * @param value The number to format
 * @returns Formatted string with 6 decimal places and USDC suffix
 */
export function formatUSDC(value: number): string {
  return `${value.toFixed(6)} USDC`;
}

/**
 * Format number to USDC display format for summary
 * @param value The number to format
 * @returns Formatted string with 6 decimal places and USDC suffix
 */
export function formatUSDCSummary(value: number): string {
  return `${value.toFixed(6)} USDC`;
}