export interface PostInteractionOwner {
  username: string
  profile_pic_url: string
  is_verified: boolean
  gender: string | null
  predicted_age_range: string
  calculated_age_range: string
  is_organic: boolean
  profile_type?: string
}

export interface PostInteractionLocation {
  country: string | null
  state: string | null
  city: string | null
  display_name?: string
  postcode?: string
}

export interface PostInteraction {
  _id: string
  comment_id: string
  comment_text: string
  influencer_id: string
  is_organic: boolean
  language: string | null
  platform: string
  post_id: string
  sentiment: string
  location?: PostInteractionLocation
  owner: PostInteractionOwner
  total_comments: number
  total_likes: number
  created_timestamp: number
  created_at: string
  updated_at: string
  _class: string
}

export interface PostInteractionsResponse {
  success: boolean
  data: {
    intractions: PostInteraction[]
  }
  message: string
}