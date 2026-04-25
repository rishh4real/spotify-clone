const trackDisplay = document.getElementById("playerTrack");
const artistDisplay = document.getElementById("playerArtist");
const playerCover = document.getElementById("playerCover");
const heroTitle = document.getElementById("heroTitle");
const heroCopy = document.getElementById("heroCopy");
const heroCount = document.getElementById("heroCount");
const heroLength = document.getElementById("heroLength");
const heroMood = document.getElementById("heroMood");
const heroPlayButton = document.getElementById("heroPlayButton");
const playAllButton = document.getElementById("playAllButton");
const playerMainButton = document.getElementById("playerMainButton");
const previousButton = document.getElementById("previousButton");
const nextButton = document.getElementById("nextButton");
const shuffleButton = document.getElementById("shuffleButton");
const progressFill = document.getElementById("progressFill");
const currentTimeLabel = document.getElementById("currentTimeLabel");
const durationLabel = document.getElementById("durationLabel");
const playStateLabel = document.getElementById("playStateLabel");
const themeToggle = document.getElementById("themeToggle");
const searchInput = document.getElementById("searchInput");
const resultCount = document.getElementById("resultCount");
const currentCategory = document.getElementById("currentCategory");
const playlistTitle = document.getElementById("playlistTitle");
const playlistDescription = document.getElementById("playlistDescription");
const playlistTable = document.getElementById("playlistTable");
const queueList = document.getElementById("queueList");
const queueCount = document.getElementById("queueCount");
const volumeSlider = document.getElementById("volumeSlider");
const volumeValue = document.getElementById("volumeValue");
const tagChips = document.querySelectorAll(".tag-chip");
const savedTheme = localStorage.getItem("spotify-clone-theme");

const tracks = [
  {
    id: 1,
    title: "Focus Flow",
    artist: "Ariana Lane",
    album: "Study Sessions",
    duration: 176,
    category: "focus",
    image: "./assetss/card1img.jpeg",
    notes: [261.63, 329.63, 392, 523.25],
    description: "Soft layered keys for calm concentration.",
  },
  {
    id: 2,
    title: "City Rain",
    artist: "Midnight Club",
    album: "After Hours",
    duration: 148,
    category: "music",
    image: "./assetss/card2img.jpeg",
    notes: [220, 261.63, 293.66, 349.23],
    description: "Night-drive textures with mellow movement.",
  },
  {
    id: 3,
    title: "Lo-Fi Beats",
    artist: "Nova Drift",
    album: "Quiet Corners",
    duration: 164,
    category: "focus",
    image: "./assetss/card3img.jpeg",
    notes: [196, 220, 246.94, 261.63],
    description: "Simple looping demo built for study mode.",
  },
  {
    id: 4,
    title: "Stage Lights",
    artist: "Arena Echo",
    album: "Live Cut",
    duration: 154,
    category: "live",
    image: "./assetss/card4img.jpeg",
    notes: [329.63, 392, 440, 493.88],
    description: "A brighter live-session inspired preview.",
  },
  {
    id: 5,
    title: "Mic Check",
    artist: "Campus Talks",
    album: "Podcast Hour",
    duration: 132,
    category: "podcast",
    image: "./assetss/card5img.jpeg",
    notes: [174.61, 196, 220, 246.94],
    description: "Speech-like low synth pulses for a podcast lane.",
  },
  {
    id: 6,
    title: "Weekend Replay",
    artist: "Ocean Avenue",
    album: "Sunset Replay",
    duration: 182,
    category: "music",
    image: "./assetss/card6img.jpeg",
    notes: [293.66, 349.23, 392, 440],
    description: "A brighter hook-driven pattern for replay value.",
  },
  {
    id: 7,
    title: "Night Bus",
    artist: "Nova Drift",
    album: "City Stories",
    duration: 169,
    category: "music",
    image: "./assetss/card6img.jpeg",
    notes: [164.81, 196, 246.94, 293.66],
    description: "Slow-moving tones for late rides and quiet streets.",
  },
  {
    id: 8,
    title: "Your Daily Sound",
    artist: "Spotify Clone Mix",
    album: "Made For You",
    duration: 158,
    category: "all",
    image: "./assetss/card2img.jpeg",
    notes: [261.63, 311.13, 369.99, 415.3],
    description: "A custom preview lane stitched for demo polish.",
  },
];

const heroPresets = {
  all: {
    title: "Focus Flow",
    copy: "Soft beats, clean transitions, and enough energy to keep your assignments moving.",
    mood: "Best for focus",
  },
  music: {
    title: "Campus Charts",
    copy: "The biggest tracks in your circle right now, from upbeat pop to mellow late-night picks.",
    mood: "Best for replay",
  },
  focus: {
    title: "Deep Work Mix",
    copy: "Low-noise, low-friction tracks that stay steady while you finish assignments and revisions.",
    mood: "Best for focus",
  },
  podcast: {
    title: "Mic Check",
    copy: "Short spoken-word style previews and cleaner pacing for breaks between songs.",
    mood: "Best for breaks",
  },
  live: {
    title: "Stage Lights",
    copy: "Bigger crowd energy, brighter transitions, and a more open live-session feeling.",
    mood: "Best for energy",
  },
};

let activeCategory = "all";
let searchTerm = "";
let currentTrackIndex = 0;
let filteredTracks = [...tracks];
let isPlaying = false;
let shuffleEnabled = false;
let elapsedSeconds = 0;
let progressTimer = null;
let audioContext = null;
let oscillator = null;
let gainNode = null;
let noteTimer = null;

function formatTime(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

function syncThemeLabel() {
  themeToggle.textContent = document.body.classList.contains("light-mode")
    ? "Dark mode"
    : "Moonlight mode";
}

function syncVolumeLabel() {
  volumeValue.textContent = `${volumeSlider.value}%`;
}

function getVisibleTracks() {
  return tracks.filter((track) => {
    const matchesCategory =
      activeCategory === "all" || track.category === activeCategory || track.category === "all";
    const haystack = `${track.title} ${track.artist} ${track.album} ${track.category}`.toLowerCase();
    const matchesSearch = haystack.includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });
}

function updateHero() {
  const preset = heroPresets[activeCategory];
  const totalDuration = filteredTracks.reduce((sum, track) => sum + track.duration, 0);

  heroTitle.textContent = preset.title;
  heroCopy.textContent = preset.copy;
  heroCount.textContent = `${filteredTracks.length} tracks`;
  heroLength.textContent = `${Math.max(1, Math.round(totalDuration / 60))} min`;
  heroMood.textContent = preset.mood;
  currentCategory.textContent = activeCategory.charAt(0).toUpperCase() + activeCategory.slice(1);
  resultCount.textContent = `${filteredTracks.length} track${filteredTracks.length === 1 ? "" : "s"}`;
  playlistTitle.textContent = `${preset.title} Mix`;
  playlistDescription.textContent =
    filteredTracks.length > 0
      ? `${filteredTracks[0].description} Search and category filters update this table live.`
      : "No matching tracks right now. Try another search or category.";
}

function renderQueue() {
  const upcoming = filteredTracks.slice(currentTrackIndex + 1, currentTrackIndex + 4);
  queueCount.textContent = `${upcoming.length} song${upcoming.length === 1 ? "" : "s"}`;

  if (upcoming.length === 0) {
    queueList.innerHTML = '<div class="empty-state">No more songs in queue.</div>';
    return;
  }

  queueList.innerHTML = upcoming
    .map(
      (track) => `
        <div class="queue-track">
          <img src="${track.image}" alt="${track.title} cover" />
          <div>
            <strong>${track.title}</strong>
            <p>${track.artist}</p>
          </div>
          <button type="button" data-track-id="${track.id}">▶</button>
        </div>
      `
    )
    .join("");

  queueList.querySelectorAll("button").forEach((button) => {
    button.addEventListener("click", () => {
      const targetIndex = filteredTracks.findIndex((track) => track.id === Number(button.dataset.trackId));
      if (targetIndex >= 0) {
        playTrackAtIndex(targetIndex);
      }
    });
  });
}

function renderPlaylist() {
  if (filteredTracks.length === 0) {
    playlistTable.innerHTML = '<div class="empty-state">No tracks matched your search. Try a different word.</div>';
    renderQueue();
    return;
  }

  playlistTable.innerHTML = filteredTracks
    .map((track, index) => {
      const isActive = index === currentTrackIndex;
      return `
        <article class="track-row ${isActive ? "active-row" : ""}" tabindex="0" data-track-id="${track.id}">
          <span>${String(index + 1).padStart(2, "0")}</span>
          <div class="track-meta">
            <img class="track-cover" src="${track.image}" alt="${track.title} cover" />
            <div>
              <div class="track-title">${track.title}</div>
              <div class="track-subtitle">${track.artist} • ${track.album}</div>
            </div>
          </div>
          <span>${track.category}</span>
          <span>${formatTime(track.duration)}</span>
          <button class="track-action" type="button">Play</button>
        </article>
      `;
    })
    .join("");

  playlistTable.querySelectorAll(".track-row").forEach((row) => {
    const trackId = Number(row.dataset.trackId);
    const openTrack = () => {
      const index = filteredTracks.findIndex((track) => track.id === trackId);
      if (index >= 0) {
        playTrackAtIndex(index);
      }
    };

    row.addEventListener("click", openTrack);
    row.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        openTrack();
      }
    });
  });

  renderQueue();
}

function syncTrackInfo() {
  const currentTrack = filteredTracks[currentTrackIndex] || tracks[0];
  trackDisplay.textContent = currentTrack.title;
  artistDisplay.textContent = `${currentTrack.artist} • ${currentTrack.album}`;
  playerCover.src = currentTrack.image;
  durationLabel.textContent = formatTime(currentTrack.duration);
  currentTimeLabel.textContent = formatTime(elapsedSeconds);
  progressFill.style.width = `${(elapsedSeconds / currentTrack.duration) * 100}%`;
  playStateLabel.textContent = isPlaying ? "Playing" : "Paused";
  document.body.classList.toggle("is-playing", isPlaying);
}

function stopSynth() {
  if (noteTimer) {
    clearInterval(noteTimer);
    noteTimer = null;
  }

  if (oscillator) {
    oscillator.stop();
    oscillator.disconnect();
    oscillator = null;
  }

  if (gainNode) {
    gainNode.disconnect();
    gainNode = null;
  }
}

function startSynth(track) {
  stopSynth();

  audioContext = audioContext || new window.AudioContext();
  oscillator = audioContext.createOscillator();
  gainNode = audioContext.createGain();

  oscillator.type = track.category === "podcast" ? "square" : track.category === "live" ? "sawtooth" : "sine";
  gainNode.gain.value = Number(volumeSlider.value) / 400;
  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);
  oscillator.start();

  let noteIndex = 0;
  oscillator.frequency.setValueAtTime(track.notes[0], audioContext.currentTime);
  noteTimer = setInterval(() => {
    noteIndex = (noteIndex + 1) % track.notes.length;
    oscillator.frequency.linearRampToValueAtTime(track.notes[noteIndex], audioContext.currentTime + 0.12);
  }, 350);
}

function stopProgressLoop() {
  if (progressTimer) {
    clearInterval(progressTimer);
    progressTimer = null;
  }
}

function startProgressLoop() {
  stopProgressLoop();

  progressTimer = setInterval(() => {
    if (!isPlaying || filteredTracks.length === 0) {
      return;
    }

    elapsedSeconds += 1;
    const currentTrack = filteredTracks[currentTrackIndex];

    if (elapsedSeconds >= currentTrack.duration) {
      playNextTrack();
      return;
    }

    syncTrackInfo();
  }, 1000);
}

function setPlaybackState(nextState) {
  isPlaying = nextState;
  heroPlayButton.textContent = isPlaying ? "Pause" : "Play now";
  playerMainButton.style.transform = isPlaying ? "scale(1.08)" : "scale(1)";

  if (filteredTracks.length > 0 && isPlaying) {
    startSynth(filteredTracks[currentTrackIndex]);
  } else {
    stopSynth();
  }

  syncTrackInfo();
}

function playTrackAtIndex(index) {
  if (filteredTracks.length === 0) {
    return;
  }

  currentTrackIndex = index;
  elapsedSeconds = 0;
  setPlaybackState(true);
  renderPlaylist();
}

function playNextTrack() {
  if (filteredTracks.length === 0) {
    return;
  }

  if (shuffleEnabled) {
    currentTrackIndex = Math.floor(Math.random() * filteredTracks.length);
  } else {
    currentTrackIndex = (currentTrackIndex + 1) % filteredTracks.length;
  }

  elapsedSeconds = 0;
  setPlaybackState(true);
  renderPlaylist();
}

function playPreviousTrack() {
  if (filteredTracks.length === 0) {
    return;
  }

  currentTrackIndex = (currentTrackIndex - 1 + filteredTracks.length) % filteredTracks.length;
  elapsedSeconds = 0;
  setPlaybackState(true);
  renderPlaylist();
}

function applyFilters() {
  filteredTracks = getVisibleTracks();

  if (filteredTracks.length === 0) {
    currentTrackIndex = 0;
    elapsedSeconds = 0;
    setPlaybackState(false);
    renderPlaylist();
    updateHero();
    return;
  }

  if (currentTrackIndex >= filteredTracks.length) {
    currentTrackIndex = 0;
  }

  elapsedSeconds = 0;
  renderPlaylist();
  updateHero();
  syncTrackInfo();
}

searchInput.addEventListener("input", () => {
  searchTerm = searchInput.value.trim();
  applyFilters();
});

tagChips.forEach((chip) => {
  chip.addEventListener("click", () => {
    tagChips.forEach((item) => item.classList.remove("active-chip"));
    chip.classList.add("active-chip");
    activeCategory = chip.dataset.category;
    applyFilters();
  });
});

heroPlayButton.addEventListener("click", () => {
  if (filteredTracks.length === 0) {
    return;
  }

  setPlaybackState(!isPlaying);
});

playerMainButton.addEventListener("click", () => {
  if (filteredTracks.length === 0) {
    return;
  }

  if (!isPlaying && elapsedSeconds === 0) {
    playTrackAtIndex(currentTrackIndex);
    return;
  }

  setPlaybackState(!isPlaying);
});

playAllButton.addEventListener("click", () => {
  if (filteredTracks.length > 0) {
    playTrackAtIndex(0);
  }
});

previousButton.addEventListener("click", playPreviousTrack);
nextButton.addEventListener("click", playNextTrack);

shuffleButton.addEventListener("click", () => {
  shuffleEnabled = !shuffleEnabled;
  shuffleButton.style.opacity = shuffleEnabled ? "1" : "0.7";
});

volumeSlider.addEventListener("input", () => {
  syncVolumeLabel();
  if (gainNode) {
    gainNode.gain.value = Number(volumeSlider.value) / 400;
  }
});

document.addEventListener("keydown", (event) => {
  if (event.code === "Space" && event.target.tagName !== "INPUT") {
    event.preventDefault();
    heroPlayButton.click();
  }

  if (event.key === "ArrowRight") {
    playNextTrack();
  }

  if (event.key === "ArrowLeft") {
    playPreviousTrack();
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
syncVolumeLabel();
applyFilters();
startProgressLoop();
