---
title: Formgiving
type: lecture
category: Design
tags: [design, ux, human-centered-design, design-sprint, prototyping]
languages: [en]
level: Intro
status: Draft, November 2026
description: Introductory lecture on design as giving form to the future, user-centred design, the human-centred design process with its techniques, and the design sprint.
open: ./
open_label: Open the slides
---

# Formgiving

An introductory lecture for the MVT course by Ondřej Brém. It explains what design is, why bad
design happens, how a human-centred process (discover, define, ideate, prototype, test, refine)
prevents it, and how a design sprint compresses the process into a week. It ends with a short
build exercise. The slides are from 2023 (v2).

Language of the materials: English.

## What is here

| Path | What it is |
| --- | --- |
| `README.md` | This page |
| `index.html` | Opens the deck with the shared slide engine |
| `deck.md` | The slides, in Markdown, with speaker notes |
| `versions/2022-v1.md` | Outline of the first, shorter version from 2022 |

## Using it

Open `./` on the published site for the slides. Arrows move, `F` is fullscreen. Add `#presenter` to
the address for the presenter view with notes, next slide and timer. It needs a web address (a local
server or the published site), not a plain file.

## Editing it

All content is in `deck.md`: slides are separated by a line with `---`, speaker notes go in
`::: notes`. See `shared/deck/README.md` for the engine. Run `python3 scripts/check.py` after an edit.

## History

- **v1 (2022)**: a short outline of about a dozen slides, partly Czech, mostly titles. Kept as
  `versions/2022-v1.md`.
- **v2 (2023)**: the current deck. It adds the opening polls, forms of interface design, the
  "make it obvious" sequence, the three principles (empathy, iteration, collaboration), technique
  lists for every phase, and the design sprint with a build exercise. It drops the Czech testing
  and tools slides of v1.

## Known limits

- The deck is built from the text of the old slides only. Pictures, videos and polls were not
  carried over; each such slide has a placeholder and a note saying what it showed.
- The phase diagram and the sprint diagram are replaced by simple tables.
- Photo credits, a quote attribution and some external links were left out on purpose.
- Several slides are only a heading (they were picture slides). The last slides of the original
  are bare themes for the build exercise.
- English only.
