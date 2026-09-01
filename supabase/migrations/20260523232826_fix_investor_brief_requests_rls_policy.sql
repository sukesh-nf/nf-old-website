/*
  # Fix RLS policy for investor_brief_requests

  ## Changes
  - Drops the overly permissive INSERT policy that used WITH CHECK (true)
  - Replaces it with a restrictive policy that validates required fields are non-empty
    before allowing an anonymous insert

  ## Security
  - Anon users can only insert rows where both name and email are non-empty strings
  - Prevents empty/blank submissions from being stored
  - No SELECT policy remains — data is only readable by service role
*/

DROP POLICY IF EXISTS "Anyone can submit investor brief request" ON investor_brief_requests;

CREATE POLICY "Anon can submit with valid name and email"
  ON investor_brief_requests
  FOR INSERT
  TO anon
  WITH CHECK (
    name <> '' AND email <> ''
  );
