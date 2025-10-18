"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle } from "lucide-react"
import Link from "next/link"
import type { Author } from "@/lib/types"
import { updateMyProfile } from "@/app/actions"
import { createClientSupabaseClient } from "@/lib/supabase"
import { useRouter } from "next/navigation"

export default function MyProfilePage() {
  const [author, setAuthor] = useState<Author | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    async function fetchMyAuthorProfile() {
      const supabase = createClientSupabaseClient()
      if (!supabase) {
        setError("Supabase client not available.")
        setLoading(false)
        return
      }

      try {
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser()
        if (userError || !user) {
          router.push("/login?redirectedFrom=/meu-perfil") // Redirect to login if not authenticated
          return
        }

        const { data: authorData, error: fetchError } = await supabase
          .from("authors")
          .select("*")
          .eq("user_id", user.id)
          .single()

        if (fetchError || !authorData) {
          setError(fetchError?.message || "Perfil de autor não encontrado para o seu usuário.")
          setAuthor(null)
        } else {
          setAuthor({
            id: authorData.id,
            name: authorData.name,
            avatar: authorData.avatar,
            psnId: authorData.psn_id,
            instagram: authorData.instagram,
            twitter: authorData.twitter,
            bio: authorData.bio,
            user_id: authorData.user_id,
            role: authorData.role,
          })
        }
      } catch (err) {
        console.error("Error fetching my profile:", err)
        setError(err instanceof Error ? err.message : "Erro desconhecido ao carregar perfil.")
      } finally {
        setLoading(false)
      }
    }

    fetchMyAuthorProfile()
  }, [router])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setAuthor((prev) => (prev ? { ...prev, [name]: value } : null))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)
    setSuccessMessage(null)

    if (!author) {
      setError("Dados do autor não carregados.")
      setIsSubmitting(false)
      return
    }

    try {
      await updateMyProfile(author)
      setSuccessMessage("Perfil atualizado com sucesso!")
      router.refresh() // Revalidate data
    } catch (err) {
      console.error("Erro ao atualizar perfil:", err)
      setError(err instanceof Error ? err.message : "Erro desconhecido ao atualizar perfil.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) {
    return <div className="flex justify-center items-center min-h-[50vh]">Carregando perfil...</div>
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
        <AlertCircle className="h-12 w-12 text-destructive mb-4" />
        <h2 className="text-2xl font-bold mb-2">Erro ao carregar perfil</h2>
        <p className="text-muted-foreground mb-6">{error}</p>
        <Link href="/">
          <Button>Voltar para a página inicial</Button>
        </Link>
      </div>
    )
  }

  if (!author) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
        <AlertCircle className="h-12 w-12 text-yellow-500 mb-4" />
        <h2 className="text-2xl font-bold mb-2">Perfil de autor não encontrado</h2>
        <p className="text-muted-foreground mb-6">
          Parece que seu usuário não tem um perfil de autor associado. Por favor, contate o administrador.
        </p>
        <Link href="/">
          <Button>Voltar para a página inicial</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Meu Perfil de Autor</h1>
      <Card>
        <CardHeader>
          <CardTitle>Editar Informações do Perfil</CardTitle>
          <CardDescription>Atualize as informações que aparecem publicamente em suas postagens.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Nome do Autor</Label>
                <Input
                  id="name"
                  name="name"
                  value={author.name}
                  onChange={handleChange}
                  placeholder="Nome completo"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="avatar">URL do Avatar</Label>
                <Input
                  id="avatar"
                  name="avatar"
                  value={author.avatar || ""}
                  onChange={handleChange}
                  placeholder="https://exemplo.com/avatar.jpg"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="psnId">PSN ID</Label>
                <Input
                  id="psnId"
                  name="psnId"
                  value={author.psnId || ""}
                  onChange={handleChange}
                  placeholder="Seu ID na PlayStation Network"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="instagram">Instagram</Label>
                <Input
                  id="instagram"
                  name="instagram"
                  value={author.instagram || ""}
                  onChange={handleChange}
                  placeholder="@seu_instagram"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="twitter">Twitter</Label>
                <Input
                  id="twitter"
                  name="twitter"
                  value={author.twitter || ""}
                  onChange={handleChange}
                  placeholder="@seu_twitter"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Biografia</Label>
              <Textarea
                id="bio"
                name="bio"
                value={author.bio || ""}
                onChange={handleChange}
                placeholder="Uma breve descrição sobre o autor"
                rows={3}
              />
            </div>

            {error && <p className="text-destructive text-sm text-center">{error}</p>}
            {successMessage && <p className="text-green-500 text-sm text-center">{successMessage}</p>}

            <div className="flex justify-end gap-4">
              <Button type="button" variant="outline" onClick={() => router.push("/")} disabled={isSubmitting}>
                Voltar
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Salvando..." : "Atualizar Perfil"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
