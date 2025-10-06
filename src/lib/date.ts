/**
 * Date Utility Functions
 * Provides centralized date handling for the Claimservice application
 */

/**
 * Convert HTML date input value (YYYY-MM-DD) to ISO 8601 format
 * @param inputDate - Date string from HTML date input (YYYY-MM-DD)
 * @returns ISO 8601 formatted date string
 */
export function toISOFromInput(inputDate: string): string {
  if (!inputDate) return '';
  
  // HTML date input returns YYYY-MM-DD, convert to ISO 8601
  const date = new Date(inputDate + 'T00:00:00.000Z');
  return date.toISOString();
}

/**
 * Convert ISO 8601 date to HTML date input format (YYYY-MM-DD)
 * @param isoDate - ISO 8601 formatted date string
 * @returns Date string in YYYY-MM-DD format
 */
export function toInputFromISO(isoDate: string): string {
  if (!isoDate) return '';
  
  const date = new Date(isoDate);
  return date.toISOString().split('T')[0];
}

/**
 * Format date for display
 * @param isoDate - ISO 8601 formatted date string
 * @param locale - Locale string (default: 'de-DE')
 * @returns Formatted date string
 */
export function formatDate(isoDate: string, locale: string = 'de-DE'): string {
  if (!isoDate) return '';
  
  const date = new Date(isoDate);
  return date.toLocaleDateString(locale, {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
}

export default {
  toISOFromInput,
  toInputFromISO,
  formatDate
};
