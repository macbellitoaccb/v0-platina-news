"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Author } from "@/lib/types"

interface AuthorManagementFormProps {
  initialData?: Author // Remove email and password for creation
  onSubmit: (data: Author) => Promise<void>
  isNewAuthor?: boolean // Flag to indicate if it's a new author creation
}

export default function AuthorManagementForm({
  initialData,
  onSubmit,
  isNewAuthor = false,
}: AuthorManagementFormProps) {
  const router = useRouter()
  const isEditing = !!initialData && !isNewAuthor // Only true if editing an existing author, not creating a new one

  const [formData, setFormData] = useState<Author>(
    initialData || {
      name: "",
      avatar: "",
      psnId: "",
      instagram: "",
      twitter: "",
      bio: "",
      role: "author",
    },
  )

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleRoleChange = (value: string) => {
    setFormData((prev) => ({ ...prev, role: value as "admin" | "author" }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      await onSubmit(formData)
      router.push("/admin/autores")
      router.refresh()
    } catch (error) {
      console.error("Erro ao salvar autor:", error)
      setIsSubmitting(false)
    }
  }

  const [isSubmitting, setIsSubmitting] = useState(false)

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">Nome do Autor</Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
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
            value={formData.avatar || ""}
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
            value={formData.psnId || ""}
            onChange={handleChange}
            placeholder="Seu ID na PlayStation Network"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="instagram">Instagram</Label>
          <Input
            id="instagram"
            name="instagram"
            value={formData.instagram || ""}
            onChange={handleChange}
            placeholder="@seu_instagram"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="twitter">Twitter</Label>
          <Input
            id="twitter"
            name="twitter"
            value={formData.twitter || ""}
            onChange={handleChange}
            placeholder="@seu_twitter"
          />
        </div>
      </div>

      {isNewAuthor && (
        <div className="space-y-2">
          <Label htmlFor="role">Função</Label>
          <Select value={formData.role} onValueChange={handleRoleChange}>
            <SelectTrigger id="role">
              <SelectValue placeholder="Selecione a função" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="author">Autor</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="bio">Biografia</Label>
        <Textarea
          id="bio"
          name="bio"
          value={formData.bio || ""}
          onChange={handleChange}
          placeholder="Uma breve descrição sobre o autor"
          rows={3}
        />
      </div>

      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline" onClick={() => router.push("/admin/autores")} disabled={isSubmitting}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Salvando..." : isEditing ? "Atualizar Autor" : "Criar Autor"}
        </Button>
      </div>
    </form>
  )
}
