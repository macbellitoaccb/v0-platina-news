import { Clock, Award, AlertTriangle, Wifi, Lightbulb } from "lucide-react"
import type { PlatinaGuide, PlatinaDifficulty } from "@/lib/types"

interface PlatinaGuideProps {
  guide: PlatinaGuide
}

export default function PlatinaGuide({ guide }: PlatinaGuideProps) {
  if (!guide) return null

  const difficultyMap: Record<PlatinaDifficulty, { label: string; color: string }> = {
    easy: { label: "Fácil", color: "text-green-500" },
    medium: { label: "Média", color: "text-yellow-500" },
    hard: { label: "Difícil", color: "text-orange-500" },
    "very-hard": { label: "Muito Difícil", color: "text-red-500" },
  }

  const difficulty = difficultyMap[guide.difficulty]

  return (
    <div className="space-y-4 p-4 bg-secondary/50 rounded-lg border border-border/50">
      <h3 className="text-lg font-bold flex items-center gap-2">
        <Award className="h-5 w-5 trophy-platinum" />
        Guia de Platina
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex items-center gap-2">
          <Award className={`h-4 w-4 ${difficulty.color}`} />
          <span className="text-sm">
            Dificuldade: <span className={difficulty.color}>{difficulty.label}</span>
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-primary" />
          <span className="text-sm">Tempo estimado: {guide.timeToPlat}</span>
        </div>

        <div className="flex items-center gap-2">
          <AlertTriangle className={`h-4 w-4 ${guide.missableTrophies ? "text-yellow-500" : "text-green-500"}`} />
          <span className="text-sm">Troféus missáveis: {guide.missableTrophies ? "Sim" : "Não"}</span>
        </div>

        <div className="flex items-center gap-2">
          <Wifi className={`h-4 w-4 ${guide.onlineRequired ? "text-yellow-500" : "text-green-500"}`} />
          <span className="text-sm">Troféus online: {guide.onlineRequired ? "Sim" : "Não"}</span>
        </div>
      </div>

      <div className="pt-2 border-t border-border/50">
        <div className="flex gap-2">
          <Lightbulb className="h-4 w-4 text-primary flex-shrink-0 mt-1" />
          <p className="text-sm">{guide.tips}</p>
        </div>
      </div>
    </div>
  )
}
