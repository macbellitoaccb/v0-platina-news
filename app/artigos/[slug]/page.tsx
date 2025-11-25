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
        <img src={article.image || "/placeholder.svg"} alt={article.title} className="w-full rounded-lg" />
      )}

      <div className="prose prose-invert max-w-none">
        <div dangerouslySetInnerHTML={{ __html: article.content }} />
      </div>
    </div>
  )
}
