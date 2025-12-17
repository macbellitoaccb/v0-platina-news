import { getPlatinadorTipBySlug, getPlatinadorTips } from "@/lib/data"
import { notFound } from "next/navigation"
import Image from "next/image"
import { formatDate } from "@/lib/utils"
import { ArrowLeft, Share2 } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import AuthorCard from "@/components/author-card"
import YouTubeEmbed from "@/components/youtube-embed"

export default async function PlatinadorTipPage({ params }: { params: { slug: string } }) {
  const tip = await getPlatinadorTipBySlug(params.slug)

  if (!tip) {
    notFound()
  }

  const allTips = await getPlatinadorTips()
  const relatedTips = allTips.filter((t) => t.id !== tip.id && t.category === tip.category).slice(0, 3)

  const paragraphs = tip.content.split("\n\n")

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <Link
          href="/canto-do-platinador"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-primary"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar para Canto do Platinador
        </Link>
      </div>

      <article className="space-y-8">
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                <span>{formatDate(tip.createdAt)}</span>
                <span>•</span>
                <span>{tip.author?.name || "Editor PlatinaNews"}</span>
                {tip.helpful_count && tip.helpful_count > 0 && (
                  <>
                    <span>•</span>
                    <span>👍 {tip.helpful_count} pessoas acharam útil</span>
                  </>
                )}
              </div>
              <h1 className="text-3xl md:text-4xl font-black tracking-tight magazine-title">{tip.title}</h1>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="icon">
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {tip.image && (
            <div className="relative aspect-video w-full overflow-hidden rounded-lg">
              <Image
                src={tip.image || "/placeholder.svg?height=400&width=800"}
                alt={tip.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          )}

          {tip.category && (
            <div className="flex flex-wrap gap-2">
              <span className="game-tag">{tip.category}</span>
            </div>
          )}

          <div className="prose prose-invert max-w-none">
            {paragraphs.map((paragraph, index) => (
              <p key={index} className="mb-4">
                {paragraph}
              </p>
            ))}
          </div>

          {tip.platinadorMedia && tip.platinadorMedia.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
              {tip.platinadorMedia
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

          {tip.platinadorMedia && tip.platinadorMedia.some((m) => m.type === "video") && (
            <div className="my-8 space-y-6">
              <h3 className="text-lg font-semibold">Vídeos</h3>
              {tip.platinadorMedia
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
            {tip.author && (
              <div>
                <AuthorCard author={tip.author} />
              </div>
            )}
          </div>
        </div>

        {relatedTips.length > 0 && (
          <section className="mt-16 pt-8 border-t border-border/50">
            <h2 className="text-2xl font-bold mb-6">Dicas Relacionadas</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedTips.map((relatedTip) => (
                <Link key={relatedTip.id} href={`/canto-do-platinador/${relatedTip.slug}`}>
                  <div className="group cursor-pointer">
                    <div className="relative aspect-video overflow-hidden rounded-lg mb-3">
                      <Image
                        src={relatedTip.image || "/placeholder.svg"}
                        alt={relatedTip.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <h3 className="font-semibold group-hover:text-primary transition-colors">{relatedTip.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{formatDate(relatedTip.createdAt)}</p>
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
