/*
  # Create form_submissions table

  Stores beta application and QL report email requests from the ApplicationForm.

  1. New Tables
    - `form_submissions`
      - `id` (uuid, primary key)
      - `action` (text) — 'beta' or 'email'
      - `company_name` (text)
      - `industry` (text)
      - `name` (text)
      - `role` (text)
      - `email` (text)
      - `phone` (text)
      - `revenue` (text)
      - `created_at` (timestamptz)

  2. Security
    - RLS enabled
    - Anonymous users can INSERT (public form)
    - No SELECT policy for public (admin only via service role)
*/

CREATE TABLE IF NOT EXISTS form_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  action text NOT NULL DEFAULT '',
  company_name text NOT NULL DEFAULT '',
  industry text NOT NULL DEFAULT '',
  name text NOT NULL DEFAULT '',
  role text NOT NULL DEFAULT '',
  email text NOT NULL DEFAULT '',
  phone text NOT NULL DEFAULT '',
  revenue text NOT NULL DEFAULT '',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE form_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit the form"
  ON form_submissions
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);
