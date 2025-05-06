import { NextResponse } from "next/server"
import { getNewsById } from "@/lib/data"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const news = await getNewsById(params.id)

    if (!news) {
      return NextResponse.json({ error: "Notícia não encontrada" }, { status: 404 })
    }

    return NextResponse.json(news)
  } catch (error) {
    console.error("Erro ao buscar notícia:", error)
    return NextResponse.json(
      { error: "Erro ao buscar notícia: " + (error instanceof Error ? error.message : String(error)) },
      { status: 500 },
    )
  }
}
