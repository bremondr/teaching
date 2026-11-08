/* Helpers shared by every version of the Design Sprint workshop.
 * Loaded by index.html before the version file. Plain script, no build step.
 *   DS.timer(opts)   a countdown slide (optionally with a "switch" signal for Crazy 8s)
 *   DS.picker(opts)  a team or turn picker slide
 *   DS.week(days)    the week-at-a-glance slide for a 4 or 5 day run
 *   DS.agenda(day)   the day agenda slide
 *   DS.n(...)        speaker notes from plain paragraphs
 */
(function () {
  "use strict";
  var DS = window.DS = { channel: "design-sprint" };

  var css = document.createElement("style");
  css.textContent =
    ".ds-clock{font:700 150px Consolas,monospace;line-height:1;font-variant-numeric:tabular-nums;color:#f2f2f2}" +
    ".ds-clock.ds-done{color:#ff8a80}.ds-clock.ds-flash{color:#ffc857}" +
    ".ds-row{display:flex;gap:14px;flex-wrap:wrap;align-items:center}" +
    ".ds-inner-btn{font-size:28px;padding:10px 22px;cursor:pointer}" +
    ".ds-panel{font-size:40px;color:#ffc857;min-height:56px}" +
    ".ds-pick{font:700 130px/1.1 system-ui,sans-serif;color:#ffc857;min-height:150px}" +
    ".ds-drawn{font-size:28px;color:#b4b4b4}" +
    ".ds-num{font-size:28px;width:4.5ch;padding:6px 8px;background:#262626;color:#f2f2f2;border:1px solid #3a3a3a;border-radius:6px}" +
    ".ds-days{display:grid;gap:14px}.ds-day{background:#262626;border:1px solid #3a3a3a;border-radius:10px;padding:14px 18px}" +
    ".ds-day b{color:#ffc857;font-size:30px}.ds-day span{display:block;font-size:26px;line-height:1.3}" +
    ".ds-day.ds-now{border-color:#ffc857}" +
    ".ds-ph{border:2px dashed #3a3a3a;border-radius:10px;padding:14px 18px;font-size:26px;color:#b4b4b4}";
  document.head.appendChild(css);

  function el(tag, cls, text) { var e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; }
  function mmss(s) { s = Math.max(0, Math.ceil(s)); return Math.floor(s / 60) + ":" + String(s % 60).padStart(2, "0"); }

  DS.n = function () { return Array.prototype.map.call(arguments, function (p) { return "<p>" + p + "</p>"; }).join(""); };

  // ---- countdown -------------------------------------------------------------------------------
  // opts: id, title, min (planned minutes, also the countdown length unless seconds is given),
  //       seconds, text (one line under the title), panels + interval (Crazy 8s: panels, seconds per panel), notes
  DS.timer = function (o) {
    var total = o.seconds || o.min * 60;
    return {
      id: o.id, title: o.title, min: o.min, notes: o.notes,
      render: function (box, ctx) {
        var st = { running: false, endAt: 0, left: total };
        var h = el("h2", "", o.title), p = el("p", "", o.text || ""), clock = el("div", "ds-clock", mmss(total));
        clock.id = "ds-clock";
        var panel = el("div", "ds-panel", ""); panel.id = "ds-panel";
        box.appendChild(h); if (o.text) box.appendChild(p); box.appendChild(clock);
        if (o.panels) box.appendChild(panel);
        if (ctx.preview) { if (o.panels) panel.textContent = "Panel 1 of " + o.panels; return; }
        var row = el("div", "ds-row"), bGo = el("button", "ds-inner-btn", "Start"), bReset = el("button", "ds-inner-btn", "Reset"), bPlus = el("button", "ds-inner-btn", "+1 min");
        bGo.id = "ds-go"; bReset.id = "ds-reset"; bPlus.id = "ds-plus";
        row.appendChild(bGo); row.appendChild(bReset); row.appendChild(bPlus); box.appendChild(row);
        var bc = null, key = o.id, lastPanel = 0, beeped = false;
        try { bc = new BroadcastChannel("ds-timer:" + DS.channel); } catch (e) {}
        function send() { if (bc) try { bc.postMessage({ key: key, st: st }); } catch (e) {} }
        function beep() {
          try { var a = new (window.AudioContext || window.webkitAudioContext)(), g = a.createGain(), os = a.createOscillator();
            os.frequency.value = 880; g.gain.value = 0.15; os.connect(g); g.connect(a.destination); os.start(); os.stop(a.currentTime + 0.25); setTimeout(function () { a.close(); }, 600); } catch (e) {}
        }
        function left() { return st.running ? Math.max(0, (st.endAt - Date.now()) / 1000) : st.left; }
        function draw() {
          var l = left();
          if (st.running && l <= 0) { st.running = false; st.left = 0; if (!beeped) { beeped = true; beep(); } send(); }
          clock.textContent = mmss(l);
          clock.classList.toggle("ds-done", l <= 0 && st.left === 0 && !st.running);
          bGo.textContent = st.running ? "Pause" : "Start";
          if (o.panels) {
            var used = total - l, k = Math.min(o.panels, Math.floor(used / o.interval) + 1);
            if (used <= 0 && !st.running) k = 1;
            panel.textContent = l <= 0 ? "Time is up" : "Panel " + k + " of " + o.panels;
            if (k !== lastPanel) { if (lastPanel && st.running) { beep(); clock.classList.add("ds-flash"); setTimeout(function () { clock.classList.remove("ds-flash"); }, 700); panel.textContent = "Switch! Panel " + k; } lastPanel = k; }
          }
        }
        bGo.addEventListener("click", function () {
          if (st.running) { st.left = left(); st.running = false; }
          else { if (st.left <= 0) st.left = total; beeped = false; st.endAt = Date.now() + st.left * 1000; st.running = true; beep0(); }
          send(); draw();
        });
        function beep0() { try { var a = new (window.AudioContext || window.webkitAudioContext)(); a.close(); } catch (e) {} }
        bReset.addEventListener("click", function () { st = { running: false, endAt: 0, left: total }; lastPanel = 0; beeped = false; send(); draw(); });
        bPlus.addEventListener("click", function () { if (st.running) st.endAt += 60000; else st.left += 60; total = Math.max(total, st.left); send(); draw(); });
        if (bc) bc.onmessage = function (m) { if (m.data && m.data.key === key) { st = m.data.st; if (st.running && st.endAt > Date.now()) beeped = false; draw(); } };
        var iv = setInterval(draw, 250); draw();
        return function () { clearInterval(iv); if (bc) bc.close(); };
      }
    };
  };

  // ---- picker ----------------------------------------------------------------------------------
  // opts: id, title, min, text, label ("Team"), count (default number), notes
  DS.picker = function (o) {
    return {
      id: o.id, title: o.title, min: o.min, notes: o.notes,
      render: function (box, ctx) {
        var label = o.label || "Team", n = o.count || 4, order = [], drawn = [];
        function shuffle() { order = []; for (var i = 1; i <= n; i++) order.push(i); for (var j = order.length - 1; j > 0; j--) { var k = Math.floor(Math.random() * (j + 1)), t = order[j]; order[j] = order[k]; order[k] = t; } drawn = []; }
        shuffle();
        var h = el("h2", "", o.title), out = el("div", "ds-pick", ctx.preview ? label + " ?" : "?"), log = el("div", "ds-drawn", "");
        out.id = "ds-pick-out"; log.id = "ds-pick-log";
        box.appendChild(h); if (o.text) box.appendChild(el("p", "", o.text)); box.appendChild(out);
        if (ctx.preview) return;
        var row = el("div", "ds-row"), lab = el("label", "", label + "s: "), inp = el("input", "ds-num"), go = el("button", "ds-inner-btn", "Draw next"), rs = el("button", "ds-inner-btn", "Start over");
        lab.style.fontSize = "28px"; inp.type = "number"; inp.min = 2; inp.max = 30; inp.value = n; inp.id = "ds-pick-n"; go.id = "ds-pick-go"; rs.id = "ds-pick-reset";
        row.appendChild(lab); row.appendChild(inp); row.appendChild(go); row.appendChild(rs); box.appendChild(row); box.appendChild(log);
        inp.addEventListener("change", function () { n = Math.max(2, Math.min(30, parseInt(inp.value, 10) || 4)); inp.value = n; shuffle(); out.textContent = "?"; log.textContent = ""; });
        go.addEventListener("click", function () {
          if (!order.length) { out.textContent = "All drawn"; return; }
          var x = order.shift(); drawn.push(x); out.textContent = label + " " + x; log.textContent = "Drawn so far: " + drawn.join(", ");
        });
        rs.addEventListener("click", function () { shuffle(); out.textContent = "?"; log.textContent = ""; });
      }
    };
  };

  // ---- week and agenda -------------------------------------------------------------------------
  var FOUR = [
    ["Day 1", "Map and understand", "Long-term goal, map, experts, one target"],
    ["Day 2", "Sketch and decide", "Inspiration, four-step sketch, critique, vote, storyboard"],
    ["Day 3", "Prototype", "Build a realistic front, stitch it together, trial run"],
    ["Day 4", "Test", "Five interviews, patterns, next steps"]
  ];
  DS.week = function (days, now) {
    var list = FOUR; if (days === 5) list = [FOUR[0], FOUR[1], ["Day 3", "Decide and plan", "Critique, vote, storyboard"], ["Day 4", "Prototype", "Build and trial run"], ["Day 5", "Test", "Interviews and next steps"]];
    return "<h2>The week</h2><div class='ds-days'>" + list.map(function (d, i) {
      return "<div class='ds-day" + (now === i + 1 ? " ds-now" : "") + "'><b>" + d[0] + ": " + d[1] + "</b><span>" + d[2] + "</span></div>";
    }).join("") + "</div>";
  };
  var AG = {
    1: ["Morning: long-term goal and map of the challenge", "Afternoon: talk to experts, choose one target"],
    2: ["Morning: look for inspiration to remix and improve", "Afternoon: four-step sketch, critique and decide, storyboard"],
    3: ["Morning: split the work and start building", "Afternoon: stitch the parts together, trial run"],
    4: ["Morning: interview users", "Afternoon: more interviews, presentations, next steps"]
  };
  DS.agenda = function (day, sub, afternoon) {
    var a = AG[day].slice(); if (afternoon) a[1] = afternoon;
    return "<h2>Day " + day + "</h2><p>" + sub + "</p><ul style='font-size:30px'><li>" + a.join("</li><li>") + "</li></ul>";
  };
  DS.ph = function (text) { return "<div class='ds-ph'>" + text + "</div>"; };
})();
