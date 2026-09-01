/*
  # Enhance data room activity tracking for analytics

  ## Summary
  Adds session-level tracking, document view duration, and device metadata
  to the data_room_activity table to power real analytics.

  ## Changes

  ### Modified Tables
  - `data_room_activity`
    - Add `session_id` (uuid) — groups all events in a single visit together
    - Add `duration_seconds` (integer) — time spent on a doc or in a session (populated on doc_exit / session_end)
    - Add `user_agent` (text) — browser/device info captured at session_start
    - Update event_type CHECK constraint to include new events: 'doc_exit', 'session_end'

  ## Notes
  - session_id is generated client-side and passed with every track() call
  - duration_seconds is set when doc_exit or session_end events fire
  - All new columns are nullable to preserve compatibility with existing rows
*/

-- Add new columns (safe, nullable)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'data_room_activity' AND column_name = 'session_id') THEN
    ALTER TABLE data_room_activity ADD COLUMN session_id uuid;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'data_room_activity' AND column_name = 'duration_seconds') THEN
    ALTER TABLE data_room_activity ADD COLUMN duration_seconds integer;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'data_room_activity' AND column_name = 'user_agent') THEN
    ALTER TABLE data_room_activity ADD COLUMN user_agent text DEFAULT '';
  END IF;
END $$;

-- Drop and recreate the event_type check constraint with expanded values
ALTER TABLE data_room_activity DROP CONSTRAINT IF EXISTS data_room_activity_event_type_check;

ALTER TABLE data_room_activity ADD CONSTRAINT data_room_activity_event_type_check
  CHECK (event_type IN (
    'session_start', 'session_end',
    'doc_viewed', 'doc_exit', 'doc_downloaded',
    'nda_signed',
    'schedule_call_clicked', 'contact_clicked',
    'nav_section_changed', 'folder_opened'
  ));

-- Index session_id for grouping queries
CREATE INDEX IF NOT EXISTS idx_activity_session_id ON data_room_activity(session_id);
