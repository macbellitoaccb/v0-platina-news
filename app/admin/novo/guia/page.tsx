"use client"

import GuideForm from "@/components/guide-form"
import { createGuide } from "@/app/actions"

export default function NovoGuiaPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Novo Guia de Platina</h1>
      <GuideForm onSubmit={createGuide} />
    </div>
  )
}
