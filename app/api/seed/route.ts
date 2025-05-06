import { NextResponse } from "next/server"
import { seedSupabaseDatabase } from "@/lib/seed-supabase"

export async function GET() {
  try {
    await seedSupabaseDatabase()
    return NextResponse.json({ success: true, message: "Banco de dados populado com sucesso!" })
  } catch (error) {
    console.error("Erro ao popular banco de dados:", error)
    return NextResponse.json({ success: false, error: "Erro ao popular banco de dados" }, { status: 500 })
  }
}
