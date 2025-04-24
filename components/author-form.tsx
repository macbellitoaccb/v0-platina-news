"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import type { Author } from "@/lib/types"

interface AuthorFormProps {
  author: Author
  onChange: (author: Author) => void
}

export default function AuthorForm({ author, onChange }: AuthorFormProps) {
  const handleChange = (field: keyof Author, value: string) => {
    onChange({ ...author, [field]: value })
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="author-name">Nome do Autor</Label>
          <Input
            id="author-name"
            value={author.name}
            onChange={(e) => handleChange("name", e.target.value)}
            placeholder="Nome completo"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="author-avatar">URL do Avatar</Label>
          <Input
            id="author-avatar"
            value={author.avatar || ""}
            onChange={(e) => handleChange("avatar", e.target.value)}
            placeholder="https://exemplo.com/avatar.jpg"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="author-psnId">PSN ID</Label>
          <Input
            id="author-psnId"
            value={author.psnId || ""}
            onChange={(e) => handleChange("psnId", e.target.value)}
            placeholder="Seu ID na PlayStation Network"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="author-instagram">Instagram</Label>
          <Input
            id="author-instagram"
            value={author.instagram || ""}
            onChange={(e) => handleChange("instagram", e.target.value)}
            placeholder="@seu_instagram"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="author-twitter">Twitter</Label>
          <Input
            id="author-twitter"
            value={author.twitter || ""}
            onChange={(e) => handleChange("twitter", e.target.value)}
            placeholder="@seu_twitter"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="author-bio">Biografia</Label>
        <Textarea
          id="author-bio"
          value={author.bio || ""}
          onChange={(e) => handleChange("bio", e.target.value)}
          placeholder="Uma breve descrição sobre o autor"
          rows={3}
        />
      </div>
    </div>
  )
}
