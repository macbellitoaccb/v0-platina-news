# 🎮 PlatinaNews - Portal de Reviews e Notícias de Games

Portal completo de reviews, notícias e guias de videogames com foco em troféus PlayStation. Design escuro estilo "gamer magazine" com tema roxo/violeta.

![PlatinaNews](https://platinanews.vercel.app/og-image.png)

## 📋 Índice

- [Características](#características)
- [Tecnologias](#tecnologias)
- [Instalação Local](#instalação-local)
- [Configuração](#configuração)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Banco de Dados](#banco-de-dados)
- [Deploy](#deploy)
- [Manutenção](#manutenção)

## ✨ Características

### Funcionalidades Principais
- ✅ **Reviews de Jogos** com sistema de troféus (Bronze, Prata, Ouro, Platina)
- ✅ **Notícias** sobre o mundo dos games
- ✅ **Guias Platina** com passos detalhados
- ✅ **Sistema de Autores** com perfis completos
- ✅ **Painel Admin** para gerenciar todo o conteúdo
- ✅ **Design Responsivo** mobile-first
- ✅ **Dark Mode** fixo com tema gamer

### Sistema de Troféus
- 🥉 **Bronze**: Jogos fracos (nota baixa)
- 🥈 **Prata**: Jogos medianos
- 🥇 **Ouro**: Jogos muito bons
- 💎 **Platina**: Obras-primas

## 🛠 Tecnologias

### Frontend
- **Next.js 14** - Framework React com App Router
- **React 18** - Biblioteca UI
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Estilização
- **shadcn/ui** - Componentes UI
- **Lucide React** - Ícones

### Backend
- **Supabase** - Banco de dados PostgreSQL
- **Next.js API Routes** - Endpoints da API

### Ferramentas
- **ESLint** - Linting
- **PostCSS** - Processamento CSS
- **Autoprefixer** - Prefixos CSS

## 🚀 Instalação Local

### Pré-requisitos
- Node.js 18+ instalado
- npm, yarn ou pnpm
- Conta no Supabase (gratuita)

### Passo 1: Clonar o Repositório

\`\`\`bash
git clone https://github.com/seu-usuario/platina-news.git
cd platina-news
\`\`\`

### Passo 2: Instalar Dependências

\`\`\`bash
npm install
# ou
yarn install
# ou
pnpm install
\`\`\`

### Passo 3: Configurar Variáveis de Ambiente

Crie um arquivo `.env.local` na raiz do projeto:

\`\`\`env
# Supabase
SUPABASE_URL=sua_url_do_supabase
SUPABASE_SERVICE_ROLE_KEY=sua_service_role_key
NEXT_PUBLIC_SUPABASE_URL=sua_url_do_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_anon_key

# Admin (opcional)
ENABLE_ADMIN=true
\`\`\`

**Como obter as chaves do Supabase:**
1. Acesse [supabase.com](https://supabase.com)
2. Crie um novo projeto (gratuito)
3. Vá em Settings > API
4. Copie a URL e as chaves

### Passo 4: Configurar Banco de Dados

Execute o script SQL no Supabase (veja `docs/DATABASE.md` para o schema completo):

\`\`\`sql
-- Copie e execute o conteúdo de docs/database-schema.sql
-- no SQL Editor do Supabase
\`\`\`

### Passo 5: Rodar Localmente

\`\`\`bash
npm run dev
# ou
yarn dev
# ou
pnpm dev
\`\`\`

Acesse [http://localhost:3000](http://localhost:3000)

## ⚙️ Configuração

### Estrutura de Pastas

\`\`\`
platina-news/
├── app/                    # Páginas Next.js (App Router)
│   ├── admin/             # Painel administrativo
│   ├── reviews/           # Páginas de reviews
│   ├── noticias/          # Páginas de notícias
│   ├── guias/             # Páginas de guias
│   └── page.tsx           # Homepage
├── components/            # Componentes React
│   ├── ui/               # Componentes shadcn/ui
│   ├── header.tsx        # Cabeçalho do site
│   ├── footer.tsx        # Rodapé
│   └── ...               # Outros componentes
├── lib/                   # Utilitários e lógica
│   ├── data.ts           # Funções de acesso ao banco
│   ├── types.ts          # Tipos TypeScript
│   ├── utils.ts          # Funções auxiliares
│   └── supabase.ts       # Cliente Supabase
├── public/               # Arquivos estáticos
├── docs/                 # Documentação
└── ...                   # Arquivos de configuração
\`\`\`

### Variáveis de Ambiente

| Variável | Descrição | Obrigatória |
|----------|-----------|-------------|
| `SUPABASE_URL` | URL do projeto Supabase | Sim |
| `SUPABASE_SERVICE_ROLE_KEY` | Chave de serviço do Supabase | Sim |
| `NEXT_PUBLIC_SUPABASE_URL` | URL pública do Supabase | Sim |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Chave anônima do Supabase | Sim |
| `ENABLE_ADMIN` | Habilita painel admin | Não |

## 🗄️ Banco de Dados

### Schema Principal

O banco de dados usa PostgreSQL via Supabase com as seguintes tabelas:

- **reviews** - Reviews de jogos
- **news** - Notícias
- **guides** - Guias platina
- **authors** - Autores/editores
- **genres** - Gêneros de jogos
- **tags** - Tags para categorização
- **review_genres** - Relação reviews ↔ gêneros
- **review_tags** - Relação reviews ↔ tags
- **guide_tags** - Relação guias ↔ tags
- **additional_images** - Imagens extras dos reviews
- **guide_steps** - Passos dos guias

Veja `docs/DATABASE.md` para detalhes completos do schema.

## 🌐 Deploy

### Vercel (Recomendado)

1. Faça push do código para GitHub
2. Acesse [vercel.com](https://vercel.com)
3. Importe o repositório
4. Configure as variáveis de ambiente
5. Deploy automático!

### Outras Plataformas

O projeto é compatível com qualquer plataforma que suporte Next.js:
- **Netlify**
- **Railway**
- **Render**
- **AWS Amplify**

## 🔧 Manutenção

### Adicionar Novo Review

1. Acesse `/admin`
2. Clique em "Nova Review"
3. Preencha os campos:
   - Título
   - Conteúdo (Markdown suportado)
   - Imagem de capa
   - Rating (Bronze/Prata/Ouro/Platina)
   - Nome do jogo
   - Gêneros e tags
   - Autor
4. Salvar

### Adicionar Nova Notícia

1. Acesse `/admin`
2. Clique em "Nova Notícia"
3. Preencha título, conteúdo, imagem e autor
4. Salvar

### Gerenciar Autores

1. Acesse `/admin/autores`
2. Adicione ou edite autores
3. Configure perfil completo:
   - Nome
   - Avatar
   - PSN ID
   - Redes sociais
   - Bio

### Backup do Banco de Dados

\`\`\`bash
# Via Supabase Dashboard
# Settings > Database > Backups
# Ou use pg_dump para backup manual
\`\`\`

## 📚 Documentação Adicional

- [Guia de Desenvolvimento](docs/DEVELOPMENT.md)
- [Schema do Banco de Dados](docs/DATABASE.md)
- [Guia de Componentes](docs/COMPONENTS.md)
- [API Reference](docs/API.md)

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 📞 Suporte

- **Email**: suporte@platinanews.com
- **Discord**: [PlatinaNews Community](https://discord.gg/platinanews)
- **Issues**: [GitHub Issues](https://github.com/seu-usuario/platina-news/issues)

---

Feito com 💜 por PlatinaNews Team
