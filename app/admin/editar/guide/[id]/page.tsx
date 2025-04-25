"use client"

import { getGuides } from "@/lib/data"
import GuideForm from "@/components/guide-form"
import { updateGuide } from "@/app/actions"
import { notFound } from "next/navigation"

interface EditGuidePageProps {
  params: {
    id: string
  }
}

export default function EditGuidePage({ params }: EditGuidePageProps) {
  const guides = getGuides()
  const guide = guides.find((g) => g.id === params.id)

  if (!guide) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Editar Guia de Platina</h1>
      <GuideForm initialData={guide} onSubmit={updateGuide} />
    </div>
  )
}
