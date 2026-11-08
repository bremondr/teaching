---
title: "Cook a game: game design workshop"
type: workshop
category: Game design
tags: [game-design, workshop-kit, creative-tech]
languages: [en, es]
level: Intro
status: First version, Nov 2026
description: Three-hour workshop where teams build a tabletop game from ingredient cards, adapt it to a secret twist and playtest it. Facilitator app with slides, presenter view and timers, plus a printable card kit.
open: ./
open_label: Open the facilitator app
---
# Cook a game: game design workshop

A three-hour workshop where teams of students design, play and improve a small
tabletop game built from ingredients (setting, thing, audience from the students;
mechanic, goal, limit from a prepared deck), with a secret twist halfway through.
First run: International Faculty Week, Tec de Monterrey, Guadalajara, 10 Nov 2026.

Language of the materials: English, with Spanish labels on the printed cards and on
the slides. Everything the students write is in English.

Status: first version, built 2026-11-07 before the first run. Expect changes after it.

## What is here

| Path | What it is |
| --- | --- |
| `index.html`, `app.css`, `app.js` | The facilitator app: script plan, presenter view and slide window |
| `content.js` | All the words of the workshop: script blocks, slide texts, twists, team names |
| `fonts/` | Two variable fonts (latin and latin-ext), so the app looks the same offline |
| `print/` | The print kit as PDFs, A4, with cut marks, and all of it in one file (see below) |
| `print-src/` | The sources of the print kit and the script that builds the PDFs |

## Running the app

The app is static: no build step and no server code. It must be opened from a web
address, not as a double-clicked file, because the presenter window and the slide
window talk to each other through the browser and that needs a normal origin.

- On GitHub Pages: open `workshops/cook-a-game/` on the published site.
- Locally: run `python3 -m http.server` in the repo root and open
  `http://localhost:8000/workshops/cook-a-game/`.

Three views, chosen by the end of the address. The "Exit to README" button at the top right of the presenter view and the plan leaves the app and opens this README.

- `#plan`: the script plan. Switch parts on or off, change their minutes,
  move them, read the script, leave notes. Load the 180 or the 90 minute plan.
- (nothing) or `#presenter`: the presenter view for your laptop, the default. Slide preview, next slide, notes,
  timer, workshop clock, team maker, twist dealer, comment box.
- `#slide`: the slide window for the projector. Press `F` or double-click for full
  screen. Open it with the "Open slide window" button in the presenter view, or by
  hand in a second window of the same browser.

Your plan, notes, team settings and comments are kept in this browser
(`localStorage`). Nothing is sent anywhere. Clearing the site data clears them.

## Editing the content

Change `content.js`, not the engine. The blocks are in `B`, the slide texts in `SL`,
the twists in `TW`, the team names in `TEAMS`. Keep the English and the Spanish line
of a slide together. The app checks nothing, so after an edit open the three views
and click through the slides once. Every slide must fit 16:9 without scrolling; the
app shrinks long text to fit, but a very long slide becomes hard to read.

## Print kit (`print/`)

| File | Pages | What |
| --- | --- | --- |
| [`print-kit-all.pdf`](print/print-kit-all.pdf) | 19 | Everything below in one file, with a cover page that says what to print and how many pages each part has |
| [`deck-cards.pdf`](print/deck-cards.pdf) | 7 | 64 ingredient cards, 90 x 55 mm, 10 per page, Spanish upside down above the English |
| [`rules-card-a6.pdf`](print/rules-card-a6.pdf) | 2 | First rules card, A6, 4 per page, no twist box |
| [`rules-card-a5-final.pdf`](print/rules-card-a5-final.pdf) | 4 | Final rules card after the twist, A5 landscape, 2 per page |
| [`rules-card-example-a6.pdf`](print/rules-card-example-a6.pdf), [`rules-card-example-a5.pdf`](print/rules-card-example-a5.pdf) | 1 each | Filled-in examples (the game The Mind) |
| [`idea-card.pdf`](print/idea-card.pdf) | 1 | The one-sentence idea card, 10 per page |
| [`team-slips.pdf`](print/team-slips.pdf) | 2 | 72 team slips with fruit and vegetable pictures, for up to 8 teams |

Print at 100 percent, not "fit to page". Colour system: yellow, green and pink sticky
notes for setting, thing and audience; the printed cards are blue (mechanic), orange
(goal), slate (limit) and violet (twist).

The PDFs are built from the sources in [`print-src/`](print-src/README.md): `deck.json` holds the ingredient cards, and one command rebuilds every PDF and the merged file. Change the sources, not the PDFs.

## Known limits

- The two windows must be in the same browser on the same computer.
- The Spanish text is neutral Latin American Spanish and has not been checked by a
  Mexican speaker.
- Team pictures are standard emoji, so they look different on different systems.
- A6 cards fill the whole A4 page, so a printer margin can clip the outer 4 to 5 mm.
  The card frame is inset to avoid that; print one page first.
