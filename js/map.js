// map.js — D3 + TopoJSON world map (plain globals, no ES modules)

var TOPO_URL = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json';

var _svg, _path, _projection, _featureGroup;
var _onCountryClick = null;

// Key: numeric country id (always stored as Number), value: color string
var _claimedColors = new Map();
var _tooltip = null;

// After loading, keep a reference to the world TopoJSON for mesh redraws
var _worldData = null;

async function initMap(container, clickHandler) {
  _onCountryClick = clickHandler;
  _claimedColors.clear();

  var width  = container.clientWidth;
  var height = container.clientHeight;

  d3.select(container).select('svg').remove();

  _projection = d3.geoNaturalEarth1()
    .scale(width / 6.2)
    .translate([width / 2, height / 2]);

  _path = d3.geoPath().projection(_projection);

  _svg = d3.select(container)
    .append('svg')
    .attr('width', width)
    .attr('height', height)
    .attr('viewBox', '0 0 ' + width + ' ' + height);

  // Ocean background
  _svg.append('rect')
    .attr('width', width)
    .attr('height', height)
    .attr('fill', '#1a2744');

  // Graticule
  _svg.append('path')
    .datum(d3.geoGraticule()())
    .attr('d', _path)
    .attr('fill', 'none')
    .attr('stroke', '#1e3a5f')
    .attr('stroke-width', 0.4)
    .attr('opacity', 0.6);

  // Load TopoJSON
  _worldData = await d3.json(TOPO_URL);
  var countries = topojson.feature(_worldData, _worldData.objects.countries);

  _featureGroup = _svg.append('g').attr('class', 'countries');

  _featureGroup.selectAll('path')
    .data(countries.features)
    .enter()
    .append('path')
    .attr('class', 'country')
    // ALWAYS store as a plain number — eliminates string/number mismatch bugs
    .attr('data-id', function(d) { return +d.id; })
    .attr('d', _path)
    .attr('fill', '#1e3354')
    .attr('stroke', '#4a7fbf')
    .attr('stroke-width', 0.5)
    .style('cursor', 'default')
    .on('mouseover', function(event, d) {
      var id = +d.id;
      if (!_claimedColors.has(id)) {
        d3.select(this).attr('fill', '#2a4a7f');
      }
      _showTooltip(event, id);
    })
    .on('mousemove', function(event) {
      _moveTooltip(event);
    })
    .on('mouseout', function(event, d) {
      var id = +d.id;
      if (!_claimedColors.has(id)) {
        d3.select(this).attr('fill', '#1e3354');
      } else {
        // Re-apply claimed color in case it was disturbed
        d3.select(this).attr('fill', _claimedColors.get(id));
      }
      _hideTooltip();
    });

  // Border overlay
  _svg.append('path')
    .datum(topojson.mesh(_worldData, _worldData.objects.countries, function(a, b) { return a !== b; }))
    .attr('d', _path)
    .attr('fill', 'none')
    .attr('stroke', '#4a7fbf')
    .attr('stroke-width', 0.5);

  _createTooltip();
  window.addEventListener('resize', function() { _resizeMap(container); });
}

/**
 * Highlight a country.
 * Uses D3 filter on bound data (not attribute selector) — immune to id type mismatches.
 * Also stores by both the numeric id AND tries ±1 neighbours for floating-point IDs.
 */
function highlightCountry(numericId, color) {
  var id = +numericId; // ensure Number
  _claimedColors.set(id, color);

  // Use filter on bound datum — 100% reliable regardless of how d.id is typed
  var selection = _featureGroup.selectAll('path.country')
    .filter(function(d) { return +d.id === id; });

  if (!selection.empty()) {
    // Flash white → player color
    selection
      .interrupt() // cancel any running transitions
      .transition().duration(120)
      .attr('fill', '#ffffff')
      .transition().duration(380)
      .attr('fill', color)
      .attr('stroke', _lighten(color, 60))
      .attr('stroke-width', 1.2);
  } else {
    console.warn('[map] No path found for country id:', id, '— check country id vs world-atlas id');
  }
}

/**
 * Force-reapply all claimed colors (call after a resize or redraw).
 */
function reapplyClaimedColors() {
  _claimedColors.forEach(function(color, id) {
    _featureGroup.selectAll('path.country')
      .filter(function(d) { return +d.id === id; })
      .attr('fill', color)
      .attr('stroke', _lighten(color, 60))
      .attr('stroke-width', 1.2);
  });
}

function resetMap() {
  _claimedColors.clear();
  if (_featureGroup) {
    _featureGroup.selectAll('path.country')
      .interrupt()
      .transition().duration(300)
      .attr('fill', '#1e3354')
      .attr('stroke', '#4a7fbf')
      .attr('stroke-width', 0.5);
  }
}

// ── Tooltip ────────────────────────────────────────────────────────────────────
function _createTooltip() {
  d3.select('#map-tooltip').remove();
  _tooltip = d3.select('body')
    .append('div')
    .attr('id', 'map-tooltip')
    .style('position', 'fixed')
    .style('background', 'rgba(10,14,26,0.95)')
    .style('color', '#e0e8ff')
    .style('padding', '6px 12px')
    .style('border-radius', '6px')
    .style('font-size', '13px')
    .style('font-family', 'inherit')
    .style('border', '1px solid #2a4a7f')
    .style('pointer-events', 'none')
    .style('opacity', 0)
    .style('z-index', 9999);
}

function _showTooltip(event, numericId) {
  var country = COUNTRY_BY_ID.get(numericId);
  if (!_tooltip) return;
  var label;
  if (_claimedColors.has(numericId)) {
    label = (country ? country.name : '?') + ' ✓';
  } else {
    label = country ? ('? ' + country.region) : '?';
  }
  _tooltip.html(label).style('opacity', 1);
  _moveTooltip(event);
}

function _moveTooltip(event) {
  if (!_tooltip) return;
  _tooltip
    .style('left', (event.clientX + 14) + 'px')
    .style('top',  (event.clientY - 28) + 'px');
}

function _hideTooltip() {
  if (_tooltip) _tooltip.style('opacity', 0);
}

// ── Resize ─────────────────────────────────────────────────────────────────────
function _resizeMap(container) {
  var width  = container.clientWidth;
  var height = container.clientHeight;
  _svg.attr('width', width).attr('height', height).attr('viewBox', '0 0 ' + width + ' ' + height);
  _projection.scale(width / 6.2).translate([width / 2, height / 2]);
  _path = d3.geoPath().projection(_projection);
  _svg.selectAll('path').attr('d', _path);
  reapplyClaimedColors();
}

// ── Theme ──────────────────────────────────────────────────────────────────────
/**
 * Update map colors when the user switches light/dark mode.
 * Called from app.js whenever the theme changes.
 */
function setMapTheme(isLight) {
  if (!_svg) return;
  var ocean    = isLight ? '#c8daf5' : '#1a2744';
  var land     = isLight ? '#d4e3c8' : '#1e3354';
  var graticule = isLight ? '#a0b8d8' : '#1e3a5f';
  var border   = isLight ? '#8aabbf' : '#4a7fbf';

  _svg.select('rect').attr('fill', ocean);
  _svg.selectAll('path').filter(function() {
    return d3.select(this).attr('class') !== 'country' && !d3.select(this).classed('country');
  }).attr('stroke', function() {
    var el = d3.select(this);
    var fill = el.attr('fill');
    // graticule has fill=none, border overlay also has fill=none
    return fill === 'none' ? (el.attr('stroke-width') < 1 ? graticule : border) : null;
  });

  // Reset unclaimed country fill color
  _featureGroup.selectAll('path.country')
    .filter(function(d) { return !_claimedColors.has(+d.id); })
    .attr('fill', land)
    .attr('stroke', border);
}

// ── Helpers ────────────────────────────────────────────────────────────────────
function _lighten(hex, amount) {
  hex = hex.replace('#','');
  if (hex.length === 3) hex = hex.split('').map(function(c){ return c+c; }).join('');
  var r = Math.min(255, parseInt(hex.slice(0,2),16) + amount);
  var g = Math.min(255, parseInt(hex.slice(2,4),16) + amount);
  var b = Math.min(255, parseInt(hex.slice(4,6),16) + amount);
  return 'rgb(' + r + ',' + g + ',' + b + ')';
}
