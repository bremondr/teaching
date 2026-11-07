# Teaching hub: agent instructions

A static site (GitHub Pages) with every lecture, workshop and template I teach, one item per
folder: `lectures/<slug>/`, `workshops/<slug>/`, `templates/<slug>/`. `readme.md` has the layout,
the steps for adding an item and the tidy rules; read it first.

## How it links to the notes vault

- Planning lives in a separate private notes vault, in `areas/teaching/workshops/<slug>/`: plan,
  decisions, open points, tasks. This repo holds what is shown or handed out: apps, slides, print kits.
- A workshop has the same slug in both places (`workshops/cook-a-game/` here). The vault links to
  this repo; this repo never links to private notes and holds no private data (no student names,
  mails, grades or tokens).
- The vault has a skill, `new-workshop`, with the full steps for a new workshop. When a workshop
  changes here, its hub note in the vault (table of addresses, status) changes too.

## Rules

- Work on a branch `agent/<topic>` and open a pull request. Never push to `main`. Merge or delete
  branches only when asked in that moment.
- Before every commit run `python3 scripts/check.py` (no errors) and
  `python3 scripts/sync_topics.py --check`. A README with front matter is the description of an
  item; `sync_topics.py` builds its hub card.
- Keep `.nojekyll` in the root. Without it Pages runs Jekyll, turns the README files into HTML and
  the README viewer (`readme.html`) cannot load them.
- Print files are built from `print-src/`; change the sources, not the PDFs. Every PDF in `print/`
  is linked from the card or the README.
- Shared code goes to a `shared/` folder only when two items need it.
- `github.io` cannot be reached from a Claude session. Test pages in headless Chromium with a faked
  address instead (Playwright `context.route` serving the repo files).
