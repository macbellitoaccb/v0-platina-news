"use server"

import { saveReview, saveNews, deleteReview, deleteNews, saveGuide, deleteGuide } from "@/lib/data"
import type { Review, News, Guide } from "@/lib/types"

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

export async function createGuide(data: Guide) {
  return saveGuide(data)
}

export async function updateGuide(data: Guide) {
  return saveGuide(data)
}

export async function removeReview(id: string) {
  return deleteReview(id)
}

export async function removeNews(id: string) {
  return deleteNews(id)
}

export async function removeGuide(id: string) {
  return deleteGuide(id)
}
