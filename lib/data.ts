import type { AllPosts, News, Review } from "./types"
import { sampleReviews, sampleNews } from "./seed-data"
import fs from "fs"
import path from "path"

// Caminho para os arquivos de dados
const DATA_PATH = process.env.NODE_ENV === "development" ? "data" : "/tmp/data"
const REVIEWS_FILE = `${DATA_PATH}/reviews.json`
const NEWS_FILE = `${DATA_PATH}/news.json`

// Ensure data directory exists
export function ensureDataDir() {
  const fullDataPath = path.join(process.cwd(), DATA_PATH)

  if (!fs.existsSync(fullDataPath)) {
    fs.mkdirSync(fullDataPath, { recursive: true })
  }

  const fullReviewsPath = path.join(process.cwd(), REVIEWS_FILE)
  if (!fs.existsSync(fullReviewsPath)) {
    fs.writeFileSync(fullReviewsPath, JSON.stringify([]))
  }

  const fullNewsPath = path.join(process.cwd(), NEWS_FILE)
  if (!fs.existsSync(fullNewsPath)) {
    fs.writeFileSync(fullNewsPath, JSON.stringify([]))
  }
}

// Seed database with sample data if empty
export function seedDatabaseIfEmpty() {
  ensureDataDir()

  try {
    const fullReviewsPath = path.join(process.cwd(), REVIEWS_FILE)
    const fullNewsPath = path.join(process.cwd(), NEWS_FILE)

    const reviews = JSON.parse(fs.readFileSync(fullReviewsPath, "utf8"))
    const news = JSON.parse(fs.readFileSync(fullNewsPath, "utf8"))

    // Se não houver reviews ou notícias, popula o banco com dados de exemplo
    if (reviews.length === 0 && news.length === 0) {
      // Adicionar reviews de exemplo
      fs.writeFileSync(fullReviewsPath, JSON.stringify(sampleReviews, null, 2))

      // Adicionar notícias de exemplo
      fs.writeFileSync(fullNewsPath, JSON.stringify(sampleNews, null, 2))

      console.log("Banco de dados populado com dados de exemplo!")
    }
  } catch (error) {
    console.error("Erro ao verificar ou popular o banco de dados:", error)
  }
}

// Get all reviews
export function getReviews(): Review[] {
  ensureDataDir()
  seedDatabaseIfEmpty() // Verifica se precisa popular o banco

  try {
    const fullPath = path.join(process.cwd(), REVIEWS_FILE)
    const data = fs.readFileSync(fullPath, "utf8")
    return JSON.parse(data)
  } catch (error) {
    console.error("Error reading reviews:", error)
    return []
  }
}

// Get all news
export function getNews(): News[] {
  ensureDataDir()
  seedDatabaseIfEmpty() // Verifica se precisa popular o banco

  try {
    const fullPath = path.join(process.cwd(), NEWS_FILE)
    const data = fs.readFileSync(fullPath, "utf8")
    return JSON.parse(data)
  } catch (error) {
    console.error("Error reading news:", error)
    return []
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
  ensureDataDir()
  const reviews = getReviews()

  const existingIndex = reviews.findIndex((r) => r.id === review.id)

  if (existingIndex >= 0) {
    reviews[existingIndex] = review
  } else {
    reviews.push(review)
  }

  const fullPath = path.join(process.cwd(), REVIEWS_FILE)
  fs.writeFileSync(fullPath, JSON.stringify(reviews, null, 2))
}

// Save a news
export function saveNews(news: News): void {
  ensureDataDir()
  const newsItems = getNews()

  const existingIndex = newsItems.findIndex((n) => n.id === news.id)

  if (existingIndex >= 0) {
    newsItems[existingIndex] = news
  } else {
    newsItems.push(news)
  }

  const fullPath = path.join(process.cwd(), NEWS_FILE)
  fs.writeFileSync(fullPath, JSON.stringify(newsItems, null, 2))
}

// Delete a review
export function deleteReview(id: string): void {
  ensureDataDir()
  const reviews = getReviews()
  const filteredReviews = reviews.filter((review) => review.id !== id)

  const fullPath = path.join(process.cwd(), REVIEWS_FILE)
  fs.writeFileSync(fullPath, JSON.stringify(filteredReviews, null, 2))
}

// Delete a news
export function deleteNews(id: string): void {
  ensureDataDir()
  const newsItems = getNews()
  const filteredNews = newsItems.filter((news) => news.id !== id)

  const fullPath = path.join(process.cwd(), NEWS_FILE)
  fs.writeFileSync(fullPath, JSON.stringify(filteredNews, null, 2))
}
