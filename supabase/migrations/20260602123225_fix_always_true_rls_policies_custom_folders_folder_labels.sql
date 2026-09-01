/*
  # Fix always-true RLS policies on custom_folders and folder_labels

  ## Problem
  Five policies had USING/WITH CHECK clauses set to `true`, meaning any
  authenticated user could insert, update, or delete any row. This bypasses
  the purpose of RLS.

  ## Fix
  Replace those policies with ones that restrict writes to users whose
  auth.uid() exists in the admin_users table. The edge function uses the
  service role key (which bypasses RLS), so legitimate admin operations
  are unaffected.

  ## Changes
  - custom_folders: replace DELETE, INSERT, UPDATE policies
  - folder_labels:  replace INSERT, UPDATE policies

  Public SELECT policies are unchanged (reading folder structure is fine for all).
*/

-- ── custom_folders ────────────────────────────────────────────────────────────

DROP POLICY IF EXISTS "Authenticated can delete custom folders" ON custom_folders;
DROP POLICY IF EXISTS "Authenticated can insert custom folders" ON custom_folders;
DROP POLICY IF EXISTS "Authenticated can update custom folders" ON custom_folders;

CREATE POLICY "Admins can insert custom folders"
  ON custom_folders FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (SELECT 1 FROM admin_users WHERE admin_users.id = auth.uid())
  );

CREATE POLICY "Admins can update custom folders"
  ON custom_folders FOR UPDATE
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM admin_users WHERE admin_users.id = auth.uid())
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM admin_users WHERE admin_users.id = auth.uid())
  );

CREATE POLICY "Admins can delete custom folders"
  ON custom_folders FOR DELETE
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM admin_users WHERE admin_users.id = auth.uid())
  );

-- ── folder_labels ─────────────────────────────────────────────────────────────

DROP POLICY IF EXISTS "Authenticated can insert folder labels" ON folder_labels;
DROP POLICY IF EXISTS "Authenticated can update folder labels" ON folder_labels;

CREATE POLICY "Admins can insert folder labels"
  ON folder_labels FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (SELECT 1 FROM admin_users WHERE admin_users.id = auth.uid())
  );

CREATE POLICY "Admins can update folder labels"
  ON folder_labels FOR UPDATE
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM admin_users WHERE admin_users.id = auth.uid())
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM admin_users WHERE admin_users.id = auth.uid())
  );
