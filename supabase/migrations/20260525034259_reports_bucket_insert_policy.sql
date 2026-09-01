/*
  # Allow public insert into reports bucket

  Permits unauthenticated uploads to the reports bucket so the admin
  upload page (which uses the anon key) can write files.
  Read access was already granted in the previous migration.
*/

CREATE POLICY "Allow public insert into reports"
  ON storage.objects FOR INSERT
  TO public
  WITH CHECK (bucket_id = 'reports');
