/**
 * Utility functions for handling environment-specific configuration
 */

/**
 * Get the base URL depending on environment (development or production)
 */
export function getBaseUrl() {
  // When in browser, use relative path
  if (typeof window !== 'undefined') {
    return '';
  }
  
  // When in development on server-side
  if (process.env.NODE_ENV === 'development') {
    return 'http://localhost:3000';
  }
  
  // When in production on server-side (Vercel)
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  // Fallback
  return process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
}

/**
 * Create an absolute URL from a path
 */
export function createUrl(path: string) {
  const baseUrl = getBaseUrl();
  return `${baseUrl}${path}`;
}

/**
 * Check if running in production environment
 */
export function isProduction() {
  return process.env.NODE_ENV === 'production';
} 