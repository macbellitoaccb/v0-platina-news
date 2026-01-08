-- Criar tabela para mídia adicional de artigos (imagens e vídeos)
CREATE TABLE IF NOT EXISTS article_media (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  article_id UUID NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('image', 'video')),
  url TEXT NOT NULL,
  caption TEXT,
  display_order INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar tabela para mídia adicional de dicas do platinador (imagens e vídeos)
CREATE TABLE IF NOT EXISTS platinador_media (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  platinador_tip_id UUID NOT NULL REFERENCES platinador_tips(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('image', 'video')),
  url TEXT NOT NULL,
  caption TEXT,
  display_order INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para buscar mídia por artigo
CREATE INDEX IF NOT EXISTS idx_article_media_article_id ON article_media(article_id);
CREATE INDEX IF NOT EXISTS idx_article_media_display_order ON article_media(display_order);

-- Índices para buscar mídia por dica do platinador
CREATE INDEX IF NOT EXISTS idx_platinador_media_tip_id ON platinador_media(platinador_tip_id);
CREATE INDEX IF NOT EXISTS idx_platinador_media_display_order ON platinador_media(display_order);
