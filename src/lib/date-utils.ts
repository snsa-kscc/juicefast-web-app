/**
 * Utility functions for date handling
 */

/**
 * Format a date into a consistent string format (YYYY-MM-DD)
 */
export function formatDateKey(date: Date): string {
  return date.toISOString().split('T')[0];
}

/**
 * Get today's date key
 */
export function getTodayKey(): string {
  return formatDateKey(new Date());
}
