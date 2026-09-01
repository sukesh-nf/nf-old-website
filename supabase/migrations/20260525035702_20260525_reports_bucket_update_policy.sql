/*
  # Add update and delete policies for reports bucket

  The upsert operation requires an UPDATE policy in addition to INSERT.
  Without it, overwriting an existing file fails with an RLS violation.
*/

CREATE POLICY "Allow public update in reports"
  ON storage.objects FOR UPDATE
  TO public
  USING (bucket_id = 'reports')
  WITH CHECK (bucket_id = 'reports');

CREATE POLICY "Allow public delete in reports"
  ON storage.objects FOR DELETE
  TO public
  USING (bucket_id = 'reports');
