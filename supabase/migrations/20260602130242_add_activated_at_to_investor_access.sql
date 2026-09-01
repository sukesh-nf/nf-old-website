/*
  # Add activated_at to investor_access

  ## Summary
  Adds an `activated_at` timestamp to `investor_access` to track the exact moment
  an investor first successfully enters the data room.

  ## Changes
  - `investor_access`: new column `activated_at` (timestamptz, nullable)
    - NULL  → token was sent but never used
    - Non-null → investor has entered the data room at least once

  ## Behavioural impact
  Once `activated_at` is set, the 48-hour `expires_at` window no longer blocks
  access. Only explicit revocation (status = 'revoked') can terminate an active
  investor's access. Tokens that expire before first use remain blocked.
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'investor_access' AND column_name = 'activated_at'
  ) THEN
    ALTER TABLE investor_access ADD COLUMN activated_at timestamptz DEFAULT NULL;
  END IF;
END $$;
