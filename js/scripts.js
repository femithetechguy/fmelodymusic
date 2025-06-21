console.log("JS loaded");
document.body.style.outline = "5px solid lime"; // Should see a green outline if CSS/JS both work

document.addEventListener("DOMContentLoaded", function () {
  const audio = document.getElementById("audio-ltmd");
  const playBtn = document.getElementById("play-ltmd");
  const cover = document.getElementById("ltmd_cover");
  const progress = document.getElementById("progress-ltmd");
  const current = document.getElementById("current-ltmd");
  const duration = document.getElementById("duration-ltmd");
  const speed = document.getElementById("speed-ltmd");

  playBtn.addEventListener("click", function () {
    if (audio.paused) {
      audio.play();
      playBtn.querySelector("i").className = "bi bi-stop-fill me-1";
      playBtn.querySelector("span").textContent = "Stop";
      cover.classList.add("pulsate");
    } else {
      audio.pause();
      playBtn.querySelector("i").className = "bi bi-play-fill me-1";
      playBtn.querySelector("span").textContent = "Play";
      cover.classList.remove("pulsate");
    }
  });

  audio.addEventListener("ended", function () {
    playBtn.querySelector("i").className = "bi bi-play-fill me-1";
    playBtn.querySelector("span").textContent = "Play";
    cover.classList.remove("pulsate");
    progress.value = 0;
    current.textContent = "0:00";
  });

  audio.addEventListener("loadedmetadata", function () {
    duration.textContent = formatTime(audio.duration);
    progress.max = Math.floor(audio.duration);
    progress.value = 0;
  });

  audio.addEventListener("timeupdate", function () {
    progress.value = Math.floor(audio.currentTime);
    current.textContent = formatTime(audio.currentTime);
    duration.textContent = formatTime(audio.duration);
  });

  progress.addEventListener("input", function () {
    audio.currentTime = parseInt(this.value, 10);
  });

  speed.addEventListener("change", function () {
    audio.playbackRate = parseFloat(this.value);
  });

  function formatTime(sec) {
    if (isNaN(sec)) return "0:00";
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return m + ":" + (s < 10 ? "0" : "") + s;
  }

  // Update the setupLyrics function
  function setupLyrics() {
    const lyricsContainer = document.getElementById("lyrics-ltmd");
    const audio = document.getElementById("audio-ltmd");

    if (audio && lyricsContainer) {
      const lines = Array.from(lyricsContainer.querySelectorAll("span")).map(
        (span) => ({
          time: parseFloat(span.getAttribute("data-time")),
          el: span,
        })
      );

      // Initially hide all lines
      lines.forEach((line) => (line.el.style.display = "none"));

      // Show first three lines at start
      if (lines.length >= 3) {
        lines[0].el.classList.add("previous");
        lines[1].el.classList.add("active");
        lines[2].el.classList.add("next");
      }

      audio.addEventListener("timeupdate", function () {
        const current = audio.currentTime;
        let activeIndex = 0;

        // Find current active line
        for (let i = 0; i < lines.length; i++) {
          if (current >= lines[i].time) {
            activeIndex = i;
          } else {
            break;
          }
        }

        // Hide all lines first
        lines.forEach((line) => {
          line.el.style.display = "none";
          line.el.classList.remove("active", "previous", "next");
        });

        // Always show three lines
        const prevIndex = Math.max(0, activeIndex - 1);
        const nextIndex = Math.min(lines.length - 1, activeIndex + 1);

        // Show previous line if available
        if (prevIndex >= 0) {
          lines[prevIndex].el.style.display = "block";
          lines[prevIndex].el.classList.add("previous");
        }

        // Show active line
        lines[activeIndex].el.style.display = "block";
        lines[activeIndex].el.classList.add("active");

        // Show next line if available
        if (nextIndex < lines.length) {
          lines[nextIndex].el.style.display = "block";
          lines[nextIndex].el.classList.add("next");
        }
      });
    }
  }

  // Update the loadLyrics function to call setupLyrics after loading content
  async function loadLyrics() {
    try {
      console.log("Starting lyrics load...");
      const response = await fetch("lyrics/ltmd.html");

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      console.log("Lyrics fetched, parsing response...");
      const lyrics = await response.text();

      const lyricsContainer = document.getElementById("lyrics-ltmd");
      if (!lyricsContainer) {
        throw new Error("Lyrics container not found!");
      }

      lyricsContainer.innerHTML = lyrics;
      console.log("Lyrics loaded successfully");

      // Set up lyrics functionality after content is loaded
      setupLyrics();
    } catch (error) {
      console.error("Error loading lyrics:", error);
      document.getElementById("lyrics-ltmd").innerHTML = `<span class="text-danger">Failed to load lyrics: ${error.message}</span>`;
    }
  }

  // Call loadLyrics directly since we're already inside DOMContentLoaded
  loadLyrics();
});
