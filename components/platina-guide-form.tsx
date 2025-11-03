"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { PlatinaGuide, PlatinaDifficulty } from "@/lib/types"

interface PlatinaGuideFormProps {
  guide: PlatinaGuide
  onChange: (guide: PlatinaGuide) => void
}

export default function PlatinaGuideForm({ guide, onChange }: PlatinaGuideFormProps) {
  const handleChange = (field: keyof PlatinaGuide, value: any) => {
    onChange({ ...guide, [field]: value })
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="guide-difficulty">Dificuldade (1-10)</Label>
          <Select
            value={guide.difficulty}
            onValueChange={(value) => handleChange("difficulty", value as PlatinaDifficulty)}
          >
            <SelectTrigger id="guide-difficulty">
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

        <div className="space-y-2">
          <Label htmlFor="guide-timeToPlat">Tempo para Platinar</Label>
          <Input
            id="guide-timeToPlat"
            value={guide.timeToPlat}
            onChange={(e) => handleChange("timeToPlat", e.target.value)}
            placeholder="Ex: 20-30h"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="guide-missableTrophies" className="cursor-pointer">
            Possui Troféus Perdíveis?
          </Label>
          <Switch
            id="guide-missableTrophies"
            checked={guide.missableTrophies}
            onCheckedChange={(checked) => handleChange("missableTrophies", checked)}
          />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="guide-onlineRequired" className="cursor-pointer">
            Requer Troféus Online?
          </Label>
          <Switch
            id="guide-onlineRequired"
            checked={guide.onlineRequired}
            onCheckedChange={(checked) => handleChange("onlineRequired", checked)}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="guide-tips">Dicas para Platinar</Label>
        <Textarea
          id="guide-tips"
          value={guide.tips}
          onChange={(e) => handleChange("tips", e.target.value)}
          placeholder="Dicas e estratégias para conseguir a platina"
          rows={4}
        />
      </div>
    </div>
  )
}
