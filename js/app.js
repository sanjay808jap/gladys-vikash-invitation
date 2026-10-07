/**
 * Gladys Evangeline & Vikash Varma
 * Official Wedding Invitation Application Logic
 */

document.addEventListener('DOMContentLoaded', () => {
  initInvitationContent();
  initEnvelopeExperience();
  initMusicPlayer();
  initCalendarButtons();
  initCountdown();
  initScrollAnimations();
  initShareActions();
});

/* ==========================================================================
   1. Populate Content from WEDDING_CONFIG
   ========================================================================== */
function initInvitationContent() {
  const cfg = window.WEDDING_CONFIG;
  if (!cfg) return;

  // Set document title
  document.title = `${cfg.couple.bride} & ${cfg.couple.groom} | Wedding Invitation`;

  // Venue link update
  const mapBtn = document.getElementById('viewMapBtn');
  if (mapBtn) {
    mapBtn.href = cfg.venue.googleMapsUrl;
  }
}

/* ==========================================================================
   2. Envelope Opening Experience
   ========================================================================== */
function initEnvelopeExperience() {
  const envelopeOverlay = document.getElementById('envelopeOverlay');
  const openBtn = document.getElementById('openInvitationBtn');
  const sealBtn = document.getElementById('waxSealTrigger');
  const mainInvitation = document.getElementById('mainInvitation');

  if (!envelopeOverlay || !openBtn) return;

  const triggerOpen = () => {
    if (envelopeOverlay.classList.contains('opened')) return;

    // Trigger open animation
    envelopeOverlay.classList.add('opening');

    // Attempt to play music upon user gesture
    if (window.weddingMusic && !window.weddingMusic.isPlaying) {
      window.weddingMusic.play();
    }

    // Pacing: Wait for flap unfold and card emergence, then reveal page
    setTimeout(() => {
      envelopeOverlay.classList.add('opened');
      document.body.classList.remove('lock-scroll');
      
      // Smoothly scroll to main invitation card
      if (mainInvitation) {
        mainInvitation.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }

      // Hide overlay after animation finishes
      setTimeout(() => {
        envelopeOverlay.style.display = 'none';
      }, 1000);
    }, 1100);
  };

  openBtn.addEventListener('click', triggerOpen);
  if (sealBtn) {
    sealBtn.addEventListener('click', triggerOpen);
  }

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

/* ==========================================================================
   3. Music Player (YouTube API + Graceful Ambient Web Audio Fallback)
   ========================================================================== */
function initMusicPlayer() {
  const cfg = window.WEDDING_CONFIG?.music;
  const musicToggle = document.getElementById('musicToggle');
  const musicWave = document.getElementById('musicWave');
  const musicStatusText = document.getElementById('musicStatusText');

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
          ytPlayer.playVideo();
          updateUI(true);
        } catch (e) {
          audioFallback.start();
          useFallback = true;
          updateUI(true);
        }
      } else {
        setTimeout(() => {
          if (!isPlaying && pendingPlay) {
            if (ytPlayer && typeof ytPlayer.playVideo === 'function') {
              try {
                ytPlayer.playVideo();
                updateUI(true);
                return;
              } catch(err) {}
            }
            audioFallback.start();
            useFallback = true;
            updateUI(true);
          }
        }, 1500);
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
        height: '0',
        width: '0',
        videoId: cfg?.youtubeVideoId || 'n0FBb6hnwTo',
        playerVars: {
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
    }
  };

  // If YouTube doesn't load within 4 seconds, mark fallback ready
  setTimeout(() => {
    if (!ytPlayer) {
      useFallback = true;
    }
  }, 4000);
}

/* ==========================================================================
   4. Calendar Integration (Google Calendar + iCal .ics download)
   ========================================================================== */
function initCalendarButtons() {
  const cfg = window.WEDDING_CONFIG?.events;
  if (!cfg) return;

  const betrothalBtn = document.getElementById('addBetrothalCalBtn');
  const weddingBtn = document.getElementById('addWeddingCalBtn');

  if (betrothalBtn) {
    betrothalBtn.addEventListener('click', (e) => {
      e.preventDefault();
      openCalendarChoice(cfg.betrothal);
    });
  }

  if (weddingBtn) {
    weddingBtn.addEventListener('click', (e) => {
      e.preventDefault();
      openCalendarChoice(cfg.wedding);
    });
  }
}

function openCalendarChoice(eventData) {
  // Direct Google Calendar URL
  const googleCalUrl = makeGoogleCalendarUrl(eventData);

  // Generate and download .ics directly
  downloadIcsFile(eventData);

  // Also prompt user with direct Google Calendar link
  const choice = window.confirm(
    `Event added to your calendar file!\n\nWould you also like to open Google Calendar directly?`
  );
  if (choice) {
    window.open(googleCalUrl, '_blank', 'noopener,noreferrer');
  }
}

function makeGoogleCalendarUrl(evt) {
  // Convert ISO string to YYYYMMDDTHHMMSSZ (UTC or local)
  const formatGCalDate = (isoStr) => {
    const d = new Date(isoStr);
    return d.toISOString().replace(/-|:|\.\d\d\d/g, "");
  };

  const start = formatGCalDate(evt.calendarStartDate);
  const end = formatGCalDate(evt.calendarEndDate);
  const title = encodeURIComponent(evt.title + " - Gladys & Vikash");
  const details = encodeURIComponent(evt.description + "\n\n" + evt.postEventNote);
  const location = encodeURIComponent(`${evt.venueName}${evt.hall ? ', ' + evt.hall : ''}, ${evt.city}`);

  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${start}/${end}&details=${details}&location=${location}`;
}

function downloadIcsFile(evt) {
  const formatIcsDate = (isoStr) => {
    const d = new Date(isoStr);
    return d.toISOString().replace(/-|:|\.\d\d\d/g, "");
  };

  const start = formatIcsDate(evt.calendarStartDate);
  const end = formatIcsDate(evt.calendarEndDate);
  const now = formatIcsDate(new Date().toISOString());
  const uid = `wedding-${Date.now()}@gladysandvikash.wedding`;
  const location = `${evt.venueName}${evt.hall ? ', ' + evt.hall : ''}, ${evt.city}`;

  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Gladys & Vikash Wedding Invitation//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTAMP:${now}`,
    `DTSTART:${start}`,
    `DTEND:${end}`,
    `SUMMARY:${evt.title} - Gladys Evangeline & Vikash Varma`,
    `DESCRIPTION:${evt.description} (${evt.postEventNote})`,
    `LOCATION:${location}`,
    'STATUS:CONFIRMED',
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n');

  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const link = document.createElement('a');
  link.href = window.URL.createObjectURL(blob);
  link.setAttribute('download', `${evt.title.toLowerCase().replace(/\s+/g, '-')}-gladys-vikash.ics`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/* ==========================================================================
   5. Celebration Countdown
   ========================================================================== */
function initCountdown() {
  const daysEl = document.getElementById('countDays');
  const hoursEl = document.getElementById('countHours');
  const minsEl = document.getElementById('countMins');
  const secsEl = document.getElementById('countSecs');

  if (!daysEl || !hoursEl || !minsEl || !secsEl) return;

  // Wedding Date: 17 October 2026, 10:00:00 AM IST (+05:30)
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
   6. Scroll Reveal Animations (Intersection Observer)
   ========================================================================== */
function initScrollAnimations() {
  const reveals = document.querySelectorAll('.fade-up, .fade-in, .scale-fade');
  if (!reveals.length) return;

  // Respect prefers-reduced-motion
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
    threshold: 0.15,
    rootMargin: '0px 0px -40px 0px'
  });

  reveals.forEach(el => observer.observe(el));
}

/* ==========================================================================
   7. Share Actions (WhatsApp & Copy Link)
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
