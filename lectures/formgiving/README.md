---
title: Formgiving
type: lecture
category: Design
tags: [ux, prototyping, design-process, design-sprint]
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
| `assets/` | The pictures of the slides (WebP, web size), placed as on the original slides |
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

- The deck follows the 66 slides of the original in order, with its pictures placed as there. Left
  out: the empty slides. The three live Slido polls are callout questions to the room; a live word cloud filled in on
  phones is planned (issue #27).
  Videos are shown as their still picture with a link.
- The phase diagram (drawn with shapes in the original) is replaced by a simple table.
- The quote attribution and some external links were left out on purpose.
- English only.

## Picture credits

Credits are on the slides. Many pictures in the original deck are by others: product and press
photos, UI shots from design portfolios, AI images made with Midjourney, Unsplash photos (N.,
Artturi Jalli, Patrick Tomasso, Nicolas Hoizey, My Life Through A Lens), SpaceX photos, a rendering by
BIG, a photo from prazsketramvaje.cz, an image by The Mobile Spoon, screenshots of nngroup.com,
Google Maps and the HSL app, and a post on X by @ajtourville. Pictures without a credit on the slide
come from the original deck without a recorded source.
