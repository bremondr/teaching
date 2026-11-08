---
title: "30 circles"
type: template
category: Ideation exercise
tags: [ideation]
languages: [en, cs]
level: Intro
status: First version, Nov 2026
description: "A three-minute warm-up where people turn as many empty circles as they can into objects, followed by a debrief on assumed rules. An on-screen sheet with a timer and a print button, as interactive slides."
open: ./
open_label: Open the exercise
---
# 30 circles

An ideation exercise as an interactive set of slides, about 15 minutes with debrief. Use it as a warm-up in a lecture or workshop, or on its own. Author: Ondřej Brém.

Language of the materials: English and Czech (switch with the language button or the `L` key).

## What is here

| Path | What it is |
| --- | --- |
| `README.md` | This page |
| `index.html` | Runs the exercise by itself on the shared deck engine |
| `exercise.js` | The exercise as a deck module (the slides), for reuse in other decks |

Slides: A sheet of 30 circles (SVG), a 3:00 timer, a button that prints only the sheet, and the debrief slides: common drawings, "broken" rules, reflection questions.

## Using it standalone

Open `index.html` on the published site. Arrow keys or space move, `F` is fullscreen, `L` switches language. Add `#presenter` to the address for the presenter view with notes, next slide and a plan clock, and use its button to open the projector window. The page works from a web address; opening it as a file can block the module loading in some browsers.

## Embedding it in another deck

Add one slide entry to the host deck's slide list:

```js
{ id: "30-circles", include: "../../templates/30-circles/exercise.js" }
```

The path is relative to the host page (here a page two folders below the repo root). The exercise slides become part of the host deck: one timer, one set of keys, one projector window. Slide ids get the prefix `30-circles/`, for example `?s=30-circles/intro`. In a deck that only includes this item, the host must list `langs: ["en", "cs"]` to keep the Czech version.

As a fallback, an iframe of `index.html?embed=1` hides the controls (they show on hover); `?lang=cs` picks the language and `?s=<slide id>` the first slide.

## Editing it

All content is in `exercise.js`: each slide has `title`, `body` and `notes` as `{ en, cs }` pairs, or a `render(box, ctx)` function for the interactive ones. The file has no dependencies. After an edit open `index.html` from a local server, check both languages and the presenter view, and run `python3 scripts/check.py`.

## Credits and licence

Based on the 30 circles creativity challenge described in an article in Harvard Business Review ("Three creativity challenges from IDEO's leaders", https://hbr.org/2013/11/three-creativity-challenges-from-ideos-leaders). The legacy slides this item grew from were adapted from an Aalto Ventures Program slide deck and licensed under CC BY-NC 4.0; the slides here are newly written in own words, so keep that licence and credit in mind if you reuse the older slides.

## Known limits

- The pictures of the legacy Aalto slides (CC BY-NC 4.0) are shown as there: the circle sheet with the tick and cross, the example drawings that break the rules and the licence badge, in `assets/`, with the credit on the slide. Drawings by participants are not included.
- The timers beep at zero if the browser allows sound; there is no other alarm.
- Czech text is a first translation and should be read by a native speaker before use.
