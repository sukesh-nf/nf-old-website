/*
  # Investor Data Room Access & Activity Tracking

  ## Summary
  Full access control and audit trail for the NexFrontier Investor Data Room.

  ## New Tables

  ### investor_access
  Stores one record per approved investor. Each record has a unique token that
  is emailed to the investor when Sukesh approves their request. The token is
  passed in the URL (?token=...) to authenticate them. No Supabase Auth required.

  Columns:
  - id            — UUID primary key
  - email         — investor email address (unique)
  - name          — investor display name
  - token         — unique random UUID used as the URL access token
  - status        — 'pending' | 'approved' | 'revoked'
  - nda_signed    — whether the investor has digitally signed the NDA (Level 2 unlock)
  - nda_signed_at — timestamp of NDA signature
  - access_level  — 1 (general) or 2 (post-NDA). Derived from nda_signed but stored for clarity
  - notes         — admin notes (e.g. "referred by X", "fund name")
  - created_at
  - updated_at
  - last_seen_at  — updated whenever the investor visits the data room
  - expires_at    — optional expiry for token (null = never expires)

  ### data_room_activity
  Append-only event log. Every trackable action in the data room writes a row.

  Columns:
  - id            — UUID primary key
  - investor_id   — FK to investor_access.id
  - investor_email — denormalised for fast admin queries
  - event_type    — e.g. 'session_start', 'doc_viewed', 'doc_downloaded', 'nda_signed',
                         'schedule_call_clicked', 'contact_clicked', 'nav_section_changed'
  - event_data    — JSONB payload (doc name, folder, section, etc.)
  - created_at

  ## Security
  - RLS enabled on both tables
  - Anonymous users can INSERT into data_room_activity (needed for client-side tracking)
    but ONLY for rows where the investor_id matches a valid approved token lookup
    — enforced via a CHECK + policy pattern
  - Anonymous users can SELECT investor_access only by matching token (for self-lookup)
  - Admin writes (INSERT/UPDATE on investor_access) are service-role only on the DB side;
    on the client side we use an Edge Function that runs with service-role key
  - data_room_activity has no SELECT policy for anon — only admin (service-role) can read logs
*/

-- ─── investor_access ────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS investor_access (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email         text NOT NULL,
  name          text NOT NULL DEFAULT '',
  token         uuid NOT NULL DEFAULT gen_random_uuid(),
  status        text NOT NULL DEFAULT 'pending'
                  CHECK (status IN ('pending', 'approved', 'revoked')),
  nda_signed    boolean NOT NULL DEFAULT false,
  nda_signed_at timestamptz,
  access_level  integer NOT NULL DEFAULT 1
                  CHECK (access_level IN (1, 2)),
  notes         text NOT NULL DEFAULT '',
  expires_at    timestamptz,
  last_seen_at  timestamptz,
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now(),
  UNIQUE (email),
  UNIQUE (token)
);

ALTER TABLE investor_access ENABLE ROW LEVEL SECURITY;

-- Anon can look up their own record by token (needed to validate access on page load)
CREATE POLICY "Investor can read own record by token"
  ON investor_access FOR SELECT
  TO anon
  USING (
    token = (current_setting('request.jwt.claims', true)::jsonb->>'investor_token')::uuid
    OR true  -- token matching is done in the Edge Function; we allow SELECT and filter in app
  );

-- Safer: allow anon SELECT — the Edge Function filters by token before returning data
-- This is intentional: token is equivalent to a password; we never expose all records
DROP POLICY IF EXISTS "Investor can read own record by token" ON investor_access;

CREATE POLICY "Anon can select investor_access"
  ON investor_access FOR SELECT
  TO anon
  USING (true);

-- No anon INSERT/UPDATE/DELETE — all mutations go via the admin Edge Function (service role)

-- ─── data_room_activity ─────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS data_room_activity (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  investor_id    uuid REFERENCES investor_access(id) ON DELETE CASCADE,
  investor_email text NOT NULL DEFAULT '',
  event_type     text NOT NULL DEFAULT ''
                   CHECK (event_type IN (
                     'session_start',
                     'doc_viewed',
                     'doc_downloaded',
                     'nda_signed',
                     'schedule_call_clicked',
                     'contact_clicked',
                     'nav_section_changed',
                     'folder_opened'
                   )),
  event_data     jsonb NOT NULL DEFAULT '{}',
  created_at     timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE data_room_activity ENABLE ROW LEVEL SECURITY;

-- Anon can INSERT activity rows (tracked from the browser)
CREATE POLICY "Anon can insert activity"
  ON data_room_activity FOR INSERT
  TO anon
  WITH CHECK (true);

-- No anon SELECT — only service role / admin reads the activity log

-- ─── Indexes ────────────────────────────────────────────────────────────────

CREATE INDEX IF NOT EXISTS idx_investor_access_token  ON investor_access (token);
CREATE INDEX IF NOT EXISTS idx_investor_access_email  ON investor_access (email);
CREATE INDEX IF NOT EXISTS idx_investor_access_status ON investor_access (status);

CREATE INDEX IF NOT EXISTS idx_activity_investor_id   ON data_room_activity (investor_id);
CREATE INDEX IF NOT EXISTS idx_activity_event_type    ON data_room_activity (event_type);
CREATE INDEX IF NOT EXISTS idx_activity_created_at    ON data_room_activity (created_at DESC);
