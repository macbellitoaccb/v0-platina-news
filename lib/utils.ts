import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import type { TrophyRating } from "./types"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  })
}

export function slugify(text: string): string {
  return text
    .toString()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-")
}

export function getTrophyInfo(rating: TrophyRating) {
  const trophyMap = {
    bronze: {
      label: "Bronze",
      description: "Jogo fraco",
      color: "trophy-bronze",
    },
    silver: {
      label: "Prata",
      description: "Mediano",
      color: "trophy-silver",
    },
    gold: {
      label: "Ouro",
      description: "Muito bom",
      color: "trophy-gold",
    },
    platinum: {
      label: "Platina",
      description: "Obra-prima",
      color: "trophy-platinum",
    },
  }

  return trophyMap[rating]
}
