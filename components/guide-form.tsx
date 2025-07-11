"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Trash2 } from "lucide-react"
import type { Guide, TrophyGuideStep, PlatinaDifficulty, Author } from "@/lib/types"
import { slugify } from "@/lib/utils"
import { getAuthors } from "@/lib/data" // Importar getAuthors

interface GuideFormProps {
  initialData?: Guide
  onSubmit: (data: Guide) => Promise<void>
}

export default function GuideForm({ initialData, onSubmit }: GuideFormProps) {
  const router = useRouter()
  const isEditing = !!initialData

  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    content: initialData?.content || "",
    image: initialData?.image || "",
    gameName: initialData?.gameName || "",
    difficulty: initialData?.difficulty || ("3" as PlatinaDifficulty),
    estimatedTime: initialData?.estimatedTime || "",
    tags: initialData?.tags?.join(", ") || "",
  })

  const [steps, setSteps] = useState<TrophyGuideStep[]>(
    initialData?.steps || [{ title: "", description: "", image: "", video: "" }],
  )

  const [authors, setAuthors] = useState<Author[]>([])
  const [selectedAuthorId, setSelectedAuthorId] = useState<string | null>(
    initialData?.author_id || null, // Usar author_id do initialData
  )

  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    async function fetchAuthors() {
      const fetchedAuthors = await getAuthors()
      setAuthors(fetchedAuthors)
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

  const handleStepChange = (index: number, field: keyof TrophyGuideStep, value: string) => {
    const newSteps = [...steps]
    newSteps[index] = { ...newSteps[index], [field]: value }
    setSteps(newSteps)
  }

  const addStep = () => {
    setSteps([...steps, { title: "", description: "", image: "", video: "" }])
  }

  const removeStep = (index: number) => {
    const newSteps = [...steps]
    newSteps.splice(index, 1)
    setSteps(newSteps)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const now = new Date().toISOString()
      const id = initialData?.id || undefined
      const slug = initialData?.slug || slugify(formData.gameName + "-" + formData.title)

      const data: Guide = {
        id,
        title: formData.title,
        slug,
        content: formData.content,
        image: formData.image,
        type: "guide",
        createdAt: initialData?.createdAt || now,
        updatedAt: now,
        author_id: selectedAuthorId, // Enviar o ID do autor selecionado
        gameName: formData.gameName,
        difficulty: formData.difficulty as PlatinaDifficulty,
        estimatedTime: formData.estimatedTime,
        steps: steps.filter((step) => step.title.trim() !== "" || step.description.trim() !== ""),
        tags: formData.tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
      }

      await onSubmit(data)

      // Redirecionar diretamente para o painel admin após salvar
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
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="basic">Informações Básicas</TabsTrigger>
          <TabsTrigger value="steps">Passos do Guia</TabsTrigger>
          <TabsTrigger value="author">Autor</TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-4 pt-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="title">Título do Guia</Label>
              <Input id="title" name="title" value={formData.title} onChange={handleChange} required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="gameName">Nome do Jogo</Label>
              <Input id="gameName" name="gameName" value={formData.gameName} onChange={handleChange} required />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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

            <div className="space-y-2">
              <Label htmlFor="difficulty">Dificuldade (1-10)</Label>
              <Select value={formData.difficulty} onValueChange={(value) => handleSelectChange("difficulty", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a dificuldade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1/10 - Fácil</SelectItem>
                  <SelectItem value="2">2/10 - Fácil</SelectItem>
                  <SelectItem value="3">3/10 - Média</SelectItem>
                  <SelectItem value="4">4/10 - Média</SelectItem>
                  <SelectItem value="5">5/10 - Difícil</SelectItem>
                  <SelectItem value="6">6/10 - Difícil</SelectItem>
                  <SelectItem value="7">7/10 - Hardcore</SelectItem>
                  <SelectItem value="8">8/10 - Hardcore</SelectItem>
                  <SelectItem value="9">9/10 - Insano</SelectItem>
                  <SelectItem value="10">10/10 - Insano</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="estimatedTime">Tempo Estimado para Platinar</Label>
              <Input
                id="estimatedTime"
                name="estimatedTime"
                value={formData.estimatedTime}
                onChange={handleChange}
                placeholder="Ex: 30-40h"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tags">Tags (separadas por vírgula)</Label>
              <Input id="tags" name="tags" value={formData.tags} onChange={handleChange} placeholder="PS5, Ação, RPG" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Introdução do Guia</Label>
            <Textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleChange}
              rows={10}
              placeholder="Escreva uma introdução para o guia de platina, explicando o jogo e dando dicas gerais."
              required
            />
          </div>
        </TabsContent>

        <TabsContent value="steps" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Passos do Guia</CardTitle>
              <CardDescription>
                Adicione os passos necessários para conseguir a platina. Cada passo pode ter um título, descrição,
                imagem e/ou vídeo.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {steps.map((step, index) => (
                  <div key={index} className="p-4 border rounded-md bg-secondary/20 space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="font-medium">Passo {index + 1}</h3>
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => removeStep(index)}
                        disabled={steps.length === 1}
                      >
                        <Trash2 className="h-4 w-4 mr-1" /> Remover
                      </Button>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`step-title-${index}`}>Título</Label>
                      <Input
                        id={`step-title-${index}`}
                        value={step.title}
                        onChange={(e) => handleStepChange(index, "title", e.target.value)}
                        placeholder="Ex: Troféu de Bronze - Completar o Capítulo 1"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`step-description-${index}`}>Descrição</Label>
                      <Textarea
                        id={`step-description-${index}`}
                        value={step.description}
                        onChange={(e) => handleStepChange(index, "description", e.target.value)}
                        rows={4}
                        placeholder="Descreva como obter este troféu ou completar esta etapa..."
                      />
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor={`step-image-${index}`}>URL da Imagem (opcional)</Label>
                        <Input
                          id={`step-image-${index}`}
                          value={step.image}
                          onChange={(e) => handleStepChange(index, "image", e.target.value)}
                          placeholder="https://exemplo.com/imagem.jpg"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`step-video-${index}`}>URL do Vídeo (opcional)</Label>
                        <Input
                          id={`step-video-${index}`}
                          value={step.video}
                          onChange={(e) => handleStepChange(index, "video", e.target.value)}
                          placeholder="https://youtube.com/watch?v=..."
                        />
                      </div>
                    </div>
                  </div>
                ))}

                <Button type="button" variant="outline" onClick={addStep} className="w-full bg-transparent">
                  <Plus className="h-4 w-4 mr-2" /> Adicionar Passo
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="author" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Informações do Autor</CardTitle>
              <CardDescription>
                Selecione um autor existente ou crie um novo na seção "Gerenciar Autores".
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="author-select">Autor</Label>
                <Select
                  value={selectedAuthorId || ""}
                  onValueChange={(value) => setSelectedAuthorId(value === "" ? null : value)}
                >
                  <SelectTrigger id="author-select">
                    <SelectValue placeholder="Selecione um autor" />
                  </SelectTrigger>
                  <SelectContent>
                    {authors.map((author) => (
                      <SelectItem key={author.id} value={author.id!}>
                        {author.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
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
