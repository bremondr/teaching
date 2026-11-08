---
title: "Devil's 8s"
type: template
category: Ideation exercise
tags: [ideation]
languages: [en, cs]
level: Intro
status: First version, Nov 2026
description: "Eight anti-solutions in eight minutes on a folded sheet of paper, to lose the fear of bad ideas. Challenge input, fold guide and timer."
open: ./
open_label: Open the exercise
---
# Devil's 8s

An ideation exercise as an interactive set of slides, 10 minutes plus 2 minutes of setup. Use it as a warm-up in a lecture or workshop, or on its own. Author: Ondřej Brém.

Language of the materials: English and Czech (switch with the language button or the `L` key).

## What is here

| Path | What it is |
| --- | --- |
| `README.md` | This page |
| `index.html` | Runs the exercise by itself on the shared deck engine |
| `exercise.js` | The exercise as a deck module (the slides), for reuse in other decks |

Slides: Anti-solution concept, a slide where you type the challenge, a diagram of the folded sheet, an 8:00 timer that shows the challenge again, and the discussion slide.

## Using it standalone

Open `index.html` on the published site. Arrow keys or space move, `F` is fullscreen, `L` switches language. Add `#presenter` to the address for the presenter view with notes, next slide and a plan clock, and use its button to open the projector window. The page works from a web address; opening it as a file can block the module loading in some browsers.

## Embedding it in another deck

Add one slide entry to the host deck's slide list:

```js
{ id: "devils-8s", include: "../../templates/devils-8s/exercise.js" }
```

The path is relative to the host page (here a page two folders below the repo root). The exercise slides become part of the host deck: one timer, one set of keys, one projector window. Slide ids get the prefix `devils-8s/`, for example `?s=devils-8s/intro`. In a deck that only includes this item, the host must list `langs: ["en", "cs"]` to keep the Czech version.

As a fallback, an iframe of `index.html?embed=1` hides the controls (they show on hover); `?lang=cs` picks the language and `?s=<slide id>` the first slide.

## Editing it

All content is in `exercise.js`: each slide has `title`, `body` and `notes` as `{ en, cs }` pairs, or a `render(box, ctx)` function for the interactive ones. The file has no dependencies. After an edit open `index.html` from a local server, check both languages and the presenter view, and run `python3 scripts/check.py`.

## Credits and licence

Written from a short exercise card written for a Design Sprint; the card names no author. It resembles the well-known eight-panel folded-paper sketching format and the anti-solution (reverse brainstorming) technique; the text here is new.

## Known limits

- The legacy material had pictures that are not reproduced; where useful, the speaker notes say so. Drawings by participants are not included.
- The timers beep at zero if the browser allows sound; there is no other alarm.
- Czech text is a first translation and should be read by a native speaker before use.
