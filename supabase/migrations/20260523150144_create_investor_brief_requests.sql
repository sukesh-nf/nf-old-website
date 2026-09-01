/*
  # Create investor_brief_requests table

  1. New Tables
    - `investor_brief_requests`
      - `id` (uuid, primary key)
      - `name` (text, required)
      - `email` (text, required)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS
    - Allow anonymous insert (public form submission)
    - No select policy (data only readable by service role)
*/

CREATE TABLE IF NOT EXISTS investor_brief_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL DEFAULT '',
  email text NOT NULL DEFAULT '',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE investor_brief_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit investor brief request"
  ON investor_brief_requests
  FOR INSERT
  TO anon
  WITH CHECK (true);
