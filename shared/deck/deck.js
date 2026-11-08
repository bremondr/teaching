/* Shared deck engine for lectures and workshops.
 *
 * One engine, three views, two source formats:
 *   views    default (a viewer, also used inside an iframe with ?embed=1), #presenter (current slide, next
 *            slide, notes, timer, outline), #slide (the projector window, follows the presenter)
 *   sources  Markdown (lectures) or JS slide objects (interactive workshops and exercises)
 *   include  a slide can pull in another deck module or Markdown file, so an exercise is a
 *            native part of the host deck (one timer, one set of keys, one projector window)
 *
 * Usage, see README.md in this folder:
 *   Deck.start({ title, channel, langs: ["en", "cs"], source: "deck.md" });
 *   Deck.start({ title, channel, slides: [ { id, title, body, notes, min, render } ] });
 *   Deck.module({ id, title, slides: [...] });      // in a file that other decks include
 * Plain script, no build step, works from a file or from GitHub Pages.
 */
(function () {
  "use strict";
  var W = 1280, H = 720;
  var api = { modules: {}, start: start, module: defineModule, parseMarkdown: parseMarkdown };
  window.Deck = api;

  function el(tag, cls, text) { var e = document.createElement(tag); if (cls) e.className = cls; if (text !== undefined) e.textContent = text; return e; }
  function clamp(n, a, b) { return Math.max(a, Math.min(b, n)); }
  function fmt(sec) { var s = Math.abs(Math.round(sec)); return Math.floor(s / 60) + ":" + String(s % 60).padStart(2, "0"); }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }

  // a value that may be a string, a {lang: string} object or a function of the language
  function loc(v, lang, langs) {
    if (v == null) return "";
    if (typeof v === "function") return v(lang);
    if (typeof v === "string") return v;
    if (v[lang] != null) return v[lang];
    for (var i = 0; i < (langs || []).length; i++) if (v[langs[i]] != null) return v[langs[i]];
    return "";
  }

  // ---------- Markdown slides ----------
  // Slides are separated by a line with only ---.
  // "::: cs" ... ":::" is shown only in that language; text outside blocks is shown in every language.
  // "::: notes" ... ":::" (or "::: notes cs") are speaker notes, not shown on the slide.
  function render(md, base) {
    var html;
    if (window.marked) html = window.marked.parse(md);
    else html = "<pre>" + esc(md) + "</pre>";
    if (window.DOMPurify) html = window.DOMPurify.sanitize(html);
    return html;
  }
  function parseMarkdown(text, langs, base) {
    var slides = [], cur = fresh();
    function fresh() { var b = {}, n = {}; langs.forEach(function (l) { b[l] = []; n[l] = []; }); return { b: b, n: n }; }
    function flush() {
      var any = langs.some(function (l) { return cur.b[l].join("").trim() || cur.n[l].join("").trim(); });
      if (any) {
        var s = { body: {}, notes: {}, title: {}, base: base };
        langs.forEach(function (l) {
          var md = cur.b[l].join("\n");
          s.body[l] = render(md, base);
          s.notes[l] = cur.n[l].join("").trim() ? render(cur.n[l].join("\n"), base) : "";
          var h = /^#{1,3}\s+(.+)$/m.exec(md);
          s.title[l] = h ? h[1].replace(/[*_`]/g, "").trim() : "";
        });
        slides.push(s);
      }
      cur = fresh();
    }
    var block = null;
    text.replace(/\r\n?/g, "\n").split("\n").forEach(function (line) {
      var m;
      if (!block && /^---\s*$/.test(line)) { flush(); return; }
      if (!block && (m = /^:::\s*([\w-]+)(?:\s+([\w-]+))?\s*$/.exec(line))) {
        block = m[1] === "notes" ? { notes: true, lang: m[2] || null } : { lang: m[1] };
        return;
      }
      if (block && /^:::\s*$/.test(line)) { block = null; return; }
      var target = block && block.notes ? cur.n : cur.b;
      var ls = block && block.lang ? (langs.indexOf(block.lang) >= 0 ? [block.lang] : []) : langs;
      ls.forEach(function (l) { target[l].push(line); });
    });
    flush();
    return slides;
  }

  // ---------- modules and includes ----------
  var loadingModule = null;
  function defineModule(def) { if (loadingModule) api.modules[loadingModule] = def; return def; }
  function loadScript(url) {
    return new Promise(function (resolve, reject) {
      if (api.modules[url]) return resolve(api.modules[url]);
      loadingModule = url;
      var s = document.createElement("script");
      s.src = url;
      s.onload = function () { loadingModule = null; api.modules[url] ? resolve(api.modules[url]) : reject(new Error(url + " did not call Deck.module()")); };
      s.onerror = function () { loadingModule = null; reject(new Error("Could not load " + url)); };
      document.head.appendChild(s);
    });
  }
  function expand(slides, cfg, prefix, depth) {
    if (depth > 4) return Promise.reject(new Error("includes are nested too deeply"));
    var out = [], chain = Promise.resolve();
    slides.forEach(function (s, i) {
      chain = chain.then(function () {
        if (!s.include) { out.push(Object.assign({}, s, { id: prefix + (s.id || "s" + (out.length + 1)) })); return; }
        var url = new URL(s.include, location.href).href, pid = prefix + (s.id || "inc" + i) + "/";
        if (/\.md($|\?)/i.test(url)) {
          return fetch(url).then(function (r) { if (!r.ok) throw new Error("Could not load " + url); return r.text(); })
            .then(function (t) { return expand(parseMarkdown(t, cfg.langs, url), cfg, pid, depth + 1); })
            .then(function (list) { out.push.apply(out, list); });
        }
        return loadScript(url).then(function (mod) {
          var list = (mod.slides || []).map(function (m) { return Object.assign({ base: url }, m); });
          return expand(list, cfg, pid, depth + 1);
        }).then(function (list) { out.push.apply(out, list); });
      });
    });
    return chain.then(function () { return out; });
  }

  // ---------- stage: a 1280x720 slide scaled to its container ----------
  function makeStage() {
    var stage = el("div", "dk-stage"), frame = el("div", "dk-frame"), slide = el("div", "dk-slide");
    frame.appendChild(slide); stage.appendChild(frame);
    function fit() {
      var w = stage.clientWidth, h = stage.clientHeight; if (!w || !h) return;
      var k = Math.min(w / W, h / H);
      slide.style.transform = "scale(" + k + ")"; frame.style.width = Math.floor(W * k) + "px"; frame.style.height = Math.floor(H * k) + "px";
    }
    if (window.ResizeObserver) new ResizeObserver(fit).observe(stage); else window.addEventListener("resize", fit);
    stage.slideEl = slide; stage.fit = fit;
    return stage;
  }

  // ---------- the app ----------
  function start(cfg) {
    cfg = Object.assign({ root: "#deck", title: document.title, channel: "deck", langs: ["en"], lang: null }, cfg);
    var root = typeof cfg.root === "string" ? document.querySelector(cfg.root) : cfg.root;
    root.classList.add("dk-root");
    root.textContent = "";
    root.appendChild(el("div", "dk-loading", "Loading…"));
    var q = new URLSearchParams(location.search);
    var hash = location.hash;
    var mode = hash === "#slide" ? "slide" : (hash === "#presenter" ? "presenter" : "view");
    var embed = q.get("embed") === "1";
    if (embed) root.classList.add("dk-embed", "dk-hover");
    var stored = null; try { stored = localStorage.getItem("deck-lang:" + cfg.channel); } catch (e) {}
    var lang = [q.get("lang"), stored, cfg.lang, cfg.langs[0]].filter(function (l) { return l && cfg.langs.indexOf(l) >= 0; })[0];
    var S = { seq: [], si: 0 };
    var CID = Math.random().toString(36).slice(2, 8), chan = null, lastId = "", lastAck = 0, gotSync = false, bcT = null;
    var tm = { acc: 0, at: null };
    var ui = {};

    var source;
    if (cfg.slides) source = Promise.resolve(cfg.slides);
    else if (cfg.source) {
      var url = new URL(cfg.source, location.href).href;
      source = fetch(url).then(function (r) { if (!r.ok) throw new Error("Could not load " + url); return r.text(); }).then(function (t) { return parseMarkdown(t, cfg.langs, url); });
    } else source = Promise.reject(new Error("Deck.start needs source or slides"));

    return source.then(function (list) { return expand(list, cfg, "", 0); }).then(function (seq) {
      if (!seq.length) throw new Error("The deck has no slides");
      S.seq = seq;
      var want = q.get("s"), i = -1;
      if (want) { i = seq.findIndex(function (s) { return s.id === want; }); if (i < 0 && /^\d+$/.test(want)) i = +want - 1; }
      S.si = clamp(i, 0, seq.length - 1);
      api.go = go; api.goTo = function (id) { goIndex(S.seq.findIndex(function (s) { return s.id === id; })); };
      api.getLang = function () { return lang; }; api.setLang = setLang;
      build(); wire(); renderAll();
      return api;
    }).catch(function (e) {
      root.textContent = ""; root.appendChild(el("div", "dk-loading", "Could not start the deck: " + e.message));
      throw e;
    });

    // ----- helpers -----
    function title(s, i) { return loc(s.title, lang, cfg.langs) || "Slide " + (i + 1); }
    function show(stage, s, preview) {
      if (stage.cleanup) { try { stage.cleanup(); } catch (e) {} stage.cleanup = null; }
      var box = stage.slideEl; box.textContent = ""; box.lang = lang;
      var inner = el("div", "dk-inner"); box.appendChild(inner);
      if (!s) return;
      if (typeof s.render === "function") {
        var r = s.render(inner, { lang: lang, slide: s, deck: api, mode: mode, preview: !!preview });
        if (typeof r === "function") stage.cleanup = r;
      } else {
        inner.innerHTML = loc(s.body, lang, cfg.langs);
        inner.querySelectorAll("img,source,video,audio").forEach(function (n) {
          var v = n.getAttribute("src");
          if (v && !/^([a-z][a-z0-9+.-]*:|\/\/|#)/i.test(v)) n.setAttribute("src", new URL(v, s.base || location.href).href);
        });
      }
      stage.fit();
    }
    function planStart(i) { var t = 0; for (var k = 0; k < i; k++) t += (S.seq[k].min || 0) * 60; return t; }
    function planTotal() { return planStart(S.seq.length); }
    function elapsed() { return tm.acc + (tm.at ? (Date.now() - tm.at) / 1000 : 0); }

    // ----- build the DOM for the current mode -----
    function build() {
      root.textContent = "";
      var multi = cfg.langs.length > 1;
      if (mode === "slide") {
        ui.stage = makeStage(); root.appendChild(ui.stage);
        return;
      }
      if (mode === "presenter") {
        var grid = el("div", "dk-pgrid"), left = el("div", "dk-pleft"), right = el("div", "dk-pright");
        ui.stage = makeStage(); left.appendChild(ui.stage);
        var r1 = el("div", "dk-row");
        ui.prev = el("button", "", "◀ Back"); ui.next = el("button", "", "Next ▶");
        ui.count = el("span", "dk-count"); ui.count.setAttribute("aria-live", "polite");
        ui.open = el("button", "", "Open slide window"); ui.fs = el("button", "", "Fullscreen preview");
        [ui.prev, ui.next, ui.count, ui.open, ui.fs].forEach(function (n) { r1.appendChild(n); });
        var r2 = el("div", "dk-row");
        ui.clock = el("span", "dk-clock", "0:00"); ui.go = el("button", "", "Start"); ui.reset = el("button", "", "Reset");
        ui.late = el("span", "dk-late");
        [ui.clock, ui.go, ui.reset, ui.late].forEach(function (n) { r2.appendChild(n); });
        left.appendChild(r1); left.appendChild(r2);
        if (multi) { ui.langs = langButtons(); left.appendChild(ui.langs); }
        ui.status = el("div", "dk-status"); left.appendChild(ui.status);
        ui.next2 = makeStage(); right.appendChild(el("div", "dk-status", "Next slide")); right.appendChild(ui.next2);
        ui.notes = el("div", "dk-notes"); right.appendChild(ui.notes);
        ui.outline = el("div", "dk-outline"); right.appendChild(ui.outline);
        grid.appendChild(left); grid.appendChild(right); root.appendChild(grid);
        return;
      }
      ui.stage = makeStage(); root.appendChild(ui.stage);
      var bar = el("div", "dk-bar");
      ui.prev = el("button", "", "◀"); ui.prev.setAttribute("aria-label", "Previous slide");
      ui.next = el("button", "", "▶"); ui.next.setAttribute("aria-label", "Next slide");
      ui.count = el("span", "dk-count"); ui.count.setAttribute("aria-live", "polite");
      ui.ttl = el("span", "dk-title dk-grow");
      bar.appendChild(ui.prev); bar.appendChild(ui.next); bar.appendChild(ui.count); bar.appendChild(ui.ttl);
      if (multi) { ui.langs = langButtons(); bar.appendChild(ui.langs); }
      ui.fs = el("button", "", "Fullscreen"); bar.appendChild(ui.fs);
      if (!embed) { ui.pres = el("a", "", "Presenter view"); ui.pres.href = "#presenter"; ui.pres.target = "_blank"; ui.pres.rel = "noopener"; bar.appendChild(ui.pres); }
      root.appendChild(bar);
    }
    function langButtons() {
      var box = el("div", "dk-row");
      cfg.langs.forEach(function (l) {
        var b = el("button", "", l.toUpperCase()); b.dataset.lang = l; b.setAttribute("aria-label", "Language " + l);
        b.addEventListener("click", function () { setLang(l); });
        box.appendChild(b);
      });
      return box;
    }

    // ----- rendering -----
    function renderAll() {
      var s = S.seq[S.si];
      show(ui.stage, s, false);
      if (ui.count) ui.count.textContent = "Slide " + (S.si + 1) + " of " + S.seq.length;
      if (ui.prev) ui.prev.disabled = S.si <= 0;
      if (ui.next) ui.next.disabled = S.si >= S.seq.length - 1;
      if (ui.ttl) ui.ttl.textContent = title(s, S.si);
      if (ui.langs) ui.langs.querySelectorAll("button").forEach(function (b) { b.setAttribute("aria-pressed", String(b.dataset.lang === lang)); });
      if (mode === "presenter") {
        show(ui.next2, S.seq[S.si + 1] || null, true);
        ui.notes.innerHTML = loc(s.notes, lang, cfg.langs);
        ui.outline.textContent = "";
        S.seq.forEach(function (x, i) {
          var b = el("button", "", (i + 1) + ". " + title(x, i)); if (i === S.si) b.setAttribute("aria-current", "true");
          b.addEventListener("click", function () { goIndex(i); }); ui.outline.appendChild(b);
        });
        var cur = ui.outline.querySelector("[aria-current]"); if (cur && cur.scrollIntoView) cur.scrollIntoView({ block: "nearest" });
        tick();
      }
      document.documentElement.lang = lang;
      if (mode === "view") { try { var u = new URL(location.href); u.searchParams.set("s", s.id); history.replaceState(null, "", u); } catch (e) {} }
    }
    function goIndex(i) {
      i = clamp(i, 0, S.seq.length - 1); if (i === S.si) return;
      S.si = i; renderAll(); broadcast();
    }
    function go(d) { goIndex(S.si + d); }
    function setLang(l) {
      if (cfg.langs.indexOf(l) < 0 || l === lang) return;
      lang = l; try { localStorage.setItem("deck-lang:" + cfg.channel, l); } catch (e) {}
      renderAll(); broadcast();
    }
    // ----- timer (presenter) -----
    function tick() {
      if (mode !== "presenter" || !ui.clock) return;
      var e = elapsed(); ui.clock.textContent = fmt(e); ui.go.textContent = tm.at ? "Pause" : "Start";
      var tot = planTotal();
      if (tot > 0) {
        var diff = e - planStart(S.si), behind = diff > 0;
        ui.late.className = "dk-late " + (behind ? "dk-behind" : "dk-ahead");
        ui.late.textContent = (S.seq[S.si].min ? S.seq[S.si].min + " min planned · " : "") + (e === 0 ? "" : fmt(diff) + (behind ? " behind" : " ahead") + " · ") + "plan " + fmt(tot) + " in total";
      } else ui.late.textContent = "";
    }

    // ----- presenter and slide window sync -----
    function model() { return { id: S.seq[S.si].id, lang: lang }; }
    function post(msg) {
      msg.id = CID + ":" + Date.now() + ":" + Math.random().toString(36).slice(2, 6);
      if (chan) { try { chan.postMessage(msg); } catch (e) {} }
      try { localStorage.setItem("deck-msg:" + cfg.channel, JSON.stringify(msg)); } catch (e) {}
    }
    function broadcast() { if (mode !== "presenter") return; clearTimeout(bcT); bcT = setTimeout(function () { post({ type: "sync", model: model() }); }, 20); }
    function onMsg(m) {
      if (!m || !m.type || m.id === lastId) return; lastId = m.id;
      if (mode === "slide" && m.type === "sync") {
        gotSync = true;
        var i = S.seq.findIndex(function (s) { return s.id === m.model.id; });
        if (cfg.langs.indexOf(m.model.lang) >= 0) lang = m.model.lang;
        if (i >= 0) S.si = i;
        renderAll(); post({ type: "ack" });
      } else if (mode === "presenter" && m.type === "hello") { post({ type: "sync", model: model() }); lastAck = Date.now(); status(); }
      else if (mode === "presenter" && m.type === "ack") { lastAck = Date.now(); status(); }
      else if (mode === "presenter" && m.type === "nav") go(m.d);
      else if (mode === "presenter" && m.type === "lang") setLang(m.lang);
    }
    function status() {
      if (!ui.status) return; var ok = Date.now() - lastAck < 7000;
      ui.status.textContent = ok ? "Slide window: connected" : "Slide window: not connected. Press “Open slide window”.";
      ui.status.className = "dk-status" + (ok ? " dk-ok" : "");
    }
    function toggleFs() { try { if (document.fullscreenElement) document.exitFullscreen(); else (mode === "presenter" ? ui.stage : root).requestFullscreen(); } catch (e) {} }

    function wire() {
      try { chan = new BroadcastChannel("deck-" + cfg.channel); chan.onmessage = function (ev) { onMsg(ev.data); }; } catch (e) {}
      window.addEventListener("storage", function (ev) { if (ev.key === "deck-msg:" + cfg.channel && ev.newValue) { try { onMsg(JSON.parse(ev.newValue)); } catch (e) {} } });
      if (ui.prev) ui.prev.addEventListener("click", function () { go(-1); });
      if (ui.next) ui.next.addEventListener("click", function () { go(1); });
      if (ui.fs) ui.fs.addEventListener("click", toggleFs);
      if (ui.open) ui.open.addEventListener("click", function () {
        try { window.open(location.href.split("#")[0].replace(/[?&]s=[^&#]*/, "") + "#slide", "deck-slide-" + cfg.channel, "popup,width=1280,height=720"); } catch (e) {}
        post({ type: "hello" }); setTimeout(status, 1500);
      });
      if (ui.go) ui.go.addEventListener("click", function () { if (tm.at) { tm.acc += (Date.now() - tm.at) / 1000; tm.at = null; } else tm.at = Date.now(); tick(); });
      if (ui.reset) ui.reset.addEventListener("click", function () { tm = { acc: 0, at: null }; tick(); });
      document.addEventListener("keydown", function (e) {
        if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA" || e.ctrlKey || e.metaKey || e.altKey) return;
        var k = e.key, nav = null;
        if (k === "ArrowRight" || k === " " || k === "PageDown") nav = 1; else if (k === "ArrowLeft" || k === "PageUp") nav = -1;
        if (nav !== null) {
          e.preventDefault();
          if (mode === "slide" && gotSync) post({ type: "nav", d: nav }); else go(nav);
        } else if (k === "Home") goIndex(0); else if (k === "End") goIndex(S.seq.length - 1);
        else if (k === "f" || k === "F") toggleFs();
        else if ((k === "l" || k === "L") && cfg.langs.length > 1) {
          var nl = cfg.langs[(cfg.langs.indexOf(lang) + 1) % cfg.langs.length];
          if (mode === "slide" && gotSync) post({ type: "lang", lang: nl }); else setLang(nl);
        }
      });
      if (mode === "presenter") { setInterval(tick, 250); setInterval(status, 2500); status(); }
      if (mode === "slide") { post({ type: "hello" }); setInterval(function () { post({ type: gotSync ? "ack" : "hello" }); }, 2500); }
      window.addEventListener("hashchange", function () { location.reload(); });
    }
  }
})();
