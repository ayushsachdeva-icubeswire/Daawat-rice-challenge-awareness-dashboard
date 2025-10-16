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

// Define the dashboard API response interface based on actual API response
export interface PostDataPoint {
  x: number  // timestamp
  y: number | null
}

export interface PostGraphData {
  [key: string]: PostDataPoint[] | number
}

export interface ChallengerGraphData {
  date: string
  Completed: number
  InProgress: number
}

export interface DashboardResponse {
  totalStories: number
  totalViews: number
  totalLikes: number
  postGraphData: PostGraphData
  challengrsGraphData: ChallengerGraphData[]
}

export interface DashboardStats {
  totalStories: number
  totalViews: number
  totalLikes: number
  postGraphData: PostGraphData
  challengrsGraphData: ChallengerGraphData[]
}

class DashboardService {
  private static instance: DashboardService
  // Default fallback token for development - can be overridden by dynamic auth
  private fallbackToken: string = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4ZThkMjQxYzkyMWE5ZDEzMzhmNGMwMyIsImlhdCI6MTc2MDQyMzkyMiwiZXhwIjoxNzYwNTEwMzIyfQ.jpyOCiQ_lunYouOyLSOXTWOJ3pDfWGg0JKxd9Rgparo'

  public static getInstance(): DashboardService {
    if (!DashboardService.instance) {
      DashboardService.instance = new DashboardService()
    }
    return DashboardService.instance
  }

  /**
   * Get dashboard statistics and data
   */
  async getDashboardData(): Promise<DashboardResponse> {
    try {
      // Get dynamic auth token from session
      const token = getAuthToken(this.fallbackToken)
      
      if (!token) {
        console.warn('Authentication token not found, using mock data.')
        return this.getMockDashboardData()
      }

      const response = await fetch(`${API_CONFIG.API_URL}/dashboard`, {
        method: 'GET',
        headers: {
          'authorization': token,
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Failed to fetch dashboard data' }))
        
        // If it's an authentication error, provide mock data for development
        if (response.status === 401 || errorData.message === 'Unauthorized!') {
          console.warn('Using mock data due to authentication failure. Please check your token.')
          return this.getMockDashboardData()
        }
        
        throw new Error(errorData.message || `HTTP ${response.status}: Failed to fetch dashboard data`)
      }

      const data = await response.json()
      return data
    } catch (error: any) {
      console.error('Dashboard API Error:', error)
      
      // Fallback to mock data for network errors
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        console.warn('Network error detected, using mock data.')
        return this.getMockDashboardData()
      }
      
      throw new Error(
        error.message || 
        'Failed to fetch dashboard data'
      )
    }
  }

  /**
   * Get mock dashboard data for development/fallback
   */
  private getMockDashboardData(): DashboardResponse {
    return {
      totalStories: 25,
      totalViews: 15000,
      totalLikes: 12500,
      challengrsGraphData: [
        {
          "date": "2025-10-13T00:00:00.000Z",
          "Completed": 0,
          "InProgress": 1
        },
        {
          "date": "2025-10-16T00:00:00.000Z",
          "Completed": 0,
          "InProgress": 2
        }
      ],
      postGraphData: {
        itchotels: [
          { x: 1704240000000, y: 2 },
          { x: 1707350400000, y: 3 },
          { x: 1708560000000, y: 4 },
          { x: 1709942400000, y: 5 },
          { x: 1718323200000, y: 3 },
          { x: 1724198400000, y: 6 },
          { x: 1732060800000, y: 4 },
          { x: 1737936000000, y: 7 },
          { x: 1747958400000, y: 5 },
          { x: 1755561600000, y: 8 },
          { x: 1757635200000, y: 6 },
          { x: 1758240000000, y: 9 }
        ],
        itchotels_count: 25
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

export default DashboardService.getInstance()