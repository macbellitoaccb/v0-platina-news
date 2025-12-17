# 📡 API Reference

## Funções de Dados (lib/data.ts)

### Reviews

#### `getReviews(): Promise<Review[]>`

Busca todos os reviews do banco de dados.

```tsx
const reviews = await getReviews()
```

**Retorna:** Array de reviews ordenados por data de criação (mais recentes primeiro).

**Fallback:** Retorna dados mockados se Supabase não estiver disponível.

---

#### `getReviewBySlug(slug: string): Promise<Review | null>`

Busca um review específico pelo slug.

```tsx
const review = await getReviewBySlug("the-last-of-us-part-ii")
```

**Parâmetros:**
- `slug` - URL slug do review

**Retorna:** Review ou null se não encontrado.

---

#### `getReviewById(id: string): Promise<Review | null>`

Busca um review específico pelo ID.

```tsx
const review = await getReviewById("uuid-aqui")
```

**Parâmetros:**
- `id` - UUID do review

**Retorna:** Review ou null se não encontrado.

---

#### `saveReview(review: Review): Promise<void>`

Salva ou atualiza um review.

```tsx
await saveReview({
  id: "uuid-ou-undefined",
  title: "Título do Review",
  slug: "titulo-do-review",
  content: "Conteúdo em Markdown",
  image: "/images/cover.jpg",
  rating: "platinum",
  gameName: "Nome do Jogo",
  genres: ["Ação", "Aventura"],
  tags: ["PS5", "Exclusivo"],
  author_id: "uuid-do-autor",
  platinaGuide: { difficulty: "medium", time: "20h" },
  additionalImages: []
})
```

**Parâmetros:**
- `review` - Objeto Review completo

**Comportamento:**
- Se `review.id` existe: atualiza review existente
- Se `review.id` é undefined: cria novo review

---

#### `deleteReview(id: string): Promise<void>`

Deleta um review.

```tsx
await deleteReview("uuid-aqui")
```

**Parâmetros:**
- `id` - UUID do review

---

### Notícias

#### `getNews(): Promise<News[]>`

Busca todas as notícias.

```tsx
const news = await getNews()
```

**Retorna:** Array de notícias ordenadas por data.

---

#### `getNewsBySlug(slug: string): Promise<News | null>`

Busca uma notícia pelo slug.

```tsx
const news = await getNewsBySlug("ps5-pro-lancamento")
```

---

#### `getNewsById(id: string): Promise<News | null>`

Busca uma notícia pelo ID.

---

#### `saveNews(news: News): Promise<void>`

Salva ou atualiza uma notícia.

```tsx
await saveNews({
  id: "uuid-ou-undefined",
  title: "Título da Notícia",
  slug: "titulo-da-noticia",
  content: "Conteúdo",
  image: "/images/news.jpg",
  author_id: "uuid-do-autor"
})
```

---

#### `deleteNews(id: string): Promise<void>`

Deleta uma notícia.

---

### Guias

#### `getGuides(): Promise<Guide[]>`

Busca todos os guias.

```tsx
const guides = await getGuides()
```

---

#### `getGuideBySlug(slug: string): Promise<Guide | null>`

Busca um guia pelo slug.

---

#### `getGuideById(id: string): Promise<Guide | null>`

Busca um guia pelo ID.

---

#### `saveGuide(guide: Guide): Promise<void>`

Salva ou atualiza um guia.

```tsx
await saveGuide({
  id: "uuid-ou-undefined",
  title: "Guia Platina",
  slug: "guia-platina",
  content: "Conteúdo",
  image: "/images/guide.jpg",
  gameName: "Nome do Jogo",
  difficulty: "medium",
  estimatedTime: "20-30 horas",
  author_id: "uuid-do-autor",
  tags: ["Platina", "Troféus"],
  steps: [
    {
      title: "Passo 1",
      description: "Descrição",
      image: "/images/step1.jpg",
      video: "https://youtube.com/...",
      display_order: 0
    }
  ]
})
```

---

#### `deleteGuide(id: string): Promise<void>`

Deleta um guia.

---

### Autores

#### `getAuthors(): Promise<Author[]>`

Busca todos os autores.

```tsx
const authors = await getAuthors()
```

---

#### `getAuthorById(id: string): Promise<Author | null>`

Busca um autor pelo ID.

---

#### `getAuthorByUserId(userId: string): Promise<Author | null>`

Busca um autor pelo user_id (para autenticação).

---

#### `saveAuthor(author: Author): Promise<string>`

Salva ou atualiza um autor.

```tsx
const authorId = await saveAuthor({
  id: "uuid-ou-undefined",
  name: "Nome do Autor",
  avatar: "/avatars/autor.jpg",
  psnId: "psn_id",
  instagram: "@instagram",
  twitter: "@twitter",
  bio: "Biografia do autor",
  user_id: "uuid-do-usuario",
  role: "editor"
})
```

**Retorna:** UUID do autor criado/atualizado.

---

#### `deleteAuthor(id: string): Promise<void>`

Deleta um autor.

---

### Posts Combinados

#### `getAllPosts(): Promise<AllPosts[]>`

Busca todos os posts (reviews + notícias + guias) ordenados por data.

```tsx
const allPosts = await getAllPosts()
```

**Retorna:** Array combinado de todos os tipos de posts.

---

## Tipos TypeScript

### Review

```typescript
interface Review {
  id: string
  title: string
  slug: string
  content: string
  image: string
  type: "review"
  createdAt: string
  updatedAt: string
  rating: "bronze" | "silver" | "gold" | "platinum"
  gameName: string
  genres: string[]
  tags: string[]
  author?: Author
  author_id?: string
  platinaGuide?: {
    difficulty: string
    time: string
  }
  additionalImages: {
    id: string
    url: string
    caption?: string
    display_order: number
  }[]
}
```

### News

```typescript
interface News {
  id: string
  title: string
  slug: string
  content: string
  image: string
  type: "news"
  createdAt: string
  updatedAt: string
  author?: Author
  author_id?: string
}
```

### Guide

```typescript
interface Guide {
  id: string
  title: string
  slug: string
  content: string
  image: string
  type: "guide"
  createdAt: string
  updatedAt: string
  gameName: string
  difficulty: "easy" | "medium" | "hard" | "very_hard"
  estimatedTime: string
  author?: Author
  author_id?: string
  tags: string[]
  steps: {
    id: string
    title: string
    description: string
    image?: string
    video?: string
    display_order: number
  }[]
}
```

### Author

```typescript
interface Author {
  id: string
  name: string
  avatar?: string
  psnId?: string
  instagram?: string
  twitter?: string
  bio?: string
  user_id?: string
  role?: string
  created_at?: string
  updated_at?: string
}
```

---

## Utilitários

### `slugify(text: string): string`

Converte texto em slug para URLs.

```tsx
import { slugify } from "@/lib/utils"

const slug = slugify("The Last of Us Part II") // "the-last-of-us-part-ii"
```

---

### `getTrophyInfo(rating: string)`

Retorna informações sobre um troféu.

```tsx
import { getTrophyInfo } from "@/lib/utils"

const info = getTrophyInfo("platinum")
// {
//   label: "Platina",
//   color: "#e5e4e2",
//   description: "Obra-prima"
// }
```

---

### `cn(...inputs: ClassValue[]): string`

Combina classes CSS condicionalmente.

```tsx
import { cn } from "@/lib/utils"

const className = cn(
  "base-class",
  isActive && "active-class",
  props.className
)
```

---

## Variáveis de Ambiente

```env
# Supabase
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...

# Admin
ENABLE_ADMIN=true
```

---

Para mais detalhes, consulte o código-fonte em `/lib/data.ts`.
