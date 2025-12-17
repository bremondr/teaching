// Simple client-side filtering by title keywords, type, and tags
const searchInput = document.getElementById("searchInput");
const typeFilter = document.getElementById("typeFilter");
const tagFilter = document.getElementById("tagFilter");
const materials = document.querySelectorAll(".material-card");

function filterMaterials() {
  const searchTerm = searchInput.value.toLowerCase().trim();
  const typeSelection = typeFilter.value;
  const tagSelection = tagFilter.value;

  materials.forEach((card) => {
    const titleText = card.dataset.title.toLowerCase();
    const materialType = card.dataset.type;
    const tags = (card.dataset.tags || "")
      .split(",")
      .map((tag) => tag.trim().toLowerCase());

    const matchesSearch = !searchTerm || titleText.includes(searchTerm);
    const matchesType =
      typeSelection === "all" || materialType === typeSelection;
    const matchesTag =
      tagSelection === "all" || tags.includes(tagSelection);

    const shouldShow = matchesSearch && matchesType && matchesTag;
    card.style.display = shouldShow ? "flex" : "none";
  });
}

searchInput.addEventListener("input", filterMaterials);
typeFilter.addEventListener("change", filterMaterials);
tagFilter.addEventListener("change", filterMaterials);
