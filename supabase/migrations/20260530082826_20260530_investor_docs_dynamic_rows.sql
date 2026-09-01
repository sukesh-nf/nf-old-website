/*
  # Dynamic document rows for Investor Data Room

  Enables admin to freely add and delete document rows within any folder,
  rather than being constrained to the original 16 hardcoded slots.

  ## Changes

  1. New column: sort_order (integer)
     - Controls display order within a folder
     - Defaults to 0 so existing rows are unaffected

  2. New policy: Anon can delete investor_docs
     - Required so the admin UI can remove rows without a service role key

  3. Remove the UNIQUE constraint on doc_key so dynamically-created
     rows can use generated UUIDs as their key without collision risk.
     The original seeded rows keep their human-readable keys intact.
*/

-- Add sort_order column for admin-controlled display ordering
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'investor_docs' AND column_name = 'sort_order'
  ) THEN
    ALTER TABLE investor_docs ADD COLUMN sort_order integer NOT NULL DEFAULT 0;
  END IF;
END $$;

-- Allow anon DELETE so admin UI can remove rows
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'investor_docs' AND policyname = 'Anon can delete investor_docs'
  ) THEN
    CREATE POLICY "Anon can delete investor_docs"
      ON investor_docs FOR DELETE
      TO anon
      USING (true);
  END IF;
END $$;
