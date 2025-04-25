export type TrophyRating = "bronze" | "silver" | "gold" | "platinum"

export type PlatinaDifficulty = "easy" | "medium" | "hard" | "very-hard"

export interface Author {
  name: string
  avatar?: string
  psnId?: string
  instagram?: string
  twitter?: string
  bio?: string
}

export interface PlatinaGuide {
  difficulty: PlatinaDifficulty
  timeToPlat: string // Ex: "20-30h"
  missableTrophies: boolean
  onlineRequired: boolean
  tips: string
}

export interface AdditionalImage {
  url: string
  caption: string
}

export interface TrophyGuideStep {
  title: string
  description: string
  image?: string
  video?: string
}

export interface Post {
  id: string
  title: string
  slug: string
  content: string
  image: string
  type: "review" | "news" | "guide"
  createdAt: string
  updatedAt: string
  author?: Author
}

export interface Review extends Post {
  type: "review"
  rating: TrophyRating
  gameName: string
  genres: string[]
  tags: string[]
  platinaGuide?: PlatinaGuide
  additionalImages?: AdditionalImage[]
}

export interface News extends Post {
  type: "news"
}

export interface Guide extends Post {
  type: "guide"
  gameName: string
  difficulty: PlatinaDifficulty
  estimatedTime: string
  steps: TrophyGuideStep[]
  tags: string[]
}

export type AllPosts = Review | News | Guide
