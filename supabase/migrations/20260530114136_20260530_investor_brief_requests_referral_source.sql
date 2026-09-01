/*
  # Add referral source to investor_brief_requests

  1. Changes
     - `referral_source` (text, nullable) — how the contact heard about NexFrontier
       Values: 'Word of Mouth', 'Email from Us', 'Social Media', 'News/Press/Interview', 'Events'
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'investor_brief_requests' AND column_name = 'referral_source'
  ) THEN
    ALTER TABLE investor_brief_requests ADD COLUMN referral_source text;
  END IF;
END $$;
