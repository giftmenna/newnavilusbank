/**
 * Formats a number as currency (USD)
 * @param amount The amount to format
 * @returns A string representation of the amount in USD format
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
}
