import Link from "next/link"
import Image from "next/image"
import type { News } from "@/lib/types"
import { formatDate } from "@/lib/utils"
import { cn } from "@/lib/utils"
import { ArrowRight } from "lucide-react"

interface NewsCardProps {
  news: News
  featured?: boolean
  variant?: "default" | "cover" | "minimal"
}

export default function NewsCard({ news, featured = false, variant = "default" }: NewsCardProps) {
  if (variant === "cover") {
    return (
      <Link href={`/noticias/${news.slug}`} className="group h-full">
        <div className="magazine-card card-hover relative h-full overflow-hidden rounded-lg">
          <div className="absolute inset-0">
            <Image
              src={news.image || "/placeholder.svg?height=400&width=600"}
              alt={news.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-transparent"></div>

          <div className="absolute bottom-0 left-0 right-0 p-4">
            <div className="mb-2">
              <span className="inline-block bg-primary text-primary-foreground text-xs font-medium px-2 py-1 rounded">
                DESTAQUE
              </span>
            </div>
            <h3 className="magazine-title text-xl font-bold line-clamp-2 mb-1">{news.title}</h3>
            <div className="flex justify-between items-center mt-2">
              <span className="text-xs text-muted-foreground">{formatDate(news.createdAt)}</span>
              <span className="text-xs font-medium text-primary flex items-center gap-1 group-hover:gap-2 transition-all">
                Ler mais <ArrowRight className="h-3 w-3" />
              </span>
            </div>
          </div>
        </div>
      </Link>
    )
  }

  if (variant === "minimal") {
    return (
      <Link href={`/noticias/${news.slug}`} className="group">
        <div className="flex items-center gap-3 py-3">
          <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md">
            <Image
              src={news.image || "/placeholder.svg?height=100&width=100"}
              alt={news.title}
              fill
              className="object-cover"
              sizes="64px"
            />
          </div>
          <div>
            <h3 className="text-sm font-medium line-clamp-2 group-hover:text-primary transition-colors">
              {news.title}
            </h3>
            <p className="text-xs text-muted-foreground mt-1">{formatDate(news.createdAt)}</p>
          </div>
        </div>
      </Link>
    )
  }

  // Default variant
  return (
    <Link href={`/noticias/${news.slug}`} className="group">
      <div className={cn("magazine-card card-hover overflow-hidden rounded-lg", featured ? "h-full" : "")}>
        <div className="relative aspect-video">
          <Image
            src={news.image || "/placeholder.svg?height=400&width=600"}
            alt={news.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
        <div className="p-4">
          <h3 className={cn("magazine-title line-clamp-2", featured ? "text-xl" : "text-lg")}>{news.title}</h3>
          {featured && <p className="mt-2 text-sm line-clamp-3">{news.content.substring(0, 150)}...</p>}
        </div>
        <div className="px-4 pb-4 pt-0 flex justify-between items-center">
          <span className="text-xs text-muted-foreground">{formatDate(news.createdAt)}</span>
          <span className="text-xs font-medium text-primary flex items-center gap-1 group-hover:gap-2 transition-all">
            Ler mais <ArrowRight className="h-3 w-3" />
          </span>
        </div>
      </div>
    </Link>
  )
}
