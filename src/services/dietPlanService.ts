import { DietPlan, DietPlanFormData, DietPlanListResponse, DietPlanFilters } from '@/types/diet-plan'
import { getCookie } from 'cookies-next'
import { API_CONFIG } from '@/config/api'

const BASE_URL = API_CONFIG.API_URL

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

// Helper function to get auth headers for file upload
const getAuthHeadersForUpload = (): HeadersInit => {
  const token = getAuthToken()
  return {
    'authorization': token
    // Don't set Content-Type for FormData, let browser set it
  }
}

class DietPlanService {
  // Get all diet plans with pagination and filters
  static async getAllDietPlans(filters?: DietPlanFilters): Promise<DietPlanListResponse> {
    try {
      // Check if auth token is available
      const token = getAuthToken()
      if (!token) {
        throw new Error('Authentication token not found. Please login again.')
      }

      const queryParams = new URLSearchParams()
      
      if (filters?.category) queryParams.append('category', filters.category)
      if (filters?.subcategory) queryParams.append('subcategory', filters.subcategory)
      if (filters?.isActive !== undefined) queryParams.append('isActive', filters.isActive.toString())
      if (filters?.page) queryParams.append('page', filters.page.toString())
      if (filters?.limit) queryParams.append('limit', filters.limit.toString())

      const response = await fetch(`${BASE_URL}/dietplans?${queryParams.toString()}`, {
        method: 'GET',
        headers: getAuthHeaders()
      })

      if (!response.ok) {
        throw new Error(`Failed to fetch diet plans: ${response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Error fetching diet plans:', error)
      throw error
    }
  }

  // Get specific diet plan by ID
  static async getDietPlanById(id: string): Promise<DietPlan> {
    try {
      // Check if auth token is available
      const token = getAuthToken()
      if (!token) {
        throw new Error('Authentication token not found. Please login again.')
      }

      const response = await fetch(`${BASE_URL}/dietplans/${id}`, {
        method: 'GET',
        headers: getAuthHeaders()
      })

      if (!response.ok) {
        throw new Error(`Failed to fetch diet plan: ${response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Error fetching diet plan:', error)
      throw error
    }
  }

  // Create new diet plan with PDF upload
  static async createDietPlan(data: DietPlanFormData): Promise<DietPlan> {
    try {
      // Check if auth token is available
      const token = getAuthToken()
      if (!token) {
        throw new Error('Authentication token not found. Please login again.')
      }

      const formData = new FormData()
      formData.append('name', data.name)
      formData.append('duration', data.duration)
      formData.append('category', data.category)
      formData.append('isActive', data.isActive.toString())
      
      if (data.subcategory) {
        formData.append('subcategory', data.subcategory)
      }
      
      if (data.description) {
        formData.append('description', data.description)
      }
      
      if (data.pdfFile) {
        formData.append('pdfFile', data.pdfFile)
      }

      const response = await fetch(`${BASE_URL}/dietplans`, {
        method: 'POST',
        headers: getAuthHeadersForUpload(),
        body: formData
      })

      if (!response.ok) {
        throw new Error(`Failed to create diet plan: ${response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Error creating diet plan:', error)
      throw error
    }
  }

  // Update existing diet plan
  static async updateDietPlan(id: string, data: DietPlanFormData): Promise<DietPlan> {
    try {
      // Check if auth token is available
      const token = getAuthToken()
      if (!token) {
        throw new Error('Authentication token not found. Please login again.')
      }

      const formData = new FormData()
      formData.append('name', data.name)
      formData.append('duration', data.duration)
      formData.append('category', data.category)
      formData.append('isActive', data.isActive.toString())
      
      if (data.subcategory) {
        formData.append('subcategory', data.subcategory)
      }
      
      if (data.description) {
        formData.append('description', data.description)
      }
      
      if (data.pdfFile) {
        formData.append('pdfFile', data.pdfFile)
      }

      const response = await fetch(`${BASE_URL}/dietplans/${id}`, {
        method: 'PUT',
        headers: getAuthHeadersForUpload(),
        body: formData
      })

      if (!response.ok) {
        throw new Error(`Failed to update diet plan: ${response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Error updating diet plan:', error)
      throw error
    }
  }

  // Delete diet plan
  static async deleteDietPlan(id: string): Promise<void> {
    try {
      // Check if auth token is available
      const token = getAuthToken()
      if (!token) {
        throw new Error('Authentication token not found. Please login again.')
      }

      const response = await fetch(`${BASE_URL}/dietplans/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      })

      if (!response.ok) {
        throw new Error(`Failed to delete diet plan: ${response.statusText}`)
      }
    } catch (error) {
      console.error('Error deleting diet plan:', error)
      throw error
    }
  }

  // Delete all diet plans
  static async deleteAllDietPlans(): Promise<void> {
    try {
      // Check if auth token is available
      const token = getAuthToken()
      if (!token) {
        throw new Error('Authentication token not found. Please login again.')
      }

      const response = await fetch(`${BASE_URL}/dietplans`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      })

      if (!response.ok) {
        throw new Error(`Failed to delete all diet plans: ${response.statusText}`)
      }
    } catch (error) {
      console.error('Error deleting all diet plans:', error)
      throw error
    }
  }

  // Download PDF file
  static async downloadPDF(id: string): Promise<Blob> {
    try {
      // Check if auth token is available
      const token = getAuthToken()
      if (!token) {
        throw new Error('Authentication token not found. Please login again.')
      }

      const response = await fetch(`${BASE_URL}/dietplans/${id}/download`, {
        method: 'GET',
        headers: {
          'authorization': token
        }
      })

      if (!response.ok) {
        throw new Error(`Failed to download PDF: ${response.statusText}`)
      }

      return await response.blob()
    } catch (error) {
      console.error('Error downloading PDF:', error)
      throw error
    }
  }

  // Helper function to trigger PDF download in browser
  static triggerPDFDownload(blob: Blob, filename: string): void {
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
  }
}

export default DietPlanService