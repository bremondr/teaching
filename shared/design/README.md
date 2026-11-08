# Design tokens

The one place to change the look of the whole site: the homepage, the README viewer, the deck engine and every
page built with it (lectures, workshops, exercises and start pages). Colours and fonts are CSS variables in
`tokens.css`. Components never use a literal colour, so changing a value here changes every page. The palette is the
ink-teal and magenta one of `workshops/cook-a-game`.

| File | What it is |
| --- | --- |
| `tokens.css` | The tokens, with a light theme (the default) and a dark theme, and the fonts |
| `events.css` | Optional third look for a particular event. Not used unless asked for |
| `theme.js` | Applies the saved light or dark choice on the pages that are not decks (homepage, README viewer) and fills their "Page" button |
| `fonts/` | Bricolage Grotesque (headings) and Source Sans 3 (text) |

## Light and dark, for the page and for the slides separately

There are two separate choices, and a visitor can combine them freely:

- **The page** (`data-theme` on `<html>`): light is the default, dark follows the visitor's system setting. Every page has a
  "Page: light / dark" button (in a deck it is in the controls row), and the choice is saved in the browser under `deck-theme`,
  so it follows you across the homepage, the README viewer and all decks. `?theme=dark` in the address wins over the saved choice.
- **The slides** (`data-slides` on `<html>`): dark teal is the default, `light` gives light slides. A deck has a
  "Slides: dark / light" button next to the page button; it is saved under `deck-slides` and `?slides=light` in the address wins.
  The presenter's choice is sent to the projector window as well. On light slides the yellow highlight is replaced by the magenta,
  because yellow cannot be read on white (`--stage-hi`), and `--stage-bad` turns darker red.

The light-slide values are the last block of `tokens.css`. It has to stay last, so it wins over the dark blocks above it.

## Changing a colour or a font

Edit the value in `tokens.css`. A colour exists in three places (light, dark in the system-dark block, and dark when
forced). Change it in each so light and dark do not drift apart. The tokens:

| Token | Used for |
| --- | --- |
| `--bg`, `--surface`, `--line` | page, cards and buttons, borders |
| `--fg`, `--muted` | text, secondary text |
| `--ink` | the main accent: selected buttons, headings, focus ring |
| `--accent`, `--accent-soft`, `--accent-fg` | the second accent: highlights and soft backgrounds |
| `--ok`, `--warn` | good and bad states (clock ahead or behind) |
| `--stage`, `--stage-fg`, `--stage-dim`, `--stage-hi` | the slide: background, text, secondary text, yellow highlights |
| `--font-display`, `--font-body` | headings, text |

## An event theme (optional)

A talk or an event can have its own look without touching anything else:

1. In `events.css` copy the `sample` pair of blocks, rename it (`guadalajara-2026`) and change only the tokens you want.
2. Open a deck with `?event=guadalajara-2026` (add it to every address the audience gets, or set
   `data-event="guadalajara-2026"` on `<html>` of an item page to make it permanent for that item).
3. Remove the blocks when the event is over. Nothing else refers to them.

An event theme works in light and dark: the first block of a pair is its light look, the other two its dark look.

## Who uses it

The homepage (`index.html`, `styles.css`), the README viewer (`readme.html`, `assets/readme.css`), the deck engine
(`shared/deck/`) and everything built on it. `workshops/cook-a-game/` still has its own copy of the same tokens, with the same
values, so it looks the same; it moves onto this file after its first run.
