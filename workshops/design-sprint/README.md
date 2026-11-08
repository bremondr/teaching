---
title: "Design Sprint: interactive facilitation deck"
type: workshop
category: Design and UX
course: NI-DSW
tags: [ni-dsw, design-sprint]
languages: [en]
level: Intermediate
status: Draft, Nov 2026
description: Facilitation slides for a four-session Design Sprint, as an interactive web deck with presenter view, plan clock, countdown timers and a team picker. Three versions are included: fall 2025 (the current one), spring 2025 and the 4 day variant.
open: ./
open_label: Open the Design Sprint deck
---

# Design Sprint: interactive facilitation deck

A deck for running a Design Sprint with a team or a class over four sessions: map the challenge, sketch and decide, build a realistic prototype, test it with users. It is the material of the NI-DSW course (FIT CTU). Each version has speaker notes, planned minutes (the plan clock in the presenter view), countdown timers for the time-boxed steps (Crazy 8s flashes and beeps every minute) and a picker for teams or turns.

Language of the materials: English.

## What is here

| Path | What it is |
| --- | --- |
| `README.md` | This page |
| `index.html` | Start page. Pick a version, or open it directly with `?v=fall-2025`, `?v=spring-2025` or `?v=four-day` |
| `versions/fall-2025.js` | The current version (fall 2025) |
| `versions/spring-2025.js` | The spring 2025 version |
| `versions/four-day.js` | The 4 day variant |
| `versions/shared/` | Parts the versions share: `intro.js` (the explanation intro), `brief.js`, `kickoff.js`, the day blocks, and `tools.js` (timer, picker, week and agenda helpers) |

The deck runs on the shared engine in `shared/deck/`.

## Versions

The three versions were built from three decks that grew one from another. Most slides are the same; the differences are small and real.

| | Fall 2025 (canonical) | Spring 2025 | 4 day variant (2024) |
| --- | --- | --- | --- |
| Opening | Expectations and learning goals after the welcome | Same, welcome says "four or five days" | A slide for the sprint team and roles, no expectations or learning goals |
| Outline of the week | Five day outline (explanation intro) | Same | Four day outline |
| Order of day 1 | Experts and HMW notes first, then lightning talks, goal, questions and map, then voting and target | Same, plus the expert interview slides a second time after the map | Lightning talks, goal, questions and map first, then experts and HMW notes, then voting and target |
| Day 2 | A block for the topic scope and learning goals before the inspiration | Same | No topic block |
| Days 2 to 4 | Same content in all three versions | | |

All three decks describe four working days, although the week outline of fall and spring still shows the five day method (prototype split over two days, test on day 5). The speaker notes say so. The deck agendas list "experts" in the afternoon of day 1 although the slides of fall and spring put them first; the slides were followed here.

## Using it

It needs a web address, not a double-clicked file, because the presenter window and the projector window talk to each other through the browser.

- On GitHub Pages: open `workshops/design-sprint/` on the published site and pick a version.
- Locally: run `python3 -m http.server` in the repo root and open `http://localhost:8000/workshops/design-sprint/`.

Open `?v=fall-2025` for the slides. Add `#presenter` for the presenter view (notes, next slide, plan clock, outline); its button opens the slide window for the projector. Both windows use the same `?v=` and the same channel, so they follow each other. `?s=day2/open` starts at the beginning of day 2 (`day1/open` to `day4/open`). Keys: arrows and space move, `F` is fullscreen.

The plan clock adds up the planned minutes of all four days, so jump to the start of a day for a single session.

Interactive slides:

- Countdown timers on the time-boxed steps (Start, Pause, Reset, +1 min). A timer started in one window runs in the other window of the same browser too. Crazy 8s shows the panel number and signals every minute.
- A picker that draws a team or a person without repeats (who shows first, who narrates and who scribes).

## Editing it

Words are in `versions/shared/*.js` (shared slides) and in the three version files (what is specific to a version). A slide is an object with `id`, `title`, `body` or `render`, `notes` and `min`. A version file lists slides and includes the shared modules with `{ id, include: "versions/shared/...js" }`. To change a version's order, move the include lines. To add a version, copy a version file, give it a new key and channel, and add it to the list in `index.html`.

After an edit run `python3 scripts/check.py` and `python3 scripts/sync_topics.py --check`, and open every version, the presenter view and the slide window.

## Sources

The method follows the Design Sprint by Jake Knapp, John Zeratsky and Braden Kowitz (Google Ventures). The slides are the author's own wording of the steps. The original materials of the method, such as the book, the official decks and checklists, are not included here.

## Known limits

- No images: the original decks used stock photos and diagrams. The speaker notes say where they were.
- The topic scope and the challenge brief are prompts to fill in for each run.
- Timers sync only between windows of the same browser.
- The planned times are the ones named in the original decks where they exist; the rest are estimates and the plan clock should be read as a rough guide.
