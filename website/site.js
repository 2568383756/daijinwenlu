/* 傣锦纹录 交互
   原生脚本，无依赖。所有动效只改 transform / opacity。 */
(function () {
  'use strict';

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const SITE = window.SITE || {};
  const GAL = window.DAIJIN_GALLERY || { records: [], categories: [] };
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isStatic = /[?&]static=1/.test(location.search);
  if (!reduced && !isStatic) document.documentElement.classList.add('js-anim');
  if (isStatic) {
    document.documentElement.classList.add('static');
    const only = /[?&]only=([\w-]+)/.exec(location.search);
    if (only) {
      $$('main > section').forEach(sec => { if (sec.id !== only[1]) sec.style.display = 'none'; });
      document.documentElement.classList.add('only-mode');
      scrollTo(0, 0);
      setTimeout(() => { onScroll(); $$('.reveal').forEach(el => el.classList.add('is-in')); }, 60);
    }
    addEventListener('load', () => {
      const m = /[?&]scroll=([\w-]+)/.exec(location.search);
      if (m) { const el = document.getElementById(m[1]); if (el) { document.documentElement.style.scrollBehavior = 'auto'; window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY + 1); } }
    });
  }
  const fmt = n => new Intl.NumberFormat('zh-CN').format(n);

  /* ---------- 页头：滚动状态与进度 ---------- */
  const head = $('#siteHead');
  const progress = $('#headProgress');
  let lastY = -1;

  function onScroll() {
    const y = window.scrollY || 0;
    if (y !== lastY) {
      const heroEl = document.querySelector('.hero');
      const heroOn = !!heroEl && heroEl.getBoundingClientRect().bottom > 80;
      head.classList.toggle('is-hero', y < innerHeight * 0.65 && heroOn);
      head.classList.toggle('is-solid', y > 40 || !head.classList.contains('is-hero'));
      const h = document.documentElement.scrollHeight - innerHeight;
      progress.style.width = (h > 0 ? Math.min(100, (y / h) * 100) : 0) + '%';
      lastY = y;
    }
    if (!reduced) {
      const band = $('#wallBand');
      if (band) {
        const r = band.getBoundingClientRect();
        if (r.bottom > 0 && r.top < innerHeight) {
          const p = Math.min(1, Math.max(0, (innerHeight - r.top) / (innerHeight + r.height)));
          band.style.transform = `translate3d(${(0.02 - p * 0.075) * 100}%,0,0) scale(1.06)`;
        }
      }
      const scene = $('#sceneImage');
      if (scene) {
        const sr = scene.getBoundingClientRect();
        if (sr.bottom > 0 && sr.top < innerHeight) {
          const p = (innerHeight - sr.top) / (innerHeight + sr.height);
          scene.style.transform = `translate3d(0, ${(0.5 - p) * 26}px, 0)`;
        }
      }
    }
  }
  addEventListener('scroll', onScroll, { passive: true });
  addEventListener('hashchange', () => setTimeout(onScroll, 60));
  addEventListener('load', () => setTimeout(onScroll, 80));
  onScroll();
  requestAnimationFrame(onScroll);

  /* ---------- 滚动揭示 ---------- */
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
  $$('.reveal').forEach(el => io.observe(el));

  // 兜底：直接带锚点进入与或观察器未触发时，把视口内的内容显出来
  function revealInView() {
    const vh = innerHeight || 800;
    $$('.reveal:not(.is-in)').forEach(el => {
      const r = el.getBoundingClientRect();
      if (r.top < vh - 40 && r.bottom > 0) el.classList.add('is-in');
    });
  }
  function jumpToHash() {
    const id = (location.hash || '').slice(1);
    if (!id) return;
    const el = document.getElementById(id);
    if (!el) return;
    try { el.scrollIntoView({ behavior: 'auto', block: 'start' }); } catch (e) { window.scrollTo(0, el.offsetTop - 80); }
    onScroll();
    setTimeout(revealInView, 120);
    setTimeout(revealInView, 600);
  }
  addEventListener('load', () => { setTimeout(revealInView, 200); setTimeout(revealInView, 900); });
  addEventListener('hashchange', () => { setTimeout(jumpToHash, 40); setTimeout(revealInView, 260); });
  setTimeout(revealInView, 900);
  setTimeout(revealInView, 2000);
  setTimeout(() => $$('.reveal:not(.is-in)').forEach(el => el.classList.add('is-in')), 2600);

  /* ---------- 导航高亮 ---------- */
  // Navigation state is based on chapter positions in motion/reading-layout.js.

  /* ---------- 首屏数字 ---------- */
  const factObserver = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      $$('[data-count]', e.target).forEach(el => {
        const target = +el.dataset.count;
        if (reduced || isStatic) { el.textContent = fmt(target); return; }
        const t0 = performance.now(), dur = 1100;
        const tick = (t) => {
          const p = Math.min(1, (t - t0) / dur);
          el.textContent = fmt(Math.round(target * (1 - Math.pow(1 - p, 3))));
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      });
      factObserver.disconnect();
    });
  }, { threshold: 0.4 });
  const facts = $('.hero-facts');
  if (facts) factObserver.observe(facts);

  /* ---------- 锦卷 ---------- */
  (function mountScroll() {
    const mountEl = $('#scrollMount');
    if (!mountEl || !window.DaijinScroll) return;
    const roll = window.DaijinScroll.mount(mountEl, {
      assetBase: 'motion/assets/', duration: 2400, progress: 0, controls: false
    });
    const params = new URLSearchParams(location.search);
    if (params.get('open') === '1') setTimeout(() => roll.setProgress(1), 120);
    let started = false;
    const start = () => {
      if (started) return; started = true;
      if (reduced) roll.setProgress(1); else roll.play();
    };
    const once = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) { start(); once.disconnect(); } });
    }, { threshold: 0.3 });
    once.observe(mountEl);
    setTimeout(() => {
      const r = mountEl.getBoundingClientRect();
      if (r.top < innerHeight * 0.8 && r.bottom > 0) start();
    }, 1200);

    const toggle = () => {
      const p = typeof roll.getProgress === 'function' ? roll.getProgress() : 0;
      if (p > 0.98) roll.close(); else roll.play();
    };
    mountEl.addEventListener('click', toggle);
    mountEl.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); }
    });
  })();

  /* ---------- 地域：地图与列表与详情 ---------- */
  const LON0 = 97.58, LON1 = 106.21, LAT0 = 21.17, LAT1 = 29.35;
  const regions = SITE.regions || [];
  const pinsBox = $('#mapPins');
  const listBox = $('#regionList');
  const detailBox = $('#regionDetail');

  function renderRegions() {
    if (!pinsBox) return;
    pinsBox.innerHTML = regions.map(r => {
      const x = ((r.lon - LON0) / (LON1 - LON0)) * 100;
      const y = ((LAT1 - r.lat) / (LAT1 - LAT0)) * 100;
      const pos = { 'GEO-JINGHONG': 'lp-below', 'GEO-MENGHAI': 'lp-left', 'GEO-MENGLA': 'lp-right', 'GEO-MANGSHI': '', 'GEO-JIANGCHENG': '' }[r.id] || '';
      return `<button class="map-pin" type="button" data-region="${r.id}"
        style="left:${x.toFixed(2)}%;top:${y.toFixed(2)}%" aria-label="${r.label}：${r.fullName}">
        <span class="${pos}">${r.label}</span></button>`;
    }).join('');

    listBox.innerHTML = regions.map((r, i) => `
      <li><button class="region-item" type="button" data-region="${r.id}">
        <em>${String(i + 1).padStart(2, '0')}</em>
        <strong>${r.fullName}<small>${r.prefecture}</small></strong>
      </button></li>`).join('');

    $$('[data-region]').forEach(el => el.addEventListener('click', event => {
      let selected = el;
      if(el.classList.contains('map-pin') && event.detail > 0 && !event.target.closest('span')){
        selected = $$('.map-pin',pinsBox).reduce((nearest,pin)=>{
          const r=pin.getBoundingClientRect(),distance=Math.hypot(event.clientX-r.left-r.width/2,event.clientY-r.top-r.height/2);
          return distance<nearest.distance?{pin,distance}:nearest;
        },{pin:el,distance:Infinity}).pin;
      }
      selectRegion(selected.dataset.region);
      if(matchMedia('(max-width:999px)').matches){
        detailBox.scrollIntoView({behavior:reduced?'instant':'smooth',block:'start'});
        detailBox.tabIndex=-1;detailBox.focus({preventScroll:true});
      }
    }));
    selectRegion(regions[0].id);
  }

  function selectRegion(id) {
    const r = regions.find(x => x.id === id);
    if (!r) return;
    $$('[data-region]').forEach(el => {el.classList.toggle('is-active', el.dataset.region === id && el.classList.contains('map-pin'));el.setAttribute('aria-pressed',String(el.dataset.region === id));});
    $$('.region-item').forEach(el => el.classList.toggle('is-active', el.dataset.region === id));
    detailBox.innerHTML = `
      <h3>${r.fullName}</h3>
      <p class="rd-sub">${r.prefecture}</p>
      ${r.sites.map(s => `<div class="site">
          <b>${s.name}</b>
          <p>${s.note}</p>
        </div>`).join('')}
      <div class="src">
        ${r.evidence.slice(0, 2).map(e => `<a href="${e.url}" target="_blank" rel="noreferrer">
          ${e.title}</a>`).join('')}
      </div>`;
  }
  renderRegions();

  /* ---------- 工艺：热点与工序 ---------- */
  const hotspots = [
    { id: 'LP-H01', label: '平行线束', x: .46, y: .41,
      text: '多根浅色线束平行延伸，牵引视线走向织造区域。细看线的疏密与走向，感受锦面成形前的秩序。' },
    { id: 'LP-H02', label: '木质构件', x: .235, y: .63,
      text: '横向木条与带开孔的木质构件相接，构成画面中的织机局部。木与线的交错，呈现手工织造的细节。' },
    { id: 'LP-H03', label: '悬挂线圈', x: .505, y: .285,
      text: '多束浅色线圈从横杆附近垂下，弯曲的线形与平直的线束相映。' },
    { id: 'LP-H04', label: '手部操作位置', x: .565, y: .41,
      text: '双手靠近前方的木质构件，配合机架引导线束。织锦的细密，藏在一遍遍操作之间。' }
  ];
  const hotBox = $('#hotspots');
  const panel = $('#scenePanel');

  function renderHotspots() {
    if (!hotBox) return;
    hotBox.innerHTML = hotspots.map((h, i) => `
      <button class="hotspot" type="button" data-hot="${i}"
        style="left:${h.x * 100}%;top:${h.y * 100}%" aria-label="查看${h.label}">${i + 1}</button>`).join('');
    $$('[data-hot]').forEach(b => {
      b.addEventListener('click', () => selectHotspot(+b.dataset.hot));
      b.addEventListener('mouseenter', () => selectHotspot(+b.dataset.hot));
    });
    selectHotspot(0);
  }
  function selectHotspot(i) {
    const h = hotspots[i];
    $$('[data-hot]').forEach(b => b.classList.toggle('is-active', +b.dataset.hot === i));
    panel.innerHTML = `
      <p class="sp-label">织作细节 ${h.id}</p>
      <h3>${h.label}</h3>
      <p>${h.text}</p>
      <p class="sp-limit">点击画面标记，继续细看织作。</p>`;
  }
  renderHotspots();

  const stepsBox = $('#steps');
  if (stepsBox && SITE.steps) {
    stepsBox.innerHTML = SITE.steps.map(s => `
      <li class="step">
        <b>${String(s.n).padStart(2, '0')}</b>
        <h4>${s.title}</h4>
        <p>${s.summary}</p>
      </li>`).join('');
  }

  /* ---------- 经纬交织：可拖拽的织造示意 ---------- */
  function initWeave() {
    const stage = $('#weaveStage');
    if (!stage) return;
    const NS = 'http://www.w3.org/2000/svg';
    const W = 1200, H = 640, x0 = 72, x1 = 1128, y0 = 100, y1 = 560;
    const NX = 16, NY = 10;
    const xs = Array.from({ length: NX }, (_, i) => x0 + (x1 - x0) * i / (NX - 1));
    const ys = Array.from({ length: NY }, (_, i) => y0 + (y1 - y0) * i / (NY - 1));
    const ww = 16, wh = 16;
    const svg = document.createElementNS(NS, 'svg');
    svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
svg.setAttribute('preserveAspectRatio', 'xMidYMid slice');
    svg.setAttribute('aria-hidden', 'true');
    const defs = `<defs>${Array.from({ length: NY }, (_, r) => `<clipPath id="wc${r}"><rect x="${x0 - 34}" y="0" width="0" height="${H}"/></clipPath>`).join('')}</defs>`;
    const warps = `<g class="warps">${xs.map(x => `<line class="warp-line" x1="${x}" y1="${y0 - 26}" x2="${x}" y2="${y1 + 26}"/>`).join('')}</g>`;
    const rows = `<g class="rows">${Array.from({ length: NY }, (_, r) => {
      const under = xs.map((x, i) => ((i + r) % 2 !== 0)
        ? `<rect class="under" x="${(x - ww / 2 - 1).toFixed(1)}" y="${(ys[r] - wh / 2 - 1).toFixed(1)}" width="${ww + 2}" height="${wh + 2}" rx="5"/>`
        : '').join('');
      return `<g class="row" clip-path="url(#wc${r})"><rect class="band" x="${x0 - 34}" y="${(ys[r] - wh / 2).toFixed(1)}" width="${x1 - x0 + 68}" height="${wh}" rx="6"/>${under}</g>`;
    }).join('')}</g>`;
    const shuttle = `<rect class="shuttle" id="weaveShuttle" x="0" y="0" width="54" height="12" rx="6"/>`;
    svg.innerHTML = defs + warps + rows + shuttle;
    stage.appendChild(svg);

    const clips = Array.from({ length: NY }, (_, r) => svg.querySelector(`#wc${r} rect`));
    const rowEls = Array.from(svg.querySelectorAll('.row'));
    const sh = svg.querySelector('#weaveShuttle');
    const countEl = $('#weaveCount');
    const range = $('#weaveRange');
    const playBtn = $('#weavePlay');
    let picks = 0, playing = false, raf = 0, lastT = 0, inView = false, started = false;

    function update() {
      const total = x1 - x0 + 68;
      rowEls.forEach((row, r) => {
        const p = Math.max(0, Math.min(1, picks - r));
        clips[r].setAttribute('width', (p * total).toFixed(1));
        row.style.opacity = p > 0 ? '1' : '.16';
      });
      const cur = Math.min(NY - 1, Math.floor(picks));
      const frac = picks - Math.floor(picks);
      if (picks > 0.02 && frac > 0.02 && picks < NY) {
        sh.setAttribute('opacity', '1');
        sh.setAttribute('x', (x0 - 34 + frac * total - 26).toFixed(1));
        sh.setAttribute('y', (ys[cur] - 6).toFixed(1));
      } else {
        sh.setAttribute('opacity', '0');
      }
      countEl.textContent = `当前织入 ${Math.min(NY, Math.floor(picks + 1e-6))} / ${NY} 行纬线`;
      range.value = picks.toFixed(2);
    }

    function loop(t) {
      raf = 0;
      if (!playing || !inView || document.hidden) return;
      if (!lastT) lastT = t;
      const dt = Math.min(0.05, (t - lastT) / 1000);
      lastT = t;
      picks = Math.min(NY, picks + dt * 1.6);
      update();
      if (picks >= NY) { playing = false; playBtn.textContent = '重播'; return; }
      raf = requestAnimationFrame(loop);
    }
    function syncWeaveMotion(){
      if(!playing || !inView || document.hidden){cancelAnimationFrame(raf);raf=0;lastT=0;}
      else if(!raf){lastT=0;raf=requestAnimationFrame(loop);}
    }

    let touched = false;
    function play() {
      if (playing) { playing = false; syncWeaveMotion(); playBtn.textContent = '继续'; return; }
      if (picks >= NY) { picks = 0; update(); }
      playing = true; lastT = 0; playBtn.textContent = '暂停';
      syncWeaveMotion();
    }
    playBtn.addEventListener('click', () => { touched = true; play(); });
    $('#weaveReset').addEventListener('click', () => {
      touched = true;playing = false; syncWeaveMotion(); picks = 0; playBtn.textContent = '播放'; update();
    });
    range.addEventListener('input', () => {
      touched = true;playing = false; syncWeaveMotion();
      picks = +range.value;playBtn.textContent = picks >= NY ? '重播' : '继续';update();
    });

    $$('[data-weft]').forEach(btn => btn.addEventListener('click', () => {
      $$('[data-weft]').forEach(b => b.setAttribute('aria-pressed', String(b === btn)));
      svg.classList.toggle('dim-weft', btn.dataset.weft === 'warp');
      svg.classList.toggle('dim-warp', btn.dataset.weft === 'weft');
    }));

    range.addEventListener('input', () => { if (+range.value >= NY) playBtn.textContent = '重播'; });
    const auto = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        inView=e.isIntersecting;
        if(inView && !started && !touched){
          started=true;
          if(reduced || isStatic){picks=NY;playBtn.textContent='重播';update();}else{picks=0;update();play();}
        }
        syncWeaveMotion();
      });
    }, { threshold: 0 });
    auto.observe(stage);
    document.addEventListener('visibilitychange',syncWeaveMotion);

    const wp = new URLSearchParams(location.search).get('weave');
    if (wp !== null) { touched = true; picks = Math.max(0, Math.min(NY, parseFloat(wp) || 0)); }
    update();
  }
  initWeave();

  /* ---------- 工序插图：悬停说明卡 ---------- */
  (function bindIllus() {
    const strip = document.querySelector('.illus-strip');
    if (!strip) return;
    const cards = [
      { t: '线材准备', d: '整理棉料，经过纺线和搓线，再绕线备好上机所需的线材。', n: '从纤维到线，为织造作准备。' },
      { t: '染线', d: '对线材着色，是织造前的准备。', n: '色彩先进入线，再进入锦面。' },
      { t: '上机排经', d: '在木架式织机上，按图样安排经纬与颜色。', n: '经纬就位，图样等待织入。' },
      { t: '织造', d: '经纬往复交织，逐步织出带图案的织物。', n: '在反复操作中，纹样逐渐显现。' },
      { t: '检视成锦', d: '展开锦面，观看纹样如何重复，细赏边饰与色彩。', n: '让成锦的细部进入视线。' }
    ];
    const figs = $$('figure', strip);
    const card = document.createElement('div');
    card.className = 'illus-card';
    card.setAttribute('role', 'tooltip');
    strip.appendChild(card);

    function show(i, fig) {
      const c = cards[i] || cards[0];
      card.innerHTML = `<p class="ic-kicker">工序 ${String(i + 1).padStart(2, '0')}</p><h4>${c.t}</h4><p>${c.d}</p><p class="ic-note">${c.n}</p>`;
      strip.classList.add('is-hovering');
      figs.forEach(f => f.classList.toggle('is-hot', f === fig));
      const sr = strip.getBoundingClientRect(), fr = fig.getBoundingClientRect();
      const x = Math.max(10, Math.min(sr.width - 300, fr.left - sr.left + fr.width / 2 - 150));
      card.style.left = x + 'px';
      card.style.top = Math.max(8, fr.top - sr.top - card.offsetHeight - 14) + 'px';
      card.classList.add('is-on');
    }
    function hide() {
      strip.classList.remove('is-hovering');
      figs.forEach(f => f.classList.remove('is-hot'));
      card.classList.remove('is-on');
    }
    figs.forEach((fig, i) => {
      fig.tabIndex = 0;
      fig.addEventListener('mouseenter', () => show(i, fig));
      fig.addEventListener('focus', () => show(i, fig));
      fig.addEventListener('mouseleave', hide);
      fig.addEventListener('blur', hide);
    });
  })();

  /* ---------- 纹样档案 ---------- */
  const records = (GAL.records || []).map(r => ({ ...r }));
  const cats = (GAL.categories || []).map(c => c.name);
  const catCards = $('#catCards');
  const coverMap = { '几何': 'geometry', '植物': 'plant', '动物': 'animal', '建筑': 'architecture', '文字': 'script' };
  const countEl = $('#archiveCount');
  const emptyEl = $('#archiveEmpty');
  const searchEl = $('#archiveSearch');
  let activeCat = 'all';
  let view = records.slice();
  let currentIndex = -1;

  const colorLabel = {
    red: '红系', blue: '蓝系', teal: '青系', orange_gold: '橙金系',
    magenta: '品红系', purple: '紫系', yellow_green: '黄绿系', no_stable_color: '无稳定主色'
  };
  const colorTerms={red:'红色 朱红',blue:'蓝色 靛蓝',teal:'青色 绿色 青绿',orange_gold:'橙色 金色 黄色',magenta:'玫红 红色 粉色',purple:'紫色',yellow_green:'黄绿 黄色 绿色'};

  function renderCatCards() {
    if (!catCards) return;
    catCards.innerHTML = (GAL.categories || []).map(c => `
      <button class="cat-card" type="button" data-cat="${c.name}" aria-pressed="false">
        <span class="cat-inner">
          <span class="cat-visual"><img loading="lazy" decoding="async" src="assets/cards/${coverMap[c.name] || 'geometry'}.jpg" alt=""></span>
          <span class="cat-title">${c.name}纹样</span>
          <span class="cat-count">${c.count} 幅纹样</span>
        </span>
      </button>`).join('');
    $$('.cat-card', catCards).forEach(b => b.addEventListener('click', () => {
      activeCat = activeCat === b.dataset.cat ? 'all' : b.dataset.cat;
      syncCat();
      applyFilter();
      searchEl.closest('.archive-bar').scrollIntoView({ behavior: reduced ? 'instant' : 'smooth', block: 'start' });
    }));
    syncCat();
  }
  const grid = $('#archiveGrid');
  const thumbOf = r => r.image.replace('assets/patterns/', 'assets/thumbs/').replace(/\.png$/i, '.webp');

  function applyFilter() {
    const terms = (searchEl.value || '').normalize('NFKC').trim().toUpperCase().split(/\s+/).filter(Boolean);
    const labels = new Map((window.DAIJIN_STUDIO_PATTERNS || []).map(p => [p.id, p.label]));
    view = records.filter(r => {
      const text = `${r.id} ${r.category} ${r.category}纹样 ${colorLabel[r.dominant] || ''} ${colorTerms[r.dominant] || ''} ${labels.get(r.id) || ''}`.toUpperCase();
      return (activeCat === 'all' || r.category === activeCat) && terms.every(term => text.includes(term));
    });
    renderGrid();
    syncCat();
  }

  function renderGrid() {
    if (!grid) return;
    countEl.textContent = searchEl.value.trim() || activeCat !== 'all' ? `找到 ${view.length} 幅` : '全部纹样';
    emptyEl.hidden = view.length !== 0;
    grid.innerHTML = view.map((r, i) => `
      <button class="p-cell" type="button" data-idx="${i}" aria-label="打开 ${r.id}" style="--i:${i % 24}">
        <img loading="lazy" decoding="async" src="${thumbOf(r)}" alt="${r.category}目录 ${r.id}">
        <span><em>${r.id}</em><em>${r.category}</em></span>
      </button>`).join('');
    $$('.p-cell', grid).forEach(el => el.addEventListener('click', () => openRecord(+el.dataset.idx)));
  }

  function syncCat() {
    if (!catCards) return;
    $$('.cat-card', catCards).forEach(b => b.setAttribute('aria-pressed', String(b.dataset.cat === activeCat)));
    const btn = $('#resetCat');
    if (btn) btn.textContent = activeCat === 'all' ? '全部' : '返回全部';
  }
  renderCatCards();
  renderGrid();

  searchEl.addEventListener('input', applyFilter);
  addEventListener('daijin:studio-ready',()=>{if(searchEl.value.trim())applyFilter();});
  const resetBtn = $('#resetCat');
  function resetArchive(){activeCat = 'all';searchEl.value = '';applyFilter();}
  if (resetBtn) resetBtn.addEventListener('click', resetArchive);
  $('#archiveClear')?.addEventListener('click',()=>{resetArchive();searchEl.focus({preventScroll:true});});
  $('#headSearch').addEventListener('click', () => {
    const mobileSearch = matchMedia('(max-width:999px)').matches;
    const target = mobileSearch ? searchEl.closest('.archive-bar') : $('#archive');
    target.scrollIntoView({ behavior: mobileSearch || reduced ? 'instant' : 'smooth', block: 'start' });
    // Keep focus inside the tap gesture so mobile keyboards can open reliably.
    if (mobileSearch) searchEl.focus({ preventScroll: true });
    else setTimeout(() => searchEl.focus({ preventScroll: true }), reduced ? 0 : 700);
  });

  const dialog = $('#patternDialog');
  const dImg = $('#dialogImage');
  const dTitle = $('#dialogTitle');
  const dCat = $('#dialogCategory');
  const dFields = $('#dialogFields');
  const dCap = $('#dialogCaption');
  const dDl = $('#dialogDownload');
  let dialogView = [];

  function openRecord(i) {
    if (i < 0 || i >= view.length) return;
    dialogView = view.slice();
    currentIndex = i;
    renderRecord(view[i]);
    if (!dialog.open) dialog.showModal();
  }
  function renderRecord(r) {
    dImg.src = r.image;
    dImg.alt = `${r.category}目录图像 ${r.id}`;
    dTitle.textContent = r.id;
    dCat.textContent = `${r.category}目录 档案图像`;
    dCap.textContent = `${r.id} ${r.category}纹样`;
    dDl.href = r.image;
    dDl.setAttribute('download', r.id + '.png');
    dFields.innerHTML = `
      <div><dt>档案编号</dt><dd>${r.id}</dd></div>
      <div><dt>类别</dt><dd>${r.category}</dd></div>
      <div><dt>图像主色</dt><dd>${colorLabel[r.dominant] || r.dominant || '未分类'}</dd></div>
      <div><dt>来源</dt><dd>傣锦纹录 纹样图像档案</dd></div>
      <div><dt>浏览</dt><dd>查看原图，也可收藏或保存</dd></div>`;
    updateFav(r.id);
  }
  function openById(id) {
    const r = records.find(x => x.id === id);
    if (!r) return;
    dialogView = view.some(x => x.id === id) ? view.slice() : records.slice();
    currentIndex = dialogView.findIndex(x => x.id === id);
    renderRecord(r);
    if (!dialog.open) dialog.showModal();
  }
  function stepRecord(direction){
    if(!dialogView.length)return;
    currentIndex=(currentIndex+direction+dialogView.length)%dialogView.length;
    renderRecord(dialogView[currentIndex]);
  }
  $('#dialogClose').addEventListener('click', () => dialog.close());
  $('#dialogPrev').addEventListener('click', () => stepRecord(-1));
  $('#dialogNext').addEventListener('click', () => stepRecord(1));
  dialog.addEventListener('click', (e) => { if (e.target === dialog) dialog.close(); });
  document.addEventListener('keydown', (e) => {
    if (!dialog.open) return;
    if (e.key === 'ArrowLeft') { e.preventDefault(); stepRecord(-1); }
    if (e.key === 'ArrowRight') { e.preventDefault(); stepRecord(1); }
  });

  /* ---------- 收藏 / 本机账户 / 客服 / 回到顶部 ---------- */
  const favBtn = $('#dialogFav');
  const store = {
    user() { try { return JSON.parse(localStorage.getItem('dj_user')); } catch (e) { return null; } },
    setUser(v) { v ? localStorage.setItem('dj_user', JSON.stringify(v)) : localStorage.removeItem('dj_user'); },
    favs() { try { return JSON.parse(localStorage.getItem('dj_favs')) || []; } catch (e) { return []; } },
    setFavs(a) { localStorage.setItem('dj_favs', JSON.stringify(a)); }
  };
  let currentRecordId = null;
  function updateFav(id) {
    currentRecordId = id;
    if (!favBtn) return;
    const has = store.favs().includes(id);
    favBtn.textContent = has ? '已收藏' : '收藏';
    favBtn.setAttribute('aria-pressed', String(has));
  }
  if (favBtn) {
    favBtn.addEventListener('click', () => {
      if (!currentRecordId) return;
      const list = store.favs();
      const i = list.indexOf(currentRecordId);
      if (i >= 0) list.splice(i, 1); else list.unshift(currentRecordId);
      store.setFavs(list);
      updateFav(currentRecordId);
    });
  }

  const loginBtn = $('#loginBtn');
  const accountDialog = $('#accountDialog');
  const accountBody = $('#accountBody');
  const helpDialog = $('#helpDialog');

  function renderAccount() {
    const u = store.user();
    if (loginBtn) loginBtn.textContent = u ? '个人中心' : '登录';
    if (!accountBody) return;
    if (!u) {
      accountBody.innerHTML = `
        <p class="eyebrow">本机账户 LOCAL</p>
        <h2>登录</h2>
        <form class="acc-form" id="accForm">
          <div><label for="accName">昵称</label><input id="accName" name="name" maxlength="20" autocomplete="nickname" placeholder="例如：看锦的人"></div>
          <button class="btn btn--dark" type="submit">进入</button>
        </form>
        <p class="acc-note" style="margin-top:16px">昵称与收藏保存在当前浏览器中。</p>`;
      const form = $('#accForm');
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = ($('#accName').value || '').trim() || '本机访客';
        store.setUser({ name, at: Date.now() });
        renderAccount();
      });
    } else {
      const favs = store.favs();
      const rows = favs.map(id => {
        const r = records.find(x => x.id === id);
        return r ? `<button type="button" data-open="${r.id}">${r.id}<span>${r.category}</span></button>` : '';
      }).join('');
      accountBody.innerHTML = `
        <div class="acc-head"><div><p class="eyebrow">个人中心 PROFILE</p><h2 id="accountName"></h2></div><span class="acc-sub">本机账号</span></div>
        <p class="acc-note" style="margin-top:10px">收藏 ${favs.length} 幅 当前浏览器收藏</p>
        <div class="acc-list">${rows || '<p class="acc-note" style="padding:14px 0">还没有收藏。打开一幅纹样，点“收藏”。</p>'}</div>
        <div class="acc-actions">
          <button class="btn btn--dark" type="button" id="accLogout">退出登录</button>
          <button class="btn btn--ghost btn--dark-text" type="button" id="accClear">清除本机数据</button>
        </div>`;
      $('#accountName').textContent=u.name;
      $$('[data-open]', accountBody).forEach(b => b.addEventListener('click', () => {
        accountDialog.close(); openById(b.dataset.open);
      }));
      $('#accLogout').addEventListener('click', () => { store.setUser(null); renderAccount(); });
      $('#accClear').addEventListener('click', () => {
        localStorage.removeItem('dj_favs'); localStorage.removeItem('dj_user');
        renderAccount();
      });
    }
  }
  if (loginBtn && accountDialog) {
    loginBtn.addEventListener('click', () => { renderAccount(); accountDialog.showModal(); });
    renderAccount();
  }
  $('#helpBtn')?.addEventListener('click', () => helpDialog.showModal());
  $$('[data-close]').forEach(b => b.addEventListener('click', () => b.closest('dialog').close()));
  [accountDialog, helpDialog].forEach(d => d && d.addEventListener('click', (e) => { if (e.target === d) d.close(); }));

  const toTop = $('#toTop');
  if (toTop) {
    toTop.addEventListener('click', () => scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' }));
    addEventListener('scroll', () => toTop.classList.toggle('show', scrollY > 600), { passive: true });
  }

  /* 图谱与转译与师承交互分别由 motion/ 中的模块初始化。 */

  /* ---------- 传承人物 ---------- */
  const track = $('#peopleTrack');
  if (track && SITE.people) {
    const people = SITE.people.filter(p => p.type === 'person');
    const rels = SITE.relations || [];
    track.innerHTML = people.map((p, i) => {
      const learn = rels.find(e => e.t === p.id && e.type === 'learning');
      const teach = rels.find(e => e.s === p.id && (e.type === 'apprenticeship' || e.type === 'workshop_teaching'));
      const line = learn && teach
        ? `${learn.label}，${teach.type === 'apprenticeship' ? '后授徒传承' : '后受聘授课'}`
        : learn?.label || teach?.label || '织锦人物';
      const shortRegion = (p.region || '').split('；')[0].replace(/（.*?）/g, '').trim();
      const wm = ['DJ-GEO-005','DJ-BOT-003','DJ-ANI-002','DJ-ARC-002','DJ-TXT-002','DJ-GEO-019','DJ-BOT-013'][i % 7];
      return `<article class="flow-person" style="--wm:url('assets/thumbs/${wm}.webp')">
        <p class="fp-no">${String(i + 1).padStart(2, '0')} / ${shortRegion ? shortRegion : '人物记录'}</p>
        <h3>${p.label}</h3>
        <p class="fp-rel">${line}</p>
        <p class="body">${p.summary}</p>
        ${p.age ? `<p class="fp-age">${p.age} 岁开始学艺</p>` : ''}
      </article>`;
    }).join('');
  }

  const tl = $('#timeline');
  if (tl && SITE.timeline) {
    tl.innerHTML = SITE.timeline.map(t => `
      <li>
        <time datetime="${t.date}">${t.date.slice(0, 4)}.${t.date.slice(5, 7)}</time>
        <div><h4>${t.title}</h4><p>${t.summary}</p></div>
      </li>`).join('');
  }

  /* ---------- 资料来源 ---------- */
  const srcBox = $('#footSources');
  if (srcBox && SITE.sources) {
    const all = SITE.sources;
    const render = (list) => list.map(s => `<a href="${s.url}" target="_blank" rel="noreferrer">${s.title}</a>`).join('');
    srcBox.innerHTML = render(all.slice(0, 5)) + (all.length > 5 ? `<button type="button" class="src-more" id="srcMore">全部 ${all.length} 条</button>` : '');
    const more = $('#srcMore');
    if (more) more.addEventListener('click', () => { srcBox.innerHTML = render(all); });
    const cnt = $('#footSrcCount');
    if (cnt) cnt.textContent = all.length + ' 条';
  }

  /* ---------- 章节点入场的小节奏 ---------- */
  if (!reduced && !isStatic) {
    const heroCopy = $('.hero-copy');
    if (heroCopy) {
      heroCopy.animate(
        [{ opacity: 0, transform: 'translateY(18px)' }, { opacity: 1, transform: 'none' }],
        { duration: 1000, easing: 'cubic-bezier(.16,1,.3,1)', fill: 'both' }
      );
    }
  }
})();
