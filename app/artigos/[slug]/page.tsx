import { getArticleBySlug } from "@/lib/data"
import { formatDate } from "@/lib/utils"
import { notFound } from "next/navigation"
import { ChevronLeft } from "lucide-react"
import Link from "next/link"

export default async function ArtigoPage({ params }: { params: { slug: string } }) {
  const article = await getArticleBySlug(params.slug)

  if (!article) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <Link href="/artigos" className="flex items-center gap-2 text-primary hover:underline w-fit">
        <ChevronLeft className="h-4 w-4" />
        Voltar para Artigos
      </Link>

      <div className="space-y-4">
        <div>
          {article.category && <p className="text-sm text-primary font-medium mb-2">{article.category}</p>}
          <h1 className="text-4xl font-black">{article.title}</h1>
          {article.subtitle && <p className="text-lg text-muted-foreground mt-2">{article.subtitle}</p>}
        </div>

        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          {article.author && <span>{article.author.name}</span>}
          <span>{formatDate(article.createdAt)}</span>
        </div>
      </div>

      {article.image && (
        <div className="relative aspect-video w-full overflow-hidden rounded-lg">
          <img src={article.image || "/placeholder.svg"} alt={article.title} className="w-full h-full object-cover" />
        </div>
      )}

      <div className="prose prose-invert max-w-none">
        <div dangerouslySetInnerHTML={{ __html: article.content }} />
      </div>

      {article.articleMedia && article.articleMedia.length > 0 && (
        <div className="space-y-6 my-8">
          {article.articleMedia.map((media, idx) => (
            <div key={idx} className="space-y-2">
              {media.type === "image" ? (
                <>
                  <img
                    src={media.url || "/placeholder.svg"}
                    alt={media.caption || `Imagem ${idx + 1}`}
                    className="w-full rounded-lg"
                  />
                  {media.caption && <p className="text-sm text-muted-foreground italic">{media.caption}</p>}
                </>
              ) : (
                <>
                  <div className="aspect-video w-full">
                    <iframe
                      width="100%"
                      height="100%"
                      src={`https://www.youtube.com/embed/${media.url.split("v=")[1]}`}
                      title={media.caption || `Vídeo ${idx + 1}`}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="rounded-lg"
                    />
                  </div>
                  {media.caption && <p className="text-sm text-muted-foreground italic">{media.caption}</p>}
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
