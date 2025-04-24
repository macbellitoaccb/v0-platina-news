import { Trophy } from "lucide-react"
import type { TrophyRating } from "@/lib/types"
import { getTrophyInfo } from "@/lib/utils"
import { cn } from "@/lib/utils"

interface TrophyIconProps {
  rating: TrophyRating
  size?: "sm" | "md" | "lg"
  showLabel?: boolean
  showDescription?: boolean
}

export default function TrophyIcon({
  rating,
  size = "md",
  showLabel = false,
  showDescription = false,
}: TrophyIconProps) {
  const trophyInfo = getTrophyInfo(rating)

  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-8 w-8",
  }

  return (
    <div className="flex items-center gap-2">
      <div className={`relative ${trophyInfo.color}`}>
        <Trophy className={cn(sizeClasses[size])} />
        <div
          className="absolute inset-0 opacity-50 blur-sm"
          style={{
            backgroundColor:
              trophyInfo.color === "trophy-bronze"
                ? "#cd7f32"
                : trophyInfo.color === "trophy-silver"
                  ? "#c0c0c0"
                  : trophyInfo.color === "trophy-gold"
                    ? "#ffd700"
                    : "#e5e4e2",
            mixBlendMode: "overlay",
            borderRadius: "50%",
            transform: "scale(1.2)",
            filter: "blur(4px)",
          }}
        ></div>
      </div>
      {showLabel && (
        <div className="flex flex-col">
          <span className="font-bold text-sm">{trophyInfo.label}</span>
          {showDescription && <span className="text-xs text-muted-foreground">{trophyInfo.description}</span>}
        </div>
      )}
    </div>
  )
}
