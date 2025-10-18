"use client"

import { useEffect, useState } from "react"
import AuthorManagementForm from "@/components/author-management-form"
import { updateAuthor } from "@/app/actions"
import { notFound } from "next/navigation"
import type { Author } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { AlertCircle } from "lucide-react"
import Link from "next/link"

interface EditAuthorPageProps {
  params: {
    id: string
  }
}

export default function EditAuthorPage({ params }: EditAuthorPageProps) {
  const [author, setAuthor] = useState<Author | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchAuthor() {
      try {
        const response = await fetch(`/api/authors/${params.id}`)

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || `Erro ${response.status}`)
        }

        const data = await response.json()
        setAuthor(data)
      } catch (error) {
        console.error("Erro ao buscar autor:", error)
        setError(error instanceof Error ? error.message : "Erro desconhecido")
      } finally {
        setLoading(false)
      }
    }

    fetchAuthor()
  }, [params.id])

  if (loading) {
    return <div className="flex justify-center items-center min-h-[50vh]">Carregando...</div>
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
        <AlertCircle className="h-12 w-12 text-destructive mb-4" />
        <h2 className="text-2xl font-bold mb-2">Erro ao carregar autor</h2>
        <p className="text-muted-foreground mb-6">{error}</p>
        <Link href="/admin/autores">
          <Button>Voltar para a lista de autores</Button>
        </Link>
      </div>
    )
  }

  if (!author) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Editar Autor</h1>
      {/* Pass initialData and onSubmit, but not isNewAuthor as it's an edit */}
      <AuthorManagementForm initialData={author} onSubmit={updateAuthor} />
    </div>
  )
}
