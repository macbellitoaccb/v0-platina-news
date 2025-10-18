import Link from "next/link"
import { Button } from "@/components/ui/button"
import { getAuthors } from "@/lib/data"
import { PlusCircle } from "lucide-react"
import Image from "next/image"

export default async function AdminAuthorsPage() {
  const authors = await getAuthors()

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Gerenciar Autores</h1>
        <Link href="/admin/novo/autor">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Novo Autor
          </Button>
        </Link>
      </div>

      <div className="rounded-md border">
        <div className="relative w-full overflow-auto">
          <table className="w-full caption-bottom text-sm">
            <thead className="[&_tr]:border-b">
              <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                <th className="h-12 px-4 text-left align-middle font-medium">Autor</th>
                <th className="h-12 px-4 text-left align-middle font-medium">Bio</th>
                <th className="h-12 px-4 text-left align-middle font-medium">Ações</th>
              </tr>
            </thead>
            <tbody className="[&_tr:last-child]:border-0">
              {authors.length > 0 ? (
                authors.map((author) => (
                  <tr key={author.id} className="border-b transition-colors hover:bg-muted/50">
                    <td className="p-4 align-middle">
                      <div className="flex items-center gap-3">
                        <div className="relative h-10 w-10 overflow-hidden rounded-full">
                          <Image
                            src={author.avatar || "/placeholder.svg?height=50&width=50"}
                            alt={author.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <span className="font-medium">{author.name}</span>
                      </div>
                    </td>
                    <td className="p-4 align-middle text-muted-foreground max-w-xs truncate">{author.bio || "N/A"}</td>
                    <td className="p-4 align-middle">
                      <div className="flex gap-2">
                        <Link href={`/admin/editar/autor/${author.id}`}>
                          <Button variant="outline" size="sm">
                            Editar
                          </Button>
                        </Link>
                        <Link href={`/admin/excluir/autor/${author.id}`}>
                          <Button variant="destructive" size="sm">
                            Excluir
                          </Button>
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="p-4 text-center text-muted-foreground">
                    Nenhum autor encontrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
