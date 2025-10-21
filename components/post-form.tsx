"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { Review, News, TrophyRating, AdditionalImage, PlatinaGuide } from "@/lib/types"
import { slugify } from "@/lib/utils"
import AdditionalImagesForm from "./additional-images-form"
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
  const isEditing = !!initialData

  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    content: initialData?.content || "",
    image: initialData?.image || "",
    rating: (initialData as Review)?.rating || "bronze",
    gameName: (initialData as Review)?.gameName || "",
    genres: (initialData as Review)?.genres?.join(", ") || "",
    tags: (initialData as Review)?.tags?.join(", ") || "",
  })

  const [additionalImages, setAdditionalImages] = useState<AdditionalImage[]>(
    (initialData as Review)?.additionalImages || [],
  )

  const [platinaGuide, setPlatinaGuide] = useState<PlatinaGuide>(
    (initialData as Review)?.platinaGuide || { ...defaultPlatinaGuide },
  )

  const [isSubmitting, setIsSubmitting] = useState(false)

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
        data = baseData
      }

      await onSubmit(data)

      router.push("/admin")
      router.refresh()
    } catch (error) {
      console.error("Erro ao salvar:", error)
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="basic">Informações Básicas</TabsTrigger>
          {isReview && <TabsTrigger value="images">Imagens Adicionais</TabsTrigger>}
          {isReview && <TabsTrigger value="platina">Guia de Platina</TabsTrigger>}
        </TabsList>

        <TabsContent value="basic" className="space-y-4 pt-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="title">Título</Label>
              <Input id="title" name="title" value={formData.title} onChange={handleChange} required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="image">URL da Imagem Principal</Label>
              <Input
                id="image"
                name="image"
                value={formData.image}
                onChange={handleChange}
                placeholder="https://exemplo.com/imagem.jpg"
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
            <Label htmlFor="content">Conteúdo</Label>
            <Textarea id="content" name="content" value={formData.content} onChange={handleChange} rows={10} required />
          </div>
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
