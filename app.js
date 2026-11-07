// Simple client-side filtering by title keywords, type, and tags pulled from /topics
const searchInput = document.getElementById("searchInput");
const typeFilter = document.getElementById("typeFilter");
const tagFilter = document.getElementById("tagFilter");
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
const emptyStateEl = document.createElement("p");
emptyStateEl.className = "empty-state";
emptyStateEl.textContent = "No topics match your filters yet.";

async function loadTopics() {
  try {
    const response = await fetch("topics/topics.json");
    const payload = await response.json();
    const topics = payload.topics || [];
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

  const fragment = document.createDocumentFragment();

  topics.forEach((topic) => {
    fragment.appendChild(buildTopicCard(topic));
  });

  materialsGrid.innerHTML = "";
  materialsGrid.appendChild(fragment);
  materials = Array.from(materialsGrid.querySelectorAll(".material-card"));
  syncTagOptions(topics);
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

  typeEl.textContent = `${capitalize(topic.type || "session")} · ${
    topic.category || "General"
  }`;
  titleEl.textContent = topic.title || "Untitled topic";
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
    link.href = resource.href || "#";
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

    const shouldShow = matchesSearch && matchesType && matchesTag;
    card.style.display = shouldShow ? "flex" : "none";
    if (shouldShow) visibleCount += 1;
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

loadTopics();

function applyTwemoji(root) {
  if (window.twemoji && root) {
    window.twemoji.parse(root, {
      folder: "svg",
      ext: ".svg"
    });
  }
}
