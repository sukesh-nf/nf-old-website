/*
  # Enhance investor_brief_requests for pipeline tracking

  1. Changes to `investor_brief_requests`
     - `invited_at` (timestamptz, nullable) — set when invitation is sent
     - `dismissed_at` (timestamptz, nullable) — set when admin dismisses/archives the request
     - `investor_id` (uuid, nullable, FK to investor_access) — links to the created investor record

  2. Notes
     - All new columns are nullable so existing rows are unaffected
     - dismissed rows are filtered out of the active queue but kept for audit history
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'investor_brief_requests' AND column_name = 'invited_at'
  ) THEN
    ALTER TABLE investor_brief_requests ADD COLUMN invited_at timestamptz;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'investor_brief_requests' AND column_name = 'dismissed_at'
  ) THEN
    ALTER TABLE investor_brief_requests ADD COLUMN dismissed_at timestamptz;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'investor_brief_requests' AND column_name = 'investor_id'
  ) THEN
    ALTER TABLE investor_brief_requests ADD COLUMN investor_id uuid REFERENCES investor_access(id) ON DELETE SET NULL;
  END IF;
END $$;
