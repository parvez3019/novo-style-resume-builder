---
description: Import an existing PDF, TXT or JSON resume to auto-fill the resume builder.
---

# Importing a resume

Click **Upload resume** in the toolbar and choose a `.pdf`, `.txt` or `.json` file. For PDF and TXT, the text is extracted **in your browser** with [pdf.js](https://mozilla.github.io/pdf.js/) and mapped onto the editor's sections.

## JSON backups

Click **Download JSON** to save everything in one file, including your theme and profile photo, which the plain-text export cannot hold. Upload that `.json` file later to restore it exactly. The file is checked first; if it is not a resume exported from this app you get an error and nothing is changed.

## What works best

- **Text-based PDFs**, e.g. exported from Word, Google Docs or this app. Scanned or image-only PDFs have no text to extract.
- **The app's own ATS text export.** It round-trips cleanly, so you can use it as a backup and restore format.

## Limitations

- Parsing is heuristic. Always review each section after importing.
- Fields that can't be detected fall back to the sample content.
- Your existing profile photo and theme are kept.
