(function(){
  'use strict';
  const anchor=document.querySelector('#people .timeline-wrap');
  if(!anchor||document.getElementById('researchGallery'))return;
  const photos=[
    {id:'weaving',title:'织机上的日常',alt:'织锦者在木织机前操作经线',position:'50% 48%',width:960,height:640},
    {id:'loom',title:'木织机近景',alt:'木织机上的白色经线与木质构件',position:'50% 50%',width:960,height:640},
    {id:'threads',title:'彩线与竹篮',alt:'竹篮里插放着缠有彩线的竹签',position:'42% 50%',width:960,height:640},
    {id:'artisan',title:'穿梭之间',alt:'年长织锦者俯身专注织造的现场',position:'34% 50%',width:960,height:640},
    {id:'textiles',title:'织物的细部',alt:'悬挂织物上的不同颜色与图案',position:'53% 50%',width:960,height:640},
    {id:'reading',title:'看锦与识纹',alt:'双手展开织物查看织锦纹样',position:'50% 50%',width:960,height:640},
    {id:'collection',title:'满架锦色',alt:'展架上陈列的多种傣锦织物',position:'50% 50%',width:960,height:640},
    {id:'everyday',title:'锦纹入日常',alt:'肩背包上缝制的黑白几何锦面',position:'50% 68%',width:788,height:919}
  ];
  const host=document.createElement('section');
  host.id='researchGallery';host.className='research-gallery';
  host.setAttribute('aria-labelledby','researchGalleryTitle');host.setAttribute('aria-roledescription','轮播');
  const arrow=direction=>`<svg viewBox="0 0 24 24" aria-hidden="true"><path d="${direction<0?'M15 5l-7 7 7 7':'M9 5l7 7-7 7'}"/></svg>`;
  host.innerHTML=`
    <div class="rg-heading">
      <div><h3 id="researchGalleryTitle">调研影像</h3><p>走近织机与织锦者，记录手艺的日常。</p></div>
      <div class="rg-controls" aria-label="调研照片轮播控制">
        <button type="button" class="rg-arrow" data-research-action="prev" aria-label="上一组调研照片" aria-controls="researchGalleryTrack">${arrow(-1)}</button>
        <button type="button" class="rg-arrow" data-research-action="next" aria-label="下一组调研照片" aria-controls="researchGalleryTrack">${arrow(1)}</button>
      </div>
    </div>
    <div class="rg-track" id="researchGalleryTrack" tabindex="0" role="group" aria-label="调研照片，可左右滑动或使用方向键浏览">
      ${photos.map((p,i)=>`<figure class="rg-card" role="group" aria-roledescription="照片" aria-label="第 ${i+1} 张，共 ${photos.length} 张 ${p.title}"><div class="rg-photo"><img src="assets/research-gallery/${p.id}-960.webp" srcset="assets/research-gallery/${p.id}-480.webp 480w, assets/research-gallery/${p.id}-960.webp ${p.width}w" sizes="(max-width: 740px) 82vw, (max-width: 1100px) 44vw, 30vw" width="${p.width}" height="${p.height}" alt="${p.alt}" loading="lazy" decoding="async" style="object-position:${p.position}"></div><figcaption>${p.title}</figcaption></figure>`).join('')}
    </div>
    <div class="rg-footer"><div class="rg-pages" role="group" aria-label="选择调研照片组"></div><p class="rg-status" aria-live="off" aria-atomic="true"></p></div>`;
  anchor.before(host);
  const track=host.querySelector('.rg-track'),cards=[...host.querySelectorAll('.rg-card')];
  const pages=host.querySelector('.rg-pages'),status=host.querySelector('.rg-status');
  const prev=host.querySelector('[data-research-action="prev"]'),next=host.querySelector('[data-research-action="next"]');
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  let positions=[0],index=0,visible=false,hovered=false,focused=false,userPaused=false,timer=0,scrollTimer=0,resizeFrame=0;
  const canPlay=()=>visible&&!document.hidden&&!hovered&&!focused&&!userPaused&&!reduced.matches&&positions.length>1;
  function schedule(){
    clearTimeout(timer);timer=0;
    if(canPlay())timer=setTimeout(()=>{timer=0;go(index===positions.length-1?0:index+1,false);schedule();},6000);
  }
  function updateControls(){
    prev.disabled=index===0;next.disabled=index===positions.length-1;
    status.setAttribute('aria-live',userPaused||reduced.matches?'polite':'off');
    [...pages.children].forEach((b,i)=>{b.setAttribute('aria-current',i===index?'true':'false');});
    const r=track.getBoundingClientRect(),shown=cards.map((c,i)=>({i,r:c.getBoundingClientRect()})).filter(c=>c.r.right>r.left+3&&c.r.left<r.right-3);
    status.textContent=shown.length?`第 ${shown[0].i+1} 至 ${shown[shown.length-1].i+1} 张，共 ${photos.length} 张`:`共 ${photos.length} 张`;
  }
  function pause(){userPaused=true;updateControls();schedule();}
  function go(target,manual=true){
    if(manual)pause();index=Math.max(0,Math.min(positions.length-1,target));
    track.scrollTo({left:positions[index],behavior:reduced.matches?'instant':'smooth'});
    updateControls();
  }
  function measure(){
    resizeFrame=0;
    const max=Math.max(0,track.scrollWidth-track.clientWidth),left=track.getBoundingClientRect().left;
    positions=[];
    cards.forEach(card=>{const x=Math.max(0,Math.min(max,Math.round(card.getBoundingClientRect().left-left+track.scrollLeft)));if(!positions.length||Math.abs(x-positions[positions.length-1])>2)positions.push(x);});
    if(!positions.length)positions=[0];
    pages.innerHTML=positions.map((x,i)=>`<button type="button" data-research-page="${i}" aria-label="查看第 ${i+1} 组调研照片" aria-controls="researchGalleryTrack"><span aria-hidden="true"></span></button>`).join('');
    index=positions.reduce((nearest,x,i)=>Math.abs(x-track.scrollLeft)<Math.abs(positions[nearest]-track.scrollLeft)?i:nearest,0);
    updateControls();schedule();
  }
  host.addEventListener('click',event=>{
    const button=event.target.closest('button');if(!button||button.disabled)return;
    if(button.hasAttribute('data-research-page'))go(+button.dataset.researchPage);
    switch(button.dataset.researchAction){
      case 'prev':go(index-1);break;
      case 'next':go(index+1);break;
    }
  });
  track.addEventListener('pointerdown',pause,{passive:true});
  track.addEventListener('wheel',pause,{passive:true});
  track.addEventListener('keydown',event=>{
    if(!['ArrowLeft','ArrowRight','Home','End'].includes(event.key))return;
    event.preventDefault();go(event.key==='Home'?0:event.key==='End'?positions.length-1:index+(event.key==='ArrowRight'?1:-1));
  });
  track.addEventListener('scroll',()=>{
    clearTimeout(scrollTimer);scrollTimer=setTimeout(()=>{index=positions.reduce((nearest,x,i)=>Math.abs(x-track.scrollLeft)<Math.abs(positions[nearest]-track.scrollLeft)?i:nearest,0);updateControls();},100);
  },{passive:true});
  host.addEventListener('pointerenter',event=>{if(event.pointerType==='mouse'){hovered=true;schedule();}});
  host.addEventListener('pointerleave',()=>{hovered=false;schedule();});
  host.addEventListener('focusin',()=>{focused=true;schedule();});
  host.addEventListener('focusout',()=>{queueMicrotask(()=>{focused=host.contains(document.activeElement);schedule();});});
  document.addEventListener('visibilitychange',schedule);
  reduced.addEventListener('change',()=>{updateControls();schedule();});
  new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;schedule();},{threshold:.25}).observe(track);
  new ResizeObserver(()=>{if(!resizeFrame)resizeFrame=requestAnimationFrame(measure);}).observe(track);
  measure();
  window.DaijinResearchGallery={
    goTo:index=>go(index),pause,
    play:()=>{userPaused=false;updateControls();schedule();},
    getState:()=>({index,groups:positions.length,photos:photos.length,visible,paused:userPaused,reduced:reduced.matches,playing:!!timer,hovered,focused})
  };
  window.dispatchEvent(new Event('daijin:research-ready'));
})();
