const BPM = 120;
const BEATS_PER_BAR = 4;

const secondsPerBeat = 60 / BPM;
const secondsPerBar = secondsPerBeat * BEATS_PER_BAR;

function updateMusicClock(time: number) {
  const bar = Math.floor(time / secondsPerBar) + 1;
  const beat =
    Math.floor((time % secondsPerBar) / secondsPerBeat) + 1;

  document.documentElement.style.setProperty('--bar', bar.toString());
  document.documentElement.style.setProperty('--beat', beat.toString());

  document.body.dataset.bar = bar.toString().padStart(3, '0');
  document.body.dataset.beat = beat.toString();
}

function tick() {
  updateMusicClock(audio.currentTime);
  requestAnimationFrame(tick);
}