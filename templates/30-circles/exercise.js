// 30 circles: a three-minute warm-up and its debrief, as deck slides (English and Czech).
// Include it in another deck with:  { id: "circles", include: "../../templates/30-circles/exercise.js" }
(function () {
  // ---- small helpers (kept inside this file so the module has no dependencies) ----
  function mk(tag, css, text) { var e = document.createElement(tag); if (css) e.style.cssText = css; if (text != null) e.textContent = text; return e; }
  function pick(ctx, en, cs) { return ctx.lang === "cs" ? cs : en; }
  function mmss(s) { s = Math.max(0, Math.ceil(s)); return Math.floor(s / 60) + ":" + String(s % 60).padStart(2, "0"); }
  var BTN = "font-size:26px;padding:8px 20px;cursor:pointer";

  // A countdown with Start/Pause and Reset. In the small next-slide preview it only shows the full time.
  // Returns a cleanup function (stops the interval).
  function addTimer(parent, ctx, seconds, size) {
    var clock = mk("div", "font-size:" + (size || 120) + "px;font-weight:700;line-height:1;font-variant-numeric:tabular-nums;color:var(--dk-fg)", mmss(seconds));
    clock.id = "timer-clock";
    parent.appendChild(clock);
    if (ctx.preview) return function () {};
    var row = mk("div", "display:flex;gap:12px;flex-wrap:wrap");
    var go = mk("button", BTN, pick(ctx, "Start", "Spustit")), reset = mk("button", BTN, pick(ctx, "Reset", "Znovu"));
    go.id = "timer-go"; reset.id = "timer-reset";
    row.appendChild(go); row.appendChild(reset); parent.appendChild(row);
    var left = seconds, endAt = null, iv = null, ac = null;
    function paint() { clock.textContent = left > 0 ? mmss(left) : pick(ctx, "Time!", "Čas!"); clock.style.color = left > 0 ? "var(--dk-fg)" : "var(--dk-accent)"; clock.dataset.done = left > 0 ? "" : "1"; }
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

  // The sheet: 30 empty circles in 6 columns and 5 rows, as SVG.
  var COLS = 6, ROWS = 5, PITCH = 115, R = 46;
  function sheetSvg(css) {
    var c = "";
    for (var i = 0; i < COLS * ROWS; i++) {
      c += '<circle cx="' + (PITCH / 2 + (i % COLS) * PITCH) + '" cy="' + (PITCH / 2 + Math.floor(i / COLS) * PITCH) + '" r="' + R + '"/>';
    }
    return svg(c, COLS * PITCH, ROWS * PITCH, css).replace('stroke-width="5"', 'stroke-width="3"');
  }

  // Print: a hidden copy of the sheet lives in <body>; print CSS hides everything else.
  var PRINT_CSS = "#c30-print{display:none}@media print{body>*:not(#c30-print){display:none!important}" +
    "#c30-print{display:flex!important;align-items:center;justify-content:center;width:100%;height:100vh}" +
    "#c30-print svg{width:100%;max-height:100vh;color:#000}@page{size:A4 portrait;margin:12mm}}";
  function installPrint() {
    var st = document.getElementById("c30-print-css");
    if (!st) { st = document.createElement("style"); st.id = "c30-print-css"; st.textContent = PRINT_CSS; document.head.appendChild(st); }
    var box = document.getElementById("c30-print");
    if (!box) { box = document.createElement("div"); box.id = "c30-print"; document.body.appendChild(box); }
    box.innerHTML = sheetSvg("");
    return box;
  }

  var T = function (en, cs) { return { en: en, cs: cs }; };

  Deck.module({
    id: "30-circles",
    title: T("30 circles", "30 kruhů"),
    slides: [
      { id: "intro", min: 1, title: T("30 circles: the challenge", "30 kruhů: zadání"),
        body: T(
          "<h2>30 circles challenge</h2><ul><li>Turn as many circles as you can into recognisable objects.</li>" +
          "<li>The circle itself must be part of the object.</li><li>You have three minutes.</li></ul>",
          "<h2>Výzva 30 kruhů</h2><ul><li>Přeměňte co nejvíc kruhů v poznatelné předměty.</li>" +
          "<li>Samotný kruh musí být součástí předmětu.</li><li>Máte tři minuty.</li></ul>"),
        notes: T(
          "<p>Hand out the printed sheet (the next slide has a print button) or let people draw 30 circles themselves. Say only the three rules above, nothing more: the debrief asks which rules were given and which were assumed.</p>" +
          "<p>Use this as a warm-up, not on its own. Leave most of the time for the conversation afterwards about the point of the exercise.</p>",
          "<p>Rozdejte vytištěný list (na dalším slidu je tlačítko pro tisk) nebo ať si každý nakreslí 30 kruhů sám. Řekněte jen tři pravidla výše a nic navíc: v reflexi se ptáme, která pravidla byla zadaná a která si lidé domysleli.</p>" +
          "<p>Použijte to jako rozcvičku, ne samostatně. Většinu času nechte na následný rozhovor o smyslu cvičení.</p>") },

      { id: "sheet", min: 3, title: T("30 circles: draw", "30 kruhů: kreslíme"),
        notes: T("<p>Start the timer when everyone has a pen and a sheet. Do not answer questions about the rules; repeat the three rules.</p>",
                 "<p>Odpočet spusťte, až má každý pero a list. Na otázky k pravidlům neodpovídejte, jen zopakujte tři pravidla.</p>"),
        render: function (box, ctx) {
          box.style.cssText += ";flex-direction:row;align-items:center;gap:40px;padding:36px 56px";
          var left = mk("div", "flex:0 0 auto;height:100%;display:flex;align-items:center");
          left.innerHTML = sheetSvg("height:100%;max-height:640px;width:auto;color:var(--dk-fg)");
          var right = mk("div", "display:flex;flex-direction:column;gap:20px;flex:1");
          right.appendChild(mk("h2", "", pick(ctx, "Draw!", "Kreslete!")));
          right.appendChild(mk("p", "font-size:28px", pick(ctx, "Circle = part of the object. 3 minutes.", "Kruh = součást předmětu. 3 minuty.")));
          var stop = addTimer(right, ctx, 180, 110);
          if (!ctx.preview) {
            var pb = mk("button", BTN, pick(ctx, "Print this sheet", "Vytisknout list"));
            pb.id = "print-sheet"; pb.style.alignSelf = "flex-start";
            installPrint();
            pb.addEventListener("click", function () { installPrint(); window.print(); });
            right.appendChild(pb);
          }
          box.appendChild(left); box.appendChild(right);
          return function () { stop(); var b = document.getElementById("c30-print"); if (b) b.remove(); };
        } },

      { id: "common", min: 3, title: T("30 circles: what did you draw?", "30 kruhů: co jste nakreslili?"),
        body: T(
          "<h2>How many of you drew one of these?</h2><ul><li>A smiley face</li><li>A ball (basketball, bowling ball, football...)</li>" +
          "<li>A planet, a moon or another space object</li><li>A cookie</li></ul>",
          "<h2>Kolik z vás nakreslilo něco z tohoto?</h2><ul><li>Smajlík</li><li>Míč (basketbalový, bowlingová koule, fotbalový...)</li>" +
          "<li>Planetu, měsíc nebo jiný vesmírný objekt</li><li>Sušenku</li></ul>"),
        notes: T("<p>Ask for a show of hands for each. These are the most common answers, so the first ideas are often the same for everyone. Ask how many circles it took before people left the obvious ones.</p>" +
                 "<p>The source slides show example drawings here; this version has none.</p>",
                 "<p>U každé možnosti požádejte o zvednutí ruky. Jsou to nejčastější odpovědi, takže první nápady bývají u všech stejné. Zeptejte se, u kolikátého kruhu lidé obvyklé nápady opustili.</p>" +
                 "<p>Ve zdrojových slidech jsou tu ukázky kresbami; tato verze je nemá.</p>") },

      { id: "rules", min: 4, title: T("30 circles: did you break the rules?", "30 kruhů: porušili jste pravidla?"),
        body: T(
          "<h2>How many of you “broke” the rules?</h2><ul><li>The object extends outside the circle.</li>" +
          "<li>The object combines more than one circle.</li><li>Were the rules given, or assumed?</li></ul>",
          "<h2>Kolik z vás pravidla „porušilo“?</h2><ul><li>Předmět přesahuje mimo kruh.</li>" +
          "<li>Předmět spojuje více kruhů.</li><li>Byla pravidla zadaná, nebo domyšlená?</li></ul>"),
        notes: T("<p>Neither of those was forbidden: the rules only said the circle must be part of the object. Many people assumed a limit that nobody gave them. Discuss where else we assume limits in a design problem.</p>",
                 "<p>Ani jedno nebylo zakázané: pravidla říkala jen to, že kruh musí být součástí předmětu. Mnoho lidí si domyslelo omezení, které jim nikdo nedal. Probereme, kde jinde si při řešení designového problému omezení domýšlíme.</p>") },

      { id: "reflect", min: 4, title: T("30 circles: reflection", "30 kruhů: reflexe"),
        body: T(
          "<h2>Reflection</h2><ul><li>Which ideas came first, and which came later?</li><li>What did you assume without being told?</li>" +
          "<li>What helped you keep going after the obvious ideas?</li><li>Where in your own work do you stop at the first idea?</li></ul>",
          "<h2>Reflexe</h2><ul><li>Které nápady přišly první a které později?</li><li>Co jste si domysleli, aniž vám to někdo řekl?</li>" +
          "<li>Co vám pomohlo pokračovat po obvyklých nápadech?</li><li>Kde ve své práci se zastavujete u prvního nápadu?</li></ul>"),
        notes: T("<p>The questions are a suggestion for the follow-up talk. The aim is to show that quantity and rule-bending produce less obvious ideas.</p>",
                 "<p>Otázky jsou návrh pro navazující rozhovor. Cílem je ukázat, že množství nápadů a ohýbání pravidel vede k méně obvyklým výsledkům.</p>") }
    ]
  });
})();
