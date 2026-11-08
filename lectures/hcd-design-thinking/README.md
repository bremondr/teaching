---
title: NI-PSD: Human-centred design and design thinking
type: lecture
category: Design process
tags: [ni-psd, human-centred-design, design-thinking, design-sprint]
languages: [en]
level: Intro
status: Draft, November 2026
description: Second lecture of NI-PSD: a short intro to human-centred design, the design sprint and the five phases of design thinking, plus team forming and homework.
open: ./
open_label: Open the slides
---

# NI-PSD: Human-centred design and design thinking

A Markdown slide deck, 17 slides, converted from the older Google Slides lecture: the lecture that introduces human-centred design (HCD) in NI-PSD (Public Service Design, FIT ČVUT): the students' experience with UX, the design sprint, the phases of design thinking (empathize, define, ideate, prototype, validate), team forming and homework.

Language of the materials: English.

## What is here

| Path | What it is |
| --- | --- |
| `README.md` | This page |
| `index.html` | Starts the deck on the shared engine |
| `deck.md` | The slides, one Markdown file; speaker notes in `::: notes` |

## Using it

Open the slides from the hub (the button above), or `lectures/hcd-design-thinking/` on the published site. Arrow keys move, `F` is fullscreen. Add `#presenter` to the address for the presenter view with notes, next slide and timer; it can open a second window for the projector. The page needs a web address (a local server or GitHub Pages), not a plain file.

## Editing it

All content is in `deck.md`. Slides are separated by a line with only `---`; speaker notes go in a `::: notes` block. See `shared/deck/README.md` for the format. After an edit run `python3 scripts/check.py` and open the page to check the slide count.

## Known limits

- Images are missing. The original slides rely on pictures and diagrams that could not be exported as text. Each such slide is kept in place with a short description in its speaker notes, so the order matches the original. Add the images to an `img/` folder (web size) and link them from `deck.md`.
- Some slides are repeats from animation steps in the original and are kept for fidelity.
- Third-party material was paraphrased or left out; check the notes before publishing a new version.
