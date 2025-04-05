/**
 * Formats a date to a readable string format
 * @param date The date to format
 * @returns A string representation of the date in the format "Month DD, YYYY - HH:MM AM/PM"
 */
export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  }).format(date);
}

/**
 * Formats a date to a short string format
 * @param date The date to format
 * @returns A string representation of the date in the format "MM/DD/YYYY"
 */
export function formatShortDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric'
  }).format(date);
}

/**
 * Formats a date to an ISO string format (YYYY-MM-DD)
 * @param date The date to format
 * @returns A string representation of the date in the format "YYYY-MM-DD"
 */
export function formatISODate(date: Date): string {
  return date.toISOString().split('T')[0];
}

/**
 * Gets the relative time from now (e.g., "2 hours ago", "yesterday")
 * @param date The date to get relative time from
 * @returns A string representation of the relative time
 */
export function getRelativeTime(date: Date): string {
  const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  // Less than a minute
  if (diffInSeconds < 60) {
    return rtf.format(-Math.floor(diffInSeconds), 'second');
  }
  
  // Less than an hour
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return rtf.format(-diffInMinutes, 'minute');
  }
  
  // Less than a day
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return rtf.format(-diffInHours, 'hour');
  }
  
  // Less than a week
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return rtf.format(-diffInDays, 'day');
  }
  
  // Less than a month
  const diffInWeeks = Math.floor(diffInDays / 7);
  if (diffInWeeks < 4) {
    return rtf.format(-diffInWeeks, 'week');
  }
  
  // Less than a year
  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) {
    return rtf.format(-diffInMonths, 'month');
  }
  
  // More than a year
  const diffInYears = Math.floor(diffInDays / 365);
  return rtf.format(-diffInYears, 'year');
}
