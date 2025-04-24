"use client"

import PostForm from "@/components/post-form"
import { createNews } from "@/app/actions"

export default function NovaNoticiaPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Nova Notícia</h1>
      <PostForm type="news" onSubmit={createNews} />
    </div>
  )
}
