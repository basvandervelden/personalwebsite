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

## Add content

**Edit `src/content.js`** to add publication items, rewrite descriptions, expand projects and research areas, or update experience. Page layout and design live in `src/App.jsx` and `src/styles.css`.

Content and editorial text are a structured starting point and should be reviewed and expanded over time. The full publication record is linked at Research@WUR; the internal publication list is intentionally curated.

## Replace image placeholders

Large photo and scientific illustration placeholders are rendered by the `MediaSlot` component in `src/App.jsx`. Each placeholder displays a suggested subject and optional caption. This makes the intended composition visible without using generic stock art or fake scientific diagrams.

Suggested image set:
- Professional portrait for Home and About
- One overarching methods/data/impact research figure
- At least one meaningful scientific figure per research area (3)
- Project hero image/figure and supporting image for each project (4 × 2)
- Photos from talks, AIFS events, team or laboratory work (3–5)

When actual images become available, place them in `public/images/` and replace each MediaSlot with a semantic `<figure><img ... /></figure>`. For example:

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
