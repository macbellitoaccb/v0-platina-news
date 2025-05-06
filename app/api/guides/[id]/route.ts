import { NextResponse } from "next/server"
import { getGuideById } from "@/lib/data"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const guide = await getGuideById(params.id)

    if (!guide) {
      return NextResponse.json({ error: "Guia não encontrado" }, { status: 404 })
    }

    return NextResponse.json(guide)
  } catch (error) {
    console.error("Erro ao buscar guia:", error)
    return NextResponse.json(
      { error: "Erro ao buscar guia: " + (error instanceof Error ? error.message : String(error)) },
      { status: 500 },
    )
  }
}
