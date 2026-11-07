#!/usr/bin/env python3
"""Builds the print kit of the "Cook a game" workshop.

    python3 print-src/build_print.py                 # writes the PDFs into ../print/
    python3 print-src/build_print.py --dest /tmp/x   # writes them somewhere else (to compare)

What it does:
  1. writes one HTML file per PDF into print-src/out/ (ignored by git);
  2. renders each HTML file to an A4 PDF with Chromium (render.js, Playwright);
  3. builds a cover page that lists what to print, with page numbers;
  4. merges cover + all PDFs into print-kit-all.pdf (pdfunite from poppler-utils).

Sources: deck.json (the ingredient cards), rules_cards.py (rules cards and their examples),
this file (deck layout, idea card, team slips, cover). Needs: Python 3, Node with Playwright and
Chromium, poppler-utils, and the fonts Carlito, Liberation Sans and Noto Color Emoji.
"""
import argparse
import html
import json
import re
import shutil
import subprocess
import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
OUT = HERE / "out"
sys.path.insert(0, str(HERE))
import rules_cards  # noqa: E402


# ---------------------------------------------------------------- deck cards
SHAPES = {
    "M": '<circle cx="10" cy="10" r="8"/>',
    "G": '<polygon points="10,1 12.6,7.2 19.3,7.7 14.2,12 15.8,18.6 10,15 4.2,18.6 5.8,12 0.7,7.7 7.4,7.2"/>',
    "L": '<rect x="2" y="2" width="16" height="16"/>',
    "T": '<polygon points="10,1.5 19,18 1,18"/>',
}
KEYS = {"M": "mechanics", "G": "goals", "L": "limits", "T": "twists"}


def load_deck():
    data = json.loads((HERE / "deck.json").read_text(encoding="utf-8"))
    cards = []
    for letter, key in KEYS.items():
        for n, item in enumerate(data[key], 1):
            cards.append({
                "code": f"{letter}{n}", "L": letter,
                "kind": (data["kinds"][letter]["en"], data["kinds"][letter]["es"]),
                "en": item["en"], "es": item["es"],
                "exen": item.get("example_en", ""), "exes": item.get("example_es", ""),
            })
    by_name = {c["en"]: c["code"] for c in cards}
    if len(by_name) != len(cards):
        raise SystemExit("deck.json: two cards have the same English name")
    pairs = []
    for a, b in data["collisions"]:
        if a not in by_name or b not in by_name:
            raise SystemExit(f"deck.json: collision names a card that does not exist: {a!r} / {b!r}")
        pairs.append((by_name[a], by_name[b]))

    def order(code):
        return (" MGLT".index(code[0]), int(code[1:]))

    for c in cards:
        others = [b if a == c["code"] else a for a, b in pairs if c["code"] in (a, b)]
        c["col"] = sorted(others, key=order)
    return cards


def check_twists_in_app(cards):
    """The twist texts also live in ../content.js (TW). Warn if the two lists differ."""
    path = HERE.parent / "content.js"
    if not path.is_file():
        return
    app = re.findall(r'\["T(\d+)","([^"]+)","([^"]+)"\]', path.read_text(encoding="utf-8"))
    deck = [c for c in cards if c["L"] == "T"]
    if len(app) != len(deck):
        print(f"WARNING: content.js has {len(app)} twists, deck.json has {len(deck)}", file=sys.stderr)
    for (n, en, es), c in zip(app, deck):
        if (en, es) != (c["en"], c["es"]):
            print(f"WARNING: twist T{n} differs between content.js and deck.json: {en!r} / {c['en']!r}", file=sys.stderr)


def font_size(text, has_example):
    n = len(text)
    size = 18 if n <= 18 else 15 if n <= 30 else 13 if n <= 45 else 12
    return size - (1 if has_example else 0)


def half(text, example, cls):
    ex = f'<div class="ex">{html.escape(example)}</div>' if example else ""
    return (f'<div class="half {cls}"><div class="in"><div class="t" style="font-size:{font_size(text, bool(example))}pt">'
            f'{html.escape(text)}</div>{ex}</div></div>')


def deck_card(c):
    notes = ("≠ " + " · ".join(c["col"])) if c["col"] else ""
    return (f'<div class="card k{c["L"]}">{half(c["es"], c["exes"], "es")}<div class="band">'
            f'<svg viewBox="0 0 20 20" class="shape">{SHAPES[c["L"]]}</svg><b class="code">{c["code"]}</b>'
            f'<span class="kind">{c["kind"][0]} · {c["kind"][1]}</span><span class="col">{notes}</span></div>'
            f'{half(c["en"], c["exen"], "en")}</div>')


def cut_marks(columns_x, rows_y, left, right, top, bottom, gap=1.5, length=3.5, bottom_length=None):
    bottom_length = length if bottom_length is None else bottom_length
    lines = []
    for x in columns_x:
        lines.append(f'<line x1="{x}" y1="{top - gap}" x2="{x}" y2="{top - gap - length}"/>'
                     f'<line x1="{x}" y1="{bottom + gap}" x2="{x}" y2="{bottom + gap + bottom_length}"/>')
    for y in rows_y:
        lines.append(f'<line x1="{left - gap}" y1="{y}" x2="{left - gap - length}" y2="{y}"/>'
                     f'<line x1="{right + gap}" y1="{y}" x2="{right + gap + length}" y2="{y}"/>')
    return '<svg class="marks" viewBox="0 0 210 297" width="210mm" height="297mm">' + "".join(lines) + "</svg>"


DECK_CSS = '''
@page{size:A4;margin:0}
*{box-sizing:border-box}
body{margin:0;font-family:"Carlito","Liberation Sans",sans-serif;color:#14202a}
.page{width:210mm;height:297mm;padding:11mm 15mm 0 15mm;position:relative;page-break-after:always;overflow:hidden}
.grid{display:grid;grid-template-columns:repeat(2,90mm);grid-auto-rows:55mm}
.card{width:90mm;height:55mm;border:1mm solid var(--c);display:flex;flex-direction:column;background:#fff;outline:.1mm solid #888;outline-offset:-.1mm}
.kM{--c:#1e66d0;--f:#fff}.kG{--c:#e65100;--f:#fff}.kL{--c:#37474f;--f:#fff}.kT{--c:#6a3fb5;--f:#fff}
.half{flex:1;display:flex;align-items:center;justify-content:center;padding:0 5mm;text-align:center}
.half.es .in{transform:rotate(180deg)}
.t{font-weight:700;line-height:1.1}
.ex{font-size:8pt;line-height:1.15;margin-top:1.2mm;color:#4a5a66;font-style:italic}
.es .t{color:var(--c)}
.band{height:7mm;background:var(--c);color:var(--f);display:flex;align-items:center;gap:2mm;padding:0 2.5mm;font-size:6.5pt}
.band .shape{width:4mm;height:4mm;fill:var(--f);flex:none}
.code{font-size:10pt;letter-spacing:.2pt}
.kind{letter-spacing:.5pt;font-size:6pt;opacity:.95}
.col{margin-left:auto;font-size:6.5pt;font-weight:700}
.marks{position:absolute;left:0;top:0;stroke:#000;stroke-width:.2;fill:none}
.legend{position:absolute;left:21mm;right:21mm;bottom:2.5mm;font-size:6.5pt;color:#555;display:flex;justify-content:space-between}
'''


def deck_html(cards):
    pages = [cards[i:i + 10] for i in range(0, len(cards), 10)]
    body = ""
    for i, page in enumerate(pages, 1):
        rows = -(-len(page) // 2)
        marks = cut_marks([15, 105, 195], [11 + 55 * r for r in range(rows + 1)], 15, 195, 11, 11 + 55 * rows, bottom_length=3)
        body += (f'<div class="page">{marks}<div class="grid">{"".join(deck_card(c) for c in page)}</div>'
                 f'<div class="legend"><span>● M mechanic · ★ G goal · ■ L limit · ▲ T twist &nbsp; ≠ does not go with this card</span>'
                 f'<span>Cook a game · {i}/{len(pages)}</span></div></div>')
    return f'<!doctype html><meta charset="utf-8"><title>Cook a game cards</title><style>{DECK_CSS}</style>{body}'


# ---------------------------------------------------------------- idea card
def idea_html():
    def row(en, es, col="#14202a"):
        return (f'<div class="r"><div class="l"><b>{en}</b> <i>/ {es}</i></div>'
                f'<div class="ln" style="border-bottom:.7mm solid {col}"></div></div>')

    card = f'''<div class="card">
<div class="top"><div class="ttl">IDEA CARD <i>/ CARTA DE IDEA</i></div><div class="team">Team / Equipo<span></span></div></div>
<div class="s">In this game, <i>/ En este juego,</i></div>
{row("who plays (Audience)", "quién juega (Público)", "#ec407a")}
{row("what they do (Mechanic)", "qué hacen (Mecánica)", "#1e66d0")}
<div class="s">to <i>/ para</i></div>
{row("the goal (Goal)", "el objetivo (Meta)", "#e65100")}
<div class="s">in <i>/ en</i> &nbsp; <span class="sm">and with <i>/ y con</i></span></div>
<div class="two">{row("a setting (Setting)", "un escenario (Escenario)", "#f2c200")}{row("a thing (Thing)", "un objeto (Objeto)", "#43a047")}</div>
<div class="foot">Write in English <i>/ Escribe en inglés</i> · Say it in 10 seconds <i>/ Dilo en 10 segundos</i></div>
</div>'''
    css = '''
@page{size:A4;margin:0}*{box-sizing:border-box}
body{margin:0;font-family:"Carlito","Liberation Sans",sans-serif;color:#14202a}
.page{width:210mm;height:297mm;padding:11mm 15mm 0 15mm;position:relative;overflow:hidden}
.grid{display:grid;grid-template-columns:repeat(2,90mm);grid-auto-rows:55mm}
.marks{position:absolute;left:0;top:0;stroke:#000;stroke-width:.2;fill:none}
.card{width:90mm;height:55mm;border:1mm solid #2f4550;outline:.1mm solid #888;outline-offset:-.1mm;padding:2mm 3.5mm;display:flex;flex-direction:column;font-size:8pt}
.top{display:flex;justify-content:space-between;align-items:flex-start}
.ttl{font-size:10pt;font-weight:700;letter-spacing:.6pt;color:#2f4550}.ttl i{font-weight:400;font-size:7pt;color:#556;letter-spacing:0}
.team{font-size:6pt;font-weight:700;text-align:right}.team span{display:block;width:20mm;border-bottom:.25mm solid #14202a;height:3.5mm}
.s{font-size:8.5pt;font-weight:700;margin-top:1mm;color:#2f4550}.s i{font-weight:400;color:#556;font-size:7pt}.sm{font-size:8.5pt;font-weight:700;margin-left:auto}
.r{margin-top:.2mm}.l{font-size:6pt;line-height:1.1}.l i{color:#556}
.ln{border-bottom:.25mm solid #14202a;height:4.2mm}
.two{display:grid;grid-template-columns:1fr 1fr;gap:3mm}
.foot{margin-top:auto;font-size:6pt;color:#33444d;border-top:.2mm solid #2f4550;padding-top:.6mm;text-align:center}
'''
    marks = cut_marks([15, 105, 195], [11 + 55 * i for i in range(6)], 15, 195, 11, 286, gap=1.5, length=3.5)
    return (f'<!doctype html><meta charset="utf-8"><title>Idea card</title><style>{css}</style>'
            f'<div class="page">{marks}<div class="grid">{card * 10}</div></div>')


# ---------------------------------------------------------------- team slips
TEAMS = [("🌶️", "CHILI", "CHILE"), ("🥑", "AVOCADO", "AGUACATE"), ("🌽", "CORN", "MAÍZ"), ("🍅", "TOMATO", "TOMATE"),
         ("🥭", "MANGO", "MANGO"), ("🍍", "PINEAPPLE", "PIÑA"), ("🍌", "BANANA", "PLÁTANO"), ("🥕", "CARROT", "ZANAHORIA")]


def slips_html():
    def slip(t):
        return f'<div class="s"><div class="i">{t[0]}</div><div class="e">{t[1]}</div><div class="p">{t[2]}</div></div>'

    page1 = [slip(TEAMS[i // 6]) for i in range(36)]
    page2 = [slip(TEAMS[6 + i // 6]) for i in range(12)] + [slip(TEAMS[j]) for j in range(6) for _ in range(4)]
    css = '''@page{size:A4;margin:0}*{box-sizing:border-box}
body{margin:0;font-family:"Carlito","Liberation Sans","Noto Color Emoji",sans-serif}
.page{width:210mm;height:297mm;padding:22mm 15mm 0;position:relative;overflow:hidden;page-break-after:always}
.grid{display:grid;grid-template-columns:repeat(4,45mm);grid-auto-rows:28mm}
.s{outline:.1mm solid #888;outline-offset:-.1mm;display:flex;flex-direction:column;align-items:center;justify-content:center;border:.5mm solid #14202a;border-radius:0}
.i{font-size:32pt;line-height:1;font-family:"Noto Color Emoji",sans-serif}.e{font-size:12pt;font-weight:700;letter-spacing:.8pt;margin-top:1mm;line-height:1}.p{font-size:9pt;font-style:italic;color:#444}
.marks{position:absolute;left:0;top:0;stroke:#000;stroke-width:.2;fill:none}
.note{position:absolute;left:15mm;right:15mm;bottom:6mm;font-size:7pt;color:#555}'''
    marks = cut_marks([15 + 45 * i for i in range(5)], [22 + 28 * i for i in range(10)], 15, 195, 22, 275, gap=1.5, length=3.5)
    n1 = "Page 1: 6 slips each of the first six teams. Use the numbers on the slide: take as many slips of each team as it has students."
    n2 = "Page 2: 6 slips each of teams 7 and 8, and 4 spare slips of each of the first six teams, for late students."
    return (f'<!doctype html><meta charset="utf-8"><style>{css}</style>'
            f'<div class="page">{marks}<div class="grid">{"".join(page1)}</div><div class="note">{n1}</div></div>'
            f'<div class="page">{marks}<div class="grid">{"".join(page2)}</div><div class="note">{n2}</div></div>')


# ---------------------------------------------------------------- cover page
# name, pdf file name in print/, what, how many to print, note
PARTS = [
    ("deck", "deck-cards.pdf", "Ingredient cards (64 cards)", "1 set", "Cut out and sort into four piles by colour and shape. This set is yours; the students never see the twist pile."),
    ("slips", "team-slips.pdf", "Team slips (72 slips)", "1 set", "Cut out. Hand out one per student, as the team slide says."),
    ("idea", "idea-card.pdf", "Idea cards (10 cards)", "1 page", "One card per team."),
    ("rules-a6", "rules-card-a6.pdf", "Rules cards, first version, A6", "1 set", "8 cards. Cut along the dashed cross."),
    ("rules-a5", "rules-card-a5-final.pdf", "Rules cards, final version, A5", "1 set", "8 cards. Handed out when the twist is dealt. Cut along the dashed line."),
    ("ex-a6", "rules-card-example-a6.pdf", "Example: rules card A6", "optional", "To show on screen or on paper. A real game, The Mind."),
    ("ex-a5", "rules-card-example-a5.pdf", "Example: final rules card A5", "optional", "Same game, after a twist."),
]


def cover_html(counts):
    rows, start, required_end, optional_start = "", 2, 1, None
    for key, _, what, copies, note in PARTS:
        n = counts[key]
        pages = f"{start}" if n == 1 else f"{start}–{start + n - 1}"
        rows += f"<tr><td>{pages}</td><td><b>{what}</b></td><td>{copies}</td><td>{note}</td></tr>"
        if copies != "optional":
            required_end = start + n - 1
        elif optional_start is None:
            optional_start = start
        start += n
    css = '''@page{size:A4;margin:0}*{box-sizing:border-box}
body{margin:0;font-family:"Carlito","Liberation Sans",sans-serif;color:#14202a}
.page{width:210mm;height:297mm;padding:22mm 18mm;position:relative;overflow:hidden}
h1{font-size:26pt;margin:0 0 2mm;color:#2f4550}.sub{font-size:11pt;color:#556;margin:0 0 8mm}
h2{font-size:12pt;margin:8mm 0 3mm;color:#2f4550}
table{width:100%;border-collapse:collapse;font-size:10pt}
th,td{border-bottom:.3mm solid #cfd8dc;padding:2.4mm 2mm;text-align:left;vertical-align:top}
th{font-size:8pt;letter-spacing:.5pt;text-transform:uppercase;color:#556}
td:first-child{white-space:nowrap;font-weight:700;color:#2f4550}
ul{margin:0;padding-left:5mm;font-size:10pt;line-height:1.5}
.note{position:absolute;left:18mm;right:18mm;bottom:10mm;font-size:8pt;color:#667}'''
    return f'''<!doctype html><meta charset="utf-8"><style>{css}</style><div class="page">
<h1>Cook a game: print kit</h1><p class="sub">Game design workshop. This page is the cover of the one-file print kit. Print pages 2 to {required_end}; pages {optional_start} to {start - 1} are optional.</p>
<h2>What to print</h2>
<table><tr><th>Pages</th><th>What</th><th>Print</th><th>Notes</th></tr>{rows}</table>
<h2>Before you print</h2>
<ul><li>Paper: A4, in colour (the colours of the cards and the pictures on the slips carry meaning).</li>
<li>Print at 100 percent, "actual size", never "fit to page". Otherwise the cards come out smaller than planned.</li>
<li>Print single sided. The A6 cards fill the whole page, so a printer margin can clip 4 to 5 mm at the edge; print one page first.</li>
<li>Cut along the marks in the margins. The cards sit edge to edge, so you only need straight cuts.</li></ul>
<div class="note">The single files are in the same folder. Sources and how to rebuild: print-src/README.md.</div></div>'''


# ---------------------------------------------------------------- build
def run(cmd, **kw):
    result = subprocess.run(cmd, capture_output=True, text=True, **kw)
    if result.returncode != 0:
        raise SystemExit(f"{' '.join(map(str, cmd))} failed:\n{result.stdout}\n{result.stderr}")
    return result.stdout


def page_count(pdf):
    out = run(["pdfinfo", str(pdf)])
    return int(re.search(r"^Pages:\s+(\d+)", out, re.M).group(1))


def main():
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("--dest", default=str(HERE.parent / "print"), help="where the PDFs go (default: ../print)")
    args = parser.parse_args()
    dest = Path(args.dest)
    dest.mkdir(parents=True, exist_ok=True)
    OUT.mkdir(exist_ok=True)

    cards = load_deck()
    check_twists_in_app(cards)
    pages_html = {
        "deck": deck_html(cards), "slips": slips_html(), "idea": idea_html(),
        "rules-a6": rules_cards.document("sheet-a6"), "rules-a5": rules_cards.document("sheet-a5"),
        "ex-a6": rules_cards.document("ex-a6"), "ex-a5": rules_cards.document("ex-a5"),
    }
    for name, text in pages_html.items():
        (OUT / f"{name}.html").write_text(text, encoding="utf-8")
    run(["node", str(HERE / "render.js"), str(OUT)] + list(pages_html))

    counts = {name: page_count(OUT / f"{name}.pdf") for name in pages_html}
    (OUT / "cover.html").write_text(cover_html(counts), encoding="utf-8")
    run(["node", str(HERE / "render.js"), str(OUT), "cover"])

    merged = dest / "print-kit-all.pdf"
    run(["pdfunite", str(OUT / "cover.pdf")] + [str(OUT / f"{key}.pdf") for key, *_ in PARTS] + [str(merged)])
    for key, filename, *_ in PARTS:
        shutil.copyfile(OUT / f"{key}.pdf", dest / filename)
    total = page_count(merged)
    print(f"Wrote {len(PARTS)} PDFs and print-kit-all.pdf ({total} pages) to {dest}")


if __name__ == "__main__":
    main()
