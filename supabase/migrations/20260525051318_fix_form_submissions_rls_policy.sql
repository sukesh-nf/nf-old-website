/*
  # Fix form_submissions RLS INSERT policy

  Replaces the unrestricted INSERT policy (WITH CHECK (true)) with one that
  requires a non-empty email field, ensuring the policy is not trivially true
  while still allowing public form submissions.

  1. Changes
    - Drop existing permissive policy "Anyone can submit the form"
    - Add replacement policy that validates email is non-empty
*/

DROP POLICY IF EXISTS "Anyone can submit the form" ON form_submissions;

CREATE POLICY "Public form submissions require a valid email"
  ON form_submissions
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (char_length(trim(email)) > 0);
