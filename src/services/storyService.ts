import { getCookie } from 'cookies-next'

interface CreateStoryData {
  handle: string
  image: File
  storyLink: string
  views: string
  likes: string
}

interface CreateStoryResponse {
  success: boolean
  data?: any
  message?: string
}

export interface Influencer {
  id: string
  fullName: string
  profilePicUrl: string
  followerCount: number
  gender: string
  engagementRate: number
}

export interface Story {
  _id: string
  handle: string
  storyLink: string
  imageUrl: string
  views: number
  likes: number
  createdAt: string
  updatedAt: string
  __v: number
  influencer: Influencer
  // Additional fields that might be useful for UI
  platform?: string
  type?: 'Photo' | 'Video'
  status?: 'Active' | 'Expired'
}

interface GetStoriesParams {
  page?: number
  limit?: number
}

interface ApiPagination {
  total: number
  currentPage: number
  totalPages: number
  perPage: number
}

interface ApiStats {
  totalViews: number
  totalLikes: number
}

interface ApiStoriesResponse {
  stories: Story[]
  pagination: ApiPagination
  stats: ApiStats
}

interface GetStoriesResponse {
  success: boolean
  data: ApiStoriesResponse
  message?: string
}

// Helper function to get authentication token from the session
const getAuthToken = (fallbackToken?: string): string => {
  try {
    // Get the auth session from cookies
    const authSession = getCookie('_DARKONE_AUTH_KEY_')?.toString()
    
    if (authSession) {
      const userSession = JSON.parse(authSession)
      if (userSession?.token) {
        return userSession.token
      }
    }
    
    // Fallback to provided token or localStorage
    return fallbackToken || localStorage.getItem('authToken') || ''
  } catch (error) {
    console.warn('Failed to get auth token from session:', error)
    return fallbackToken || localStorage.getItem('authToken') || ''
  }
}

export const createStory = async (data: CreateStoryData, authToken?: string): Promise<CreateStoryResponse> => {
  try {
    // Create FormData to match the curl command structure
    const formData = new FormData()
    formData.append('handle', data.handle)
    formData.append('image', data.image)
    formData.append('storyLink', data.storyLink)
    formData.append('views', data.views)
    formData.append('likes', data.likes)

    // Get dynamic auth token from session
    const token = getAuthToken(authToken)
    
    if (!token) {
      throw new Error('Authentication token not found. Please login again.')
    }

    const response = await fetch('http://localhost:8080/api/stories', {
      method: 'POST',
      headers: {
        'authorization': token
      },
      body: formData
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Failed to create story' }))
      throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`)
    }

    const result = await response.json()
    return {
      success: true,
      data: result,
      message: 'Story created successfully'
    }

  } catch (error) {
    console.error('Error creating story:', error)
    
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to create story'
    }
  }
}

// Get stories with pagination support
export const getStories = async (params: GetStoriesParams = {}, authToken?: string): Promise<GetStoriesResponse> => {
  try {
    const token = getAuthToken(authToken)
    
    if (!token) {
      throw new Error('Authentication token not found. Please login again.')
    }
    
    // Build query parameters
    const { page = 1, limit = 10 } = params
    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString()
    })
    
    const response = await fetch(`http://localhost:8080/api/stories?${queryParams}`, {
      method: 'GET',
      headers: {
        'authorization': token
      }
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Failed to fetch stories' }))
      throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`)
    }

    const result = await response.json()
    return {
      success: true,
      data: result,
      message: 'Stories fetched successfully'
    }
  } catch (error) {
    console.error('Error fetching stories:', error)
    return {
      success: false,
      data: {
        stories: [],
        pagination: {
          total: 0,
          currentPage: 1,
          totalPages: 0,
          perPage: 10
        },
        stats: {
          totalViews: 0,
          totalLikes: 0
        }
      },
      message: error instanceof Error ? error.message : 'Failed to fetch stories'
    }
  }
}

export const deleteStory = async (storyId: string, authToken?: string) => {
  try {
    const token = getAuthToken(authToken)
    
    if (!token) {
      throw new Error('Authentication token not found. Please login again.')
    }
    
    const response = await fetch(`http://localhost:8080/api/stories/${storyId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'authorization': token
      }
    })

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    console.error('Error deleting story:', error)
    throw error
  }
}