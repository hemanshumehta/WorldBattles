// game.js — Turn-based game with lives system (plain globals, no ES modules)

const PLAYER_COLORS = [
  '#22c55e','#3b82f6','#f59e0b','#ec4899',
  '#a855f7','#14b8a6','#f97316','#06b6d4',
];
const PB_KEY    = 'country_battles_pb';
const MAX_LIVES = 5;

const GameState = {
  players:         [],
  claimed:         new Map(),
  timer:           0,
  timerInterval:   null,
  running:         false,
  soloMode:        false,
  activeTurnIndex: 0,   // index into players[] (skips eliminated)
  turnTimeLeft:    10,
  turnInterval:    null,
  _onUpdate:       null,
};

// ── Personal Best ─────────────────────────────────────────────────────────────
function loadPersonalBest() {
  try { return JSON.parse(localStorage.getItem(PB_KEY)) || null; }
  catch(e) { return null; }
}

function savePersonalBest(score, time, byRegion) {
  var prev  = loadPersonalBest();
  var entry = { score: score, time: time, byRegion: byRegion, date: new Date().toISOString() };
  if (!prev || score > prev.score || (score === prev.score && time < prev.time)) {
    localStorage.setItem(PB_KEY, JSON.stringify(entry));
    return true;
  }
  return false;
}

// ── Players ───────────────────────────────────────────────────────────────────
function addPlayer(name, emoji) {
  var id     = 'p_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6);
  var color  = PLAYER_COLORS[GameState.players.length % PLAYER_COLORS.length];
  var player = { id: id, name: name, emoji: emoji, color: color, score: 0, lives: MAX_LIVES, eliminated: false };
  GameState.players.push(player);
  return player;
}

function removePlayer(id) {
  GameState.players = GameState.players.filter(function(p) { return p.id !== id; });
  GameState.players.forEach(function(p, i) { p.color = PLAYER_COLORS[i % PLAYER_COLORS.length]; });
}

function resetPlayers() {
  GameState.players = [];
  if (typeof clearProfiles === 'function') clearProfiles();
}

// ── Living Players ────────────────────────────────────────────────────────────
function getLivingPlayers() {
  return GameState.players.filter(function(p) { return !p.eliminated; });
}

function getTurnDuration() {
  return getLivingPlayers().length <= 2 ? 15 : 10;
}

function getActiveTurnPlayer() {
  return GameState.players[GameState.activeTurnIndex] || null;
}

function getNextLivingIndex(fromIndex) {
  var len = GameState.players.length;
  var idx = (fromIndex + 1) % len;
  for (var i = 0; i < len; i++) {
    if (!GameState.players[idx].eliminated) return idx;
    idx = (idx + 1) % len;
  }
  return -1;
}

// ── Turn Management ───────────────────────────────────────────────────────────
function startTurn(onUpdate) {
  clearInterval(GameState.turnInterval);
  var player = GameState.soloMode ? GameState.players[0] : getActiveTurnPlayer();
  if (!player) return;

  GameState.turnTimeLeft = getTurnDuration();
  onUpdate('turn_start', player);

  GameState.turnInterval = setInterval(function() {
    GameState.turnTimeLeft--;
    onUpdate('countdown', GameState.turnTimeLeft);

    if (GameState.turnTimeLeft <= 0) {
      clearInterval(GameState.turnInterval);
      if (GameState.soloMode) {
        onUpdate('solo_timeout', player);
        setTimeout(function() { startTurn(onUpdate); }, 1000);
      } else {
        advanceTurn(true, onUpdate);
      }
    }
  }, 1000);
}

function advanceTurn(timedOut, onUpdate) {
  clearInterval(GameState.turnInterval);

  if (timedOut) {
    var loser = getActiveTurnPlayer();
    if (loser && !loser.eliminated) {
      loser.lives--;
      onUpdate('life_lost', loser);
      if (loser.lives <= 0) {
        loser.eliminated = true;
        onUpdate('eliminated', loser);
      }
    }
  }

  var living = getLivingPlayers();
  if (living.length <= 1) {
    GameState.running = false;
    clearInterval(GameState.timerInterval);
    setTimeout(function() { onUpdate('game_over', living[0] || null); }, 1200);
    return;
  }

  var nextIdx = getNextLivingIndex(GameState.activeTurnIndex);
  if (nextIdx === -1) {
    GameState.running = false;
    clearInterval(GameState.timerInterval);
    onUpdate('game_over', null);
    return;
  }
  GameState.activeTurnIndex = nextIdx;
  setTimeout(function() { startTurn(onUpdate); }, 900);
}

// ── Pause / Resume ────────────────────────────────────────────────────────────
function pauseTurn() {
  clearInterval(GameState.timerInterval);
  clearInterval(GameState.turnInterval);
  GameState.timerInterval = null;
  GameState.turnInterval  = null;
}

function resumeTurn(onUpdate) {
  if (!GameState.running) return;

  // Ensure the player gets a fair amount of time after a long pause —
  // never resume with fewer than 5 seconds on the clock.
  if (GameState.turnTimeLeft < 5) {
    GameState.turnTimeLeft = 5;
  }

  // Restart main game timer
  GameState.timerInterval = setInterval(function() {
    GameState.timer++;
    onUpdate('tick');
  }, 1000);

  // Fire an immediate countdown display so the UI shows the correct number right away
  onUpdate('countdown', GameState.turnTimeLeft);

  // Restart turn countdown from where it left off
  GameState.turnInterval = setInterval(function() {
    GameState.turnTimeLeft--;
    onUpdate('countdown', GameState.turnTimeLeft);

    if (GameState.turnTimeLeft <= 0) {
      clearInterval(GameState.turnInterval);
      GameState.turnInterval = null;
      if (GameState.soloMode) {
        var p = GameState.players[0];
        onUpdate('solo_timeout', p);
        setTimeout(function() { startTurn(onUpdate); }, 1000);
      } else {
        advanceTurn(true, onUpdate);
      }
    }
  }, 1000);
}

// ── Game Lifecycle ────────────────────────────────────────────────────────────
function startGame(onUpdate) {
  if (GameState.players.length === 0) return;

  GameState.claimed          = new Map();
  GameState.timer            = 0;
  GameState.running          = true;
  GameState.soloMode         = GameState.players.length === 1;
  GameState.activeTurnIndex  = 0;
  GameState._onUpdate        = onUpdate;

  GameState.players.forEach(function(p) {
    p.score      = 0;
    p.lives      = MAX_LIVES;
    p.eliminated = false;
  });

  resetMap();

  GameState.timerInterval = setInterval(function() {
    GameState.timer++;
    onUpdate('tick');
  }, 1000);

  startTurn(onUpdate);
}

function endGame() {
  GameState.running = false;
  clearInterval(GameState.timerInterval);
  clearInterval(GameState.turnInterval);

  var byRegion = {};
  var grouped  = getByRegion();
  for (var region in grouped) {
    var countries = grouped[region];
    byRegion[region] = {
      got:   countries.filter(function(c) { return GameState.claimed.has(c.id); }).length,
      total: countries.length,
    };
  }

  var isNewBest = false;
  if (GameState.soloMode) {
    isNewBest = savePersonalBest(GameState.players[0].score, GameState.timer, byRegion);
  }

  var living = getLivingPlayers();
  var winner = null;
  if (living.length === 1) {
    winner = living[0];
  } else {
    var sorted = GameState.players.slice().sort(function(a, b) { return b.score - a.score; });
    winner = sorted[0] || null;
  }

  return { players: GameState.players.slice(), timer: GameState.timer, byRegion: byRegion, isNewBest: isNewBest, winner: winner };
}

// ── Guess ─────────────────────────────────────────────────────────────────────
function makeGuess(input, playerId) {
  if (!GameState.running) return { success: false, reason: 'not_running' };

  if (!GameState.soloMode) {
    var active = getActiveTurnPlayer();
    if (!active || active.id !== playerId) return { success: false, reason: 'not_your_turn' };
  }

  var country = findCountry(input);
  if (!country) return { success: false, reason: 'not_found', input: input };

  if (GameState.claimed.has(country.id)) {
    var claimantId    = GameState.claimed.get(country.id);
    var claimant      = GameState.players.find(function(p) { return p.id === claimantId; });

    // ── Penalty: active player loses a life for guessing a taken country ──
    var penaltyPlayer = !GameState.soloMode ? getActiveTurnPlayer() : GameState.players[0];
    var wasEliminated = false;

    if (penaltyPlayer && !penaltyPlayer.eliminated) {
      penaltyPlayer.lives--;
      if (penaltyPlayer.lives <= 0) {
        penaltyPlayer.eliminated = true;
        wasEliminated = true;
      }
      // Stop the running countdown immediately
      clearInterval(GameState.turnInterval);
      GameState.turnInterval = null;

      // Advance turn (or reset solo countdown) after a brief feedback delay
      var _upd = GameState._onUpdate;
      if (!GameState.soloMode) {
        setTimeout(function() { advanceTurn(false, _upd); }, 900);
      } else {
        setTimeout(function() { startTurn(_upd); }, 1200);
      }
    }

    return {
      success:       false,
      reason:        'already_claimed',
      country:       country,
      claimant:      claimant,
      penaltyPlayer: penaltyPlayer,
      wasEliminated: wasEliminated,
    };
  }

  // Claim it
  GameState.claimed.set(country.id, playerId);
  var player = GameState.players.find(function(p) { return p.id === playerId; });
  if (player) player.score++;
  var claimColor = player ? player.color : '#22c55e';
  highlightCountry(country.id, claimColor);

  // Highlight territories (e.g. Greenland lights up when Denmark is claimed)
  var territories = getTerritoryIds(country.id);
  for (var t = 0; t < territories.length; t++) {
    highlightCountry(territories[t], claimColor);
  }

  var allClaimed = GameState.claimed.size >= COUNTRIES.length;

  if (allClaimed) {
    endGame();
    if (GameState._onUpdate) setTimeout(function() { GameState._onUpdate('all_claimed', player); }, 500);
  } else {
    if (!GameState.soloMode) {
      advanceTurn(false, GameState._onUpdate);
    } else {
      clearInterval(GameState.turnInterval);
      setTimeout(function() { startTurn(GameState._onUpdate); }, 400);
    }
  }

  return {
    success:        true,
    country:        country,
    player:         player,
    totalClaimed:   GameState.claimed.size,
    totalCountries: COUNTRIES.length,
    allClaimed:     allClaimed,
  };
}

// ── Display helpers ───────────────────────────────────────────────────────────
function getClaimedByRegion() {
  var grouped = getByRegion();
  var result  = {};
  for (var region in grouped) {
    var countries = grouped[region];
    result[region] = {
      total:   countries.length,
      claimed: countries.filter(function(c) { return GameState.claimed.has(c.id); }).length,
    };
  }
  return result;
}

function formatTime(seconds) {
  var m = Math.floor(seconds / 60).toString().padStart(2, '0');
  var s = (seconds % 60).toString().padStart(2, '0');
  return m + ':' + s;
}
