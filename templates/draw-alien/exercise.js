// Draw an alien: a five-minute drawing task and a debrief on how new ideas build on old ones (English and Czech).
// Include it in another deck with:  { id: "alien", include: "../../templates/draw-alien/exercise.js" }
(function () {
  // ---- small helpers (kept inside this file so the module has no dependencies) ----
  function mk(tag, css, text) { var e = document.createElement(tag); if (css) e.style.cssText = css; if (text != null) e.textContent = text; return e; }
  function pick(ctx, en, cs) { return ctx.lang === "cs" ? cs : en; }
  function mmss(s) { s = Math.max(0, Math.ceil(s)); return Math.floor(s / 60) + ":" + String(s % 60).padStart(2, "0"); }
  var BTN = "font-size:26px;padding:8px 20px;cursor:pointer";

  // A countdown with Start/Pause and Reset. In the small next-slide preview it only shows the full time.
  // Returns a cleanup function (stops the interval).
  function addTimer(parent, ctx, seconds, size) {
    var clock = mk("div", "font-size:" + (size || 120) + "px;font-weight:700;line-height:1;font-variant-numeric:tabular-nums;color:var(--stage-fg)", mmss(seconds));
    clock.id = "timer-clock";
    parent.appendChild(clock);
    if (ctx.preview) return function () {};
    var row = mk("div", "display:flex;gap:12px;flex-wrap:wrap");
    var go = mk("button", BTN, pick(ctx, "Start", "Spustit")), reset = mk("button", BTN, pick(ctx, "Reset", "Znovu"));
    go.id = "timer-go"; reset.id = "timer-reset";
    row.appendChild(go); row.appendChild(reset); parent.appendChild(row);
    var left = seconds, endAt = null, iv = null, ac = null;
    function paint() { clock.textContent = left > 0 ? mmss(left) : pick(ctx, "Time!", "Čas!"); clock.style.color = left > 0 ? "var(--stage-fg)" : "var(--stage-hi)"; clock.dataset.done = left > 0 ? "" : "1"; }
    function stop() { if (iv) clearInterval(iv); iv = null; endAt = null; go.textContent = pick(ctx, "Start", "Spustit"); }
    function beep() {
      try { ac = ac || new (window.AudioContext || window.webkitAudioContext)(); var o = ac.createOscillator(), g = ac.createGain();
        o.frequency.value = 880; g.gain.value = 0.15; o.connect(g); g.connect(ac.destination); o.start(); o.stop(ac.currentTime + 0.5); } catch (e) {}
    }
    function tick() { left = (endAt - Date.now()) / 1000; if (left <= 0) { left = 0; stop(); beep(); } paint(); }
    go.addEventListener("click", function () {
      if (iv) { stop(); return; }
      if (left <= 0) left = seconds;
      endAt = Date.now() + left * 1000; go.textContent = pick(ctx, "Pause", "Pauza");
      iv = setInterval(tick, 250); tick();
    });
    reset.addEventListener("click", function () { stop(); left = seconds; paint(); });
    return function () { if (iv) clearInterval(iv); if (ac) { try { ac.close(); } catch (e) {} } };
  }

  // A slide with a heading, a short instruction and a countdown.
  function timerSlide(o) {
    return { id: o.id, min: o.min, title: o.title, notes: o.notes,
      render: function (box, ctx) {
        box.appendChild(mk("h2", "", o.heading[ctx.lang] || o.heading.en));
        if (o.text) { var p = mk("p"); p.innerHTML = o.text[ctx.lang] || o.text.en; box.appendChild(p); }
        if (o.extra) o.extra(box, ctx);
        return addTimer(box, ctx, o.seconds, o.size);
      } };
  }
  function svg(inner, w, h, css) { return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + w + " " + h + '" style="' + (css || "") + '" fill="none" stroke="currentColor" stroke-width="5" stroke-linejoin="round" stroke-linecap="round" aria-hidden="true">' + inner + "</svg>"; }

  var T = function (en, cs) { return { en: en, cs: cs }; };
  // Figures reported on the source slides (a study of drawings of aliens); shown as a comparison, not as our own data.
  var FEATURES = [
    { en: "Eyes", cs: "Oči", ref: 89 },
    { en: "Legs", cs: "Nohy", ref: 78 },
    { en: "A nose", cs: "Nos", ref: 59 }
  ];

  Deck.module({
    id: "draw-alien",
    title: T("Draw an alien", "Nakresli vetřelce"),
    slides: [
      { id: "intro", min: 1, title: T("Draw an alien: instructions", "Vetřelec: zadání"),
        body: T(
          "<h2>Draw an alien</h2><ul><li>You have five minutes.</li><li>Draw a creature from another planet, as original as you can.</li><li>Paper and a pen are enough. Do not talk or peek.</li></ul>",
          "<h2>Nakreslete vetřelce</h2><ul><li>Máte pět minut.</li><li>Nakreslete tvora z jiné planety, co nejoriginálnějšího.</li><li>Stačí papír a pero. Nemluvte a nekoukejte k sousedům.</li></ul>"),
        notes: T("<p>Do not say what the debrief is about. Use it as a warm-up and keep most of the time for the follow-up conversation.</p>",
                 "<p>Neříkejte, o čem bude reflexe. Použijte to jako rozcvičku a většinu času nechte na navazující rozhovor.</p>") },

      timerSlide({ id: "draw", min: 5, seconds: 300, title: T("Draw an alien: go", "Vetřelec: kreslíme"),
        heading: T("Draw an alien", "Nakreslete vetřelce"),
        text: T("Five minutes. Be original.", "Pět minut. Buďte originální."),
        notes: T("<p>Start the timer when everyone is ready. Walk around and keep it silent.</p>", "<p>Odpočet spusťte, až jsou všichni připraveni. Projděte místnost a udržte ticho.</p>") }),

      { id: "compare", min: 4, title: T("Draw an alien: compare", "Vetřelec: porovnáme"),
        body: T(
          "<h2>Compare your drawings</h2><ul><li>Hold them up or put them on the table together.</li><li>What do they have in common?</li><li>Where did your idea come from?</li></ul>",
          "<h2>Porovnejte své kresby</h2><ul><li>Zvedněte je nebo je položte společně na stůl.</li><li>Co mají společné?</li><li>Odkud se váš nápad vzal?</li></ul>"),
        notes: T("<p>Typical observations: results resemble each other, often drawing on science fiction; it is hard to imagine something that does not exist.</p>",
                 "<p>Typická pozorování: výsledky si jsou podobné a často vycházejí ze sci-fi; je těžké představit si něco, co neexistuje.</p>") },

      { id: "count", min: 3, title: T("Draw an alien: count the room", "Vetřelec: spočítejte sál"),
        notes: T("<p>Ask for a show of hands per feature and enter the numbers (plus and minus buttons). The grey figures are those reported on the source slides; your room will differ a little.</p>",
                 "<p>Zeptejte se zvednutím ruky na každý prvek a zadejte počty (tlačítka plus a mínus). Šedá čísla jsou údaje uvedené ve zdrojových slidech; vaše skupina se trochu odliší.</p>"),
        render: function (box, ctx) {
          box.appendChild(mk("h2", "", pick(ctx, "How many aliens had...?", "Kolik vetřelců mělo...?")));
          var state = { total: 20, n: [0, 0, 0] }, outs = [];
          var table = mk("div", "display:grid;grid-template-columns:auto auto auto 1fr;gap:10px 28px;align-items:center;font-size:32px");
          function btn(t, f) { var b = mk("button", "font-size:28px;width:56px;padding:4px;cursor:pointer", t); b.addEventListener("click", f); return b; }
          function paint() {
            outs.forEach(function (o, i) {
              o.count.textContent = state.n[i] + " / " + state.total;
              o.pct.textContent = Math.round(100 * state.n[i] / Math.max(1, state.total)) + " %";
            });
            totalOut.textContent = state.total;
          }
          FEATURES.forEach(function (f, i) {
            var name = mk("div", "min-width:200px", pick(ctx, f.en, f.cs));
            var ctl = mk("div", "display:flex;gap:8px;align-items:center");
            var count = mk("span", "min-width:110px;text-align:center;font-variant-numeric:tabular-nums");
            if (!ctx.preview) { ctl.appendChild(btn("−", function () { state.n[i] = Math.max(0, state.n[i] - 1); paint(); })); }
            ctl.appendChild(count);
            if (!ctx.preview) { ctl.appendChild(btn("+", function () { state.n[i] = Math.min(state.total, state.n[i] + 1); paint(); })); }
            var pct = mk("div", "font-weight:700;color:var(--stage-hi);min-width:90px;text-align:right");
            var ref = mk("div", "color:var(--stage-dim);font-size:26px", pick(ctx, "reported: ", "uvedeno: ") + f.ref + " %");
            outs.push({ count: count, pct: pct });
            [name, ctl, pct, ref].forEach(function (n) { table.appendChild(n); });
          });
          box.appendChild(table);
          var tot = mk("div", "display:flex;gap:12px;align-items:center;font-size:28px");
          var totalOut = mk("span", "min-width:50px;text-align:center;font-weight:700");
          tot.appendChild(mk("span", "", pick(ctx, "People in the room:", "Lidí v místnosti:")));
          if (!ctx.preview) tot.appendChild(btn("−", function () { state.total = Math.max(1, state.total - 1); state.n = state.n.map(function (v) { return Math.min(v, state.total); }); paint(); }));
          tot.appendChild(totalOut);
          if (!ctx.preview) tot.appendChild(btn("+", function () { state.total += 1; paint(); }));
          if (!ctx.preview) box.appendChild(tot); else box.appendChild(mk("div", "font-size:26px;color:var(--stage-dim)", pick(ctx, "Count the room with plus and minus buttons.", "Spočítejte sál tlačítky plus a mínus.")));
          paint();
        } },

      { id: "point", min: 3, title: T("Draw an alien: the point", "Vetřelec: poučení"),
        body: T(
          "<h2>All new ideas are a combination of old ones</h2><ul><li>It is hard to imagine something that does not exist.</li><li>We mix what we already know: eyes, legs, faces.</li><li>To get further, break a feature on purpose and ask what is left.</li></ul>",
          "<h2>Každý nový nápad je kombinací starých</h2><ul><li>Je těžké představit si něco, co neexistuje.</li><li>Mícháme to, co už známe: oči, nohy, obličeje.</li><li>Abychom se dostali dál, jeden prvek záměrně vynecháme a ptáme se, co zbude.</li></ul>"),
        notes: T("<p>Reflection questions: What would an alien without eyes look like? What would it need instead? Where do your own project ideas copy what already exists?</p>",
                 "<p>Reflexní otázky: Jak by vypadal vetřelec bez očí? Co by místo nich potřeboval? Kde vaše vlastní nápady kopírují to, co už existuje?</p>") }
    ]
  });
})();
