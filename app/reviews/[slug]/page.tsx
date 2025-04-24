import { getReviewBySlug, getReviews } from "@/lib/data"
import { notFound } from "next/navigation"
import Image from "next/image"
import TrophyIcon from "@/components/trophy-icon"
import { formatDate, getTrophyInfo } from "@/lib/utils"
import { ArrowLeft, Share2 } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import ReviewCard from "@/components/review-card"
import AuthorCard from "@/components/author-card"
import PlatinaGuide from "@/components/platina-guide"

interface ReviewPageProps {
  params: {
    slug: string
  }
}

export default function ReviewPage({ params }: ReviewPageProps) {
  const review = getReviewBySlug(params.slug)

  if (!review) {
    notFound()
  }

  const trophyInfo = getTrophyInfo(review.rating)

  // Pegar reviews relacionadas (mesmo gênero)
  const allReviews = getReviews()
  const relatedReviews = allReviews
    .filter((r) => r.id !== review.id && r.genres.some((g) => review.genres.includes(g)))
    .slice(0, 3)

  // Dividir o conteúdo em parágrafos
  const paragraphs = review.content.split("\n\n")

  // Determinar onde inserir as imagens adicionais
  const hasAdditionalImages = review.additionalImages && review.additionalImages.length > 0

  // Função para renderizar o conteúdo com imagens intercaladas
  const renderContentWithImages = () => {
    if (!hasAdditionalImages) {
      return paragraphs.map((paragraph, index) => (
        <p key={index} className="mb-4">
          {paragraph}
        </p>
      ))
    }

    const content = []
    const imageCount = review.additionalImages!.length

    // Calcular aproximadamente onde inserir cada imagem
    const paragraphsPerImage = Math.max(Math.floor(paragraphs.length / (imageCount + 1)), 1)

    paragraphs.forEach((paragraph, index) => {
      content.push(
        <p key={`p-${index}`} className="mb-4">
          {paragraph}
        </p>,
      )

      // Inserir imagem após alguns parágrafos
      const imageIndex = Math.floor(index / paragraphsPerImage) - 1
      if (imageIndex >= 0 && imageIndex < imageCount && (index + 1) % paragraphsPerImage === 0) {
        const image = review.additionalImages![imageIndex]
        content.push(
          <figure key={`img-${imageIndex}`} className="my-8">
            <div className="relative aspect-video w-full overflow-hidden rounded-lg">
              <Image src={image.url || "/placeholder.svg"} alt={image.caption} fill className="object-cover" />
            </div>
            <figcaption className="mt-2 text-center text-sm text-muted-foreground italic">{image.caption}</figcaption>
          </figure>,
        )
      }
    })

    return content
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <Link href="/reviews" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar para reviews
        </Link>
      </div>

      <article className="space-y-8">
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                <span>{formatDate(review.createdAt)}</span>
                <span>•</span>
                <span>{review.author?.name || "Editor PlatinaNews"}</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-black tracking-tight magazine-title">{review.gameName}</h1>
              <p className="text-xl text-muted-foreground mt-2">{review.title}</p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="icon">
                <Share2 className="h-4 w-4" />
              </Button>
              <div className="flex items-center gap-2 bg-secondary px-4 py-2 rounded-lg">
                <TrophyIcon rating={review.rating} size="lg" showLabel showDescription />
              </div>
            </div>
          </div>

          <div className="relative aspect-video w-full overflow-hidden rounded-lg">
            <Image
              src={review.image || "/placeholder.svg?height=400&width=800"}
              alt={review.title}
              fill
              className="object-cover"
              priority
            />
          </div>

          <div className="flex flex-wrap gap-2 my-4">
            {review.genres.map((genre) => (
              <span key={genre} className="game-tag">
                {genre}
              </span>
            ))}
          </div>
        </div>

        <div className="prose prose-invert max-w-none">{renderContentWithImages()}</div>

        {review.tags.length > 0 && (
          <div className="mt-8 pt-4 border-t border-border/50">
            <h3 className="text-sm font-medium mb-2">Tags:</h3>
            <div className="flex flex-wrap gap-2">
              {review.tags.map((tag) => (
                <span key={tag} className="game-tag">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Ficha técnica */}
        <div className="mt-12 pt-6 border-t border-border/50 space-y-6">
          <h2 className="text-2xl font-bold">Ficha Técnica</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Autor do review */}
            {review.author && (
              <div>
                <h3 className="text-sm uppercase tracking-wider text-muted-foreground mb-2">Autor</h3>
                <AuthorCard author={review.author} />
              </div>
            )}

            {/* Guia de platina */}
            {review.platinaGuide && (
              <div>
                <h3 className="text-sm uppercase tracking-wider text-muted-foreground mb-2">Como Platinar</h3>
                <PlatinaGuide guide={review.platinaGuide} />
              </div>
            )}
          </div>
        </div>
      </article>

      {relatedReviews.length > 0 && (
        <section className="mt-16 pt-8 border-t border-border/50">
          <h2 className="text-2xl font-bold mb-6">Reviews Relacionadas</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedReviews.map((relatedReview) => (
              <ReviewCard key={relatedReview.id} review={relatedReview} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
