/*
  # Create reports storage bucket

  Creates a public storage bucket for hosting downloadable PDF reports.
  Public read access is granted so download links work without authentication.
*/

INSERT INTO storage.buckets (id, name, public)
VALUES ('reports', 'reports', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public read access for reports"
  ON storage.objects FOR SELECT
  TO public
  USING (bucket_id = 'reports');
