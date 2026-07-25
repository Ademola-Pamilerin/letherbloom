-- Add registration details & waiver signature columns to access_codes table in Supabase
ALTER TABLE access_codes ADD COLUMN IF NOT EXISTS full_name text;
ALTER TABLE access_codes ADD COLUMN IF NOT EXISTS phone text;
ALTER TABLE access_codes ADD COLUMN IF NOT EXISTS age text;
ALTER TABLE access_codes ADD COLUMN IF NOT EXISTS address text;
ALTER TABLE access_codes ADD COLUMN IF NOT EXISTS signature text;
