"use client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Trash2, Plus } from "lucide-react"
import type { AdditionalImage } from "@/lib/types"

interface AdditionalImagesFormProps {
  images: AdditionalImage[]
  onChange: (images: AdditionalImage[]) => void
}

export default function AdditionalImagesForm({ images, onChange }: AdditionalImagesFormProps) {
  const addImage = () => {
    const newImages = [...images, { url: "", caption: "" }]
    onChange(newImages)
  }

  const removeImage = (index: number) => {
    const newImages = [...images]
    newImages.splice(index, 1)
    onChange(newImages)
  }

  const updateImage = (index: number, field: keyof AdditionalImage, value: string) => {
    const newImages = [...images]
    newImages[index] = { ...newImages[index], [field]: value }
    onChange(newImages)
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Label>Imagens Adicionais (2-5)</Label>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addImage}
          disabled={images.length >= 5}
          className="flex items-center gap-1"
        >
          <Plus className="h-4 w-4" />
          Adicionar Imagem
        </Button>
      </div>

      {images.length === 0 && (
        <p className="text-sm text-muted-foreground">
          Adicione imagens que serão exibidas ao longo do review, como em uma revista de games.
        </p>
      )}

      {images.map((image, index) => (
        <div key={index} className="grid grid-cols-1 gap-4 p-4 border rounded-md bg-secondary/20">
          <div className="space-y-2">
            <Label htmlFor={`image-url-${index}`}>URL da Imagem {index + 1}</Label>
            <Input
              id={`image-url-${index}`}
              value={image.url}
              onChange={(e) => updateImage(index, "url", e.target.value)}
              placeholder="https://exemplo.com/imagem.jpg"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor={`image-caption-${index}`}>Legenda</Label>
            <Input
              id={`image-caption-${index}`}
              value={image.caption}
              onChange={(e) => updateImage(index, "caption", e.target.value)}
              placeholder="Descreva a imagem brevemente"
            />
          </div>
          <Button
            type="button"
            variant="destructive"
            size="sm"
            onClick={() => removeImage(index)}
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
