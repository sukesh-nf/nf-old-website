CREATE TABLE investor_otp (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  investor_id UUID NOT NULL REFERENCES investor_access(id) ON DELETE CASCADE,
  otp_code TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at TIMESTAMPTZ NOT NULL DEFAULT now() + INTERVAL '5 minutes',
  used BOOLEAN NOT NULL DEFAULT false
);

CREATE INDEX idx_investor_otp_investor_id ON investor_otp(investor_id);

ALTER TABLE investor_otp ENABLE ROW LEVEL SECURITY;

CREATE POLICY "insert_investor_otp" ON investor_otp FOR INSERT
  TO anon WITH CHECK (true);

CREATE POLICY "select_investor_otp" ON investor_otp FOR SELECT
  TO anon USING (true);

CREATE POLICY "update_investor_otp" ON investor_otp FOR UPDATE
  TO anon USING (true) WITH CHECK (true);

CREATE POLICY "delete_investor_otp" ON investor_otp FOR DELETE
  TO anon USING (true);