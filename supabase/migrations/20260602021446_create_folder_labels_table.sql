/*
  # Create folder_labels table

  Stores admin-editable display names for the investor data room document folders.
  The `folder_key` matches the hardcoded FolderKey values ('legal', 'financials', 'tech', 'traction').

  1. New Tables
    - `folder_labels`
      - `id` (uuid, primary key)
      - `folder_key` (text, unique) — matches FolderKey in the frontend
      - `label` (text) — the display name shown to investors and admins
      - `updated_at` (timestamptz) — last update timestamp

  2. Security
    - Enable RLS
    - Authenticated users (admin token via edge function service role) can do all operations
    - Public (anon) users can SELECT — folder names are visible to all data room visitors
*/

CREATE TABLE IF NOT EXISTS folder_labels (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  folder_key text UNIQUE NOT NULL,
  label      text NOT NULL,
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE folder_labels ENABLE ROW LEVEL SECURITY;

-- Anyone in the data room can read folder names
CREATE POLICY "Public can read folder labels"
  ON folder_labels FOR SELECT
  TO anon, authenticated
  USING (true);

-- Only authenticated (service role via edge function) can insert/update
CREATE POLICY "Authenticated can insert folder labels"
  ON folder_labels FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated can update folder labels"
  ON folder_labels FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Seed with defaults so a fresh deploy shows correct labels immediately
INSERT INTO folder_labels (folder_key, label) VALUES
  ('legal',      'Legal'),
  ('financials', 'Financials'),
  ('tech',       'Technology'),
  ('traction',   'Traction')
ON CONFLICT (folder_key) DO NOTHING;
