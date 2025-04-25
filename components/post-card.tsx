import Link from "next/link"
import Image from "next/image"
import type { AllPosts } from "@/lib/types"
import { formatDate } from "@/lib/utils"
import TrophyIcon from "./trophy-icon"

interface PostCardProps {
  post: AllPosts
}

export default function PostCard({ post }: PostCardProps) {
  const isReview = post.type === "review"
  const postUrl = isReview ? `/reviews/${post.slug}` : `/noticias/${post.slug}`

  return (
    <Link href={postUrl} className="group">
      <div className="magazine-card card-hover overflow-hidden rounded-lg h-full">
        <div className="relative aspect-video">
          <Image
            src={post.image || "/placeholder.svg?height=400&width=600"}
            alt={post.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          {isReview && (
            <div className="absolute top-0 right-0 m-3 bg-background/80 backdrop-blur-sm p-2 rounded-md">
              <TrophyIcon rating={(post as any).rating} size="md" showLabel showDescription vertical />
            </div>
          )}
          <div className="absolute top-0 left-0 m-3">
            <span className={`text-xs font-medium px-2 py-1 rounded ${isReview ? "bg-purple-600" : "bg-blue-600"}`}>
              {isReview ? "REVIEW" : "NOTÍCIA"}
            </span>
          </div>
        </div>
        <div className="p-4">
          <h3 className="magazine-title text-lg line-clamp-2">{isReview ? (post as any).gameName : post.title}</h3>
          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
            {isReview ? post.title : post.content.substring(0, 100) + "..."}
          </p>
        </div>
        <div className="px-4 pb-4 pt-0 flex justify-between items-center">
          <span className="text-xs text-muted-foreground">{formatDate(post.createdAt)}</span>
        </div>
      </div>
    </Link>
  )
}
