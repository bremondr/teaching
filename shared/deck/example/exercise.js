// A reusable exercise as a deck module. Any deck can include it:
//   { include: "../../shared/deck/example/exercise.js" }
// Slides can be plain HTML or a render function for interactive parts.
Deck.module({
  id: "countdown",
  title: { en: "Countdown exercise", cs: "Cvičení s odpočtem" },
  slides: [
    { id: "intro", title: { en: "Countdown: instructions", cs: "Odpočet: zadání" }, min: 1,
      body: { en: "<h2>Countdown exercise</h2><p>Draw as many ideas as you can before the clock reaches zero.</p>",
              cs: "<h2>Cvičení s odpočtem</h2><p>Nakreslete co nejvíc nápadů, než odpočet dojde k nule.</p>" },
      notes: { en: "<p>Hand out paper. Start the clock on the next slide.</p>", cs: "<p>Rozdat papíry. Odpočet spustit na dalším slidu.</p>" } },
    { id: "clock", title: { en: "Countdown: go", cs: "Odpočet: start" }, min: 3,
      render: function (box, ctx) {
        var left = 10, h = document.createElement("h2"), n = document.createElement("div"), b = document.createElement("button");
        h.textContent = ctx.lang === "cs" ? "Jdeme na to" : "Go";
        n.className = "dk-big"; n.textContent = ctx.preview ? "10" : String(left);
        b.textContent = ctx.lang === "cs" ? "Spustit odpočet" : "Start the countdown"; b.id = "cd-start";
        b.style.cssText = "font-size:28px;padding:10px 20px;align-self:flex-start";
        box.appendChild(h); box.appendChild(n); if (!ctx.preview) box.appendChild(b);
        var t = null;
        b.addEventListener("click", function () {
          if (t) return; t = setInterval(function () { left = Math.max(0, left - 1); n.textContent = String(left); if (!left) clearInterval(t); }, 1000);
        });
        return function () { if (t) clearInterval(t); };
      } }
  ]
});
