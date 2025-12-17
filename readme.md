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

## Structure
- `index.html` – landing page with comment-documented HTML, CSS, and vanilla JS.
- `ux/` – example folder housing current UX slides; add more folders per track.

Deploy the root directory via GitHub Pages to expose the landing page. Future
Markdown sources and build scripts can live inside each track folder and publish
their outputs back to the same repo.
