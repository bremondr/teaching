---
title: NI-PSD: Introduction to public service design
type: lecture
category: Course introduction
course: NI-PSD
tags: [ni-psd, public-services, course-intro, teamwork]
languages: [en]
level: Intro
status: Draft, November 2026
description: Opening lecture of NI-PSD (Public Service Design, FIT CTU): motivation and expectations, team exercise, organisation of the course, grading and team forming.
open: ./
open_label: Open the slides
---

# NI-PSD: Introduction to public service design

A Markdown slide deck, 26 slides, converted from the older Google Slides lecture: the opening lecture of the course NI-PSD (Public Service Design, FIT ČVUT): who we are, motivation and expectations, a team exercise, why design public services, the organisation of the course (time, outcomes, evaluation, grading, MS Teams) and forming the project teams. About one 90-minute lesson.

Language of the materials: English.

## What is here

| Path | What it is |
| --- | --- |
| `README.md` | This page |
| `index.html` | Starts the deck on the shared engine |
| `deck.md` | The slides, one Markdown file; speaker notes in `::: notes` |

## Using it

Open the slides from the hub (the button above), or `lectures/public-service-design-intro/` on the published site. Arrow keys move, `F` is fullscreen. Add `#presenter` to the address for the presenter view with notes, next slide and timer; it can open a second window for the projector. The page needs a web address (a local server or GitHub Pages), not a plain file.

## Editing it

All content is in `deck.md`. Slides are separated by a line with only `---`; speaker notes go in a `::: notes` block. See `shared/deck/README.md` for the format. After an edit run `python3 scripts/check.py` and open the page to check the slide count.

## Known limits

- Images are missing. The original slides rely on pictures and diagrams that could not be exported as text. Each such slide is kept in place with a short description in its speaker notes, so the order matches the original. Add the images to an `img/` folder (web size) and link them from `deck.md`.
- Some slides are repeats from animation steps in the original and are kept for fidelity.
- Third-party material was paraphrased or left out; check the notes before publishing a new version.
