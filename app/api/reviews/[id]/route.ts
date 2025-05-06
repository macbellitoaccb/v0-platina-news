import { NextResponse } from "next/server"
import { getReviewById } from "@/lib/data"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const review = await getReviewById(params.id)

    if (!review) {
      return NextResponse.json({ error: "Review não encontrada" }, { status: 404 })
    }

    return NextResponse.json(review)
  } catch (error) {
    console.error("Erro ao buscar review:", error)
    return NextResponse.json(
      { error: "Erro ao buscar review: " + (error instanceof Error ? error.message : String(error)) },
      { status: 500 },
    )
  }
}
