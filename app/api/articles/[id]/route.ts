import { NextResponse } from "next/server"
import { getArticleById } from "@/lib/data"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const article = await getArticleById(params.id)

    if (!article) {
      return NextResponse.json({ error: "Artigo não encontrado" }, { status: 404 })
    }

    return NextResponse.json(article)
  } catch (error) {
    console.error("Erro ao buscar artigo:", error)
    return NextResponse.json(
      { error: "Erro ao buscar artigo: " + (error instanceof Error ? error.message : String(error)) },
      { status: 500 },
    )
  }
}
