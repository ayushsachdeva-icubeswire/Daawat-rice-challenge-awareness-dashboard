// API Configuration
// This file centralizes all API-related configuration

// Environment variables with fallback defaults
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'
const API_VERSION = import.meta.env.VITE_API_VERSION || 'api'

// Construct the full API URL
export const API_CONFIG = {
  BASE_URL: API_BASE_URL,
  API_URL: `${API_BASE_URL}/${API_VERSION}`,
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