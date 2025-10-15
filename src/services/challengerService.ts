import { Challenger, ChallengerFilters, ChallengerListResponse } from '@/types/challenger';
import { getCookie } from 'cookies-next'
import { API_CONFIG } from '@/config/api'

// Helper function to get authentication token from the session
const getAuthToken = (fallbackToken?: string): string => {
  try {
    // Get the auth session from cookies (same as story service)
    const authSession = getCookie('_DARKONE_AUTH_KEY_')?.toString()

    if (authSession) {
      const userSession = JSON.parse(authSession)
      if (userSession?.token) {
        return userSession.token
      }
    }

    // Fallback to direct token cookie or localStorage
    const directToken = getCookie('token')?.toString()
    return fallbackToken || directToken || localStorage.getItem('authToken') || ''
  } catch (error) {
    console.warn('Failed to get auth token from session:', error)
    const directToken = getCookie('token')?.toString()
    return fallbackToken || directToken || localStorage.getItem('authToken') || ''
  }
}

// Helper function to get auth headers
const getAuthHeaders = (): HeadersInit => {
  const token = getAuthToken()
  return {
    'authorization': token,
    'Content-Type': 'application/json'
  }
}

class ChallengerService {
  // Get all challengers with pagination and filters
  static async getAllChallengers(filters?: ChallengerFilters): Promise<ChallengerListResponse> {
    try {
      // Check if auth token is available
      const token = getAuthToken()
      if (!token) {
        throw new Error('Authentication token not found. Please login again.')
      }

      const queryParams = new URLSearchParams()

      if (filters?.category) queryParams.append('category', filters.category)
      if (filters?.subcategory) queryParams.append('subcategory', filters.subcategory)
      if (filters?.type) queryParams.append('type', filters.type)
      if (filters?.duration) queryParams.append('duration', filters.duration)
      if (filters?.search) queryParams.append('search', filters.search)
      if (filters?.page) queryParams.append('page', filters.page.toString())
      if (filters?.limit) queryParams.append('limit', filters.limit.toString())

      const response = await fetch(`${API_CONFIG.API_URL}/challenger?${queryParams.toString()}`, {
        method: 'GET',
        headers: getAuthHeaders()
      })

      if (!response.ok) {
        throw new Error(`Failed to fetch challengers: ${response.statusText}`)
      }
      return await response.json()
    } catch (error) {
      console.error('Error fetching challengers:', error)
      throw error
    }
  }

  // Get specific challenger by ID
  static async getChallengerById(id: string): Promise<Challenger> {
    try {
      // Check if auth token is available
      const token = getAuthToken()
      if (!token) {
        throw new Error('Authentication token not found. Please login again.')
      }

      const response = await fetch(`${API_CONFIG.API_URL}/challenger/${id}`, {
        method: 'GET',
        headers: getAuthHeaders()
      })

      if (!response.ok) {
        throw new Error(`Failed to fetch challenger: ${response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Error fetching challenger:', error)
      throw error
    }
  }

  // Delete challenger
  static async deleteChallenger(id: string): Promise<void> {
    try {
      // Check if auth token is available
      const token = getAuthToken()
      if (!token) {
        throw new Error('Authentication token not found. Please login again.')
      }

      const response = await fetch(`http://localhost:8080/api/challenger/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      })

      if (!response.ok) {
        throw new Error(`Failed to delete challenger: ${response.statusText}`)
      }
    } catch (error) {
      console.error('Error deleting challenger:', error)
      throw error
    }
  }
}

export default ChallengerService