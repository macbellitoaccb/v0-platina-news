import type { AllPosts, News, Review } from "./types"
import { sampleReviews, sampleNews } from "./seed-data"

// In-memory storage for data
let memoryReviews: Review[] = [...sampleReviews]
let memoryNews: News[] = [...sampleNews]

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

// Get all posts (reviews and news) sorted by date
export function getAllPosts(): AllPosts[] {
  const reviews = getReviews()
  const news = getNews()

  return [...reviews, ...news].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
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

// These functions are kept for compatibility but don't do anything in this version
export function ensureDataDir() {
  // No-op in this version
}

export function seedDatabaseIfEmpty() {
  // No-op in this version
}
