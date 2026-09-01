/*
  # Admin Users Table

  Stores the list of admin identities that can access the investor data room
  in admin mode (bypassing token validation). Previously hardcoded in the
  frontend ADMIN_USERS constant; now fully managed via the data room UI.

  ## New Table: admin_users

  Columns:
  - id          — UUID primary key
  - name        — display name shown on the admin login picker
  - email       — admin email address (used as identity label)
  - created_at  — when the admin was added

  ## Security
  - RLS enabled
  - Anon SELECT: needed so the access gate can render the admin picker list
  - Anon INSERT: needed so the admin UI can add new admins
  - Anon DELETE: needed so the admin UI can remove admins
  - No UPDATE policy (name/email edits require delete + re-add to keep it simple)

  ## Seed
  - Sukesh is seeded as the initial admin so the existing login works immediately
*/

CREATE TABLE IF NOT EXISTS admin_users (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name       text NOT NULL DEFAULT '',
  email      text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anon can select admin_users"
  ON admin_users FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Anon can insert admin_users"
  ON admin_users FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Anon can delete admin_users"
  ON admin_users FOR DELETE
  TO anon
  USING (true);

-- Seed the existing hardcoded admin so nothing breaks
INSERT INTO admin_users (id, name, email)
VALUES ('00000000-0000-0000-0000-000000000001', 'Sukesh', 'sukesh@nexfrontierlogic.nz')
ON CONFLICT (id) DO NOTHING;
