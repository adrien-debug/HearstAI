/**
 * Date formatting utilities that prevent hydration errors
 * by using consistent locale formatting
 */

/**
 * Format a date string to a consistent format (MM/DD/YYYY)
 * This prevents hydration errors by using a fixed locale
 */
export function formatDate(dateString, options = {}) {
  if (!dateString) return '-';
  
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '-';
  
  const defaultOptions = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    ...options
  };
  
  return date.toLocaleDateString('en-US', defaultOptions);
}

/**
 * Format a date string to a short format (MMM DD, YYYY)
 */
export function formatDateShort(dateString) {
  if (!dateString) return '-';
  
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '-';
  
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
}

/**
 * Format a date string with time (MMM DD, HH:MM)
 */
export function formatDateTime(dateString) {
  if (!dateString) return '-';
  
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '-';
  
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

/**
 * Format a date string with time and seconds (MMM DD, HH:MM:SS)
 */
export function formatDateTimeWithSeconds(dateString) {
  if (!dateString) return '-';
  
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '-';
  
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
}

/**
 * Format a date string to a compact format (MMM DD)
 */
export function formatDateCompact(dateString) {
  if (!dateString) return '-';
  
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '-';
  
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric'
  });
}

