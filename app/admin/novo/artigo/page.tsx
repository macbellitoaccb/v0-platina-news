"use client"

import PostForm from "@/components/post-form"
import { createArticle } from "@/app/actions"

export default function NovoArtigoPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Novo Artigo</h1>
      <PostForm type="article" onSubmit={createArticle} />
    </div>
  )
}
