// Simple client-side filtering by title keywords, type, and tags pulled from /topics
const searchInput = document.getElementById("searchInput");
const typeFilter = document.getElementById("typeFilter");
const tagFilter = document.getElementById("tagFilter");
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

let materials = [];
let courses = [];
const emptyStateEl = document.createElement("p");
emptyStateEl.className = "empty-state";
emptyStateEl.textContent = "No topics match your filters yet.";

async function loadTopics() {
  try {
    const response = await fetch("topics/topics.json");
    const payload = await response.json();
    const topics = payload.topics || [];
    courses = payload.courses || [];
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
  });

  materials = Array.from(materialsGrid.querySelectorAll(".material-card"));
  syncTagOptions(topics);
  syncCourseOptions(topics);
  filterMaterials();
  applyTwemoji(materialsGrid);
}

// Adds a filter option for every tag used in topics.json that the dropdown does not list yet,
// so index.html never has to be edited when a new item brings a new tag.
function syncTagOptions(topics) {
  const known = new Set(Array.from(tagFilter.options).map((option) => option.value));
  const labels = (tag) => capitalize(tag.replace(/-/g, " "));
  topics.forEach((topic) => {
    toArray(topic.tags).forEach((tag) => {
      if (known.has(tag)) return;
      const option = document.createElement("option");
      option.value = tag;
      option.textContent = labels(tag);
      tagFilter.appendChild(option);
      known.add(tag);
    });
  });
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

// One filter option per course in the list, in the list's order.
function syncCourseOptions() {
  const known = new Set(Array.from(courseFilter.options).map((option) => option.value));
  courses.forEach((course) => {
    const value = course.code.toLowerCase();
    if (known.has(value)) return;
    const option = document.createElement("option");
    option.value = value;
    option.textContent = course.code;
    courseFilter.appendChild(option);
    known.add(value);
  });
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
  tags.forEach((tag) => {
    const tagPill = document.createElement("span");
    tagPill.textContent = `#${tag}`;
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

function filterMaterials() {
  const searchTerm = searchInput.value.toLowerCase().trim();
  const typeSelection = typeFilter.value;
  const tagSelection = tagFilter.value;
  const courseSelection = courseFilter.value;
  let visibleCount = 0;

  materials.forEach((card) => {
    const titleText = card.dataset.title;
    const materialType = card.dataset.type;
    const tags = (card.dataset.tags || "")
      .split(",")
      .map((tag) => tag.trim().toLowerCase())
      .filter(Boolean);

    const matchesSearch = !searchTerm || titleText.includes(searchTerm);
    const matchesType =
      typeSelection === "all" || materialType === typeSelection;
    const matchesTag =
      tagSelection === "all" || tags.includes(tagSelection);

    const matchesCourse =
      courseSelection === "all" || card.dataset.course === courseSelection;

    const shouldShow = matchesSearch && matchesType && matchesTag && matchesCourse;
    card.style.display = shouldShow ? "flex" : "none";
    if (shouldShow) visibleCount += 1;
  });

  // Hide a section while a filter leaves nothing in it. With no filter every section stays, an empty course says so.
  const filtersActive =
    Boolean(searchTerm) || typeSelection !== "all" || tagSelection !== "all" || courseSelection !== "all";
  materialsGrid.querySelectorAll(".group").forEach((group) => {
    const shown = Array.from(group.querySelectorAll(".material-card")).filter(
      (card) => card.style.display !== "none"
    ).length;
    group.hidden = filtersActive && shown === 0;
  });

  if (visibleCount === 0 && materials.length > 0) {
    if (!materialsGrid.contains(emptyStateEl)) {
      materialsGrid.appendChild(emptyStateEl);
    }
  } else if (materialsGrid.contains(emptyStateEl)) {
    materialsGrid.removeChild(emptyStateEl);
  }
}

searchInput.addEventListener("input", filterMaterials);
typeFilter.addEventListener("change", filterMaterials);
tagFilter.addEventListener("change", filterMaterials);
courseFilter.addEventListener("change", filterMaterials);

loadTopics();

function applyTwemoji(root) {
  if (window.twemoji && root) {
    window.twemoji.parse(root, {
      folder: "svg",
      ext: ".svg"
    });
  }
}
