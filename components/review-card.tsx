import { cn } from "@/lib/utils"
import Link from "next/link"
import Image from "next/image"
import type { Review } from "@/lib/types"
import { formatDate } from "@/lib/utils"
import TrophyIcon from "./trophy-icon"

interface ReviewCardProps {
  review: Review
  featured?: boolean
  variant?: "default" | "cover" | "horizontal"
}

export default function ReviewCard({ review, featured = false, variant = "default" }: ReviewCardProps) {
  if (variant === "cover") {
    return (
      <Link href={`/reviews/${review.slug}`} className="group h-full">
        <div className="magazine-card card-hover relative h-full overflow-hidden rounded-lg">
          <div className="absolute inset-0">
            <Image
              src={review.image || "/placeholder.svg?height=600&width=400"}
              alt={review.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-transparent"></div>

          <div className="absolute bottom-0 left-0 right-0 p-4">
            <div className="mb-2 flex justify-between items-center">
              <div className="flex flex-wrap gap-1">
                {review.genres.slice(0, 1).map((genre) => (
                  <span key={genre} className="game-tag">
                    {genre}
                  </span>
                ))}
              </div>
              <TrophyIcon rating={review.rating} />
            </div>
            <h3 className="magazine-title text-xl font-bold line-clamp-2 mb-1">{review.gameName}</h3>
            <p className="text-sm text-muted-foreground line-clamp-2">{review.title}</p>
          </div>
        </div>
      </Link>
    )
  }

  if (variant === "horizontal") {
    return (
      <Link href={`/reviews/${review.slug}`} className="group h-full">
        <div className="magazine-card card-hover flex overflow-hidden rounded-lg h-full">
          <div className="relative w-1/3">
            <Image
              src={review.image || "/placeholder.svg?height=200&width=300"}
              alt={review.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="33vw"
            />
          </div>
          <div className="w-2/3 p-3 flex flex-col justify-between">
            <div>
              <h3 className="font-bold line-clamp-1">{review.gameName}</h3>
              <p className="text-xs text-muted-foreground line-clamp-2 mt-1">{review.title}</p>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-muted-foreground">{formatDate(review.createdAt)}</span>
              <TrophyIcon rating={review.rating} size="sm" />
            </div>
          </div>
        </div>
      </Link>
    )
  }

  // Default variant
  return (
    <Link href={`/reviews/${review.slug}`} className="group">
      <div className={cn("magazine-card card-hover overflow-hidden rounded-lg", featured ? "h-full" : "")}>
        <div className="relative aspect-video">
          <Image
            src={review.image || "/placeholder.svg?height=400&width=600"}
            alt={review.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute top-0 right-0 m-3 bg-background/80 backdrop-blur-sm p-1 rounded-md">
            <TrophyIcon rating={review.rating} />
          </div>
        </div>
        <div className="p-4">
          <h3 className={cn("magazine-title line-clamp-2", featured ? "text-xl" : "text-lg")}>{review.gameName}</h3>
          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{review.title}</p>
          {featured && <p className="mt-2 text-sm line-clamp-3">{review.content.substring(0, 150)}...</p>}
        </div>
        <div className="px-4 pb-4 pt-0 flex justify-between items-center">
          <div className="flex flex-wrap gap-1">
            {review.genres.slice(0, 2).map((genre) => (
              <span key={genre} className="game-tag">
                {genre}
              </span>
            ))}
          </div>
          <span className="text-xs text-muted-foreground">{formatDate(review.createdAt)}</span>
        </div>
      </div>
    </Link>
  )
}
