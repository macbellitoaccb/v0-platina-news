"use server"

import {
  saveReview,
  saveNews,
  deleteReview,
  deleteNews,
  saveGuide,
  deleteGuide,
  saveAuthor,
  deleteAuthor,
  getAuthorByUserId,
  saveArticle,
  deleteArticle,
  savePlatinadorTip,
  deletePlatinadorTip,
} from "@/lib/data"
import type { Review, News, Guide, Author, Article, PlatinadorTip } from "@/lib/types"
import { createServerSupabaseClient, createClientSupabaseClient } from "@/lib/supabase"
import { redirect } from "next/navigation"

// --- Auth Actions ---
export async function login(formData: FormData) {
  const supabase = createClientSupabaseClient()
  if (!supabase) {
    throw new Error("Supabase client not available.")
  }

  const email = formData.get("email") as string
  const password = formData.get("password") as string

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    console.error("Login error:", error.message)
    return { success: false, message: error.message }
  }

  redirect("/admin") // Redireciona para o painel admin após login
}

export async function logout() {
  const supabase = createClientSupabaseClient()
  if (!supabase) {
    throw new Error("Supabase client not available.")
  }

  const { error } = await supabase.auth.signOut()

  if (error) {
    console.error("Logout error:", error.message)
    return { success: false, message: error.message }
  }

  redirect("/login") // Redireciona para a página de login após logout
}

// --- Content Management Actions ---
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

// --- Article and Platinador Tip Actions ---
export async function createArticle(data: Article) {
  return saveArticle(data)
}

export async function updateArticle(data: Article) {
  return saveArticle(data)
}

export async function createPlatinadorTip(data: PlatinadorTip) {
  return savePlatinadorTip(data)
}

export async function updatePlatinadorTip(data: PlatinadorTip) {
  return savePlatinadorTip(data)
}

export async function removeArticle(id: string) {
  return deleteArticle(id)
}

export async function removePlatinadorTip(id: string) {
  return deletePlatinadorTip(id)
}

// --- Author Management Actions ---
export async function createAuthor(data: Author) {
  // Simplesmente salva o autor sem criar usuário de autenticação
  const authorToSave: Author = {
    ...data,
    role: data.role || "author", // Default to 'author' if not specified
  }
  return saveAuthor(authorToSave)
}

export async function updateAuthor(data: Author) {
  return saveAuthor(data)
}

export async function removeAuthor(id: string) {
  const supabase = createServerSupabaseClient()
  if (!supabase) {
    throw new Error("Supabase client not available.")
  }

  // 1. Get author to find user_id
  const { data: authorData, error: fetchError } = await supabase.from("authors").select("user_id").eq("id", id).single()
  if (fetchError || !authorData) {
    console.error("Error fetching author for deletion:", fetchError?.message || "Author not found")
    throw new Error("Autor não encontrado para exclusão.")
  }

  const userIdToDelete = authorData.user_id

  // 2. Delete author profile
  await deleteAuthor(id)

  // 3. Delete user from Supabase Auth
  if (userIdToDelete) {
    const { error: authDeleteError } = await supabase.auth.admin.deleteUser(userIdToDelete)
    if (authDeleteError) {
      console.error("Error deleting auth user:", authDeleteError.message)
      // Decide if you want to throw here or just log.
      // If auth user deletion fails, the author profile is still gone.
      throw new Error(`Erro ao deletar usuário de autenticação: ${authDeleteError.message}`)
    }
  }
}

export async function updateMyProfile(data: Author) {
  const supabase = createServerSupabaseClient()
  if (!supabase) {
    throw new Error("Supabase client not available.")
  }

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()
  if (userError || !user) {
    throw new Error("Usuário não autenticado.")
  }

  const currentAuthor = await getAuthorByUserId(user.id)
  if (!currentAuthor) {
    throw new Error("Perfil de autor não encontrado para o usuário logado.")
  }

  // Ensure the user can only update their own profile
  if (currentAuthor.user_id !== user.id) {
    throw new Error("Você não tem permissão para editar este perfil.")
  }

  const authorToUpdate: Author = {
    ...currentAuthor, // Keep existing ID, user_id, role
    name: data.name,
    avatar: data.avatar,
    psnId: data.psnId,
    instagram: data.instagram,
    twitter: data.twitter,
    bio: data.bio,
  }

  return saveAuthor(authorToUpdate)
}
