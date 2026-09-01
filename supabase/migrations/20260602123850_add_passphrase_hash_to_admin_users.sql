/*
  # Add passphrase authentication to admin_users

  ## Summary
  Adds a `passphrase_hash` column to the `admin_users` table so that admin
  logins require both a known email address AND a secret passphrase, replacing
  the insecure "click-to-enter" admin picker.

  ## Changes
  - `admin_users`: add `passphrase_hash` (text, nullable) — bcrypt hash of the
    admin's passphrase. NULL means the account has no passphrase set yet (login
    blocked until set).

  ## Security Notes
  - The column is not exposed through any SELECT policy visible to the client.
  - The edge function (service role) reads the hash server-side and never sends
    it to the browser.
  - Existing admin accounts will have NULL hashes until updated via the admin
    management UI or the set-passphrase endpoint.
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'admin_users' AND column_name = 'passphrase_hash'
  ) THEN
    ALTER TABLE admin_users ADD COLUMN passphrase_hash text;
  END IF;
END $$;
