---
title: "Draw an alien"
type: template
category: Ideation exercise
tags: [ideation, sketching]
languages: [en, cs]
level: Intro
status: First version, Nov 2026
description: "Five minutes to draw an alien, then a comparison of the drawings that shows how new ideas combine old ones. Timer and a count-the-room slide."
open: ./
open_label: Open the exercise
---
# Draw an alien

An ideation exercise as an interactive set of slides, about 15 minutes. Use it as a warm-up in a lecture or workshop, or on its own. Author: Ondřej Brém.

Language of the materials: English and Czech (switch with the language button or the `L` key).

## What is here

| Path | What it is |
| --- | --- |
| `README.md` | This page |
| `index.html` | Runs the exercise by itself on the shared deck engine |
| `exercise.js` | The exercise as a deck module (the slides), for reuse in other decks |

Slides: Instructions, a 5:00 timer, a comparison slide, a count-the-room slide (plus and minus buttons, with the figures reported in the source for comparison) and the point of the exercise.

## Using it standalone

Open `index.html` on the published site. Arrow keys or space move, `F` is fullscreen, `L` switches language. Add `#presenter` to the address for the presenter view with notes, next slide and a plan clock, and use its button to open the projector window. The page works from a web address; opening it as a file can block the module loading in some browsers.

## Embedding it in another deck

Add one slide entry to the host deck's slide list:

```js
{ id: "draw-alien", include: "../../templates/draw-alien/exercise.js" }
```

The path is relative to the host page (here a page two folders below the repo root). The exercise slides become part of the host deck: one timer, one set of keys, one projector window. Slide ids get the prefix `draw-alien/`, for example `?s=draw-alien/intro`. In a deck that only includes this item, the host must list `langs: ["en", "cs"]` to keep the Czech version.

As a fallback, an iframe of `index.html?embed=1` hides the controls (they show on hover); `?lang=cs` picks the language and `?s=<slide id>` the first slide.

## Editing it

All content is in `exercise.js`: each slide has `title`, `body` and `notes` as `{ en, cs }` pairs, or a `render(box, ctx)` function for the interactive ones. The file has no dependencies. After an edit open `index.html` from a local server, check both languages and the presenter view, and run `python3 scripts/check.py`.

## Credits and licence

Based on the draw-an-alien exercise from creativity research by Kozbelt and Durmysheva, as credited on the legacy slides (Aalto University material, CC BY-NC 4.0); the slides here are newly written in own words. The legacy slides cite the paper as 2011 while the DOI they link to (10.1002/j.2162-6057.2007.tb01072.x) looks like a 2007 paper, so check the reference before quoting it. The percentages on the count slide (eyes, legs, nose) are those reported on the legacy slides.

## Known limits

- The pictures of the legacy Aalto slides (CC BY-NC 4.0) are shown as there: two typical alien drawings and the licence badge, in `assets/`, with the credit on the slide. Drawings by participants are not included.
- The timers beep at zero if the browser allows sound; there is no other alarm.
- Czech text is a first translation and should be read by a native speaker before use.
