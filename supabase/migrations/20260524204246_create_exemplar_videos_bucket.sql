
/*
  # Create exemplar-videos storage bucket

  1. New Bucket
    - `exemplar-videos`: public bucket for storing short MP4 demo/exemplar videos
      displayed on the website. Max file size 100MB, restricted to video MIME types.

  2. Security
    - Public read access so videos can be streamed directly in <video> tags
    - No anonymous uploads — only service role can insert/delete (managed via dashboard)
*/

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'exemplar-videos',
  'exemplar-videos',
  true,
  104857600,
  ARRAY['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime']
)
ON CONFLICT (id) DO NOTHING;

-- Allow anyone to read (stream) objects in this bucket
CREATE POLICY "Public can read exemplar videos"
  ON storage.objects FOR SELECT
  TO public
  USING (bucket_id = 'exemplar-videos');
