---
title: Introduction to UX
type: lecture
category: UX
tags: [ux, user-research, prototyping, design-process, usability-testing]
languages: [en, cs]
level: Intro
status: Draft, November 2026
description: Introductory lecture on what UX is, how designers work (understand, define, sketch, decide, prototype, validate), a worst-UI challenge and an air-conditioning prototype exercise. One bilingual deck.
open: ./
open_label: Open the slides
---

# Introduction to UX

An introductory lecture for students: an experience warm-up, what UX is, the design
process with a method for each step, a short "worst UI" challenge, bonus topics and the brief for a
60-minute prototyping exercise. One deck, English and Czech in the same file.

Language of the materials: English and Czech (switch with `L`).

## What is here

| Path | What it is |
| --- | --- |
| `README.md` | This page |
| `index.html` | Opens the deck with the shared slide engine |
| `deck.md` | The slides, Markdown, `::: en` and `::: cs` blocks and `::: notes` |
| `assets/` | The pictures of the slides (WebP, web size), placed as on the original slides |
| `versions/2024-mvt-ui-ux.md` | Outline of the older 2024 deck, kept for reference |

## Using it

Open the page (`./`) from the published site or any local web server. Add `#presenter` to the address
for the presenter view with notes, next slide and timer; it can open a projector window that follows.
Keys: arrows, space and page keys move, `Home` and `End` jump, `F` is fullscreen, `L` switches
language. See `shared/deck/README.md`.

## Editing it

All content is in `deck.md`; slides are separated by a line with only `---`. Text in `::: en` or
`::: cs` blocks shows in that language only, text outside blocks in both. Speaker notes go in
`::: notes en` and `::: notes cs`. After an edit run `python3 scripts/check.py` and open the page
in both languages.

## History

- 2024-11, "UI & UX" for MVT: a picture-led deck with UI and UX examples, the ten usability
  heuristics, Gestalt and service design. Outline in `versions/2024-mvt-ui-ux.md`. Its pictures were
  not kept.
- 2025-11, Czech deck "Uvod do UX": the base of the current structure.
- 2026-01, English deck: the same structure; the last three sections were still in Czech.
- 2026-11: both merged into this deck. The English text of the Czech-only slides is a translation.

## Known limits

- The six hidden slides of the original (zoomed views of three artifacts, a cookie banner, a printed
  programme leaflet and a login notice) are not included.
- Quotes of experts are paraphrased and should be checked against the sources.
- Links of "Where to next?" and the worst-UI examples were not copied; only names are listed.
- No PDF export yet.

## Picture credits

The pictures are taken over from the original decks and placed as they were there. Most artifact
photos and screenshots were made by the author. Pictures by others carry a credit on the slide:

- Screenshots of electrek.co (cookie consent), Netflix (skip intro), Airbnb (one via Mobbin),
  an online shoe shop and cppreference.com, shown as examples to discuss.
- Braille handrail photo: from a LinkedIn post by Stuart Bernstein.
- The steering wheel with the digital dashboard: source not recorded in the original deck.
- Poster "Jakob's Ten Usability Heuristics": Nielsen Norman Group.
- Scales icon: Getty Images.
