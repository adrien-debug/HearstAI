/**
 * Hearst Mining Operations API Configuration Helper
 * Centralizes API URL and authentication token management
 */

export interface HearstApiConfig {
  baseUrl: string
  apiToken: string | undefined
  headers: HeadersInit
}

/**
 * Get Hearst API configuration from environment variables
 * @returns Configuration object with baseUrl, apiToken, and headers
 */
export function getHearstApiConfig(): HearstApiConfig {
  const baseUrl = process.env.HEARST_API_URL || 'https://api.hearstcorporation.io'
  // Try environment variable first, then fallback to hardcoded token if needed
  const apiToken = process.env.HEARST_API_TOKEN || '3L0XE30A8KZ9O0R21CUV5EYJC'

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    'x-api-token': apiToken, // Always include the token
  }

  return {
    baseUrl,
    apiToken,
    headers,
  }
}

/**
 * Check if Hearst API is properly configured
 * @returns true if API token is configured
 */
export function isHearstApiConfigured(): boolean {
  // Check if token exists (either from env or using default)
  const apiToken = process.env.HEARST_API_TOKEN || '3L0XE30A8KZ9O0R21CUV5EYJC'
  return !!apiToken
}

/**
 * Get API token from environment (for logging/debugging purposes only)
 * Never log the full token in production
 */
export function getHearstApiToken(): string | undefined {
  return process.env.HEARST_API_TOKEN
}





