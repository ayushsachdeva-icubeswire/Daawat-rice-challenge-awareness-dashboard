import { getCookie } from 'cookies-next'
import { API_CONFIG } from '@/config/api'

// Helper function to get authentication token from the session
const getAuthToken = (fallbackToken?: string): string => {
  try {
    // Get the auth session from cookies (same as other services)
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

// Define the progress API response interface based on actual API response
export interface ProgressData {
  _id: string
  name: string
  currentValue: number
  previousValue: number
  manualEntries: number
  difference: number
  createdAt: string
  updatedAt: string
  __v: number
}

export interface ProgressResponse {
  data: {
    erProgress: ProgressData      // engagement/interactions progress
    challengerProgress: ProgressData  // challenger progress
  }
}

class ProgressService {
  private static instance: ProgressService
  // Default fallback token for development - can be overridden by dynamic auth
  private fallbackToken: string = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4ZThkMjQxYzkyMWE5ZDEzMzhmNGMwMyIsImlhdCI6MTc2MDU5NDU5MiwiZXhwIjoxNzYwNjgwOTkyfQ.9ttWBQlQj6pDY-9mJp4gwGdvHbFJlGzWciWAnHPxzls'

  public static getInstance(): ProgressService {
    if (!ProgressService.instance) {
      ProgressService.instance = new ProgressService()
    }
    return ProgressService.instance
  }

  /**
   * Get challenger progress data
   */
  async getChallengerProgress(): Promise<ProgressResponse> {
    try {
      // Get dynamic auth token from session
      const token = getAuthToken(this.fallbackToken)
      
      if (!token) {
        console.warn('Authentication token not found, using mock data.')
        return this.getMockProgressData()
      }

      const response = await fetch(`${API_CONFIG.BASE_URL}/challenger/progress`, {
        method: 'GET',
        headers: {
          'authorization': token,
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Failed to fetch progress data' }))
        
        // If it's an authentication error, provide mock data for development
        if (response.status === 401 || errorData.message === 'Unauthorized!') {
          console.warn('Using mock data due to authentication failure. Please check your token.')
          return this.getMockProgressData()
        }
        
        throw new Error(errorData.message || `HTTP ${response.status}: Failed to fetch progress data`)
      }

      const data = await response.json()
      return data
    } catch (error: any) {
      console.error('Progress API Error:', error)
      
      // Fallback to mock data for network errors
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        console.warn('Network error detected, using mock data.')
        return this.getMockProgressData()
      }
      
      throw new Error(
        error.message || 
        'Failed to fetch progress data'
      )
    }
  }

  /**
   * Get mock progress data for development/fallback
   */
  private getMockProgressData(): ProgressResponse {
    return {
      data: {
        erProgress: {
          _id: "68f09870df697dec080d18fa",
          name: "engagement",
          currentValue: 483408,
          previousValue: 483398,
          manualEntries: 10,
          difference: 10,
          createdAt: "2025-10-16T07:02:08.496Z",
          updatedAt: "2025-10-16T07:02:08.496Z",
          __v: 0
        },
        challengerProgress: {
          _id: "68f0c1e2f4275b75860cbf9e",
          name: "challenge",
          currentValue: 3,
          previousValue: 2,
          manualEntries: 0,
          difference: 1,
          createdAt: "2025-10-16T09:58:58.000Z",
          updatedAt: "2025-10-16T09:58:58.000Z",
          __v: 0
        }
      }
    }
  }

  /**
   * Update the fallback authorization token
   */
  setAuthToken(token: string): void {
    this.fallbackToken = token
  }

  /**
   * Get current authorization token (dynamically resolved)
   */
  getAuthToken(): string {
    return getAuthToken(this.fallbackToken)
  }
}

export default ProgressService.getInstance()