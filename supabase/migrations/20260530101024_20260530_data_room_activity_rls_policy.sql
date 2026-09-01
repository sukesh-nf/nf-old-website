/*
  # Add RLS policy for data_room_activity

  All reads and writes to this table go through the investor-access Edge Function
  using the service role key, which bypasses RLS entirely. No direct client access
  is needed or allowed. Adding a restrictive authenticated policy resolves the
  "RLS enabled but no policies exist" scanner warning without opening any access.
*/

CREATE POLICY "No direct client access to data_room_activity"
  ON data_room_activity FOR SELECT
  TO authenticated
  USING (false);
