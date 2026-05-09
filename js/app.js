// app.js — Voice-only controller (no text input, no speaker ID)

var EMOJIS = [
  '😀','😎','🤠','🥳','🤩','😜','🧐','🥸',
  '🦁','🐯','🦊','🐺','🐻','🐼','🐨','🐸',
  '🦅','🦉','🦋','🐲','🦄','🐙','🦈','🦀',
  '🚀','⚡','🔥','💎','🌟','🏆','🎯','🎮',
  '🌍','🌎','🌏','🗺️','🧭','✈️','🏔️','🌊',
  '👑','🎸','🥊','🏹','🛡️','⚔️','🪄','🎲',
];

var RING_CIRC = 326.726; // 2π × 52

// ── App state ──────────────────────────────────────────────────────────────────
var selectedEmoji = '😀';
var isPaused      = false;
var pauseUnlockTime  = null;
var pauseCountdownIv = null;
var _onGameUpdate    = null;

// ── DOM helper ─────────────────────────────────────────────────────────────────
function $(id) { return document.getElementById(id); }

function showScreen(name) {
  ['welcome','setup','game','results'].forEach(function(s) {
    document.getElementById('screen-' + s).classList.toggle('active', s === name);
  });
}

function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, function(c) {
    return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];
  });
}

// ── Toasts ─────────────────────────────────────────────────────────────────────
function toast(msg, type, duration) {
  type     = type     || 'info';
  duration = duration || 2800;
  var el   = document.createElement('div');
  el.className   = 'toast ' + type;
  el.textContent = msg;
  $('toast-container').appendChild(el);
  setTimeout(function() {
    el.style.animation = 'toast-out 0.3s ease forwards';
    setTimeout(function() { el.remove(); }, 300);
  }, duration);
}

// ── Hearts ─────────────────────────────────────────────────────────────────────
function heartsHTML(lives) {
  var h = '';
  for (var i = 0; i < MAX_LIVES; i++) h += (i < lives ? '❤️' : '🖤');
  return h;
}

// ── Countdown ring ─────────────────────────────────────────────────────────────
function updateRing(timeLeft, total) {
  var fill  = $('ring-fill');
  var numEl = $('countdown-num-display');
  if (!fill || !numEl) return;

  fill.style.strokeDashoffset = RING_CIRC * (1 - (total > 0 ? timeLeft / total : 0));

  var color = timeLeft <= 3 ? '#ef4444' : timeLeft <= 5 ? '#f59e0b' : '#22c55e';
  fill.style.stroke = color;

  numEl.textContent = timeLeft;
  numEl.classList.toggle('urgent', timeLeft <= 3);
}

// ── Hex → rgba ─────────────────────────────────────────────────────────────────
function hexToRgba(hex, alpha) {
  hex = hex.replace('#','');
  if (hex.length === 3) hex = hex.split('').map(function(c){ return c+c; }).join('');
  var r = parseInt(hex.slice(0,2),16), g = parseInt(hex.slice(2,4),16), b = parseInt(hex.slice(4,6),16);
  return 'rgba('+r+','+g+','+b+','+alpha+')';
}

// ── Clone to remove stale event listeners ─────────────────────────────────────
function rewireElement(id, attachFn) {
  var old = $(id);
  if (!old) return;
  var fresh = old.cloneNode(true);
  old.parentNode.replaceChild(fresh, old);
  if (attachFn) attachFn(fresh);
}

// ══════════════════════════════════════════════════════════════════════════════
// WELCOME SCREEN
// ══════════════════════════════════════════════════════════════════════════════
function initWelcome() {
  var pb = loadPersonalBest();
  if (pb) {
    $('personal-best-card').classList.remove('hidden');
    $('pb-score').textContent = pb.score + ' countries';
    $('pb-time').textContent  = formatTime(pb.time);
    $('pb-date').textContent  = new Date(pb.date).toLocaleDateString();
  }

  function startSetup() {
    resetPlayers();
    clearProfiles();
    renderPlayersList();
    updateStartButton();
    if (!isSpeechSupported()) {
      $('speech-warning').classList.remove('hidden');
    }
    showScreen('setup');
  }

  $('btn-new-game-world').addEventListener('click', function() {
    GameState.gameMode = 'world';
    startSetup();
  });

  $('btn-new-game-capitals').addEventListener('click', function() {
    GameState.gameMode = 'capitals';
    startSetup();
  });
}

// ══════════════════════════════════════════════════════════════════════════════
// SETUP SCREEN  (name + emoji only — no voice registration)
// ══════════════════════════════════════════════════════════════════════════════
function initSetup() {
  $('btn-back-to-welcome').addEventListener('click', function() { showScreen('welcome'); });

  // Emoji grid
  var grid = $('emoji-grid');
  EMOJIS.forEach(function(emoji) {
    var btn = document.createElement('button');
    btn.className   = 'emoji-opt' + (emoji === selectedEmoji ? ' selected' : '');
    btn.textContent = emoji;
    btn.addEventListener('click', function() {
      selectedEmoji = emoji;
      $('emoji-picker-btn').textContent = emoji;
      grid.querySelectorAll('.emoji-opt').forEach(function(b) { b.classList.remove('selected'); });
      btn.classList.add('selected');
      $('emoji-grid').classList.add('hidden');
    });
    grid.appendChild(btn);
  });

  $('emoji-picker-btn').addEventListener('click', function() {
    $('emoji-grid').classList.toggle('hidden');
  });

  $('btn-add-player').addEventListener('click', handleAddPlayer);
  $('player-name-input').addEventListener('keydown', function(e) {
    if (e.key === 'Enter') handleAddPlayer();
  });

  $('btn-start-game').addEventListener('click', handleStartGame);
}

function handleAddPlayer() {
  var nameInput = $('player-name-input');
  var name      = nameInput.value.trim();
  if (!name) { nameInput.focus(); return; }

  addPlayer(name, selectedEmoji);
  nameInput.value = '';
  $('emoji-grid').classList.add('hidden');
  renderPlayersList();
  updateStartButton();
}

function renderPlayersList() {
  var container = $('players-list');
  container.innerHTML = '';
  GameState.players.forEach(function(p, idx) {
    var card = document.createElement('div');
    card.className = 'player-card';
    card.innerHTML =
      '<div class="player-card-color" style="background:' + p.color + '"></div>' +
      '<div class="player-card-emoji">' + p.emoji + '</div>' +
      '<div class="player-card-info">' +
        '<div class="player-card-name">' + escapeHtml(p.name) + '</div>' +
        '<div class="player-card-sub" style="color:' + p.color + '">Player ' + (idx+1) + '</div>' +
      '</div>' +
      '<button class="player-card-remove" title="Remove">✕</button>';
    card.querySelector('.player-card-remove').addEventListener('click', function() {
      removePlayer(p.id);
      renderPlayersList();
      updateStartButton();
    });
    container.appendChild(card);
  });
}

function updateStartButton() {
  $('btn-start-game').disabled = GameState.players.length === 0;
}

// ══════════════════════════════════════════════════════════════════════════════
// GAME SCREEN
// ══════════════════════════════════════════════════════════════════════════════
async function handleStartGame() {
  showScreen('game');
  $('map-loading').style.display = 'flex';
  isPaused = false;
  $('guess-log').innerHTML = '';

  // ── Request mic permission ONCE here, before anything else ──
  // This is the only time the browser will ever ask.
  // Subsequent startListening / resumeListening calls reuse the same stream.
  if (isSpeechSupported()) {
    var granted = await requestMicPermission();
    if (!granted) {
      setListeningState(false, 'Mic denied — use Chrome & allow mic', '');
    }
  }

  await initMap($('map-container'), function(country) {
    // Map click: ignored — voice-only game
  });
  $('map-loading').style.display = 'none';
  // Apply current theme to newly rendered map
  setMapTheme(document.documentElement.classList.contains('light-mode'));

  // Wire buttons
  rewireElement('btn-pause-game',  function(el) { el.addEventListener('click', handlePause); });
  rewireElement('btn-end-game',    function(el) { el.addEventListener('click', handleEndGame); });
  rewireElement('btn-resume-game', function(el) { el.addEventListener('click', handleResume); });

  // Start game logic (timer + first turn)
  _onGameUpdate = onGameUpdate;
  startGame(_onGameUpdate);

  // Start voice recognition — always on, always attributes to active player
  startVoiceRecognition();

  // Wire text input (always available alongside voice)
  initTypeInput();

  renderScoreboard();
  renderRegionProgress();

  var itemType = GameState.gameMode === 'capitals' ? 'capital' : 'country';
  var typeInput = $('type-guess-input');
  if (typeInput) typeInput.placeholder = 'Type a ' + itemType + '…';
  var setupHint = $('setup-hint');
  if (setupHint) setupHint.textContent = '🎤 Players take turns speaking ' + itemType + ' names out loud — no typing needed.';
  var topbarHint = $('turn-topbar-hint');
  if (topbarHint) topbarHint.textContent = '🎤 Say a ' + itemType + ' name!';
  var listeningHint = $('listening-hint');
  if (listeningHint) listeningHint.textContent = 'Say a ' + itemType + ' name out loud';
}

// ── Text input ─────────────────────────────────────────────────────────────────
function initTypeInput() {
  var input = $('type-guess-input');
  var btn   = $('type-guess-btn');
  if (!input || !btn) return;

  function submitTyped() {
    var text = input.value.trim();
    input.value = '';
    if (!text || !GameState.running || isPaused) return;

    var active = GameState.soloMode ? GameState.players[0] : getActiveTurnPlayer();
    if (!active) return;

    var result = makeGuess(text, active.id);
    if (result.success || result.reason === 'already_claimed') {
      handleGuessResult(result, text);
    } else if (result.reason === 'not_found') {
      var itemType = GameState.gameMode === 'capitals' ? 'capital' : 'country';
      toast('❓ "' + text + '" not recognised as a ' + itemType, 'warning', 1800);
    }
  }

  btn.addEventListener('click', submitTyped);
  input.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') { e.preventDefault(); submitTyped(); }
  });
}

// ── Voice recognition ──────────────────────────────────────────────────────────
// Called once at game start. On pause/resume we use pauseListening/resumeListening
// so the browser never needs to ask for mic permission again.
function startVoiceRecognition() {
  if (!isSpeechSupported()) {
    setListeningState(false, 'Voice not supported — use Chrome');
    return;
  }

  startListening(
    // Final result callback
    function(transcript) {
      // Only process when a turn is actively running and game isn't paused
      if (!GameState.running || isPaused || !GameState.turnInterval) return;

      var active = getActiveTurnPlayer();
      if (!active) return;

      // Clear transcript display
      $('live-transcript').textContent = '';

      // Scan all word-windows (longest first) for a country name
      var words = transcript.toLowerCase().split(/\s+/);
      for (var len = Math.min(words.length, 4); len >= 1; len--) {
        for (var start = 0; start <= words.length - len; start++) {
          var phrase = words.slice(start, start + len).join(' ');
          var result = makeGuess(phrase, active.id);
          if (result.success || result.reason === 'already_claimed') {
            handleGuessResult(result, phrase);
            return;
          }
        }
      }
    },
    // Interim (live) transcript callback
    function(interim) {
      if (!GameState.running || isPaused) return;
      $('live-transcript').textContent = interim;
    },
    [] // no player list needed — no speaker ID
  );
}

// ── Listening card UI ──────────────────────────────────────────────────────────
function setListeningState(active, labelText, hintText, color) {
  var card  = $('listening-card');
  var label = $('listening-label');
  var hint  = $('listening-hint');
  var waves = $('sound-waves');

  if (!card) return;

  card.classList.toggle('is-listening', !!active);
  var itemType = GameState.gameMode === 'capitals' ? 'capital' : 'country';
  label.textContent = labelText || (active ? 'Listening…' : 'Waiting…');
  hint.textContent  = hintText  || (active ? 'Say a ' + itemType + ' name out loud' : '');

  // Color the waves to match the active player
  if (color && active) {
    Array.prototype.forEach.call(waves.querySelectorAll('span'), function(bar) {
      bar.style.background = color;
    });
    card.style.borderColor = color;
    card.style.boxShadow   = '0 0 12px ' + hexToRgba(color, 0.35);
  } else {
    Array.prototype.forEach.call(waves.querySelectorAll('span'), function(bar) {
      bar.style.background = '';
    });
    card.style.borderColor = '';
    card.style.boxShadow   = '';
  }
}

// ── Guess result handler ───────────────────────────────────────────────────────
function handleGuessResult(result, rawInput) {
  if (result.success) {
    playCorrect();
    var p = result.player;
    var displayName = result.country.name;
    if (GameState.gameMode === 'capitals' && result.country.capital) {
      displayName = result.country.capital + ' (' + result.country.name + ')';
    }
    
    addLogEntry(p ? p.emoji : '✅', displayName, p ? p.name : 'Player', true);
    toast((p ? p.emoji + ' ' + p.name : 'You') + ' got ' + displayName + '!', 'success', 2000);
    renderScoreboard();
    renderRegionProgress();

  } else if (result.reason === 'already_claimed') {
    playIncorrect();
    var pp     = result.penaltyPlayer;
    var byWhom = result.claimant ? result.claimant.name : '?';
    addLogEntry('🔒', result.country.name, 'already taken by ' + byWhom, false);

    if (pp) {
      toast('🔒 ' + result.country.name + ' is taken! ' + pp.emoji + ' ' + pp.name + ' loses a life!', 'error', 2800);
      renderScoreboard();
      if (result.wasEliminated) {
        setTimeout(function() {
          toast('💀 ' + pp.emoji + ' ' + pp.name + ' has been eliminated!', 'error', 3500);
          if (getLivingPlayers().length === 2) {
            toast('👥 2 players left — countdown extended to 15 seconds!', 'info', 3000);
          }
        }, 600);
      }
    } else {
      toast(result.country.name + ' is already taken!', 'error', 1800);
    }
  }
}

// ── Game event hub ─────────────────────────────────────────────────────────────
function onGameUpdate(type, data) {
  if (type === 'tick') {
    $('game-timer').textContent = formatTime(GameState.timer);

  } else if (type === 'turn_start') {
    // Big map overlay — impossible to miss whose turn it is
    showTurnOverlay(data);

    // Update sidebar turn banner
    renderTurnBanner(data);
    renderScoreboard();

    // Update listening card to show whose turn it is
    var itemType = GameState.gameMode === 'capitals' ? 'capital' : 'country';
    setListeningState(true,
      'Listening for ' + data.name + '…',
      'Say a ' + itemType + ' name out loud',
      data.color
    );

    // Reset transcript + ring
    $('live-transcript').textContent = '';
    var duration = getTurnDuration();
    updateRing(duration, duration);
    $('countdown-label').textContent = 'seconds remaining';

  } else if (type === 'countdown') {
    var total = getTurnDuration();
    updateRing(data, total);
    $('countdown-label').textContent = data <= 3 ? 'HURRY UP!' : 'seconds remaining';

  } else if (type === 'life_lost') {
    toast('⏱️ Time\'s up! ' + data.emoji + ' ' + data.name + ' loses a life!', 'warning', 2500);
    setListeningState(false, 'Turn over…', '', '');
    renderScoreboard();

  } else if (type === 'eliminated') {
    toast('💀 ' + data.emoji + ' ' + data.name + ' has been eliminated!', 'error', 3500);
    var left = getLivingPlayers().length;
    if (left === 2) toast('👥 2 players left — countdown now 15 seconds!', 'info', 3000);
    renderScoreboard();

  } else if (type === 'solo_timeout') {
    toast('⏱️ Time\'s up! Try again…', 'warning', 1500);
    var dur = getTurnDuration();
    updateRing(dur, dur);

  } else if (type === 'game_over') {
    setListeningState(false, 'Game Over', '');
    stopListening();
    var results = endGame();
    if (data) results.winner = data;
    setTimeout(function() { showResultsScreen(results); }, 700);

  } else if (type === 'all_claimed') {
    setListeningState(false, 'World Conquered!', '');
    stopListening();
    var res = endGame();
    setTimeout(function() { showResultsScreen(res); }, 800);
  }
}

// ── Map overlay banner ─────────────────────────────────────────────────────────
var _overlayTimer = null;

function showTurnOverlay(player) {
  var banner = $('turn-overlay');
  if (!banner || !player) return;

  // Populate content
  $('turn-overlay-emoji').textContent = player.emoji;
  $('turn-overlay-name').textContent  = player.name;

  // Apply the player's color via CSS variables on the banner itself
  banner.style.setProperty('--tb-color', player.color);
  banner.style.setProperty('--tb-glow',  hexToRgba(player.color, 0.45));
  banner.style.borderBottomColor = player.color;

  // Slide in
  banner.style.animation = '';
  banner.classList.remove('hidden');
  void banner.offsetWidth; // force reflow so animation replays
  banner.style.animation = 'topbar-in 0.3s cubic-bezier(0.22,1,0.36,1) forwards';

  // Slide out after 2.5 s
  clearTimeout(_overlayTimer);
  _overlayTimer = setTimeout(function() {
    banner.style.animation = 'topbar-out 0.3s ease forwards';
    setTimeout(function() { banner.classList.add('hidden'); banner.style.animation = ''; }, 320);
  }, 2500);
}

// ── Sidebar turn banner ────────────────────────────────────────────────────────
function renderTurnBanner(player) {
  if (!player) return;
  $('turn-player-emoji').textContent = player.emoji;
  $('turn-player-name').textContent  = player.name;
  $('turn-player-name').style.color  = player.color;
  $('turn-player-lives').textContent = heartsHTML(player.lives);

  // "NOW GUESSING" bar color
  var nowLabel = $('turn-section').querySelector('.turn-now-label');
  if (nowLabel) nowLabel.style.background = player.color;

  var banner = $('turn-banner');
  banner.style.borderLeftColor = player.color;
  banner.style.setProperty('--active-color', player.color);
  banner.style.setProperty('--active-glow', hexToRgba(player.color, 0.35));
  banner.classList.add('active');
}

// ── Scoreboard ─────────────────────────────────────────────────────────────────
function renderScoreboard() {
  var board        = $('players-scoreboard');
  board.innerHTML  = '';
  var activePlayer = GameState.soloMode ? GameState.players[0] : getActiveTurnPlayer();

  GameState.players.forEach(function(p) {
    var isActive = activePlayer && p.id === activePlayer.id;
    var row      = document.createElement('div');
    row.className = 'score-row' + (isActive ? ' is-active' : '') + (p.eliminated ? ' is-eliminated' : '');
    if (isActive) {
      row.style.setProperty('--active-color', p.color);
      row.style.setProperty('--active-glow',  hexToRgba(p.color, 0.3));
    }
    row.innerHTML =
      '<span class="score-dot"   style="background:' + p.color + '"></span>' +
      '<span class="score-emoji">' + p.emoji + '</span>' +
      '<span class="score-name">'  + escapeHtml(p.name) + '</span>' +
      '<div class="score-right">' +
        '<span class="score-count">' + p.score + '</span>' +
        '<span class="score-lives">' + (p.eliminated ? '💀' : heartsHTML(p.lives)) + '</span>' +
      '</div>';
    board.appendChild(row);
  });
}

// ── Region progress ────────────────────────────────────────────────────────────
function renderRegionProgress() {
  var byRegion  = getClaimedByRegion();
  var container = $('region-progress');
  container.innerHTML = '';
  for (var region in byRegion) {
    var d   = byRegion[region];
    var pct = d.total > 0 ? (d.claimed / d.total) * 100 : 0;
    var row = document.createElement('div');
    row.className = 'region-row';
    row.innerHTML =
      '<div class="region-row-top">' +
        '<span class="region-name">' + region + '</span>' +
        '<span class="region-frac">' + d.claimed + '/' + d.total + '</span>' +
      '</div>' +
      '<div class="region-bar"><div class="region-bar-fill" style="width:' + pct + '%"></div></div>';
    container.appendChild(row);
  }
}

// ── Log ────────────────────────────────────────────────────────────────────────
function addLogEntry(emoji, country, player, success) {
  var log   = $('guess-log');
  var entry = document.createElement('div');
  entry.className = 'log-entry';
  entry.innerHTML =
    '<span class="log-emoji">'   + emoji + '</span>' +
    '<span class="log-country">' + escapeHtml(country) + '</span>' +
    '<span class="log-player">'  + escapeHtml(player) + '</span>' +
    '<span class="' + (success ? 'log-icon-success' : 'log-icon-fail') + '">' + (success ? '✓' : '✗') + '</span>';
  log.insertBefore(entry, log.firstChild);
  while (log.children.length > 30) log.removeChild(log.lastChild);
}

// ══════════════════════════════════════════════════════════════════════════════
// PAUSE SYSTEM
// ══════════════════════════════════════════════════════════════════════════════
var PAUSE_PENALTY_MS = 5 * 60 * 1000;

function handlePause() {
  if (isPaused || !GameState.running) return;
  isPaused = true;
  clearTimeout(_overlayTimer);
  $('turn-overlay') && $('turn-overlay').classList.add('hidden');
  pauseTurn();
  pauseListening();  // mute results — engine keeps running, no new permission prompt
  setListeningState(false, 'Paused', '');
  showPauseOverlay();
}

function showPauseOverlay() {
  var overlay   = $('pause-overlay');
  var resumeBtn = $('btn-resume-game');
  var unlockEl  = $('pause-unlock-text');

  overlay.classList.remove('hidden');
  resumeBtn.disabled = true;
  unlockEl.classList.remove('ready');
  pauseUnlockTime = Date.now() + PAUSE_PENALTY_MS;

  clearInterval(pauseCountdownIv);
  pauseCountdownIv = setInterval(function() {
    var remaining = Math.max(0, pauseUnlockTime - Date.now());
    var mins = Math.floor(remaining / 60000);
    var secs = Math.floor((remaining % 60000) / 1000);
    unlockEl.textContent = 'Resume available in ' + mins + ':' + secs.toString().padStart(2, '0');
    if (remaining <= 0) {
      clearInterval(pauseCountdownIv);
      resumeBtn.disabled = false;
      unlockEl.textContent = '✅ Ready to resume!';
      unlockEl.classList.add('ready');
    }
  }, 1000);
}

function handleResume() {
  if (!isPaused || $('btn-resume-game').disabled) return;
  clearInterval(pauseCountdownIv);
  $('pause-overlay').classList.add('hidden');
  isPaused = false;

  // Restart timers (game.js) — also resets turnTimeLeft to at least 5s
  resumeTurn(_onGameUpdate);

  // Re-apply all claimed colors on the map (in case anything was lost)
  reapplyClaimedColors();

  // Fully re-render the sidebar so scores, hearts and regions are correct
  renderScoreboard();
  renderRegionProgress();

  // Restore game timer display
  $('game-timer').textContent = formatTime(GameState.timer);

  var active = getActiveTurnPlayer();
  if (active) {
    renderTurnBanner(active);
  }

  // Unmute the already-running recognition engine — no new permission prompt ever
  resumeListening();
  if (active) {
    var itemType = GameState.gameMode === 'capitals' ? 'capital' : 'country';
    setListeningState(true, 'Listening for ' + active.name + '…', 'Say a ' + itemType + ' name out loud', active.color);
  }
}

// ══════════════════════════════════════════════════════════════════════════════
// END GAME
// ══════════════════════════════════════════════════════════════════════════════
function handleEndGame() {
  clearTimeout(_overlayTimer);
  $('turn-overlay') && $('turn-overlay').classList.add('hidden');
  clearInterval(pauseCountdownIv);
  $('pause-overlay').classList.add('hidden');
  isPaused = false;
  stopListening(); // game is truly over — safe to fully stop
  var results = endGame();
  showResultsScreen(results);
}

// ══════════════════════════════════════════════════════════════════════════════
// RESULTS SCREEN
// ══════════════════════════════════════════════════════════════════════════════
function showResultsScreen(data) {
  showScreen('results');
  var players   = data.players;
  var timer     = data.timer;
  var byRegion  = data.byRegion;
  var isNewBest = data.isNewBest;
  var winner    = data.winner;

  var totalCountries = COUNTRIES.length;
  var totalClaimed   = players.reduce(function(s, p) { return s + p.score; }, 0);

  if (winner && players.length > 1) {
    $('results-title').textContent   = winner.emoji + ' ' + winner.name + ' Wins!';
    $('results-summary').textContent = winner.name + ' outlasted everyone! ' + totalClaimed + ' countries named in ' + formatTime(timer) + '.';
  } else if (totalClaimed === totalCountries) {
    $('results-title').textContent   = '🌍 World Conquered!';
    $('results-summary').textContent = 'All ' + totalCountries + ' countries named in ' + formatTime(timer) + '!';
  } else {
    $('results-title').textContent   = 'Game Over!';
    $('results-summary').textContent = totalClaimed + ' of ' + totalCountries + ' countries in ' + formatTime(timer) + '.';
  }

  // Podium
  var podium = $('podium');
  podium.innerHTML = '';
  var sorted = players.slice().sort(function(a, b) {
    if (b.eliminated !== a.eliminated) return a.eliminated ? 1 : -1;
    return b.score - a.score;
  });
  var RANKS = ['🥇','🥈','🥉'];
  sorted.forEach(function(p, i) {
    var entry = document.createElement('div');
    entry.className = 'podium-entry';
    entry.innerHTML =
      '<div class="podium-rank">'  + (RANKS[i] || '#'+(i+1)) + '</div>' +
      '<div class="podium-emoji">' + p.emoji + '</div>' +
      '<div class="podium-name">'  + escapeHtml(p.name) + (p.eliminated ? ' 💀' : '') + '</div>' +
      '<div>' +
        '<div class="podium-score" style="color:' + p.color + '">' + p.score + '</div>' +
        '<div class="podium-label">countries</div>' +
      '</div>';
    podium.appendChild(entry);
  });

  // Solo PB
  var pbComp = $('pb-comparison');
  if (players.length === 1) {
    pbComp.classList.remove('hidden');
    var prev  = loadPersonalBest();
    var cur   = players[0].score;
    var title = isNewBest ? '🏆 New Personal Best!'
              : (prev && cur < prev.score) ? '💪 Keep going!'
              : (prev && cur === prev.score) ? '👏 Tied your best!' : '📈 Better score!';
    $('pb-comparison-title').textContent = title;
    var grid = $('pb-comparison-grid');
    if (prev && !isNewBest) {
      grid.innerHTML =
        '<div class="pb-col"><div class="pb-col-label">This Run</div><div class="pb-col-val">' + cur + '</div><div class="pb-col-sub">' + formatTime(timer) + '</div></div>' +
        '<div class="pb-col"><div class="pb-col-label">Personal Best</div><div class="pb-col-val" style="color:var(--gold)">' + prev.score + '</div><div class="pb-col-sub">' + formatTime(prev.time) + '</div></div>';
    } else {
      grid.innerHTML =
        '<div class="pb-col" style="grid-column:1/-1"><div class="pb-col-label">Score</div><div class="pb-col-val" style="color:var(--gold)">' + cur + ' countries</div><div class="pb-col-sub">' + formatTime(timer) + '</div></div>';
    }
  } else {
    pbComp.classList.add('hidden');
  }

  // Regions
  var regionsEl = $('results-regions');
  regionsEl.innerHTML = '';
  for (var region in byRegion) {
    var d   = byRegion[region];
    var pct = d.total > 0 ? (d.got / d.total) * 100 : 0;
    var card = document.createElement('div');
    card.className = 'result-region-card';
    card.innerHTML =
      '<div class="result-region-name">' + region + '</div>' +
      '<div class="result-region-bar"><div class="result-region-fill" style="width:' + pct + '%"></div></div>' +
      '<div class="result-region-frac">' + d.got + ' / ' + d.total + '</div>';
    regionsEl.appendChild(card);
  }

  rewireElement('btn-play-again', function(el) { el.addEventListener('click', playAgain); });
  rewireElement('btn-main-menu',  function(el) { el.addEventListener('click', function() { showScreen('welcome'); }); });
}

function playAgain() {
  GameState.players.forEach(function(p) { p.score = 0; p.lives = MAX_LIVES; p.eliminated = false; });
  handleStartGame();
}

// ══════════════════════════════════════════════════════════════════════════════
// THEME
// ══════════════════════════════════════════════════════════════════════════════
function initTheme() {
  var btn = $('theme-toggle');
  if (!btn) return;

  function applyTheme(isLight) {
    document.documentElement.classList.toggle('light-mode', isLight);
    btn.textContent = isLight ? '☀️' : '🌙';
    btn.title = isLight ? 'Switch to dark mode' : 'Switch to light mode';
    try { localStorage.setItem('cb_theme', isLight ? 'light' : 'dark'); } catch(e) {}
    // Update map SVG colors if the map is already rendered
    if (typeof setMapTheme === 'function') setMapTheme(isLight);
  }

  // Apply current state (may have been set by inline head script)
  var isLight = document.documentElement.classList.contains('light-mode');
  btn.textContent = isLight ? '☀️' : '🌙';
  btn.title = isLight ? 'Switch to dark mode' : 'Switch to light mode';

  btn.addEventListener('click', function() {
    var nowLight = !document.documentElement.classList.contains('light-mode');
    applyTheme(nowLight);
  });
}

// ══════════════════════════════════════════════════════════════════════════════
// BOOT
// ══════════════════════════════════════════════════════════════════════════════
initTheme();
initWelcome();
initSetup();
showScreen('welcome');
