(function(){
  'use strict';
  const header=document.getElementById('siteHead');
  function sizeHeader(){
    if(header)document.documentElement.style.setProperty('--site-header-height',header.getBoundingClientRect().height+'px');
  }
  if(header)new ResizeObserver(sizeHeader).observe(header);
  sizeHeader();
  // Scroll position, rather than observer delivery order, determines the active chapter.
  const links=[...document.querySelectorAll('.site-nav a')];
  const sections=links.map(a=>document.querySelector(a.getAttribute('href'))).filter(Boolean);
  let scheduled=false;
  function updateNav(){
    scheduled=false;
    const line=(header?.getBoundingClientRect().height||76)+Math.min(180,innerHeight*.22);
    let active=sections[0];
    for(const s of sections){if(s.getBoundingClientRect().top<=line)active=s;}
    links.forEach(a=>a.classList.toggle('is-active',a.getAttribute('href')==='#'+active?.id));
  }
  addEventListener('scroll',()=>{if(!scheduled){scheduled=true;requestAnimationFrame(updateNav)}},{passive:true});
  addEventListener('resize',updateNav);
  updateNav();
})();
