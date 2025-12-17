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
- `ux/` – example folder housing current UX slides; add more folders per track.

### Adding a new topic
1. Duplicate one of the objects inside `topics/topics.json`.
2. Update its metadata (title, type, tags, level/status, description).
3. Add any resource links with `{ label, href, available }`.
4. Supply `languages: []` with ISO codes (`en`, `cs`, etc.); the UI renders flag
   icons via Twemoji based on those codes.

Once committed/pushed, the landing page fetches the JSON and renders the new card.

Deploy the root directory via GitHub Pages to expose the landing page. Future
Markdown sources and build scripts can live inside each track folder and publish
their outputs back to the same repo.
