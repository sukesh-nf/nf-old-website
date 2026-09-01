
/*
  # Allow uploads to exemplar-videos bucket

  1. Changes
    - Add INSERT policy on storage.objects for the exemplar-videos bucket
    - Allows any request (public/anon) to upload files into the bucket
      so the admin upload page can function without requiring auth

  2. Notes
    - The upload page is security-through-obscurity (unlisted URL)
    - If stricter access is needed later, restrict TO authenticated
*/

CREATE POLICY "Allow uploads to exemplar videos"
  ON storage.objects FOR INSERT
  TO public
  WITH CHECK (bucket_id = 'exemplar-videos');
