// API Configuration
// This file centralizes all API-related configuration

// Determine base URL based on environment
const getBaseUrl = (): string => {
  if (typeof window !== 'undefined' && window.location.href.includes('localhost:5173')) {
    return 'http://localhost:8080'
  } else if(window !== undefined && window.location.href.includes('daawat.com')) {
    return 'https://daawat.com'
  }
   else {
    return 'http://13.201.26.193'
  }
}

const API_BASE_URL = getBaseUrl()
const API_VERSION = import.meta.env.VITE_API_VERSION || 'api'

// Campaign Analytics API runs on a different port
const getCampaignAnalyticsBaseUrl = (): string => {
  if (typeof window !== 'undefined' && window.location.href.includes('localhost:5173')) {
    return 'http://127.0.0.1:8000'
  } else {
    // You can update this for production environment
    return 'http://127.0.0.1:8000'
  }
}

// Construct the full API URL
export const API_CONFIG = {
  BASE_URL: API_BASE_URL,
  API_URL: `${API_BASE_URL}/${API_VERSION}`,
  CAMPAIGN_ANALYTICS_BASE_URL: getCampaignAnalyticsBaseUrl(),
  CAMPAIGN_ANALYTICS_API_URL: `${getCampaignAnalyticsBaseUrl()}/api/v1`,
  ENDPOINTS: {
    AUTH: {
      LOGIN: '/auth/login',
      LOGOUT: '/auth/logout',
      REGISTER: '/auth/register',
    },
    // Add other endpoint categories here as needed
  }
} as const

// For backward compatibility and convenience
export const { API_URL, BASE_URL } = API_CONFIG

// Default export
export default API_CONFIG