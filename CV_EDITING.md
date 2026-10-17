# Updating the long CV website

The live website shows a searchable **Full academic CV** at `#/cv`.
It is intentionally linked from **About** and the **footer** rather than the main navigation.

## The one file you normally edit

Open [src/cv-data.json](./src/cv-data.json) on GitHub and click the pencil icon to edit.

- **Add a new entry:** find the relevant section number, copy an existing entry object inside its `entries` array, and change `id`, `title`, `period`, `details`, `meta` and optionally `links`.
- **Modify an existing entry:** search for the talk, project or person name and change the text.
- **Add a publication:** use section 13. Paste the citation into `title`, the publication year into `period`, and the DOI under `links`.
- **Add a web link:** add `{"label": "Project page", "url": "https://..."}` to the entry's `links` array. Use a full `https://` URL.
- **Add a photograph:** upload an image to `public/images/cv/`, then set a media item's `src` to `./images/cv/your-image.jpg` and `alt` to a meaningful description.
- **Add a video:** use a YouTube link such as `https://www.youtube.com/watch?v=XXXXXXXXXXX` as a media item's `src`. Videos are loaded only when a visitor presses Play.
- **Add slides / a paper / a dataset:** add the URL to the relevant CV entry's `links`.

For an entry with more than one link, the structure is:

```json
{
  "id": "cv-11-99",
  "title": "Invited talk — Example",
  "period": "2027",
  "details": "What the talk covered.",
  "meta": "Venue or event",
  "links": [
    {"label": "Slides", "url": "https://example.org/slides"},
    {"label": "Recording", "url": "https://example.org/video"}
  ]
}
```

Each `id` must be unique inside the CV. Keep the surrounding commas and quotation marks valid JSON. GitHub does not automatically validate JSON before accepting a commit; the build will identify errors.

## Alternative: have ChatGPT make edits

Because the repository is connected to ChatGPT, you can simply ask, for example:

> Add this invited talk to the CV, include the conference link and place the photo on the CV media section.

You don't need to edit JSON manually if you prefer to send notes, text, links or images here.

## Navigation, interaction and printing

- Visitors can filter the CV by topic and start year, perform a full-text search and select compact/detailed views.
- Each of the 17 sections has a direct link, e.g. `#/cv/11` for talks.
- A **Print / save as PDF** button uses the browser's print function.
- On the phone, the table of contents becomes a horizontal scrolling list.

## Source and editorial caution

The initial dataset was transcribed from `Bas_van_der_Velden_Long_CV_October_2026.docx`. It includes historical entries and forward-planned activities; these should be checked before wider distribution.

- The **publications** in the October 2026 long CV are a **selected list**, not a complete bibliography. Keep the Research@WUR link for the full record.
- Funding amounts combine internal awards, total programmes and WFSR shares; do not sum them as personal PI funding.
- A mobile number from the source CV was deliberately omitted from the public webpage.
- Images and videos must be publishable (copyright and consent).

## Release

Each commit to `main` triggers GitHub Actions and republishes GitHub Pages.
Verify the live site at https://basvandervelden.github.io/personalwebsite/#/cv before moving basvandervelden.com.
