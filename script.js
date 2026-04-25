const trackDisplay = document.getElementById("playerTrack");
const artistDisplay = document.getElementById("playerArtist");
const playerCover = document.getElementById("playerCover");
const heroPlayButton = document.getElementById("heroPlayButton");
const playerMainButton = document.getElementById("playerMainButton");
const progressFill = document.getElementById("progressFill");
const themeToggle = document.getElementById("themeToggle");
const quickCards = document.querySelectorAll(".quick-card");
const musicCards = document.querySelectorAll(".music-card");
const tagChips = document.querySelectorAll(".tag-chip");
const savedTheme = localStorage.getItem("spotify-clone-theme");

let isPlaying = false;
let progressValue = 34;
let progressTimer = null;

function syncProgress() {
  progressFill.style.width = `${progressValue}%`;
}

function updatePlayer(trackName, subtitle, imageSource) {
  trackDisplay.textContent = trackName;
  artistDisplay.textContent = subtitle;

  if (imageSource) {
    playerCover.src = imageSource;
  }
}

function syncThemeLabel() {
  themeToggle.textContent = document.body.classList.contains("light-mode")
    ? "Dark mode"
    : "Moonlight mode";
}

function startProgressLoop() {
  clearInterval(progressTimer);
  progressTimer = setInterval(() => {
    if (!isPlaying) {
      return;
    }

    progressValue += 1;

    if (progressValue > 100) {
      progressValue = 0;
    }

    syncProgress();
  }, 800);
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

function setActiveChip(selectedChip) {
  tagChips.forEach((chip) => chip.classList.remove("active-chip"));
  selectedChip.classList.add("active-chip");
}

function handleQuickCard(card) {
  const image = card.querySelector("img");
  updatePlayer(card.dataset.track, "Picked from your quick access shelf", image.src);
  setActiveQuickCard(card);
  progressValue = 18;
  syncProgress();
}

function handleMusicCard(card) {
  const image = card.querySelector("img");
  updatePlayer(card.dataset.track, "From your trending collection", image.src);
  progressValue = 52;
  syncProgress();
}

quickCards.forEach((card) => {
  card.addEventListener("click", () => handleQuickCard(card));
  card.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      handleQuickCard(card);
    }
  });
});

musicCards.forEach((card) => {
  card.addEventListener("click", () => handleMusicCard(card));
  card.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      handleMusicCard(card);
    }
  });
});

tagChips.forEach((chip) => {
  chip.addEventListener("click", () => setActiveChip(chip));
});

heroPlayButton.addEventListener("click", togglePlayback);
playerMainButton.addEventListener("click", togglePlayback);

document.addEventListener("keydown", (event) => {
  if (event.code === "Space" && event.target.tagName !== "INPUT") {
    event.preventDefault();
    togglePlayback();
  }
});

themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("light-mode");
  localStorage.setItem(
    "spotify-clone-theme",
    document.body.classList.contains("light-mode") ? "light" : "dark"
  );
  syncThemeLabel();
});

if (savedTheme === "light") {
  document.body.classList.add("light-mode");
}

syncThemeLabel();
syncProgress();
startProgressLoop();
