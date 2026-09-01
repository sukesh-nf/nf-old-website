/*
  # Fix RLS policies — remove always-true clauses

  ## Problems fixed

  1. `job_applications` INSERT policy had `WITH CHECK (true)` — any user could
     insert any row with any job_id, including non-existent or inactive jobs.
     Fixed: check that the referenced job_id exists and is currently active.

  2. `job_listings` INSERT / UPDATE / DELETE policies had `true` clauses —
     any authenticated user could mutate listings.
     Fixed: restrict to users whose JWT app_metadata contains `role = 'admin'`.
     This value is set server-side only and cannot be spoofed by the client.

  ## Notes
  - The SELECT policy on job_listings is unchanged (already correctly scoped).
  - The job_applications SELECT policy is unchanged.
  - Admin role is granted by setting `app_metadata.role = 'admin'` on the user
    via the Supabase dashboard or service-role API — it cannot be self-assigned.
*/

-- ── job_applications ────────────────────────────────────────────────────────

DROP POLICY IF EXISTS "Anyone can submit a job application" ON job_applications;

CREATE POLICY "Anyone can submit a job application"
  ON job_applications
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM job_listings
      WHERE job_listings.id = job_id
        AND (job_listings.no_expiry = true
             OR job_listings.expires_at IS NULL
             OR job_listings.expires_at > now())
    )
  );

-- ── job_listings — admin-only write access ──────────────────────────────────

DROP POLICY IF EXISTS "Authenticated users can insert job listings" ON job_listings;
DROP POLICY IF EXISTS "Authenticated users can update job listings" ON job_listings;
DROP POLICY IF EXISTS "Authenticated users can delete job listings" ON job_listings;

CREATE POLICY "Admins can insert job listings"
  ON job_listings
  FOR INSERT
  TO authenticated
  WITH CHECK (
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  );

CREATE POLICY "Admins can update job listings"
  ON job_listings
  FOR UPDATE
  TO authenticated
  USING (
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  )
  WITH CHECK (
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  );

CREATE POLICY "Admins can delete job listings"
  ON job_listings
  FOR DELETE
  TO authenticated
  USING (
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  );
