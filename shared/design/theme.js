/* Page theme for the pages that are not decks (the homepage and the README viewer).
   It applies the saved or requested light/dark choice before the page paints, and fills any
   <button data-theme-toggle> with a "Page: light" / "Page: dark" switch.

   Same keys as the deck engine (shared/deck/deck.js), so one choice follows you everywhere on the site:
   ?theme=light|dark in the address wins, then the choice saved by a button. ?event=name switches on an
   event theme (see events.css). Load this script in <head>, after tokens.css. */
(function () {
  "use strict";
  var root = document.documentElement, q = new URLSearchParams(location.search);
  function get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function put(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  var theme = q.get("theme") || get("deck-theme");
  if (theme === "light" || theme === "dark") root.setAttribute("data-theme", theme);
  var ev = q.get("event");
  if (ev && /^[a-z0-9-]+$/.test(ev)) root.setAttribute("data-event", ev);

  function isDark() {
    var t = root.getAttribute("data-theme");
    return t ? t === "dark" : !!(window.matchMedia && matchMedia("(prefers-color-scheme: dark)").matches);
  }
  function paint() { document.querySelectorAll("[data-theme-toggle]").forEach(function (b) { b.textContent = "Page: " + (isDark() ? "dark" : "light"); }); }
  document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll("[data-theme-toggle]").forEach(function (b) {
      b.addEventListener("click", function () { var v = isDark() ? "light" : "dark"; root.setAttribute("data-theme", v); put("deck-theme", v); paint(); });
    });
    paint();
  });
})();
