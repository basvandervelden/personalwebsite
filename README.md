# Personal website — Bas van der Velden

Personal academic website for **basvandervelden.com**, built with React and Vite. Responsive design, pastel-lilac styling, automatic light/dark mode, no database or analytics.

## Edit the website

- `src/content.js` — biography, research themes, projects, publications and profile links.
- `src/App.jsx` — React layout and interactions.
- `src/styles.css` — colours, layout and mobile styling.
- `public/favicon.svg` — browser icon.

## Develop locally

Requires Node.js 20+.

```bash
npm install
npm run dev
```

## Publishing with GitHub Pages

A workflow at `.github/workflows/pages.yml` builds and deploys on every push to `main`.

**One-time configuration:** go to **Settings → Pages → Build and deployment → Source → GitHub Actions**.

After a successful run at **Actions → Deploy personal website to GitHub Pages**, the preview should be:

https://basvandervelden.github.io/personalwebsite/

Only after reviewing this preview, configure **Settings → Pages → Custom domain** to use `basvandervelden.com` and update the DNS at PS IT Solutions. Leave existing e-mail DNS records unchanged. Arrange an HTTP 301 redirect from `basvandervelden.nl` to `.com` at PS IT Solutions. Do not cancel old hosting until both domains are working.

## Notes

- Publications are a curated selection, not an automated publication feed. See Research@WUR for the complete list.
- CHEFS's 392M figure refers to the published study, not necessarily the live database.
- No visitor tracking or cookies are added. The theme preference is stored locally.
- Google Fonts load externally, with system fallbacks.
- Review all public profile text before switching the custom domain.
