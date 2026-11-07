"""Rules cards (A6 first version, A5 final version after the twist) and their filled-in examples.
Plain HTML and CSS written as strings; build_print.py turns the HTML into PDFs."""
INK='#2f4550'
MIND=dict(name="The Mind (Wolfgang Warsch, 2018)",players="2–4",time="20 min",M="6, 9",G="3",L="5",T="3",
 setting="a quiet table",thing="number cards 1–100",aud="friends, 2–4",
 goal="Together, play all your cards onto one pile in rising order, without talking. Win by clearing the last level.",
 setup="Shuffle the cards 1–100. Lives = number of players. Level 1: each player gets 1 card, level 2: 2 cards, and so on.",
 play="No talking, no signs, no turns. When the time feels right, put your LOWEST card face up on the pile. If someone plays a card while another player holds a lower one, the team loses 1 life and the lower cards are thrown away. When all hands are empty, the level is won: deal one more card each.",
 end="level 12 / 10 / 8 is won (2 / 3 / 4 players) or all lives are lost.",
 twist="Easier for a 10-year-old: only levels 1–4, lives = players + 1, and one hint may be spoken per level.")
def lab(en,es): return f'<div class="lab"><b>{en}</b> <i>/ {es}</i></div>'
def fld(en,es,n,h,text=None):
    if text is None: body=''.join(f'<div class="ln" style="height:{h}mm"></div>' for _ in range(n))
    else: body=f'<div class="fl" style="height:{n*h}mm;line-height:{h}mm;background-size:100% {h}mm">{text}</div>'
    return lab(en,es)+body
def chip(l,v=None,w=False):
    inner=f'<u class="{"fv" if v else ""}">{v or ""}</u>'
    return f'<span>{l}{inner}</span>'
CSS='''
@page{size:A4;margin:0}*{box-sizing:border-box}
body{margin:0;font-family:"Carlito","Liberation Sans",sans-serif;color:#14202a}
.page{width:210mm;height:297mm;position:relative;overflow:hidden;page-break-after:always}
.cut{position:absolute;border:0 dashed #9aa;pointer-events:none}
.card{position:absolute;display:flex;flex-direction:column}
.frame{position:absolute;inset:5mm;border:.9mm solid #2f4550;border-radius:2mm}
.in{position:absolute;inset:8mm;display:flex;flex-direction:column;font-size:8pt}
.ttl{font-size:15pt;font-weight:700;letter-spacing:.8pt;color:#2f4550;line-height:1}
.sub{font-size:5.8pt;color:#556;margin-top:.8mm;line-height:1.15}
.team{font-size:6.5pt;font-weight:700;text-align:right;white-space:nowrap}
.team span{display:block;width:22mm;border-bottom:.25mm solid #14202a;height:5mm}
.top{display:flex;justify-content:space-between;align-items:flex-start;gap:3mm;margin-bottom:1.5mm}
.lab{font-size:6.8pt;margin-top:1.4mm;line-height:1.1}.lab i{color:#556}
.ln{border-bottom:.2mm solid #9aa7ae}
.fl,.fv,.vv{font-style:italic;color:#1d3fa8}
.fl{font-size:7.6pt;background-image:linear-gradient(to bottom,transparent calc(100% - .2mm),#9aa7ae 0)}
.two{display:grid;grid-template-columns:1fr 1fr;gap:4mm}
.chips{display:flex;gap:2mm;margin-top:1mm}
.chips span{display:flex;align-items:flex-end;gap:1mm;font-size:6.6pt;font-weight:700;flex:1}
.chips u{flex:1;border-bottom:.25mm solid #14202a;height:4.3mm;text-decoration:none;min-width:4mm;font-size:7pt;line-height:4mm;white-space:nowrap;overflow:hidden}
.chips.w span{font-size:5.8pt;flex-direction:column;align-items:stretch;gap:0}
.chips.w u{height:4.6mm;font-size:6.4pt}
.foot{display:flex;justify-content:space-between;font-size:6pt;margin-top:auto;padding-top:1mm;border-top:.2mm solid #2f4550;color:#33444d}
.foot.f span{color:#1d3fa8}
'''
def a6(data=None):
    d=data or {}; g=lambda k:d.get(k)
    h=5.6
    return f'''<div class="in">
<div class="top"><div><div class="ttl">RULES CARD</div><div class="sub">CARTA DE REGLAS · a stranger must be able to play from this card alone<br><b>Write in English · Escribe en inglés</b></div></div><div class="team">Team / Equipo<span class="vv">{"Example" if d else ""}</span></div></div>
{fld("Game name","Nombre del juego",1,h,g("name"))}
<div class="two"><div>{fld("Players","Jugadores",1,h,g("players"))}</div><div>{fld("Time","Duración",1,h,g("time"))}</div></div>
{lab("Ingredients","Ingredientes")}
<div class="chips">{chip("M",g("M"))}{chip("G",g("G"))}{chip("L",g("L"))}</div>
<div class="chips w">{chip("Setting / Escenario",g("setting"))}{chip("Thing / Objeto",g("thing"))}{chip("Audience / Público",g("aud"))}</div>
{fld("Goal: how do you win?","Objetivo: ¿cómo se gana?",2,h,g("goal"))}
{fld("Setup","Preparación",2,h,g("setup"))}
{fld("How to play","Cómo se juega",6,h,g("play"))}
{fld("The game ends when…","El juego termina cuando…",1,h,g("end"))}
<div class="foot{" f" if d else ""}"><span>{"☑" if d else "☐"} Played correctly by a stranger, no help</span><span>{"☑" if d else "☐"} Lo jugó un extraño sin ayuda</span></div>
</div>'''
def a5(data=None):
    d=data or {}; g=lambda k:d.get(k)
    h=6.2
    return f'''<div class="in" style="flex-direction:row;gap:7mm">
<div style="width:62mm;display:flex;flex-direction:column">
<div class="ttl">RULES CARD</div><div class="sub">CARTA DE REGLAS · final version, after the twist<br>versión final, después del giro<br><b>Write in English · Escribe en inglés</b></div>
<div class="team" style="text-align:left;margin-top:1.5mm">Team / Equipo<span class="vv" style="width:40mm">{"Example" if d else ""}</span></div>
{fld("Game name","Nombre del juego",2,h,g("name"))}
<div class="two"><div>{fld("Players","Jugadores",1,h,g("players"))}</div><div>{fld("Time","Duración",1,h,g("time"))}</div></div>
{lab("Ingredients","Ingredientes")}
<div class="chips">{chip("M",g("M"))}{chip("G",g("G"))}{chip("L",g("L"))}{chip("T",g("T"))}</div>
<div class="chips w" style="flex-direction:column;gap:0">{chip("Setting / Escenario",g("setting"))}{chip("Thing / Objeto",g("thing"))}{chip("Audience / Público",g("aud"))}</div>
{fld("What the twist changed","Qué cambió el giro",3,h,g("twist"))}
</div>
<div style="flex:1;display:flex;flex-direction:column;min-width:0">
{fld("Goal: how do you win?","Objetivo: ¿cómo se gana?",2,h,g("goal"))}
{fld("Setup","Preparación",2,h,g("setup"))}
{fld("How to play","Cómo se juega",9,h,g("play"))}
{fld("The game ends when…","El juego termina cuando…",2,h,g("end"))}
</div>
</div>
<div class="in" style="top:auto;bottom:5.5mm;height:5mm"><div class="foot{" f" if d else ""}" style="margin-top:0"><span>{"☑" if d else "☐"} Played correctly by a stranger, no help</span><span>{"☑" if d else "☐"} Lo jugó un extraño sin ayuda</span></div></div>'''
def cuts(kind):
    if kind=='a6': return '<div class="cut" style="left:105mm;top:0;bottom:0;border-left-width:.25mm"></div><div class="cut" style="top:148.5mm;left:0;right:0;border-top-width:.25mm"></div>'
    return '<div class="cut" style="top:148.5mm;left:0;right:0;border-top-width:.25mm"></div>'
def sheet(kind,data=None,n=2):
    pages=''
    for _ in range(n):
        cs=''
        if kind=='a6':
            for r in range(2):
                for c in range(2):
                    cs+=f'<div class="card" style="left:{c*105}mm;top:{r*148.5}mm;width:105mm;height:148.5mm"><div class="frame"></div>{a6(data)}</div>'
        else:
            for r in range(2):
                cs+=f'<div class="card" style="left:0;top:{r*148.5}mm;width:210mm;height:148.5mm"><div class="frame"></div>{a5(data)}</div>'
        pages+=f'<div class="page">{cuts(kind)}{cs}</div>'
    return pages
def example(kind):
    data=MIND
    scale=1.7 if kind=='a6' else 0.94
    w,hh=(105,148.5) if kind=='a6' else (210,148.5)
    card=f'<div class="card" style="position:relative;width:{w}mm;height:{hh}mm"><div class="frame"></div>{a6(data) if kind=="a6" else a5(data)}</div>'
    cap='Example: a filled-in rules card' if kind=='a6' else 'Example: a filled-in final rules card, after the twist'
    sub='A real game, The Mind, written in the space the card allows. Ingredient codes are the closest cards from the deck.'
    return f'<div class="page" style="display:flex;flex-direction:column;align-items:center;padding-top:14mm"><div style="font-size:11pt;color:{INK};margin-bottom:2mm"><b>{cap}</b></div><div style="font-size:8pt;color:#556;margin-bottom:6mm">{sub}</div><div style="zoom:{scale}">{card}</div></div>'
def document(which):
    """Full HTML for one of: sheet-a6, sheet-a5, ex-a6, ex-a5."""
    if which == 'sheet-a6': body = sheet('a6')
    elif which == 'sheet-a5': body = sheet('a5', None, 4)
    elif which == 'ex-a6': body = example('a6')
    elif which == 'ex-a5': body = example('a5')
    else: raise ValueError(which)
    return f'<!doctype html><meta charset="utf-8"><style>{CSS}</style>{body}'
