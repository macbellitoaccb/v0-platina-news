"use client"

import type React from "react"
import TextEditor from "./text-editor"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { Review, News, TrophyRating, AdditionalImage, NewsMedia, PlatinaGuide, Author } from "@/lib/types"
import { slugify } from "@/lib/utils"
import AdditionalImagesForm from "./additional-images-form"
import NewsMediaForm from "./news-media-form"
import PlatinaGuideForm from "./platina-guide-form"

interface PostFormProps {
  type: "review" | "news"
  initialData?: Review | News
  onSubmit: (data: any) => Promise<void>
}

// Guia de platina padrão
const defaultPlatinaGuide: PlatinaGuide = {
  difficulty: "3",
  timeToPlat: "30-40h",
  missableTrophies: false,
  onlineRequired: false,
  tips: "",
}

export default function PostForm({ type, initialData, onSubmit }: PostFormProps) {
  const router = useRouter()
  const isReview = type === "review"
  const isNews = type === "news"
  const isEditing = !!initialData

  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    content: initialData?.content || "",
    image: initialData?.image || "",
    rating: (initialData as Review)?.rating || "bronze",
    gameName: (initialData as Review)?.gameName || "",
    genres: (initialData as Review)?.genres?.join(", ") || "",
    tags: (initialData as Review)?.tags?.join(", ") || "",
    author_id: initialData?.author_id || "",
    youtubeUrl: initialData?.youtubeUrl || "",
    subtitle: (initialData as News)?.subtitle || "",
  })

  const [additionalImages, setAdditionalImages] = useState<AdditionalImage[]>(
    (initialData as Review)?.additionalImages || [],
  )

  const [newsMedia, setNewsMedia] = useState<NewsMedia[]>((initialData as News)?.additionalMedia || [])

  const [platinaGuide, setPlatinaGuide] = useState<PlatinaGuide>(
    (initialData as Review)?.platinaGuide || { ...defaultPlatinaGuide },
  )

  const [authors, setAuthors] = useState<Author[]>([])
  const [loadingAuthors, setLoadingAuthors] = useState(true)

  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    async function fetchAuthors() {
      try {
        setLoadingAuthors(true)
        const response = await fetch("/api/authors")

        if (!response.ok) {
          throw new Error("Failed to fetch authors")
        }

        const data = await response.json()
        setAuthors(data)
      } catch (error) {
        console.error("Error fetching authors:", error)
        setAuthors([])
      } finally {
        setLoadingAuthors(false)
      }
    }

    fetchAuthors()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const now = new Date().toISOString()
      const id = initialData?.id || undefined
      const slug = initialData?.slug || slugify(isReview ? formData.gameName : formData.title)

      const baseData = {
        id,
        title: formData.title,
        slug,
        content: formData.content,
        image: formData.image,
        type,
        createdAt: initialData?.createdAt || now,
        updatedAt: now,
        author_id: formData.author_id || undefined,
        youtubeUrl: formData.youtubeUrl || undefined,
      }

      let data

      if (isReview) {
        data = {
          ...baseData,
          rating: formData.rating as TrophyRating,
          gameName: formData.gameName,
          genres: formData.genres
            .split(",")
            .map((g) => g.trim())
            .filter(Boolean),
          tags: formData.tags
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean),
          additionalImages: additionalImages.filter((img) => img.url.trim() !== ""),
          platinaGuide: platinaGuide.tips ? platinaGuide : undefined,
        }
      } else {
        data = {
          ...baseData,
          subtitle: formData.subtitle,
          additionalMedia: newsMedia.filter((media) => media.url.trim() !== ""),
        }
      }

      await onSubmit(data)

      router.push("/admin")
      router.refresh()
    } catch (error) {
      console.error("Erro ao salvar:", error)
      alert("Erro ao salvar. Por favor, tente novamente.")
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Tabs defaultValue="basic" className="w-full">
        <TabsList
          className={`grid w-full ${isReview ? "grid-cols-2 md:grid-cols-4" : isNews ? "grid-cols-2 md:grid-cols-3" : "grid-cols-2"}`}
        >
          <TabsTrigger value="basic">Informações Básicas</TabsTrigger>
          <TabsTrigger value="author">Autor</TabsTrigger>
          {isReview && <TabsTrigger value="images">Imagens Adicionais</TabsTrigger>}
          {isReview && <TabsTrigger value="platina">Guia de Platina</TabsTrigger>}
          {isNews && <TabsTrigger value="media">Imagens e Vídeos</TabsTrigger>}
        </TabsList>

        <TabsContent value="basic" className="space-y-4 pt-4">
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Título</Label>
              <Input id="title" name="title" value={formData.title} onChange={handleChange} required />
            </div>

            {isNews && (
              <div className="space-y-2">
                <Label htmlFor="subtitle">Subtítulo</Label>
                <Input
                  id="subtitle"
                  name="subtitle"
                  value={formData.subtitle || ""}
                  onChange={handleChange}
                  placeholder="Um resumo breve da notícia..."
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="image">URL da Imagem Principal</Label>
              <Input
                id="image"
                name="image"
                value={formData.image}
                onChange={handleChange}
                placeholder="https://exemplo.com/imagem.jpg"
                required
              />
            </div>
          </div>

          {isReview && (
            <>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="gameName">Nome do Jogo</Label>
                  <Input
                    id="gameName"
                    name="gameName"
                    value={formData.gameName}
                    onChange={handleChange}
                    required={isReview}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="rating">Nota</Label>
                  <Select value={formData.rating} onValueChange={(value) => handleSelectChange("rating", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma nota" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bronze">Bronze - Jogo fraco</SelectItem>
                      <SelectItem value="silver">Prata - Mediano</SelectItem>
                      <SelectItem value="gold">Ouro - Muito bom</SelectItem>
                      <SelectItem value="platinum">Platina - Obra-prima</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="genres">Gêneros (separados por vírgula)</Label>
                  <Input
                    id="genres"
                    name="genres"
                    value={formData.genres}
                    onChange={handleChange}
                    placeholder="Ação, Aventura, RPG"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tags">Tags (separadas por vírgula)</Label>
                  <Input
                    id="tags"
                    name="tags"
                    value={formData.tags}
                    onChange={handleChange}
                    placeholder="PS5, Xbox, PC"
                  />
                </div>
              </div>
            </>
          )}

          <div className="space-y-2">
            <Label htmlFor="youtubeUrl">Vídeo do YouTube (opcional)</Label>
            <Input
              id="youtubeUrl"
              name="youtubeUrl"
              value={formData.youtubeUrl}
              onChange={handleChange}
              placeholder="https://www.youtube.com/watch?v=..."
            />
            <p className="text-xs text-muted-foreground">
              Cole a URL completa do vídeo do YouTube para incorporá-lo no post
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Conteúdo</Label>
            <TextEditor
              value={formData.content}
              onChange={(value) => setFormData((prev) => ({ ...prev, content: value }))}
              placeholder="Escreva o conteúdo do seu post aqui..."
            />
          </div>
        </TabsContent>

        <TabsContent value="author" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Autor</CardTitle>
              <CardDescription>
                Selecione o autor deste post. Se não selecionar, será usado o autor padrão "Admin".
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="author_id">Autor</Label>
                {loadingAuthors ? (
                  <p className="text-sm text-muted-foreground">Carregando autores...</p>
                ) : authors.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    Nenhum autor encontrado. Será usado o autor padrão "Admin".
                  </p>
                ) : (
                  <Select value={formData.author_id} onValueChange={(value) => handleSelectChange("author_id", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um autor (opcional)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="default">Usar autor padrão (Admin)</SelectItem>
                      {authors.map((author) => (
                        <SelectItem key={author.id} value={author.id!}>
                          {author.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {isReview && (
          <TabsContent value="images" className="pt-4">
            <Card>
              <CardHeader>
                <CardTitle>Imagens Adicionais</CardTitle>
                <CardDescription>
                  Adicione imagens que serão exibidas ao longo do review, como em uma revista de games.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <AdditionalImagesForm images={additionalImages} onChange={setAdditionalImages} />
              </CardContent>
            </Card>
          </TabsContent>
        )}

        {isReview && (
          <TabsContent value="platina" className="pt-4">
            <Card>
              <CardHeader>
                <CardTitle>Guia de Platina</CardTitle>
                <CardDescription>
                  Adicione informações sobre como conseguir a platina neste jogo. Estas informações serão exibidas na
                  página de review.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <PlatinaGuideForm guide={platinaGuide} onChange={setPlatinaGuide} />
              </CardContent>
            </Card>
          </TabsContent>
        )}

        {isNews && (
          <TabsContent value="media" className="pt-4">
            <Card>
              <CardHeader>
                <CardTitle>Imagens e Vídeos Adicionais</CardTitle>
                <CardDescription>
                  Adicione imagens ou vídeos do YouTube que serão exibidos ao longo da notícia. O texto é opcional.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <NewsMediaForm media={newsMedia} onChange={setNewsMedia} />
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>

      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline" onClick={() => router.push("/admin")} disabled={isSubmitting}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Salvando..." : isEditing ? "Atualizar" : "Criar"}
        </Button>
      </div>
    </form>
  )
}
