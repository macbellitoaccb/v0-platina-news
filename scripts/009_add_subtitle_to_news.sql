-- Adicionar coluna subtitle na tabela news
ALTER TABLE news ADD COLUMN subtitle TEXT;

-- Criar índice para melhor performance
CREATE INDEX idx_news_subtitle ON news(subtitle);
