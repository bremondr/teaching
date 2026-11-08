// Devil's 8s: eight anti-solutions in eight minutes, drawn on a folded sheet (English and Czech).
// Include it in another deck with:  { id: "devils", include: "../../templates/devils-8s/exercise.js" }
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
  var challenge = "";   // typed on the challenge slide, shown again on the drawing slide

  // A sheet folded three times = 8 rectangles (4 x 2)
  function foldSvg() {
    var s = '<rect x="10" y="10" width="300" height="160"/><path d="M85 10 L85 170 M160 10 L160 170 M235 10 L235 170 M10 90 L310 90"/>';
    for (var i = 1; i <= 8; i++) s += '<text x="' + (10 + ((i - 1) % 4) * 75 + 37) + '" y="' + (10 + Math.floor((i - 1) / 4) * 80 + 52) + '" fill="currentColor" stroke="none" font-size="30" text-anchor="middle" font-family="sans-serif">' + i + "</text>";
    return svg(s, 320, 180, "width:100%;height:100%").replace('stroke-width="5"', 'stroke-width="3"');
  }

  Deck.module({
    id: "devils-8s",
    title: T("Devil's 8s", "Ďáblova osmička"),
    slides: [
      { id: "intro", min: 1, title: T("Devil's 8s: anti-solutions", "Ďáblova osmička: antiřešení"),
        body: T(
          "<h2>Devil's 8s</h2><ul><li>Unlock creativity.</li><li>Lose the fear of bad ideas.</li></ul><p><b>Anti-solution:</b> a solution that brings the opposite of the result we want.</p><p class=\"dk-small\">Needs: a pen and a sheet of paper. 8 minutes of drawing plus about 2 of talking.</p>",
          "<h2>Ďáblova osmička</h2><ul><li>Odemknout kreativitu.</li><li>Zbavit se strachu ze špatných nápadů.</li></ul><p><b>Antiřešení:</b> řešení, které přinese pravý opak toho, co chceme.</p><p class=\"dk-small\">Potřebujete: pero a list papíru. 8 minut kreslení a asi 2 minuty diskuse.</p>"),
        notes: T("<p>The point is permission to be ridiculous. Ideas may be useless; sometimes an interesting one turns up.</p>",
                 "<p>Smyslem je dovolení být směšný. Nápady mohou být k ničemu; občas se ale objeví zajímavý.</p>") },

      { id: "challenge", min: 1, title: T("Devil's 8s: the challenge", "Ďáblova osmička: výzva"),
        notes: T("<p>Revisit the problem the group is working on and type it here, so it stays visible while they draw.</p>",
                 "<p>Připomeňte problém, na kterém skupina pracuje, a napište ho sem, aby zůstal vidět při kreslení.</p>"),
        render: function (box, ctx) {
          box.appendChild(mk("h2", "", pick(ctx, "What is our challenge?", "Jaká je naše výzva?")));
          if (ctx.preview) { box.appendChild(mk("p", "", challenge || pick(ctx, "(type the challenge here)", "(sem napište výzvu)"))); return; }
          var ta = mk("textarea", "font:inherit;font-size:34px;width:100%;height:220px;padding:14px;background:color-mix(in srgb, var(--stage-fg) 10%, transparent);color:var(--stage-fg);border:1px solid color-mix(in srgb, var(--stage-fg) 28%, transparent);border-radius:8px");
          ta.id = "challenge-text"; ta.value = challenge; ta.placeholder = pick(ctx, "How might we...?", "Jak bychom mohli...?");
          ta.addEventListener("input", function () { challenge = ta.value; });
          box.appendChild(ta);
          box.appendChild(mk("p", "font-size:26px;color:var(--stage-dim)", pick(ctx, "Then: how would we make it worse on purpose?", "A pak: jak bychom to schválně zhoršili?")));
        } },

      { id: "fold", min: 1, title: T("Devil's 8s: fold the sheet", "Ďáblova osmička: přeložte list"),
        notes: T("<p>Fold the sheet in half three times, unfold it: eight rectangles.</p>", "<p>List třikrát přeložte napůl a rozložte: osm obdélníků.</p>"),
        render: function (box, ctx) {
          box.appendChild(mk("h2", "", pick(ctx, "Fold the paper in half three times", "Přeložte papír třikrát napůl")));
          var f = mk("div", "width:480px;height:270px;color:var(--stage-fg)"); f.innerHTML = foldSvg(); box.appendChild(f);
          box.appendChild(mk("p", "font-size:30px", pick(ctx, "You get 8 rectangles: one anti-solution in each.", "Vznikne 8 obdélníků: do každého jedno antiřešení.")));
        } },

      timerSlide({ id: "draw", min: 8, seconds: 480, size: 110, title: T("Devil's 8s: draw", "Ďáblova osmička: kreslíme"),
        heading: T("8 anti-solutions in 8 minutes", "8 antiřešení za 8 minut"),
        text: { en: "Draw eight different ways to get the <b>opposite</b> of what we want.", cs: "Nakreslete osm různých způsobů, jak dosáhnout <b>opaku</b> toho, co chceme." },
        extra: function (box, ctx) {
          if (challenge) box.appendChild(mk("p", "font-size:28px;color:var(--stage-hi)", pick(ctx, "Challenge: ", "Výzva: ") + challenge));
        },
        notes: T("<p>Keep the pace: one drawing a minute. Quantity matters, quality does not.</p>", "<p>Držte tempo: jedna kresba za minutu. Záleží na množství, ne na kvalitě.</p>") }),

      { id: "discuss", min: 2, title: T("Devil's 8s: discuss", "Ďáblova osmička: diskuse"),
        body: T(
          "<h2>Discuss</h2><ul><li>Share your most extreme anti-solutions.</li><li>Which one is the most evil?</li><li>Did any of them hide a useful idea?</li></ul>",
          "<h2>Diskuse</h2><ul><li>Ukažte svá nejextrémnější antiřešení.</li><li>Které je nejďábelštější?</li><li>Ukrývalo některé užitečný nápad?</li></ul>"),
        notes: T("<p>Expected outcome: eight ridiculous ideas and a group that can propose ideas without fear of sounding silly. Optional follow-up: turn the best anti-solution upside down.</p>",
                 "<p>Očekávaný výsledek: osm směšných nápadů a skupina, která umí navrhovat nápady bez strachu, že zní hloupě. Volitelně: nejlepší antiřešení obraťte naruby.</p>") }
    ]
  });
})();
