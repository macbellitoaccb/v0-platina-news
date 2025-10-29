-- Criar tabela para mídia adicional de notícias (imagens e vídeos)
CREATE TABLE IF NOT EXISTS news_media (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  news_id UUID NOT NULL REFERENCES news(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('image', 'video')),
  url TEXT NOT NULL,
  caption TEXT,
  display_order INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índice para buscar mídia por notícia
CREATE INDEX IF NOT EXISTS idx_news_media_news_id ON news_media(news_id);
CREATE INDEX IF NOT EXISTS idx_news_media_display_order ON news_media(display_order);
