import { createServerSupabaseClient } from "./supabase"
import type { Review, News, Guide, AllPosts, Author, DbReview, DbNews, DbGuide } from "./types"
import { v4 as uuidv4 } from "uuid"

// Função para converter um review do banco de dados para o formato da aplicação
async function convertDbReviewToReview(dbReview: DbReview): Promise<Review> {
  const supabase = createServerSupabaseClient()

  // Buscar autor
  let author: Author | undefined
  if (dbReview.author_id) {
    const { data: authorData } = await supabase.from("authors").select("*").eq("id", dbReview.author_id).single()

    if (authorData) {
      author = {
        id: authorData.id,
        name: authorData.name,
        avatar: authorData.avatar,
        psnId: authorData.psn_id,
        instagram: authorData.instagram,
        twitter: authorData.twitter,
        bio: authorData.bio,
      }
    }
  }

  // Buscar gêneros
  const { data: genresData } = await supabase.from("review_genres").select("genres(name)").eq("review_id", dbReview.id)

  const genres = genresData?.map((g) => g.genres.name) || []

  // Buscar tags
  const { data: tagsData } = await supabase.from("review_tags").select("tags(name)").eq("review_id", dbReview.id)

  const tags = tagsData?.map((t) => t.tags.name) || []

  // Buscar imagens adicionais
  const { data: imagesData } = await supabase
    .from("additional_images")
    .select("*")
    .eq("review_id", dbReview.id)
    .order("display_order", { ascending: true })

  const additionalImages =
    imagesData?.map((img) => ({
      id: img.id,
      url: img.url,
      caption: img.caption,
      display_order: img.display_order,
    })) || []

  return {
    id: dbReview.id,
    title: dbReview.title,
    slug: dbReview.slug,
    content: dbReview.content,
    image: dbReview.image,
    type: "review",
    createdAt: dbReview.created_at,
    updatedAt: dbReview.updated_at,
    rating: dbReview.rating,
    gameName: dbReview.game_name,
    genres,
    tags,
    author,
    platinaGuide: dbReview.platina_guide,
    additionalImages,
  }
}

// Função para converter uma notícia do banco de dados para o formato da aplicação
async function convertDbNewsToNews(dbNews: DbNews): Promise<News> {
  const supabase = createServerSupabaseClient()

  // Buscar autor
  let author: Author | undefined
  if (dbNews.author_id) {
    const { data: authorData } = await supabase.from("authors").select("*").eq("id", dbNews.author_id).single()

    if (authorData) {
      author = {
        id: authorData.id,
        name: authorData.name,
        avatar: authorData.avatar,
        psnId: authorData.psn_id,
        instagram: authorData.instagram,
        twitter: authorData.twitter,
        bio: authorData.bio,
      }
    }
  }

  return {
    id: dbNews.id,
    title: dbNews.title,
    slug: dbNews.slug,
    content: dbNews.content,
    image: dbNews.image,
    type: "news",
    createdAt: dbNews.created_at,
    updatedAt: dbNews.updated_at,
    author,
  }
}

// Função para converter um guia do banco de dados para o formato da aplicação
async function convertDbGuideToGuide(dbGuide: DbGuide): Promise<Guide> {
  const supabase = createServerSupabaseClient()

  // Buscar autor
  let author: Author | undefined
  if (dbGuide.author_id) {
    const { data: authorData } = await supabase.from("authors").select("*").eq("id", dbGuide.author_id).single()

    if (authorData) {
      author = {
        id: authorData.id,
        name: authorData.name,
        avatar: authorData.avatar,
        psnId: authorData.psn_id,
        instagram: authorData.instagram,
        twitter: authorData.twitter,
        bio: authorData.bio,
      }
    }
  }

  // Buscar tags
  const { data: tagsData } = await supabase.from("guide_tags").select("tags(name)").eq("guide_id", dbGuide.id)

  const tags = tagsData?.map((t) => t.tags.name) || []

  // Buscar passos do guia
  const { data: stepsData } = await supabase
    .from("guide_steps")
    .select("*")
    .eq("guide_id", dbGuide.id)
    .order("display_order", { ascending: true })

  const steps =
    stepsData?.map((step) => ({
      id: step.id,
      title: step.title,
      description: step.description,
      image: step.image,
      video: step.video,
      display_order: step.display_order,
    })) || []

  return {
    id: dbGuide.id,
    title: dbGuide.title,
    slug: dbGuide.slug,
    content: dbGuide.content,
    image: dbGuide.image,
    type: "guide",
    createdAt: dbGuide.created_at,
    updatedAt: dbGuide.updated_at,
    gameName: dbGuide.game_name,
    difficulty: dbGuide.difficulty,
    estimatedTime: dbGuide.estimated_time,
    author,
    tags,
    steps,
  }
}

// Função para buscar todos os reviews
export async function getReviews(): Promise<Review[]> {
  const supabase = createServerSupabaseClient()

  const { data: dbReviews, error } = await supabase
    .from("reviews")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Erro ao buscar reviews:", error)
    return []
  }

  const reviews = await Promise.all(dbReviews.map((dbReview) => convertDbReviewToReview(dbReview)))

  return reviews
}

// Função para buscar todas as notícias
export async function getNews(): Promise<News[]> {
  const supabase = createServerSupabaseClient()

  const { data: dbNews, error } = await supabase.from("news").select("*").order("created_at", { ascending: false })

  if (error) {
    console.error("Erro ao buscar notícias:", error)
    return []
  }

  const news = await Promise.all(dbNews.map((dbNews) => convertDbNewsToNews(dbNews)))

  return news
}

// Função para buscar todos os guias
export async function getGuides(): Promise<Guide[]> {
  const supabase = createServerSupabaseClient()

  const { data: dbGuides, error } = await supabase.from("guides").select("*").order("created_at", { ascending: false })

  if (error) {
    console.error("Erro ao buscar guias:", error)
    return []
  }

  const guides = await Promise.all(dbGuides.map((dbGuide) => convertDbGuideToGuide(dbGuide)))

  return guides
}

// Função para buscar todos os posts (reviews, notícias e guias)
export async function getAllPosts(): Promise<AllPosts[]> {
  const reviews = await getReviews()
  const news = await getNews()
  const guides = await getGuides()

  return [...reviews, ...news, ...guides].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  )
}

// Função para buscar um review pelo slug
export async function getReviewBySlug(slug: string): Promise<Review | null> {
  const supabase = createServerSupabaseClient()

  const { data: dbReview, error } = await supabase.from("reviews").select("*").eq("slug", slug).single()

  if (error || !dbReview) {
    console.error("Erro ao buscar review por slug:", error)
    return null
  }

  return await convertDbReviewToReview(dbReview)
}

// Função para buscar uma notícia pelo slug
export async function getNewsBySlug(slug: string): Promise<News | null> {
  const supabase = createServerSupabaseClient()

  const { data: dbNews, error } = await supabase.from("news").select("*").eq("slug", slug).single()

  if (error || !dbNews) {
    console.error("Erro ao buscar notícia por slug:", error)
    return null
  }

  return await convertDbNewsToNews(dbNews)
}

// Função para buscar um guia pelo slug
export async function getGuideBySlug(slug: string): Promise<Guide | null> {
  const supabase = createServerSupabaseClient()

  const { data: dbGuide, error } = await supabase.from("guides").select("*").eq("slug", slug).single()

  if (error || !dbGuide) {
    console.error("Erro ao buscar guia por slug:", error)
    return null
  }

  return await convertDbGuideToGuide(dbGuide)
}

// Função para buscar um review pelo ID
export async function getReviewById(id: string): Promise<Review | null> {
  const supabase = createServerSupabaseClient()

  const { data: dbReview, error } = await supabase.from("reviews").select("*").eq("id", id).single()

  if (error || !dbReview) {
    console.error("Erro ao buscar review por ID:", error)
    return null
  }

  return await convertDbReviewToReview(dbReview)
}

// Função para buscar uma notícia pelo ID
export async function getNewsById(id: string): Promise<News | null> {
  const supabase = createServerSupabaseClient()

  const { data: dbNews, error } = await supabase.from("news").select("*").eq("id", id).single()

  if (error || !dbNews) {
    console.error("Erro ao buscar notícia por ID:", error)
    return null
  }

  return await convertDbNewsToNews(dbNews)
}

// Função para buscar um guia pelo ID
export async function getGuideById(id: string): Promise<Guide | null> {
  const supabase = createServerSupabaseClient()

  const { data: dbGuide, error } = await supabase.from("guides").select("*").eq("id", id).single()

  if (error || !dbGuide) {
    console.error("Erro ao buscar guia por ID:", error)
    return null
  }

  return await convertDbGuideToGuide(dbGuide)
}

// Função para salvar ou atualizar um autor
async function saveAuthor(author: Author): Promise<string> {
  const supabase = createServerSupabaseClient()

  if (!author.name) {
    return ""
  }

  // Se o autor já tem ID, atualizar
  if (author.id) {
    const { data, error } = await supabase
      .from("authors")
      .update({
        name: author.name,
        avatar: author.avatar,
        psn_id: author.psnId,
        instagram: author.instagram,
        twitter: author.twitter,
        bio: author.bio,
        updated_at: new Date().toISOString(),
      })
      .eq("id", author.id)
      .select()
      .single()

    if (error) {
      console.error("Erro ao atualizar autor:", error)
      return ""
    }

    return data.id
  }

  // Se não tem ID, criar novo
  const { data, error } = await supabase
    .from("authors")
    .insert({
      name: author.name,
      avatar: author.avatar,
      psn_id: author.psnId,
      instagram: author.instagram,
      twitter: author.twitter,
      bio: author.bio,
    })
    .select()
    .single()

  if (error) {
    console.error("Erro ao criar autor:", error)
    return ""
  }

  return data.id
}

// Função para salvar ou atualizar um gênero
async function saveGenre(name: string): Promise<string> {
  const supabase = createServerSupabaseClient()

  // Verificar se o gênero já existe
  const { data: existingGenre } = await supabase.from("genres").select("id").eq("name", name).single()

  if (existingGenre) {
    return existingGenre.id
  }

  // Se não existe, criar novo
  const { data, error } = await supabase.from("genres").insert({ name }).select().single()

  if (error) {
    console.error("Erro ao criar gênero:", error)
    return ""
  }

  return data.id
}

// Função para salvar ou atualizar uma tag
async function saveTag(name: string): Promise<string> {
  const supabase = createServerSupabaseClient()

  // Verificar se a tag já existe
  const { data: existingTag } = await supabase.from("tags").select("id").eq("name", name).single()

  if (existingTag) {
    return existingTag.id
  }

  // Se não existe, criar nova
  const { data, error } = await supabase.from("tags").insert({ name }).select().single()

  if (error) {
    console.error("Erro ao criar tag:", error)
    return ""
  }

  return data.id
}

// Função para salvar um review
export async function saveReview(review: Review): Promise<void> {
  const supabase = createServerSupabaseClient()

  // Salvar autor se existir
  let authorId = undefined
  if (review.author) {
    authorId = await saveAuthor(review.author)
  }

  // Preparar dados do review para o banco
  const dbReview = {
    title: review.title,
    slug: review.slug,
    content: review.content,
    image: review.image,
    rating: review.rating,
    game_name: review.gameName,
    author_id: authorId,
    platina_guide: review.platinaGuide,
    updated_at: new Date().toISOString(),
  }

  // Se o review já existe, atualizar
  if (review.id) {
    const { error } = await supabase.from("reviews").update(dbReview).eq("id", review.id)

    if (error) {
      console.error("Erro ao atualizar review:", error)
      return
    }
  } else {
    // Se não existe, criar novo com UUID válido
    const newId = uuidv4()
    const { data, error } = await supabase
      .from("reviews")
      .insert({
        ...dbReview,
        id: newId,
      })
      .select()
      .single()

    if (error) {
      console.error("Erro ao criar review:", error)
      return
    }

    review.id = data.id
  }

  // Salvar gêneros
  if (review.genres && review.genres.length > 0) {
    // Primeiro, remover relações existentes
    await supabase.from("review_genres").delete().eq("review_id", review.id)

    // Depois, adicionar novas relações
    for (const genreName of review.genres) {
      const genreId = await saveGenre(genreName)
      if (genreId) {
        await supabase.from("review_genres").insert({
          review_id: review.id,
          genre_id: genreId,
        })
      }
    }
  }

  // Salvar tags
  if (review.tags && review.tags.length > 0) {
    // Primeiro, remover relações existentes
    await supabase.from("review_tags").delete().eq("review_id", review.id)

    // Depois, adicionar novas relações
    for (const tagName of review.tags) {
      const tagId = await saveTag(tagName)
      if (tagId) {
        await supabase.from("review_tags").insert({
          review_id: review.id,
          tag_id: tagId,
        })
      }
    }
  }

  // Salvar imagens adicionais
  if (review.additionalImages && review.additionalImages.length > 0) {
    // Primeiro, remover imagens existentes
    await supabase.from("additional_images").delete().eq("review_id", review.id)

    // Depois, adicionar novas imagens
    for (let i = 0; i < review.additionalImages.length; i++) {
      const image = review.additionalImages[i]
      await supabase.from("additional_images").insert({
        review_id: review.id,
        url: image.url,
        caption: image.caption,
        display_order: i,
      })
    }
  }
}

// Função para salvar uma notícia
export async function saveNews(news: News): Promise<void> {
  const supabase = createServerSupabaseClient()

  // Salvar autor se existir
  let authorId = undefined
  if (news.author) {
    authorId = await saveAuthor(news.author)
  }

  // Preparar dados da notícia para o banco
  const dbNews = {
    title: news.title,
    slug: news.slug,
    content: news.content,
    image: news.image,
    author_id: authorId,
    updated_at: new Date().toISOString(),
  }

  // Se a notícia já existe, atualizar
  if (news.id) {
    const { error } = await supabase.from("news").update(dbNews).eq("id", news.id)

    if (error) {
      console.error("Erro ao atualizar notícia:", error)
      return
    }
  } else {
    // Se não existe, criar nova com UUID válido
    const newId = uuidv4()
    const { data, error } = await supabase
      .from("news")
      .insert({
        ...dbNews,
        id: newId,
      })
      .select()
      .single()

    if (error) {
      console.error("Erro ao criar notícia:", error)
      return
    }

    news.id = data.id
  }
}

// Função para salvar um guia
export async function saveGuide(guide: Guide): Promise<void> {
  const supabase = createServerSupabaseClient()

  // Salvar autor se existir
  let authorId = undefined
  if (guide.author) {
    authorId = await saveAuthor(guide.author)
  }

  // Preparar dados do guia para o banco
  const dbGuide = {
    title: guide.title,
    slug: guide.slug,
    content: guide.content,
    image: guide.image,
    game_name: guide.gameName,
    difficulty: guide.difficulty,
    estimated_time: guide.estimatedTime,
    author_id: authorId,
    updated_at: new Date().toISOString(),
  }

  // Se o guia já existe, atualizar
  if (guide.id) {
    const { error } = await supabase.from("guides").update(dbGuide).eq("id", guide.id)

    if (error) {
      console.error("Erro ao atualizar guia:", error)
      return
    }
  } else {
    // Se não existe, criar novo com UUID válido
    const newId = uuidv4()
    const { data, error } = await supabase
      .from("guides")
      .insert({
        ...dbGuide,
        id: newId,
      })
      .select()
      .single()

    if (error) {
      console.error("Erro ao criar guia:", error)
      return
    }

    guide.id = data.id
  }

  // Salvar tags
  if (guide.tags && guide.tags.length > 0) {
    // Primeiro, remover relações existentes
    await supabase.from("guide_tags").delete().eq("guide_id", guide.id)

    // Depois, adicionar novas relações
    for (const tagName of guide.tags) {
      const tagId = await saveTag(tagName)
      if (tagId) {
        await supabase.from("guide_tags").insert({
          guide_id: guide.id,
          tag_id: tagId,
        })
      }
    }
  }

  // Salvar passos do guia
  if (guide.steps && guide.steps.length > 0) {
    // Primeiro, remover passos existentes
    await supabase.from("guide_steps").delete().eq("guide_id", guide.id)

    // Depois, adicionar novos passos
    for (let i = 0; i < guide.steps.length; i++) {
      const step = guide.steps[i]
      await supabase.from("guide_steps").insert({
        guide_id: guide.id,
        title: step.title,
        description: step.description,
        image: step.image,
        video: step.video,
        display_order: i,
      })
    }
  }
}

// Função para excluir um review
export async function deleteReview(id: string): Promise<void> {
  const supabase = createServerSupabaseClient()

  // Excluir o review (as relações serão excluídas automaticamente devido às constraints ON DELETE CASCADE)
  const { error } = await supabase.from("reviews").delete().eq("id", id)

  if (error) {
    console.error("Erro ao excluir review:", error)
  }
}

// Função para excluir uma notícia
export async function deleteNews(id: string): Promise<void> {
  const supabase = createServerSupabaseClient()

  const { error } = await supabase.from("news").delete().eq("id", id)

  if (error) {
    console.error("Erro ao excluir notícia:", error)
  }
}

// Função para excluir um guia
export async function deleteGuide(id: string): Promise<void> {
  const supabase = createServerSupabaseClient()

  // Excluir o guia (as relações serão excluídas automaticamente devido às constraints ON DELETE CASCADE)
  const { error } = await supabase.from("guides").delete().eq("id", id)

  if (error) {
    console.error("Erro ao excluir guia:", error)
  }
}

// Estas funções são mantidas para compatibilidade
export function ensureDataDir() {
  // No-op nesta versão
}

export function seedDatabaseIfEmpty() {
  // No-op nesta versão
}
