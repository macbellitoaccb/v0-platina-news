"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, Trash2, ThumbsUp, ThumbsDown } from "lucide-react"

interface ProsConsFormProps {
  pros: string[]
  cons: string[]
  onChange: (pros: string[], cons: string[]) => void
}

export default function ProsConsForm({ pros, cons, onChange }: ProsConsFormProps) {
  const addPro = () => {
    onChange([...pros, ""], cons)
  }

  const removePro = (index: number) => {
    const newPros = [...pros]
    newPros.splice(index, 1)
    onChange(newPros, cons)
  }

  const updatePro = (index: number, value: string) => {
    const newPros = [...pros]
    newPros[index] = value
    onChange(newPros, cons)
  }

  const addCon = () => {
    onChange(pros, [...cons, ""])
  }

  const removeCon = (index: number) => {
    const newCons = [...cons]
    newCons.splice(index, 1)
    onChange(pros, newCons)
  }

  const updateCon = (index: number, value: string) => {
    const newCons = [...cons]
    newCons[index] = value
    onChange(pros, newCons)
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* PRÓS */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ThumbsUp className="h-5 w-5 text-green-500" />
            <Label className="text-lg font-bold">PRÓS</Label>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addPro}
            className="flex items-center gap-1 bg-transparent"
          >
            <Plus className="h-4 w-4" />
            Adicionar
          </Button>
        </div>

        {pros.length === 0 && <p className="text-sm text-muted-foreground">Adicione os pontos positivos do jogo</p>}

        <div className="space-y-2">
          {pros.map((pro, index) => (
            <div key={index} className="flex gap-2">
              <Input
                value={pro}
                onChange={(e) => updatePro(index, e.target.value)}
                placeholder="Ex: Gráficos impressionantes"
                className="flex-1"
              />
              <Button type="button" variant="ghost" size="icon" onClick={() => removePro(index)}>
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* CONTRAS */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ThumbsDown className="h-5 w-5 text-red-500" />
            <Label className="text-lg font-bold">CONTRAS</Label>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addCon}
            className="flex items-center gap-1 bg-transparent"
          >
            <Plus className="h-4 w-4" />
            Adicionar
          </Button>
        </div>

        {cons.length === 0 && <p className="text-sm text-muted-foreground">Adicione os pontos negativos do jogo</p>}

        <div className="space-y-2">
          {cons.map((con, index) => (
            <div key={index} className="flex gap-2">
              <Input
                value={con}
                onChange={(e) => updateCon(index, e.target.value)}
                placeholder="Ex: História confusa"
                className="flex-1"
              />
              <Button type="button" variant="ghost" size="icon" onClick={() => removeCon(index)}>
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
