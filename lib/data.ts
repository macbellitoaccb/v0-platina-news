import { createServerSupabaseClient } from "./supabase"
import type { Review, News, Guide, AllPosts, Author, DbReview, DbNews, DbGuide } from "./types"
import { v4 as uuidv4 } from "uuid"
import { retrySupabaseOperation } from "./supabase-helpers"
// Mock data imports
import { sampleReviews, sampleNews, sampleGuide } from "./seed-data"

// Function to check if Supabase is available
function isSupabaseAvailable(): boolean {
  try {
    const supabaseUrl = process.env.SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    return !!(supabaseUrl && supabaseKey)
  } catch {
    return false
  }
}

// Function to safely create Supabase client
function createSafeSupabaseClient() {
  try {
    if (!isSupabaseAvailable()) {
      console.log("Supabase environment variables not available")
      return null
    }

    const client = createServerSupabaseClient()
    if (!client) {
      console.log("Failed to create Supabase client")
      return null
    }

    return client
  } catch (error) {
    console.warn("Failed to create Supabase client:", error)
    return null
  }
}

// Function to convert a review from database to application format
async function convertDbReviewToReview(dbReview: DbReview, supabase: any): Promise<Review> {
  try {
    // Fetch author
    let author: Author | undefined
    if (dbReview.author_id) {
      try {
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
            user_id: authorData.user_id,
            role: authorData.role,
          }
        }
      } catch (error) {
        console.warn("Error fetching author for review:", error)
      }
    }

    // Fetch genres
    let genres: string[] = []
    try {
      const { data: genresData } = await supabase
        .from("review_genres")
        .select("genres(name)")
        .eq("review_id", dbReview.id)
      genres = genresData?.map((g: any) => g.genres.name) || []
    } catch (error) {
      console.warn("Error fetching genres for review:", error)
    }

    // Fetch tags
    let tags: string[] = []
    try {
      const { data: tagsData } = await supabase.from("review_tags").select("tags(name)").eq("review_id", dbReview.id)
      tags = tagsData?.map((t: any) => t.tags.name) || []
    } catch (error) {
      console.warn("Error fetching tags for review:", error)
    }

    // Fetch additional images
    let additionalImages: any[] = []
    try {
      const { data: imagesData } = await supabase
        .from("additional_images")
        .select("*")
        .eq("review_id", dbReview.id)
        .order("display_order", { ascending: true })

      additionalImages =
        imagesData?.map((img: any) => ({
          id: img.id,
          url: img.url,
          caption: img.caption,
          display_order: img.display_order,
        })) || []
    } catch (error) {
      console.warn("Error fetching additional images for review:", error)
    }

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
      author_id: dbReview.author_id, // Incluir author_id
      platinaGuide: dbReview.platina_guide,
      additionalImages,
    }
  } catch (error) {
    console.error("Error converting DB review:", error)
    // Return a basic review structure if conversion fails
    return {
      id: dbReview.id,
      title: dbReview.title,
      slug: dbReview.slug,
      content: dbReview.content,
      image: dbReview.image,
      type: "review" as const,
      createdAt: dbReview.created_at,
      updatedAt: dbReview.updated_at,
      rating: dbReview.rating,
      gameName: dbReview.game_name,
      genres: [],
      tags: [],
      author_id: dbReview.author_id, // Incluir author_id
      platinaGuide: dbReview.platina_guide,
      additionalImages: [],
    }
  }
}

// Function to convert news from database to application format
async function convertDbNewsToNews(dbNews: DbNews, supabase: any): Promise<News> {
  try {
    // Fetch author
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
          user_id: authorData.user_id,
          role: authorData.role,
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
      author_id: dbNews.author_id, // Incluir author_id
    }
  } catch (error) {
    console.error("Error converting DB news:", error)
    return {
      id: dbNews.id,
      title: dbNews.title,
      slug: dbNews.slug,
      content: dbNews.content,
      image: dbNews.image,
      type: "news",
      createdAt: dbNews.created_at,
      updatedAt: dbNews.updated_at,
      author_id: dbNews.author_id, // Incluir author_id
    }
  }
}

// Function to convert guide from database to application format
async function convertDbGuideToGuide(dbGuide: DbGuide, supabase: any): Promise<Guide> {
  try {
    // Fetch author
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
          user_id: authorData.user_id,
          role: authorData.role,
        }
      }
    }

    // Fetch tags
    const { data: tagsData } = await supabase.from("guide_tags").select("tags(name)").eq("guide_id", dbGuide.id)
    const tags = tagsData?.map((t: any) => t.tags.name) || []

    // Fetch guide steps
    const { data: stepsData } = await supabase
      .from("guide_steps")
      .select("*")
      .eq("guide_id", dbGuide.id)
      .order("display_order", { ascending: true })

    const steps =
      stepsData?.map((step: any) => ({
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
      author_id: dbGuide.author_id, // Incluir author_id
      tags,
      steps,
    }
  } catch (error) {
    console.error("Error converting DB guide:", error)
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
      author_id: dbGuide.author_id, // Incluir author_id
      tags: [],
      steps: [],
    }
  }
}

// Function to save or update an author
export async function saveAuthor(author: Author): Promise<string> {
  const supabase = createSafeSupabaseClient()

  if (!supabase || !author.name) {
    console.warn("Supabase not available or author name missing, cannot save author.")
    return ""
  }

  try {
    // If author already has ID, update
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
          user_id: author.user_id, // Incluir user_id
          role: author.role, // Incluir role
        })
        .eq("id", author.id)
        .select()
        .single()

      if (error) {
        console.error("Error updating author:", error)
        throw error
      }

      return data.id
    }

    // If no ID, create new
    const newId = uuidv4()
    const { data, error } = await supabase
      .from("authors")
      .insert({
        id: newId,
        name: author.name,
        avatar: author.avatar,
        psn_id: author.psnId,
        instagram: author.instagram,
        twitter: author.twitter,
        bio: author.bio,
        user_id: author.user_id, // Incluir user_id
        role: author.role, // Incluir role
      })
      .select()
      .single()

    if (error) {
      console.error("Error creating author:", error)
      throw error
    }

    return data.id
  } catch (error) {
    console.error("Error saving author:", error)
    throw error
  }
}

// Function to fetch all authors
export async function getAuthors(): Promise<Author[]> {
  console.log("Fetching authors...")
  const supabase = createSafeSupabaseClient()

  if (!supabase) {
    console.log("Supabase not available, returning empty authors array.")
    return []
  }

  try {
    const dbAuthors = await retrySupabaseOperation(async () => {
      const { data, error } = await supabase.from("authors").select("*").order("name", { ascending: true })
      if (error) throw error
      return data
    }, "Fetch Authors")

    if (!dbAuthors || dbAuthors.length === 0) {
      console.log("No authors found in database.")
      return []
    }

    console.log(`Found ${dbAuthors.length} authors in database.`)

    return dbAuthors.map((dbAuthor: any) => ({
      id: dbAuthor.id,
      name: dbAuthor.name,
      avatar: dbAuthor.avatar,
      psnId: dbAuthor.psn_id,
      instagram: dbAuthor.instagram,
      twitter: dbAuthor.twitter,
      bio: dbAuthor.bio,
      user_id: dbAuthor.user_id,
      role: dbAuthor.role,
      created_at: dbAuthor.created_at,
      updated_at: dbAuthor.updated_at,
    }))
  } catch (error) {
    console.error("Error fetching authors:", error)
    return []
  }
}

// Function to fetch author by ID
export async function getAuthorById(id: string): Promise<Author | null> {
  console.log(`Fetching author with ID: ${id}...`)
  const supabase = createSafeSupabaseClient()

  if (!supabase) {
    console.log("Supabase not available, returning null for author.")
    return null
  }

  try {
    const { data: dbAuthor, error } = await supabase.from("authors").select("*").eq("id", id).single()

    if (error || !dbAuthor) {
      console.error("Error fetching author by ID from Supabase:", error)
      return null
    }

    console.log(`Found author: ${dbAuthor.name}`)
    return {
      id: dbAuthor.id,
      name: dbAuthor.name,
      avatar: dbAuthor.avatar,
      psnId: dbAuthor.psn_id,
      instagram: dbAuthor.instagram,
      twitter: dbAuthor.twitter,
      bio: dbAuthor.bio,
      user_id: dbAuthor.user_id,
      role: dbAuthor.role,
      created_at: dbAuthor.created_at,
      updated_at: dbAuthor.updated_at,
    }
  } catch (error) {
    console.error("Unexpected error fetching author by ID:", error)
    return null
  }
}

// Function to fetch author by user_id
export async function getAuthorByUserId(userId: string): Promise<Author | null> {
  console.log(`Fetching author with user_id: ${userId}...`)
  const supabase = createSafeSupabaseClient()

  if (!supabase) {
    console.log("Supabase not available, returning null for author by user ID.")
    return null
  }

  try {
    const { data: dbAuthor, error } = await supabase.from("authors").select("*").eq("user_id", userId).single()

    if (error || !dbAuthor) {
      console.error("Error fetching author by user_id from Supabase:", error)
      return null
    }

    console.log(`Found author by user_id: ${dbAuthor.name}`)
    return {
      id: dbAuthor.id,
      name: dbAuthor.name,
      avatar: dbAuthor.avatar,
      psnId: dbAuthor.psn_id,
      instagram: dbAuthor.instagram,
      twitter: dbAuthor.twitter,
      bio: dbAuthor.bio,
      user_id: dbAuthor.user_id,
      role: dbAuthor.role,
      created_at: dbAuthor.created_at,
      updated_at: dbAuthor.updated_at,
    }
  } catch (error) {
    console.error("Unexpected error fetching author by user_id:", error)
    return null
  }
}

// Function to save or update a genre
async function saveGenre(name: string): Promise<string> {
  const supabase = createSafeSupabaseClient()

  if (!supabase) {
    return ""
  }

  try {
    // Check if genre already exists
    const { data: existingGenre } = await supabase.from("genres").select("id").eq("name", name).single()

    if (existingGenre) {
      return existingGenre.id
    }

    // If doesn't exist, create new
    const { data, error } = await supabase.from("genres").insert({ name }).select().single()

    if (error) {
      console.error("Error creating genre:", error)
      return ""
    }

    return data.id
  } catch (error) {
    console.error("Error saving genre:", error)
    return ""
  }
}

// Function to save or update a tag
async function saveTag(name: string): Promise<string> {
  const supabase = createSafeSupabaseClient()

  if (!supabase) {
    return ""
  }

  try {
    // Check if tag already exists
    const { data: existingTag } = await supabase.from("tags").select("id").eq("name", name).single()

    if (existingTag) {
      return existingTag.id
    }

    // If doesn't exist, create new
    const { data, error } = await supabase.from("tags").insert({ name }).select().single()

    if (error) {
      console.error("Error creating tag:", error)
      return ""
    }

    return data.id
  } catch (error) {
    console.error("Error saving tag:", error)
    return ""
  }
}

// Function to fetch all reviews
export async function getReviews(): Promise<Review[]> {
  console.log("Fetching reviews...")

  const supabase = createSafeSupabaseClient()

  if (!supabase) {
    console.log("Using mock data for reviews - Supabase not available")
    return sampleReviews
  }

  try {
    console.log("Attempting to fetch reviews from Supabase...")

    const dbReviews = await retrySupabaseOperation(async () => {
      const { data, error } = await supabase.from("reviews").select("*").order("created_at", { ascending: false })

      if (error) throw error
      return data
    }, "Fetch Reviews")

    if (!dbReviews || dbReviews.length === 0) {
      console.log("No reviews found in database, using mock data")
      return sampleReviews
    }

    console.log(`Found ${dbReviews.length} reviews in database`)

    const reviews = await Promise.all(
      dbReviews.map(async (dbReview: DbReview) => {
        try {
          return await convertDbReviewToReview(dbReview, supabase)
        } catch (conversionError) {
          console.warn("Error converting review:", conversionError)
          return {
            id: dbReview.id,
            title: dbReview.title,
            slug: dbReview.slug,
            content: dbReview.content,
            image: dbReview.image,
            type: "review" as const,
            createdAt: dbReview.created_at,
            updatedAt: dbReview.updated_at,
            rating: dbReview.rating,
            gameName: dbReview.game_name,
            genres: [],
            tags: [],
            author_id: dbReview.author_id,
            platinaGuide: dbReview.platina_guide,
            additionalImages: [],
          }
        }
      }),
    )

    console.log("Successfully converted reviews")
    return reviews
  } catch (error) {
    console.error("Supabase error fetching reviews:", error)
    console.log("Falling back to mock data for reviews")
    return sampleReviews
  }
}

// Function to fetch all news
export async function getNews(): Promise<News[]> {
  console.log("Fetching news...")

  const supabase = createSafeSupabaseClient()

  if (!supabase) {
    console.log("Using mock data for news - Supabase not available")
    return sampleNews
  }

  try {
    console.log("Attempting to fetch news from Supabase...")

    const dbNews = await retrySupabaseOperation(async () => {
      const { data, error } = await supabase.from("news").select("*").order("created_at", { ascending: false })

      if (error) throw error
      return data
    }, "Fetch News")

    if (!dbNews || dbNews.length === 0) {
      console.log("No news found in database, using mock data")
      return sampleNews
    }

    console.log(`Found ${dbNews.length} news items in database`)

    const news = await Promise.all(
      dbNews.map(async (dbNewsItem: DbNews) => {
        try {
          return await convertDbNewsToNews(dbNewsItem, supabase)
        } catch (conversionError) {
          console.warn("Error converting news:", conversionError)
          return {
            id: dbNewsItem.id,
            title: dbNewsItem.title,
            slug: dbNewsItem.slug,
            content: dbNewsItem.content,
            image: dbNewsItem.image,
            type: "news" as const,
            createdAt: dbNewsItem.created_at,
            updatedAt: dbNewsItem.updated_at,
            author_id: dbNewsItem.author_id,
          }
        }
      }),
    )

    console.log("Successfully converted news")
    return news
  } catch (error) {
    console.error("Supabase error fetching news:", error)
    console.log("Falling back to mock data for news")
    return sampleNews
  }
}

// Function to fetch all guides
export async function getGuides(): Promise<Guide[]> {
  console.log("Fetching guides...")

  const supabase = createSafeSupabaseClient()

  if (!supabase) {
    console.log("Using mock data for guides - Supabase not available")
    return [sampleGuide]
  }

  try {
    console.log("Attempting to fetch guides from Supabase...")

    const dbGuides = await retrySupabaseOperation(async () => {
      const { data, error } = await supabase.from("guides").select("*").order("created_at", { ascending: false })

      if (error) throw error
      return data
    }, "Fetch Guides")

    if (!dbGuides || dbGuides.length === 0) {
      console.log("No guides found in database, using mock data")
      return [sampleGuide]
    }

    console.log(`Found ${dbGuides.length} guides in database`)

    const guides = await Promise.all(
      dbGuides.map(async (dbGuide: DbGuide) => {
        try {
          return await convertDbGuideToGuide(dbGuide, supabase)
        } catch (conversionError) {
          console.warn("Error converting guide:", conversionError)
          return {
            id: dbGuide.id,
            title: dbGuide.title,
            slug: dbGuide.slug,
            content: dbGuide.content,
            image: dbGuide.image,
            type: "guide" as const,
            createdAt: dbGuide.created_at,
            updatedAt: dbGuide.updated_at,
            gameName: dbGuide.game_name,
            difficulty: dbGuide.difficulty,
            estimatedTime: dbGuide.estimated_time,
            author_id: dbGuide.author_id,
            tags: [],
            steps: [],
          }
        }
      }),
    )

    console.log("Successfully converted guides")
    return guides
  } catch (error) {
    console.error("Supabase error fetching guides:", error)
    console.log("Falling back to mock data for guides")
    return [sampleGuide]
  }
}

// Function to fetch all posts (reviews, news and guides)
export async function getAllPosts(): Promise<AllPosts[]> {
  try {
    const [reviews, news, guides] = await Promise.all([
      getReviews().catch(() => []),
      getNews().catch(() => []),
      getGuides().catch(() => []),
    ])

    return [...reviews, ...news, ...guides].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
  } catch (error) {
    console.error("Error fetching all posts:", error)
    return [...sampleReviews, ...sampleNews, sampleGuide].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
  }
}

// Function to fetch a review by slug
export async function getReviewBySlug(slug: string): Promise<Review | null> {
  const supabase = createSafeSupabaseClient()

  if (!supabase) {
    return sampleReviews.find((r) => r.slug === slug) || null
  }

  try {
    const { data: dbReviews, error } = await supabase.from("reviews").select("*").eq("slug", slug)

    if (error) {
      console.error("Error fetching review by slug from Supabase:", error)
      return sampleReviews.find((r) => r.slug === slug) || null
    }

    if (!dbReviews || dbReviews.length === 0) {
      console.log(`Review with slug "${slug}" not found`)
      return sampleReviews.find((r) => r.slug === slug) || null
    }

    const dbReview = dbReviews[0]
    return await convertDbReviewToReview(dbReview, supabase)
  } catch (error) {
    console.error("Error fetching review by slug:", error)
    return sampleReviews.find((r) => r.slug === slug) || null
  }
}

// Function to fetch news by slug
export async function getNewsBySlug(slug: string): Promise<News | null> {
  const supabase = createSafeSupabaseClient()

  if (!supabase) {
    return sampleNews.find((n) => n.slug === slug) || null
  }

  try {
    const { data: dbNewsArray, error } = await supabase.from("news").select("*").eq("slug", slug)

    if (error) {
      console.error("Error fetching news by slug from Supabase:", error)
      return sampleNews.find((n) => n.slug === slug) || null
    }

    if (!dbNewsArray || dbNewsArray.length === 0) {
      console.log(`News with slug "${slug}" not found`)
      return sampleNews.find((n) => n.slug === slug) || null
    }

    const dbNews = dbNewsArray[0]
    return await convertDbNewsToNews(dbNews, supabase)
  } catch (error) {
    console.error("Error fetching news by slug:", error)
    return sampleNews.find((n) => n.slug === slug) || null
  }
}

// Function to fetch guide by slug
export async function getGuideBySlug(slug: string): Promise<Guide | null> {
  const supabase = createSafeSupabaseClient()

  if (!supabase) {
    return sampleGuide.slug === slug ? sampleGuide : null
  }

  try {
    const { data: dbGuides, error } = await supabase.from("guides").select("*").eq("slug", slug)

    if (error) {
      console.error("Error fetching guide by slug from Supabase:", error)
      return sampleGuide.slug === slug ? sampleGuide : null
    }

    if (!dbGuides || dbGuides.length === 0) {
      console.log(`Guide with slug "${slug}" not found`)
      return sampleGuide.slug === slug ? sampleGuide : null
    }

    const dbGuide = dbGuides[0]
    return await convertDbGuideToGuide(dbGuide, supabase)
  } catch (error) {
    console.error("Error fetching guide by slug:", error)
    return sampleGuide.slug === slug ? sampleGuide : null
  }
}

// Function to fetch review by ID
export async function getReviewById(id: string): Promise<Review | null> {
  const supabase = createSafeSupabaseClient()

  if (!supabase) {
    return sampleReviews.find((r) => r.id === id) || null
  }

  try {
    const { data: dbReview, error } = await supabase.from("reviews").select("*").eq("id", id).single()

    if (error || !dbReview) {
      console.error("Error fetching review by ID from Supabase:", error)
      return sampleReviews.find((r) => r.id === id) || null
    }

    return await convertDbReviewToReview(dbReview, supabase)
  } catch (error) {
    console.error("Error fetching review by ID:", error)
    return sampleReviews.find((r) => r.id === id) || null
  }
}

// Function to fetch news by ID
export async function getNewsById(id: string): Promise<News | null> {
  const supabase = createSafeSupabaseClient()

  if (!supabase) {
    return sampleNews.find((n) => n.id === id) || null
  }

  try {
    const { data: dbNews, error } = await supabase.from("news").select("*").eq("id", id).single()

    if (error || !dbNews) {
      console.error("Error fetching news by ID from Supabase:", error)
      return sampleNews.find((n) => n.id === id) || null
    }

    return await convertDbNewsToNews(dbNews, supabase)
  } catch (error) {
    console.error("Error fetching news by ID:", error)
    return sampleNews.find((n) => n.id === id) || null
  }
}

// Function to fetch guide by ID
export async function getGuideById(id: string): Promise<Guide | null> {
  const supabase = createSafeSupabaseClient()

  if (!supabase) {
    return sampleGuide.id === id ? sampleGuide : null
  }

  try {
    const { data: dbGuide, error } = await supabase.from("guides").select("*").eq("id", id).single()

    if (error || !dbGuide) {
      console.error("Error fetching guide by ID from Supabase:", error)
      return sampleGuide.id === id ? sampleGuide : null
    }

    return await convertDbGuideToGuide(dbGuide, supabase)
  } catch (error) {
    console.error("Error fetching guide by ID:", error)
    return sampleGuide.id === id ? sampleGuide : null
  }
}

// Function to get or create default author
async function getOrCreateDefaultAuthor(): Promise<string | null> {
  const supabase = createSafeSupabaseClient()

  if (!supabase) {
    return null
  }

  try {
    // Try to fetch default author "Admin"
    const { data: existingAuthor } = await supabase.from("authors").select("id").eq("name", "Admin").single()

    if (existingAuthor) {
      return existingAuthor.id
    }

    // If default author doesn't exist, create it
    const defaultAuthorId = uuidv4()
    const { data: newAuthor, error } = await supabase
      .from("authors")
      .insert({
        id: defaultAuthorId,
        name: "Admin",
        avatar: "/placeholder.svg?height=100&width=100",
        psn_id: "PlatinaNews",
        bio: "Equipe PlatinaNews",
        role: "admin",
      })
      .select()
      .single()

    if (error) {
      console.error("Error creating default author:", error)
      return null
    }

    console.log("Default author 'Admin' created successfully")
    return newAuthor.id
  } catch (error) {
    console.error("Error getting/creating default author:", error)
    return null
  }
}

// Function to save or update a review
export async function saveReview(review: Review): Promise<void> {
  const supabase = createSafeSupabaseClient()

  if (!supabase) {
    console.log("Supabase not available, cannot save review")
    return
  }

  try {
    // If author_id is not provided, use default author
    let authorId = review.author_id
    if (!authorId) {
      authorId = await getOrCreateDefaultAuthor()
    }

    // Prepare data for the review to be saved in the database
    const dbReview = {
      title: review.title,
      slug: review.slug,
      content: review.content,
      image: review.image,
      rating: review.rating,
      game_name: review.gameName,
      author_id: authorId, // Use authorId (default or provided)
      platina_guide: review.platinaGuide,
      updated_at: new Date().toISOString(),
    }

    // If the review already exists, update it
    if (review.id) {
      const { error } = await supabase.from("reviews").update(dbReview).eq("id", review.id)

      if (error) {
        console.error("Error updating review:", error)
        throw error
      }
    } else {
      // If it doesn't exist, create a new one with a valid UUID
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
        console.error("Error creating review:", error)
        return
      }

      review.id = data.id
    }

    // Save genres
    if (review.genres && review.genres.length > 0) {
      // First, remove existing relationships
      await supabase.from("review_genres").delete().eq("review_id", review.id)

      // Then, add new relationships
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

    // Save tags
    if (review.tags && review.tags.length > 0) {
      // First, remove existing relationships
      await supabase.from("review_tags").delete().eq("review_id", review.id)

      // Then, add new relationships
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

    // Save additional images
    if (review.additionalImages && review.additionalImages.length > 0) {
      // First, remove existing images
      await supabase.from("additional_images").delete().eq("review_id", review.id)

      // Then, add new images
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
    console.log("Review saved successfully")
  } catch (error) {
    console.error("Error saving review:", error)
    throw error
  }
}

// Function to save or update news
export async function saveNews(news: News): Promise<void> {
  const supabase = createSafeSupabaseClient()

  if (!supabase) {
    console.log("Supabase not available, cannot save news")
    return
  }

  try {
    // If author_id is not provided, use default author
    let authorId = news.author_id
    if (!authorId) {
      authorId = await getOrCreateDefaultAuthor()
    }

    // Prepare data for the news to be saved in the database
    const dbNews = {
      title: news.title,
      slug: news.slug,
      content: news.content,
      image: news.image,
      author_id: authorId, // Use authorId (default or provided)
      updated_at: new Date().toISOString(),
    }

    // If the news already exists, update it
    if (news.id) {
      const { error } = await supabase.from("news").update(dbNews).eq("id", news.id)

      if (error) {
        console.error("Error updating news:", error)
        return
      }
    } else {
      // If it doesn't exist, create a new one with a valid UUID
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
        console.error("Error creating news:", error)
        return
      }

      news.id = data.id
    }
    console.log("News saved successfully")
  } catch (error) {
    console.error("Error saving news:", error)
    throw error
  }
}

// Function to save or update a guide
export async function saveGuide(guide: Guide): Promise<void> {
  const supabase = createSafeSupabaseClient()

  if (!supabase) {
    console.log("Supabase not available, cannot save guide")
    return
  }

  try {
    // If author_id is not provided, use default author
    let authorId = guide.author_id
    if (!authorId) {
      authorId = await getOrCreateDefaultAuthor()
    }

    // Prepare data for the guide to be saved in the database
    const dbGuide = {
      title: guide.title,
      slug: guide.slug,
      content: guide.content,
      image: guide.image,
      game_name: guide.gameName,
      difficulty: guide.difficulty,
      estimated_time: guide.estimatedTime,
      author_id: authorId, // Use authorId (default or provided)
      updated_at: new Date().toISOString(),
    }

    // If the guide already exists, update it
    if (guide.id) {
      const { error } = await supabase.from("guides").update(dbGuide).eq("id", guide.id)

      if (error) {
        console.error("Error updating guide:", error)
        return
      }
    } else {
      // If it doesn't exist, create a new one with a valid UUID
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
        console.error("Error creating guide:", error)
        return
      }

      guide.id = data.id
    }

    // Save tags
    if (guide.tags && guide.tags.length > 0) {
      // First, remove existing relationships
      await supabase.from("guide_tags").delete().eq("guide_id", guide.id)

      // Then, add new relationships
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

    // Save guide steps
    if (guide.steps && guide.steps.length > 0) {
      // First, remove existing steps
      await supabase.from("guide_steps").delete().eq("guide_id", guide.id)

      // Then, add new steps
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
    console.log("Guide saved successfully")
  } catch (error) {
    console.error("Error saving guide:", error)
    throw error
  }
}

export async function deleteReview(id: string): Promise<void> {
  const supabase = createSafeSupabaseClient()

  if (!supabase) {
    console.log("Supabase not available, cannot delete review")
    throw new Error("Banco de dados não disponível")
  }

  try {
    await retrySupabaseOperation(async () => {
      const { error } = await supabase.from("reviews").delete().eq("id", id)
      if (error) throw error
      return true
    }, `Delete Review ${id}`)
    console.log(`Review ${id} deleted successfully`)
  } catch (error) {
    console.error("Error deleting review:", error)
    throw new Error("Erro ao excluir review. Tente novamente.")
  }
}

export async function deleteNews(id: string): Promise<void> {
  const supabase = createSafeSupabaseClient()

  if (!supabase) {
    console.log("Supabase not available, cannot delete news")
    throw new Error("Banco de dados não disponível")
  }

  try {
    await retrySupabaseOperation(async () => {
      const { error } = await supabase.from("news").delete().eq("id", id)
      if (error) throw error
      return true
    }, `Delete News ${id}`)
    console.log(`News ${id} deleted successfully`)
  } catch (error) {
    console.error("Error deleting news:", error)
    throw new Error("Erro ao excluir notícia. Tente novamente.")
  }
}

export async function deleteGuide(id: string): Promise<void> {
  const supabase = createSafeSupabaseClient()

  if (!supabase) {
    console.log("Supabase not available, cannot delete guide")
    throw new Error("Banco de dados não disponível")
  }

  try {
    await retrySupabaseOperation(async () => {
      const { error } = await supabase.from("guides").delete().eq("id", id)
      if (error) throw error
      return true
    }, `Delete Guide ${id}`)
    console.log(`Guide ${id} deleted successfully`)
  } catch (error) {
    console.error("Error deleting guide:", error)
    throw new Error("Erro ao excluir guia. Tente novamente.")
  }
}

export async function deleteAuthor(id: string): Promise<void> {
  const supabase = createSafeSupabaseClient()

  if (!supabase) {
    console.log("Supabase not available, cannot delete author")
    return
  }

  try {
    // Before deleting the author, you might want to reassign posts or set author_id to NULL
    // For simplicity, here we just delete the author.
    // In a real system, you would have a referential integrity policy.
    const { error } = await supabase.from("authors").delete().eq("id", id)
    if (error) throw error
    console.log(`Author with ID ${id} deleted successfully.`)
  } catch (error) {
    console.error("Error deleting author:", error)
    throw error
  }
}

// These functions are maintained for compatibility
export function ensureDataDir() {
  // No-op in this version
}

export function seedDatabaseIfEmpty() {
  // No-op in this version
}
