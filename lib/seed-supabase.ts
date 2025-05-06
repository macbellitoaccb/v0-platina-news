import { createServerSupabaseClient } from "./supabase"
import { sampleReviews, sampleNews, sampleGuide } from "./seed-data"
import { v4 as uuidv4 } from "uuid"

export async function seedSupabaseDatabase() {
  const supabase = createServerSupabaseClient()

  // Verificar se já existem dados
  const { count: reviewCount } = await supabase.from("reviews").select("*", { count: "exact", head: true })

  if (reviewCount && reviewCount > 0) {
    console.log("Banco de dados já possui dados. Pulando seed.")
    return
  }

  console.log("Iniciando seed do banco de dados...")

  // Adicionar autores
  const authors = [
    {
      id: uuidv4(),
      name: "Lucas Silva",
      avatar: "https://i.pravatar.cc/150?img=12",
      psn_id: "PlatinaCaçador",
      instagram: "@platina_hunter",
      twitter: "@platina_hunter",
      bio: "Caçador de troféus desde 2010. Especialista em RPGs e jogos de ação.",
    },
    {
      id: uuidv4(),
      name: "Marina Costa",
      avatar: "https://i.pravatar.cc/150?img=5",
      psn_id: "SoulsMaster",
      instagram: "@souls_hunter",
      twitter: "@souls_hunter",
      bio: "Especialista em jogos FromSoftware. Já platinou todos os Souls, Bloodborne e Sekiro.",
    },
    {
      id: uuidv4(),
      name: "Pedro Almeida",
      avatar: "https://i.pravatar.cc/150?img=8",
      psn_id: "TrophyMaster_BR",
      instagram: "@trophy_master",
      twitter: "@trophy_master_br",
      bio: "Jogador hardcore com mais de 200 platinas. Especialista em jogos de mundo aberto e FPS.",
    },
    {
      id: uuidv4(),
      name: "Ana Beatriz Mendes",
      avatar: "https://i.pravatar.cc/150?img=23",
      psn_id: "AnaBeatrizGamer",
      instagram: "@anabeatriz_games",
      twitter: "@anabeatriz_games",
      bio: "Jornalista especializada em games há 8 anos. Cobre principalmente notícias sobre PlayStation e Nintendo.",
    },
    {
      id: uuidv4(),
      name: "Rafael Oliveira",
      avatar: "https://i.pravatar.cc/150?img=33",
      psn_id: "RafaelGamer_BR",
      instagram: "@rafael_indie_games",
      twitter: "@rafael_games",
      bio: "Especialista em jogos indie e metroidvanias. Completou Hollow Knight com 112% três vezes.",
    },
  ]

  // Inserir autores
  const { error: authorsError } = await supabase.from("authors").insert(authors)

  if (authorsError) {
    console.error("Erro ao inserir autores:", authorsError)
    return
  }

  // Mapear autores por nome para uso posterior
  const authorMap = authors.reduce(
    (acc, author) => {
      acc[author.name] = author.id
      return acc
    },
    {} as Record<string, string>,
  )

  // Adicionar reviews
  for (const review of sampleReviews) {
    const reviewId = uuidv4()

    // Inserir review
    const { error: reviewError } = await supabase.from("reviews").insert({
      id: reviewId,
      title: review.title,
      slug: review.slug,
      content: review.content,
      image: review.image,
      created_at: review.createdAt,
      updated_at: review.updatedAt,
      rating: review.rating,
      game_name: review.gameName,
      author_id: review.author ? authorMap[review.author.name] : null,
      platina_guide: review.platinaGuide,
    })

    if (reviewError) {
      console.error("Erro ao inserir review:", reviewError)
      continue
    }

    // Adicionar gêneros
    for (const genre of review.genres) {
      // Verificar se o gênero já existe
      const { data: existingGenre } = await supabase.from("genres").select("id").eq("name", genre).single()

      let genreId

      if (existingGenre) {
        genreId = existingGenre.id
      } else {
        // Inserir novo gênero
        const { data: newGenre, error: genreError } = await supabase
          .from("genres")
          .insert({ name: genre })
          .select()
          .single()

        if (genreError) {
          console.error("Erro ao inserir gênero:", genreError)
          continue
        }

        genreId = newGenre.id
      }

      // Relacionar review com gênero
      await supabase.from("review_genres").insert({
        review_id: reviewId,
        genre_id: genreId,
      })
    }

    // Adicionar tags
    for (const tag of review.tags) {
      // Verificar se a tag já existe
      const { data: existingTag } = await supabase.from("tags").select("id").eq("name", tag).single()

      let tagId

      if (existingTag) {
        tagId = existingTag.id
      } else {
        // Inserir nova tag
        const { data: newTag, error: tagError } = await supabase.from("tags").insert({ name: tag }).select().single()

        if (tagError) {
          console.error("Erro ao inserir tag:", tagError)
          continue
        }

        tagId = newTag.id
      }

      // Relacionar review com tag
      await supabase.from("review_tags").insert({
        review_id: reviewId,
        tag_id: tagId,
      })
    }

    // Adicionar imagens adicionais
    if (review.additionalImages && review.additionalImages.length > 0) {
      const additionalImages = review.additionalImages.map((img, index) => ({
        review_id: reviewId,
        url: img.url,
        caption: img.caption,
        display_order: index,
      }))

      await supabase.from("additional_images").insert(additionalImages)
    }
  }

  // Adicionar notícias
  for (const news of sampleNews) {
    await supabase.from("news").insert({
      id: uuidv4(),
      title: news.title,
      slug: news.slug,
      content: news.content,
      image: news.image,
      created_at: news.createdAt,
      updated_at: news.updatedAt,
      author_id: news.author ? authorMap[news.author.name] : null,
    })
  }

  // Adicionar guia
  const guideId = uuidv4()

  // Inserir guia
  await supabase.from("guides").insert({
    id: guideId,
    title: sampleGuide.title,
    slug: sampleGuide.slug,
    content: sampleGuide.content,
    image: sampleGuide.image,
    created_at: sampleGuide.createdAt,
    updated_at: sampleGuide.updatedAt,
    game_name: sampleGuide.gameName,
    difficulty: sampleGuide.difficulty,
    estimated_time: sampleGuide.estimatedTime,
    author_id: sampleGuide.author ? authorMap[sampleGuide.author.name] : null,
  })

  // Adicionar tags do guia
  for (const tag of sampleGuide.tags) {
    // Verificar se a tag já existe
    const { data: existingTag } = await supabase.from("tags").select("id").eq("name", tag).single()

    let tagId

    if (existingTag) {
      tagId = existingTag.id
    } else {
      // Inserir nova tag
      const { data: newTag } = await supabase.from("tags").insert({ name: tag }).select().single()

      tagId = newTag.id
    }

    // Relacionar guia com tag
    await supabase.from("guide_tags").insert({
      guide_id: guideId,
      tag_id: tagId,
    })
  }

  // Adicionar passos do guia
  if (sampleGuide.steps && sampleGuide.steps.length > 0) {
    const guideSteps = sampleGuide.steps.map((step, index) => ({
      guide_id: guideId,
      title: step.title,
      description: step.description,
      image: step.image,
      video: step.video,
      display_order: index,
    }))

    await supabase.from("guide_steps").insert(guideSteps)
  }

  console.log("Seed do banco de dados concluído com sucesso!")
}
