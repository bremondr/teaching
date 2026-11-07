// Renders a Markdown file of this repo as a page.
//   readme.html?f=workshops/some-item/README.md   any .md file
//   readme.html?p=workshops/some-item              shorthand for that folder's README.md
//   readme.html                                    the repo readme.md
// Optional front matter at the top of the file fills the header (title, type, category,
// status, level, tags, languages, description, open, open_label). Without it the first
// "# Heading" is the title. Relative links and images are resolved against the file.
// Markdown is parsed by marked and sanitised by DOMPurify (both vendored in assets/vendor).

const REPO_URL = "https://github.com/bremondr/teaching";
const FLAGS = { en: "🇬🇧", cs: "🇨🇿", sk: "🇸🇰", es: "🇪🇸", de: "🇩🇪", fr: "🇫🇷", pl: "🇵🇱" };

const docEl = document.getElementById("doc");
const tocEl = document.getElementById("toc");
const crumbPath = document.getElementById("crumbPath");
const layoutEl = document.querySelector(".doc-layout");

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

function fail(message) {
  docEl.textContent = "";
  docEl.appendChild(el("p", "doc-error", message));
  document.title = "Not found · Teaching Hub";
}

function pickFile() {
  const params = new URLSearchParams(location.search);
  let file = params.get("f");
  if (!file && params.get("p")) file = params.get("p").replace(/\/+$/, "") + "/README.md";
  if (!file) file = "readme.md";
  file = file.replace(/^\.?\//, "");
  if (/^[a-z][a-z0-9+.-]*:/i.test(file) || file.split("/").includes("..") || !/\.md$/i.test(file)) return null;
  return file;
}

// Small front matter reader: "key: value", quoted strings, and [a, b] lists.
function splitFrontMatter(text) {
  const match = text.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
  if (!match) return { meta: {}, body: text };
  const meta = {};
  match[1].split(/\r?\n/).forEach((line) => {
    const m = line.match(/^([A-Za-z_][\w-]*):\s*(.*)$/);
    if (!m) return;
    let value = m[2].trim();
    if (value.startsWith("[") && value.endsWith("]")) {
      value = value
        .slice(1, -1)
        .split(",")
        .map((v) => v.trim().replace(/^["']|["']$/g, ""))
        .filter(Boolean);
    } else {
      value = value.replace(/^["']|["']$/g, "");
    }
    meta[m[1]] = value;
  });
  return { meta, body: text.slice(match[0].length) };
}

function slugify(text, used) {
  let base = text.toLowerCase().replace(/[^\p{L}\p{N}]+/gu, "-").replace(/^-+|-+$/g, "") || "section";
  let slug = base;
  let n = 2;
  while (used.has(slug)) slug = base + "-" + n++;
  used.add(slug);
  return slug;
}

function siteRelative(url) {
  const root = new URL("./", location.href);
  if (url.origin !== root.origin || !url.pathname.startsWith(root.pathname)) return null;
  return decodeURIComponent(url.pathname.slice(root.pathname.length));
}

function fixLinks(container, fileUrl) {
  container.querySelectorAll("a[href]").forEach((a) => {
    const href = a.getAttribute("href");
    if (!href || href.startsWith("#")) return;
    let url;
    try { url = new URL(href, fileUrl); } catch (e) { return; }
    const rel = siteRelative(url);
    if (rel !== null && /\.md$/i.test(rel)) {
      a.href = "readme.html?f=" + encodeURI(rel) + url.hash;
    } else {
      a.href = url.href;
      if (rel === null || /\.(pdf|png|jpe?g|svg|zip)$/i.test(url.pathname)) {
        a.target = "_blank";
        a.rel = "noopener";
      }
    }
  });
  container.querySelectorAll("img[src]").forEach((img) => {
    try { img.src = new URL(img.getAttribute("src"), fileUrl).href; } catch (e) { /* keep */ }
    img.loading = "lazy";
  });
}

function addHeadingIds(container) {
  const used = new Set();
  const headings = Array.from(container.querySelectorAll("h2, h3, h4"));
  headings.forEach((h) => {
    h.dataset.text = h.textContent;
    h.id = slugify(h.textContent, used);
    const anchor = el("a", "anchor", "#");
    anchor.href = "#" + h.id;
    anchor.setAttribute("aria-label", "Link to this section");
    h.appendChild(anchor);
  });
  return headings.filter((h) => h.tagName !== "H4");
}

function buildToc(headings) {
  if (headings.length < 3) return false;
  tocEl.textContent = "";
  tocEl.appendChild(el("h2", "", "On this page"));
  const list = el("ul");
  headings.forEach((h) => {
    const item = el("li", h.tagName === "H3" ? "sub" : "");
    const link = el("a", "", h.dataset.text);
    link.href = "#" + h.id;
    item.appendChild(link);
    list.appendChild(item);
  });
  tocEl.appendChild(list);
  tocEl.hidden = false;
  layoutEl.classList.add("has-toc");
  return true;
}

function wrapTables(container) {
  container.querySelectorAll("table").forEach((table) => {
    const wrap = el("div", "table-wrap");
    table.parentNode.insertBefore(wrap, table);
    wrap.appendChild(table);
  });
}

function buildHeader(meta, title) {
  const head = el("header", "doc-head");
  const kicker = [meta.type, meta.category].filter(Boolean).join(" · ");
  if (kicker) head.appendChild(el("p", "kicker", kicker.charAt(0).toUpperCase() + kicker.slice(1)));
  head.appendChild(el("h1", "", title));
  if (meta.description) head.appendChild(el("p", "lede", meta.description));
  const chips = el("div", "doc-meta");
  if (meta.status) chips.appendChild(el("span", "chip status", meta.status));
  if (meta.level) chips.appendChild(el("span", "chip", "Level: " + meta.level));
  (Array.isArray(meta.tags) ? meta.tags : []).forEach((t) => chips.appendChild(el("span", "chip tag", "#" + t)));
  if (Array.isArray(meta.languages) && meta.languages.length) {
    const flags = el("span", "flags", meta.languages.map((l) => FLAGS[l.toLowerCase()] || l.toUpperCase()).join(" "));
    flags.title = "Languages: " + meta.languages.join(", ");
    chips.appendChild(flags);
  }
  if (chips.childNodes.length) head.appendChild(chips);
  return head;
}

async function main() {
  const file = pickFile();
  if (!file) return fail("This page only shows .md files that are inside the repo.");
  const fileUrl = new URL(file, location.href);
  crumbPath.textContent = file.split("/").join(" / ");
  document.getElementById("sourceLink").href = REPO_URL + "/blob/main/" + file;

  let text;
  try {
    const response = await fetch(fileUrl.href);
    if (!response.ok) throw new Error(response.status);
    text = await response.text();
  } catch (error) {
    return fail("Could not load " + file + ". Check the address and that the file is in the repo.");
  }

  const { meta, body: rawBody } = splitFrontMatter(text);
  let body = rawBody;
  let title = meta.title;
  const h1 = body.match(/^\s*#\s+(.+?)\s*(\r?\n|$)/);
  if (h1) {
    if (!title) title = h1[1];
    if (!meta.title || h1[1] === meta.title) body = body.slice(h1[0].length);
  }
  title = title || file.split("/").slice(-2, -1)[0] || file;

  marked.setOptions({ gfm: true, breaks: false });
  const html = DOMPurify.sanitize(marked.parse(body), { USE_PROFILES: { html: true } });

  docEl.textContent = "";
  docEl.appendChild(buildHeader(meta, title));
  const content = el("div", "doc-body");
  content.innerHTML = html;
  docEl.appendChild(content);
  if (meta.open) {
    const actions = el("div", "doc-actions");
    const open = el("a", "", meta.open_label || "Open");
    open.href = new URL(meta.open, fileUrl).href;
    actions.appendChild(open);
    docEl.querySelector(".doc-head").appendChild(actions);
  }

  fixLinks(content, fileUrl);
  wrapTables(content);
  buildToc(addHeadingIds(content));
  document.title = title + " · Teaching Hub";
  if (location.hash) {
    const target = document.getElementById(decodeURIComponent(location.hash.slice(1)));
    if (target) target.scrollIntoView();
  }
}

main();
