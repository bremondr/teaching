// Everyone can sketch: a 15-minute warm-up that builds objects and people from simple shapes (English and Czech).
// Include it in another deck with:  { id: "sketch", include: "../../templates/everyone-can-sketch/exercise.js" }
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
  var BOX = "width:150px;height:110px";
  // Simple shape drawings, each in a 120x90 box
  var SHAPES = [
    { en: "A line", cs: "Čára", s: '<path d="M10 70 L110 20"/>' },
    { en: "A rectangle", cs: "Obdélník", s: '<rect x="15" y="20" width="90" height="50"/>' },
    { en: "A triangle", cs: "Trojúhelník", s: '<path d="M60 12 L108 76 L12 76 Z"/>' },
    { en: "A circle", cs: "Kruh", s: '<circle cx="60" cy="45" r="36"/>' },
    { en: "A half circle", cs: "Půlkruh", s: '<path d="M18 62 A42 42 0 0 1 102 62 Z"/>' },
    { en: "A box", cs: "Kvádr", s: '<rect x="12" y="30" width="62" height="46"/><path d="M12 30 L36 12 L98 12 L74 30 M74 76 L98 58 L98 12"/>' }
  ];
  var OBJECTS = [
    { en: "A house", cs: "Dům", s: '<rect x="20" y="40" width="80" height="45"/><path d="M12 42 L60 8 L108 42 Z"/><rect x="50" y="58" width="20" height="27"/>' },
    { en: "A sailboat", cs: "Plachetnice", s: '<path d="M58 8 L58 66 L18 66 Z M64 22 L64 66 L98 66 Z"/><path d="M10 72 L110 72 L92 88 L28 88 Z"/>' },
    { en: "A car", cs: "Auto", s: '<rect x="8" y="42" width="104" height="26"/><path d="M28 42 L42 20 L80 20 L96 42"/><circle cx="32" cy="72" r="11"/><circle cx="88" cy="72" r="11"/>' },
    { en: "A truck", cs: "Nákladní auto", s: '<rect x="6" y="20" width="66" height="48"/><path d="M72 36 L98 36 L112 52 L112 68 L72 68 Z"/><circle cx="28" cy="72" r="11"/><circle cx="92" cy="72" r="11"/>' }
  ];
  function gallery(items, ctx, big) {
    var row = mk("div", "display:flex;gap:28px;flex-wrap:wrap;color:var(--stage-fg)");
    items.forEach(function (it) {
      var c = mk("div", "display:flex;flex-direction:column;align-items:center;gap:6px");
      var f = mk("div", BOX + ";" + (big ? "width:190px;height:142px" : "")); f.innerHTML = svg(it.s, 120, 96, "width:100%;height:100%");
      c.appendChild(f); c.appendChild(mk("div", "font-size:24px;color:var(--stage-dim)", pick(ctx, it.en, it.cs)));
      row.appendChild(c);
    });
    return row;
  }
  // a five-point star next to the figure it can become
  var STAR = '<path d="M60 8 L72 40 L106 42 L80 63 L89 96 L60 77 L31 96 L40 63 L14 42 L48 40 Z"/>';
  var FIGURE = '<circle cx="60" cy="14" r="10"/><path d="M60 24 L60 62 M60 32 L22 20 M60 32 L98 20 M60 62 L36 100 M60 62 L84 100"/>';

  Deck.module({
    id: "everyone-can-sketch",
    title: T("Everyone can sketch", "Skicovat umí každý"),
    slides: [
      { id: "intro", min: 2, title: T("Everyone can sketch: why", "Skicovat umí každý: proč"),
        body: T(
          "<h2>Everyone can sketch</h2><ul><li>Take away the pressure of drawing.</li><li>Show that anyone can sketch.</li><li>Use simple shapes to draw objects and ideas.</li><li>Warm up the hand.</li></ul><p class=\"dk-small\">Needs: a thick marker and a sheet of paper for each person. About 15 minutes.</p>",
          "<h2>Skicovat umí každý</h2><ul><li>Zbavit se tlaku z kreslení.</li><li>Ukázat, že skicovat umí kdokoli.</li><li>Kreslit předměty a nápady z jednoduchých tvarů.</li><li>Rozcvičit ruku.</li></ul><p class=\"dk-small\">Potřebujete: tlustý fix a list papíru pro každého. Asi 15 minut.</p>"),
        notes: T("<p>Explain the difference first: a sketch is supposed to be quick, rough and recognisable, not a painting.</p>",
                 "<p>Nejdřív vysvětlete rozdíl: skica má být rychlá, hrubá a poznatelná, není to malba.</p>") },

      { id: "shapes", min: 3, title: T("Everyone can sketch: simple shapes", "Skicovat umí každý: tvary"),
        notes: T("<p>Call the shapes one at a time and give about twenty seconds to each. Draw quickly, without thinking. The timer here is only a guide for the whole block.</p>",
                 "<p>Tvary zadávejte po jednom, na každý asi dvacet vteřin. Kreslete rychle, bez přemýšlení. Odpočet je jen orientace pro celý blok.</p>"),
        render: function (box, ctx) {
          box.appendChild(mk("h2", "", pick(ctx, "Draw these, fast", "Nakreslete rychle")));
          box.appendChild(gallery(SHAPES, ctx));
          return addTimer(box, ctx, 180, 64);
        } },

      { id: "objects", min: 4, title: T("Everyone can sketch: objects", "Skicovat umí každý: předměty"),
        notes: T("<p>Use only the shapes they have just drawn. Then show the examples if somebody is stuck.</p>",
                 "<p>Použijte jen tvary, které právě nakreslili. Příklady ukažte, kdyby někdo nevěděl, jak dál.</p>"),
        render: function (box, ctx) {
          box.appendChild(mk("h2", "", pick(ctx, "Now build things from those shapes", "Teď z těch tvarů poskládejte věci")));
          box.appendChild(mk("p", "font-size:30px", pick(ctx, "A house, a sailboat, a car and a truck.", "Dům, plachetnici, auto a nákladní auto.")));
          box.appendChild(gallery(OBJECTS, ctx));
          return addTimer(box, ctx, 240, 64);
        } },

      { id: "people", min: 3, title: T("Everyone can sketch: people", "Skicovat umí každý: lidé"),
        notes: T("<p>Draw a five-point star, then turn it into a figure: the top point becomes a head, the side points arms, the bottom points legs. Demonstrate on a flipchart.</p>",
                 "<p>Nakreslete pěticípou hvězdu a pak z ní udělejte postavu: horní cíp je hlava, boční cípy ruce, spodní nohy. Předveďte na flipchartu.</p>"),
        render: function (box, ctx) {
          box.appendChild(mk("h2", "", pick(ctx, "Now people: start with a star", "Teď lidé: začněte hvězdou")));
          var row = mk("div", "display:flex;gap:30px;align-items:center;color:var(--stage-fg)");
          var a = mk("div", "width:150px;height:150px"); a.innerHTML = svg(STAR, 120, 108, "width:100%;height:100%");
          var arrow = mk("div", "font-size:60px;color:var(--stage-hi)", "→");
          var b = mk("div", "width:150px;height:150px"); b.innerHTML = svg(FIGURE, 120, 108, "width:100%;height:100%");
          [a, arrow, b].forEach(function (n) { row.appendChild(n); });
          box.appendChild(row);
          box.appendChild(mk("p", "font-size:28px", pick(ctx, "Draw a five-point star, then turn it into a human figure.", "Nakreslete pěticípou hvězdu a pak z ní udělejte lidskou postavu.")));
          return addTimer(box, ctx, 180, 64);
        } },

      { id: "wrap", min: 3, title: T("Everyone can sketch: key ideas", "Skicovat umí každý: shrnutí"),
        body: T(
          "<h2>You can sketch your ideas now</h2><ul><li>Ugly is OK.</li><li>You sketch ideas, you do not paint the Mona Lisa.</li><li>Sketch quickly.</li><li>It is a learning process.</li></ul>",
          "<h2>Teď umíte skicovat své nápady</h2><ul><li>Ošklivé je v pořádku.</li><li>Skicujete nápady, nemalujete Monu Lisu.</li><li>Skicujte rychle.</li><li>Je to proces učení.</li></ul>"),
        notes: T("<p>Congratulate everyone and make sure they feel accomplished and ready to sketch more. Reflection: Which shape combinations surprised you? What was easier than you expected?</p>",
                 "<p>Všem pogratulujte a ujistěte se, že mají pocit úspěchu a chuť skicovat dál. Reflexe: Které kombinace tvarů vás překvapily? Co bylo snazší, než jste čekali?</p>") }
    ]
  });
})();
