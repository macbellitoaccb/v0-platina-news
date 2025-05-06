"use client"

import { useEffect, useState } from "react"
import PostForm from "@/components/post-form"
import { updateReview } from "@/app/actions"
import { notFound } from "next/navigation"
import type { Review } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { AlertCircle } from "lucide-react"
import Link from "next/link"

interface EditReviewPageProps {
  params: {
    id: string
  }
}

export default function EditReviewPage({ params }: EditReviewPageProps) {
  const [review, setReview] = useState<Review | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchReview() {
      try {
        const response = await fetch(`/api/reviews/${params.id}`)

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || `Erro ${response.status}`)
        }

        const data = await response.json()
        setReview(data)
      } catch (error) {
        console.error("Erro ao buscar review:", error)
        setError(error instanceof Error ? error.message : "Erro desconhecido")
      } finally {
        setLoading(false)
      }
    }

    fetchReview()
  }, [params.id])

  if (loading) {
    return <div className="flex justify-center items-center min-h-[50vh]">Carregando...</div>
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
        <AlertCircle className="h-12 w-12 text-destructive mb-4" />
        <h2 className="text-2xl font-bold mb-2">Erro ao carregar review</h2>
        <p className="text-muted-foreground mb-6">{error}</p>
        <Link href="/admin">
          <Button>Voltar para o painel</Button>
        </Link>
      </div>
    )
  }

  if (!review) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Editar Review</h1>
      <PostForm type="review" initialData={review} onSubmit={updateReview} />
    </div>
  )
}
