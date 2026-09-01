/*
  # Analytics Enhancements — Login Tracking & Alert Settings

  ## Summary
  Adds login count tracking and first-seen timestamp to investor_access,
  plus an admin_settings table for configuring alerts and permissions.

  ## Changes

  ### Modified Tables
  - `investor_access`
    - Add `login_count` (integer, default 0) — total number of times this investor has logged in
    - Add `first_seen_at` (timestamptz) — timestamp of their very first login

  ### New Tables
  - `admin_settings`
    - `key` (text, primary key) — setting identifier
    - `value` (jsonb) — setting value
    - `updated_at` (timestamptz)
    - Pre-populated with default settings for alert emails and download permissions

  ## Security
  - RLS enabled on admin_settings (no anon access; service-role only via edge function)
*/

-- Add login tracking columns to investor_access
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'investor_access' AND column_name = 'login_count'
  ) THEN
    ALTER TABLE investor_access ADD COLUMN login_count integer NOT NULL DEFAULT 0;
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'investor_access' AND column_name = 'first_seen_at'
  ) THEN
    ALTER TABLE investor_access ADD COLUMN first_seen_at timestamptz;
  END IF;
END $$;

-- Admin settings table
CREATE TABLE IF NOT EXISTS admin_settings (
  key        text PRIMARY KEY,
  value      jsonb NOT NULL DEFAULT '{}',
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE admin_settings ENABLE ROW LEVEL SECURITY;

-- No anon access — all reads/writes go through service-role edge function
-- Insert default settings
INSERT INTO admin_settings (key, value) VALUES
  ('first_login_alert', '{"enabled": false, "email": "sukesh@nexfrontierlogic.nz"}'::jsonb),
  ('download_permissions', '{"restricted_docs": []}'::jsonb),
  ('granular_tracking', '{"enabled": true}'::jsonb)
ON CONFLICT (key) DO NOTHING;
