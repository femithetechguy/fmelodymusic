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

  // Real-time lyrics for LTMD
  const lyricsContainer = document.getElementById("lyrics-ltmd");
  if (audio && lyricsContainer) {
    const lines = Array.from(lyricsContainer.querySelectorAll("span")).map(
      (span) => ({
        time: parseFloat(span.getAttribute("data-time")),
        el: span,
      })
    );

    audio.addEventListener("timeupdate", function () {
      const current = audio.currentTime;
      let activeIndex = -1;
      for (let i = 0; i < lines.length; i++) {
        if (current >= lines[i].time) activeIndex = i;
        else break;
      }
      lines.forEach((line, idx) => {
        if (idx === activeIndex) line.el.classList.add("active");
        else line.el.classList.remove("active");
      });
    });

    audio.addEventListener("seeked", function () {
      audio.dispatchEvent(new Event("timeupdate"));
    });
  }

  // Dynamic real-time lyrics for all cards (show only 3 lines)
  document.querySelectorAll(".lyrics").forEach((lyricsContainer) => {
    const audioId = lyricsContainer.getAttribute("data-audio") || "audio-ltmd";
    const audio = document.getElementById(audioId);
    if (!audio) return;
    const lines = Array.from(lyricsContainer.querySelectorAll("span")).map(
      (span) => ({
        time: parseFloat(span.getAttribute("data-time")),
        el: span,
      })
    );

    function updateLyrics() {
      const current = audio.currentTime;
      let activeIndex = -1;
      for (let i = 0; i < lines.length; i++) {
        if (current >= lines[i].time) activeIndex = i;
        else break;
      }
      lines.forEach((line, idx) => {
        line.el.classList.remove("prev", "active", "next");
        if (idx === activeIndex - 1) line.el.classList.add("prev");
        else if (idx === activeIndex) line.el.classList.add("active");
        else if (idx === activeIndex + 1) line.el.classList.add("next");
      });
    }

    audio.addEventListener("timeupdate", updateLyrics);
    audio.addEventListener("seeked", updateLyrics);
    updateLyrics();
  });

  // Get all spans with data-time
  const spans = document.querySelectorAll(".lyrics span[data-time]");

  // Extract and log all times
  const times = Array.from(spans).map((span) => ({
    time: span.getAttribute("data-time"),
    text: span.textContent,
  }));

  console.table(times); // Shows a nice table in browser console

  // Social links handling with mobile detection
  document.querySelectorAll(".social-link").forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      const url = this.getAttribute("href");

      if (url && url !== "#") {
        // Check if device is mobile
        const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

        if (isMobile) {
          // Open in same window on mobile
          window.location.href = url;
        } else {
          // Open popup on desktop
          const width = Math.min(600, window.innerWidth - 40);
          const height = Math.min(600, window.innerHeight - 40);
          const left = (window.innerWidth - width) / 2;
          const top = (window.innerHeight - height) / 2;

          window.open(
            url,
            "social",
            `width=${width},height=${height},left=${left},top=${top},scrollbars=yes,resizable=yes`
          );
        }
      }
    });
  });
});
