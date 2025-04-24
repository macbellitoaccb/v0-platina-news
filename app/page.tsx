import { getNews, getReviews } from "@/lib/data"
import ReviewCard from "@/components/review-card"
import NewsCard from "@/components/news-card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight, Star, TrendingUp, Award, Gamepad2 } from "lucide-react"

export default function Home() {
  const reviews = getReviews()
  const news = getNews()

  // Pegar os 5 reviews mais recentes
  const latestReviews = [...reviews]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5)

  // Pegar as 5 notícias mais recentes
  const latestNews = [...news]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5)

  // Pegar os reviews com troféu platina
  const platinumReviews = reviews.filter((review) => review.rating === "platinum").slice(0, 2)

  // Pegar os reviews com troféu ouro
  const goldReviews = reviews.filter((review) => review.rating === "gold").slice(0, 3)

  return (
    <div className="space-y-10">
      {/* Hero Section - Reduzido em altura */}
      <section className="relative -mt-4 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Main Featured - Reduzido em altura */}
          <div className="md:col-span-2">
            {latestReviews[0] && (
              <div className="h-[400px] md:h-[450px]">
                <ReviewCard review={latestReviews[0]} variant="cover" />
              </div>
            )}
          </div>

          {/* Secondary Featured - Ajustado para manter proporção */}
          <div className="grid grid-cols-1 gap-4">
            {latestNews[0] && (
              <div className="h-[220px] md:h-[220px]">
                <NewsCard news={latestNews[0]} variant="cover" />
              </div>
            )}
            {latestReviews[1] && (
              <div className="h-[170px] md:h-[220px]">
                <ReviewCard review={latestReviews[1]} variant="horizontal" />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Latest Reviews Section */}
      <section className="section-highlight">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <Star className="h-5 w-5 text-primary" />
            <h2 className="text-2xl font-black tracking-tight">ÚLTIMAS REVIEWS</h2>
          </div>
          <Link href="/reviews">
            <Button variant="link" className="gap-1 hover:gap-2 transition-all">
              Ver todas <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {latestReviews.slice(0, 4).map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>
      </section>

      {/* Latest News Section */}
      <section className="section-highlight">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            <h2 className="text-2xl font-black tracking-tight">ÚLTIMAS NOTÍCIAS</h2>
          </div>
          <Link href="/noticias">
            <Button variant="link" className="gap-1 hover:gap-2 transition-all">
              Ver todas <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          <div className="md:col-span-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {latestNews.slice(0, 4).map((newsItem) => (
                <NewsCard key={newsItem.id} news={newsItem} />
              ))}
            </div>
          </div>

          <div className="md:col-span-4 border-l border-border/50 pl-4">
            <div className="flex items-center gap-2 mb-3">
              <h3 className="text-lg font-bold">Mais Notícias</h3>
            </div>
            <div className="divide-y divide-border/30">
              {latestNews.slice(4, 9).map((newsItem) => (
                <NewsCard key={newsItem.id} news={newsItem} variant="minimal" />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Platinum Reviews Section */}
      <section className="section-highlight">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <Award className="h-5 w-5 text-primary" />
            <h2 className="text-2xl font-black tracking-tight">JOGOS PLATINA</h2>
          </div>
          <Link href="/reviews?rating=platinum">
            <Button variant="link" className="gap-1 hover:gap-2 transition-all">
              Ver todos <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {platinumReviews.map((review) => (
            <ReviewCard key={review.id} review={review} featured />
          ))}
        </div>
      </section>

      {/* Gold Reviews Section */}
      <section className="section-highlight">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <Gamepad2 className="h-5 w-5 text-primary" />
            <h2 className="text-2xl font-black tracking-tight">RECOMENDADOS</h2>
          </div>
          <Link href="/reviews?rating=gold">
            <Button variant="link" className="gap-1 hover:gap-2 transition-all">
              Ver todos <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {goldReviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>
      </section>
    </div>
  )
}
