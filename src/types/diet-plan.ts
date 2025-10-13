// Diet Plan Types and Interfaces
export interface DietPlan {
  _id?: string
  name: string
  duration: string // e.g., "7 days", "1 month"
  type: string // e.g., "Weight Loss", "Muscle Building"
  category: string // e.g., "Vegetarian", "Keto", "High Protein"
  subcategory?: string // e.g., "Beginner", "Advanced", "Low Sodium"
  pdfFile?: {
    filename: string
    path: string
    size: number
  }
  description?: string
  isActive: boolean
  createdBy: string // User who created it (from JWT)
  createdAt?: string
  updatedAt?: string
}

export interface DietPlanFormData {
  name: string
  duration: string
  type: string
  category: string
  subcategory?: string
  description?: string
  isActive: boolean
  pdfFile?: File
}

export interface DietPlanListResponse {
  dietPlans: DietPlan[]
  pagination?: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export interface DietPlanFilters {
  category?: string
  subcategory?: string
  type?: string
  isActive?: boolean
  page?: number
  limit?: number
}

// Common diet plan categories and types
export const DIET_CATEGORIES = [
  'Vegetarian',
  'Vegan',
  'Keto',
  'High Protein',
  'Low Carb',
  'Mediterranean',
  'Paleo',
  'Intermittent Fasting'
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
  '1 month',
  '2 months',
  '3 months',
  '6 months'
] as const

export const DIET_SUBCATEGORIES = [
  'Beginner',
  'Intermediate',
  'Advanced',
  'Low Sodium',
  'High Fiber',
  'Gluten Free',
  'Dairy Free',
  'Low Sugar',
  'Heart Healthy',
  'Anti-Inflammatory',
  'Quick Prep',
  'Budget Friendly'
] as const

export type DietCategory = typeof DIET_CATEGORIES[number]
export type DietType = typeof DIET_TYPES[number]
export type DietSubcategory = typeof DIET_SUBCATEGORIES[number]
export type DurationOption = typeof DURATION_OPTIONS[number]