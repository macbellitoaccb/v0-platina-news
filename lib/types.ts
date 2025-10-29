export type TrophyRating = "bronze" | "silver" | "gold" | "platinum"

export type PlatinaDifficulty =
  | "1"
  | "2" // Fácil
  | "3"
  | "4" // Média
  | "5"
  | "6" // Difícil
  | "7"
  | "8" // Hardcore
  | "9"
  | "10" // Insano

export interface Author {
  id?: string
  name: string
  avatar?: string
  psnId?: string
  instagram?: string
  twitter?: string
  bio?: string
  user_id?: string | null // Link para auth.users.id
  role?: "admin" | "author" // Role do autor
  created_at?: string
  updated_at?: string
}

export interface PlatinaGuide {
  difficulty: PlatinaDifficulty
  timeToPlat: string // Ex: "20-30h"
  missableTrophies: boolean
  onlineRequired: boolean
  tips: string
}

export interface AdditionalImage {
  id?: string
  review_id?: string
  url: string
  caption: string
  display_order?: number
}

export interface NewsMedia {
  id?: string
  news_id?: string
  type: "image" | "video"
  url: string
  caption: string
  display_order?: number
}

export interface TrophyGuideStep {
  id?: string
  guide_id?: string
  title: string
  description: string
  image?: string
  video?: string
  display_order?: number
}

export interface Post {
  id: string
  title: string
  slug: string
  content: string
  image: string
  type: "review" | "news" | "guide"
  created_at: string
  updated_at: string
  author?: Author // Para exibição (populado na busca)
  author_id?: string | null // Para salvar (ID do autor selecionado)
  youtubeUrl?: string
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
  additionalMedia?: NewsMedia[]
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

// Interfaces para dados do Supabase
export interface DbReview {
  id: string
  title: string
  slug: string
  content: string
  image: string
  created_at: string
  updated_at: string
  rating: TrophyRating
  game_name: string
  author_id?: string
  platina_guide?: PlatinaGuide
  youtube_url?: string
}

export interface DbNews {
  id: string
  title: string
  slug: string
  content: string
  image: string
  created_at: string
  updated_at: string
  author_id?: string
  youtube_url?: string
}

export interface DbNewsMedia {
  id: string
  news_id: string
  type: "image" | "video"
  url: string
  caption: string
  display_order: number
}

export interface DbGuide {
  id: string
  title: string
  slug: string
  content: string
  image: string
  created_at: string
  updated_at: string
  game_name: string
  difficulty: PlatinaDifficulty
  estimated_time: string
  author_id?: string
}

export interface DbGenre {
  id: string
  name: string
}

export interface DbTag {
  id: string
  name: string
}

export interface DbAdditionalImage {
  id: string
  review_id: string
  url: string
  caption: string
  display_order: number
}

export interface DbGuideStep {
  id: string
  guide_id: string
  title: string
  description: string
  image?: string
  video?: string
  display_order: number
}
