import { NextResponse } from "next/server"
import { getAuthorById } from "@/lib/data"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const author = await getAuthorById(params.id)

    if (!author) {
      return NextResponse.json({ error: "Autor não encontrado" }, { status: 404 })
    }

    return NextResponse.json(author)
  } catch (error) {
    console.error("Erro ao buscar autor:", error)
    return NextResponse.json(
      { error: "Erro ao buscar autor: " + (error instanceof Error ? error.message : String(error)) },
      { status: 500 },
    )
  }
}
