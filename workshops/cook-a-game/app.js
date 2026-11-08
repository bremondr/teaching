// Facilitator app engine: plan view, presenter view, slide window, timers, team maker, notes.
// Content lives in content.js. State is kept in this browser (localStorage); nothing is sent anywhere.
const CID = Math.random().toString(36).slice(2, 8);
let state = null, cfg = { students: 20, size: 4, mode: "count", presenter: "Ondra Brém", affil: "Czech Technical University in Prague" }, comments = {}, openSet = new Set();
let mode = "plan", revealed = new Set(), chan = null, lastId = "", lastAck = 0, gotModel = false, bcT = null, skipSet = new Set(), ref = null, refCfg = null, comCol = null, replies = {}, sreplies = {}, dirty = new Set(), pendingScript = false, rev = "", saveT = null, cfgT = null, comT = null;
const $ = id => document.getElementById(id);
const byId = Object.fromEntries(B.map(b => [b.id, b]));
function el(tag, cls, text) { const e = document.createElement(tag); if (cls) e.className = cls; if (text !== undefined) e.textContent = text; return e; }

// ---------- plan state ----------
function defaults(p) {
  const st = { preset: p, order: B.map(b => b.id), b: {} };
  for (const b of B) st.b[b.id] = { on: p === "90" ? b.m90 > 0 : !b.off, min: p === "90" ? (b.m90 || b.m) : b.m, note: "" };
  return st;
}
function loadPreset(p) {
  const keep = state, d = defaults(p);
  for (const id of d.order) d.b[id].note = keep.b[id].note;
  d.order = keep.order.slice(); state = d; render(); save();
}
function normalise(st) {
  const base = defaults("180");
  if (!st || !Array.isArray(st.order)) return base;
  const order = st.order.filter(id => byId[id]); for (const b of B) if (!order.includes(b.id)) order.push(b.id);
  const out = { preset: st.preset || "custom", order, b: {} };
  for (const b of B) { const s = (st.b || {})[b.id] || {}; out.b[b.id] = { on: s.on !== undefined ? !!s.on : base.b[b.id].on, min: Number.isFinite(s.min) ? s.min : base.b[b.id].min, note: typeof s.note === "string" ? s.note : "" }; }
  return out;
}
function fmt(m) { return Math.floor(m / 60) + ":" + String(m % 60).padStart(2, "0"); }
function plan() {
  let t = 0; const rows = [];
  for (const id of state.order) {
    const s = state.b[id], b = byId[id];
    if (b.outside) continue;
    if (s.on) { rows.push({ id, title: b.title, start: t, end: t + s.min, min: s.min, note: s.note }); t += s.min; }
  }
  return { rows, total: t };
}
function budget() { return state.preset === "90" ? 90 : 180; }
function change() { broadcast(); state.preset = (state.preset === "90" || state.preset === "180") ? state.preset : "custom"; render(); save(); }

function list(items, title) {
  if (!items || !items.length) return null;
  const d = el("div"); d.appendChild(el("h3", "", title)); const u = el("ul");
  for (const t of items) u.appendChild(el("li", "", t)); d.appendChild(u); return d;
}
function render() {
  const root = $("root"); root.textContent = "";
  const p = plan(); const times = {}; for (const r of p.rows) times[r.id] = r;
  root.appendChild(el("h2", "", "Before the workshop")); const l0 = el("div", "list"); root.appendChild(l0); l0.appendChild(card("before", times, false));
  root.appendChild(el("h2", "", "The workshop")); const l1 = el("div", "list"); root.appendChild(l1);
  const ids = state.order.filter(id => !byId[id].outside);
  ids.forEach((id, i) => l1.appendChild(card(id, times, true, i === 0, i === ids.length - 1)));
  const bud = budget(), left = bud - p.total;
  $("tot").textContent = p.total + " min planned of " + bud;
  const f = $("free"); f.className = left < 0 ? "over-t" : "ok";
  f.textContent = left === 0 ? "exactly on time" : left > 0 ? left + " min free" : -left + " min over";
  $("meter").className = "meter" + (left < 0 ? " over" : "");
  $("meter").firstElementChild.style.width = Math.min(100, Math.round(p.total / bud * 100)) + "%";
  for (const b of document.querySelectorAll("#presets .btn")) b.setAttribute("aria-pressed", b.dataset.p === state.preset);
  renderSupplies();
}
function card(id, times, movable, isFirst, isLast) {
  const b = byId[id], s = state.b[id], open = openSet.has(id);
  const c = el("div", "blk " + (s.on ? "on" : "off"));
  const h = el("div", "head");
  const tog = el("button", "tog", "✓"); tog.type = "button"; tog.setAttribute("aria-pressed", s.on); tog.setAttribute("aria-label", (s.on ? "Leave out " : "Include ") + b.title);
  tog.addEventListener("click", () => { s.on = !s.on; change(); });
  const mid = el("div"); mid.appendChild(el("div", "ttl", b.title));
  const t = times[id];
  mid.appendChild(el("div", "when", b.outside ? s.min + " min before students arrive" : t ? fmt(t.start) + " to " + fmt(t.end) : "left out"));
  if (b.opt) mid.appendChild(el("div", "nprev", "Optional: the Slides view offers to skip it when the clock is more than " + b.opt + " min behind"));
  if (s.note) mid.appendChild(el("div", "nprev", (replies[id] ? "✓ " : "") + "Note: " + (s.note.length > 90 ? s.note.slice(0, 90) + "…" : s.note)));
  h.appendChild(tog); h.appendChild(mid);
  if (movable) {
    const mv = el("div", "moves");
    const up = el("button", "mini", "▲"); up.type = "button"; up.disabled = isFirst; up.setAttribute("aria-label", "Move up");
    const dn = el("button", "mini", "▼"); dn.type = "button"; dn.disabled = isLast; dn.setAttribute("aria-label", "Move down");
    up.addEventListener("click", () => move(id, -1)); dn.addEventListener("click", () => move(id, 1));
    mv.appendChild(up); mv.appendChild(dn); h.appendChild(mv);
  } else h.appendChild(el("span"));
  c.appendChild(h);
  const ctl = el("div", "ctl");
  for (const d of [-5, -1]) ctl.appendChild(step(id, d));
  ctl.appendChild(el("span", "val", s.min + " min"));
  for (const d of [1, 5]) ctl.appendChild(step(id, d));
  const show = el("button", "mini show", open ? "Hide script" : "Script and note"); show.type = "button"; show.setAttribute("aria-expanded", open);
  show.addEventListener("click", () => { open ? openSet.delete(id) : openSet.add(id); render(); });
  ctl.appendChild(show); c.appendChild(ctl);
  if (open) {
    const d = el("div", "detail");
    const sy = list(b.say, "Say"); if (sy) d.appendChild(sy);
    if (b.es) { const e = el("div"); e.appendChild(el("h3", "", "In Spanish (check before use)")); e.appendChild(el("div", "es", b.es)); d.appendChild(e); }
    const dd = list(b.do, "Do"); if (dd) d.appendChild(dd);
    const tp = list(b.tips, "Tips"); if (tp) d.appendChild(tp);
    if (b.mats) { const m = el("div"); m.appendChild(el("h3", "", "Materials")); m.appendChild(el("div", "", b.mats)); d.appendChild(m); }
    if (b.open) { const o = el("div", "open"); o.appendChild(el("h3", "", "Open question")); o.appendChild(el("div", "", b.open)); d.appendChild(o); }
    const n = el("div"); n.appendChild(el("h3", "", "Your note"));
    const ta = document.createElement("textarea"); ta.id = "note-" + id; ta.value = s.note; ta.setAttribute("aria-label", "Note for " + b.title);
    ta.addEventListener("input", () => { s.note = ta.value; pendingScript = true; clearTimeout(saveT); saveT = setTimeout(save, 600); });
    ta.addEventListener("blur", () => { if (pendingScript) save(); });
    n.appendChild(ta); d.appendChild(n);
    if (replies[id]) { const r = el("div", "reply"); r.appendChild(el("h3", "", "Claude's answer")); r.appendChild(el("div", "", replies[id])); d.appendChild(r); }
    c.appendChild(d);
  }
  return c;
}
function step(id, d) {
  const b = el("button", "mini", (d > 0 ? "+" : "−") + Math.abs(d)); b.type = "button"; b.setAttribute("aria-label", (d > 0 ? "Add " : "Remove ") + Math.abs(d) + " minutes");
  b.addEventListener("click", () => { const s = state.b[id]; s.min = Math.max(1, Math.min(120, s.min + d)); change(); });
  return b;
}
function move(id, dir) {
  const o = state.order, i = o.indexOf(id); let j = i + dir;
  while (j >= 0 && j < o.length && byId[o[j]].outside) j += dir;
  if (j < 0 || j >= o.length) return;
  o.splice(i, 1); o.splice(j, 0, id); change();
}
function teamCount() { return Math.max(1, Math.round(cfg.students / cfg.size)); }
function renderSupplies() {
  const T = teamCount(), N = cfg.students, s = $("supplies"); s.textContent = "";
  s.appendChild(el("h2", "", "Supplies for the whole workshop"));
  const c = el("div", "sup");
  c.appendChild(el("div", "sm", "Worked out for " + N + " students in " + T + " teams. Change the numbers on the team slide and this list follows."));
  const u = el("ul");
  const items = [
    ["Index cards", 40 * T + " (about 40 per team)"],
    ["Sticky notes", "3 colours: yellow (setting), green (thing), pink (audience), " + (N + 10) + " of each, one note per student per colour plus spares"],
    ["Team slips", "the printed sheets team-slips.pdf, 72 slips with fruit and vegetable pictures, cut out (" + N + " are used, the rest are spares for late students)"],
    ["Markers", 4 * T + 2 + " (4 per team and 2 for you), in different colours"],
    ["Pens or pencils", N + " (one each)"],
    ["Tokens: coins, beans, buttons", "about 20 per team, " + 20 * T + " in all"],
    ["Blank A4 paper", 10 * T + " sheets, for boards and notes"],
    ["Scissors", T + " (one per team)"],
    ["Tape", T + " rolls, plus masking tape for the walls"],
    ["Flipchart paper sheets", T + 1 + " to " + (2 * T + 1) + " taped to the wall, no stands needed: 1 for you (the language rule, the time plan, a parking lot for questions), 1 or 2 per team"],
    ["Flipchart markers, thick", "1 set of at least 4 colours for you, plus 1 per team if the sheets are used"],
    ["Paper cups or envelopes", 2 * T + " (for hiding things)"],
    ["Paper clips or rubber bands", "a small handful per team"],
    ["A box or bag", "for the discarded notes (the twist T15 needs them)"],
    ["Printed: ingredient deck", "64 cards, 7 pages, one set for you"],
    ["Printed: rules cards, first version", "8 cards A6, 2 pages (4 per A4)"],
    ["Printed: rules cards, final version", "8 cards A5, 4 pages (2 per A4), handed out at the twist"],
    ["Printed: team slips", "2 pages, 72 slips for 8 teams, with spares"],
    ["Printed: idea cards", Math.max(10, T * 2) + " cards, 1 page of 10 is enough for " + T + " teams"],
    ["A real game for the lecture", "Codenames (Pictures), to be sorted out, see the to-do list"],
    ["Timer and photos", "your phone; this page has the clock"],
    ["Room", "movable chairs, a table per team, one open table for the deal, projector with HDMI or USB-C adapter"]
  ];
  for (const [a, b2] of items) { const li = el("li"); const bb = el("b", "", a + ": "); li.appendChild(bb); li.appendChild(document.createTextNode(b2)); u.appendChild(li); }
  c.appendChild(u); s.appendChild(c);
}

// ---------- slides ----------
let seq = [], si = 0, tm = { block: null, acc: 0, at: null, beeped: false, cueDone: new Set() }, ws = { t0: null, entry: {} }, sound = false, actx = null, notesOpen = false, cueTimer = null;
function buildSeq() {
  const keep = seq[si] ? seq[si].key : null; seq = [];
  const rows = plan().rows;
  for (const r of rows) {
    const arr = SL[r.id] || [{ h: r.title, lines: [] }];
    if (skipSet.has(r.id)) continue;
    arr.forEach((sl, i) => seq.push({ block: r.id, i, sl, key: sl.key || (r.id + ":" + i) }));
  }
  const at = keep ? seq.findIndex(x => x.key === keep) : -1;
  si = at >= 0 ? at : Math.min(si, Math.max(0, seq.length - 1));
}
function curBlockMin() { const s = seq[si]; return s ? state.b[s.block].min : 0; }
function enterBlock() {
  const s = seq[si]; if (!s) return;
  if (tm.block !== s.block) {
    tm = { block: s.block, acc: 0, at: ws.t0 ? Date.now() : null, beeped: false, cueDone: new Set() };
    if (ws.t0 && ws.entry[s.block] === undefined) ws.entry[s.block] = (Date.now() - ws.t0) / 60000;
  }
}
function elapsedMs() { return tm.acc + (tm.at ? Date.now() - tm.at : 0); }
function planStart(id) { const r = plan().rows.find(x => x.id === id); return r ? r.start : 0; }
function tick() {
  if ($("presentView").hidden || !seq[si]) return;
  const total = curBlockMin() * 60000, left = total - elapsedMs();
  const ab = Math.abs(Math.round(left / 1000));
  const txt = (left < 0 ? "+" : "") + Math.floor(ab / 60) + ":" + String(ab % 60).padStart(2, "0");
  const cls = left < 0 ? " over" : left < total * 0.2 ? " low" : "";
  $("clock").textContent = txt; $("clock").className = "clock" + cls;
  $("tchip").textContent = txt; $("tchip").className = "tchip" + cls;
  $("tgo").textContent = tm.at ? "Pause" : (tm.acc > 0 ? "Resume" : "Start");
  if (left <= 0 && !tm.beeped && tm.at) { tm.beeped = true; if (sound) beep(); }
  const bt = $("late");
  if (ws.t0 && ws.entry[tm.block] !== undefined) {
    const late = ws.entry[tm.block] - planStart(tm.block) + Math.max(0, -left / 60000);
    const r = Math.round(late);
    bt.textContent = r > 0 ? r + " min behind the plan" : r < 0 ? -r + " min ahead of the plan" : "on the plan";
    bt.className = "late " + (r > 0 ? "over-t" : "ok");
  } else { bt.textContent = ""; }
  { const rows = plan().rows, ci = rows.findIndex(r => r.id === tm.block); let tgt = null;
    if (ci >= 0) { const nx = rows[ci + 1]; if (nx && byId[nx.id].opt && !skipSet.has(nx.id)) tgt = nx; else if (byId[tm.block].opt && !skipSet.has(tm.block)) tgt = rows[ci]; }
    const sb = $("skipbar");
    if (tgt && ws.t0 && ws.entry[tm.block] !== undefined) {
      const lm = ws.entry[tm.block] - planStart(tm.block) + Math.max(0, -left / 60000);
      if (lm > byId[tgt.id].opt) { sb.hidden = false; sb.dataset.id = tgt.id; $("skiptxt").textContent = Math.round(lm) + " min behind the plan. Skip “" + byId[tgt.id].title + "”?"; } else sb.hidden = true;
    } else sb.hidden = true; }
  {
    const w = $("wsClock"), total = plan().total, big = $("wsbig");
    if (ws.t0) {
      const sec = Math.floor((Date.now() - ws.t0) / 1000), h = Math.floor(sec / 3600), mi = Math.floor(sec % 3600 / 60), ss = sec % 60;
      big.textContent = h + ":" + String(mi).padStart(2, "0") + ":" + String(ss).padStart(2, "0");
      const leftMin = total - sec / 60;
      w.textContent = "of " + fmt(total) + " planned, " + (leftMin >= 0 ? Math.ceil(leftMin) + " min left" : Math.ceil(-leftMin) + " min over");
      $("wsmeter").firstElementChild.style.width = Math.min(100, sec / 60 / Math.max(1, total) * 100) + "%";
      $("wsmeter").className = "meter" + (leftMin < 0 ? " over" : "");
      $("wsGo").textContent = "Restart the workshop clock";
      const wl = $("wslate");
      if (ws.entry[tm.block] !== undefined) {
        const lt = Math.round(ws.entry[tm.block] - planStart(tm.block) + Math.max(0, -left / 60000));
        wl.textContent = lt > 0 ? lt + " min behind the plan" : lt < 0 ? -lt + " min ahead of the plan" : "on the plan";
        wl.className = "late " + (lt > 0 ? "over-t" : "ok");
      } else wl.textContent = "";
    } else { big.textContent = "0:00:00"; w.textContent = "not started, " + fmt(total) + " planned"; $("wsmeter").firstElementChild.style.width = "0%"; $("wsGo").textContent = "Start the workshop clock"; $("wslate").textContent = ""; }
  }
  const b = byId[tm.block];
  if (b && b.cues && tm.at) {
    const mins = elapsedMs() / 60000, bm = curBlockMin();
    for (const q of b.cues) {
      const when = q.at !== undefined ? q.at : bm - q.left;
      if (mins >= when && !tm.cueDone.has(q.t)) { tm.cueDone.add(q.t); const cu = $("cue"); cu.hidden = false; cu.textContent = "Cue: " + q.t; clearTimeout(cueTimer); cueTimer = setTimeout(() => { cu.hidden = true; }, 20000); }
    }
  }
  const bk = $("wd-break"); if (bk) { const mm = Math.max(0, left); const back = new Date(Date.now() + mm); bk.textContent = Math.floor(mm / 60000) + ":" + String(Math.floor(mm / 1000) % 60).padStart(2, "0"); const bb = $("wd-back"); if (bb) bb.textContent = "Back at " + String(back.getHours()).padStart(2, "0") + ":" + String(back.getMinutes()).padStart(2, "0"); }
  updateBar();
}
function updateSkipped() {
  const e = $("skipped"); e.textContent = "";
  for (const id of skipSet) { const sp = el("span", "", "Skipped: " + byId[id].title + " "); const b = el("button", "mini", "Undo"); b.type = "button";
    b.addEventListener("click", () => { skipSet.delete(id); buildSeq(); enterBlock(); renderSlide(); }); e.appendChild(sp); e.appendChild(b); }
}
function buildBar() { const bg = $("pbg"); bg.textContent = ""; for (const r of plan().rows) { const d = el("div", "pseg"); d.style.flex = String(r.min); bg.appendChild(d); } }
function updateBar() {
  const p = plan(), total = p.total || 1, s = seq[si]; if (!s) return;
  const inBlock = seq.filter(x => x.block === s.block), idx = Math.max(0, inBlock.findIndex(x => x.key === s.key));
  const pos = planStart(s.block) + curBlockMin() * idx / Math.max(1, inBlock.length);
  $("pfill").style.width = Math.min(100, pos / total * 100) + "%";
  const mk = $("pmark");
  if (ws.t0) { mk.hidden = false; mk.style.left = Math.min(100, (Date.now() - ws.t0) / 60000 / total * 100) + "%"; } else mk.hidden = true;
}
function fitEl(sl) {
  if (!sl) return; const f = sl.firstElementChild; if (!f) return;
  let z = 1; f.style.zoom = 1; let n = 0;
  while (sl.scrollHeight > sl.clientHeight + 1 && z > 0.4 && n < 40) { z -= 0.03; f.style.zoom = z.toFixed(2); n++; }
}
function fit() { fitEl($("slide")); if (mode === "presenter") fitEl($("nslide")); }
function beep() {
  try { actx = actx || new (window.AudioContext || window.webkitAudioContext)(); const o = actx.createOscillator(), g = actx.createGain(); o.connect(g); g.connect(actx.destination); o.frequency.value = 880; g.gain.value = .2; o.start(); o.stop(actx.currentTime + .6); } catch (e) {}
}
function dist() {
  const T = teamCount(), N = cfg.students, base = Math.floor(N / T), rem = N % T, out = [];
  for (let i = 0; i < T; i++) out.push(base + (i < rem ? 1 : 0)); return out;
}
function tchip(i, extra) { return el("span", "tm", tnb(i) + (extra || "")); }
function persistCfg() { clearTimeout(cfgT); cfgT = setTimeout(() => { try { localStorage.setItem("slides-cfg", JSON.stringify(cfg)); } catch (e) {} if (refCfg) refCfg.set({ ...cfg, updated: new Date().toISOString() }).catch(() => {}); }, 500); }
function numrow(label, key, min, max) {
  const r = el("div", "numrow"); r.appendChild(el("span", "", label));
  const m = el("button", "nb", "−"); m.type = "button"; m.setAttribute("aria-label", "Fewer " + label);
  const p = el("button", "nb", "+"); p.type = "button"; p.setAttribute("aria-label", "More " + label);
  const v = el("span", "nv", String(cfg[key]));
  m.addEventListener("click", () => { cfg[key] = Math.max(min, cfg[key] - 1); persistCfg(); renderSlide(); });
  p.addEventListener("click", () => { cfg[key] = Math.min(max, cfg[key] + 1); persistCfg(); renderSlide(); });
  r.appendChild(m); r.appendChild(v); r.appendChild(p); return r;
}
function teamHow() {
  const d = dist();
  return "Hand out " + cfg.students + " picture slips from the printed sheet: " + d.map((n, i) => n + " × " + tn(i)).join(", ") + ". Everyone takes one slip without looking, then finds the others with the same picture. Late student: press + and hand out one more slip of the picture that is short.";
}
function wTeams() {
  const w = el("div", "tw");
  w.appendChild(numrow("Students", "students", 3, 60)); w.appendChild(numrow("Team size", "size", 2, 8));
  const d = dist(), tm2 = el("div", "teams");
  d.forEach((n, i) => tm2.appendChild(tchip(i, ": " + n))); w.appendChild(tm2);
  return w;
}
function wWho() {
  const w = el("div", "who");
  const mk = (key, ph, cls) => { const i = document.createElement("input"); i.type = "text"; i.className = cls; i.value = cfg[key] || ""; i.placeholder = ph; i.setAttribute("aria-label", ph);
    i.addEventListener("input", () => { cfg[key] = i.value; persistCfg(); }); return i; };
  w.appendChild(mk("presenter", "Your name (click to type)", "wn")); w.appendChild(mk("affil", "Your university or department", "wa"));
  return w;
}
const mc = document.createElement("canvas").getContext("2d");
function fitW(inp) {
  const cs = getComputedStyle(inp), fs = parseFloat(cs.fontSize) || 16;
  mc.font = cs.fontStyle + " " + cs.fontWeight + " " + cs.fontSize + " " + cs.fontFamily;
  inp.style.width = ((mc.measureText(inp.value || " ").width + 2) / fs).toFixed(2) + "em";
}
function wReverse() {
  const g = el("div", "grid3");
  REV.forEach(([a, b, col], idx) => {
    const c = el("button", "cell" + (revealed.has(idx) ? "" : " hid")); c.type = "button"; c.style.borderColor = "var(" + col + ")";
    const bb = el("b", "", a); bb.style.color = "var(" + col + ")"; c.appendChild(bb); c.appendChild(el("span", "", b));
    c.addEventListener("click", () => { if (mode !== "presenter") return; if (revealed.has(idx)) revealed.delete(idx); else revealed.add(idx); c.classList.toggle("hid"); broadcast(); });
    g.appendChild(c);
  });
  const w = el("div", "tw"); w.appendChild(el("p", "ses", "Ask first, then click a box to reveal. Replace the game if you bring another.")); w.appendChild(g); return w;
}
function wNotes() {
  const g = el("div", "grid3");
  [["Setting","A place or situation","a bus at rush hour","--c-setting","Yellow note"],["Thing","A character or object in the game","a lost umbrella","--c-thing","Green note"],["Audience","Who plays, and where","grandparents at a party","--c-audience","Pink note"]].forEach(([a, b, c, col, nt]) => {
    const e = el("div", "cell"); e.style.borderColor = "var(" + col + ")"; e.style.borderWidth = ".6cqw"; const bb = el("b", "", a + " · " + nt); bb.style.color = "var(" + col + ")"; e.appendChild(bb); e.appendChild(el("span", "", b)); const x = el("div", "sm", "e.g. " + c); x.style.color = "var(--stage-dim)"; e.appendChild(x); g.appendChild(e);
  }); return g;
}
function wCode() {
  const row = el("div", "cgrow");
  const g = el("div", "cg"); CGW.forEach(x => g.appendChild(el("div", "cgt", x))); row.appendChild(g);
  const side = el("div"); side.style.display = "grid"; side.style.gap = "1cqw";
  const KEY = "RBNRB BRNNR NBARB RNBRN BRRBN".replace(/ /g, ""), COL = { R: "#d32f2f", B: "#1e66d0", N: "#d7c9a8", A: "#0a0a0a" };
  const kk = el("div", "cgk"); for (const ch of KEY) { const i = document.createElement("i"); i.style.background = COL[ch]; kk.appendChild(i); }
  side.appendChild(kk); side.appendChild(el("div", "sm", "Key card: only the spymasters see it")); side.lastChild.style.color = "var(--stage-dim)";
  row.appendChild(side);
  const lg = el("ul", "lg");
  [["#d32f2f","9 red agents"],["#1e66d0","8 blue agents"],["#d7c9a8","7 bystanders"],["#0a0a0a","1 assassin: guess it and your team loses"]].forEach(([c, t]) => { const li = el("li"); const sw = document.createElement("i"); sw.style.background = c; li.appendChild(sw); li.appendChild(document.createTextNode(t)); lg.appendChild(li); });
  row.appendChild(lg);
  const w = el("div", "tw"); w.appendChild(row); return w;
}
function wFive() {
  const t = el("div", "five");
  FIVE.forEach(([a, q, src, col]) => { const r = el("div", "fr"); const x = el("b", "", a); x.style.color = "var(" + col + ")"; r.appendChild(x); r.appendChild(el("span", "fq", q)); const c = el("span", "fc", src); c.style.borderColor = "var(" + col + ")"; r.appendChild(c); t.appendChild(r); });
  return t;
}
function wBreak() { const w = el("div", "tw"); const t = el("div", "bigtime"); t.id = "wd-break"; const b = el("div", "ses"); b.id = "wd-back"; w.appendChild(t); w.appendChild(b); return w; }
function rotTable(round) {
  const T = Math.max(2, teamCount()), t = el("table", "rot");
  const head = el("tr"); ["Game of", "Hosts stay (silent)", "Visitors come from"].forEach(x => head.appendChild(el("th", "", x))); t.appendChild(head);
  for (let k = 0; k < T; k++) {
    const r = el("tr"), hostHalf = round === 1 ? "half A" : "half B";
    const visTeam = ((k - round) % T + T) % T, visHalf = round === 1 ? "half B" : "half A";
    r.appendChild(el("td", "", tn(k))); r.appendChild(el("td", "", tn(k) + " " + hostHalf)); r.appendChild(el("td", "", tn(visTeam) + " " + visHalf));
    t.appendChild(r);
  }
  return t;
}
function wRot(round) {
  const w = el("div", "tw");
  const pp = el("p", "ses", "Every team splits into half A and half B. Round " + round + ": " + (round === 1 ? "half A hosts, half B visits" : "half B hosts, half A visits") + "."); pp.style.fontSize = "2cqw"; w.appendChild(pp);
  w.appendChild(rotTable(round));
  if (teamCount() < 3) w.appendChild(el("p", "ses", "With fewer than 3 teams each game is visited by the same team. Fine, but tell the students."));
  return w;
}
function buildContent(box, s) {
  const sl = s.sl, b = byId[s.block];
  if (!sl.nokick) box.appendChild(el("div", "kick", b.title));
  box.appendChild(el("h2", "sh", sl.h));
  if (sl.es) box.appendChild(el("p", "ses", sl.es));
  if (sl.sentence) { const p = el("p", "sentence"); p.innerHTML = 'In this game, <u>who plays</u> <u>do something</u> to <u>reach the goal</u> in <u>a setting</u> with <u>a thing</u>.'; box.appendChild(p); box.appendChild(el("p", "ses", "En este juego, quién juega hace algo para llegar al objetivo en un escenario con un objeto.")); }
  if (sl.w === "teams") box.appendChild(wTeams());
  if (sl.w === "reverse") box.appendChild(wReverse());
  if (sl.w === "codegrid") box.appendChild(wCode());
  if (sl.w === "five") box.appendChild(wFive());
  if (sl.w === "notes") box.appendChild(wNotes());
  if (sl.w === "break") box.appendChild(wBreak());
  if (sl.w === "rot1") box.appendChild(wRot(1));
  if (sl.w === "rot2") box.appendChild(wRot(2));
  if (sl.chips) { const c = el("div", "chips"); sl.chips.forEach(x => { const ch = el("span", "chip", Array.isArray(x) ? x[0] : x); if (Array.isArray(x)) { ch.style.borderColor = x[1]; ch.style.color = x[1]; } c.appendChild(ch); }); box.appendChild(c); }
  if (sl.lines && sl.lines.length) {
    const u = el("ul", "sl");
    sl.lines.forEach(([e, es]) => { u.appendChild(el("li", "", e)); if (es) u.appendChild(el("li", "e", es)); });
    box.appendChild(u);
  }
  if (sl.lang) box.appendChild(el("p", "langnote", "Write in English · Escriban en inglés"));
}
function renderNext() {
  const root = $("nslide"); if (!root) return; root.textContent = ""; const box = el("div", "fit"); root.appendChild(box);
  const nx = seq[si + 1];
  if (!nx) box.appendChild(el("h2", "sh", "Last slide")); else buildContent(box, nx);
  fitEl(root);
}
function renderSlide() {
  const s = seq[si], root = $("slide"); root.textContent = ""; $("by").hidden = true; const box = el("div", "fit"); root.appendChild(box);
  if (!s) { box.appendChild(el("h2", "sh", "No parts switched on")); box.appendChild(el("p", "ses", "Switch some parts on in the Script plan view.")); $("trow").hidden = true; $("tchip").hidden = true; if (mode === "presenter") { updateNav(); renderNext(); } return; }
  const sl = s.sl, hasT = sl.t !== false;
  $("trow").hidden = !hasT; $("tchip").hidden = !hasT || sl.w === "break";
  const by = $("by"); by.hidden = !sl.presenter;
  if (sl.presenter) { const n = $("byn"); if (document.activeElement !== n) n.value = cfg.presenter || ""; fitW(n); const a = $("bya"); if (document.activeElement !== a) a.value = cfg.affil || ""; fitW(a); }
  buildContent(box, s);
  buildBar(); if (mode === "presenter") { updateNav(); renderDrawer(); updateSkipped(); renderNext(); }
  tick(); fit(); if (mode === "presenter") broadcast();
}
function updateNav() { const nx = seq[si + 1]; $("nextinfo").textContent = nx ? "Next: " + nx.sl.h : (seq.length ? "Last slide" : ""); $("cnt").textContent = seq.length ? "Slide " + (si + 1) + " of " + seq.length : ""; $("prev").disabled = si <= 0; $("next").disabled = si >= seq.length - 1; }
function go(d) { const n = si + d; if (n < 0 || n >= seq.length) return; si = n; revealed = new Set(); enterBlock(); renderSlide(); }
function renderDrawer() {
  const d = $("drawer"); if (mode !== "presenter") return; d.textContent = "";
  const s = seq[si]; if (!s) return; const b = byId[s.block];
  d.appendChild(el("div", "sm", "Notes are for your own screen. Do not project them."));
  if (s.sl.w === "teams") { const t = el("div", "open"); t.appendChild(el("h3", "", "How to run this slide")); t.appendChild(el("div", "", teamHow())); d.appendChild(t); }
  const sy = list(b.say, "Say"); if (sy) d.appendChild(sy);
  if (b.es) { const e = el("div"); e.appendChild(el("h3", "", "In Spanish")); e.appendChild(el("div", "es", b.es)); d.appendChild(e); }
  const dd = list(b.do, "Do"); if (dd) d.appendChild(dd);
  const tp = list(b.tips, "Tips"); if (tp) d.appendChild(tp);
  if (b.mats) { const m = el("div"); m.appendChild(el("h3", "", "Materials")); m.appendChild(el("div", "", b.mats)); d.appendChild(m); }
  if (state.b[s.block].note) { const n = el("div", "open"); n.appendChild(el("h3", "", "Your note on this part")); n.appendChild(el("div", "", state.b[s.block].note)); if (replies[s.block]) { n.appendChild(el("h3", "", "Claude's answer")); n.appendChild(el("div", "", replies[s.block])); } d.appendChild(n); }
  const cm = el("div", "tool"); cm.appendChild(el("h3", "", "Comment on this slide"));
  const ta = document.createElement("textarea"); ta.id = "com-" + s.key.replace(":", "-"); ta.setAttribute("aria-label", "Comment on this slide");
  ta.value = (comments[s.key] && comments[s.key].text) || "";
  const st = el("div", "sm", comments[s.key] ? (comments[s.key].resolved ? "Resolved ✓" : "Saved ✓") : ""); st.id = "comst";
  ta.addEventListener("input", () => { const k = s.key; if (ta.value) comments[k] = { slide: b.title + " / " + s.sl.h, text: ta.value }; else delete comments[k]; dirty.add(k); st.textContent = "Saving…"; clearTimeout(comT); comT = setTimeout(flushAll, 600); });
  ta.addEventListener("blur", flushAll);
  cm.appendChild(ta); cm.appendChild(st);
  if (sreplies[s.key]) { const r = el("div", "reply"); r.appendChild(el("h3", "", "Claude's answer")); r.appendChild(el("div", "", sreplies[s.key])); cm.appendChild(r); }
  d.appendChild(cm);
  const ks = Object.keys(comments);
  if (ks.length) {
    const all = el("div", "tool"); all.appendChild(el("h3", "", "All your slide comments (" + ks.length + ")"));
    const u = el("ul");
    for (const k of ks) { const li = el("li"); const bt = el("button", "mini", "Go"); bt.type = "button"; bt.style.marginRight = "6px";
      bt.addEventListener("click", () => { const i = seq.findIndex(x => x.key === k); if (i >= 0) { si = i; enterBlock(); renderSlide(); } });
      li.appendChild(bt); li.appendChild(el("b", "", (comments[k].resolved ? "✓ " : "") + (comments[k].slide || k) + ": ")); li.appendChild(document.createTextNode(comments[k].text.length > 140 ? comments[k].text.slice(0, 140) + "…" : comments[k].text)); u.appendChild(li); }
    all.appendChild(u); d.appendChild(all);
  }
}
function saveComment(k) {
  dirty.delete(k);
  try { localStorage.setItem("slides-comments", JSON.stringify(comments)); } catch (e) {}
  if (!comCol) return;
  const dref = comCol.doc(k.replace(":", "-")), c = comments[k];
  const pr = c ? dref.set({ key: k, slide: c.slide, text: c.text, updated: new Date().toISOString() }) : dref.delete();
  pr.then(() => { const e = document.getElementById("comst"); if (e) e.textContent = "Saved ✓"; })
    .catch(() => { const e = document.getElementById("comst"); if (e) e.textContent = "Not saved. Your comment stays on this device."; });
}
function flushAll() { clearTimeout(comT); for (const k of [...dirty]) saveComment(k); if (pendingScript) save(); }
function dealTwists() {
  const out = $("toolout"); out.hidden = false; out.textContent = "";
  const T = teamCount(), pool = TW.slice(); for (let i = pool.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [pool[i], pool[j]] = [pool[j], pool[i]]; }
  out.appendChild(el("h3", "", "Twists for the teams (private, do not project)"));
  const u = el("ul");
  for (let i = 0; i < T; i++) { const x = pool[i % pool.length]; const li = el("li"); li.appendChild(el("b", "", tn(i) + ": " + x[0] + " ")); li.appendChild(document.createTextNode(x[1] + " / " + x[2])); u.appendChild(li); }
  out.appendChild(u); out.appendChild(el("div", "sm", "T11 clashes with limit L11, and T12 to T16 need the student piles. Swap by hand if needed."));
  const h = el("button", "mini", "Hide"); h.type = "button"; h.addEventListener("click", () => { out.hidden = true; out.textContent = ""; }); out.appendChild(h);
}
function pickTeam() { const o = $("pickOut"); o.textContent = ""; o.appendChild(tchip(Math.floor(Math.random() * teamCount()))); }
// ---------- controls ----------
$("presets").addEventListener("click", e => { const p = e.target.closest("[data-p]"); if (p) loadPreset(p.dataset.p); });
$("prev").addEventListener("click", () => go(-1)); $("next").addEventListener("click", () => go(1));
$("tgo").addEventListener("click", () => { if (tm.at) { tm.acc += Date.now() - tm.at; tm.at = null; } else tm.at = Date.now(); tick(); broadcast(); });
$("tm1").addEventListener("click", () => { const s = state.b[seq[si].block]; s.min = Math.max(1, s.min - 1); change(); tick(); });
$("tp1").addEventListener("click", () => { const s = state.b[seq[si].block]; s.min = Math.min(120, s.min + 1); change(); tick(); });
$("trs").addEventListener("click", () => { tm.acc = 0; tm.at = null; tm.beeped = false; tm.cueDone = new Set(); tick(); broadcast(); });
$("wsGo").addEventListener("click", () => { ws.t0 = Date.now(); ws.entry = {}; if (seq[si]) ws.entry[seq[si].block] = 0; tm.at = tm.at || Date.now(); tick(); broadcast(); });
$("snd").addEventListener("click", () => { sound = !sound; $("snd").setAttribute("aria-pressed", sound); $("snd").textContent = "Sound at zero: " + (sound ? "on" : "off"); if (sound) beep(); });
$("byn").addEventListener("input", e => { cfg.presenter = e.target.value; fitW(e.target); persistCfg(); broadcast(); });
$("bya").addEventListener("input", e => { cfg.affil = e.target.value; fitW(e.target); persistCfg(); broadcast(); });
$("skipbtn").addEventListener("click", () => { const sb = $("skipbar"), id = sb.dataset.id; if (!id) return; skipSet.add(id); sb.hidden = true; buildSeq(); enterBlock(); renderSlide(); });
$("pickBtn").addEventListener("click", pickTeam); $("twBtn").addEventListener("click", dealTwists);
$("fs").addEventListener("click", () => { const st = $("stage"); try { if (document.fullscreenElement) document.exitFullscreen(); else if (st.requestFullscreen) st.requestFullscreen(); } catch (e) {} });
if (window.ResizeObserver) { const ro = new ResizeObserver(() => fit()); ro.observe($("stage")); ro.observe($("nstage")); }
if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => fit());
document.addEventListener("keydown", e => { if ($("presentView").hidden) return; if (e.target.tagName === "TEXTAREA" || e.target.tagName === "INPUT") return; if (e.key === "ArrowRight" || e.key === " ") { e.preventDefault(); go(1); } if (e.key === "ArrowLeft") go(-1); });
function route() {
  const h = location.hash;
  mode = h === "#slide" ? "slide" : h === "#plan" ? "plan" : "presenter";
  const hc = document.documentElement.classList; hc.remove("mode-plan", "mode-presenter", "mode-slide"); hc.add("mode-" + mode);
  const pr = mode !== "plan";
  $("planView").hidden = pr; $("presentView").hidden = !pr; $("planBar").hidden = pr;
  $("wrap").className = "wrap" + (mode === "presenter" ? " wide" : "");
  $("navPlan").className = "btn" + (pr ? "" : " cur"); $("navPres").className = "btn" + (mode === "presenter" ? " cur" : "");
  $("byn").readOnly = $("bya").readOnly = mode === "slide";
  if (mode === "presenter") { buildSeq(); enterBlock(); renderSlide(); }
  else if (mode === "slide") {
    if (gotModel) renderSlide();
    else { const r = $("slide"); r.textContent = ""; const b = el("div", "fit"); r.appendChild(b); b.appendChild(el("h2", "sh", "Waiting for the presenter window…")); b.appendChild(el("p", "ses", "Open the Presenter view in another window of this browser. This window follows it. Press F for full screen.")); $("tchip").hidden = true; $("by").hidden = true; post({ type: "hello" }); }
  } else render();
}
// ---------- presenter and slide windows ----------
function model() {
  const b = {}; for (const k in state.b) b[k] = { on: state.b[k].on, min: state.b[k].min };
  return { state: { preset: state.preset, order: state.order, b }, cfg: { students: cfg.students, size: cfg.size, presenter: cfg.presenter, affil: cfg.affil }, skip: [...skipSet],
    key: seq[si] ? seq[si].key : null, reveal: [...revealed], ws: { t0: ws.t0 }, tm: { block: tm.block, acc: tm.acc, at: tm.at } };
}
function post(msg) {
  msg.id = CID + ":" + Date.now() + ":" + Math.random().toString(36).slice(2, 6);
  if (chan) { try { chan.postMessage(msg); } catch (e) {} }
  try { localStorage.setItem("cag-msg", JSON.stringify(msg)); } catch (e) {}
}
function broadcast() { if (mode !== "presenter") return; clearTimeout(bcT); bcT = setTimeout(() => post({ type: "sync", model: model() }), 25); }
function applyModel(m) {
  state = normalise(m.state); Object.assign(cfg, m.cfg); skipSet = new Set(m.skip || []); revealed = new Set(m.reveal || []);
  ws.t0 = m.ws ? m.ws.t0 : null; tm = { block: m.tm.block, acc: m.tm.acc, at: m.tm.at, beeped: true, cueDone: new Set() };
  buildSeq(); const i = seq.findIndex(x => x.key === m.key); si = i >= 0 ? i : 0; gotModel = true; renderSlide();
}
function onMsg(m) {
  if (!m || !m.type || m.id === lastId) return; lastId = m.id;
  if (mode === "slide" && m.type === "sync") { applyModel(m.model); post({ type: "ack" }); }
  else if (mode === "presenter" && m.type === "hello") { clearTimeout(bcT); post({ type: "sync", model: model() }); lastAck = Date.now(); updateWin(); }
  else if (mode === "presenter" && m.type === "ack") { lastAck = Date.now(); updateWin(); }
  else if (mode === "presenter" && m.type === "nav") go(m.d);
}
function updateWin() {
  const e = $("winstat"); if (!e) return; const ok = Date.now() - lastAck < 7000;
  e.textContent = ok ? "Slide window: connected ✓" : "Slide window: not connected yet. Press “Open slide window”.";
  e.style.color = ok ? "var(--ok)" : "var(--muted)";
}
try { chan = new BroadcastChannel("cook-a-game"); chan.onmessage = ev => onMsg(ev.data); } catch (e) {}
window.addEventListener("storage", ev => { if (ev.key === "cag-msg" && ev.newValue) { try { onMsg(JSON.parse(ev.newValue)); } catch (e) {} } });
setInterval(() => { if (mode === "slide") post({ type: gotModel ? "ack" : "hello" }); else if (mode === "presenter") updateWin(); }, 2500);
document.addEventListener("keydown", e => {
  if (mode !== "slide") return;
  if (e.key === "ArrowRight" || e.key === " " || e.key === "PageDown") { e.preventDefault(); post({ type: "nav", d: 1 }); }
  else if (e.key === "ArrowLeft" || e.key === "PageUp") post({ type: "nav", d: -1 });
  else if (e.key === "f" || e.key === "F") { try { if (document.fullscreenElement) document.exitFullscreen(); else document.documentElement.requestFullscreen(); } catch (er) {} }
});
document.addEventListener("dblclick", () => { if (mode !== "slide") return; try { if (document.fullscreenElement) document.exitFullscreen(); else document.documentElement.requestFullscreen(); } catch (er) {} });
const wh = $("winhint"); wh.textContent = "If no window opens, open this address in a second window and move it to the projector: "; { const a = document.createElement("a"); a.href = location.href.split("#")[0] + "#slide"; a.target = "_blank"; a.rel = "noopener"; a.textContent = a.href; wh.appendChild(a); }
$("openWin").addEventListener("click", () => {
  try { window.open(location.href.split("#")[0] + "#slide", "cag-slide", "popup,width=1280,height=720"); } catch (e) {}
  post({ type: "hello" }); setTimeout(updateWin, 1500);
});
window.addEventListener("hashchange", route);
setInterval(tick, 250);
document.addEventListener("visibilitychange", () => { if (document.hidden) flushAll(); });
window.addEventListener("pagehide", flushAll);

function snapshotDoc() {
  const p = plan();
  return { preset: state.preset, order: state.order, b: state.b, total: p.total, budget: budget(),
    plan: p.rows.map(r => ({ title: r.title, start: fmt(r.start), end: fmt(r.end), minutes: r.min, note: r.note })),
    left_out: state.order.filter(id => !byId[id].outside && !state.b[id].on).map(id => byId[id].title),
    by: CID, rev: (rev = CID + Date.now()), updated: new Date().toISOString() };
}
function save() {
  clearTimeout(saveT); pendingScript = false;
  try { localStorage.setItem("script-state", JSON.stringify({ preset: state.preset, order: state.order, b: state.b })); } catch (e) {}
  if (ref) {
    ref.set(snapshotDoc()).then(() => { $("status").textContent = "Saved. Claude can read your script."; })
      .catch(() => { $("status").textContent = "Could not save to Claude. Your changes stay on this device."; });
  }
}
try { state = normalise(JSON.parse(localStorage.getItem("script-state") || "null")); } catch (e) { state = defaults("180"); }
try { const c = JSON.parse(localStorage.getItem("slides-cfg") || "null"); if (c && c.students) cfg = Object.assign(cfg, c); } catch (e) {}
if (!cfg.presenter) cfg.presenter = "Ondra Brém";
if (!cfg.affil) cfg.affil = "Czech Technical University in Prague";
try { const c = JSON.parse(localStorage.getItem("slides-comments") || "null"); if (c) comments = c; } catch (e) {}
route();
(async () => {
  const local = () => { $("status").textContent = "Changes are kept on this device only."; };
  try {
    const db = window.claude ? await window.claude.use("db") : null;
    if (!db) { local(); return; }
    ref = db.doc("script/state"); refCfg = db.doc("slides/config"); comCol = db.collection("comments");
    let first = true;
    ref.onSnapshot(snap => {
      if (snap.exists) {
        const d = snap.data() || {};
        if (d.rev !== rev && (first || d.by !== CID)) {
          const ae = document.activeElement, keep = ae && ae.tagName === "TEXTAREA";
          if (!keep) { state = normalise(d); route(); }
        }
      } else if (first) save();
      if (first) $("status").textContent = "Your script is shared with Claude.";
      first = false;
    }, local);
    refCfg.onSnapshot(snap => { if (snap.exists) { const d = snap.data() || {}; if (d.students) { cfg = Object.assign(cfg, { students: d.students, size: d.size || cfg.size, mode: d.mode || cfg.mode, presenter: d.presenter || cfg.presenter, affil: d.affil || cfg.affil }); const ae = document.activeElement; if (!(ae && (ae.tagName === "TEXTAREA" || ae.tagName === "INPUT"))) route(); } } }, () => {});
    let firstC = true, localC = comments;
    comCol.onSnapshot(snap => {
      const m = {};
      snap.docs.forEach(x => { const v = x.data() || {}; if (v.key && typeof v.text === "string") m[v.key] = { slide: v.slide || "", text: v.text, resolved: !!v.resolved }; });
      if (firstC) { firstC = false; for (const k of Object.keys(localC || {})) if (!m[k] && localC[k] && localC[k].text) { m[k] = localC[k]; dirty.add(k); } }
      for (const k of dirty) { if (comments[k]) m[k] = comments[k]; else delete m[k]; }
      comments = m; flushAll();
      const ae = document.activeElement; if (!(ae && (ae.tagName === "TEXTAREA" || ae.tagName === "INPUT"))) renderDrawer();
    }, () => {});
    db.doc("script/replies").onSnapshot(snap => { replies = snap.exists ? ((snap.data() || {}).items || {}) : {}; const ae = document.activeElement; if (!(ae && ae.tagName === "TEXTAREA")) route(); }, () => {});
    db.doc("slides/replies").onSnapshot(snap => { sreplies = snap.exists ? ((snap.data() || {}).items || {}) : {}; const ae = document.activeElement; if (!(ae && ae.tagName === "TEXTAREA")) renderDrawer(); }, () => {});
  } catch (e) { local(); }
})();
