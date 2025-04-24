"use client"

import { getNews } from "@/lib/data"
import PostForm from "@/components/post-form"
import { updateNews } from "@/app/actions"
import { notFound } from "next/navigation"

interface EditNewsPageProps {
  params: {
    id: string
  }
}

export default function EditNewsPage({ params }: EditNewsPageProps) {
  const newsItems = getNews()
  const news = newsItems.find((n) => n.id === params.id)

  if (!news) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Editar Notícia</h1>
      <PostForm type="news" initialData={news} onSubmit={updateNews} />
    </div>
  )
}
