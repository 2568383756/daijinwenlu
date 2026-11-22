/* 卷锦翻章：与自然滚动一一对应，不锁滚动与不插入空白章节。 */
(function () {
  'use strict';
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const staticMode = new URLSearchParams(location.search).get('static') === '1';
  if (staticMode || document.documentElement.classList.contains('only-mode')) return;

  const definitions = [
    ['region', '壹', 'paper'], ['craft', '贰', 'dark'],
    ['archive', '叁', 'paper'], ['relations', '肆', 'dark'],
    ['translate', '伍', 'paper'], ['people', '陆', 'paper']
  ];
  const entries = definitions.flatMap(([id, number, tone]) => {
    const section = document.getElementById(id);
    const title = section && section.querySelector('.chapter-head .brush');
    if (!section || !title) return [];
    const layer = document.createElement('div');
    layer.className = 'chapter-turn';
    layer.dataset.tone = tone;
    layer.setAttribute('aria-hidden', 'true');
    layer.innerHTML = `<div class="turn-paper"><div class="turn-surface">
      <span class="turn-selvedge turn-selvedge--left"></span>
      <span class="turn-selvedge turn-selvedge--right"></span>
      <div class="turn-heading"><span class="turn-number">${number}</span>
        <img src="${title.getAttribute('src')}" alt="" draggable="false">
        <span class="turn-rule"><i></i><i></i><i></i></span>
      </div></div></div>
      <span class="turn-top-rod"></span><span class="turn-roller"><i></i></span>`;
    section.prepend(layer);
    return [{ id, section, layer, top:0, bottom:0, height:0, forced:false, forcedEntered:false, last:null }];
  });

  let frame = 0, needsMeasure = true, viewport = innerHeight, header = 90;
  const clamp = value => Math.min(1, Math.max(0, value));
  const smooth = value => { const p = clamp(value); return p * p * (3 - 2 * p); };
  function schedule(measure = false) {
    if (measure) needsMeasure = true;
    if (!frame) frame = requestAnimationFrame(render);
  }
  function measure() {
    viewport = innerHeight;
    header = document.getElementById('siteHead')?.getBoundingClientRect().height || 90;
    // All geometry is read together; scrolling only updates transforms and opacity.
    for (const entry of entries) {
      const rect = entry.section.getBoundingClientRect();
      entry.top = rect.top + scrollY;
      entry.bottom = rect.bottom + scrollY;
      entry.height = entry.layer.getBoundingClientRect().height;
      entry.last = null;
    }
    needsMeasure = false;
  }
  function render() {
    frame = 0;
    if (needsMeasure) measure();
    const y = scrollY;
    for (const entry of entries) {
      const top = entry.top - y;
      const bottom = entry.bottom - y;
      const start = viewport * .96;
      const end = header + (innerWidth <= 760 ? viewport * .17 : 24);
      const progress = clamp((start - top) / Math.max(1, start - end));
      if (entry.forced && top < viewport && bottom > 0) entry.forcedEntered = true;
      if (entry.forcedEntered && (top > viewport * 1.08 || bottom < 0)) {
        entry.forced = false;
        entry.forcedEntered = false;
      }
      const active = !motion.matches && !entry.forced && top < viewport && bottom > 0 && progress < .998;
      const state = active ? progress.toFixed(4) : 'open';
      if (entry.last === state) continue;
      entry.last = state;
      entry.layer.classList.toggle('is-active', active);
      if (!active) continue;
      // A slight ease-in/out keeps the edge tactile; reversing scroll is immediate.
      const rolled = smooth(progress);
      entry.layer.style.setProperty('--turn-lift', (rolled * (entry.height + 45)).toFixed(2) + 'px');
      entry.layer.style.setProperty('--turn-title-opacity', (1 - smooth((progress - .5) / .27)).toFixed(4));
      entry.layer.style.setProperty('--turn-opacity', (1 - smooth((progress - .90) / .10)).toFixed(4));
    }
  }
  function showTarget(id) {
    const entry = entries.find(item => item.id === id);
    if (!entry) return;
    entry.forced = true;
    entry.forcedEntered = false;
    entry.last = null;
    entry.layer.classList.remove('is-active');
    schedule(true);
  }
  function showHash() {
    showTarget(location.hash.slice(1));
  }
  // Keyboard and anchor navigation should lead directly to readable content.
  document.addEventListener('focusin', event => {
    const section = event.target.closest('.chapter');
    if (section) showTarget(section.id);
  });
  document.addEventListener('click', event => {
    const anchor = event.target.closest('a[href^="#"]');
    if (anchor) showTarget(anchor.getAttribute('href').slice(1));
  });
  addEventListener('hashchange', showHash);
  addEventListener('scroll', () => schedule(), { passive:true });
  addEventListener('resize', () => schedule(true), { passive:true });
  addEventListener('pageshow', () => { showHash(); schedule(true); });
  addEventListener('load', () => {
    showHash();
    // Initial hash offsets may have changed while archive items and images loaded.
    const target = entries.find(entry => '#' + entry.id === location.hash);
    if (target) requestAnimationFrame(() => {
      target.section.scrollIntoView({ behavior:'instant', block:'start' });
      schedule(true);
    });
    schedule(true);
  });
  motion.addEventListener('change', () => {
    entries.forEach(entry => { entry.last = null; });
    schedule(true);
  });
  const observer = new ResizeObserver(() => {
    entries.forEach(entry => { entry.last = null; });
    schedule(true);
  });
  observer.observe(document.querySelector('main') || document.body);
  document.fonts?.ready.then(() => schedule(true));
  showHash();
  schedule(true);
})();
