-- Adicionando campo youtube_url para reviews e news

-- Adicionar campo youtube_url na tabela reviews
ALTER TABLE reviews
ADD COLUMN IF NOT EXISTS youtube_url TEXT;

-- Adicionar campo youtube_url na tabela news
ALTER TABLE news
ADD COLUMN IF NOT EXISTS youtube_url TEXT;

-- Comentários
COMMENT ON COLUMN reviews.youtube_url IS 'URL do vídeo do YouTube relacionado ao review';
COMMENT ON COLUMN news.youtube_url IS 'URL do vídeo do YouTube relacionado à notícia';
