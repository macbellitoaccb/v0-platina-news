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

      {tip.image && <img src={tip.image || "/placeholder.svg"} alt={tip.title} className="w-full rounded-lg" />}

      <div className="prose prose-invert max-w-none">
        <div dangerouslySetInnerHTML={{ __html: tip.content }} />
      </div>
    </div>
  )
}
