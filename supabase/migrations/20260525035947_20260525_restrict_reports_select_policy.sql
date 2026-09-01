/*
  # Restrict reports bucket SELECT policy to prevent directory listing

  Replaces the broad public SELECT policy with one that only allows
  reading a specific known file, preventing clients from listing all
  objects in the bucket.
*/

DROP POLICY IF EXISTS "Public read access for reports" ON storage.objects;

CREATE POLICY "Public read specific reports file"
  ON storage.objects FOR SELECT
  TO public
  USING (
    bucket_id = 'reports'
    AND name = 'the-data-readiness-index-understanding-the-foundations-for-successful-ai.pdf'
  );
