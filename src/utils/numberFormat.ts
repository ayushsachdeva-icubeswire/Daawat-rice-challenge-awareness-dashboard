/**
 * Utility functions for formatting numbers
 */

/**
 * Format numbers with K, M, B abbreviations
 * @param num - The number to format
 * @returns Formatted string with appropriate suffix
 */
export const formatNumber = (num: number): string => {
  if (num >= 1000000000) {
    return (num / 1000000000).toFixed(1) + 'B'
  } else if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M'
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K'
  }
  return num.toString()
}

/**
 * Format numbers with commas for readability (alternative to toLocaleString)
 * @param num - The number to format
 * @returns Formatted string with commas
 */
export const formatNumberWithCommas = (num: number): string => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

/**
 * Format percentage with fixed decimal places
 * @param num - The number to format as percentage
 * @param decimals - Number of decimal places (default: 1)
 * @returns Formatted percentage string
 */
export const formatPercentage = (num: number, decimals: number = 1): string => {
  return (num * 100).toFixed(decimals) + '%'
}