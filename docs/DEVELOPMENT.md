# 🛠️ Guia de Desenvolvimento

## Configuração do Ambiente

### Requisitos

- Node.js 18+
- npm/yarn/pnpm
- Git
- Editor de código (VS Code recomendado)

### Extensões VS Code Recomendadas

\`\`\`json
{
  "recommendations": [
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "bradlc.vscode-tailwindcss",
    "ms-vscode.vscode-typescript-next"
  ]
}
\`\`\`

## Estrutura do Código

### Componentes

Os componentes seguem a estrutura:

\`\`\`tsx
// components/exemplo.tsx
import { cn } from "@/lib/utils"

interface ExemploProps {
  className?: string
  // outras props
}

export default function Exemplo({ className }: ExemploProps) {
  return (
    <div className={cn("base-classes", className)}>
      {/* conteúdo */}
    </div>
  )
}
\`\`\`

### Páginas (App Router)

\`\`\`tsx
// app/exemplo/page.tsx
import { getData } from "@/lib/data"

export default async function ExemploPage() {
  const data = await getData()
  
  return (
    <div>
      {/* conteúdo */}
    </div>
  )
}
\`\`\`

### Funções de Dados

\`\`\`tsx
// lib/data.ts
export async function getData(): Promise<Data[]> {
  const supabase = createSafeSupabaseClient()
  
  if (!supabase) {
    return mockData
  }
  
  try {
    const { data, error } = await supabase
      .from('table')
      .select('*')
    
    if (error) throw error
    return data
  } catch (error) {
    console.error('Error:', error)
    return mockData
  }
}
\`\`\`

## Convenções de Código

### Nomenclatura

- **Componentes**: PascalCase (`ReviewCard.tsx`)
- **Funções**: camelCase (`getReviews()`)
- **Constantes**: UPPER_SNAKE_CASE (`MAX_ITEMS`)
- **Arquivos**: kebab-case (`review-card.tsx`)

### TypeScript

Sempre use tipos explícitos:

\`\`\`tsx
// ✅ Bom
interface Review {
  id: string
  title: string
  rating: 'bronze' | 'silver' | 'gold' | 'platinum'
}

// ❌ Evitar
const review: any = {}
\`\`\`

### Tailwind CSS

Use classes utilitárias e o helper `cn()`:

\`\`\`tsx
// ✅ Bom
<div className={cn(
  "base-class",
  condition && "conditional-class",
  className
)}>

// ❌ Evitar
<div className="base-class" style={{ color: 'red' }}>
\`\`\`

## Fluxo de Trabalho

### 1. Criar Nova Feature

\`\`\`bash
git checkout -b feature/nome-da-feature
\`\`\`

### 2. Desenvolver

\`\`\`bash
npm run dev
\`\`\`

### 3. Testar

\`\`\`bash
npm run lint
npm run build
\`\`\`

### 4. Commit

\`\`\`bash
git add .
git commit -m "feat: adiciona nova funcionalidade"
\`\`\`

Padrões de commit:
- `feat:` - Nova funcionalidade
- `fix:` - Correção de bug
- `docs:` - Documentação
- `style:` - Formatação
- `refactor:` - Refatoração
- `test:` - Testes
- `chore:` - Manutenção

### 5. Push e PR

\`\`\`bash
git push origin feature/nome-da-feature
\`\`\`

Abra um Pull Request no GitHub.

## Debugging

### Console Logs

Use o prefixo `[v0]` para logs de debug:

\`\`\`tsx
console.log("[v0] Fetching data...")
console.error("[v0] Error:", error)
\`\`\`

### React DevTools

Instale a extensão React DevTools para inspecionar componentes.

### Network Tab

Use o Network tab do navegador para debugar requisições ao Supabase.

## Performance

### Otimizações

1. **Imagens**: Use Next.js Image component
\`\`\`tsx
import Image from 'next/image'

<Image 
  src="/image.jpg"
  width={800}
  height={600}
  alt="Description"
/>
\`\`\`

2. **Lazy Loading**: Use dynamic imports
\`\`\`tsx
import dynamic from 'next/dynamic'

const HeavyComponent = dynamic(() => import('./HeavyComponent'))
\`\`\`

3. **Memoization**: Use React.memo para componentes pesados
\`\`\`tsx
const ExpensiveComponent = React.memo(({ data }) => {
  // renderização pesada
})
\`\`\`

## Testes

### Testes Manuais

Checklist antes de fazer commit:
- [ ] Página carrega sem erros
- [ ] Responsivo funciona (mobile/tablet/desktop)
- [ ] Links funcionam
- [ ] Formulários validam corretamente
- [ ] Imagens carregam
- [ ] Performance aceitável

### Testes Automatizados (Futuro)

\`\`\`bash
# Instalar dependências de teste
npm install -D @testing-library/react @testing-library/jest-dom jest

# Rodar testes
npm test
\`\`\`

## Troubleshooting Comum

### Erro: "Module not found"

\`\`\`bash
# Limpar cache e reinstalar
rm -rf node_modules .next
npm install
\`\`\`

### Erro: "Hydration failed"

Certifique-se de que o HTML do servidor e cliente são idênticos. Evite usar `window` ou `document` em componentes do servidor.

### Erro: Supabase connection

Verifique:
1. Variáveis de ambiente no `.env.local`
2. Projeto Supabase está ativo
3. Chaves de API estão corretas

## Recursos Úteis

- [Next.js Docs](https://nextjs.org/docs)
- [React Docs](https://react.dev)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Supabase Docs](https://supabase.com/docs)
- [shadcn/ui Docs](https://ui.shadcn.com)

---

Dúvidas? Abra uma issue no GitHub!
