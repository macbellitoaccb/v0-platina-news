-- Add youtube_url and subtitle fields to platinador_tips table
ALTER TABLE platinador_tips
ADD COLUMN IF NOT EXISTS youtube_url TEXT,
ADD COLUMN IF NOT EXISTS subtitle TEXT;
