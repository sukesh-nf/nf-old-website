/*
  # Add Gartner report to reports bucket policies

  1. Changes
    - Drops and recreates the INSERT policy on storage.objects for the reports
      bucket to ensure anon users can upload (fixes "row violates RLS" error)
    - Drops and recreates the SELECT policy to include the new Gartner filename
    - UPDATE and DELETE policies are unchanged
*/

DROP POLICY IF EXISTS "Allow public insert into reports" ON storage.objects;

CREATE POLICY "Allow public insert into reports"
  ON storage.objects FOR INSERT
  TO public
  WITH CHECK (bucket_id = 'reports');

DROP POLICY IF EXISTS "Public read known report files" ON storage.objects;

CREATE POLICY "Public read known report files"
  ON storage.objects FOR SELECT
  TO public
  USING (
    bucket_id = 'reports'
    AND name IN (
      'the-data-readiness-index-understanding-the-foundations-for-successful-ai.pdf',
      'the-agentic-ai-cx-frontline-report.pdf',
      'gartner-business-quarterly-q2-2026-monetising-ai-autonomous-business.pdf'
    )
  );
