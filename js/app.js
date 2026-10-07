/**
 * Gladys Evangeline & Vikash Varma
 * Official Wedding Invitation Application Logic
 * Physical Envelope Choreography & Stationery Experience
 */

document.addEventListener('DOMContentLoaded', () => {
  initInvitationContent();
  initEnvelopeExperience();
  initMusicPlayer();
  initCountdown();
  initScrollAnimations();
  initShareActions();
});

/* ==========================================================================
   1. Populate Content & External Links
   ========================================================================== */
function initInvitationContent() {
  const cfg = window.WEDDING_CONFIG;
  if (!cfg) return;

  // Set document title
  document.title = `${cfg.couple.bride} & ${cfg.couple.groom} | Wedding Invitation`;

  // Update Google Maps button link
  const mapBtn = document.getElementById('viewMapBtn');
  if (mapBtn && cfg.venue?.googleMapsUrl) {
    mapBtn.href = cfg.venue.googleMapsUrl;
  }
}

/* ==========================================================================
   2. Physical Envelope Opening Experience
   ========================================================================== */
function initEnvelopeExperience() {
  const envelopeOverlay = document.getElementById('envelopeOverlay');
  const waxSealTrigger = document.getElementById('waxSealTrigger');
  const unsealBtn = document.getElementById('unsealBtn');
  const mainInvitation = document.getElementById('mainInvitation');
  const paperAudio = document.getElementById('paperRustleAudio');

  if (!envelopeOverlay) return;

  let isOpening = false;

  const triggerEnvelopeOpen = () => {
    if (isOpening || envelopeOverlay.classList.contains('opened')) return;
    isOpening = true;

    // 1. Play realistic paper rustle sound immediately upon user interaction
    playPaperRustleSound(paperAudio);

    // 2. Add 'opening' class to start choreographed physical 3D animation
    envelopeOverlay.classList.add('opening');

    // 3. Start background music at 00:55
    if (window.weddingMusic && !window.weddingMusic.isPlaying) {
      window.weddingMusic.play();
    }

    // 4. Sequence Timing:
    // Flap unfolds (0.35s - 1.4s), letter card emerges (0.85s - 2.0s), scene dissolves (1.95s - 2.7s)
    setTimeout(() => {
      envelopeOverlay.classList.add('opened');
      document.body.classList.remove('lock-scroll');

      // Smooth scroll to top of main invitation sheet
      if (mainInvitation) {
        mainInvitation.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }

      // Hide overlay after animation completes
      setTimeout(() => {
        envelopeOverlay.style.display = 'none';
        isOpening = false;
      }, 900);
    }, 2400);
  };

  if (waxSealTrigger) {
    waxSealTrigger.addEventListener('click', triggerEnvelopeOpen);
    waxSealTrigger.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        triggerEnvelopeOpen();
      }
    });
  }

  if (unsealBtn) {
    unsealBtn.addEventListener('click', triggerEnvelopeOpen);
  }

  // Replay envelope experience handler
  const reopenBtn = document.getElementById('reopenEnvelopeBtn');
  if (reopenBtn) {
    reopenBtn.addEventListener('click', () => {
      envelopeOverlay.style.display = 'flex';
      envelopeOverlay.classList.remove('opened', 'opening');
      document.body.classList.add('lock-scroll');
      window.scrollTo({ top: 0, behavior: 'instant' });
    });
  }
}

/**
 * Play subtle paper rustle sound with Web Audio fallback
 */
function playPaperRustleSound(audioEl) {
  if (audioEl) {
    try {
      audioEl.currentTime = 0;
      const playPromise = audioEl.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // If browser policy blocks local audio element, synthesize procedural paper sound
          synthesizePaperSound();
        });
      }
    } catch (e) {
      synthesizePaperSound();
    }
  } else {
    synthesizePaperSound();
  }
}

/**
 * Procedural Web Audio Paper Rustle Synthesizer (Zero-dependency fallback)
 */
function synthesizePaperSound() {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    if (ctx.state === 'suspended') ctx.resume();

    const bufferSize = ctx.sampleRate * 1.5;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);

    let lastOut = 0.0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      lastOut = (lastOut + 0.03 * white) / 1.03;
      data[i] = lastOut * 0.45;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1400, ctx.currentTime);
    filter.Q.setValueAtTime(1.2, ctx.currentTime);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.001, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.08, ctx.currentTime + 0.2);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.4);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    noise.start();
    noise.stop(ctx.currentTime + 1.5);
  } catch (err) {}
}

/* ==========================================================================
   3. Background Music Player (Starts at 00:55, Bethel Music - Goodness of God)
   ========================================================================== */
function initMusicPlayer() {
  const cfg = window.WEDDING_CONFIG?.music;
  const musicToggle = document.getElementById('musicToggle');
  const musicStatusText = document.getElementById('musicStatusText');

  const startTime = cfg?.startTimeSeconds || 55; // MUST START AT 00:55
  const audioFallback = new window.AmbientAudioFallback();
  let ytPlayer = null;
  let useFallback = false;
  let isPlaying = false;
  let pendingPlay = false;

  window.weddingMusic = {
    isPlaying: false,
    play() {
      pendingPlay = true;
      if (useFallback) {
        audioFallback.start();
        updateUI(true);
      } else if (ytPlayer && typeof ytPlayer.playVideo === 'function') {
        try {
          if (typeof ytPlayer.getCurrentTime === 'function' && ytPlayer.getCurrentTime() < startTime) {
            ytPlayer.seekTo(startTime, true);
          }
          ytPlayer.playVideo();
          updateUI(true);
        } catch (e) {
          audioFallback.start();
          useFallback = true;
          updateUI(true);
        }
      } else {
        // If YouTube player is still initializing, give it a moment then fall back
        setTimeout(() => {
          if (!isPlaying && pendingPlay) {
            if (ytPlayer && typeof ytPlayer.playVideo === 'function') {
              try {
                if (typeof ytPlayer.getCurrentTime === 'function' && ytPlayer.getCurrentTime() < startTime) {
                  ytPlayer.seekTo(startTime, true);
                }
                ytPlayer.playVideo();
                updateUI(true);
                return;
              } catch (err) {}
            }
            audioFallback.start();
            useFallback = true;
            updateUI(true);
          }
        }, 1200);
      }
    },
    pause() {
      pendingPlay = false;
      if (useFallback) {
        audioFallback.stop();
      } else if (ytPlayer && typeof ytPlayer.pauseVideo === 'function') {
        try {
          ytPlayer.pauseVideo();
        } catch (e) {
          audioFallback.stop();
        }
      }
      updateUI(false);
    },
    toggle() {
      if (this.isPlaying) {
        this.pause();
      } else {
        this.play();
      }
    }
  };

  function updateUI(playing) {
    window.weddingMusic.isPlaying = playing;
    isPlaying = playing;
    if (musicToggle) {
      musicToggle.setAttribute('aria-pressed', playing ? 'true' : 'false');
      if (playing) {
        musicToggle.classList.add('is-playing');
      } else {
        musicToggle.classList.remove('is-playing');
      }
    }
    if (musicStatusText) {
      musicStatusText.textContent = playing ? 'Music: Playing' : 'Music: Paused';
    }
  }

  // Bind toggle button
  if (musicToggle) {
    musicToggle.addEventListener('click', () => {
      window.weddingMusic.toggle();
    });
  }

  // Load YouTube IFrame API
  const tag = document.createElement('script');
  tag.src = "https://www.youtube.com/iframe_api";
  const firstScriptTag = document.getElementsByTagName('script')[0];
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

  window.onYouTubeIframeAPIReady = function() {
    try {
      ytPlayer = new YT.Player('ytAudioPlayer', {
        height: '1',
        width: '1',
        videoId: cfg?.youtubeVideoId || 'n0FBb6hnwTo',
        playerVars: {
          start: startTime, // Song begins at 00:55
          autoplay: 0,
          controls: 0,
          disablekb: 1,
          fs: 0,
          loop: 1,
          modestbranding: 1,
          playsinline: 1,
          rel: 0
        },
        events: {
          onReady: function(event) {
            try {
              event.target.setVolume(cfg?.initialVolume || 80);
              if (pendingPlay) {
                event.target.seekTo(startTime, true);
                event.target.playVideo();
                updateUI(true);
              }
            } catch (err) {}
          },
          onStateChange: function(event) {
            if (event.data === YT.PlayerState.PLAYING) {
              updateUI(true);
            } else if (event.data === YT.PlayerState.PAUSED || event.data === YT.PlayerState.ENDED) {
              updateUI(false);
            }
          },
          onError: function() {
            useFallback = true;
            if (pendingPlay) {
              audioFallback.start();
              updateUI(true);
            }
          }
        }
      });
    } catch (e) {
      useFallback = true;
      if (pendingPlay) {
        audioFallback.start();
        updateUI(true);
      }
    }
  };
}

/* ==========================================================================
   4. Celebration Countdown (17 October 2026, 10:00 AM IST)
   ========================================================================== */
function initCountdown() {
  const daysEl = document.getElementById('countDays');
  const hoursEl = document.getElementById('countHours');
  const minsEl = document.getElementById('countMins');
  const secsEl = document.getElementById('countSecs');

  if (!daysEl || !hoursEl || !minsEl || !secsEl) return;

  // Target: Saturday, 17 October 2026, 10:00:00 AM IST (+05:30)
  const targetDate = new Date('2026-10-17T10:00:00+05:30').getTime();

  function update() {
    const now = new Date().getTime();
    const distance = targetDate - now;

    if (distance <= 0) {
      daysEl.textContent = '00';
      hoursEl.textContent = '00';
      minsEl.textContent = '00';
      secsEl.textContent = '00';
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    daysEl.textContent = String(days).padStart(2, '0');
    hoursEl.textContent = String(hours).padStart(2, '0');
    minsEl.textContent = String(minutes).padStart(2, '0');
    secsEl.textContent = String(seconds).padStart(2, '0');
  }

  update();
  setInterval(update, 1000);
}

/* ==========================================================================
   5. Scroll Reveal Animations (Intersection Observer)
   ========================================================================== */
function initScrollAnimations() {
  const reveals = document.querySelectorAll('.fade-up, .fade-in');
  if (!reveals.length) return;

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) {
    reveals.forEach(el => el.classList.add('visible'));
    return;
  }

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        obs.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  reveals.forEach(el => observer.observe(el));
}

/* ==========================================================================
   6. WhatsApp Sharing & Copy Link Actions
   ========================================================================== */
function initShareActions() {
  const shareBtn = document.getElementById('whatsappShareBtn');
  const copyBtn = document.getElementById('copyLinkBtn');
  const toast = document.getElementById('toastNotice');

  const pageUrl = window.location.href;
  const cfg = window.WEDDING_CONFIG?.share;

  if (shareBtn) {
    shareBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const text = (cfg?.whatsappText || "Wedding Invitation for Gladys Evangeline & Vikash Varma: ") + pageUrl;
      const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
      window.open(waUrl, '_blank', 'noopener,noreferrer');
    });
  }

  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      navigator.clipboard.writeText(pageUrl).then(() => {
        showToast("Invitation link copied to clipboard!");
      }).catch(() => {
        showToast("Link: " + pageUrl);
      });
    });
  }

  function showToast(msg) {
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 3200);
  }
}
