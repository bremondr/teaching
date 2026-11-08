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
| `deck.css` | Styles, all prefixed `dk-`. The look is the one of `workshops/cook-a-game` (same tokens, pill buttons, cards, dark teal stage with yellow accents, light and dark page themes). Tokens such as `--ink`, `--stage` and `--stage-hi` can be overridden on `:root` by an item |
| `fonts/` | Bricolage Grotesque and Source Sans 3, loaded by `deck.css` |
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

The controls row has an **Exit** button. By default it leads to the hub; `exit: "some/path/"` sends it somewhere else (the Design Sprint workshop returns to its version picker) and `exit: false` removes it. Embedded decks (`?embed=1`) and the projector window have no Exit.

### Lectures: Markdown

One file, slides separated by a line with only `---`. A block `::: cs` … `:::` appears only in that
language, text outside a block appears in every language. Speaker notes go in `::: notes`
(or `::: notes cs`). A block `::: kicker` … `:::` is the small yellow label above the slide, usually the section name. Raw HTML works, with `dk-cols`, `dk-big`, `dk-center` and `dk-small` as helpers.

### Workshops and exercises: JS slides

For slides that must be interactive, pass objects instead of a file:

```js
Deck.start({ title: "…", channel: "…", langs: ["en"], slides: [
  { id: "welcome", min: 4, title: "Welcome", body: "<h1>…</h1>", notes: "<p>…</p>" },
  { id: "pick", min: 6, title: "Pick a team", render: (box, ctx) => { /* build into box */ } }
] });
```

`title`, `body`, `notes` and `kicker` may be a string, an object `{ en, cs }` or a function of the language.
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

## Pictures

Pictures of an item live in its own `assets/` folder, web size only: WebP, at most 1600 px on the long side, no
location or camera data. Every picture has alt text; a credit goes on the slide when the picture is not mine.

**In the text flow.** A plain `![alt](assets/x.webp)` works; it is limited to 440 px in height. For a caption use a
figure: `<figure class="dk-fig"><img src="assets/x.webp" alt="…"><figcaption>…</figcaption></figure>`.

**As on the original slide.** A picture layer keeps the layout of a slide that was built in PowerPoint or Google Slides:

```html
<div class="dk-canvas" data-pad="58 560 56 64"><figure class="dk-pic" style="left:59%;top:0%;width:41%;height:100%"><img src="assets/x.webp" alt="…"></figure><p class="dk-credit">Poster: …</p></div>
```

- The layer covers the whole 1280 by 720 slide, margins included, and is not shrunk by the fitting described below.
  Each `figure.dk-pic` is placed in percent of the slide. The picture fills its box; a cropped picture has an `img`
  that is larger than the box and shifted (`style="left:-10%;top:0;width:125%;height:100%"`). Add `dk-contain`
  to the figure to letterbox the picture instead.
- The text of the slide is drawn above the layer. `data-pad` (top, right, bottom, left, in slide pixels) moves the
  text area away from the pictures, so the fitting keeps the text in the free part. `dk-front` on the layer draws it
  above the text.
- `<div class="dk-shade" style="left:%;top:%;width:%;height:%"></div>` inside the layer, after the pictures, lays a
  half-transparent panel in the slide colour under text that sits on a photo, so the text stays readable in both looks.
- `data-onpic` on the layer gives each text block of the slide its own half-transparent backing, for a title that sits on
  a picture. `dk-paper` on a figure puts a white sheet behind a picture with a transparent background and dark lines.
- `p.dk-credit` puts a small credit in the bottom right corner. A link around the `img` (for a video that the
  original linked) stays clickable.
- Keep the layer on one line in Markdown (a blank line ends an HTML block), inside the `::: en` or `::: cs` block
  when the alt text differs per language.
- After adding pictures run `node scripts/audit_slides.js` on the item: the engine measures a slide again when a picture
  in the text flow loads.

## Slides that hold too much

A slide is 1280 by 720 with margins (64 px at the sides, 58 px on top, 56 px at the bottom). After drawing each slide the engine
measures its content and, when it does not fit, scales it down in 5% steps, widening it as it shrinks so the text reflows, until it
sits inside the margins. It never goes below 55%: a slide that still does not fit gets `data-overflow="1"` on its `.dk-inner`
and a console warning, and should be split in two. A slide that had to go below 80% is hard to read from the back of a room,
so split it as well.

`node scripts/audit_slides.js` checks every deck of the repo (every language, every slide) and lists the slides that do not fit
(exit code 1) and the ones the engine had to shrink a lot. Run it after adding or changing a deck. It needs Playwright, and it
serves the pages under a faked address, so it also works where github.io cannot be reached. An address part narrows it:
`node scripts/audit_slides.js lectures/formgiving`.

## Keys

Arrows, space and page keys move. Home and End jump. `F` is fullscreen, `L` switches language.
In the projector window the keys drive the presenter.

## Checking an edit

Open the example pages from a local server or the published site and check the three views.
`python3 scripts/check.py` must pass as for every commit.
