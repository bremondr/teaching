# Teaching Hub

Static landing page for all lecture and workshop materials. The `index.html`
file is GitHub Pages friendly and bundles lightweight CSS/JS to keep everything
portable.

## Features
- Curated intro explaining how to navigate the repository.
- Filterable grid of lecture/workshop/template cards (search, type, tags) with expandable content sections.
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
2. Update its metadata (title, type, tags, level/status, description).
3. Add any resource links with `{ label, href, available }`.
4. Supply `languages: []` with ISO codes (`en`, `cs`, etc.); the UI renders flag
   icons via Twemoji based on those codes.

Once committed/pushed, the landing page fetches the JSON and renders the card.

Deploy the root directory via GitHub Pages to expose the landing page. Future
Markdown sources and build scripts can live inside each track folder and publish
their outputs back to the same repo.

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
lowercase ASCII slug with hyphens (`game-design-guadalajara`, not `Game Design (v2)`).
The first item is `workshops/game-design-guadalajara/`: a facilitator app, slides and
a print kit.

## Adding an item

The README is the description of an item. Write it, run one script, and the hub card and
a nicely rendered page follow.

1. Copy `_template/README.md` to `<type>s/<slug>/README.md`. Fill in the front matter at
   the top (title, type, category, tags, languages, level, status, description; `open`
   and `open_label` for a button to the app or slides, delete them if there is none).
2. Put the material in the same folder. Typical sub-folders: `slides/`, `print/` (PDFs,
   A4), `img/` (web-size images), `fonts/`. Say in the README how generated files were made.
3. Run `python3 scripts/sync_topics.py`. It adds or updates the card in `topics/topics.json`
   from the front matter and links the README. Add extra links (slides, PDFs) to the card
   by hand; the script keeps them.
4. Run `python3 scripts/check.py`. Fix every error; read the warnings.
5. Commit on a branch (`agent/<topic>` when Claude works on it), then merge.

## How READMEs are shown

`readme.html` renders any Markdown file of the repo as a page, in the colours of the hub:
header from the front matter, table of contents, tables, code, relative links and images.

- `readme.html?p=workshops/some-item` shows that folder's README.md.
- `readme.html?f=path/to/file.md` shows any `.md` file in the repo.
- Links to `.md` files in the hub cards, and inside rendered Markdown, open in the viewer
  by themselves. Links to PDFs and external sites open in a new tab.
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
- New tags need no change in `index.html`: the filter lists every tag used in
  `topics.json`. Tags are lowercase words joined by hyphens.

