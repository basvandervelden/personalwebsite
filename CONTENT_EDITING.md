# Editing texts and images on the personal website

**GitHub on the `main` branch is the source of truth.** Always start from the newest version there. Once text is approved, do not change it unless explicitly asked.

## Where to edit

| What | File |
| --- | --- |
| Page titles, headlines, introductions, section copy, button labels | [`src/page-copy.json`](src/page-copy.json) |
| Biography, research areas, projects, selected publications, activity items and milestones | [`src/content.js`](src/content.js) |
| Complete long CV | [`src/cv-data.json`](src/cv-data.json) |
| Image filename, alt text and photo credits | [`src/media.json`](src/media.json) |
| Layout and functionality (not ordinary text) | `src/App.jsx`, `src/CV.jsx`, CSS files |

In `src/page-copy.json`, search for the current text and **edit only the value after the colon**, not the key to the left. Keep double quotes and commas valid. The sometimes long key names identify the original text and remain stable when you revise the wording. In `src/content.js`, edit text within the relevant object or list entry. The full CV is separate; see [CV_EDITING.md](CV_EDITING.md).

## Direct edits on GitHub

1. Open the relevant file and click the pencil icon (**Edit this file**).
2. Find the exact existing sentence with Ctrl+F.
3. Change its value only, then **Commit changes**.
4. GitHub Pages rebuilds the site automatically. Check the result when deployment succeeds.

Content-only changes do not require any special commit message.

## Editorial protection

See [AGENTS.md](AGENTS.md). All existing copy is considered approved. Agents must not rewrite it when changing design, photos or functionality.

The Pages workflow runs `npm run check:editorial`, using Git history:
- Only editorial files changed: allowed.
- Only code, design, media links or image assets changed: allowed.
- Editorial and application code changed in the same push: **blocked**, unless a commit in that push contains `[content]` (explicit permission for a combined change).

The protection is helpful but cannot determine the meaning of a content-only edit. Verify the GitHub diff before committing, and use Git history to restore an earlier revision if necessary.

## Photos

Upload the **original full-resolution photo** to `public/` or `public/images/`. Update the filename in `src/media.json`. Do not paste GitHub `blob` URLs into the website as an image source. Existing team-photo `community-team.avif` is compressed; replace it by pointing `media.team.file` to an original-resolution image after upload. Maintain accurate credits.

## Working with ChatGPT

Ask for a specific, bounded change, e.g. “Change only the About paragraph that begins ‘I care about the conditions’, without rewriting any other text.” I should first fetch the latest GitHub content, edit only the requested key, inspect the diff, and confirm the GitHub Pages deployment before claiming that the live site was updated.
