/* =====================================================
   FAVIAX UNIVERSE — main.js
   ===================================================== */

'use strict';

// ─── Track Database (Transmissions & Lore) ───────────
const TRACKS = [
  { id: 1, title: 'Neon Horizon', character: 'Aeron Vale', subtitle: 'Faviax // Aeron Vale', cover: 'assets/album-cover-1.png', freq: 110, tempo: 100, baseNote: 65 }, // F
  { id: 2, title: 'Orion Drive', character: 'Lyra Nox', subtitle: 'Faviax // Lyra Nox', cover: 'assets/album-cover-1.png', freq: 135, tempo: 112, baseNote: 58 }, // Bb
  { id: 3, title: 'Lattice Escape', character: 'Kade Ryder', subtitle: 'Faviax // Kade Ryder', cover: 'assets/album-cover-1.png', freq: 160, tempo: 120, baseNote: 60 }, // C
  { id: 4, title: 'Chrome Rain', character: 'Aeron Vale', subtitle: 'Faviax // Aeron Vale', cover: 'assets/album-cover-2.png', freq: 85, tempo: 85, baseNote: 53 },  // F
  { id: 5, title: 'Eclipse Key', character: 'Lyra Nox', subtitle: 'Faviax // Lyra Nox', cover: 'assets/album-cover-2.png', freq: 145, tempo: 108, baseNote: 55 },  // G
  { id: 6, title: 'Last Transmission', character: 'SERAPH-9', subtitle: 'Faviax // SERAPH-9', cover: 'assets/album-cover-2.png', freq: 210, tempo: 90, baseNote: 62 } // D
];

let currentTrackIndex = 0;

// ─── Custom Floating Cursor ──────────────────────────
const cursor = document.getElementById('cursor');
const cursorDot = document.getElementById('cursor-dot');

let mouseX = 0, mouseY = 0;
let dotX = 0, dotY = 0;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  cursor.style.left = mouseX + 'px';
  cursor.style.top = mouseY + 'px';
});

function animateCursorDot() {
  dotX += (mouseX - dotX) * 0.16;
  dotY += (mouseY - dotY) * 0.16;
  cursorDot.style.left = dotX + 'px';
  cursorDot.style.top = dotY + 'px';
  requestAnimationFrame(animateCursorDot);
}
animateCursorDot();

// Expand cursor on active nodes
function addCursorInteractions(selector) {
  document.querySelectorAll(selector).forEach((el) => {
    el.addEventListener('mouseenter', () => {
      cursor.style.width = '36px';
      cursor.style.height = '36px';
      cursor.style.borderColor = 'var(--accent-magenta)';
      cursor.style.backgroundColor = 'rgba(236, 72, 153, 0.05)';
    });
    el.addEventListener('mouseleave', () => {
      cursor.style.width = '24px';
      cursor.style.height = '24px';
      cursor.style.borderColor = 'var(--accent-cyan)';
      cursor.style.backgroundColor = 'transparent';
    });
  });
}
addCursorInteractions('a, button, input, textarea, .map-poi, .timeline-step, .track-log li');

// Hide when leaving window
document.addEventListener('mouseleave', () => {
  cursor.style.opacity = '0';
  cursorDot.style.opacity = '0';
});
document.addEventListener('mouseenter', () => {
  cursor.style.opacity = '1';
  cursorDot.style.opacity = '1';
});

// ─── Navigation Header & Scroll shadow ────────────────
const nav = document.getElementById('nav');
const navToggle = document.getElementById('nav-toggle');
const navLinks = document.getElementById('nav-links');

window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

navToggle.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', open);
});

navLinks.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  });
});

// ─── Hero Parallax ────────────────────────────────────
const heroBg = document.getElementById('hero-bg');
window.addEventListener('scroll', () => {
  if (!heroBg) return;
  const offset = window.scrollY;
  heroBg.style.transform = `scale(1.03) translateY(${offset * 0.35}px)`;
}, { passive: true });

// ─── World Map HUD Interactive POIs ───────────────────
const pois = document.querySelectorAll('.map-poi');
const coordsDisplay = document.getElementById('poi-coords');
const poiContents = document.querySelectorAll('.poi-content');

const POI_COORDINATES = {
  'neon-pulse': 'LAT: 34.092 // LONG: -118.328',
  'orion-vault': 'LAT: 52.520 // LONG: 13.404',
  'rain-bridge': 'LAT: 35.676 // LONG: 139.650',
  'implant-market': 'LAT: 22.396 // LONG: 114.109',
  'halley-overlook': 'LAT: -33.868 // LONG: 151.207'
};

pois.forEach((poi) => {
  poi.addEventListener('click', () => {
    pois.forEach(p => p.classList.remove('active'));
    poi.classList.add('active');

    const targetPoi = poi.getAttribute('data-poi');
    coordsDisplay.textContent = POI_COORDINATES[targetPoi] || 'LAT: 00.000 // LONG: 00.000';

    poiContents.forEach((content) => {
      content.classList.remove('active');
      if (content.id === `content-${targetPoi}`) {
        content.classList.add('active');
      }
    });

    // Make custom glitch sound effect on POI click
    playBeepSound(600, 0.08, 'sawtooth');
  });
});

// ─── Chronicles Interactive Timeline ──────────────────
const timelineSteps = document.querySelectorAll('.timeline-step');
const timelinePanes = document.querySelectorAll('.timeline-pane');

timelineSteps.forEach((step) => {
  step.addEventListener('click', () => {
    timelineSteps.forEach(s => {
      s.classList.remove('active');
      s.setAttribute('aria-selected', 'false');
    });
    step.classList.add('active');
    step.setAttribute('aria-selected', 'true');

    const targetPaneId = step.getAttribute('aria-controls');
    timelinePanes.forEach((pane) => {
      pane.classList.remove('active');
      if (pane.id === targetPaneId) {
        pane.classList.add('active');
      }
    });

    playBeepSound(480, 0.06, 'triangle');
  });
});

// ─── IntersectionObserver Fallback for Reveals ────────
const supportsScrollDriven = CSS.supports('(animation-timeline: view()) and (animation-range: entry)');
if (!supportsScrollDriven) {
  const reveals = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  reveals.forEach(el => revealObserver.observe(el));
}

// ─── Web Audio API Retro Synthesizer Music Player ────
let audioCtx = null;
let isPlaying = false;
let synthTimer = null;
let currentSecs = 0;
let trackDurationSecs = 75; // 1 min 15 secs for preview loops
let currentTempo = 100;
let baseMIDI = 65;

// Synth sequencer state variables
let seqStep = 0;
let nextNoteTime = 0.0;
const scheduleAheadTime = 0.1; // schedule notes 100ms in advance
const lookahead = 25.0; // run scheduler every 25ms

function initAudioContext() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
}

// Quick UI beep sounds on click
function playBeepSound(freq, duration, type) {
  try {
    if (!audioCtx) return;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    
    osc.type = type || 'sine';
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
    
    gain.gain.setValueAtTime(0.04, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);
    
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    
    osc.start();
    osc.stop(audioCtx.currentTime + duration);
  } catch (err) {
    // Ignore context issues
  }
}

// Synth Wave Sequencer Pattern
// Simulates a retro synthwave groove (8 steps)
function midiToFreq(note) {
  return 440 * Math.pow(2, (note - 69) / 12);
}

// Simple synth generator
function synthStepSequencer() {
  while (nextNoteTime < audioCtx.currentTime + scheduleAheadTime) {
    scheduleNextSynthNotes(seqStep, nextNoteTime);
    
    // Move to next step (16th note pattern)
    const stepDuration = 60.0 / currentTempo / 4; // 16th note duration
    nextNoteTime += stepDuration;
    seqStep = (seqStep + 1) % 8;
  }
  synthTimer = setTimeout(synthStepSequencer, lookahead);
}

function scheduleNextSynthNotes(step, time) {
  const masterVolume = parseFloat(document.getElementById('volume-range').value) / 100 * 0.12;
  if (masterVolume <= 0) return;

  // 1. Bassline loop pattern (classic 8-step octave octave baseline)
  // Step notes relative to baseMIDI
  const bassPattern = [0, 0, 12, 0, 7, 7, 12, 3];
  const bassMIDINote = baseMIDI - 24 + bassPattern[step];
  
  const bassOsc = audioCtx.createOscillator();
  const bassFilter = audioCtx.createBiquadFilter();
  const bassGain = audioCtx.createGain();

  bassOsc.type = 'sawtooth';
  bassOsc.frequency.setValueAtTime(midiToFreq(bassMIDINote), time);

  // Filter envelope sweep
  bassFilter.type = 'lowpass';
  bassFilter.frequency.setValueAtTime(300, time);
  bassFilter.frequency.exponentialRampToValueAtTime(1200, time + 0.05);
  bassFilter.frequency.exponentialRampToValueAtTime(250, time + 0.15);

  bassGain.gain.setValueAtTime(masterVolume * 0.8, time);
  bassGain.gain.exponentialRampToValueAtTime(0.0001, time + 0.14);

  bassOsc.connect(bassFilter);
  bassFilter.connect(bassGain);
  bassGain.connect(audioCtx.destination);

  bassOsc.start(time);
  bassOsc.stop(time + 0.16);

  // 2. Slow lead melodic pulse (only on specific beats to not sound chaotic)
  // Step leads notes
  const leadMelody = [0, null, 7, null, 12, null, 10, 7];
  if (leadMelody[step] !== null && step % 2 === 0) {
    const leadMIDINote = baseMIDI + leadMelody[step];
    
    const leadOsc = audioCtx.createOscillator();
    const leadDelay = audioCtx.createDelay();
    const leadDelayGain = audioCtx.createGain();
    const leadGain = audioCtx.createGain();

    leadOsc.type = 'triangle';
    leadOsc.frequency.setValueAtTime(midiToFreq(leadMIDINote), time);

    leadGain.gain.setValueAtTime(masterVolume * 0.4, time);
    leadGain.gain.exponentialRampToValueAtTime(0.001, time + 0.4);

    // Dynamic delay feed to make it sound spacious
    leadDelay.delayTime.value = 0.25;
    leadDelayGain.gain.value = 0.3;

    leadOsc.connect(leadGain);
    leadGain.connect(audioCtx.destination);

    // Feed to delay
    leadGain.connect(leadDelay);
    leadDelay.connect(leadDelayGain);
    leadDelayGain.connect(audioCtx.destination);

    leadOsc.start(time);
    leadOsc.stop(time + 0.5);
  }

  // 3. Cyberpunk Hi-Hat click (white noise pulse)
  if (step % 2 === 1) {
    const bufferSize = audioCtx.sampleRate * 0.04;
    const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noiseNode = audioCtx.createBufferSource();
    noiseNode.buffer = buffer;

    const noiseFilter = audioCtx.createBiquadFilter();
    noiseFilter.type = 'highpass';
    noiseFilter.frequency.value = 7000;

    const noiseGain = audioCtx.createGain();
    noiseGain.gain.setValueAtTime(masterVolume * 0.15, time);
    noiseGain.gain.exponentialRampToValueAtTime(0.0001, time + 0.03);

    noiseNode.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(audioCtx.destination);

    noiseNode.start(time);
    noiseNode.stop(time + 0.04);
  }
}

// Player Control functions
const playPauseBtn = document.getElementById('player-btn-play-pause');
const playIcon = playPauseBtn.querySelector('.icon-play');
const pauseIcon = playPauseBtn.querySelector('.icon-pause');
const currentTrackTitle = document.getElementById('player-track-title');
const currentTrackSubtitle = document.getElementById('player-track-subtitle');
const currentTrackCover = document.getElementById('player-track-cover');
const currentSecsDisplay = document.getElementById('player-current-time');
const progressFill = document.getElementById('player-progress-fill');
const progressHandle = document.querySelector('.progress-bar-handle');

let timerInterval = null;

function updatePlayerUI() {
  const track = TRACKS[currentTrackIndex];
  currentTrackTitle.textContent = track.title;
  currentTrackSubtitle.textContent = track.subtitle;
  currentTrackCover.src = track.cover;
  
  // Update lore links
  const spotifyLink = document.getElementById('player-spotify-link');
  if (spotifyLink) {
    spotifyLink.href = `#`; // Placeholder link matching streaming options
  }

  // Sync tempo and base frequency
  currentTempo = track.tempo;
  baseMIDI = track.baseNote;
}

function startPlayback() {
  initAudioContext();
  
  isPlaying = true;
  playIcon.style.display = 'none';
  pauseIcon.style.display = 'block';

  // Start synth sequencer loop
  nextNoteTime = audioCtx.currentTime;
  seqStep = 0;
  synthStepSequencer();

  // Run progress timer
  timerInterval = setInterval(() => {
    currentSecs++;
    if (currentSecs >= trackDurationSecs) {
      nextTrack();
    } else {
      updateProgressBar();
    }
  }, 1000);
}

function stopPlayback() {
  isPlaying = false;
  playIcon.style.display = 'block';
  pauseIcon.style.display = 'none';

  if (synthTimer) {
    clearTimeout(synthTimer);
    synthTimer = null;
  }
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
}

function updateProgressBar() {
  const pct = (currentSecs / trackDurationSecs) * 100;
  progressFill.style.width = `${pct}%`;
  progressHandle.style.left = `${pct}%`;
  
  // Format current minutes
  const mins = Math.floor(currentSecs / 60);
  const secs = currentSecs % 60;
  currentSecsDisplay.textContent = `${mins}:${secs.toString().padStart(2, '0')}`;
}

function playTrack(index) {
  stopPlayback();
  currentTrackIndex = (index + TRACKS.length) % TRACKS.length;
  currentSecs = 0;
  updateProgressBar();
  updatePlayerUI();
  startPlayback();
}

function nextTrack() {
  playTrack(currentTrackIndex + 1);
}

function prevTrack() {
  playTrack(currentTrackIndex - 1);
}

// Track actions listeners
playPauseBtn.addEventListener('click', () => {
  if (isPlaying) {
    stopPlayback();
  } else {
    startPlayback();
  }
  playBeepSound(400, 0.08, 'sine');
});

document.getElementById('player-btn-next').addEventListener('click', () => {
  nextTrack();
  playBeepSound(500, 0.05, 'sine');
});

document.getElementById('player-btn-prev').addEventListener('click', () => {
  prevTrack();
  playBeepSound(500, 0.05, 'sine');
});

// Click track from Transmissions Tracklist
document.querySelectorAll('.track-log li').forEach((li) => {
  li.addEventListener('click', () => {
    const trackNum = parseInt(li.getAttribute('data-track')) - 1;
    playTrack(trackNum);
  });
});

// Link timeline buttons to trigger songs
document.querySelectorAll('.btn-play-song').forEach((btn) => {
  btn.addEventListener('click', () => {
    const trackNum = parseInt(btn.getAttribute('data-track-id')) - 1;
    playTrack(trackNum);
  });
});

// Link Nav LISTEN NOW CTA to start player
document.getElementById('nav-listen-cta').addEventListener('click', () => {
  if (!isPlaying) {
    startPlayback();
  } else {
    // Jump to first track
    playTrack(0);
  }
  playBeepSound(650, 0.1, 'sine');
});

document.getElementById('btn-hero-listen').addEventListener('click', () => {
  if (!isPlaying) {
    startPlayback();
  }
  playBeepSound(650, 0.1, 'sine');
});

// ─── Forms Submit Animations ──────────────────────────
const regForm = document.getElementById('registry-form');

regForm.addEventListener('submit', (e) => {
  e.preventDefault();
  
  const nameInput = document.getElementById('reg-name');
  const emailInput = document.getElementById('reg-email');
  const submitBtn = regForm.querySelector('.btn-submit-registry');
  
  if (!emailInput.value) {
    playBeepSound(150, 0.2, 'sawtooth');
    emailInput.style.borderColor = 'var(--accent-red)';
    setTimeout(() => { emailInput.style.borderColor = ''; }, 2000);
    return;
  }

  // Visual success feedback
  playBeepSound(800, 0.15, 'sine');
  const originalHtml = submitBtn.innerHTML;
  
  submitBtn.innerHTML = `
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
    TRANSMISSION REGISTRY LOGGED
  `;
  submitBtn.style.color = 'var(--accent-cyan)';
  submitBtn.style.borderColor = 'var(--accent-cyan)';
  submitBtn.disabled = true;

  setTimeout(() => {
    submitBtn.innerHTML = originalHtml;
    submitBtn.style.color = '';
    submitBtn.style.borderColor = '';
    submitBtn.disabled = false;
    regForm.reset();
  }, 3500);
});

// Setup initial UI states
updatePlayerUI();
console.log('FAVIAX SYSTEM RECOVERED // TERMINAL ONLINE');
