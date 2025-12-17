# 🧩 Guia de Componentes

## Componentes UI (shadcn/ui)

### Button

```tsx
import { Button } from "@/components/ui/button"

<Button variant="default">Clique aqui</Button>
<Button variant="destructive">Deletar</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="link">Link</Button>
```

### Card

```tsx
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

<Card>
  <CardHeader>
    <CardTitle>Título</CardTitle>
  </CardHeader>
  <CardContent>
    Conteúdo do card
  </CardContent>
</Card>
```

### Input

```tsx
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

<div>
  <Label htmlFor="email">Email</Label>
  <Input id="email" type="email" placeholder="seu@email.com" />
</div>
```

### Select

```tsx
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

<Select>
  <SelectTrigger>
    <SelectValue placeholder="Selecione..." />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="1">Opção 1</SelectItem>
    <SelectItem value="2">Opção 2</SelectItem>
  </SelectContent>
</Select>
```

## Componentes Customizados

### ReviewCard

Exibe um card de review com troféu.

```tsx
import ReviewCard from "@/components/review-card"

<ReviewCard 
  review={review}
  variant="default" // ou "cover", "horizontal"
  featured={false}
/>
```

**Props:**
- `review: Review` - Dados do review
- `variant?: "default" | "cover" | "horizontal"` - Estilo do card
- `featured?: boolean` - Destaque especial

### NewsCard

Exibe um card de notícia.

```tsx
import NewsCard from "@/components/news-card"

<NewsCard 
  news={news}
  variant="default" // ou "cover", "minimal"
/>
```

**Props:**
- `news: News` - Dados da notícia
- `variant?: "default" | "cover" | "minimal"` - Estilo do card

### PostCard

Card genérico para reviews ou notícias.

```tsx
import PostCard from "@/components/post-card"

<PostCard post={post} />
```

### Header

Cabeçalho do site com navegação.

```tsx
import Header from "@/components/header"

<Header />
```

### Footer

Rodapé do site.

```tsx
import Footer from "@/components/footer"

<Footer />
```

### AuthorCard

Exibe informações do autor.

```tsx
import AuthorCard from "@/components/author-card"

<AuthorCard author={author} />
```

### TrophyIcon

Ícone de troféu com cor baseada no rating.

```tsx
import TrophyIcon from "@/components/trophy-icon"

<TrophyIcon rating="platinum" className="h-6 w-6" />
```

**Props:**
- `rating: "bronze" | "silver" | "gold" | "platinum"` - Tipo de troféu
- `className?: string` - Classes CSS adicionais

## Formulários

### PostForm

Formulário para criar/editar reviews e notícias.

```tsx
import PostForm from "@/components/post-form"

<PostForm 
  type="review" // ou "news"
  initialData={existingPost}
  onSubmit={handleSubmit}
/>
```

### GuideForm

Formulário para criar/editar guias.

```tsx
import GuideForm from "@/components/guide-form"

<GuideForm 
  initialData={existingGuide}
  onSubmit={handleSubmit}
/>
```

### AuthorForm

Formulário para criar/editar autores.

```tsx
import AuthorForm from "@/components/author-form"

<AuthorForm 
  initialData={existingAuthor}
  onSubmit={handleSubmit}
/>
```

## Hooks Customizados

### useMobile

Detecta se está em dispositivo móvel.

```tsx
import { useMobile } from "@/hooks/use-mobile"

function Component() {
  const isMobile = useMobile()
  
  return isMobile ? <MobileView /> : <DesktopView />
}
```

### useToast

Exibe notificações toast.

```tsx
import { useToast } from "@/hooks/use-toast"

function Component() {
  const { toast } = useToast()
  
  const handleClick = () => {
    toast({
      title: "Sucesso!",
      description: "Operação realizada com sucesso.",
    })
  }
  
  return <button onClick={handleClick}>Clique</button>
}
```

## Utilitários

### cn()

Combina classes CSS condicionalmente.

```tsx
import { cn } from "@/lib/utils"

<div className={cn(
  "base-class",
  isActive && "active-class",
  className
)} />
```

### slugify()

Converte texto em slug para URLs.

```tsx
import { slugify } from "@/lib/utils"

const slug = slugify("Meu Título Aqui") // "meu-titulo-aqui"
```

### getTrophyInfo()

Retorna informações sobre um troféu.

```tsx
import { getTrophyInfo } from "@/lib/utils"

const info = getTrophyInfo("platinum")
// { label: "Platina", color: "#e5e4e2", description: "Obra-prima" }
```

## Estilos Globais

### Classes CSS Customizadas

```css
/* Gradiente gamer */
.gamer-gradient {
  @apply bg-gradient-to-r from-purple-600 via-violet-600 to-fuchsia-600 bg-clip-text text-transparent;
}

/* Título estilo revista */
.magazine-title {
  @apply font-black tracking-tight;
  text-shadow: 0 0 20px rgba(147, 51, 234, 0.3);
}

/* Card com hover */
.card-hover {
  transition: all 0.3s ease;
}

.card-hover:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 25px -5px rgba(147, 51, 234, 0.3);
}

/* Troféus */
.trophy-bronze { color: #cd7f32; }
.trophy-silver { color: #c0c0c0; }
.trophy-gold { color: #ffd700; }
.trophy-platinum { color: #e5e4e2; }
```

## Exemplos de Uso

### Página de Review

```tsx
import { getReviewBySlug } from "@/lib/data"
import ReviewCard from "@/components/review-card"
import AuthorCard from "@/components/author-card"

export default async function ReviewPage({ params }: { params: { slug: string } }) {
  const review = await getReviewBySlug(params.slug)
  
  if (!review) {
    return <div>Review não encontrado</div>
  }
  
  return (
    <div className="space-y-8">
      <ReviewCard review={review} variant="cover" />
      
      <div className="prose prose-invert max-w-none">
        {review.content}
      </div>
      
      {review.author && (
        <AuthorCard author={review.author} />
      )}
    </div>
  )
}
```

### Lista de Reviews

```tsx
import { getReviews } from "@/lib/data"
import ReviewCard from "@/components/review-card"

export default async function ReviewsPage() {
  const reviews = await getReviews()
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {reviews.map(review => (
        <ReviewCard key={review.id} review={review} />
      ))}
    </div>
  )
}
```

---

Para mais detalhes sobre componentes específicos, consulte o código-fonte em `/components`.
