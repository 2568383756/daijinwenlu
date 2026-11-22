/* Branded PNG framing for the pattern studio.
   Artwork is copied at native resolution. No external images are loaded. */
(function () {
  'use strict';
  const COLORS = {paper:'#F5F1E6',jade:'#214C43',gold:'#C6A35B',rust:'#B46152',muted:'#6B7A6C'};
  const serifFallback='"Noto Serif SC","Source Han Serif SC","Songti SC",STSong,SimSun,serif';
  const sansFallback='"PingFang SC","Microsoft YaHei","Helvetica Neue",Arial,sans-serif';
  function family(selector,fallback) {
    try { return getComputedStyle(document.querySelector(selector)||document.body).fontFamily||fallback; }
    catch (_) { return fallback; }
  }
  const fonts={brand:family('.brand-text',serifFallback),seal:family('.brand-seal',serifFallback),detail:family('.brand-text em',sansFallback)};

  function getDimensions(source) {
    const w=Math.floor(Number(source?.width)),h=Math.floor(Number(source?.height));
    if(!Number.isFinite(w)||!Number.isFinite(h)||w<1||h<1)throw new TypeError('A non-empty source canvas is required');
    const scale=Math.min(w,h)/1600,portrait=h/w>1.5;
    const margin=Math.max(8,Math.round(96*scale));
    const footerHeight=Math.max(30,Math.round((portrait?300:208)*scale));
    return {width:w+margin*2,height:h+margin*2+footerHeight,scale,portrait,margin,footerHeight,
      artwork:{x:margin,y:margin,width:w,height:h},
      footer:{x:margin,y:margin+h,width:w,height:footerHeight}};
  }
  function dateTime(value) {
    const date=value instanceof Date&&Number.isFinite(value.getTime())?new Date(value.getTime()):new Date();
    let parts;
    try {
      parts=Object.fromEntries(new Intl.DateTimeFormat('en-GB',{
        timeZone:'Asia/Shanghai',year:'numeric',month:'2-digit',day:'2-digit',
        hour:'2-digit',minute:'2-digit',hourCycle:'h23'
      }).formatToParts(date).filter(p=>p.type!=='literal').map(p=>[p.type,p.value]));
    } catch (_) {
      const local=new Date(date.getTime()+8*60*60*1000),pad=n=>String(n).padStart(2,'0');
      parts={year:String(local.getUTCFullYear()),month:pad(local.getUTCMonth()+1),day:pad(local.getUTCDate()),hour:pad(local.getUTCHours()),minute:pad(local.getUTCMinutes())};
    }
    return parts.year+'.'+parts.month+'.'+parts.day+' '+parts.hour+':'+parts.minute;
  }
  function trackedWidth(ctx,text,gap) {
    const glyphs=Array.from(text);
    return glyphs.reduce((sum,glyph)=>sum+ctx.measureText(glyph).width,0)+Math.max(0,glyphs.length-1)*gap;
  }
  function trackedText(ctx,text,x,y,gap) {
    for(const glyph of Array.from(text)) {
      ctx.fillText(glyph,x,y);
      x+=ctx.measureText(glyph).width+gap;
    }
  }
  function roundedRect(ctx,x,y,w,h,r) {
    ctx.beginPath();ctx.moveTo(x+r,y);ctx.lineTo(x+w-r,y);ctx.quadraticCurveTo(x+w,y,x+w,y+r);
    ctx.lineTo(x+w,y+h-r);ctx.quadraticCurveTo(x+w,y+h,x+w-r,y+h);
    ctx.lineTo(x+r,y+h);ctx.quadraticCurveTo(x,y+h,x,y+h-r);
    ctx.lineTo(x,y+r);ctx.quadraticCurveTo(x,y,x+r,y);ctx.closePath();
  }
  function brandDimensions(ctx,scale,portrait) {
    const size=(portrait?60:48)*scale,gap=(portrait?8:7)*scale;
    const seal=(portrait?84:76)*scale,space=24*scale;
    ctx.font=size+'px '+fonts.brand;
    const titleWidth=trackedWidth(ctx,'傣锦纹录',gap);
    ctx.font=(portrait?22:18)*scale+'px '+fonts.detail;
    const subtitleWidth=trackedWidth(ctx,'DAI BROCADE ARCHIVE',1.7*scale);
    return {size,gap,seal,space,width:seal+space+Math.max(titleWidth,subtitleWidth)};
  }
  function drawBrand(ctx,x,cy,scale,portrait) {
    const b=brandDimensions(ctx,scale,portrait),top=cy-b.seal/2;
    ctx.fillStyle=COLORS.rust;
    roundedRect(ctx,x,top,b.seal,b.seal,Math.max(1,3*scale));ctx.fill();
    ctx.fillStyle='#F7EEDC';ctx.font='700 '+b.seal*.55+'px '+fonts.seal;
    ctx.textBaseline='middle';ctx.textAlign='center';
    ctx.fillText('傣',x+b.seal/2,cy+b.seal*.025);
    ctx.textAlign='left';ctx.fillStyle=COLORS.jade;ctx.font=b.size+'px '+fonts.brand;
    trackedText(ctx,'傣锦纹录',x+b.seal+b.space,cy-12*scale,b.gap);
    ctx.fillStyle=COLORS.muted;ctx.font=(portrait?22:18)*scale+'px '+fonts.detail;
    trackedText(ctx,'DAI BROCADE ARCHIVE',x+b.seal+b.space,cy+27*scale,1.7*scale);
  }
  function cutPerforations(ctx,width,height,scale) {
    const radius=Math.max(1,5*scale),pitch=Math.max(6,23*scale);
    ctx.save();ctx.globalCompositeOperation='destination-out';
    ctx.beginPath();
    const horizontal=Math.max(1,Math.floor(width/pitch)-1),vertical=Math.max(1,Math.floor(height/pitch)-1);
    for(let i=1;i<=horizontal;i++) {
      const x=i*width/(horizontal+1);
      ctx.moveTo(x+radius,0);ctx.arc(x,0,radius,0,Math.PI*2);
      ctx.moveTo(x+radius,height);ctx.arc(x,height,radius,0,Math.PI*2);
    }
    for(let i=1;i<=vertical;i++) {
      const y=i*height/(vertical+1);
      ctx.moveTo(radius,y);ctx.arc(0,y,radius,0,Math.PI*2);
      ctx.moveTo(width+radius,y);ctx.arc(width,y,radius,0,Math.PI*2);
    }
    ctx.fill();ctx.restore();
  }
  function render(source,options={}) {
    const size=getDimensions(source),{scale,artwork:a,footer:f,portrait}=size;
    const canvas=document.createElement('canvas');
    canvas.width=size.width;canvas.height=size.height;
    const ctx=canvas.getContext('2d');
    if(!ctx)throw new Error('Canvas 2D is unavailable');
    const stamp=dateTime(options.date);
    ctx.fillStyle=COLORS.paper;ctx.fillRect(0,0,canvas.width,canvas.height);
    const outer=Math.max(3,18*scale),inner=Math.max(1,7*scale);
    ctx.lineWidth=Math.max(1,2*scale);ctx.strokeStyle=COLORS.gold;
    ctx.strokeRect(a.x-outer,a.y-outer,a.width+outer*2,a.height+outer*2);
    ctx.lineWidth=Math.max(.75,1.1*scale);ctx.strokeStyle='#214C4359';
    ctx.strokeRect(a.x-inner,a.y-inner,a.width+inner*2,a.height+inner*2);
    // Clearing first also preserves transparent artwork pixels at the exact native offset.
    ctx.clearRect(a.x,a.y,a.width,a.height);
    ctx.imageSmoothingEnabled=false;ctx.drawImage(source,a.x,a.y);
    ctx.imageSmoothingEnabled=true;
    if(portrait) {
      const brand=brandDimensions(ctx,scale,true);
      drawBrand(ctx,f.x+(f.width-brand.width)/2,f.y+105*scale,scale,true);
      ctx.font=34*scale+'px '+fonts.detail;ctx.fillStyle=COLORS.muted;
      ctx.textAlign='center';ctx.textBaseline='middle';
      ctx.fillText(stamp,f.x+f.width/2,f.y+235*scale);
    } else {
      const typeScale=Math.min(a.width/1600,scale*2);
      drawBrand(ctx,f.x+12*scale,f.y+110*scale,typeScale,false);
      ctx.font=30*typeScale+'px '+fonts.detail;ctx.fillStyle=COLORS.muted;
      ctx.textAlign='right';ctx.textBaseline='middle';
      ctx.fillText(stamp,f.x+f.width-12*scale,f.y+110*scale);
    }
    cutPerforations(ctx,canvas.width,canvas.height,scale);
    canvas.dataset.generatedAt=stamp;canvas.dataset.timeZone='Asia/Shanghai';
    return canvas;
  }
  const ready=(async()=>{
    if(!document.fonts?.load)return true;
    try {
      const requested=Promise.allSettled([
        document.fonts.load('48px '+fonts.brand,'傣锦纹录'),
        document.fonts.load('700 42px '+fonts.seal,'傣'),
        document.fonts.load('30px '+fonts.detail,'2026.10.24 12:00 DAI BROCADE ARCHIVE')
      ]);
      let timer;
      await Promise.race([requested,new Promise(resolve=>{timer=setTimeout(resolve,1600);})]);
      clearTimeout(timer);
    } catch (_) { /* System font fallbacks remain available offline. */ }
    return true;
  })();
  window.DaijinStudioExport={ready,render,getDimensions,formatDateTime:dateTime};
})();

