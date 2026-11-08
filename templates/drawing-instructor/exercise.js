// Drawing instructor: one person describes a picture with geometric shapes only, the others draw it (English and Czech).
// Include it in another deck with:  { id: "instructor", include: "../../templates/drawing-instructor/exercise.js" }
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

  var T = function (en, cs) { return { en: en, cs: cs }; };
  // Example pictures made of simple shapes (for the instructor only), in a 160x160 box
  var PICTURES = [
    { en: "Rocket", cs: "Raketa", s: '<path d="M80 10 Q108 40 108 90 L52 90 Q52 40 80 10 Z"/><circle cx="80" cy="56" r="11"/><path d="M52 66 L30 100 L52 90 M108 66 L130 100 L108 90"/><path d="M66 90 L66 110 L94 110 L94 90"/>' },
    { en: "Robot", cs: "Robot", s: '<rect x="50" y="10" width="60" height="40"/><circle cx="68" cy="30" r="6"/><circle cx="92" cy="30" r="6"/><rect x="40" y="58" width="80" height="60"/><path d="M40 70 L16 100 M120 70 L144 100 M60 118 L60 150 M100 118 L100 150 M80 10 L80 0"/>' },
    { en: "Tower with flag", cs: "Věž s vlajkou", s: '<rect x="55" y="50" width="50" height="100"/><path d="M45 50 L115 50 M55 50 L55 36 L68 36 L68 50 M92 50 L92 36 L105 36 L105 50 M80 50 L80 8 L112 20 L80 32"/><path d="M68 150 L68 120 A12 12 0 0 1 92 120 L92 150"/>' }
  ];

  Deck.module({
    id: "drawing-instructor",
    title: T("Drawing instructor", "Kreslicí instruktor"),
    slides: [
      { id: "intro", min: 2, title: T("Drawing instructor: why", "Kreslicí instruktor: proč"),
        body: T(
          "<h2>Drawing instructor</h2><ul><li>An ice breaker.</li><li>Shows why communication and feedback matter.</li><li>Shows why shared terminology matters.</li></ul><p class=\"dk-small\">Needs: paper and a marker for everyone, and one simple but non-trivial sketch for the instructor. About 15 minutes.</p>",
          "<h2>Kreslicí instruktor</h2><ul><li>Seznamovací rozcvička.</li><li>Ukazuje, proč je důležitá komunikace a zpětná vazba.</li><li>Ukazuje, proč je důležitá společná terminologie.</li></ul><p class=\"dk-small\">Potřebujete: papír a fix pro každého a jednu jednoduchou, ale ne triviální skicu pro instruktora. Asi 15 minut.</p>"),
        notes: T("<p>Pick one person from the group as the instructor before you explain the rules, and give everyone paper and a pen.</p>",
                 "<p>Ještě před vysvětlením pravidel vyberte ze skupiny jednoho instruktora a rozdejte všem papír a pero.</p>") },

      { id: "rules", min: 2, title: T("Drawing instructor: rules", "Kreslicí instruktor: pravidla"),
        body: T(
          "<h2>Rules</h2><ul><li>Only the instructor talks.</li><li>No naming the thing (no “boat”, “truck”).</li><li>Only basic geometric shapes: line, square, circle...</li><li>The instructor does not look at what the others draw.</li><li>No yes/no questions, no two-way talk.</li></ul>",
          "<h2>Pravidla</h2><ul><li>Mluví jen instruktor.</li><li>Nesmí říct, co to je (žádná „loď“ ani „nákladní auto“).</li><li>Jen základní geometrické tvary: čára, čtverec, kruh...</li><li>Instruktor se nedívá, co ostatní kreslí.</li><li>Žádné doplňující otázky, žádná obousměrná komunikace.</li></ul>") ,
        notes: T("<p>Show the instructor the prepared sketch privately and ask them to guide the others. The next slide holds three example pictures for the facilitator.</p>",
                 "<p>Instruktorovi ukažte připravenou skicu soukromě a požádejte ho, aby ostatní navigoval. Na dalším slidu jsou tři ukázkové obrázky pro lektora.</p>") },

      { id: "pictures", min: 1, title: T("Drawing instructor: pictures (facilitator only)", "Kreslicí instruktor: obrázky (jen pro lektora)"),
        notes: T("<p>Do not project this slide to the class. Show only the instructor, or use your own picture. The originals had example pictures too; these three are new.</p>",
                 "<p>Tento slide nepromítejte skupině. Ukažte ho jen instruktorovi, nebo použijte vlastní obrázek. I originál měl ukázkové obrázky; tyto tři jsou nové.</p>"),
        render: function (box, ctx) {
          box.appendChild(mk("h2", "", pick(ctx, "Pictures for the instructor", "Obrázky pro instruktora")));
          box.appendChild(mk("p", "font-size:26px;color:var(--dk-muted)", pick(ctx, "Do not show to the class. Pick one.", "Neukazujte skupině. Vyberte jeden.")));
          var row = mk("div", "display:flex;gap:40px;color:var(--dk-fg)"), cards = [];
          PICTURES.forEach(function (p) {
            var c = mk("div", "display:flex;flex-direction:column;align-items:center;gap:6px");
            var f = mk("div", "width:200px;height:200px;visibility:hidden"); f.className = "pic"; f.innerHTML = svg(p.s, 160, 160, "width:100%;height:100%");
            c.appendChild(f); c.appendChild(mk("div", "font-size:24px;color:var(--dk-muted)", pick(ctx, p.en, p.cs)));
            row.appendChild(c); cards.push(f);
          });
          box.appendChild(row);
          if (ctx.preview) return;
          var shown = false, b = mk("button", BTN, pick(ctx, "Show pictures", "Ukázat obrázky")); b.id = "pics-toggle"; b.style.alignSelf = "flex-start";
          b.addEventListener("click", function () {
            shown = !shown; cards.forEach(function (c) { c.style.visibility = shown ? "visible" : "hidden"; });
            b.textContent = shown ? pick(ctx, "Hide pictures", "Skrýt obrázky") : pick(ctx, "Show pictures", "Ukázat obrázky");
          });
          box.appendChild(b);
        } },

      timerSlide({ id: "round1", min: 4, seconds: 240, title: T("Drawing instructor: round 1", "Kreslicí instruktor: 1. kolo"),
        heading: T("Round 1: instructor, go", "1. kolo: instruktore, do toho"),
        text: T("Describe the picture with shapes only. Everyone else: draw what you hear.", "Popište obrázek jen pomocí tvarů. Ostatní: kreslete, co slyšíte."),
        notes: T("<p>Stop at the time limit even if drawings are unfinished. Remind: no confirmation questions, no names of the object.</p>",
                 "<p>Po uplynutí času ukončete, i když kresby nejsou hotové. Připomeňte: žádné ověřovací otázky, žádná jména předmětu.</p>") }),

      { id: "compare", min: 3, title: T("Drawing instructor: compare", "Kreslicí instruktor: porovnání"),
        body: T(
          "<h2>Compare</h2><ul><li>Share your drawings and put them next to the original.</li><li>How close are they?</li><li>Why do they differ?</li><li>Which words were clear, which were not?</li></ul>",
          "<h2>Porovnání</h2><ul><li>Ukažte kresby a porovnejte je s originálem.</li><li>Jak blízko jsou?</li><li>Proč se liší?</li><li>Která slova byla jasná a která ne?</li></ul>"),
        notes: T("<p>Draw out the reasons: no feedback loop, different meanings of the same word, missing reference points (where does it start, how big).</p>",
                 "<p>Vyzvěte skupinu k hledání příčin: chyběla zpětná vazba, stejné slovo znamená pro každého něco jiného, chyběly orientační body (kde začít, jak velké).</p>") },

      timerSlide({ id: "round2", min: 3, seconds: 180, title: T("Drawing instructor: round 2", "Kreslicí instruktor: 2. kolo"),
        heading: T("Round 2", "2. kolo"),
        text: T("A new picture. Use what you learned. Did the result improve?", "Nový obrázek. Použijte, co jste se naučili. Zlepšil se výsledek?"),
        notes: T("<p>Same rules, a new picture (and optionally a new instructor). Observe and ask whether the results improved and why.</p>",
                 "<p>Stejná pravidla, nový obrázek (a případně nový instruktor). Sledujte a ptejte se, zda se výsledky zlepšily a proč.</p>") }),

      { id: "reflect", min: 2, title: T("Drawing instructor: reflection", "Kreslicí instruktor: reflexe"),
        body: T(
          "<h2>Reflection</h2><ul><li>What changed between round 1 and round 2?</li><li>What would two-way communication have fixed?</li><li>Where in a team project do we explain without checking that we are understood?</li></ul>",
          "<h2>Reflexe</h2><ul><li>Co se změnilo mezi 1. a 2. kolem?</li><li>Co by spravila obousměrná komunikace?</li><li>Kde v týmovém projektu vysvětlujeme, aniž ověříme, že nám druzí rozumějí?</li></ul>") }
    ]
  });
})();
