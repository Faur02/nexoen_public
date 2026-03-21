/**
 * Calculate cost for a specific consumption amount
 */
export function calculateCostForConsumption(
  consumption: number,
  arbeitspreis: number,
  grundpreis: number,
  months: number = 1
): number {
  const energyCost = consumption * arbeitspreis;
  const baseCost = grundpreis * months;
  return energyCost + baseCost;
}

/**
 * Format currency for German locale
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
  }).format(amount);
}

/**
 * Format number for German locale
 */
export function formatNumber(value: number, decimals: number = 2): string {
  return new Intl.NumberFormat('de-DE', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}
