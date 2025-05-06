import { getGuideBySlug, getGuides } from "@/lib/data"
import { notFound } from "next/navigation"
import Image from "next/image"
import { formatDate } from "@/lib/utils"
import { ArrowLeft, Share2, Clock, Award } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import AuthorCard from "@/components/author-card"

interface GuidePageProps {
  params: {
    slug: string
  }
}

export default async function GuidePage({ params }: GuidePageProps) {
  const guide = await getGuideBySlug(params.slug)

  if (!guide) {
    notFound()
  }

  // Pegar outros guias
  const allGuides = await getGuides()
  const relatedGuides = allGuides
    .filter((g) => g.id !== guide.id && g.tags.some((t) => guide.tags.includes(t)))
    .slice(0, 3)

  const getDifficultyInfo = (difficulty: string) => {
    const difficultyNumber = Number.parseInt(difficulty)

    if (difficultyNumber <= 2) {
      return { label: "Fácil", color: "text-green-500" }
    } else if (difficultyNumber <= 4) {
      return { label: "Média", color: "text-yellow-500" }
    } else if (difficultyNumber <= 6) {
      return { label: "Difícil", color: "text-orange-500" }
    } else if (difficultyNumber <= 8) {
      return { label: "Hardcore", color: "text-red-500" }
    } else {
      return { label: "Insano", color: "text-purple-500" }
    }
  }

  const difficulty = getDifficultyInfo(guide.difficulty)

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <Link href="/guias" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar para guias
        </Link>
      </div>

      <article className="space-y-8">
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                <span>{formatDate(guide.createdAt)}</span>
                <span>•</span>
                <span>{guide.author?.name || "Editor PlatinaNews"}</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-black tracking-tight magazine-title">{guide.gameName}</h1>
              <p className="text-xl text-muted-foreground mt-2">{guide.title}</p>
            </div>
            <div>
              <Button variant="outline" size="icon">
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="relative aspect-video w-full overflow-hidden rounded-lg">
            <Image
              src={guide.image || "/placeholder.svg?height=400&width=800"}
              alt={guide.title}
              fill
              className="object-cover"
              priority
            />
          </div>

          <div className="flex flex-wrap gap-2 my-4">
            {guide.tags.map((tag) => (
              <span key={tag} className="game-tag">
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex items-center gap-2 p-4 bg-secondary/50 rounded-lg">
            <Award className={`h-5 w-5 ${difficulty.color}`} />
            <span>
              Dificuldade:{" "}
              <span className={difficulty.color}>
                {difficulty.label} ({guide.difficulty}/10)
              </span>
            </span>
          </div>

          <div className="flex items-center gap-2 p-4 bg-secondary/50 rounded-lg">
            <Clock className="h-5 w-5 text-primary" />
            <span>Tempo estimado: {guide.estimatedTime}</span>
          </div>
        </div>

        <div className="prose prose-invert max-w-none">
          {guide.content.split("\n\n").map((paragraph, index) => (
            <p key={index} className="mb-4">
              {paragraph}
            </p>
          ))}
        </div>

        <div className="space-y-8 mt-8">
          <h2 className="text-2xl font-bold">Guia Passo a Passo</h2>

          {guide.steps.map((step, index) => (
            <div key={index} className="border border-border/50 rounded-lg overflow-hidden">
              <div className="bg-secondary/50 p-4">
                <h3 className="text-xl font-bold">
                  {index + 1}. {step.title}
                </h3>
              </div>

              <div className="p-4 space-y-4">
                <div className="prose prose-invert max-w-none">
                  {step.description.split("\n\n").map((paragraph, pIndex) => (
                    <p key={pIndex}>{paragraph}</p>
                  ))}
                </div>

                {step.image && (
                  <div className="mt-4">
                    <div className="relative aspect-video w-full overflow-hidden rounded-lg">
                      <Image
                        src={step.image || "/placeholder.svg"}
                        alt={`Imagem para ${step.title}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>
                )}

                {step.video && (
                  <div className="mt-4">
                    <iframe
                      className="w-full aspect-video rounded-lg"
                      src={step.video.replace("watch?v=", "embed/")}
                      title={`Vídeo para ${step.title}`}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Autor do guia */}
        {guide.author && (
          <div className="mt-12 pt-6 border-t border-border/50">
            <h2 className="text-2xl font-bold mb-4">Sobre o Autor</h2>
            <AuthorCard author={guide.author} />
          </div>
        )}
      </article>

      {relatedGuides.length > 0 && (
        <section className="mt-16 pt-8 border-t border-border/50">
          <h2 className="text-2xl font-bold mb-6">Guias Relacionados</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedGuides.map((relatedGuide) => (
              <Link key={relatedGuide.id} href={`/guias/${relatedGuide.slug}`} className="group">
                <div className="magazine-card card-hover overflow-hidden rounded-lg">
                  <div className="relative aspect-video">
                    <Image
                      src={relatedGuide.image || "/placeholder.svg?height=400&width=600"}
                      alt={relatedGuide.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="magazine-title text-lg line-clamp-2">{relatedGuide.gameName}</h3>
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{relatedGuide.title}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
