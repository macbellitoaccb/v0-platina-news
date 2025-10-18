"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { removeAuthor } from "@/app/actions"

interface DeleteAuthorPageProps {
  params: {
    id: string
  }
}

export default function DeleteAuthorPage({ params }: DeleteAuthorPageProps) {
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    try {
      setIsDeleting(true)
      await removeAuthor(params.id)
      // Redirecionar automaticamente para o painel admin
      router.push("/admin/autores")
      router.refresh()
    } catch (error) {
      console.error("Erro ao excluir autor:", error)
      setIsDeleting(false)
    }
  }

  return (
    <div className="flex items-center justify-center py-12">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Confirmar exclusão</CardTitle>
          <CardDescription>Tem certeza que deseja excluir este autor? Esta ação não pode ser desfeita.</CardDescription>
        </CardHeader>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={() => router.back()} disabled={isDeleting}>
            Cancelar
          </Button>
          <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
            {isDeleting ? "Excluindo..." : "Excluir"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
