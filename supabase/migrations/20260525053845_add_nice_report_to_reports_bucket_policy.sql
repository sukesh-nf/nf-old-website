/*
  # Allow NiCE Agentic AI CX Frontline report to be served from reports bucket

  The SELECT policy currently only permits reading one specific filename.
  This migration widens it to also allow the NiCE report file, so the
  download link in the article works without authentication.

  1. Changes
    - Drops the single-filename SELECT policy
    - Replaces it with a policy that allows both known report filenames
    - INSERT / UPDATE / DELETE policies are unchanged (remain public)
*/

DROP POLICY IF EXISTS "Public read specific reports file" ON storage.objects;

CREATE POLICY "Public read known report files"
  ON storage.objects FOR SELECT
  TO public
  USING (
    bucket_id = 'reports'
    AND name IN (
      'the-data-readiness-index-understanding-the-foundations-for-successful-ai.pdf',
      'the-agentic-ai-cx-frontline-report.pdf'
    )
  );
