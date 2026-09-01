DROP POLICY IF EXISTS "Anyone can insert a contact submission" ON contact_submissions;

CREATE POLICY "Anyone can insert a contact submission"
  ON contact_submissions
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    form_source IN ('early-access', 'beta-programme', 'ql-report', 'contact')
  );
