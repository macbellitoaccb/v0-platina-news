"use client"

import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { removeArticle } from "@/app/actions"
import { getArticleById } from "@/lib/data"
import { useState, useEffect } from "react"
import type { Article } from "@/lib/types"

export default function ExcluirArtigoPage() {
  const { id } = useParams()
  const router = useRouter()
  const [article, setArticle] = useState<Article | null>(null)

  useEffect(() => {
    if (id) {
      getArticleById(id as string).then(setArticle)
    }
  }, [id])

  const handleDelete = async () => {
    if (!article) return
    await removeArticle(article.id)
    router.push("/admin")
  }

  if (!article) return <div>Artigo não encontrado</div>

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Excluir Artigo</h1>
      <p>Tem certeza que deseja excluir "{article.title}"?</p>
      <div className="flex gap-4">
        <Button onClick={handleDelete} variant="destructive">
          Sim, Excluir
        </Button>
        <Button onClick={() => router.back()} variant="outline">
          Cancelar
        </Button>
      </div>
    </div>
  )
}
