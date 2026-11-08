# Shared deck engine

One small engine for the lectures and workshops of this repo. It shows slides in a viewer, in a
presenter view (notes, next slide, timer, outline) and in a projector window that follows the
presenter. Plain scripts, no build step, works on GitHub Pages and from a file.

`workshops/cook-a-game/` still has its own copy of this kind of code. It moves over to this engine
after its first run.

## Files

| Path | What it is |
| --- | --- |
| `deck.js` | The engine and the Markdown slide parser |
| `deck.css` | Styles, all prefixed `dk-`. Colours are variables (`--dk-bg`, `--dk-accent` and so on) that an item can override |
| `example/` | A bilingual Markdown lecture, a JS workshop deck and a reusable exercise module |

Open `shared/deck/example/` in the published site to try it. Add `#presenter` to the address for
the presenter view.

## Using it

An item page loads the engine and starts a deck:

```html
<link rel="stylesheet" href="../../shared/deck/deck.css">
<div id="deck"></div>
<script src="../../assets/vendor/marked.min.js"></script>   <!-- only for Markdown -->
<script src="../../assets/vendor/purify.min.js"></script>
<script src="../../shared/deck/deck.js"></script>
<script>
  Deck.start({ title: "…", channel: "intro-to-ux", langs: ["en", "cs"], source: "deck.md" });
</script>
```

`channel` is a name that is unique per deck. The presenter and the slide window talk through it.

### Lectures: Markdown

One file, slides separated by a line with only `---`. A block `::: cs` … `:::` appears only in that
language, text outside a block appears in every language. Speaker notes go in `::: notes`
(or `::: notes cs`). Raw HTML works, with `dk-cols`, `dk-big`, `dk-center` and `dk-small` as helpers.

### Workshops and exercises: JS slides

For slides that must be interactive, pass objects instead of a file:

```js
Deck.start({ title: "…", channel: "…", langs: ["en"], slides: [
  { id: "welcome", min: 4, title: "Welcome", body: "<h1>…</h1>", notes: "<p>…</p>" },
  { id: "pick", min: 6, title: "Pick a team", render: (box, ctx) => { /* build into box */ } }
] });
```

`title`, `body` and `notes` may be a string, an object `{ en, cs }` or a function of the language.
`min` is the planned minutes; the presenter view shows how far ahead or behind the plan the clock is.
`render(box, ctx)` draws an interactive slide; `ctx` has `lang`, `mode` and `preview` (true in the
small next-slide preview, where nothing should start running). It may return a cleanup function.

### Reusing an exercise in another deck

An exercise is a file that calls `Deck.module({ id, title, slides: [...] })`. Any deck includes it
with one slide entry, `{ id: "warmup", include: "../../templates/30-circles/exercise.js" }`
(or a `.md` file). Its slides become part of the host deck, so the presenter keeps one timer,
one set of keys and one projector window. The exercise item can still be opened by itself.
An iframe is the fallback for something that cannot be a module; `?embed=1` hides the controls and
`?lang=cs` and `?s=<slide id>` choose the language and the first slide.

## Keys

Arrows, space and page keys move. Home and End jump. `F` is fullscreen, `L` switches language.
In the projector window the keys drive the presenter.

## Checking an edit

Open the example pages from a local server or the published site and check the three views.
`python3 scripts/check.py` must pass as for every commit.
