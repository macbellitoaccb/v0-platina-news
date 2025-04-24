"use server"

import { saveReview, saveNews, deleteReview, deleteNews } from "@/lib/data"
import type { Review, News } from "@/lib/types"

export async function createReview(data: Review) {
  return saveReview(data)
}

export async function updateReview(data: Review) {
  return saveReview(data)
}

export async function createNews(data: News) {
  return saveNews(data)
}

export async function updateNews(data: News) {
  return saveNews(data)
}

export async function removeReview(id: string) {
  return deleteReview(id)
}

export async function removeNews(id: string) {
  return deleteNews(id)
}
