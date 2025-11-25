"use client"

import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { removePlatinadorTip } from "@/app/actions"
import { getPlatinadorTipById } from "@/lib/data"
import { useState, useEffect } from "react"
import type { PlatinadorTip } from "@/lib/types"

export default function ExcluirPlatinadorPage() {
  const { id } = useParams()
  const router = useRouter()
  const [tip, setTip] = useState<PlatinadorTip | null>(null)

  useEffect(() => {
    if (id) {
      getPlatinadorTipById(id as string).then(setTip)
    }
  }, [id])

  const handleDelete = async () => {
    if (!tip) return
    await removePlatinadorTip(tip.id)
    router.push("/admin")
  }

  if (!tip) return <div>Dica não encontrada</div>

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Excluir Canto do Platinador</h1>
      <p>Tem certeza que deseja excluir "{tip.title}"?</p>
      <div className="flex gap-4">
        <Button onClick={handleDelete} variant="destructive">
          Sim, Excluir
        </Button>
        <Button onClick={() => router.back()} variant="outline">
          Cancelar
        </Button>
      </div>
    </div>
  )
}
