# Personal website — Bas van der Velden

A professional, content-first academic website for [basvandervelden.com](https://basvandervelden.com) (domain switch not yet performed).

Built with **React + Vite** and deployed automatically to GitHub Pages.

## Current page structure

- `#/ ` — Home
- `#/research` — Research overview
- `#/research/trustworthy-ai`, `#/research/foundation-models`, `#/research/ai-food-safety` — research detail pages
- `#/projects` — Projects overview
- `#/projects/chefs`, `#/projects/living-review`, `#/projects/foundation-models`, `#/projects/early-warning` — project detail pages
- `#/publications` — Selected publications with type filters
- `#/academic-activities` — Talks, scientific exchange, community, mentorship
- `#/about` — Biography and selected milestones
- `#/contact` — Contact details and external profiles

Routing uses URL fragments (`#/research`, etc.) so pages can be bookmarked and refreshed correctly on GitHub Pages and later on the custom domain without server-side routing.

## Editing content safely

The site separates approved editorial content, media assets and layout. **Make text edits in GitHub or draft them with ChatGPT; the copy will not be rewritten as a side effect of design work.**

- [`src/page-copy.json`](src/page-copy.json) — page titles, headings, text and buttons.
- [`src/content.js`](src/content.js) — biography, research areas, projects, selected publications and activities.
- [`src/cv-data.json`](src/cv-data.json) — complete long CV.
- [`src/media.json`](src/media.json) — image files, alt text and photographer credits.
- `src/App.jsx`, `src/CV.jsx` and stylesheets — layout and behaviour.

See **[CONTENT_EDITING.md](CONTENT_EDITING.md)** for direct editing examples and **[AGENTS.md](AGENTS.md)** for the approved-copy preservation rules. GitHub Actions prevents combined text + code edits unless the commit explicitly includes `[content]` (content-only edits are allowed normally).

## Replace image placeholders

Large photo and scientific illustration placeholders are rendered by the `MediaSlot` component in `src/App.jsx`. Each placeholder displays a suggested subject and optional caption. This makes the intended composition visible without using generic stock art or fake scientific diagrams.

Suggested image set:
- Professional portrait for Home and About
- One overarching methods/data/impact research figure
- At least one meaningful scientific figure per research area (3)
- Project hero image/figure and supporting image for each project (4 × 2)
- Photos from talks, AIFS events, team or laboratory work (3–5)

When actual images become available, place them in `public/images/` (or `public/`) and replace each MediaSlot with a semantic `<figure><img ... /></figure>`. For example:

```jsx
<figure className="real-media">
  <img src="./images/profile.jpg" alt="Bas at Wageningen Food Safety Research" loading="lazy" />
  <figcaption>Photo: credit, if required</figcaption>
</figure>
```

For public GitHub Pages hosting, image files should be properly licensed for reuse and not include confidential/unpublished information.

## Local development

Requires Node.js 20+.

```bash
npm install
npm run dev
npm run build
```

## Deployment

Push to `main` to trigger `.github/workflows/pages.yml`. The published preview is:

https://basvandervelden.github.io/personalwebsite/

GitHub Pages must use **Settings → Pages → Source → GitHub Actions**.

Only once the site is ready should `basvandervelden.com` be configured as the GitHub Pages custom domain and DNS switched at PS IT Solutions. `basvandervelden.nl` can redirect to the .com domain. Leave e-mail DNS records unchanged.

## Notes

- No cookies, trackers, backend or login.
- Light/dark mode preference is stored locally.
- Fonts are loaded from Google Fonts, with system fallbacks.
- CHEFS's 392 million analytical results refer to the published study.

## Complete academic CV

The full long-CV source has been converted into an interactive page at [Full academic CV](https://basvandervelden.github.io/personalwebsite/#/cv), with 17 sections, search, filters, compact view, printable view, DOI links, media support and a section table of contents. Edit the data in `src/cv-data.json` and see [CV_EDITING.md](./CV_EDITING.md) for a short guide.
