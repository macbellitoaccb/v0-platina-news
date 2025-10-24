import { ThumbsUp, ThumbsDown } from "lucide-react"
import TrophyIcon from "./trophy-icon"
import type { TrophyRating } from "@/lib/types"

interface ProsConsDisplayProps {
  pros?: string[]
  cons?: string[]
  rating: TrophyRating
}

export default function ProsConsDisplay({ pros, cons, rating }: ProsConsDisplayProps) {
  // Don't render if no pros or cons
  if ((!pros || pros.length === 0) && (!cons || cons.length === 0)) {
    return null
  }

  return (
    <div className="my-8 p-6 bg-secondary/30 rounded-lg border-2 border-border/50">
      <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-6 items-start">
        {/* PRÓS */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 pb-2 border-b-2 border-green-500/50">
            <ThumbsUp className="h-5 w-5 text-green-500" />
            <h3 className="text-lg font-black uppercase tracking-wider text-green-500">PRÓS</h3>
          </div>
          {pros && pros.length > 0 ? (
            <ul className="space-y-2">
              {pros.map((pro, index) => (
                <li key={index} className="flex items-start gap-2 text-sm">
                  <span className="text-green-500 mt-1">▸</span>
                  <span>{pro}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground italic">Nenhum pró listado</p>
          )}
        </div>

        {/* TROFÉU NO CENTRO */}
        <div className="flex justify-center items-center md:px-6">
          <div className="flex flex-col items-center gap-2 p-4 bg-background/50 rounded-lg border-2 border-primary/30">
            <TrophyIcon rating={rating} size="xl" />
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Avaliação</span>
          </div>
        </div>

        {/* CONTRAS */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 pb-2 border-b-2 border-red-500/50">
            <ThumbsDown className="h-5 w-5 text-red-500" />
            <h3 className="text-lg font-black uppercase tracking-wider text-red-500">CONTRAS</h3>
          </div>
          {cons && cons.length > 0 ? (
            <ul className="space-y-2">
              {cons.map((con, index) => (
                <li key={index} className="flex items-start gap-2 text-sm">
                  <span className="text-red-500 mt-1">▸</span>
                  <span>{con}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground italic">Nenhum contra listado</p>
          )}
        </div>
      </div>
    </div>
  )
}
