#!/usr/bin/env node
/* Audit: does every slide fit in the 1280x720 slide area, inside its margins?
 *
 *   node scripts/audit_slides.js                 # every deck of the repo
 *   node scripts/audit_slides.js lectures/formgiving   # only decks whose address contains this text
 *
 * Needs Playwright (npm i playwright, or the one pre-installed in the Claude Code cloud environment).
 * github.io cannot be reached from a Claude session, so the pages are served from this folder under a faked address.
 * It opens each deck, steps through every slide in every language, and measures where the content really is.
 * The slide has margins (64 px at the sides, 58 px on top, 56 px at the bottom). A slide FAILS when content leaves that
 * safe area even after the engine's automatic shrinking, or when the engine gave up (it never shrinks below 0.55);
 * a slide is SHRUNK when the engine had to scale it down (below 0.8 is hard to read and worth splitting in two).
 * Exit code 1 when a slide fails. */
const fs = require("fs"), path = require("path");
const { chromium } = require("playwright");
const ROOT = path.resolve(__dirname, "..");
const BASE = "https://bremondr.github.io/teaching/";
const MIME = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".json": "application/json", ".md": "text/markdown", ".woff2": "font/woff2", ".png": "image/png", ".svg": "image/svg+xml", ".jpg": "image/jpeg", ".pdf": "application/pdf" };
const filter = process.argv[2] || "";
const SAFE = { top: 58, bottom: 720 - 56, left: 64, right: 1280 - 64 }, TOL = 6;   // design pixels
const SHRUNK_BELOW = 0.8;   // report slides the engine scaled below this

function items() {
  const out = [];
  for (const dir of ["lectures", "workshops", "templates"]) {
    const base = path.join(ROOT, dir);
    if (!fs.existsSync(base)) continue;
    for (const name of fs.readdirSync(base).sort()) {
      if (name.startsWith("_") || name.startsWith(".")) continue;
      if (fs.existsSync(path.join(base, name, "index.html"))) out.push(`${dir}/${name}/`);
    }
  }
  return out;
}

(async () => {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 720 } });
  await ctx.route(BASE + "**", (r) => {
    let rel = decodeURIComponent(new URL(r.request().url()).pathname.replace("/teaching/", ""));
    if (!rel || rel.endsWith("/")) rel += "index.html";
    const f = path.join(ROOT, rel);
    if (!fs.existsSync(f) || !fs.statSync(f).isFile()) return r.fulfill({ status: 404, body: "" });
    r.fulfill({ status: 200, contentType: MIME[path.extname(f)] || "application/octet-stream", body: fs.readFileSync(f) });
  });

  // slide geometry: where does any piece of content sit, in design pixels of the 1280x720 slide?
  const measure = () => {
    const slide = document.querySelector(".dk-slide"), inner = slide.querySelector(".dk-inner");
    const sr = slide.getBoundingClientRect(), k = sr.width / 1280;
    let top = 1e9, bottom = -1e9, left = 1e9, right = -1e9, n = 0;
    inner.querySelectorAll("*").forEach((e) => {
      if (e.children.length && !/^(P|LI|H1|H2|H3|TD|TH|BUTTON|A|SPAN)$/.test(e.tagName)) return;
      const r = e.getBoundingClientRect(); if (!r.width || !r.height) return;
      n++; top = Math.min(top, (r.top - sr.top) / k); bottom = Math.max(bottom, (r.bottom - sr.top) / k);
      left = Math.min(left, (r.left - sr.left) / k); right = Math.max(right, (r.right - sr.left) / k);
    });
    const fit = inner.dataset.fit ? parseFloat(inner.dataset.fit) : 1;
    return { n, top, bottom, left, right, fit, flagged: inner.dataset.overflow === "1", title: (inner.querySelector("h1,h2,h3,.dk-kick") || {}).textContent || "" };
  };

  const pages = [];
  for (const it of items()) {
    if (filter && !it.includes(filter)) continue;
    const p = await ctx.newPage(); await p.goto(BASE + it); await p.waitForTimeout(900);
    if (await p.locator(".dk-slide .dk-inner").count()) pages.push(it);
    else {  // a start page that lists its decks as links with ?v=
      const links = await p.$$eval('a[href^="?v="]', (as) => [...new Set(as.map((a) => a.getAttribute("href").split("&")[0].split("#")[0]))]);
      links.forEach((l) => pages.push(it + l));
    }
    await p.close();
  }

  let failed = 0, shrunk = 0, scaled = 0, minScale = 1, total = 0; const lines = [];
  for (const addr of pages) {
    if (filter && !(addr.includes(filter))) continue;
    const langs = await (async () => {
      const p = await ctx.newPage(); await p.goto(BASE + addr); await p.waitForSelector(".dk-slide .dk-inner"); await p.waitForTimeout(500);
      const l = await p.$$eval(".dk-bar button[data-lang]", (b) => b.map((x) => x.dataset.lang)); await p.close(); return l.length ? l : [null];
    })();
    for (const lang of langs) {
      const p = await ctx.newPage();
      await p.goto(BASE + addr + (lang ? (addr.includes("?") ? "&" : "?") + "lang=" + lang : "") + (addr.includes("?") || lang ? "&" : "?") + "theme=light&slides=dark");
      await p.waitForSelector(".dk-slide .dk-inner"); await p.waitForTimeout(700);
      const count = parseInt((await p.locator(".dk-count").innerText()).replace(/.*of\s+/, ""), 10);
      for (let i = 1; i <= count; i++) {
        await p.waitForTimeout(30);
        const m = await p.evaluate(measure); total++;
        const cut = m.n && (m.bottom > SAFE.bottom + TOL || m.top < SAFE.top - TOL || m.right > SAFE.right + TOL || m.left < SAFE.left - TOL);
        const tag = `${addr}${lang ? " [" + lang + "]" : ""} slide ${i}/${count}`;
        if (cut || m.flagged) { failed++; lines.push(`FAIL   ${tag}  "${m.title.trim().slice(0, 40)}"  content ${Math.round(m.top)}..${Math.round(m.bottom)} high, ${Math.round(m.left)}..${Math.round(m.right)} wide, scale ${m.fit}`); }
        else if (m.fit < SHRUNK_BELOW) { shrunk++; lines.push(`SHRUNK ${tag}  "${m.title.trim().slice(0, 40)}"  scale ${m.fit}`); }
        if (m.fit < 1) { scaled++; minScale = Math.min(minScale, m.fit); }
        if (i < count) await p.keyboard.press("ArrowRight");
      }
      await p.close();
    }
  }
  await browser.close();
  console.log(lines.join("\n"));
  console.log(`\n${total} slides checked in ${pages.length} decks: ${failed} do not fit, ${shrunk} shrunk below ${SHRUNK_BELOW}.`);
  console.log(`The engine scaled ${scaled} slides down to fit (smallest scale ${minScale}).`);
  process.exit(failed ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(2); });
