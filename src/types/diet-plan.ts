// Diet Plan Types and Interfaces
export interface DietPlan {
  _id?: string
  name: string
  duration: string // e.g., "7 days", "1 month"
  category: string // e.g., "Vegetarian", "Keto", "High Protein"
  subcategory?: string // e.g., "Beginner", "Advanced", "Low Sodium"
  pdfFile?: {
    filename: string
    originalName: string
    path: string
    size: number
    uploadDate: string
  }
  description?: string
  isActive: boolean
  createdBy: {
    _id: string
    username: string
    email: string
  } // User who created it (from JWT)
  createdAt?: string
  updatedAt?: string
}

export interface DietPlanFormData {
  name: string
  duration: string
  category: string
  subcategory?: string
  description?: string
  isActive: boolean
  pdfFile?: File
}

export interface DietPlanListResponse {
  data: DietPlan[]
  currentPage: number
  totalPages: number
  totalItems: number
}

export interface DietPlanFilters {
  category?: string
  subcategory?: string
  isActive?: boolean
  page?: number
  limit?: number
}

// Common diet plan categories and types
export const DIET_CATEGORIES = [
  'Vegetarian',
  'Veg + Egg',
  'Veg + Meat',
] as const

export const DIET_TYPES = [
  'Weight Loss',
  'Weight Gain',
  'Muscle Building',
  'Maintenance',
  'Athletic Performance',
  'General Health'
] as const

export const DURATION_OPTIONS = [
  '7 days',
  '14 days',
  '21 days',
  '30 days',
 
] as const

export const DIET_SUBCATEGORIES = [
  'Weight Loss Meal Plan',
  'High Protein Meal Plan',
  'North Indian Meal Plan',
  'South Indian Meal Plan',
  'Asian Meal Plan',
  'Fusion Meal Plan',
  'Maharashtra Meal Plan',
  'Sattvikk Meal Plan'
] as const

export type DietCategory = typeof DIET_CATEGORIES[number]
export type DietType = typeof DIET_TYPES[number]
export type DietSubcategory = typeof DIET_SUBCATEGORIES[number]
export type DurationOption = typeof DURATION_OPTIONS[number]