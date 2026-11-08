// Simple client-side filtering by title keywords, type, and tags pulled from /topics
const searchInput = document.getElementById("searchInput");
const typeFilter = document.getElementById("typeFilter");
const tagChips = document.getElementById("tagChips");
const resultCount = document.getElementById("resultCount");
const clearButton = document.getElementById("clearFilters");
const courseFilter = document.getElementById("courseFilter");
const materialsGrid = document.getElementById("materialsGrid");
const topicTemplate = document.getElementById("topic-template");

const LANGUAGE_FLAGS = {
  en: "🇬🇧",
  cs: "🇨🇿",
  sk: "🇸🇰",
  es: "🇪🇸",
  de: "🇩🇪",
  fr: "🇫🇷",
  pl: "🇵🇱"
};

const LANGUAGE_NAMES = {
  en: "English",
  cs: "Czech",
  sk: "Slovak",
  es: "Spanish",
  de: "German",
  fr: "French",
  pl: "Polish"
};

const TYPE_LABELS = { lecture: "Lecture", workshop: "Workshop", template: "Template" };

let materials = [];
let courses = [];
let tagList = [];
// The filter state. tags is a list: a card must have every chosen tag.
const state = { q: "", type: "all", course: "all", tags: [] };
const emptyStateEl = document.createElement("p");
emptyStateEl.className = "empty-state";
emptyStateEl.textContent = "No topics match your filters yet.";

async function loadTopics() {
  try {
    const response = await fetch("topics/topics.json");
    const payload = await response.json();
    const topics = payload.topics || [];
    courses = payload.courses || [];
    tagList = payload.tags || [];
    renderTopics(topics);
  } catch (error) {
    materialsGrid.innerHTML =
      "<p class=\"empty-state\">Unable to load topics. Check topics/topics.json.</p>";
  }
}

function renderTopics(topics) {
  if (!topicTemplate) {
    console.warn("Topic template not found; unable to render cards.");
    return;
  }

  materialsGrid.innerHTML = "";
  const jump = document.getElementById("jump");
  jump.innerHTML = "";

  buildGroups().forEach((group) => {
    const items = topics.filter(group.match);
    // A course always gets its section, even while nothing is published for it. The other two only when they have items.
    if (!items.length && group.kind !== "course") return;

    const section = document.createElement("section");
    section.className = `group group-${group.kind}`;
    section.id = group.id;

    const head = document.createElement("div");
    head.className = "group-head";
    const title = document.createElement("h2");
    title.textContent = group.title;
    if (group.subtitle) {
      const small = document.createElement("small");
      small.textContent = group.subtitle;
      title.appendChild(small);
    }
    head.appendChild(title);
    if (group.intro) {
      const intro = document.createElement("p");
      intro.textContent = group.intro;
      head.appendChild(intro);
    }
    section.appendChild(head);

    if (items.length) {
      const grid = document.createElement("div");
      grid.className = "materials-grid";
      items.forEach((topic) => grid.appendChild(buildTopicCard(topic)));
      section.appendChild(grid);
    } else {
      const empty = document.createElement("p");
      empty.className = "group-empty";
      empty.textContent = "Nothing is published for this course yet.";
      section.appendChild(empty);
    }
    materialsGrid.appendChild(section);

    const link = document.createElement("a");
    link.className = "pill";
    link.href = `#${group.id}`;
    link.textContent = group.title;
    jump.appendChild(link);
    section.jumpLink = link;
  });

  materials = Array.from(materialsGrid.querySelectorAll(".material-card"));
  readUrl();
  filterMaterials();
  applyTwemoji(materialsGrid);
}

// The sections of the page. The courses come from the "courses" list at the top of topics.json (one section each,
// in that order). Then lectures and workshops with no course, then every template as a building block. A template can
// still name a course (it says so on its card and the course filter finds it), but it is listed with the building blocks.
function courseCode(topic) {
  const code = (topic.course || "").trim();
  return courses.some((course) => course.code === code) ? code : "";
}

function buildGroups() {
  const groups = courses.map((course) => ({
    id: `course-${course.code.toLowerCase()}`,
    kind: "course",
    title: course.code,
    subtitle: course.title,
    intro: course.description,
    match: (topic) => topic.type !== "template" && courseCode(topic) === course.code
  }));
  groups.push({
    id: "standalone",
    kind: "standalone",
    title: "Standalone lectures and workshops",
    intro: "Guest lectures and workshops that do not belong to a course.",
    match: (topic) => topic.type !== "template" && !courseCode(topic)
  });
  groups.push({
    id: "building-blocks",
    kind: "blocks",
    title: "Building blocks",
    intro: "Exercises, templates and handouts to reuse inside any lecture or workshop. Some were made for a course and say so on the card.",
    match: (topic) => topic.type === "template"
  });
  return groups;
}

function buildTopicCard(topic) {
  const template = topicTemplate.content.cloneNode(true);
  const card = template.querySelector(".material-card");
  const tagsContainer = template.querySelector("[data-topic-tags]");
  const typeEl = template.querySelector("[data-topic-type]");
  const titleEl = template.querySelector("[data-topic-title]");
  const descEl = template.querySelector("[data-topic-description]");
  const langWrapper = template.querySelector("[data-language-flags]");
  const flagList = template.querySelector("[data-flag-list]");
  const levelEl = template.querySelector("[data-topic-level]");
  const statusEl = template.querySelector("[data-topic-status]");
  const resourcesList = template.querySelector("[data-topic-resources]");

  const tags = toArray(topic.tags);
  const languages = toArray(topic.languages);
  const resources = toArray(topic.resources);

  card.dataset.title = (topic.title || "").toLowerCase();
  card.dataset.type = topic.type || "session";
  card.dataset.tags = tags.join(",");
  card.dataset.course = (topic.course || "").trim().toLowerCase();
  card.dataset.search = [topic.title, topic.description, topic.category, topic.course, ...tags.map(tagLabel)]
    .join(" ")
    .toLowerCase();

  typeEl.textContent = `${capitalize(topic.type || "session")} · ${
    topic.category || "General"
  }${topic.course ? ` · ${topic.course}` : ""}`;
  const readmeResource = resources.find(
    (r) => r.available && /\.md($|#)/i.test(r.href || "") && !/^[a-z][a-z0-9+.-]*:/i.test(r.href)
  );
  if (readmeResource) {
    // The card title opens the item's README in the viewer.
    const titleLink = document.createElement("a");
    titleLink.className = "card-title-link";
    titleLink.href = viewerHref(readmeResource.href);
    titleLink.textContent = topic.title || "Untitled topic";
    titleEl.appendChild(titleLink);
  } else {
    titleEl.textContent = topic.title || "Untitled topic";
  }
  descEl.textContent = topic.description || "";

  tagsContainer.innerHTML = "";
  // A tag on a card is a button: it adds or removes that tag in the filter.
  tags.forEach((tag) => {
    const tagPill = document.createElement("button");
    tagPill.type = "button";
    tagPill.className = "card-tag";
    tagPill.dataset.tag = tag;
    tagPill.textContent = tagLabel(tag);
    tagPill.setAttribute("aria-pressed", "false");
    tagPill.title = `Filter by ${tagLabel(tag)}`;
    tagPill.addEventListener("click", () => toggleTag(tag));
    tagsContainer.appendChild(tagPill);
  });

  flagList.innerHTML = "";
  if (languages.length) {
    langWrapper.style.display = "flex";
    languages.forEach((langCode) => {
      const normalizedCode = langCode.toLowerCase();
      const flag = LANGUAGE_FLAGS[normalizedCode] || normalizedCode.toUpperCase();
      const name =
        LANGUAGE_NAMES[normalizedCode] || normalizedCode.toUpperCase();

      const flagSpan = document.createElement("span");
      flagSpan.className = "flag-icon";
      flagSpan.textContent = flag;
      flagSpan.setAttribute("aria-label", `Available in ${name}`);
      flagSpan.title = `Available in ${name}`;
      flagList.appendChild(flagSpan);
    });
  } else {
    langWrapper.style.display = "none";
  }

  if (topic.level) {
    levelEl.textContent = `Level: ${topic.level}`;
  } else {
    levelEl.remove();
  }

  if (topic.status) {
    statusEl.textContent = topic.status;
  } else {
    statusEl.remove();
  }

  resourcesList.innerHTML = "";
  resources.forEach((resource) => {
    const item = document.createElement("li");
    const link = document.createElement("a");
    link.textContent = resource.label || "Resource";
    link.href = viewerHref(resource.href);
    if (!resource.available) {
      link.setAttribute("aria-disabled", "true");
    } else {
      link.target = "_blank";
      link.rel = "noopener";
    }
    item.appendChild(link);
    resourcesList.appendChild(item);
  });

  return template;
}

// Links to Markdown files of this repo open in the readme viewer (readme.html) so they render nicely.
function viewerHref(href) {
  if (!href || href === "#" || /^[a-z][a-z0-9+.-]*:/i.test(href)) return href || "#";
  const path = href.replace(/^\.\//, "");
  return /\.md($|#)/i.test(path) ? "readme.html?f=" + encodeURI(path) : href;
}

function capitalize(value = "") {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function toArray(value) {
  if (Array.isArray(value)) {
    return value;
  }
  if (!value) {
    return [];
  }
  return [value];
}

// Display name of a tag: the label from the "tags" list of topics.json, else the code with spaces.
function tagLabel(tag) {
  const entry = tagList.find((t) => t.code === tag);
  return entry ? entry.label : capitalize(tag.replace(/-/g, " "));
}

function cardTags(card) {
  return (card.dataset.tags || "").split(",").filter(Boolean);
}

// Does a card pass the filters? "skip" leaves one filter out, to count what choosing a value of it would give.
function passes(card, skip) {
  const q = state.q.toLowerCase().trim();
  if (skip !== "q" && q && !card.dataset.search.includes(q)) return false;
  if (skip !== "type" && state.type !== "all" && card.dataset.type !== state.type) return false;
  if (skip !== "course" && state.course !== "all" && card.dataset.course !== state.course) return false;
  if (skip !== "tags" && state.tags.length) {
    const have = cardTags(card);
    if (!state.tags.every((t) => have.includes(t))) return false;
  }
  return true;
}

function isFiltered() {
  return Boolean(state.q.trim()) || state.type !== "all" || state.course !== "all" || state.tags.length > 0;
}

function toggleTag(tag) {
  state.tags = state.tags.includes(tag) ? state.tags.filter((t) => t !== tag) : [...state.tags, tag];
  filterMaterials();
}

// Fills a select with "All" plus the values that still leave at least one card (the chosen value always stays).
function fillSelect(select, allLabel, values, key) {
  select.innerHTML = "";
  const all = new Option(allLabel, "all");
  select.appendChild(all);
  values.forEach(({ value, label }) => {
    const count = materials.filter((card) => card.dataset[key] === value && passes(card, key)).length;
    if (!count && state[key] !== value) return;
    select.appendChild(new Option(`${label} (${count})`, value));
  });
  select.value = state[key];
}

function renderControls() {
  const present = (key) => new Set(materials.map((card) => card.dataset[key]));
  const types = present("type");
  fillSelect(
    typeFilter,
    "All types",
    Object.keys(TYPE_LABELS).filter((t) => types.has(t)).map((t) => ({ value: t, label: TYPE_LABELS[t] })),
    "type"
  );
  fillSelect(
    courseFilter,
    "All courses",
    courses.map((c) => ({ value: c.code.toLowerCase(), label: c.code })),
    "course"
  );

  // Tag chips: only tags that still leave a card, plus the chosen ones. The number is how many cards the tag leaves.
  const known = new Set(tagList.map((t) => t.code));
  const codes = [...tagList.map((t) => t.code), ...new Set(materials.flatMap(cardTags).filter((t) => !known.has(t)))];
  const focused = document.activeElement && document.activeElement.classList.contains("chip") ? document.activeElement.dataset.tag : null;
  tagChips.innerHTML = "";
  codes.forEach((tag) => {
    const chosen = state.tags.includes(tag);
    const count = materials.filter((card) => passes(card, "tags") && cardTags(card).includes(tag) &&
      state.tags.every((t) => cardTags(card).includes(t))).length;
    if (!count && !chosen) return;
    const chip = document.createElement("button");
    chip.type = "button";
    chip.className = "chip";
    chip.dataset.tag = tag;
    chip.setAttribute("aria-pressed", String(chosen));
    chip.append(tagLabel(tag));
    const n = document.createElement("span");
    n.className = "chip-count";
    n.textContent = String(count);
    chip.appendChild(n);
    chip.addEventListener("click", () => toggleTag(tag));
    tagChips.appendChild(chip);
  });
  if (focused) {
    const again = tagChips.querySelector(`[data-tag="${focused}"]`);
    if (again && document.activeElement === document.body) again.focus();
  }
  document.querySelector(".field-tags").hidden = tagChips.children.length === 0;
}

function filterMaterials() {
  const filtersActive = isFiltered();
  let visibleCount = 0;

  materials.forEach((card) => {
    const shouldShow = passes(card);
    card.style.display = shouldShow ? "flex" : "none";
    if (shouldShow) visibleCount += 1;
    card.querySelectorAll(".card-tag").forEach((pill) =>
      pill.setAttribute("aria-pressed", String(state.tags.includes(pill.dataset.tag)))
    );
  });

  // Hide a section (and its jump link) while a filter leaves nothing in it. With no filter every section stays,
  // an empty course says so.
  materialsGrid.querySelectorAll(".group").forEach((group) => {
    const shown = Array.from(group.querySelectorAll(".material-card")).filter(
      (card) => card.style.display !== "none"
    ).length;
    group.hidden = filtersActive && shown === 0;
    if (group.jumpLink) group.jumpLink.hidden = group.hidden;
  });

  if (visibleCount === 0 && materials.length > 0) {
    if (!materialsGrid.contains(emptyStateEl)) {
      materialsGrid.appendChild(emptyStateEl);
    }
  } else if (materialsGrid.contains(emptyStateEl)) {
    materialsGrid.removeChild(emptyStateEl);
  }

  resultCount.textContent = `${visibleCount} of ${materials.length} materials`;
  clearButton.disabled = !filtersActive;
  renderControls();
  writeUrl();
}

// The choice lives in the address, so a filtered view can be shared: ?q=sketch&type=template&course=ni-psd&tag=ideation,sketching
function readUrl() {
  const params = new URLSearchParams(location.search);
  const types = new Set(materials.map((card) => card.dataset.type));
  const codes = new Set(courses.map((c) => c.code.toLowerCase()));
  const known = new Set([...tagList.map((t) => t.code), ...materials.flatMap(cardTags)]);
  state.q = params.get("q") || "";
  state.type = types.has(params.get("type")) ? params.get("type") : "all";
  state.course = codes.has((params.get("course") || "").toLowerCase()) ? params.get("course").toLowerCase() : "all";
  state.tags = (params.get("tag") || "").split(",").filter((t, i, all) => known.has(t) && all.indexOf(t) === i);
  searchInput.value = state.q;
}

function writeUrl() {
  const params = new URLSearchParams();
  if (state.q.trim()) params.set("q", state.q.trim());
  if (state.type !== "all") params.set("type", state.type);
  if (state.course !== "all") params.set("course", state.course);
  if (state.tags.length) params.set("tag", state.tags.join(","));
  const query = params.toString().replace(/%2C/g, ",");
  try {
    history.replaceState(null, "", location.pathname + (query ? `?${query}` : "") + location.hash);
  } catch (error) {
    /* a file:// page may refuse; the filters still work */
  }
}

searchInput.addEventListener("input", () => {
  state.q = searchInput.value;
  filterMaterials();
});
typeFilter.addEventListener("change", () => {
  state.type = typeFilter.value;
  filterMaterials();
});
courseFilter.addEventListener("change", () => {
  state.course = courseFilter.value;
  filterMaterials();
});
clearButton.addEventListener("click", () => {
  state.q = "";
  state.type = "all";
  state.course = "all";
  state.tags = [];
  searchInput.value = "";
  filterMaterials();
  searchInput.focus();
});

loadTopics();

function applyTwemoji(root) {
  if (window.twemoji && root) {
    window.twemoji.parse(root, {
      folder: "svg",
      ext: ".svg"
    });
  }
}
