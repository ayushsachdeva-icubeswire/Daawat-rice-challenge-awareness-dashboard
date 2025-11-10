// Diet Plan Types and Interfaces
export interface Challenger {
  _id?: string
  name: string
  mobile: string
  duration: string // e.g., "7 days", "1 month"
  type: string // e.g., "Weight Loss", "Muscle Building"
  category: string // e.g., "Vegetarian", "Keto", "High Protein"
  subcategory?: string // e.g., "Beginner", "Advanced", "Low Sodium"
  pdf: string
  isActive: boolean
  createdAt?: string
  updatedAt?: string
}

export interface ChallengerListResponse {
  data: Challenger[]
  currentPage: number
  totalPages: number
  totalItems: number
  actualCount: number
  overview?: { _id: string; count: number }[]
}

export interface ChallengerFilters {
  category?: string
  subcategory?: string
  duration?: string
  type?: string
  search?: string
  page?: number
  limit?: number
  utm_url?: string
  from?: string
  to?: string
}