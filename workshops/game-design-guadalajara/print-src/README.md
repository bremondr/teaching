# Print kit sources

The PDFs in `../print/` are built from the files in this folder. Change a card here, run one
command, and the PDFs come out again. A rebuild of the current sources gives pages that are
pixel for pixel the same as the PDFs in `../print/` (checked on 2026-11-07).

## Rebuild

```
python3 workshops/game-design-guadalajara/print-src/build_print.py
```

It writes the seven single PDFs and `print-kit-all.pdf` into `../print/`. To try a change
without touching those files, give it another folder: `build_print.py --dest /tmp/kit`.

You need:

- Python 3 (standard library only).
- Node with Playwright and its Chromium (`npm i playwright` and `npx playwright install chromium`,
  or any setup where `require("playwright")` works).
- `pdfunite` and `pdfinfo` from poppler-utils.
- The fonts Carlito, Liberation Sans and Noto Color Emoji. With other fonts the text wraps a
  little differently, so check every page before printing.

## What is where

| File | What it makes |
| --- | --- |
| `deck.json` | The 64 ingredient cards: English and Spanish text, the one-line examples of the mechanics, and the pairs of cards that do not go together. The order in each list is the numbering on the cards. |
| `build_print.py` | The layout of the deck (A4, 10 cards per page, Spanish upside down), the idea card, the team slips, the cover page, and the merge into one file. |
| `rules_cards.py` | The rules cards (A6 first version, A5 final version) and the filled-in examples (the game The Mind). |
| `render.js` | HTML to PDF with Chromium. |
| `out/` | Working files (HTML and PDFs). Not in git. |

## The merged file

`print-kit-all.pdf` has a cover page that says what to print, then the deck (7 pages), the team
slips (2), the idea card (1), the A6 rules cards (2), the A5 rules cards (4), and the two examples
(1 and 1, optional). The page numbers on the cover are worked out from the real page counts, so
they stay right when a part grows.

## Changing things

- A card text or a collision note: edit `deck.json`, rebuild. A collision is a pair of English
  card names; the build turns it into the small `≠` notes with the card codes and fails if a name
  does not exist.
- The twist texts also appear in `../content.js` (the facilitator app). The build warns if the two
  lists differ, so change both.
- Team names and pictures for the slips are in `TEAMS` in `build_print.py`; the facilitator app has
  its own `TEAMS` in `../content.js`. Keep them the same.
- The colours of the card types (blue, orange, slate, violet) are `.kM`, `.kG`, `.kL`, `.kT` in
  `DECK_CSS`. They match the colour system in the workshop README and on the slides; change all
  three places together.
- After any change, open `print-kit-all.pdf` and look at every page. Print one page first at
  100 percent.
