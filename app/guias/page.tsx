import { getGuides } from "@/lib/data"
import { Award } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { formatDate } from "@/lib/utils"

export default function GuidesPage() {
  const guides = getGuides()

  // Ordenar guias por data (mais recentes primeiro)
  const sortedGuides = [...guides].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

  return (
    <div className="space-y-12">
      <div className="section-highlight">
        <h1 className="text-3xl font-black tracking-tight mb-2">GUIAS DE PLATINA</h1>
        <p className="text-muted-foreground">
          Guias detalhados para ajudar você a conquistar todos os troféus e platinar seus jogos favoritos.
        </p>
      </div>

      {sortedGuides.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedGuides.map((guide) => (
            <Link key={guide.id} href={`/guias/${guide.slug}`} className="group">
              <div className="magazine-card card-hover overflow-hidden rounded-lg h-full">
                <div className="relative aspect-video">
                  <Image
                    src={guide.image || "/placeholder.svg?height=400&width=600"}
                    alt={guide.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute top-0 right-0 m-3 bg-background/80 backdrop-blur-sm px-2 py-1 rounded-md">
                    <div className="flex items-center gap-1">
                      <Award className="h-4 w-4 text-primary" />
                      <span className="text-xs font-medium">Guia de Platina</span>
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="magazine-title text-lg line-clamp-2">{guide.gameName}</h3>
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{guide.title}</p>
                </div>
                <div className="px-4 pb-4 pt-0 flex justify-between items-center">
                  <span className="text-xs text-muted-foreground">{formatDate(guide.createdAt)}</span>
                  <span className="text-xs">
                    Dificuldade:
                    <span
                      className={
                        guide.difficulty === "easy"
                          ? "text-green-500"
                          : guide.difficulty === "medium"
                            ? "text-yellow-500"
                            : guide.difficulty === "hard"
                              ? "text-orange-500"
                              : "text-red-500"
                      }
                    >
                      {" "}
                      {guide.difficulty === "easy"
                        ? "Fácil"
                        : guide.difficulty === "medium"
                          ? "Média"
                          : guide.difficulty === "hard"
                            ? "Difícil"
                            : "Muito Difícil"}
                    </span>
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Nenhum guia de platina encontrado.</p>
        </div>
      )}
    </div>
  )
}
