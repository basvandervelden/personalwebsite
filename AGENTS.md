# Editing instructions for this website

These instructions apply to all files in this repository, including to AI assistants and coding agents.

## Editorial rules (highest priority)

- Treat **all currently published copy as already approved** by the site owner. Do not rephrase, rewrite, summarise, translate, shorten, expand, modernise, or "improve" approved text unless the user explicitly requests that exact editorial change.
- The canonical editorial files are:
  - `src/page-copy.json`: static titles, introductions, captions for placeholder imagery, calls to action and page-level text.
  - `src/content.js`: site identity, biography, research areas, projects, curated publications, activity sections and milestones.
  - `src/cv-data.json`: the full CV and publication inventory. Do not mutate as a side effect of design work.
  - `src/media.json`: image filenames, accessible descriptions and photo credits. This is **media metadata**, not a license to modify editorial copy.
- `src/App.jsx`, `src/CV.jsx`, stylesheets and scripts are for functionality and presentation, not for routine editorial changes.
- Read the latest files and GitHub HEAD before any edit. Preserve unrelated changes and use the smallest possible diff; never restore an outdated local copy over newer user edits.
- A request to change design, pictures, performance or functionality **does not authorise** changes to site wording, publication details, CV entries, labels or existing credits.
- When asked to update a specific sentence, only edit that entry. Do not edit neighbouring entries.
- Never add provenance notes, "to verify" disclaimers, review badges or other explanatory labels to public CV entries without an explicit request.
- Keep author names, publication years, journal names, impact factors and DOIs unchanged unless the owner asks for a correction based on evidence.
- Do not fabricate new content, image rights or bibliographic data.

## Before every commit

1. Identify requested files and exact keys before editing.
2. Compare the proposed diff against the newest `main` branch.
3. Confirm all editorial data not explicitly requested are byte-for-byte unchanged.
4. If intentional editorial and code/design changes must be combined, mark the commit **[content]** so the GitHub Actions guard recognises the deliberate exception. Tell the owner what copy changed.
5. Run the Vite build and the editorial boundary check; only say the website is live after a successful deployment.

Direct content-only edits on GitHub are allowed without a special commit message. Mixed code + content changes without the marker are blocked by GitHub Actions.

See [CONTENT_EDITING.md](CONTENT_EDITING.md) for editing examples. This is an operational safeguard, not an absolute technical guarantee: always examine the diff for important changes.
