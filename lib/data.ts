import type { AllPosts, News, Review } from "./types"
import { sampleReviews, sampleNews } from "./seed-data"

// Armazenamento em memória para o servidor
const serverMemoryStore = {
  reviews: [...sampleReviews],
  news: [...sampleNews],
}

// Função para verificar se estamos no servidor
const isServer = () => typeof window === "undefined"

// Inicializar o armazenamento com dados de exemplo
if (isServer()) {
  // Garantir que temos dados iniciais no servidor
  if (!serverMemoryStore.reviews.length) {
    serverMemoryStore.reviews = [...sampleReviews]
  }
  if (!serverMemoryStore.news.length) {
    serverMemoryStore.news = [...sampleNews]
  }
}

// Get all reviews
export function getReviews(): Review[] {
  if (isServer()) {
    // No servidor, retorna do armazenamento em memória
    return [...serverMemoryStore.reviews]
  } else {
    // No cliente, retorna dados de exemplo
    return [...sampleReviews]
  }
}

// Get all news
export function getNews(): News[] {
  if (isServer()) {
    // No servidor, retorna do armazenamento em memória
    return [...serverMemoryStore.news]
  } else {
    // No cliente, retorna dados de exemplo
    return [...sampleNews]
  }
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
  if (!isServer()) return

  const reviews = getReviews()
  const existingIndex = reviews.findIndex((r) => r.id === review.id)

  if (existingIndex >= 0) {
    reviews[existingIndex] = review
  } else {
    reviews.push(review)
  }

  // Atualizar o armazenamento em memória
  serverMemoryStore.reviews = reviews
}

// Save a news
export function saveNews(news: News): void {
  if (!isServer()) return

  const newsItems = getNews()
  const existingIndex = newsItems.findIndex((n) => n.id === news.id)

  if (existingIndex >= 0) {
    newsItems[existingIndex] = news
  } else {
    newsItems.push(news)
  }

  // Atualizar o armazenamento em memória
  serverMemoryStore.news = newsItems
}

// Delete a review
export function deleteReview(id: string): void {
  if (!isServer()) return

  const reviews = getReviews()
  const filteredReviews = reviews.filter((review) => review.id !== id)

  // Atualizar o armazenamento em memória
  serverMemoryStore.reviews = filteredReviews
}

// Delete a news
export function deleteNews(id: string): void {
  if (!isServer()) return

  const newsItems = getNews()
  const filteredNews = newsItems.filter((news) => news.id !== id)

  // Atualizar o armazenamento em memória
  serverMemoryStore.news = filteredNews
}

// Funções auxiliares que não dependem de fs
export function ensureDataDir() {
  // Não faz nada, apenas mantida para compatibilidade
}

export function seedDatabaseIfEmpty() {
  // Não faz nada, apenas mantida para compatibilidade
}
