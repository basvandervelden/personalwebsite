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


## October 2026 master CV expansion

The online CV is now a **working master list** rather than a selectively edited public CV.

Sources combined:
- `Bas_van_der_Velden_Long_CV_October_2026.docx` — existing CV sections.
- `publicaties_aangevuld.xlsx` — 75 historic publications, preprints, abstracts and conference outputs. Duplicates were removed where titles/years matched the long CV.
- `agenda_cv_shortlist.xlsx` — calendar-derived leads, maintained separately in `data/cv-review-queue.json`.
- Wageningen Research output/activities and publicly available conference programmes — direct links added where available.

**Check labels:**
- `"status": "verified"` — supported by public institutional/event records.
- `"status": "imported"` — imported from the earlier publication spreadsheet; bibliographic metadata may need checking.
- `"status": "to_verify"` — calendar/proposal lead; do not present as confirmed without validating the role.
- Entries with no status are inherited from the October CV and should also be reviewed when required.

The website's **Include unverified candidates** checkbox temporarily hides all `to_verify` rows.

### Prune an entry

Find its unique `id` in `src/cv-data.json`, then delete the entire JSON object from its section's `entries` array (including a trailing comma if required). Or tell ChatGPT the `id`, name or title and ask to remove it. Commit on `main` to publish automatically.

### Confirm an agenda candidate

Edit `status` from `to_verify` to `verified`, add the correct `period`, `title`, `details` and one or more external `links`. Ideally move the entry from the last candidate section to the appropriate section, such as **Invited keynotes**, **Scientific service** or **Projects**.

### Why publication counts differ

Research@WUR reports its own institutional output types (including posters and digital products). The current master publication section also includes older spreadsheet-derived abstracts, preprints and conference contributions and may contain version duplicates. **Do not interpret its item count as peer-reviewed journal articles or as an official bibliometric total.**
