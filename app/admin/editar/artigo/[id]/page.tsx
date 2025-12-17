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
    console.log("[v0] EditarArtigoPage: id from params:", id)
    if (id) {
      getArticleById(id as string).then((data) => {
        console.log("[v0] EditarArtigoPage: article data received:", data)
        setArticle(data)
        setLoading(false)
      })
    }
  }, [id])

  if (loading) return <div className="p-8">Carregando...</div>
  if (!article) return <div className="p-8">Artigo não encontrado</div>

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Editar Artigo</h1>
      <PostForm type="article" initialData={article} onSubmit={updateArticle} />
    </div>
  )
}
