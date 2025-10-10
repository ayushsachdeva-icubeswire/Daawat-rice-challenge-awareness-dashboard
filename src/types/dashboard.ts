// Types for Dashboard Interactions, Challenges, and Posts
export interface Interaction {
  id: string
  type: 'like' | 'comment' | 'share' | 'view'
  userId: string
  userName: string
  userAvatar: string
  contentId: string
  contentTitle: string
  timestamp: Date
  message?: string
}

export interface Challenge {
  id: string
  title: string
  description: string
  difficulty: 'easy' | 'medium' | 'hard'
  category: string
  points: number
  status: 'not-started' | 'in-progress' | 'completed' | 'failed'
  startDate?: Date
  completionDate?: Date
  participantCount: number
  timeLimit?: number // in minutes
}

export interface Post {
  id: string
  title: string
  content: string
  author: {
    id: string
    name: string
    avatar: string
  }
  category: string
  tags: string[]
  createdAt: Date
  updatedAt?: Date
  likes: number
  comments: number
  shares: number
  views: number
  isPublished: boolean
}

export interface ChatMessage {
  id: string
  senderId: string
  senderName: string
  senderAvatar: string
  message: string
  timestamp: Date
  type: 'interaction' | 'challenge' | 'post'
  relatedItemId: string
  isRead: boolean
}

export interface DashboardStats {
  recentInteractions: number
  challengesTaken: number
  totalPosts: number
  totalInteractions: number
  completedChallenges: number
  publishedPosts: number
}

// Extended CardsType for our new features
export interface ExtendedCardsType {
  title: string
  count: string | number
  icon: string
  series: number[]
  color?: string
  trend?: 'up' | 'down' | 'neutral'
  trendValue?: string
}