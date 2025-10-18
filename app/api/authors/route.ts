import { NextResponse } from "next/server"
import { getAuthors } from "@/lib/data"

export async function GET() {
  try {
    const authors = await getAuthors()
    return NextResponse.json(authors)
  } catch (error) {
    console.error("Erro ao buscar autores:", error)
    return NextResponse.json(
      { error: "Erro ao buscar autores: " + (error instanceof Error ? error.message : String(error)) },
      { status: 500 },
    )
  }
}
