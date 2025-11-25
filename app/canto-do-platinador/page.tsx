import { getPlatinadorTips } from "@/lib/data"
import Link from "next/link"
import { formatDate } from "@/lib/utils"
import { Lightbulb } from "lucide-react"

export default async function CantoDoPlatinadorPage() {
  const tips = await getPlatinadorTips()
  const sortedTips = [...tips].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

  return (
    <div className="space-y-12">
      <div className="section-highlight">
        <h1 className="text-3xl font-black tracking-tight mb-2">CANTO DO PLATINADOR</h1>
        <p className="text-muted-foreground">Dicas, macetes e estratégias para conquistar seus troféus Platina!</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {sortedTips.map((tip) => (
          <Link key={tip.id} href={`/canto-do-platinador/${tip.slug}`} className="group">
            <div className="rounded-lg border overflow-hidden hover:border-primary transition-colors">
              <div className="aspect-video bg-muted relative overflow-hidden">
                {tip.image && (
                  <img
                    src={tip.image || "/placeholder.svg"}
                    alt={tip.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                )}
              </div>
              <div className="p-4 space-y-2">
                {tip.category && <p className="text-xs text-primary font-medium">{tip.category}</p>}
                <h3 className="font-bold line-clamp-2">{tip.title}</h3>
                {tip.helpful_count && (
                  <p className="text-xs text-muted-foreground">👍 {tip.helpful_count} pessoas acharam útil</p>
                )}
                <p className="text-xs text-muted-foreground">{formatDate(tip.createdAt)}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {tips.length === 0 && (
        <div className="text-center py-12">
          <Lightbulb className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">Nenhuma dica encontrada ainda.</p>
        </div>
      )}
    </div>
  )
}
