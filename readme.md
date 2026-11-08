# Teaching Hub

Static landing page for all lecture and workshop materials. The `index.html`
file is GitHub Pages friendly and bundles lightweight CSS/JS to keep everything
portable.

## Features
- Curated intro explaining how to navigate the repository.
- Filterable grid of lecture/workshop/template cards (search, type, course, tags) with expandable content sections.
- Color palette inspired by grafit.games: anthracite base, light greys, blueberry
  accents, and cloudberry highlights.
- Future-facing section outlining the planned Markdown → HTML/PDF builder so each
  deck can ship as slides + downloads.
- Consistent language flags rendered via Twemoji for every topic.

## Structure
- `index.html` – landing page with comment-documented HTML, CSS, and vanilla JS.
- `styles.css` / `app.js` – styling + logic for filtering and topic rendering.
- `topics/topics.json` – data source for every lecture/workshop/template. Add new
  entries here (or extend with per-topic subfolders) and the home page will render
  them automatically; no need to edit `index.html`.
- `<template id="topic-template">` inside `index.html` – edit this snippet to tweak
  topic card markup; JS clones it for every entry.
- `lectures/`, `workshops/`, `templates/` – one folder per item, see the layout below.
- `scripts/check.py`, `scripts/sync_topics.py` – keep the repo tidy and the cards in line with the READMEs; run them before every commit.
- `_template/` – a README with front matter to copy for a new item.
- `readme.html`, `assets/` – the Markdown viewer and its libraries.

### Editing a card by hand
For an item with a folder, `scripts/sync_topics.py` writes the card from the README (see
"Adding an item"). To add extra links to a card, or a placeholder card without a folder,
edit `topics/topics.json` by hand:
1. Duplicate one of the objects inside `topics/topics.json`.
2. Update its metadata (title, type, tags from the `tags` list, level/status, description).
3. Add any resource links with `{ label, href, available }`.
4. Supply `languages: []` with ISO codes (`en`, `cs`, etc.); the UI renders flag
   icons via Twemoji based on those codes.

Once committed/pushed, the landing page fetches the JSON and renders the card.

Deploy the root directory via GitHub Pages to expose the landing page. Future
Markdown sources and build scripts can live inside each track folder and publish
their outputs back to the same repo.

## Slides must fit

Every slide of a deck has to stay inside its margins. The deck engine shrinks a slide that holds a little too much; a slide
that needs more than that must be split. Run `node scripts/audit_slides.js` after adding or changing a deck (it needs Playwright;
see `shared/deck/README.md`). It must report no slide that does not fit, and slides shrunk below 80% should be split.

## How the homepage is organised

The homepage lists the items in sections, built from `topics/topics.json`:

1. **One section per course**, in the order of the `courses` list at the top of `topics.json` (`code`, `title`, `description`).
   A lecture or workshop belongs to a course when its README front matter has `course: NI-PSD`. A course with nothing
   published says so.
2. **Standalone lectures and workshops**: anything with no course (guest lectures and workshops outside the courses).
3. **Building blocks**: every template (exercises, method sheets, handouts), whatever its course. A template that was made for a
   course says so on its card, and the Course filter finds it.

To add a course, add it to the `courses` list. A `course` value that is not in the list is an error in `check.py`.

## Tags and the filter bar

The bar at the top of the homepage has, in this order: **Search** (title, description, category, course and tag
names), **Type**, **Course** and **Tags**. Under them it says "N of 16 materials" and has a **Clear filters** button.

- The choices combine: a card must pass all of them, and when several tags are chosen it must have every one of them.
- Options that would leave nothing are left out (a course with no published item, a tag no remaining card has), and the
  Type, Course and tag lists show how many cards each would leave. A section with no card left is hidden together with
  its jump link.
- The tags on a card are buttons too: a click adds or removes that tag in the filter.
- The choice is kept in the address, so a filtered view can be shared:
  `?q=sketch&type=template&course=ni-psd&tag=ideation,sketching` (`tag` takes a comma separated list).
- Colours come from `shared/design/tokens.css` only, so the bar follows the light and dark themes.

**Tags are a controlled list.** The `tags` list at the top of `topics/topics.json` is the only place where a tag exists
(`code`, the lowercase hyphenated spelling used in README front matter, and `label`, the text shown on the page, for
example `{"code": "ux", "label": "UX"}`). Rules, which `scripts/check.py` enforces:

- Use only listed tags, at most 5 per item. An unknown tag is an error and the check suggests the nearest listed one.
- One tag per concept, one English spelling (`design-process`, not `design-thinking` or `human-centred-design`).
  Two labels that differ only in case or punctuation are an error.
- No tag that repeats a course (`ni-psd`) or an item type (`exercise`, `workshop-kit`): those have their own filters.
- Keep the list short, about 15 tags, and warned about above 20. A listed tag no card uses is a warning.

To add a tag, add it to the `tags` list (and use it); to rename or merge one, change the front matter of the affected
READMEs, run `python3 scripts/sync_topics.py`, then remove the old entry from the list.

## Folder layout

```
index.html, styles.css, app.js   the hub (landing page)
readme.html, assets/             the Markdown viewer (and its vendored libraries)
topics/topics.json               the catalogue: one entry per item
lectures/<slug>/                 a lecture: slides, notes, handouts
workshops/<slug>/                a workshop: facilitator material, print kit, apps
templates/<slug>/                a reusable template or worksheet
_template/                       copy this to start a new item
scripts/check.py                 the tidy-repo check
scripts/sync_topics.py           cards in topics.json from the item READMEs
```

An item lives in exactly one folder, named after its type. The folder name is a short
lowercase ASCII slug with hyphens (`cook-a-game`, not `Game Design (v2)`). A workshop that
has a note folder in the notes vault uses the same slug there, so the two always match.
The first item is `workshops/cook-a-game/`: a facilitator app, slides and
a print kit.

## Adding an item

The README is the description of an item. Write it, run one script, and the hub card and
a nicely rendered page follow.

1. Copy `_template/README.md` to `<type>s/<slug>/README.md`. Fill in the front matter at
   the top (title, type, category, tags, languages, level, status, description; optional `course`, the
   course the item belongs to, which adds it to the hub's Course filter; `open`
   and `open_label` for a button to the app or slides, delete them if there is none).
2. Put the material in the same folder. Typical sub-folders: `slides/`, `print/` (PDFs,
   A4), `img/` (web-size images), `fonts/`. Say in the README how generated files were made.
3. Run `python3 scripts/sync_topics.py`. It adds or updates the card in `topics/topics.json`
   from the front matter and links the README. Add extra links (slides, PDFs) to the card
   by hand; the script keeps them.
4. Run `python3 scripts/check.py`. Fix every error; read the warnings.
5. Commit on a branch (`claude/<topic>` when Claude works on it), then merge.

## How READMEs are shown

`readme.html` renders any Markdown file of the repo as a page, in the colours of the hub:
header from the front matter, table of contents, tables, code, relative links and images.

- `readme.html?p=workshops/some-item` shows that folder's README.md.
- `readme.html?f=path/to/file.md` shows any `.md` file in the repo.
- Links to `.md` files in the hub cards, and inside rendered Markdown, open in the viewer
  by themselves. Links to PDFs and external sites open in a new tab.
- GitHub Pages must serve the files as they are, so the repo has an empty `.nojekyll` file.
  Never delete it: without it Jekyll turns every `.md` file that has front matter into HTML,
  the raw `.md` disappears from the site and the viewer shows "Could not load".
- The viewer needs no build step. Markdown is parsed by `marked` and cleaned by
  `DOMPurify`, both kept in `assets/vendor/` with their licences (no internet needed).

## Keeping it tidy

- One folder per item, one README per item, one entry per item in `topics.json`.
- Shared code or styles move to a `shared/` folder only when two items need them. Until
  then each item keeps its own copy, so an item never breaks because of another.
- No archives, videos, PSD or Keynote files (the check refuses them). Export slides to
  PDF or HTML. Images are web-size (about 1600 px wide, no location data); originals stay
  outside the repo.
- Office files are allowed but warned about: commit the PDF and keep the source elsewhere.
- No private data: no student names or work, no grades, no emails, no tokens.
- Large generated files (PDFs, fonts) are fine up to a few MB each. The check warns at
  2 MB per file and 25 MB per item, and fails at 10 MB per file.
- File names are ASCII, without spaces, and never differ only in letter case.
- Tags come from a short controlled list, see "Tags and the filter bar". A new tag goes into
  that list first; `index.html` never needs to change.

