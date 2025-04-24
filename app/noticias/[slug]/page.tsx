import { getNewsBySlug, getNews } from "@/lib/data"
import { notFound } from "next/navigation"
import Image from "next/image"
import { formatDate } from "@/lib/utils"
import { ArrowLeft, Share2, Clock } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import NewsCard from "@/components/news-card"

interface NoticiaPageProps {
  params: {
    slug: string
  }
}

export default function NoticiaPage({ params }: NoticiaPageProps) {
  const news = getNewsBySlug(params.slug)

  if (!news) {
    notFound()
  }

  // Pegar outras notícias
  const allNews = getNews()
  const otherNews = allNews
    .filter((n) => n.id !== news.id)
    .sort(() => 0.5 - Math.random()) // Ordem aleatória
    .slice(0, 4)

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <Link href="/noticias" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar para notícias
        </Link>
      </div>

      <article className="space-y-8">
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                <Clock className="h-4 w-4" />
                <span>{formatDate(news.createdAt)}</span>
                <span>•</span>
                <span>Por Editor PlatinaNews</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-black tracking-tight magazine-title">{news.title}</h1>
            </div>
            <div>
              <Button variant="outline" size="icon">
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="relative aspect-video w-full overflow-hidden rounded-lg">
            <Image
              src={news.image || "/placeholder.svg?height=400&width=800"}
              alt={news.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>

        <div className="prose prose-invert max-w-none">
          {news.content.split("\n\n").map((paragraph, index) => (
            <p key={index} className="mb-4">
              {paragraph}
            </p>
          ))}
        </div>
      </article>

      {otherNews.length > 0 && (
        <section className="mt-16 pt-8 border-t border-border/50">
          <h2 className="text-2xl font-bold mb-6">Mais Notícias</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {otherNews.map((item) => (
              <NewsCard key={item.id} news={item} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
