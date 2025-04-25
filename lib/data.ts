import type { AllPosts, News, Review, Guide } from "./types"
import { sampleReviews, sampleNews } from "./seed-data"

// In-memory storage for data
let memoryReviews: Review[] = [...sampleReviews]
let memoryNews: News[] = [...sampleNews]
let memoryGuides: Guide[] = []

// Check if we're on the server side
const isServer = typeof window === "undefined"

// Get all reviews
export function getReviews(): Review[] {
  return [...memoryReviews]
}

// Get all news
export function getNews(): News[] {
  return [...memoryNews]
}

// Get all guides
export function getGuides(): Guide[] {
  return [...memoryGuides]
}

// Get all posts (reviews and news) sorted by date
export function getAllPosts(): AllPosts[] {
  const reviews = getReviews()
  const news = getNews()
  const guides = getGuides()

  return [...reviews, ...news, ...guides].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  )
}

// Get a single review by slug
export function getReviewBySlug(slug: string): Review | null {
  const reviews = getReviews()
  return reviews.find((review) => review.slug === slug) || null
}

// Get a single news by slug
export function getNewsBySlug(slug: string): News | null {
  const news = getNews()
  return news.find((item) => item.slug === slug) || null
}

// Get a single guide by slug
export function getGuideBySlug(slug: string): Guide | null {
  const guides = getGuides()
  return guides.find((guide) => guide.slug === slug) || null
}

// Save a review
export function saveReview(review: Review): void {
  const reviews = getReviews()
  const existingIndex = reviews.findIndex((r) => r.id === review.id)

  if (existingIndex >= 0) {
    reviews[existingIndex] = review
  } else {
    reviews.push(review)
  }

  memoryReviews = reviews
}

// Save a news
export function saveNews(news: News): void {
  const newsItems = getNews()
  const existingIndex = newsItems.findIndex((n) => n.id === news.id)

  if (existingIndex >= 0) {
    newsItems[existingIndex] = news
  } else {
    newsItems.push(news)
  }

  memoryNews = newsItems
}

// Save a guide
export function saveGuide(guide: Guide): void {
  const guides = getGuides()
  const existingIndex = guides.findIndex((g) => g.id === guide.id)

  if (existingIndex >= 0) {
    guides[existingIndex] = guide
  } else {
    guides.push(guide)
  }

  memoryGuides = guides
}

// Delete a review
export function deleteReview(id: string): void {
  const reviews = getReviews()
  memoryReviews = reviews.filter((review) => review.id !== id)
}

// Delete a news
export function deleteNews(id: string): void {
  const newsItems = getNews()
  memoryNews = newsItems.filter((news) => news.id !== id)
}

// Delete a guide
export function deleteGuide(id: string): void {
  const guides = getGuides()
  memoryGuides = guides.filter((guide) => guide.id !== id)
}

// These functions are kept for compatibility but don't do anything in this version
export function ensureDataDir() {
  // No-op in this version
}

export function seedDatabaseIfEmpty() {
  // No-op in this version
}
