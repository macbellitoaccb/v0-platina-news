import { getNews } from "@/lib/data"
import NewsCard from "@/components/news-card"
import { Newspaper } from "lucide-react"

export default async function NoticiasPage() {
  const news = await getNews()

  // Ordenar notícias por data (mais recentes primeiro)
  const sortedNews = [...news].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

  // Separar a notícia em destaque (a mais recente)
  const featuredNews = sortedNews[0]
  const otherNews = sortedNews.slice(1)

  return (
    <div className="space-y-12">
      <div className="section-highlight">
        <h1 className="text-3xl font-black tracking-tight mb-2">ÚLTIMAS NOTÍCIAS</h1>
        <p className="text-muted-foreground">Fique por dentro das novidades do mundo dos games.</p>
      </div>

      {/* Featured News */}
      {featuredNews && (
        <section className="space-y-6">
          <div className="flex items-center gap-2">
            <Newspaper className="h-5 w-5 text-primary" />
            <h2 className="text-2xl font-bold">Destaque</h2>
          </div>

          <NewsCard news={featuredNews} featured variant="cover" />
        </section>
      )}

      {/* Other News */}
      <section className="space-y-6">
        <div className="flex items-center gap-2">
          <Newspaper className="h-5 w-5 text-primary" />
          <h2 className="text-2xl font-bold">Todas as Notícias</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {otherNews.map((newsItem) => (
            <NewsCard key={newsItem.id} news={newsItem} />
          ))}
        </div>
      </section>

      {news.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Nenhuma notícia encontrada.</p>
        </div>
      )}
    </div>
  )
}
