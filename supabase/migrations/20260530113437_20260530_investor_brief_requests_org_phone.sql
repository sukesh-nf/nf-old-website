/*
  # Add organisation and phone to investor_brief_requests

  1. Changes
     - `organisation` (text, nullable) — company/fund name
     - `phone` (text, nullable) — contact phone number
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'investor_brief_requests' AND column_name = 'organisation'
  ) THEN
    ALTER TABLE investor_brief_requests ADD COLUMN organisation text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'investor_brief_requests' AND column_name = 'phone'
  ) THEN
    ALTER TABLE investor_brief_requests ADD COLUMN phone text;
  END IF;
END $$;
