console.log('JS loaded');
document.body.style.outline = '5px solid lime'; // Should see a green outline if CSS/JS both work

document.addEventListener('DOMContentLoaded', function() {
  const audio = document.getElementById('audio-ltmd');
  const playBtn = document.getElementById('play-ltmd');
  const cover = document.getElementById('ltmd_cover');
  const progress = document.getElementById('progress-ltmd');
  const current = document.getElementById('current-ltmd');
  const duration = document.getElementById('duration-ltmd');
  const speed = document.getElementById('speed-ltmd');

  playBtn.addEventListener('click', function() {
    if (audio.paused) {
      audio.play();
      playBtn.querySelector('i').className = 'bi bi-stop-fill me-1';
      playBtn.querySelector('span').textContent = 'Stop';
      cover.classList.add('pulsate');
    } else {
      audio.pause();
      playBtn.querySelector('i').className = 'bi bi-play-fill me-1';
      playBtn.querySelector('span').textContent = 'Play';
      cover.classList.remove('pulsate');
    }
  });

  audio.addEventListener('ended', function() {
    playBtn.querySelector('i').className = 'bi bi-play-fill me-1';
    playBtn.querySelector('span').textContent = 'Play';
    cover.classList.remove('pulsate');
    progress.value = 0;
    current.textContent = '0:00';
  });

  audio.addEventListener('loadedmetadata', function() {
    duration.textContent = formatTime(audio.duration);
    progress.max = Math.floor(audio.duration);
    progress.value = 0;
  });

  audio.addEventListener('timeupdate', function() {
    progress.value = Math.floor(audio.currentTime);
    current.textContent = formatTime(audio.currentTime);
    duration.textContent = formatTime(audio.duration);
  });

  progress.addEventListener('input', function() {
    audio.currentTime = parseInt(this.value, 10);
  });

  speed.addEventListener('change', function() {
    audio.playbackRate = parseFloat(this.value);
  });

  function formatTime(sec) {
    if (isNaN(sec)) return '0:00';
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return m + ':' + (s < 10 ? '0' : '') + s;
  }
});