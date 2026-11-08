---
title: "Cook a game: game design workshop"
type: workshop
category: Game design
tags: [game-design, creative-tech]
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

Three views, chosen by the end of the address. The "Exit" button at the top right of the presenter view and the plan leaves the app and opens this README.

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

## Materials

Everything to bring or ask the hosts for. The quantities are for 20 students in 5 teams of 4; the
facilitator app works out the same list for the real numbers (bottom of the script plan view,
`#plan`), so check there on the day.

**Printed from `print/`** (at 100 percent, with the cut marks; see the table above)

- Ingredient deck, 64 cards, 7 pages, one set for the facilitator.
- Rules cards, first version (A6, no twist box), 8 cards on 2 pages.
- Rules cards, final version (A5, handed out at the twist), 8 cards on 4 pages.
- Idea cards, 1 page of 10 is enough for 5 teams.
- Team slips, 2 pages, 72 slips for up to 8 teams, cut out; spares cover late students.
- The two filled-in examples (A6 and A5), one copy each to show.

**Writing and building supplies**

| Item | Quantity (20 students, 5 teams) |
| --- | --- |
| Sticky notes, 3 colours: yellow (setting), green (thing), pink (audience) | 30 of each, one note per student per colour plus spares |
| Index cards | about 200 (40 per team) |
| Pens or pencils | 20, one each |
| Markers, different colours | 22 (4 per team and 2 for the facilitator) |
| Tokens (coins, beans, buttons) | about 100 (20 per team) |
| Blank A4 paper | 50 sheets (10 per team) |
| Scissors | 5 (one per team) |
| Tape, plus masking tape for the walls | 5 rolls |
| Paper cups or envelopes, for hiding things | 10 |
| Paper clips or rubber bands | a small handful per team |
| A box or bag for the discarded notes (twist T15 needs them) | 1 |

**Flipcharts**

| Item | Quantity |
| --- | --- |
| Flipchart paper sheets, taped to the wall (no stands needed): 1 for the facilitator with the language rule, the time plan and a parking lot for questions; 1 or 2 per team to show its game or keep its rules visible | 6 to 11 in all |
| Flipchart markers, thick, at least 4 colours (the marker count above is for the tables) | 1 set for the facilitator, 1 per team if the sheets are used |

**Room and equipment**

- Movable chairs, a table per team, one open table for the deal, wall space for the flipchart sheets.
- A projector with an HDMI or USB-C adapter, and a laptop with the app open: the presenter view on the laptop, the slide window on the projector.
- A real game for the mini-lecture: Codenames (Pictures), or another game that can be taken apart.
- A timer and a camera for photos (a phone is enough; the app has the clock).

## Known limits

- The two windows must be in the same browser on the same computer.
- The Spanish text is neutral Latin American Spanish and has not been checked by a
  Mexican speaker.
- Team pictures are standard emoji, so they look different on different systems.
- A6 cards fill the whole A4 page, so a printer margin can clip the outer 4 to 5 mm.
  The card frame is inset to avoid that; print one page first.
