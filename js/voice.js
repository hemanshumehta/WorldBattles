// voice.js — Continuous speech recognition, single permission request per session.
// Recognition is started ONCE and runs for the whole game.
// Pause/resume is handled by a processing flag — never stops/restarts the engine.

var _recognition  = null;
var _isListening  = false;   // true = engine is running
var _isProcessing = true;    // false = ignore results (game paused / game over)
var _onResult     = null;    // (transcript) => void
var _onInterim    = null;    // (transcript) => void

// Pre-requested MediaStream — held open so the browser never asks again
var _micStream = null;

// ── One-time mic permission request ───────────────────────────────────────────
/**
 * Ask for mic permission exactly once and hold the stream open.
 * Call this as early as possible (e.g. when the game screen appears).
 * Returns true if granted, false if denied.
 */
async function requestMicPermission() {
  if (_micStream && _micStream.active) return true; // already granted
  try {
    _micStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
    return true;
  } catch (e) {
    console.warn('Mic permission denied:', e);
    return false;
  }
}

// ── Build recognition ─────────────────────────────────────────────────────────
function _buildRecognition() {
  var SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SR) return null;

  var r = new SR();
  r.continuous      = true;
  r.interimResults  = true;
  r.lang            = 'en-US';
  r.maxAlternatives = 3;

  r.onresult = function (event) {
    if (!_isProcessing) return; // game is paused or ended — discard
    for (var i = event.resultIndex; i < event.results.length; i++) {
      var result     = event.results[i];
      var transcript = result[0].transcript.trim();
      if (result.isFinal) {
        if (_onResult) _onResult(transcript);
      } else {
        if (_onInterim) _onInterim(transcript);
      }
    }
  };

  r.onerror = function (e) {
    if (e.error === 'no-speech') return; // normal silence — ignore
    console.warn('SpeechRecognition error:', e.error);
    // We let onend handle the restart to ensure we rebuild the object cleanly.
  };

  // Keep the engine alive: restart as soon as it ends (Chrome stops after ~60 s silence or ~9 mins of use)
  r.onend = function () {
    if (_isListening) {
      setTimeout(function () {
        if (!_isListening) return;
        // Rebuild to completely bypass Chrome's 9 minute session limits
        _recognition = _buildRecognition();
        _safeStart();
      }, 150);
    }
  };

  return r;
}

function _safeStart() {
  if (!_recognition || !_isListening) return;
  try { _recognition.start(); } catch (e) { /* already running — ignore */ }
}

// ── Public API ────────────────────────────────────────────────────────────────

/**
 * Start the recognition engine (called once at game start).
 * Subsequent calls while already listening are no-ops.
 */
function startListening(resultCb, interimCb) {
  if (resultCb)  _onResult  = resultCb;
  if (interimCb) _onInterim = interimCb;

  _isProcessing = true;

  if (_isListening) return; // engine already running — just unmute

  _recognition = _buildRecognition();
  if (!_recognition) {
    console.warn('SpeechRecognition not supported. Please use Chrome.');
    return;
  }

  _isListening = true;
  _safeStart();
}

/**
 * Mute processing (pause). Engine keeps running — NO new permission prompt on resume.
 */
function pauseListening() {
  _isProcessing = false;
}

/**
 * Unmute processing (resume). Engine was never stopped.
 */
function resumeListening() {
  _isProcessing = true;
}

/**
 * Fully stop the engine (call only when the game is completely over).
 */
function stopListening() {
  _isListening  = false;
  _isProcessing = false;
  if (_recognition) {
    try { _recognition.stop(); } catch (e) { /* ignore */ }
    _recognition = null;
  }
}

/** True if the browser supports the Web Speech API. */
function isSpeechSupported() {
  return !!(window.SpeechRecognition || window.webkitSpeechRecognition);
}

/** Kept for compatibility — no longer needed but harmless. */
async function isMicAvailable() {
  if (_micStream && _micStream.active) return true;
  return requestMicPermission();
}

/** No-ops kept for compatibility. */
function clearProfiles()  {}
async function registerVoice() { return Promise.resolve(); }
