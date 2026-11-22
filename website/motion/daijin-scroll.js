/* 傣锦纹录 原生 SVG 双轴卷舒组件。无运行依赖。 */
(function (global) {
  'use strict';
  const NS = 'http://www.w3.org/2000/svg';
  const ids = ['DJ-GEO-003','DJ-GEO-015','DJ-GEO-016','DJ-GEO-019','DJ-GEO-007','DJ-GEO-021','DJ-GEO-034','DJ-GEO-033','DJ-GEO-024'];
  const sourceViews = [
    {size:[315,420],roi:[0,0,315,420]},
    {size:[420,315],roi:[4,20,412,276]},
    {size:[420,187],roi:[0,0,420,187]},
    {size:[236,420],roi:[0,0,236,420]},
    {size:[420,236],roi:[12,18,390,204]},
    {size:[420,236],roi:[3,28,414,188]},
    {size:[295,420],roi:[0,0,295,420]},
    {size:[280,420],roi:[0,0,280,420]},
    {size:[236,420],roi:[0,0,236,420]}
  ];
  let serial = 0;
  const safe = s => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const clamp = p => Math.max(0, Math.min(1, Number.isFinite(Number(p)) ? Number(p) : 0));
  function mount(target, options = {}) {
    const host = typeof target === 'string' ? document.querySelector(target) : target;
    if (!host) throw new TypeError('DaijinScroll.mount 需要一个有效容器。');
    const uid = 'djscroll-' + (++serial), base = options.assetBase || './assets/';
    const patterns = (options.patterns?.length ? options.patterns : ids.map((id,i) => ({ id, src: base.replace(/\/?$/, '/') + id + '.png', ...sourceViews[i] }))).slice(0,12);
    const duration = Math.max(0, Number(options.duration ?? 2200));
    const media = matchMedia('(prefers-reduced-motion: reduce)');
    let progress = clamp(options.progress ?? 0), raf = 0, disposed = false, animationToken = 0, pendingResolve = null, targetEnd = progress;
    let activeFrame = null, lastFrameTime = null;
    const bounds = host.getBoundingClientRect();
    let visible = bounds.bottom > 0 && bounds.top < innerHeight && bounds.width > 0 && bounds.height > 0;
    const original = host.innerHTML;
    const key = x => uid + '-' + x;
    const tileWidth=936/patterns.length;
    const panelPatterns=patterns.map((a,i)=>{
      const size=a.size||[420,420],roi=a.roi||[0,0,...size],tileHeight=tileWidth*roi[3]/roi[2];
      return `<pattern id="${key('panel-'+i)}" patternUnits="userSpaceOnUse" x="${132+i*tileWidth}" y="110" width="${tileWidth}" height="${tileHeight}"><svg x="0" y="0" width="${tileWidth}" height="${tileHeight}" viewBox="${roi.join(' ')}" preserveAspectRatio="xMidYMid slice" overflow="hidden"><image href="${safe(a.src)}" x="0" y="0" width="${size[0]}" height="${size[1]}" preserveAspectRatio="xMidYMid slice"><title>${safe(a.id||'纹样样本')}，原色局部重复铺陈</title></image></svg></pattern>`;
    }).join('');
    const panels = patterns.map((a, i) => {
      const x = 132+i*tileWidth;
      return `<g><rect x="${x}" y="110" width="${tileWidth+.5}" height="410" fill="url(#${key('panel-'+i)})"/><path d="M${x} 110V520" stroke="#b79753" stroke-width="1"/></g>`;
    }).join('');
    function roller(side) {
      return `<g data-roller="${side}"><ellipse cx="0" cy="482" rx="51" ry="11" fill="#071f1a" opacity=".18"/>
        <path d="M-30 228 Q-30 201 0 201 Q30 201 30 228 L30 445 Q30 469 0 469 Q-30 469-30 445Z" fill="url(#${key('wood')})" stroke="#997b42" stroke-width="2"/>
        <path d="M-20 231 Q-20 215 0 215 Q20 215 20 231V434Q20 453 0 453Q-20 453-20 434Z" fill="#224c40"/>
        <path d="M-14 238V426M-7 228V433M5 226V435M15 237V423" stroke="#44715b" stroke-width="1.2" opacity=".5"/>
        <rect x="-34" y="220" width="68" height="8" rx="4" fill="#c6a35b"/><rect x="-34" y="433" width="68" height="8" rx="4" fill="#c6a35b"/>
        <ellipse cx="0" cy="446" rx="31" ry="23" fill="url(#${key('end')})" stroke="#d6bb79" stroke-width="2"/>
        <ellipse cx="0" cy="446" rx="21" ry="15" fill="none" stroke="#725e35" stroke-width="1.3"/><ellipse cx="0" cy="446" rx="11" ry="8" fill="none" stroke="#725e35"/>
        <path data-spoke d="M-20 446H20M0 431V461" stroke="#8e743f" stroke-width="1" opacity=".7"/>
        <path d="M-29 227V432" stroke="#ead69c" stroke-width="2" opacity=".65"/>
      </g>`;
    }
    host.classList.add('dj-scroll');
    host.innerHTML = `<div class="dj-scroll-stage">
      <svg class="dj-scroll-svg" viewBox="0 0 1200 580" role="img" aria-labelledby="${key('title')} ${key('desc')}" xmlns="${NS}">
        <title id="${key('title')}">${safe(options.title || '傣锦纹样双轴长卷')}</title>
        <desc id="${key('desc')}">点击展开，深绿木轴向两侧移动，呈现由${patterns.length}张真实档案纹样密铺拼接的拱形长卷。各纵幅取原色局部重复铺陈，此处为装饰展示，不表示历史上的整幅织物。</desc>
        <defs>${panelPatterns}
          <linearGradient id="${key('wood')}" x1="0" x2="1"><stop stop-color="#102b24"/><stop offset=".38" stop-color="#3a6653"/><stop offset=".67" stop-color="#193d32"/><stop offset="1" stop-color="#102b24"/></linearGradient>
          <radialGradient id="${key('end')}"><stop stop-color="#e5cc8d"/><stop offset=".7" stop-color="#c6a35b"/><stop offset="1" stop-color="#9c7c42"/></radialGradient>
          <clipPath id="${key('clip')}" clipPathUnits="userSpaceOnUse"><path data-band-clip/></clipPath>
        </defs>
        <path data-shadow fill="#142f27" opacity=".12"/>
        <path data-back fill="#1d4437" stroke="#b99b60" stroke-width="2"/>
        <g clip-path="url(#${key('clip')})">
          <rect x="110" y="115" width="980" height="390" fill="#f4ecd6"/>${panels}
        </g>
        <path data-top-edge fill="none" stroke="#c6a35b" stroke-width="5"/>
        <path data-bottom-edge fill="none" stroke="#c6a35b" stroke-width="5"/>
        <path data-inner-line fill="none" stroke="#f3dfaa" stroke-width="1"/>
        <path data-curl="left" fill="#ded3ae" stroke="#b09255" stroke-width="1.5"/>
        <path data-curl="right" fill="#ded3ae" stroke="#b09255" stroke-width="1.5"/>
        ${roller('left')}${roller('right')}
        <g data-seal><path d="M584 248H616V407L600 420L584 407Z" fill="#c6a35b" stroke="#ebd69b" stroke-width="1"/><path d="M590 262H610M590 267H610M590 390H610M590 395H610" stroke="#715a2d"/><text x="600" y="300" fill="#214c3d" font-family="STSong,SimSun,serif" font-size="20" text-anchor="middle">傣</text><text x="600" y="330" fill="#214c3d" font-family="STSong,SimSun,serif" font-size="20" text-anchor="middle">锦</text><text x="600" y="360" fill="#214c3d" font-family="STSong,SimSun,serif" font-size="20" text-anchor="middle">卷</text></g>
      </svg>
      <span class="dj-scroll-state" aria-hidden="true">封卷待启</span>
    </div>
    ${options.controls === false ? '' : `<div class="dj-scroll-controls" role="group" aria-label="卷轴控制"><button type="button" data-action="play">展卷观锦</button><button type="button" data-action="close">收卷</button><button type="button" data-action="replay">重播</button><label class="dj-scroll-range">卷舒进度<input type="range" min="0" max="100" step="1" value="${Math.round(progress*100)}" aria-label="卷轴展开进度"><output>0%</output></label></div>`}
    <span class="dj-scroll-live" role="status" aria-live="polite"></span>`;
    const $ = selector => host.querySelector(selector);
    const svg = $('.dj-scroll-svg'), input = $('input'), output = $('output'), live = $('.dj-scroll-live');
    const left = $('[data-roller="left"]'), right = $('[data-roller="right"]'), seal = $('[data-seal]');
    const leftSpoke = left.querySelector('[data-spoke]'), rightSpoke = right.querySelector('[data-spoke]');
    const leftCurl = $('[data-curl="left"]'), rightCurl = $('[data-curl="right"]'), stateLabel = $('.dj-scroll-state');
    const nodes = Object.fromEntries(['band-clip','back','shadow','top-edge','bottom-edge','inner-line'].map(n => [n, $('[data-'+n+']')]));
    const setD = (n, d) => nodes[n].setAttribute('d', d);
    function draw(p) {
      progress = clamp(p);
      const spread = 31 + 419*progress, l = 600-spread, r = 600+spread;
      const arch = 5 + 127*progress, c1 = l+(r-l)*.29, c2 = r-(r-l)*.29;
      const top = `M${l} 260 C${c1} ${260-arch} ${c2} ${260-arch} ${r} 260`;
      const bottom = `M${l} 452 C${c1} ${452-arch} ${c2} ${452-arch} ${r} 452`;
      const band = `${top} L${r} 452 C${c2} ${452-arch} ${c1} ${452-arch} ${l} 452Z`;
      setD('band-clip',band);setD('top-edge',top);setD('bottom-edge',bottom);
      setD('back',`M${l-3} 257 C${c1} ${252-arch} ${c2} ${252-arch} ${r+3} 257L${r+3} 465 C${c2} ${466-arch} ${c1} ${466-arch} ${l-3} 465Z`);
      setD('shadow',`M${l-35} 481C${c1} ${490-arch} ${c2} ${490-arch} ${r+35} 481L${r+35} 493C${c2} ${508-arch} ${c1} ${508-arch} ${l-35} 493Z`);
      setD('inner-line',`M${l} 268 C${c1} ${268-arch} ${c2} ${268-arch} ${r} 268M${l} 445C${c1} ${445-arch} ${c2} ${445-arch} ${r} 445`);
      left.setAttribute('transform',`translate(${l-18},0)`);right.setAttribute('transform',`translate(${r+18},0)`);
      leftSpoke.setAttribute('transform',`rotate(${progress*360} 0 446)`);
      rightSpoke.setAttribute('transform',`rotate(${-progress*360} 0 446)`);
      leftCurl.setAttribute('d',`M${l+4} 260Q${l-7} 254 ${l-22} 252L${l-22} 444Q${l-8} 469 ${l+4} 452Z`);
      rightCurl.setAttribute('d',`M${r-4} 260Q${r+7} 254 ${r+22} 252L${r+22} 444Q${r+8} 469 ${r-4} 452Z`);
      seal.style.opacity = Math.max(0,1-progress*8);
      if(input)input.value = Math.round(progress*100);
      if(output)output.value = Math.round(progress*100)+'%';
      const label = progress===0 ? '封卷待启' : progress===1 ? '锦卷全览' : '锦卷徐展';
      if (stateLabel.textContent !== label) stateLabel.textContent = label;
      host.dataset.progress = progress.toFixed(4);
      if(typeof options.onProgress === 'function') options.onProgress(progress);
      host.dispatchEvent(new CustomEvent('daijin:progress',{detail:{progress}}));
    }
    function syncMotion() {
      if (disposed || !activeFrame) return;
      if (!visible || document.hidden) {
        cancelAnimationFrame(raf);raf=0;lastFrameTime=null;
      } else if (!raf) raf=requestAnimationFrame(activeFrame);
    }
    function stop() { animationToken++;cancelAnimationFrame(raf);raf=0;activeFrame=null;lastFrameTime=null;if(pendingResolve){const resolve=pendingResolve;pendingResolve=null;resolve(progress);} }
    function setProgress(value) { if(disposed)return;stop();draw(value); }
    function animateTo(end) {
      if(disposed)return Promise.resolve(progress);
      stop(); targetEnd=end; const token=animationToken, start=progress, span=duration*Math.abs(end-start);
      if(media.matches || span===0) { draw(end);live.textContent=end===1?'锦卷已全部展开':'锦卷已收起';return Promise.resolve(progress); }
      let elapsed = 0;
      return new Promise(resolve=> {
        pendingResolve=resolve;
        function frame(now) {
          raf=0;
          if(disposed || token!==animationToken){resolve(progress);return;}
          if(!visible || document.hidden){lastFrameTime=null;return;}
          if(lastFrameTime!==null)elapsed+=now-lastFrameTime;
          lastFrameTime=now;
          const t=Math.min(1,elapsed/span), eased=t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2;
          draw(start+(end-start)*eased);
          if(t<1)raf=requestAnimationFrame(frame); else {activeFrame=null;lastFrameTime=null;pendingResolve=null;live.textContent=end===1?'锦卷已全部展开':'锦卷已收起';resolve(progress);}
        }
        activeFrame=frame;syncMotion();
      });
    }
    const api = {
      setProgress,
      play: () => animateTo(1),
      close: () => animateTo(0),
      replay: () => {setProgress(0);return animateTo(1);},
      getProgress: () => progress,
      getSVG: () => new XMLSerializer().serializeToString(svg),
      destroy: () => {if(disposed)return;stop();disposed=true;host.removeEventListener('click',click);if(input)input.removeEventListener('input',scrub);media.removeEventListener('change',reduced);document.removeEventListener('visibilitychange',syncMotion);if(observer)observer.disconnect();host.innerHTML=original;host.classList.remove('dj-scroll');delete host.dataset.progress;}
    };
    function click(e) {const button=e.target.closest('[data-action]');if(!button||!host.contains(button))return;api[button.dataset.action]();}
    function scrub() {setProgress(Number(input.value)/100);}
    function reduced() {if(media.matches&&activeFrame){const end=targetEnd;stop();draw(end);}}
    host.addEventListener('click',click);if(input)input.addEventListener('input',scrub);media.addEventListener('change',reduced);
    const observer = typeof IntersectionObserver !== 'undefined' ? new IntersectionObserver(entries => {
      visible=entries[0].isIntersecting;syncMotion();
    }, {threshold:0}) : null;
    // Older browsers keep the short user-triggered animation available.
    if(observer)observer.observe(host);else visible=true;
    document.addEventListener('visibilitychange',syncMotion);
    draw(progress);return api;
  }
  global.DaijinScroll = { mount, patternIds: ids.slice(), version: '1.0.0' };
})(window);
