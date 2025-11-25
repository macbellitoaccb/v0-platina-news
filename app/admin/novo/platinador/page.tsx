"use client"

import PostForm from "@/components/post-form"
import { createPlatinadorTip } from "@/app/actions"

export default function NovaPlatinadorPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Novo Canto do Platinador</h1>
      <PostForm type="platinador-tip" onSubmit={createPlatinadorTip} />
    </div>
  )
}
