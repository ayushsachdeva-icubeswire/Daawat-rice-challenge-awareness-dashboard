// Campaign Contents Service for Hashtag Performance
// This service handles all API calls related to campaign contents and hashtag data

// Interface for Instagram profile data
export interface InstagramProfile {
  influencer_type: {
    category: string
    type: string
  }
  handle: string
  is_private: boolean
  profile_pic_url: string
  is_verified: boolean
  media_count: number
  follower_count: string
  following_count: string
  follower_count_actual: number
  following_count_actual: number
  biography: string
  external_url?: string
  engagement_ratio: number
  average_likes: number
  average_comments: number
  average_reach: number
  gender?: string
  language?: string
}

// Interface for influencer data
export interface Influencer {
  _id: {
    $oid: string
  }
  first_name: string
  last_name: string
  full_name: string
  profile_pic_url?: string
  username?: string
  handle: string
  platform: string
  phone?: string
  email?: string
  created_by: number
  role_id: number
  categories: string[]
  instagram?: InstagramProfile
  is_iq: boolean
}

// Interface for location data
export interface Location {
  pk?: number
  name?: string
  address?: string
  city?: string
  state?: string
  country?: string
  lng?: number
  lat?: number
}

// Interface for individual post data
export interface PostData {
  _id: string
  post_shortcode: string
  influencer_id: string
  display_url: string
  video_url?: string
  is_video: boolean
  is_carousel: boolean
  caption: { [key: string]: { text: string } }
  total_comments: number
  total_likes: number
  video_duration?: number
  total_views: number
  total_play?: number
  total_followers: number
  is_pinned: boolean
  er: number
  reach: number
  created_timestamp: number
  created_timestamp_formatted: string
  created_date?: {
    $date: {
      $numberLong: string
    }
  }
  updated_at: string
  negative_content: any
  reshare_count: number | null
  ig_post_id: string | number
  location: any[]
  usertags: any[]
  hashtags: string[]
  offer_id: number
  content_id: number
  created_at: string
  is_paid_partnership: boolean
  sponsor_tags?: any[]
  influencer_id_object: string
  influencer: Influencer
  like_and_view_counts_disabled?: boolean
}

// Interface for aggregated campaign content analytics
export interface CampaignContent {
  hashtag: string
  platform: string
  posts: number
  reach: number
  engagement: number
  impressions: number
  trending: boolean
  totalLikes: number
  totalComments: number
  totalShares: number
  totalPlays: number
  avgEngagementRate: number
  topInfluencers: Influencer[]
  recentPosts: PostData[]
}

export interface CampaignContentsResponse {
  success: boolean
  data: {
    posts: PostData[]
    total_count: number
    total_pages: number
  }
  message: string
}

// Interface for distribution data
export interface DistributionItem {
  name: string
  count: number
  percentage: number
}

// Interface for campaign analysis data
export interface CampaignAnalysisData {
  total_followers: number
  total_plays: number
  avg_likes: number
  avg_er: number
  total_engagements: number
  influencer_count: number
  post_count: number
  gender_distribution: DistributionItem[]
  er_distribution: DistributionItem[]
  category_distribution: DistributionItem[]
}

// Interface for campaign analysis response
export interface CampaignAnalysisResponse {
  success: boolean
  data: CampaignAnalysisData
  message: string
}

/**
 * Helper function to process posts data into analytics
 */
export const processPostsIntoAnalytics = (posts: PostData[], hashtag: string): CampaignContent => {
  const totalPosts = posts.length
  const totalLikes = posts.reduce((sum, post) => sum + post.total_likes, 0)
  const totalComments = posts.reduce((sum, post) => sum + post.total_comments, 0)
  const totalShares = posts.reduce((sum, post) => sum + (post.reshare_count || 0), 0)
  const totalPlays = posts.reduce((sum, post) => sum + (post.total_play || 0), 0)
  const totalReach = posts.reduce((sum, post) => sum + post.reach, 0)
  
  // Calculate engagement (likes + comments + shares)
  const totalEngagement = totalLikes + totalComments + totalShares
  
  // Calculate average engagement rate (engagement per post)
  const avgEngagementRate = totalPosts > 0 ? (totalEngagement / totalPosts) : 0
  
  // Get unique influencers
  const influencerMap = new Map<string, Influencer>()
  posts.forEach(post => {
    const influencerId = post.influencer._id?.$oid || post.influencer_id
    if (!influencerMap.has(influencerId)) {
      influencerMap.set(influencerId, post.influencer)
    }
  })
  
  // Sort influencers by their total engagement
  const topInfluencers = Array.from(influencerMap.values()).slice(0, 5)
  
  // Get all posts (for detailed view) and recent posts (for summary)
  const recentPosts = posts // Return all posts for the detailed table
  
  // Determine platform (Instagram is most common, but we can infer from data)
  const platform = 'Instagram' // Since all posts seem to be Instagram posts
  
  // Determine if trending (based on recent activity and engagement)
  const recentEngagementRate = recentPosts.length > 0 
    ? recentPosts.reduce((sum, post) => sum + post.total_likes + post.total_comments, 0) / recentPosts.length
    : 0
  const trending = recentEngagementRate > avgEngagementRate * 1.2 || totalPosts > 20
  
  return {
    hashtag: `#${hashtag}`,
    platform,
    posts: totalPosts,
    reach: totalReach,
    engagement: totalEngagement,
    impressions: totalPlays + totalReach, // Approximate impressions
    trending,
    totalLikes,
    totalComments,
    totalShares,
    totalPlays,
    avgEngagementRate,
    topInfluencers,
    recentPosts
  }
}

/**
 * Service for campaign contents API calls
 */
export class CampaignContentsService {
  /**
   * Fetch campaign contents by hashtag
   * @param hashtag - The hashtag to search for (default: 'daawatbiryani')
   * @param page - Page number (default: 1)
   * @param limit - Number of items per page (default: 8)
   * @returns Promise with campaign contents data
   */
  static async getCampaignContents(
    hashtag: string = 'onlyricenovember',
    page: number = 1,
    limit: number = 8
  ): Promise<CampaignContentsResponse> {
    try {
      const response = await fetch(
        `https://apis.icubeswire.co/api/v1/campaign-contents?page=${page}&limit=${limit}&hashtags[0]=${hashtag}`,
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
      console.error('Error fetching campaign contents:', error)
      throw error
    }
  }

  /**
   * Get multiple hashtags performance data
   * @param hashtags - Array of hashtags to search for
   * @param page - Page number (default: 1)
   * @param limit - Number of items per page (default: 8)
   * @returns Promise with campaign contents data for multiple hashtags
   */
  static async getMultipleHashtagsPerformance(
    hashtags: string[] = ['onlyricenovember', 'RiceYourAwareness', 'OnlyDaawatNovember'],
    page: number = 1,
    limit: number = 8
  ): Promise<CampaignContentsResponse> {
    try {
      const hashtagParams = hashtags.map((tag, index) => `hashtags[${index}]=${tag}`).join('&')
      const response = await fetch(
        `https://apis.icubeswire.co/api/v1/campaign-contents?page=${page}&limit=${limit}&${hashtagParams}`,
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
      console.error('Error fetching multiple hashtags performance:', error)
      throw error
    }
  }

  /**
   * Get campaign analysis data
   * @param hashtag - The hashtag to analyze (default: 'daawatbiryani')
   * @returns Promise with campaign analysis data
   */
  static async getCampaignAnalysis(
    hashtag: string = 'onlyricenovember'
  ): Promise<CampaignAnalysisResponse> {
    try {
      const response = await fetch(
        `https://apis.icubeswire.co/api/v1/campaign-contents/analysis?hashtags[0]=${hashtag}`,
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

      const analysisData = await response.json()
      
      // The API returns data directly, so we need to wrap it in the expected format
      return {
        success: true,
        data: analysisData,
        message: 'Campaign analysis data retrieved successfully'
      }
    } catch (error) {
      console.error('Error fetching campaign analysis:', error)
      throw error
    }
  }
}

export default CampaignContentsService