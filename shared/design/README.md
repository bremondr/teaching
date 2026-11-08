# Design tokens

The one place to change the look of the shared pieces of the site: the deck engine and every page built
with it (lectures, workshops, exercises and the start pages). Colours and fonts are CSS variables in
`tokens.css`. Components never use a literal colour, so changing a value here changes every page.

| File | What it is |
| --- | --- |
| `tokens.css` | The tokens, with a light theme (the default) and a dark theme, and the fonts |
| `events.css` | Optional third look for a particular event. Not used unless asked for |
| `fonts/` | Bricolage Grotesque (headings) and Source Sans 3 (text) |

## Light and dark

Light is the default. Dark follows the visitor's system setting. To force one, put `data-theme="light"` or
`data-theme="dark"` on `<html>`; a deck does this from its address: `?theme=dark`. The slides themselves are always
dark teal (the `--stage` tokens); the theme changes the page around them.

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

The deck engine (`shared/deck/`) and everything built on it. The hub (`index.html`, `styles.css`), the README viewer
and `workshops/cook-a-game/` still have their own colours: cook-a-game's tokens carry the same values as the defaults here,
so the two look alike. Moving them onto these tokens is a separate step.
