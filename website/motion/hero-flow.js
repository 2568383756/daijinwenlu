/* 傣锦纹录 多行错位织锦墙。无依赖，不改变档案数据与原图。
   使用精选墙中 24 幅档案的既有裁切范围；重复仅用于连续视觉陈列。 */
(function () {
  'use strict';
  var scriptURL = document.currentScript && document.currentScript.src;
  var assetBase = new URL('../assets/patterns/', scriptURL || new URL('motion/hero-flow.js', document.baseURI)).href;
  var NS = 'http://www.w3.org/2000/svg';
  // id, image width, image height, crop x, crop y, crop width, crop height
  var records = [
    ['DJ-GEO-001',315,420,28,0,259,420],
    ['DJ-GEO-003',315,420,0,0,315,420],
    ['DJ-GEO-006',420,315,4,19,412,278],
    ['DJ-GEO-007',420,236,12,18,390,204],
    ['DJ-GEO-011',420,248,0,14,420,220],
    ['DJ-GEO-013',420,315,0,9,420,295],
    ['DJ-GEO-015',420,315,4,20,412,276],
    ['DJ-GEO-016',420,187,0,0,420,187],
    ['DJ-GEO-017',420,420,0,0,420,420],
    ['DJ-GEO-018',208,420,0,0,208,420],
    ['DJ-GEO-019',236,420,0,0,236,420],
    ['DJ-GEO-021',420,236,3,28,414,188],
    ['DJ-GEO-024',236,420,0,0,236,420],
    ['DJ-GEO-025',420,236,4,15,410,204],
    ['DJ-GEO-033',280,420,0,0,280,420],
    ['DJ-GEO-034',295,420,0,0,295,420],
    ['DJ-GEO-047',420,420,0,38,420,337],
    ['DJ-GEO-057',280,420,0,0,280,420],
    ['DJ-GEO-058',315,420,0,0,315,420],
    ['DJ-GEO-060',420,313,0,0,420,313],
    ['DJ-GEO-061',341,420,0,0,341,420],
    ['DJ-GEO-062',309,420,0,0,309,420],
    ['DJ-GEO-063',420,389,0,0,420,389],
    ['DJ-GEO-067',420,411,0,0,420,411]
  ];
  var resolveReady;
  var ready = new Promise(function (resolve) { resolveReady = resolve; });
  var api = { ready:ready };
  window.DaijinHeroFlow = api;

  function init() {
    var hero = document.getElementById('hero');
    var media = hero && hero.querySelector('.hero-media');
    if (!hero || !media) { resolveReady(false); return; }
    var reduced = matchMedia('(prefers-reduced-motion: reduce)');
    var staticMode = new URLSearchParams(location.search).get('static') === '1';
    var alive = true, manualPause = false, inView = false;
    var resizeFrame = 0, lastLayout = '', activeRecords = [];
    var scene = document.createElement('div');
    scene.className = 'hero-flow-scene is-paused';
    scene.setAttribute('aria-hidden', 'true');
    var plane = document.createElement('div');
    plane.className = 'hero-flow-plane';
    scene.appendChild(plane);
    media.insertBefore(scene, media.querySelector('.hero-veil'));
    hero.classList.add('hero-flow-active');

    function syncMotion() {
      var pause = manualPause || reduced.matches || staticMode || !inView || document.hidden;
      scene.classList.toggle('is-paused', pause);
      scene.dataset.motion = pause ? 'paused' : 'flowing';
    }
    function updateVisibility() {
      var r = hero.getBoundingClientRect();
      inView = r.bottom > 0 && r.top < innerHeight && r.width > 0 && r.height > 0;
      syncMotion();
    }
    function makeTile(record) {
      var tile = document.createElement('div');
      tile.className = 'hero-flow-tile';
      tile.dataset.recordId = record[0];
      var svg = document.createElementNS(NS, 'svg');
      svg.setAttribute('viewBox', record.slice(3).join(' '));
      svg.setAttribute('preserveAspectRatio', 'xMidYMid slice');
      svg.setAttribute('aria-hidden', 'true');
      svg.setAttribute('focusable', 'false');
      var image = document.createElementNS(NS, 'image');
      image.setAttribute('href', assetBase + record[0] + '.png');
      image.setAttribute('width', record[1]);
      image.setAttribute('height', record[2]);
      svg.appendChild(image);
      tile.appendChild(svg);
      return tile;
    }
    function layout() {
      resizeFrame = 0;
      if (!alive || !activeRecords.length) return;
      var bounds = hero.getBoundingClientRect();
      var width = Math.ceil(bounds.width), height = Math.ceil(bounds.height);
      if (!width || !height) return;
      var tileWidth = Math.round(Math.max(width <= 760 ? 175 : 215, Math.min(340, width * .205)));
      var tileHeight = Math.round(tileWidth * .79);
      var gap = width <= 760 ? 8 : 12;
      var rad = 9 * Math.PI / 180;
      // A rotated rectangle needs these dimensions to cover every viewport corner.
      var planeWidth = Math.ceil(width * Math.cos(rad) + height * Math.sin(rad) + tileWidth);
      var planeHeight = Math.ceil(height * Math.cos(rad) + width * Math.sin(rad) + tileHeight);
      var rowCount = Math.ceil(planeHeight / (tileHeight + gap)) + 1;
      var tileCount = Math.ceil(planeWidth / (tileWidth + gap)) + 1;
      var signature = [width,height,tileWidth,rowCount,tileCount].join(':');
      if (signature === lastLayout) { updateVisibility(); return; }
      lastLayout = signature;
      plane.style.setProperty('--flow-width', planeWidth + 'px');
      plane.style.setProperty('--flow-tile-width', tileWidth + 'px');
      plane.style.setProperty('--flow-tile-height', tileHeight + 'px');
      var fragment = document.createDocumentFragment();
      for (var rowIndex = 0; rowIndex < rowCount; rowIndex++) {
        var row = document.createElement('div');
        row.className = 'hero-flow-row';
        var strip = document.createElement('div');
        strip.className = 'hero-flow-strip';
        var group = document.createElement('div');
        group.className = 'hero-flow-group';
        for (var tileIndex = 0; tileIndex < tileCount; tileIndex++) {
          // Coprime steps mix the 24 images across rows without adjacent duplicates.
          var index = (rowIndex * 7 + tileIndex * 5) % activeRecords.length;
          group.appendChild(makeTile(activeRecords[index]));
        }
        strip.appendChild(group);
        strip.appendChild(group.cloneNode(true));
        var groupWidth = tileCount * (tileWidth + gap);
        var speed = [10,12.5,9,11.5,10.5][rowIndex % 5];
        var duration = groupWidth / speed;
        row.style.setProperty('--flow-duration', duration.toFixed(2) + 's');
        row.style.setProperty('--flow-delay', (-duration * ((rowIndex * .173 + .21) % 1)).toFixed(2) + 's');
        row.style.setProperty('--flow-opacity', [.93,1,.90,.98,1][rowIndex % 5]);
        row.appendChild(strip);
        fragment.appendChild(row);
      }
      plane.replaceChildren(fragment);
      scene.dataset.rows = rowCount;
      scene.dataset.tilesPerGroup = tileCount;
      updateVisibility();
    }
    function requestLayout() {
      if (!resizeFrame && alive) resizeFrame = requestAnimationFrame(layout);
    }
    var observer = typeof IntersectionObserver !== 'undefined' ? new IntersectionObserver(function (entries) {
      inView = entries[0].isIntersecting;
      syncMotion();
    }, { threshold:0 }) : null;
    if (observer) observer.observe(hero);
    else addEventListener('scroll', updateVisibility, { passive:true });
    var resizeObserver = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(requestLayout) : null;
    if (resizeObserver) resizeObserver.observe(hero);
    addEventListener('resize', requestLayout, { passive:true });
    document.addEventListener('visibilitychange', syncMotion);
    if (reduced.addEventListener) reduced.addEventListener('change', syncMotion);
    else reduced.addListener(syncMotion);
    api.pause = function () { manualPause = true; syncMotion(); };
    api.resume = function () { manualPause = false; updateVisibility(); };
    api.refresh = requestLayout;
    api.getState = function () {
      return { motion:scene.dataset.motion, rows:Number(scene.dataset.rows || 0), uniqueImages:activeRecords.length, reduced:reduced.matches, static:staticMode };
    };
    api.destroy = function () {
      alive = false;
      if (resizeFrame) cancelAnimationFrame(resizeFrame);
      if (observer) observer.disconnect();
      if (resizeObserver) resizeObserver.disconnect();
      removeEventListener('resize', requestLayout);
      removeEventListener('scroll', updateVisibility);
      document.removeEventListener('visibilitychange', syncMotion);
      if (reduced.removeEventListener) reduced.removeEventListener('change', syncMotion);
      else reduced.removeListener(syncMotion);
      scene.remove();
      hero.classList.remove('hero-flow-active');
      media.classList.remove('hero-flow-ready');
    };
    // Only reveal the moving layer after its source files are decoded. The existing
    // rich wall remains as a fallback when a source is unavailable.
    Promise.all(records.map(function (record) {
      return new Promise(function (resolve) {
        var img = new Image();
        img.onload = function () {
          if (img.decode) img.decode().catch(function () {}).then(function () { resolve(record); });
          else resolve(record);
        };
        img.onerror = function () { resolve(null); };
        img.src = assetBase + record[0] + '.png';
      });
    })).then(function (loaded) {
      if (!alive) { resolveReady(false); return; }
      activeRecords = loaded.filter(Boolean);
      if (activeRecords.length < 6) { api.destroy(); resolveReady(false); return; }
      layout();
      media.classList.add('hero-flow-ready');
      resolveReady(true);
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once:true });
  else init();
}());
