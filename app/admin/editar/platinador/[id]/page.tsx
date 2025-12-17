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
    console.log("[v0] EditarPlatinadorPage: id from params:", id)
    if (id) {
      getPlatinadorTipById(id as string).then((data) => {
        console.log("[v0] EditarPlatinadorPage: tip data received:", data)
        setTip(data)
        setLoading(false)
      })
    }
  }, [id])

  if (loading) return <div className="p-8">Carregando...</div>
  if (!tip) return <div className="p-8">Dica não encontrada</div>

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Editar Canto do Platinador</h1>
      <PostForm type="platinador" initialData={tip} onSubmit={updatePlatinadorTip} />
    </div>
  )
}
