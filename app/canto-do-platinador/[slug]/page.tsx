import { getPlatinadorTipBySlug } from "@/lib/data"
import { formatDate } from "@/lib/utils"
import { notFound } from "next/navigation"
import { ChevronLeft } from "lucide-react"
import Link from "next/link"

export default async function PlatinadorTipPage({ params }: { params: { slug: string } }) {
  const tip = await getPlatinadorTipBySlug(params.slug)

  if (!tip) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <Link href="/canto-do-platinador" className="flex items-center gap-2 text-primary hover:underline w-fit">
        <ChevronLeft className="h-4 w-4" />
        Voltar para Canto do Platinador
      </Link>

      <div className="space-y-4">
        <div>
          {tip.category && <p className="text-sm text-primary font-medium mb-2">{tip.category}</p>}
          <h1 className="text-4xl font-black">{tip.title}</h1>
        </div>

        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          {tip.author && <span>{tip.author.name}</span>}
          <span>{formatDate(tip.createdAt)}</span>
          {tip.helpful_count && <span>👍 {tip.helpful_count} pessoas acharam útil</span>}
        </div>
      </div>

      {tip.image && (
        <div className="relative aspect-video w-full overflow-hidden rounded-lg">
          <img src={tip.image || "/placeholder.svg"} alt={tip.title} className="w-full h-full object-cover" />
        </div>
      )}

      <div className="prose prose-invert max-w-none">
        <div dangerouslySetInnerHTML={{ __html: tip.content }} />
      </div>

      {tip.platinadorMedia && tip.platinadorMedia.length > 0 && (
        <div className="space-y-6 my-8">
          {tip.platinadorMedia.map((media, idx) => (
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
