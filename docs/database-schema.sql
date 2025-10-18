-- PlatinaNews Database Schema
-- PostgreSQL via Supabase

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Table: authors
CREATE TABLE IF NOT EXISTS authors (
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

-- Table: genres
CREATE TABLE IF NOT EXISTS genres (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR UNIQUE NOT NULL
);

-- Table: tags
CREATE TABLE IF NOT EXISTS tags (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR UNIQUE NOT NULL
);

-- Table: reviews
CREATE TABLE IF NOT EXISTS reviews (
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

-- Table: news
CREATE TABLE IF NOT EXISTS news (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR NOT NULL,
  slug VARCHAR UNIQUE NOT NULL,
  content TEXT NOT NULL,
  image VARCHAR,
  author_id UUID REFERENCES authors(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table: guides
CREATE TABLE IF NOT EXISTS guides (
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

-- Table: review_genres (many-to-many)
CREATE TABLE IF NOT EXISTS review_genres (
  review_id UUID REFERENCES reviews(id) ON DELETE CASCADE,
  genre_id UUID REFERENCES genres(id) ON DELETE CASCADE,
  PRIMARY KEY (review_id, genre_id)
);

-- Table: review_tags (many-to-many)
CREATE TABLE IF NOT EXISTS review_tags (
  review_id UUID REFERENCES reviews(id) ON DELETE CASCADE,
  tag_id UUID REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (review_id, tag_id)
);

-- Table: guide_tags (many-to-many)
CREATE TABLE IF NOT EXISTS guide_tags (
  guide_id UUID REFERENCES guides(id) ON DELETE CASCADE,
  tag_id UUID REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (guide_id, tag_id)
);

-- Table: additional_images
CREATE TABLE IF NOT EXISTS additional_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  review_id UUID REFERENCES reviews(id) ON DELETE CASCADE,
  url VARCHAR NOT NULL,
  caption TEXT,
  display_order INTEGER DEFAULT 0
);

-- Table: guide_steps
CREATE TABLE IF NOT EXISTS guide_steps (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  guide_id UUID REFERENCES guides(id) ON DELETE CASCADE,
  title VARCHAR NOT NULL,
  description TEXT,
  image VARCHAR,
  video VARCHAR,
  display_order INTEGER DEFAULT 0
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_reviews_slug ON reviews(slug);
CREATE INDEX IF NOT EXISTS idx_reviews_rating ON reviews(rating);
CREATE INDEX IF NOT EXISTS idx_reviews_created_at ON reviews(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_news_slug ON news(slug);
CREATE INDEX IF NOT EXISTS idx_news_created_at ON news(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_guides_slug ON guides(slug);
CREATE INDEX IF NOT EXISTS idx_guides_created_at ON guides(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_authors_name ON authors(name);

-- Enable Row Level Security
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE news ENABLE ROW LEVEL SECURITY;
ALTER TABLE guides ENABLE ROW LEVEL SECURITY;
ALTER TABLE authors ENABLE ROW LEVEL SECURITY;

-- Public read access policies
CREATE POLICY "Public read access" ON reviews FOR SELECT USING (true);
CREATE POLICY "Public read access" ON news FOR SELECT USING (true);
CREATE POLICY "Public read access" ON guides FOR SELECT USING (true);
CREATE POLICY "Public read access" ON authors FOR SELECT USING (true);

-- Authenticated users can write
CREATE POLICY "Authenticated users can insert" ON reviews FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can update" ON reviews FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can delete" ON reviews FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can insert" ON news FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can update" ON news FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can delete" ON news FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can insert" ON guides FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can update" ON guides FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can delete" ON guides FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can insert" ON authors FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can update" ON authors FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can delete" ON authors FOR DELETE USING (auth.role() = 'authenticated');

-- Seed data (optional)
INSERT INTO genres (name) VALUES
  ('Ação'),
  ('Aventura'),
  ('RPG'),
  ('FPS'),
  ('Plataforma'),
  ('Corrida'),
  ('Esportes'),
  ('Estratégia'),
  ('Puzzle'),
  ('Terror')
ON CONFLICT (name) DO NOTHING;

INSERT INTO tags (name) VALUES
  ('PlayStation 5'),
  ('PlayStation 4'),
  ('Xbox Series X|S'),
  ('Xbox One'),
  ('Nintendo Switch'),
  ('PC'),
  ('Exclusivo'),
  ('Multiplayer'),
  ('Single Player'),
  ('História'),
  ('Gráficos'),
  ('Gameplay'),
  ('Troféus'),
  ('Platina Fácil'),
  ('Platina Difícil')
ON CONFLICT (name) DO NOTHING;
