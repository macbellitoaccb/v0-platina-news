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
} from "@/lib/data"
import type { Review, News, Guide, Author } from "@/lib/types"
import { createServerSupabaseClient, createPublicSupabaseClientForServer } from "@/lib/supabase" // Importe a nova função
import { redirect } from "next/navigation"

// --- Auth Actions ---
export async function login(formData: FormData) {
  // Use a função para criar um cliente Supabase para ações de servidor com chave pública
  const supabase = createPublicSupabaseClientForServer()
  if (!supabase) {
    throw new Error(
      "Supabase client not available. Please ensure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set.",
    )
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
  // Use a função para criar um cliente Supabase para ações de servidor com chave pública
  const supabase = createPublicSupabaseClientForServer()
  if (!supabase) {
    throw new Error(
      "Supabase client not available. Please ensure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set.",
    )
  }

  const { error } = await supabase.auth.signOut()

  if (error) {
    console.error("Logout error:", error.message)
    return { success: false, message: error.message }
  }

  redirect("/login") // Redireciona para a página de login após logout
}

// --- Content Management Actions (unchanged, as they use save/delete functions from lib/data which use createServerSupabaseClient) ---
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

// --- Author Management Actions ---
export async function createAuthor(data: Author & { email: string; password: string }) {
  const supabase = createServerSupabaseClient() // Continua usando o cliente de serviço para admin.createUser
  if (!supabase) {
    throw new Error("Supabase client not available.")
  }

  // 1. Create user in Supabase Auth
  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email: data.email,
    password: data.password,
    email_confirm: true, // Auto-confirm email for admin created users
  })

  if (authError) {
    console.error("Error creating auth user:", authError.message)
    throw new Error(`Erro ao criar usuário de autenticação: ${authError.message}`)
  }

  const userId = authData.user.id

  // 2. Save author profile linked to the new user_id
  const authorToSave: Author = {
    ...data,
    user_id: userId,
    role: data.role || "author", // Default to 'author' if not specified
  }
  return saveAuthor(authorToSave)
}

export async function updateAuthor(data: Author) {
  return saveAuthor(data)
}

export async function removeAuthor(id: string) {
  const supabase = createServerSupabaseClient() // Continua usando o cliente de serviço para admin.deleteUser
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
      throw new Error(`Erro ao deletar usuário de autenticação: ${authDeleteError.message}`)
    }
  }
}

export async function updateMyProfile(data: Author) {
  // Use a função para criar um cliente Supabase para ações de servidor com chave pública
  const supabase = createPublicSupabaseClientForServer()
  if (!supabase) {
    throw new Error(
      "Supabase client not available. Please ensure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set.",
    )
  }

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser() // getUser deve usar a chave anon
  if (userError || !user) {
    throw new Error("Usuário não autenticado.")
  }

  // A busca pelo autor também deve usar o cliente público, assumindo RLS configurado
  const { data: currentAuthorData, error: currentAuthorError } = await supabase
    .from("authors")
    .select("*")
    .eq("user_id", user.id)
    .single()

  if (currentAuthorError || !currentAuthorData) {
    throw new Error("Perfil de autor não encontrado para o usuário logado.")
  }

  const currentAuthor: Author = {
    id: currentAuthorData.id,
    name: currentAuthorData.name,
    avatar: currentAuthorData.avatar,
    psnId: currentAuthorData.psn_id,
    instagram: currentAuthorData.instagram,
    twitter: currentAuthorData.twitter,
    bio: currentAuthorData.bio,
    user_id: currentAuthorData.user_id,
    role: currentAuthorData.role,
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
