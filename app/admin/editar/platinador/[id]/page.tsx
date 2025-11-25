"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import PostForm from "@/components/post-form"
import { updatePlatinadorTip } from "@/app/actions"
import { getPlatinadorTipById } from "@/lib/data"
import type { PlatinadorTip } from "@/lib/types"

export default function EditarPlatinadorPage() {
  const { id } = useParams()
  const [tip, setTip] = useState<PlatinadorTip | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (id) {
      getPlatinadorTipById(id as string).then((data) => {
        setTip(data)
        setLoading(false)
      })
    }
  }, [id])

  if (loading) return <div>Carregando...</div>
  if (!tip) return <div>Dica não encontrada</div>

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Editar Canto do Platinador</h1>
      <PostForm type="platinador-tip" initialData={tip} onSubmit={updatePlatinadorTip} />
    </div>
  )
}
