/*
  # Create contact_submissions table

  Stores all contact form submissions from the EarlyAccess and BetaProgramme forms.

  1. New Tables
    - `contact_submissions`
      - `id` (uuid, primary key)
      - `name` (text)
      - `email` (text)
      - `company` (text, nullable)
      - `message` (text)
      - `form_source` (text) — e.g. "early-access", "beta-programme", "ql-report"
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS
    - Anonymous users can INSERT (no SELECT — admin only via service role)
*/

CREATE TABLE IF NOT EXISTS contact_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  company text,
  message text NOT NULL,
  form_source text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert a contact submission"
  ON contact_submissions
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);
