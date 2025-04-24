import Image from "next/image"
import { Instagram, Twitter, GamepadIcon as GameController } from "lucide-react"
import type { Author } from "@/lib/types"
import Link from "next/link"

interface AuthorCardProps {
  author: Author
}

export default function AuthorCard({ author }: AuthorCardProps) {
  if (!author) return null

  return (
    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 p-4 bg-secondary/50 rounded-lg">
      <div className="relative h-16 w-16 overflow-hidden rounded-full border-2 border-primary/50">
        <Image
          src={author.avatar || "/placeholder.svg?height=100&width=100"}
          alt={author.name}
          fill
          className="object-cover"
        />
      </div>
      <div className="flex-1 text-center sm:text-left">
        <h3 className="font-bold text-lg">{author.name}</h3>
        <p className="text-sm text-muted-foreground">{author.bio}</p>
        <div className="flex items-center justify-center sm:justify-start gap-4 mt-2">
          {author.psnId && (
            <div className="flex items-center gap-1 text-xs">
              <GameController className="h-3 w-3 text-primary" />
              <span>{author.psnId}</span>
            </div>
          )}
          {author.instagram && (
            <Link
              href={`https://instagram.com/${author.instagram.replace("@", "")}`}
              className="flex items-center gap-1 text-xs hover:text-primary"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Instagram className="h-3 w-3" />
              <span>{author.instagram}</span>
            </Link>
          )}
          {author.twitter && (
            <Link
              href={`https://twitter.com/${author.twitter.replace("@", "")}`}
              className="flex items-center gap-1 text-xs hover:text-primary"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Twitter className="h-3 w-3" />
              <span>{author.twitter}</span>
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}
