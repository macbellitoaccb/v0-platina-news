"use client"

import AuthorManagementForm from "@/components/author-management-form"
import { createAuthor } from "@/app/actions"

export default function NovoAutorPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Novo Autor</h1>
      <AuthorManagementForm onSubmit={createAuthor} isNewAuthor={true} />
    </div>
  )
}
