-- Add pros and cons columns to reviews table
ALTER TABLE reviews
ADD COLUMN IF NOT EXISTS pros TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS cons TEXT[] DEFAULT '{}';

-- Add comment to explain the columns
COMMENT ON COLUMN reviews.pros IS 'Array of positive points about the game';
COMMENT ON COLUMN reviews.cons IS 'Array of negative points about the game';
