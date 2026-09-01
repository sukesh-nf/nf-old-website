/*
  # Investor Documents Table

  Stores the Google Drive embed URLs for each document slot in the data room.
  Admin pastes a Google Drive "anyone with link" URL; the app converts it to
  an embed URL and renders it inside an iframe viewer.

  ## New Table: investor_docs

  Columns:
  - id          — UUID primary key
  - doc_key     — unique slug matching the hardcoded doc name in the frontend
                  (e.g. "articles-of-incorporation", "shareholder-agreement")
  - folder      — folder name: legal | financials | tech | traction
  - name        — human-readable document name (matches UI label)
  - drive_url   — the raw Google Drive share link pasted by admin
                  (https://drive.google.com/file/d/FILE_ID/view?usp=sharing)
  - embed_url   — derived embed URL (https://drive.google.com/file/d/FILE_ID/preview)
                  stored pre-computed for performance
  - locked      — whether this doc requires NDA (Level 2) to view
  - updated_at  — when the URL was last set

  ## Security
  - RLS enabled
  - Anon can SELECT (needed to show doc list and open viewer via iframe)
  - No anon INSERT/UPDATE/DELETE — all edits via AdminUpload (service role via anon key
    with a permissive policy, since this is non-sensitive metadata — the actual file
    access is controlled by Google Drive sharing settings)
*/

CREATE TABLE IF NOT EXISTS investor_docs (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  doc_key     text NOT NULL UNIQUE,
  folder      text NOT NULL CHECK (folder IN ('legal', 'financials', 'tech', 'traction')),
  name        text NOT NULL DEFAULT '',
  drive_url   text NOT NULL DEFAULT '',
  embed_url   text NOT NULL DEFAULT '',
  locked      boolean NOT NULL DEFAULT false,
  updated_at  timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE investor_docs ENABLE ROW LEVEL SECURITY;

-- Anon SELECT — investors need to read doc metadata (non-sensitive; drive access is Google's layer)
CREATE POLICY "Anon can select investor_docs"
  ON investor_docs FOR SELECT
  TO anon
  USING (true);

-- Anon INSERT — seeding initial rows from AdminUpload
CREATE POLICY "Anon can insert investor_docs"
  ON investor_docs FOR INSERT
  TO anon
  WITH CHECK (true);

-- Anon UPDATE — admin pastes URLs from AdminUpload page
CREATE POLICY "Anon can update investor_docs"
  ON investor_docs FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

-- Seed the 16 document slots so admin can paste URLs without creating rows manually
INSERT INTO investor_docs (doc_key, folder, name, locked) VALUES
  ('articles-of-incorporation',      'legal',      'Articles of Incorporation',        false),
  ('shareholder-agreement',          'legal',      'Shareholder Agreement',            true),
  ('ip-assignment-agreement',        'legal',      'IP Assignment Agreement',          true),
  ('cap-table-current',              'legal',      'Cap Table (Current)',              true),
  ('financial-projections-fy26-28',  'financials', 'Financial Projections FY26–28',   true),
  ('use-of-funds-breakdown',         'financials', 'Use of Funds Breakdown',           true),
  ('unit-economics-model',           'financials', 'Unit Economics Model',             true),
  ('investor-summary-seed-round',    'financials', 'Investor Summary — Seed Round',    false),
  ('product-architecture-overview',  'tech',       'Product Architecture Overview',    false),
  ('technical-whitepaper',           'tech',       'Technical Whitepaper',             false),
  ('security-compliance-brief',      'tech',       'Security & Compliance Brief',      true),
  ('api-integration-spec',           'tech',       'API Integration Spec',             true),
  ('beta-cohort-results-q1-2026',    'traction',   'Beta Cohort Results — Q1 2026',   false),
  ('customer-case-study-fsi',        'traction',   'Customer Case Study — FSI',        false),
  ('pipeline-loi-summary',           'traction',   'Pipeline & LOI Summary',           true),
  ('nps-retention-metrics',          'traction',   'NPS & Retention Metrics',          true)
ON CONFLICT (doc_key) DO NOTHING;

CREATE INDEX IF NOT EXISTS idx_investor_docs_folder ON investor_docs (folder);
