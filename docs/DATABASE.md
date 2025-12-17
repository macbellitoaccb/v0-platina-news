# 📊 Documentação do Banco de Dados

## Visão Geral

O PlatinaNews usa PostgreSQL via Supabase com 11 tabelas principais para gerenciar reviews, notícias, guias e autores.

## Schema Completo

### Tabela: `reviews`

Armazena reviews de jogos com sistema de troféus.

```sql
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR NOT NULL,
  slug VARCHAR UNIQUE NOT NULL,
  content TEXT NOT NULL,
  image VARCHAR,
  rating VARCHAR CHECK (rating IN ('bronze', 'silver', 'gold', 'platinum')),
  game_name VARCHAR NOT NULL,
  author_id UUID REFERENCES authors(id) ON DELETE SET NULL,
  platina_guide JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Campos:**
- `id` - UUID único
- `title` - Título do review
- `slug` - URL amigável (único)
- `content` - Conteúdo em Markdown
- `image` - URL da imagem de capa
- `rating` - bronze | silver | gold | platinum
- `game_name` - Nome do jogo
- `author_id` - Referência ao autor
- `platina_guide` - JSON com informações do guia
- `created_at` - Data de criação
- `updated_at` - Data de atualização

### Tabela: `news`

Armazena notícias sobre games.

```sql
CREATE TABLE news (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR NOT NULL,
  slug VARCHAR UNIQUE NOT NULL,
  content TEXT NOT NULL,
  image VARCHAR,
  author_id UUID REFERENCES authors(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Campos:**
- `id` - UUID único
- `title` - Título da notícia
- `slug` - URL amigável (único)
- `content` - Conteúdo em Markdown
- `image` - URL da imagem de capa
- `author_id` - Referência ao autor
- `created_at` - Data de criação
- `updated_at` - Data de atualização

### Tabela: `guides`

Armazena guias de platina com passos detalhados.

```sql
CREATE TABLE guides (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR NOT NULL,
  slug VARCHAR UNIQUE NOT NULL,
  content TEXT NOT NULL,
  image VARCHAR,
  game_name VARCHAR NOT NULL,
  difficulty VARCHAR CHECK (difficulty IN ('easy', 'medium', 'hard', 'very_hard')),
  estimated_time VARCHAR,
  author_id UUID REFERENCES authors(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Campos:**
- `id` - UUID único
- `title` - Título do guia
- `slug` - URL amigável (único)
- `content` - Conteúdo em Markdown
- `image` - URL da imagem de capa
- `game_name` - Nome do jogo
- `difficulty` - easy | medium | hard | very_hard
- `estimated_time` - Tempo estimado (ex: "20-30 horas")
- `author_id` - Referência ao autor
- `created_at` - Data de criação
- `updated_at` - Data de atualização

### Tabela: `authors`

Armazena informações dos autores/editores.

```sql
CREATE TABLE authors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR NOT NULL,
  avatar VARCHAR,
  psn_id VARCHAR,
  instagram VARCHAR,
  twitter VARCHAR,
  bio TEXT,
  user_id UUID,
  role TEXT DEFAULT 'editor',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Campos:**
- `id` - UUID único
- `name` - Nome do autor
- `avatar` - URL do avatar
- `psn_id` - PlayStation Network ID
- `instagram` - Handle do Instagram
- `twitter` - Handle do Twitter
- `bio` - Biografia
- `user_id` - ID do usuário (para autenticação)
- `role` - Papel (editor, admin, etc.)
- `created_at` - Data de criação
- `updated_at` - Data de atualização

### Tabela: `genres`

Armazena gêneros de jogos.

```sql
CREATE TABLE genres (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR UNIQUE NOT NULL
);
```

### Tabela: `tags`

Armazena tags para categorização.

```sql
CREATE TABLE tags (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR UNIQUE NOT NULL
);
```

### Tabela: `review_genres`

Relação muitos-para-muitos entre reviews e gêneros.

```sql
CREATE TABLE review_genres (
  review_id UUID REFERENCES reviews(id) ON DELETE CASCADE,
  genre_id UUID REFERENCES genres(id) ON DELETE CASCADE,
  PRIMARY KEY (review_id, genre_id)
);
```

### Tabela: `review_tags`

Relação muitos-para-muitos entre reviews e tags.

```sql
CREATE TABLE review_tags (
  review_id UUID REFERENCES reviews(id) ON DELETE CASCADE,
  tag_id UUID REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (review_id, tag_id)
);
```

### Tabela: `guide_tags`

Relação muitos-para-muitos entre guias e tags.

```sql
CREATE TABLE guide_tags (
  guide_id UUID REFERENCES guides(id) ON DELETE CASCADE,
  tag_id UUID REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (guide_id, tag_id)
);
```

### Tabela: `additional_images`

Armazena imagens adicionais dos reviews.

```sql
CREATE TABLE additional_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  review_id UUID REFERENCES reviews(id) ON DELETE CASCADE,
  url VARCHAR NOT NULL,
  caption TEXT,
  display_order INTEGER DEFAULT 0
);
```

### Tabela: `guide_steps`

Armazena passos dos guias.

```sql
CREATE TABLE guide_steps (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  guide_id UUID REFERENCES guides(id) ON DELETE CASCADE,
  title VARCHAR NOT NULL,
  description TEXT,
  image VARCHAR,
  video VARCHAR,
  display_order INTEGER DEFAULT 0
);
```

## Índices Recomendados

```sql
-- Índices para melhor performance
CREATE INDEX idx_reviews_slug ON reviews(slug);
CREATE INDEX idx_reviews_rating ON reviews(rating);
CREATE INDEX idx_reviews_created_at ON reviews(created_at DESC);
CREATE INDEX idx_news_slug ON news(slug);
CREATE INDEX idx_news_created_at ON news(created_at DESC);
CREATE INDEX idx_guides_slug ON guides(slug);
CREATE INDEX idx_guides_created_at ON guides(created_at DESC);
CREATE INDEX idx_authors_name ON authors(name);
```

## Políticas de Segurança (RLS)

```sql
-- Habilitar RLS
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE news ENABLE ROW LEVEL SECURITY;
ALTER TABLE guides ENABLE ROW LEVEL SECURITY;
ALTER TABLE authors ENABLE ROW LEVEL SECURITY;

-- Permitir leitura pública
CREATE POLICY "Public read access" ON reviews FOR SELECT USING (true);
CREATE POLICY "Public read access" ON news FOR SELECT USING (true);
CREATE POLICY "Public read access" ON guides FOR SELECT USING (true);
CREATE POLICY "Public read access" ON authors FOR SELECT USING (true);

-- Permitir escrita apenas para usuários autenticados
CREATE POLICY "Authenticated users can insert" ON reviews FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can update" ON reviews FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can delete" ON reviews FOR DELETE USING (auth.role() = 'authenticated');

-- Repetir para news, guides e authors
```

## Migrations

### Criar Tabelas

Execute o script completo em `docs/database-schema.sql` no SQL Editor do Supabase.

### Seed Data

Para popular o banco com dados de exemplo:

```sql
-- Inserir autor de exemplo
INSERT INTO authors (name, avatar, psn_id, bio) VALUES
('João Silva', '/avatars/joao.jpg', 'joaosilva_psn', 'Editor chefe do PlatinaNews');

-- Inserir gêneros
INSERT INTO genres (name) VALUES
('Ação'), ('Aventura'), ('RPG'), ('FPS'), ('Plataforma');

-- Inserir tags
INSERT INTO tags (name) VALUES
('PlayStation 5'), ('Exclusivo'), ('Multiplayer'), ('História'), ('Gráficos');
```

## Backup e Restore

### Backup Manual

```bash
# Via pg_dump
pg_dump -h db.xxx.supabase.co -U postgres -d postgres > backup.sql
```

### Restore

```bash
# Via psql
psql -h db.xxx.supabase.co -U postgres -d postgres < backup.sql
```

### Backup Automático

O Supabase faz backups automáticos diários. Acesse:
- Dashboard > Settings > Database > Backups

## Queries Úteis

### Buscar reviews com autor e gêneros

```sql
SELECT 
  r.*,
  a.name as author_name,
  array_agg(DISTINCT g.name) as genres
FROM reviews r
LEFT JOIN authors a ON r.author_id = a.id
LEFT JOIN review_genres rg ON r.id = rg.review_id
LEFT JOIN genres g ON rg.genre_id = g.id
GROUP BY r.id, a.name
ORDER BY r.created_at DESC;
```

### Contar posts por autor

```sql
SELECT 
  a.name,
  COUNT(DISTINCT r.id) as reviews_count,
  COUNT(DISTINCT n.id) as news_count,
  COUNT(DISTINCT g.id) as guides_count
FROM authors a
LEFT JOIN reviews r ON a.id = r.author_id
LEFT JOIN news n ON a.id = n.author_id
LEFT JOIN guides g ON a.id = g.author_id
GROUP BY a.id, a.name;
```

### Reviews por rating

```sql
SELECT 
  rating,
  COUNT(*) as count
FROM reviews
GROUP BY rating
ORDER BY 
  CASE rating
    WHEN 'platinum' THEN 1
    WHEN 'gold' THEN 2
    WHEN 'silver' THEN 3
    WHEN 'bronze' THEN 4
  END;
```

## Troubleshooting

### Erro: "relation does not exist"

Certifique-se de que todas as tabelas foram criadas executando o schema completo.

### Erro: "permission denied"

Verifique as políticas RLS e se o usuário tem as permissões corretas.

### Performance lenta

Adicione índices nas colunas mais consultadas (veja seção de Índices).

---

Para mais informações, consulte a [documentação do Supabase](https://supabase.com/docs).
