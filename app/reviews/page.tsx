import { getReviews } from "@/lib/data"
import ReviewCard from "@/components/review-card"
import { Trophy } from "lucide-react"

export default function ReviewsPage() {
  const reviews = getReviews()

  // Agrupar reviews por rating
  const platinumReviews = reviews.filter((review) => review.rating === "platinum")
  const goldReviews = reviews.filter((review) => review.rating === "gold")
  const silverReviews = reviews.filter((review) => review.rating === "silver")
  const bronzeReviews = reviews.filter((review) => review.rating === "bronze")

  return (
    <div className="space-y-12">
      <div className="section-highlight">
        <h1 className="text-3xl font-black tracking-tight mb-2">REVIEWS DE GAMES</h1>
        <p className="text-muted-foreground">
          Confira nossas análises detalhadas dos últimos lançamentos e clássicos do mundo dos games.
        </p>
      </div>

      {/* Platinum Reviews */}
      {platinumReviews.length > 0 && (
        <section className="space-y-6">
          <div className="flex items-center gap-2">
            <Trophy className="h-5 w-5 trophy-platinum" />
            <h2 className="text-2xl font-bold">Jogos Platina</h2>
            <span className="text-sm text-muted-foreground ml-2">Obras-primas</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {platinumReviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>
        </section>
      )}

      {/* Gold Reviews */}
      {goldReviews.length > 0 && (
        <section className="space-y-6">
          <div className="flex items-center gap-2">
            <Trophy className="h-5 w-5 trophy-gold" />
            <h2 className="text-2xl font-bold">Jogos Ouro</h2>
            <span className="text-sm text-muted-foreground ml-2">Muito bons</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {goldReviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>
        </section>
      )}

      {/* Silver Reviews */}
      {silverReviews.length > 0 && (
        <section className="space-y-6">
          <div className="flex items-center gap-2">
            <Trophy className="h-5 w-5 trophy-silver" />
            <h2 className="text-2xl font-bold">Jogos Prata</h2>
            <span className="text-sm text-muted-foreground ml-2">Medianos</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {silverReviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>
        </section>
      )}

      {/* Bronze Reviews */}
      {bronzeReviews.length > 0 && (
        <section className="space-y-6">
          <div className="flex items-center gap-2">
            <Trophy className="h-5 w-5 trophy-bronze" />
            <h2 className="text-2xl font-bold">Jogos Bronze</h2>
            <span className="text-sm text-muted-foreground ml-2">Fracos</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bronzeReviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>
        </section>
      )}

      {reviews.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Nenhuma review encontrada.</p>
        </div>
      )}
    </div>
  )
}
