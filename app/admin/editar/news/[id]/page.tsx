"use client"

import { useEffect, useState } from "react"
import PostForm from "@/components/post-form"
import { updateNews } from "@/app/actions"
import { notFound } from "next/navigation"
import type { News } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { AlertCircle } from "lucide-react"
import Link from "next/link"

interface EditNewsPageProps {
  params: {
    id: string
  }
}

export default function EditNewsPage({ params }: EditNewsPageProps) {
  const [news, setNews] = useState<News | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchNews() {
      try {
        const response = await fetch(`/api/news/${params.id}`)

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || `Erro ${response.status}`)
        }

        const data = await response.json()
        setNews(data)
      } catch (error) {
        console.error("Erro ao buscar notícia:", error)
        setError(error instanceof Error ? error.message : "Erro desconhecido")
      } finally {
        setLoading(false)
      }
    }

    fetchNews()
  }, [params.id])

  if (loading) {
    return <div className="flex justify-center items-center min-h-[50vh]">Carregando...</div>
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
        <AlertCircle className="h-12 w-12 text-destructive mb-4" />
        <h2 className="text-2xl font-bold mb-2">Erro ao carregar notícia</h2>
        <p className="text-muted-foreground mb-6">{error}</p>
        <Link href="/admin">
          <Button>Voltar para o painel</Button>
        </Link>
      </div>
    )
  }

  if (!news) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Editar Notícia</h1>
      <PostForm type="news" initialData={news} onSubmit={updateNews} />
    </div>
  )
}
