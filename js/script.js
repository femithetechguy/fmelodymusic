document.addEventListener("DOMContentLoaded", function () {
  // --- SPA NAVIGATION CODE (unchanged) ---
  function showSection(sectionId) {
    document
      .querySelectorAll(".spa-section")
      .forEach((sec) => sec.classList.remove("active"));
    const target = document.getElementById(sectionId);
    if (target) target.classList.add("active");
    document.querySelectorAll("#spa-nav .nav-link").forEach((link) => {
      link.classList.toggle(
        "active",
        link.getAttribute("data-section") === sectionId
      );
    });
    window.scrollTo(0, 0);
  }
  document.querySelectorAll("#spa-nav .nav-link").forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      const section = this.getAttribute("data-section");
      if (section) showSection(section);
    });
  });
  showSection("hero");
  // --- END SPA NAVIGATION ---

  // --- AUDIO PLAYER LOGIC ---
  document.querySelectorAll(".play-btn").forEach((btn) => {
    btn.addEventListener("click", function () {
      const audioId = this.getAttribute("data-audio");
      const audio = document.getElementById(audioId);

      // Pause all other audios
      document.querySelectorAll("audio").forEach((a) => {
        if (a !== audio) {
          a.pause();
          a.currentTime = 0;
          const otherBtn = document.querySelector(
            `.play-btn[data-audio="${a.id}"]`
          );
          if (otherBtn) {
            otherBtn.querySelector("i").className = "bi bi-play-fill me-1";
            otherBtn.querySelector("span").textContent = "Play";
          }
        }
      });

      if (audio.paused) {
        audio.play();
        this.querySelector("i").className = "bi bi-stop-fill me-1";
        this.querySelector("span").textContent = "Stop";
      } else {
        audio.pause();
        audio.currentTime = 0;
        this.querySelector("i").className = "bi bi-play-fill me-1";
        this.querySelector("span").textContent = "Play";
      }

      // When audio ends, reset button
      audio.onended = () => {
        this.querySelector("i").className = "bi bi-play-fill me-1";
        this.querySelector("span").textContent = "Play";
      };
    });
  });

  // Progress bar, time update, and seeking
  document.querySelectorAll("audio").forEach((audio) => {
    const audioId = audio.id;
    const progressRange = document.getElementById("progress-" + audioId);
    const currentTimeSpan = document.getElementById("current-" + audioId);
    const durationSpan = document.getElementById("duration-" + audioId);

    // Set duration when metadata is loaded
    audio.addEventListener("loadedmetadata", function () {
      if (durationSpan) durationSpan.textContent = formatTime(audio.duration);
      if (progressRange) progressRange.max = Math.floor(audio.duration);
    });

    // Update progress and time
    audio.addEventListener("timeupdate", function () {
      if (progressRange && audio.duration) {
        progressRange.value = Math.floor(audio.currentTime);
        progressRange.max = Math.floor(audio.duration);
      }
      if (currentTimeSpan) currentTimeSpan.textContent = formatTime(audio.currentTime);
      if (durationSpan) durationSpan.textContent = formatTime(audio.duration);
    });

    // Allow dragging the range to seek
    if (progressRange) {
      let seeking = false;
      progressRange.addEventListener("input", function () {
        seeking = true;
        audio.currentTime = parseInt(this.value, 10);
      });
      progressRange.addEventListener("change", function () {
        audio.currentTime = parseInt(this.value, 10);
        seeking = false;
      });
    }
  });

  // Play speed control
  document.querySelectorAll(".play-speed").forEach((select) => {
    select.addEventListener("change", function () {
      const audioId = this.getAttribute("data-audio");
      const audio = document.getElementById(audioId);
      if (audio) {
        audio.playbackRate = parseFloat(this.value);
      }
    });
  });

  function formatTime(sec) {
    if (isNaN(sec)) return "0:00";
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return m + ":" + (s < 10 ? "0" : "") + s;
  }
});
