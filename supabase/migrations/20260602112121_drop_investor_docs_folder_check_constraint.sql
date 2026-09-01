/*
  # Drop investor_docs folder check constraint

  The investor_docs_folder_check constraint only allows 4 hardcoded folder keys
  (legal, financials, tech, traction). Custom folders added via the admin UI have
  dynamic keys and are blocked by this constraint. Dropping it allows any folder
  key, which is safe because folder validity is enforced at the application layer
  via the custom_folders and folder_labels tables.
*/

ALTER TABLE investor_docs DROP CONSTRAINT IF EXISTS investor_docs_folder_check;
