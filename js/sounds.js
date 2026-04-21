// sounds.js — Jeopardy-style game sounds via Web Audio API
// No external files needed — all synthesized in the browser.

(function () {
  var _ctx = null;

  // Lazily create/resume AudioContext (browsers require user gesture first)
  function getCtx() {
    if (!_ctx || _ctx.state === 'closed') {
      _ctx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (_ctx.state === 'suspended') _ctx.resume();
    return _ctx;
  }

  // ── Shared envelope helper ──────────────────────────────────────────────────
  function makeNote(ctx, freq, type, volume, startTime, attackTime, holdTime, releaseTime) {
    var osc  = ctx.createOscillator();
    var gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.type = type;
    osc.frequency.value = freq;

    var t0 = startTime;
    gain.gain.setValueAtTime(0.0001, t0);
    gain.gain.linearRampToValueAtTime(volume, t0 + attackTime);
    gain.gain.setValueAtTime(volume, t0 + attackTime + holdTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, t0 + attackTime + holdTime + releaseTime);

    osc.start(t0);
    osc.stop(t0 + attackTime + holdTime + releaseTime + 0.01);
    return osc;
  }

  // ══════════════════════════════════════════════════════════════════════════
  //  CORRECT GUESS — Jeopardy ascending "ding ding ding ding"
  //  Four-note E-major arpeggio (E5 → G#5 → B5 → E6), triangle wave.
  //  Bright, clean, celebratory — very close to classic game-show chimes.
  // ══════════════════════════════════════════════════════════════════════════
  function playCorrect() {
    try {
      var ctx   = getCtx();
      var notes = [
        { freq: 659.25,  vol: 0.28 },   // E5
        { freq: 830.61,  vol: 0.26 },   // G#5
        { freq: 987.77,  vol: 0.24 },   // B5
        { freq: 1318.51, vol: 0.30 },   // E6  ← final accent, slightly louder
      ];

      notes.forEach(function (n, i) {
        var t = ctx.currentTime + i * 0.105;
        makeNote(ctx, n.freq, 'triangle', n.vol, t, 0.008, 0.055, 0.12);

        // Subtle harmonic overtone one octave up — gives it that "chime" shimmer
        makeNote(ctx, n.freq * 2, 'sine', n.vol * 0.12, t, 0.008, 0.03, 0.08);
      });

      // Add a soft final sustain chord (E5 + B5) to close it out
      var tEnd = ctx.currentTime + notes.length * 0.105;
      makeNote(ctx, 659.25,  'sine', 0.10, tEnd, 0.01, 0.12, 0.25);
      makeNote(ctx, 987.77,  'sine', 0.08, tEnd, 0.01, 0.12, 0.25);
      makeNote(ctx, 1318.51, 'sine', 0.08, tEnd, 0.01, 0.12, 0.25);
    } catch (e) { /* silently ignore */ }
  }

  // ══════════════════════════════════════════════════════════════════════════
  //  INCORRECT / REPEATED GUESS — Jeopardy "wrong answer" buzzer
  //  Three descending sawtooth honks (Bb3 → F3 → C3), classic game-show buzz.
  //  Harsh, descending, unmistakeable.
  // ══════════════════════════════════════════════════════════════════════════
  function playIncorrect() {
    try {
      var ctx = getCtx();

      var honks = [
        { freq: 233.08 },   // Bb3
        { freq: 174.61 },   // F3
        { freq: 130.81 },   // C3
      ];

      honks.forEach(function (h, i) {
        var t = ctx.currentTime + i * 0.145;

        // Primary sawtooth for the "BZZT" core
        makeNote(ctx, h.freq,       'sawtooth', 0.22, t, 0.005, 0.09, 0.06);

        // Square wave detuned by a few Hz for a thick, buzzy texture
        makeNote(ctx, h.freq * 1.02, 'square',  0.10, t, 0.005, 0.09, 0.06);

        // Low sub thud on each honk
        makeNote(ctx, h.freq * 0.5, 'sine',     0.12, t, 0.005, 0.05, 0.05);
      });

      // A final dying buzz after the three honks
      var tTail = ctx.currentTime + honks.length * 0.145;
      var tailOsc  = ctx.createOscillator();
      var tailGain = ctx.createGain();
      tailOsc.connect(tailGain);
      tailGain.connect(ctx.destination);
      tailOsc.type = 'sawtooth';
      tailOsc.frequency.setValueAtTime(110, tTail);
      tailOsc.frequency.exponentialRampToValueAtTime(55, tTail + 0.25);
      tailGain.gain.setValueAtTime(0.14, tTail);
      tailGain.gain.exponentialRampToValueAtTime(0.0001, tTail + 0.25);
      tailOsc.start(tTail);
      tailOsc.stop(tTail + 0.26);
    } catch (e) { /* silently ignore */ }
  }

  // Expose globally so app.js can call them
  window.playCorrect   = playCorrect;
  window.playIncorrect = playIncorrect;
})();
