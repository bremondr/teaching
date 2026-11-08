---
title: NI-PSD: Usability testing
type: lecture
category: Research and validation
tags: [ni-psd, usability-testing, user-interviews, validation]
languages: [en]
level: Intro
status: Draft, November 2026
description: Lecture on testing prototypes with users in NI-PSD: ways to test, preparing a test, dos and don'ts, the five-act interview, group note-taking and debrief.
open: ./
open_label: Open the slides
---

# NI-PSD: Usability testing

A Markdown slide deck, 19 slides, converted from the older Google Slides lecture: the lecture on testing in NI-PSD (Public Service Design, FIT ČVUT): an overview of ways to test, preparing a test with a story, dos and don'ts for the facilitator, the five-act interview, taking notes as a group on a whiteboard grid and the debrief. It follows the interview approach of a design sprint.

Language of the materials: English.

## What is here

| Path | What it is |
| --- | --- |
| `README.md` | This page |
| `index.html` | Starts the deck on the shared engine |
| `deck.md` | The slides, one Markdown file; speaker notes in `::: notes` |

## Using it

Open the slides from the hub (the button above), or `lectures/usability-testing/` on the published site. Arrow keys move, `F` is fullscreen. Add `#presenter` to the address for the presenter view with notes, next slide and timer; it can open a second window for the projector. The page needs a web address (a local server or GitHub Pages), not a plain file.

## Editing it

All content is in `deck.md`. Slides are separated by a line with only `---`; speaker notes go in a `::: notes` block. See `shared/deck/README.md` for the format. After an edit run `python3 scripts/check.py` and open the page to check the slide count.

## Known limits

- Images are missing. The original slides rely on pictures and diagrams that could not be exported as text. Each such slide is kept in place with a short description in its speaker notes, so the order matches the original. Add the images to an `img/` folder (web size) and link them from `deck.md`.
- Some slides are repeats from animation steps in the original and are kept for fidelity.
- Third-party material was paraphrased or left out; check the notes before publishing a new version.
