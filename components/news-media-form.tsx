"use client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Trash2, Plus } from "lucide-react"
import type { NewsMedia } from "@/lib/types"

interface NewsMediaFormProps {
  media: NewsMedia[]
  onChange: (media: NewsMedia[]) => void
}

export default function NewsMediaForm({ media, onChange }: NewsMediaFormProps) {
  const addMedia = () => {
    const newMedia = [...media, { type: "image" as const, url: "", caption: "" }]
    onChange(newMedia)
  }

  const removeMedia = (index: number) => {
    const newMedia = [...media]
    newMedia.splice(index, 1)
    onChange(newMedia)
  }

  const updateMedia = (index: number, field: keyof NewsMedia, value: string) => {
    const newMedia = [...media]
    newMedia[index] = { ...newMedia[index], [field]: value }
    onChange(newMedia)
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Label>Imagens e Vídeos Adicionais</Label>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addMedia}
          className="flex items-center gap-1 bg-transparent"
        >
          <Plus className="h-4 w-4" />
          Adicionar Mídia
        </Button>
      </div>

      {media.length === 0 && (
        <p className="text-sm text-muted-foreground">
          Adicione imagens ou vídeos do YouTube que serão exibidos ao longo da notícia.
        </p>
      )}

      {media.map((item, index) => (
        <div key={index} className="grid grid-cols-1 gap-4 p-4 border rounded-md bg-secondary/20">
          <div className="space-y-2">
            <Label htmlFor={`media-type-${index}`}>Tipo {index + 1}</Label>
            <Select value={item.type} onValueChange={(value) => updateMedia(index, "type", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="image">Imagem</SelectItem>
                <SelectItem value="video">Vídeo do YouTube</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor={`media-url-${index}`}>
              {item.type === "image" ? "URL da Imagem" : "URL do Vídeo do YouTube"}
            </Label>
            <Input
              id={`media-url-${index}`}
              value={item.url}
              onChange={(e) => updateMedia(index, "url", e.target.value)}
              placeholder={
                item.type === "image" ? "https://exemplo.com/imagem.jpg" : "https://www.youtube.com/watch?v=..."
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor={`media-caption-${index}`}>Legenda (opcional)</Label>
            <Input
              id={`media-caption-${index}`}
              value={item.caption}
              onChange={(e) => updateMedia(index, "caption", e.target.value)}
              placeholder="Descreva a mídia brevemente"
            />
          </div>

          <Button
            type="button"
            variant="destructive"
            size="sm"
            onClick={() => removeMedia(index)}
            className="w-full sm:w-auto mt-2"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Remover
          </Button>
        </div>
      ))}
    </div>
  )
}
