/*
  # Add admin RLS policies for job_listings

  The table already exists with a public SELECT policy.
  This migration adds INSERT, UPDATE, and DELETE policies for authenticated users
  so the AdminUpload panel can manage job listings.
*/

CREATE POLICY "Authenticated users can insert job listings"
  ON job_listings
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update job listings"
  ON job_listings
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete job listings"
  ON job_listings
  FOR DELETE
  TO authenticated
  USING (true);
