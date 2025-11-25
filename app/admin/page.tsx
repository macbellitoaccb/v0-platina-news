import Link from "next/link"
import { Button } from "@/components/ui/button"
import { getAllPosts } from "@/lib/data"
import { formatDate } from "@/lib/utils"
import { PlusCircle, Users } from "lucide-react" // Importe o ícone Users

export default async function AdminPage() {
  const posts = await getAllPosts()

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Painel Admin</h1>
        <div className="flex gap-2">
          <Link href="/admin/novo/review">
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Nova Review
            </Button>
          </Link>
          <Link href="/admin/novo/noticia">
            <Button variant="outline">
              <PlusCircle className="mr-2 h-4 w-4" />
              Nova Notícia
            </Button>
          </Link>
          <Link href="/admin/novo/guia">
            <Button variant="secondary">
              <PlusCircle className="mr-2 h-4 w-4" />
              Novo Guia
            </Button>
          </Link>
          <Link href="/admin/novo/artigo">
            <Button variant="outline">
              <PlusCircle className="mr-2 h-4 w-4" />
              Novo Artigo
            </Button>
          </Link>
          <Link href="/admin/novo/platinador">
            <Button variant="outline">
              <PlusCircle className="mr-2 h-4 w-4" />
              Nova Dica
            </Button>
          </Link>
          <Link href="/admin/autores">
            <Button variant="ghost">
              <Users className="mr-2 h-4 w-4" />
              Autores
            </Button>
          </Link>
        </div>
      </div>

      <div className="rounded-md border">
        <div className="relative w-full overflow-auto">
          <table className="w-full caption-bottom text-sm">
            <thead className="[&_tr]:border-b">
              <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                <th className="h-12 px-4 text-left align-middle font-medium">Título</th>
                <th className="h-12 px-4 text-left align-middle font-medium">Tipo</th>
                <th className="h-12 px-4 text-left align-middle font-medium">Data</th>
                <th className="h-12 px-4 text-left align-middle font-medium">Ações</th>
              </tr>
            </thead>
            <tbody className="[&_tr:last-child]:border-0">
              {posts.length > 0 ? (
                posts.map((post) => (
                  <tr key={post.id} className="border-b transition-colors hover:bg-muted/50">
                    <td className="p-4 align-middle">{post.title}</td>
                    <td className="p-4 align-middle capitalize">{post.type}</td>
                    <td className="p-4 align-middle">{formatDate(post.createdAt)}</td>
                    <td className="p-4 align-middle">
                      <div className="flex gap-2">
                        <Link href={`/admin/editar/${post.type}/${post.id}`}>
                          <Button variant="outline" size="sm">
                            Editar
                          </Button>
                        </Link>
                        <Link href={`/admin/excluir/${post.type}/${post.id}`}>
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
                  <td colSpan={4} className="p-4 text-center text-muted-foreground">
                    Nenhum conteúdo encontrado.
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
