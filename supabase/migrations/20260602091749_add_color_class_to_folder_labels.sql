/*
  # Add color_class to folder_labels

  Allows admins to persist colour overrides for static folders (legal, financials, tech, traction)
  the same way custom folders already store their colour in custom_folders.color_class.

  1. Changes
    - `folder_labels`: adds `color_class` (text, nullable) column
      - NULL means "use the hardcoded default from STATIC_FOLDER_META"
      - A value like 'text-rose-400' overrides the default
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'folder_labels' AND column_name = 'color_class'
  ) THEN
    ALTER TABLE folder_labels ADD COLUMN color_class text;
  END IF;
END $$;
