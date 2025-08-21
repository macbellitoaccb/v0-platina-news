import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Variável de ambiente para controlar o acesso ao admin (defina como "true" apenas no seu ambiente de desenvolvimento)
const ADMIN_ENABLED = process.env.ENABLE_ADMIN === "true"

// Senha para o painel admin (quando habilitado)
const ADMIN_PASSWORD = "platina123"

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Proteger as rotas do admin
  if (pathname.startsWith("/admin")) {
    // Se o admin estiver desabilitado, redirecionar para a página inicial ou mostrar 404
    if (!ADMIN_ENABLED) {
      // Opção 1: Redirecionar para a página inicial
      return NextResponse.redirect(new URL("/", request.url))

      // Opção 2: Mostrar página 404 (descomente esta linha e comente a anterior para usar esta opção)
      // return NextResponse.rewrite(new URL("/not-found", request.url))
    }

    // Se o admin estiver habilitado, verificar autenticação
    const authHeader = request.headers.get("authorization")

    if (authHeader) {
      const authValue = authHeader.split(" ")[1]
      const [user, pwd] = atob(authValue).split(":")

      if (pwd === ADMIN_PASSWORD) {
        return NextResponse.next()
      }
    }

    // Responder com autenticação básica se não estiver autenticado
    return new NextResponse("Autenticação necessária", {
      status: 401,
      headers: {
        "WWW-Authenticate": 'Basic realm="Acesso ao Painel Admin"',
      },
    })
  }

  return NextResponse.next()
}

export const config = {
  matcher: "/admin/:path*",
}
