import { NextResponse } from "next/server"
import { getPlatinadorTipById } from "@/lib/data"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const tip = await getPlatinadorTipById(params.id)

    if (!tip) {
      return NextResponse.json({ error: "Dica não encontrada" }, { status: 404 })
    }

    return NextResponse.json(tip)
  } catch (error) {
    console.error("Erro ao buscar dica:", error)
    return NextResponse.json(
      { error: "Erro ao buscar dica: " + (error instanceof Error ? error.message : String(error)) },
      { status: 500 },
    )
  }
}
