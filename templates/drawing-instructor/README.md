---
title: "Drawing instructor"
type: template
category: Ideation exercise
tags: [ideation, sketching]
languages: [en, cs]
level: Intro
status: First version, Nov 2026
description: "A 15-minute ice breaker: one person describes a picture using only geometric shapes and the others draw it. Shows the value of feedback and shared terms."
open: ./
open_label: Open the exercise
---
# Drawing instructor

An ideation exercise as an interactive set of slides, 15 minutes. Use it as a warm-up in a lecture or workshop, or on its own. Author: Ondřej Brém.

Language of the materials: English and Czech (switch with the language button or the `L` key).

## What is here

| Path | What it is |
| --- | --- |
| `README.md` | This page |
| `index.html` | Runs the exercise by itself on the shared deck engine |
| `exercise.js` | The exercise as a deck module (the slides), for reuse in other decks |

Slides: Why and supplies, rules, a facilitator-only slide with three example pictures (hidden until you press Show), round 1 and round 2 timers, a comparison slide and reflection questions.

## Using it standalone

Open `index.html` on the published site. Arrow keys or space move, `F` is fullscreen, `L` switches language. Add `#presenter` to the address for the presenter view with notes, next slide and a plan clock, and use its button to open the projector window. The page works from a web address; opening it as a file can block the module loading in some browsers.

## Embedding it in another deck

Add one slide entry to the host deck's slide list:

```js
{ id: "drawing-instructor", include: "../../templates/drawing-instructor/exercise.js" }
```

The path is relative to the host page (here a page two folders below the repo root). The exercise slides become part of the host deck: one timer, one set of keys, one projector window. Slide ids get the prefix `drawing-instructor/`, for example `?s=drawing-instructor/intro`. In a deck that only includes this item, the host must list `langs: ["en", "cs"]` to keep the Czech version.

As a fallback, an iframe of `index.html?embed=1` hides the controls (they show on hover); `?lang=cs` picks the language and `?s=<slide id>` the first slide.

## Editing it

All content is in `exercise.js`: each slide has `title`, `body` and `notes` as `{ en, cs }` pairs, or a `render(box, ctx)` function for the interactive ones. The file has no dependencies. After an edit open `index.html` from a local server, check both languages and the presenter view, and run `python3 scripts/check.py`.

## Credits and licence

Written from a short exercise card written for a Design Sprint; the card names no author. Verbal-instruction drawing games are widely known; the text and example pictures here are new.

## Known limits

- The legacy material had pictures that are not reproduced; where useful, the speaker notes say so. Drawings by participants are not included.
- The timers beep at zero if the browser allows sound; there is no other alarm.
- Czech text is a first translation and should be read by a native speaker before use.
