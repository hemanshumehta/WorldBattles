# Country Battles

A fast-paced, voice-controlled geography game for the browser. Players take turns speaking country names out loud, racing the clock to fill in a world map. Last player standing wins.

**Play it here:** _coming soon — link will live at `https://<your-username>.github.io/country-battles/` once GitHub Pages is enabled_

## Features

- Voice recognition — just say a country name, no typing required
- Interactive D3-powered world map
- Multiplayer turn-based mode with lives, timers, and a scoreboard
- Region-by-region progress tracking
- Light and dark themes
- Personal best tracking

## How to play

1. Open `index.html` in Chrome (voice recognition works best there).
2. Add one or more players, pick an emoji avatar for each.
3. On your turn, say any country name out loud before the timer runs out.
4. Correctly named countries fill in on the map and score points.
5. Each wrong guess or timeout costs a life. Last player with lives wins.

## Tech stack

- Plain HTML, CSS, and JavaScript — no build step
- [D3.js](https://d3js.org/) + [TopoJSON](https://github.com/topojson/topojson) for the world map
- Browser [Web Speech API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API) for voice input

## Running locally

No install needed. Just open `index.html` in a modern browser (Chrome recommended for voice recognition).

```bash
# or, if you want to serve it properly:
python3 -m http.server 8000
# then visit http://localhost:8000
```

## License

MIT — see [LICENSE](LICENSE).
