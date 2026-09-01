/*
  # Create custom_folders table

  Allows admins to create arbitrary folders in the investor data room beyond
  the four hardcoded ones (legal, financials, tech, traction).

  1. New Tables
    - `custom_folders`
      - `id` (uuid, primary key)
      - `folder_key` (text, unique) — slug used as the folder identifier
      - `label` (text) — display name
      - `color_class` (text) — Tailwind text-color class for the folder icon
      - `sort_order` (int) — display order among custom folders
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS
    - Anon + authenticated users can SELECT (folder names visible to data room visitors)
    - Only authenticated (service role via edge function) can INSERT / UPDATE / DELETE
*/

CREATE TABLE IF NOT EXISTS custom_folders (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  folder_key  text UNIQUE NOT NULL,
  label       text NOT NULL,
  color_class text NOT NULL DEFAULT 'text-violet-400',
  sort_order  int  NOT NULL DEFAULT 0,
  created_at  timestamptz DEFAULT now(),
  updated_at  timestamptz DEFAULT now()
);

ALTER TABLE custom_folders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read custom folders"
  ON custom_folders FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Authenticated can insert custom folders"
  ON custom_folders FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated can update custom folders"
  ON custom_folders FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated can delete custom folders"
  ON custom_folders FOR DELETE
  TO authenticated
  USING (true);
