import HttpClient from '@/helpers/httpClient'

// Define the interface for campaign analytics response
export interface CampaignAnalyticsData {
  success?: boolean
  message?: string
  data?: {
    campaign?: {
      id: number
      campaign_id: string
      title: string
    }
    influencer_count?: number
    posts_by_date_graph_data?: any[]
    total_comments?: string
    total_likes?: string
    total_posts?: string
    total_reshare?: string
    total_views?: string
    avg_er?: number
    avg_reach?: string
  }
  // Legacy fields for backward compatibility
  totalFollowers?: number
  totalEngagement?: number
  totalReach?: number
  totalImpressions?: number
  followers?: number
  engagement?: number
  reach?: number
  impressions?: number
  // Add other fields as needed
  [key: string]: any
}

// Interface for individual influencer data
export interface InfluencerData {
  influencer_id: string
  fullname: string
  platform: string
  handle: string
  is_verified: boolean
  profile_pic_url: string
  total_likes: string
  total_comments: string
  total_views: string
  total_likes_actual: number
  total_comments_actual: number
  total_views_actual: number
  total_reshare_count: string
  total_reshare_count_actual: number
  reach: string
  reach_actual: number
  er: string
  posts: any[]
  audience_data: any
  deliverables: any[]
  average_views: number
  average_likes: number
  average_comments: number
}

// Interface for influencer list response
export interface InfluencerListResponse {
  success: boolean
  data: {
    result: InfluencerData[]
    totalCount: number
    totalPages: number
  }
  message: string
}

/**
 * Service for campaign analytics API calls
 */
export class CampaignAnalyticsService {
  /**
   * Fetch campaign analytics data by campaign ID
   * @param campaignId - The ID of the campaign to analyze
   * @returns Promise with campaign analytics data
   */
  static async getCampaignAnalysis(campaignId: string | number): Promise<CampaignAnalyticsData> {
    try {
      // Note: Since the API is on localhost:8000, we'll use a direct URL
      // If you want to use the configured HttpClient, you'd need to update the base URL
      const response = await fetch(`https://apis.icubeswire.co/api/v1/campaign-analytics/analysis/${campaignId}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error(`API call failed: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error('Error fetching campaign analytics:', error)
      throw error
    }
  }

  /**
   * Alternative method using the configured HttpClient
   * Note: This would require updating the API base URL to point to localhost:8000
   */
  static async getCampaignAnalysisWithHttpClient(campaignId: string | number): Promise<CampaignAnalyticsData> {
    try {
      const response = await HttpClient.get(`/v1/campaign-analytics/analysis/${campaignId}`)
      return response.data
    } catch (error) {
      console.error('Error fetching campaign analytics with HttpClient:', error)
      throw error
    }
  }

  /**
   * Fetch influencer list for a campaign
   * @param campaignId - The ID of the campaign
   * @param page - Page number (default: 1)
   * @param limit - Number of items per page (default: 5)
   * @param sortOrder - Sort order (default: 'desc')
   * @returns Promise with influencer list data
   */
  static async getInfluencerList(
    campaignId: string | number,
    page: number = 1,
    limit: number = 5,
    sortOrder: string = 'desc'
  ): Promise<InfluencerListResponse> {
    try {
      const response = await fetch(
        `https://apis.icubeswire.co/api/v1/campaign-analytics/influencers/list/${campaignId}?page=${page}&limit=${limit}&sort_order=${sortOrder}`,
        {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
        }
      )

      if (!response.ok) {
        throw new Error(`API call failed: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error('Error fetching influencer list:', error)
      throw error
    }
  }
}

export default CampaignAnalyticsService