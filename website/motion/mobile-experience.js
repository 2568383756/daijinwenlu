(function(){
  'use strict';
  const head=document.getElementById('siteHead');
  if(!head)return;
  const toggle=document.createElement('button');
  toggle.className='mobile-menu-toggle';toggle.type='button';toggle.textContent='目录';
  toggle.setAttribute('aria-haspopup','dialog');toggle.setAttribute('aria-expanded','false');toggle.setAttribute('aria-controls','mobileChapters');
  head.insertBefore(toggle,head.querySelector('.head-progress'));
  const menu=document.createElement('dialog');menu.className='mobile-chapters';menu.id='mobileChapters';menu.setAttribute('aria-labelledby','mobileMenuTitle');
  const icons={scroll:'archive',region:'region',craft:'craft',archive:'archive',relations:'palette',translate:'translate',people:'heritage'};
  menu.innerHTML='<div class="mobile-menu-head"><strong id="mobileMenuTitle">傣锦纹录 目录</strong><button class="mobile-menu-close" type="button" aria-label="关闭目录">×</button></div><nav aria-label="手机章节导航"></nav><button class="mobile-menu-account" type="button">我的收藏与登录</button>';
  document.body.append(menu);
  // Prevent the page from moving behind a modal on touch screens.
  const modalObserver=new MutationObserver(syncModalState);
  document.querySelectorAll('dialog').forEach(dialog=>modalObserver.observe(dialog,{attributes:true,attributeFilter:['open']}));
  function syncModalState(){document.documentElement.classList.toggle('has-mobile-dialog',!!document.querySelector('dialog[open]'))}
  for(const original of head.querySelectorAll('.site-nav a')){
    const a=document.createElement('a');a.href=original.getAttribute('href');
    const img=document.createElement('img');img.src='assets/icons/'+icons[a.hash.slice(1)]+'.webp';img.alt='';img.width=54;img.height=54;
    a.append(img,document.createTextNode(original.textContent));menu.querySelector('nav').append(a);
  }
  toggle.addEventListener('click',()=>{
    const active=head.querySelector('.site-nav .is-active')?.getAttribute('href');
    menu.querySelectorAll('nav a').forEach(a=>a.getAttribute('href')===active?a.setAttribute('aria-current','location'):a.removeAttribute('aria-current'));
    menu.showModal();syncModalState();toggle.setAttribute('aria-expanded','true');
  });
  menu.addEventListener('close',()=>{toggle.setAttribute('aria-expanded','false');syncModalState()});
  menu.querySelector('.mobile-menu-close').addEventListener('click',()=>menu.close());
  menu.querySelectorAll('nav a').forEach(a=>a.addEventListener('click',()=>{menu.close();syncModalState()}));
  menu.querySelector('.mobile-menu-account').addEventListener('click',()=>{menu.close();document.getElementById('loginBtn').click()});
  menu.addEventListener('click',e=>{if(e.target===menu){const r=menu.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)menu.close()}});
  matchMedia('(min-width:1000px)').addEventListener('change',e=>{if(e.matches&&menu.open)menu.close()});
  // One scroll per navigation: native hash scrolling and the hashchange fallback
  // otherwise restart each other while the mobile layout is settling.
  document.addEventListener('click',event=>{
    const anchor=event.target.closest('a[href^="#"]');
    if(!anchor||!matchMedia('(max-width:999px)').matches)return;
    const hash=anchor.getAttribute('href'),target=document.getElementById(hash.slice(1));
    if(!target?.matches('main>section'))return;
    event.preventDefault();
    if(location.hash!==hash)history.pushState(null,'',hash);
    requestAnimationFrame(()=>{
      target.scrollIntoView({block:'start',behavior:matchMedia('(prefers-reduced-motion:reduce)').matches?'instant':'smooth'});
      const title=target.querySelector('h1,h2,.brush')||target;
      title.tabIndex=-1;title.focus({preventScroll:true});
    });
  });
  function studioShortcut(){
    const footer=document.querySelector('.studio-footer');if(!footer||footer.querySelector('.studio-preview-jump'))return;
    const b=document.createElement('button');b.className='studio-preview-jump';b.type='button';b.textContent='查看锦面';
    b.addEventListener('click',()=>document.querySelector('.studio-desk').scrollIntoView({block:'start',behavior:matchMedia('(prefers-reduced-motion:reduce)').matches?'instant':'smooth'}));footer.append(b);
  }
  if(document.readyState!=='complete')document.addEventListener('DOMContentLoaded',studioShortcut,{once:true});else studioShortcut();

  // Keep the next chapter within reach without removing any archive records.
  const grid=document.getElementById('archiveGrid');
  if(grid){
    const phone=matchMedia('(max-width:760px)');
    let visible=12;
    const more=document.createElement('div');more.className='mobile-archive-more';more.hidden=true;
    more.innerHTML='<button type="button" class="archive-expand">更多纹样</button><button type="button" class="archive-collapse" hidden>收起列表</button>';
    grid.after(more);
    const expand=more.querySelector('.archive-expand'),collapse=more.querySelector('.archive-collapse');
    function updateArchive(){
      const cells=[...grid.querySelectorAll('.p-cell')];
      cells.forEach((cell,i)=>cell.classList.toggle('mobile-archive-hidden',phone.matches&&i>=visible));
      more.hidden=!phone.matches||cells.length<=12;
      expand.hidden=visible>=cells.length;
      collapse.hidden=visible<=12;
    }
    expand.addEventListener('click',()=>{
      const next=grid.querySelectorAll('.p-cell')[visible];
      visible+=12;updateArchive();
      // Keyboard focus follows the newly revealed records; tapping stays in place.
      if(next)next.focus({preventScroll:true});
    });
    collapse.addEventListener('click',()=>{
      visible=12;updateArchive();
      grid.scrollIntoView({block:'start',behavior:'instant'});
    });
    new MutationObserver(()=>{visible=12;updateArchive()}).observe(grid,{childList:true});
    phone.addEventListener('change',updateArchive);
    updateArchive();
  }
})();
