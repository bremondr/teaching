// Simple client-side filtering by title keywords, format, and track
const searchInput = document.getElementById("searchInput");
const formatFilter = document.getElementById("formatFilter");
const trackFilter = document.getElementById("trackFilter");
const materials = document.querySelectorAll(".material-card");

function filterMaterials() {
  const searchTerm = searchInput.value.toLowerCase().trim();
  const formatSelection = formatFilter.value;
  const trackSelection = trackFilter.value;

  materials.forEach((card) => {
    const titleText = card.dataset.title.toLowerCase();
    const formats = card.dataset.format.split(",");
    const track = card.dataset.track;

    const matchesSearch = !searchTerm || titleText.includes(searchTerm);
    const matchesFormat =
      formatSelection === "all" || formats.includes(formatSelection);
    const matchesTrack = trackSelection === "all" || track === trackSelection;

    const shouldShow = matchesSearch && matchesFormat && matchesTrack;
    card.style.display = shouldShow ? "flex" : "none";
  });
}

searchInput.addEventListener("input", filterMaterials);
formatFilter.addEventListener("change", filterMaterials);
trackFilter.addEventListener("change", filterMaterials);
