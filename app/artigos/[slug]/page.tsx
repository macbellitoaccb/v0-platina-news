import { getArticleBySlug, getArticles } from "@/lib/data"
import { notFound } from "next/navigation"
import Image from "next/image"
import { formatDate } from "@/lib/utils"
import { ArrowLeft, Share2 } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import AuthorCard from "@/components/author-card"
import YouTubeEmbed from "@/components/youtube-embed"

export default async function ArtigoPage({ params }: { params: { slug: string } }) {
  const article = await getArticleBySlug(params.slug)

  if (!article) {
    notFound()
  }

  const allArticles = await getArticles()
  const relatedArticles = allArticles.filter((a) => a.id !== article.id && a.category === article.category).slice(0, 3)

  const paragraphs = article.content.split("\n\n")

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <Link href="/artigos" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar para Artigos
        </Link>
      </div>

      <article className="space-y-8">
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                <span>{formatDate(article.createdAt)}</span>
                <span>•</span>
                <span>{article.author?.name || "Editor PlatinaNews"}</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-black tracking-tight magazine-title">{article.title}</h1>
              {article.subtitle && <p className="text-xl text-muted-foreground mt-2">{article.subtitle}</p>}
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="icon">
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {article.image && (
            <div className="relative aspect-video w-full overflow-hidden rounded-lg">
              <Image
                src={article.image || "/placeholder.svg?height=400&width=800"}
                alt={article.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          )}

          {article.category && (
            <div className="flex flex-wrap gap-2">
              <span className="game-tag">{article.category}</span>
            </div>
          )}

          <div className="prose prose-invert max-w-none">
            {paragraphs.map((paragraph, index) => (
              <p key={index} className="mb-4">
                {paragraph}
              </p>
            ))}
          </div>

          {article.articleMedia && article.articleMedia.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
              {article.articleMedia
                .filter((media) => media.type === "image")
                .map((media, index) => (
                  <figure key={`img-${index}`} className="my-4">
                    <div className="relative aspect-video w-full overflow-hidden rounded-lg">
                      <Image
                        src={media.url || "/placeholder.svg"}
                        alt={media.caption || `Imagem ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                    {media.caption && (
                      <figcaption className="mt-2 text-center text-sm text-muted-foreground italic">
                        {media.caption}
                      </figcaption>
                    )}
                  </figure>
                ))}
            </div>
          )}

          {article.articleMedia && article.articleMedia.some((m) => m.type === "video") && (
            <div className="my-8 space-y-6">
              <h3 className="text-lg font-semibold">Vídeos</h3>
              {article.articleMedia
                .filter((m) => m.type === "video")
                .map((media, index) => (
                  <div key={`video-${index}`}>
                    <YouTubeEmbed url={media.url} title={media.caption || `Vídeo ${index + 1}`} />
                    {media.caption && (
                      <p className="mt-2 text-center text-sm text-muted-foreground italic">{media.caption}</p>
                    )}
                  </div>
                ))}
            </div>
          )}

          <div className="mt-12 pt-6 border-t border-border/50 space-y-6">
            <h2 className="text-2xl font-bold">Sobre o Autor</h2>
            {article.author && (
              <div>
                <AuthorCard author={article.author} />
              </div>
            )}
          </div>
        </div>

        {relatedArticles.length > 0 && (
          <section className="mt-16 pt-8 border-t border-border/50">
            <h2 className="text-2xl font-bold mb-6">Artigos Relacionados</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedArticles.map((relatedArticle) => (
                <Link key={relatedArticle.id} href={`/artigos/${relatedArticle.slug}`}>
                  <div className="group cursor-pointer">
                    <div className="relative aspect-video overflow-hidden rounded-lg mb-3">
                      <Image
                        src={relatedArticle.image || "/placeholder.svg"}
                        alt={relatedArticle.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <h3 className="font-semibold group-hover:text-primary transition-colors">{relatedArticle.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{formatDate(relatedArticle.createdAt)}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </article>
    </div>
  )
}
