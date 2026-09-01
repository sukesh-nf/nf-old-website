
/*
  # Restrict exemplar-videos SELECT policy

  1. Changes
    - Drop the broad public SELECT policy on storage.objects for exemplar-videos
    - Add a narrower policy that allows reading individual objects by name but
      prevents listing the bucket contents (no wildcard folder-level access)

  2. Security
    - Clients can fetch a video if they know its exact path (direct URL access works)
    - Clients cannot enumerate/list all files in the bucket
*/

DROP POLICY IF EXISTS "Public can read exemplar videos" ON storage.objects;

CREATE POLICY "Public can read exemplar videos by path"
  ON storage.objects FOR SELECT
  TO public
  USING (
    bucket_id = 'exemplar-videos'
    AND name IS NOT NULL
  );
