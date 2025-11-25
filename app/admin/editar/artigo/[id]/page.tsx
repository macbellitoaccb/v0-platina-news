"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import PostForm from "@/components/post-form"
import { updateArticle } from "@/app/actions"
import { getArticleById } from "@/lib/data"
import type { Article } from "@/lib/types"

export default function EditarArtigoPage() {
  const { id } = useParams()
  const [article, setArticle] = useState<Article | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (id) {
      getArticleById(id as string).then((data) => {
        setArticle(data)
        setLoading(false)
      })
    }
  }, [id])

  if (loading) return <div>Carregando...</div>
  if (!article) return <div>Artigo não encontrado</div>

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Editar Artigo</h1>
      <PostForm type="article" initialData={article} onSubmit={updateArticle} />
    </div>
  )
}
