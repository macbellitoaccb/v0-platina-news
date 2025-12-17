# Acesso ao Painel Admin

## Status Atual: PÚBLICO (Sem Autenticação)

O painel admin está atualmente **sem proteção de login** para facilitar testes e desenvolvimento.

### Acessando o Admin

Simplesmente acesse: `http://localhost:3000/admin`

Você terá acesso completo a:
- Criar reviews, notícias e guias
- Editar conteúdo existente
- Gerenciar autores
- Deletar posts

### ⚠️ IMPORTANTE - Segurança

**ANTES DE COLOCAR EM PRODUÇÃO**, você DEVE adicionar autenticação!

### Como Adicionar Autenticação Depois

O código original de autenticação está comentado no arquivo `middleware.ts`. Para reativar:

1. **Descomentar o código no middleware.ts**
2. **Configurar Supabase Auth** (já está integrado)
3. **Criar usuários admin** no Supabase

#### Exemplo de Middleware com Autenticação

```typescript
// middleware.ts
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase"

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const supabase = createServerSupabaseClient()

  // Verificar sessão do usuário
  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Verificar se é admin
  let isAdmin = false
  if (session?.user) {
    const { data: authorData } = await supabase
      .from("authors")
      .select("role")
      .eq("user_id", session.user.id)
      .single()

    if (authorData?.role === "admin") {
      isAdmin = true
    }
  }

  // Proteger rotas admin
  if (pathname.startsWith("/admin")) {
    if (!session || !isAdmin) {
      const redirectUrl = request.nextUrl.clone()
      redirectUrl.pathname = "/login"
      return NextResponse.redirect(redirectUrl)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*"],
}
```

### Sistema de Roles

O sistema já suporta roles de usuário na tabela `authors`:

- **admin**: Acesso total ao painel
- **editor**: Pode criar/editar conteúdo (futuro)
- **author**: Apenas seus próprios posts (futuro)

### Criando um Admin no Supabase

Quando configurar autenticação:

1. Criar usuário no Supabase Auth
2. Adicionar registro na tabela `authors` com:
   - `user_id`: ID do usuário do Supabase Auth
   - `role`: "admin"
   - Outros dados do perfil

```sql
-- Exemplo de query para criar admin
INSERT INTO authors (id, name, user_id, role, avatar)
VALUES (
  gen_random_uuid(),
  'Seu Nome',
  'user-id-do-supabase-auth',
  'admin',
  'url-do-avatar'
);
```

### Alternativas de Autenticação

Se não quiser usar Supabase Auth, você pode implementar:

1. **Autenticação simples com senha**
   - Variável de ambiente `ADMIN_PASSWORD`
   - Verificação no middleware

2. **NextAuth.js**
   - Suporte a múltiplos providers (Google, GitHub, etc.)
   - Fácil integração com Next.js

3. **Clerk**
   - Autenticação pronta
   - UI components inclusos

### Recomendação

Para produção, recomendo usar o **Supabase Auth** que já está integrado no projeto. É seguro, escalável e gratuito no plano free.
