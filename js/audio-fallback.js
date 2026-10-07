/**
 * Ambient Audio Fallback (Web Audio API)
 * Plays a soft, romantic harp/piano arpeggio progression if YouTube is blocked or offline.
 * Zero external audio files required, instant start, zero latency.
 */

class AmbientAudioFallback {
  constructor() {
    this.ctx = null;
    this.isPlaying = false;
    this.timer = null;
    this.step = 0;
    // Chords for worship progression (D - G - Bm - A)
    this.chords = [
      [146.83, 220.00, 293.66, 369.99, 440.00, 587.33], // D major
      [196.00, 246.94, 293.66, 392.00, 493.88, 587.33], // G major
      [123.47, 185.00, 220.00, 293.66, 369.99, 440.00], // Bm
      [110.00, 164.81, 220.00, 277.18, 329.63, 440.00]  // A major
    ];
  }

  init() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.ctx = new AudioContext();
      }
    }
  }

  playNote(freq, time, duration = 2.4) {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, time);

    // Warm envelope
    gain.gain.setValueAtTime(0.0001, time);
    gain.gain.exponentialRampToValueAtTime(0.045, time + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + duration);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(time);
    osc.stop(time + duration);
  }

  start() {
    this.init();
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    if (this.isPlaying) return;
    this.isPlaying = true;

    const playCycle = () => {
      if (!this.isPlaying || !this.ctx) return;
      const currentChord = this.chords[Math.floor(this.step / 6) % this.chords.length];
      const noteFreq = currentChord[this.step % currentChord.length];
      
      this.playNote(noteFreq, this.ctx.currentTime);
      this.step++;
      this.timer = setTimeout(playCycle, 580);
    };

    playCycle();
  }

  stop() {
    this.isPlaying = false;
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
  }

  toggle() {
    if (this.isPlaying) {
      this.stop();
      return false;
    } else {
      this.start();
      return true;
    }
  }
}

window.AmbientAudioFallback = AmbientAudioFallback;
