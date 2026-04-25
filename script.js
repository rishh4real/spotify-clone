const trackDisplay = document.getElementById("playerTrack");
const artistDisplay = document.getElementById("playerArtist");
const heroPlayButton = document.getElementById("heroPlayButton");
const playerMainButton = document.getElementById("playerMainButton");
const progressFill = document.getElementById("progressFill");
const themeToggle = document.getElementById("themeToggle");
const quickCards = document.querySelectorAll(".quick-card");
const musicCards = document.querySelectorAll(".music-card");

let isPlaying = false;
let progressValue = 34;

function updatePlayer(trackName, subtitle) {
  trackDisplay.textContent = trackName;
  artistDisplay.textContent = subtitle;
}

function togglePlayback() {
  isPlaying = !isPlaying;
  heroPlayButton.textContent = isPlaying ? "Pause" : "Play now";
  playerMainButton.style.transform = isPlaying ? "scale(1.08)" : "scale(1)";
}

function setActiveQuickCard(selectedCard) {
  quickCards.forEach((card) => card.classList.remove("active-card"));
  selectedCard.classList.add("active-card");
}

quickCards.forEach((card) => {
  card.addEventListener("click", () => {
    const trackName = card.dataset.track;
    updatePlayer(trackName, "Picked from your quick access shelf");
    setActiveQuickCard(card);
    progressValue = 18;
    progressFill.style.width = `${progressValue}%`;
  });
});

musicCards.forEach((card) => {
  card.addEventListener("click", () => {
    const trackName = card.dataset.track;
    updatePlayer(trackName, "From your trending collection");
    progressValue = 52;
    progressFill.style.width = `${progressValue}%`;
  });
});

heroPlayButton.addEventListener("click", togglePlayback);
playerMainButton.addEventListener("click", togglePlayback);

themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("light-mode");
  themeToggle.textContent = document.body.classList.contains("light-mode")
    ? "Dark mode"
    : "Moonlight mode";
});
