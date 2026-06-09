export function getCurrencyRates() {
  // Live rates will be added in Step 9 via an external API
  return { success: true, rates: {} as Record<string, number> }
}