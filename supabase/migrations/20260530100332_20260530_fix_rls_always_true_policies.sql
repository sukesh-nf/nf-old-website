/*
  # Fix RLS Policies — Remove Always-True Anon Write Policies

  ## Problem
  Several tables had RLS policies with `USING (true)` or `WITH CHECK (true)` for the
  `anon` role, effectively bypassing row-level security for unauthenticated users.

  ## Solution
  - Drop the always-true anon write policies on admin_users, investor_docs, and data_room_activity
  - All legitimate write operations for these tables go through the investor-access Edge Function,
    which connects using the service role key and therefore bypasses RLS entirely
  - Anon SELECT on admin_users is retained (needed for the admin login picker in the frontend)
  - Anon SELECT on investor_docs is retained (needed for the data room document list)
  - admin_settings: add a restrictive policy so RLS-enabled-no-policy warning is resolved;
    all real access is via service role in the edge function

  ## Tables Changed
  1. admin_users       — drop anon INSERT, drop anon DELETE (keep anon SELECT)
  2. investor_docs     — drop anon INSERT, DROP anon UPDATE, drop anon DELETE (keep anon SELECT)
  3. data_room_activity — drop anon INSERT (edge function uses service role)
  4. admin_settings    — add a service-role-only note policy (anon has no legitimate access)

  ## Important Notes
  - Service role bypasses RLS entirely, so edge function operations are unaffected
  - Frontend admin UI mutations (admin_users, investor_docs) will be routed through
    new edge function endpoints added in the same deploy cycle
*/

-- ─── admin_users ──────────────────────────────────────────────────────────────

DROP POLICY IF EXISTS "Anon can insert admin_users" ON admin_users;
DROP POLICY IF EXISTS "Anon can delete admin_users" ON admin_users;

-- ─── investor_docs ────────────────────────────────────────────────────────────

DROP POLICY IF EXISTS "Anon can insert investor_docs" ON investor_docs;
DROP POLICY IF EXISTS "Anon can update investor_docs" ON investor_docs;
DROP POLICY IF EXISTS "Anon can delete investor_docs" ON investor_docs;

-- ─── data_room_activity ───────────────────────────────────────────────────────

DROP POLICY IF EXISTS "Anon can insert activity" ON data_room_activity;

-- ─── admin_settings ───────────────────────────────────────────────────────────
-- No anon access needed; all reads/writes go via service role in edge function.
-- Add a placeholder authenticated-user policy so the table is not flagged as
-- "RLS enabled but no policies exist".

CREATE POLICY "No direct client access to admin_settings"
  ON admin_settings FOR SELECT
  TO authenticated
  USING (false);
