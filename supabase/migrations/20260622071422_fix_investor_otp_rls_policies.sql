-- Drop the always-true write policies; the edge function uses service_role which bypasses RLS
DROP POLICY IF EXISTS "insert_investor_otp" ON public.investor_otp;
DROP POLICY IF EXISTS "update_investor_otp" ON public.investor_otp;
DROP POLICY IF EXISTS "delete_investor_otp" ON public.investor_otp;

-- Anon may not INSERT, UPDATE, or DELETE rows directly.
-- All writes are performed by the edge function via the service_role key, which bypasses RLS.
-- Explicit deny policies for anon (WITH CHECK (false) / USING (false)):
CREATE POLICY "insert_investor_otp" ON public.investor_otp FOR INSERT
  TO anon WITH CHECK (false);

CREATE POLICY "update_investor_otp" ON public.investor_otp FOR UPDATE
  TO anon USING (false) WITH CHECK (false);

CREATE POLICY "delete_investor_otp" ON public.investor_otp FOR DELETE
  TO anon USING (false);
