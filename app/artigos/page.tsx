import { getArticles } from "@/lib/data"
import Link from "next/link"
import { formatDate } from "@/lib/utils"
import { BookOpen } from "lucide-react"

export default async function ArtigosPage() {
  const articles = await getArticles()
  const sortedArticles = [...articles].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

  return (
    <div className="space-y-12">
      <div className="section-highlight">
        <h1 className="text-3xl font-black tracking-tight mb-2">ARTIGOS</h1>
        <p className="text-muted-foreground">Leia artigos e análises profundas sobre os melhores games.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedArticles.map((article) => (
          <Link key={article.id} href={`/artigos/${article.slug}`} className="group">
            <div className="rounded-lg border overflow-hidden hover:border-primary transition-colors">
              <div className="aspect-video bg-muted relative overflow-hidden">
                {article.image && (
                  <img
                    src={article.image || "/placeholder.svg"}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                )}
              </div>
              <div className="p-4 space-y-2">
                {article.category && <p className="text-xs text-primary font-medium">{article.category}</p>}
                <h3 className="font-bold line-clamp-2">{article.title}</h3>
                {article.subtitle && <p className="text-sm text-muted-foreground line-clamp-2">{article.subtitle}</p>}
                <p className="text-xs text-muted-foreground">{formatDate(article.createdAt)}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {articles.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">Nenhum artigo encontrado ainda.</p>
        </div>
      )}
    </div>
  )
}
