/* 傣锦纹录 全幅图谱。One measured SVG at a time; no external dependencies.
   Main-color records: data/gallery.js. Presence sets: image-analysis.json rev.2,
   2026-10-16, threshold >= 5% of effective chromatic pixels, stable-color only.
   Presence sets are embedded so the original file:// site remains fully offline. */
(function () {
  'use strict';
  const section = document.getElementById('relations');
  if (!section || !window.DAIJIN_GALLERY || section.dataset.atlasExperience) return;
  section.dataset.atlasExperience = '1';
  const PRESENCE = {"DJ-ANI-001":["orange_gold"],"DJ-ANI-002":["blue"],"DJ-ANI-003":["blue"],"DJ-ANI-004":["blue"],"DJ-ANI-005":[],"DJ-ANI-006":["blue"],"DJ-ANI-007":["red"],"DJ-ANI-008":["blue"],"DJ-ANI-009":["magenta"],"DJ-ANI-010":["teal"],"DJ-ANI-011":["red"],"DJ-ANI-012":["teal","blue"],"DJ-ANI-013":["red"],"DJ-ANI-014":["red","teal"],"DJ-ANI-015":["blue"],"DJ-ANI-016":["blue"],"DJ-ANI-017":["orange_gold"],"DJ-ANI-018":["red"],"DJ-ANI-019":["teal"],"DJ-ANI-020":["red"],"DJ-ANI-021":[],"DJ-ANI-022":["red","purple","magenta"],"DJ-ANI-023":["red","teal","magenta"],"DJ-ANI-024":["red","teal"],"DJ-ANI-025":["red","teal","magenta"],"DJ-ANI-026":["red","orange_gold","teal","blue"],"DJ-GEO-001":["blue"],"DJ-GEO-002":["red","teal","blue","purple","magenta"],"DJ-GEO-003":["red","yellow_green","purple","magenta"],"DJ-GEO-004":["red","blue"],"DJ-GEO-005":["red","yellow_green","blue"],"DJ-GEO-006":["teal"],"DJ-GEO-007":["red","orange_gold","teal","blue","purple","magenta"],"DJ-GEO-008":["orange_gold","blue"],"DJ-GEO-009":["red","yellow_green","teal","blue"],"DJ-GEO-010":["red"],"DJ-GEO-011":["red","orange_gold","blue","purple","magenta"],"DJ-GEO-012":["red","orange_gold","blue"],"DJ-GEO-013":["red","teal","blue","magenta"],"DJ-GEO-014":["blue"],"DJ-GEO-015":["red","orange_gold","blue","purple","magenta"],"DJ-GEO-016":["red","orange_gold","yellow_green","teal","blue","purple","magenta"],"DJ-GEO-017":["orange_gold","teal","blue","purple"],"DJ-GEO-018":[],"DJ-GEO-019":["red","blue"],"DJ-GEO-020":["red","orange_gold","yellow_green","blue","magenta"],"DJ-GEO-021":["red","yellow_green","teal","blue","purple","magenta"],"DJ-GEO-022":["red","orange_gold","blue","purple","magenta"],"DJ-GEO-023":["red","yellow_green","teal","magenta"],"DJ-GEO-024":["red","orange_gold","blue"],"DJ-GEO-025":["red","orange_gold","blue","purple","magenta"],"DJ-GEO-026":["red","teal","blue"],"DJ-GEO-027":["red","teal","blue"],"DJ-GEO-028":["red","teal","blue"],"DJ-GEO-029":["red","teal","blue","purple"],"DJ-GEO-030":["blue","magenta"],"DJ-GEO-031":["red","orange_gold","yellow_green","teal"],"DJ-GEO-032":["red"],"DJ-GEO-033":["red","blue"],"DJ-GEO-034":["red","orange_gold","teal","blue","purple"],"DJ-GEO-035":[],"DJ-GEO-036":[],"DJ-GEO-037":["red"],"DJ-GEO-038":["red","orange_gold"],"DJ-GEO-039":["magenta"],"DJ-GEO-040":["red","yellow_green"],"DJ-GEO-041":["orange_gold","yellow_green"],"DJ-GEO-042":["red"],"DJ-GEO-043":["red","magenta"],"DJ-GEO-044":["orange_gold"],"DJ-GEO-045":["red","teal"],"DJ-GEO-046":["teal"],"DJ-GEO-047":["red"],"DJ-GEO-048":["red"],"DJ-GEO-049":["red"],"DJ-GEO-050":[],"DJ-GEO-051":["red"],"DJ-GEO-052":["red"],"DJ-GEO-053":["red"],"DJ-GEO-054":["red"],"DJ-GEO-055":["red"],"DJ-GEO-056":["red"],"DJ-GEO-057":[],"DJ-GEO-058":["orange_gold"],"DJ-GEO-059":["red","orange_gold","teal"],"DJ-GEO-060":["orange_gold","teal"],"DJ-GEO-061":["red","orange_gold"],"DJ-GEO-062":["red","magenta"],"DJ-GEO-063":["red","teal"],"DJ-GEO-064":["red","orange_gold"],"DJ-GEO-065":["red","orange_gold"],"DJ-GEO-066":["red","orange_gold"],"DJ-GEO-067":["red","orange_gold"],"DJ-BOT-001":["magenta"],"DJ-BOT-002":["red","purple"],"DJ-BOT-003":["red","magenta"],"DJ-BOT-004":["blue","magenta"],"DJ-BOT-005":["blue","magenta"],"DJ-BOT-006":["blue","magenta"],"DJ-BOT-007":["red","orange_gold","teal","blue"],"DJ-BOT-008":["red","teal","blue"],"DJ-BOT-009":["orange_gold"],"DJ-BOT-010":["red","orange_gold"],"DJ-BOT-011":["orange_gold"],"DJ-BOT-012":["red","blue"],"DJ-BOT-013":["blue"],"DJ-BOT-014":["purple"],"DJ-BOT-015":["red"],"DJ-BOT-016":["red"],"DJ-BOT-017":["yellow_green","teal"],"DJ-BOT-018":[],"DJ-BOT-019":["red"],"DJ-BOT-020":["red"],"DJ-BOT-021":["red"],"DJ-BOT-022":["red"],"DJ-BOT-023":["red"],"DJ-BOT-024":[],"DJ-BOT-025":["orange_gold"],"DJ-BOT-026":["red"],"DJ-BOT-027":["red"],"DJ-BOT-028":["red","yellow_green","teal"],"DJ-BOT-029":["orange_gold","blue"],"DJ-ARC-001":["red"],"DJ-ARC-002":["red"],"DJ-ARC-003":["red"],"DJ-ARC-004":["red"],"DJ-ARC-005":[],"DJ-TXT-001":[],"DJ-TXT-002":["red","yellow_green","teal"],"DJ-TXT-003":["red"]};
  const CAT = [
    {id:'几何',color:'#73A991'}, {id:'植物',color:'#B5C68F'},
    {id:'动物',color:'#82B5BC'}, {id:'建筑',color:'#D0B575'}, {id:'文字',color:'#DDD2AE'}
  ];
  const COLORS = [
    {id:'red',label:'红',color:'#BA7770'}, {id:'orange_gold',label:'橙金',color:'#C6A35B'},
    {id:'yellow_green',label:'黄绿',color:'#9AA775'}, {id:'teal',label:'青绿',color:'#67A095'},
    {id:'blue',label:'蓝',color:'#6B96AD'}, {id:'purple',label:'紫',color:'#968BAA'},
    {id:'magenta',label:'品红',color:'#BB8EAA'}, {id:'no_stable_color',label:'未归类色彩',color:'#AFB3A8'}
  ];
  const color = id => COLORS.find(c=>c.id===id) || COLORS[7];
  const records = window.DAIJIN_GALLERY.records.map(r=>({...r,present:PRESENCE[r.id]||[]}));
  const imageMetrics = new Map((window.DAIJIN_IMAGE_METRICS?.records||[]).map(r=>[r.id,r]));
  const measured = records.filter(r=>imageMetrics.has(r.id)).map(r=>({...r,metrics:imageMetrics.get(r.id)}));
  const regions = window.SITE?.regions || [];
  const categories = CAT.map(c=>({...c,records:records.filter(r=>r.category===c.id)}));
  const pairData = COLORS.slice(0,7).flatMap((a,i)=>COLORS.slice(i+1,7).map(b=>({
    id:`pair:${a.id}:${b.id}`,a:a.id,b:b.id,
    records:records.filter(r=>r.present.includes(a.id)&&r.present.includes(b.id))
  }))).filter(p=>p.records.length);
  const views = [
    {id:'composition',name:'纹样总览',title:'纹样类别与数量',description:'几何纹样超过本批档案的一半。点选类别，查看数量与对应纹样。',
      note:'按当前图像档案的原目录归类，拼接总览不参与统计。图中比例仅表示本档案的构成。'},
    {id:'radial',name:'五类色环',title:'五类纹样的主色构成',description:'从外圈的几何纹样开始，依次向内阅读植物纹样和动物纹样，内两圈为建筑与文字。每一圈独立表示该类的主色构成。',
      note:'弧长为类内主色比例，各圈均为 100%；圈的半径不代表数量。建筑类有 5 幅，文字类有 3 幅，样本较少。'},
    {id:'sankey',name:'主色流向',title:'纹样类别与主色流向',description:'左侧为五类目录，右侧为图像主色。流带宽度对应这一路径中的文件数。',
      note:'每幅图像只归入一个主色系。彩色像素不足可见像素的 1% 时列为未归类色彩。'},
    {id:'chord',name:'同图共色',title:'同图色彩共现',description:'红与蓝在 26 幅图像中共同出现。点选弦带，查看对应纹样。',
      note:'两色各占有效彩色像素至少 5%，计一次共现；同一图可计入多对。弦宽表示文件数，外弧长度为该色各条共现的合计，不是独立图像数；不表示文化影响或传承。'},
    {id:'heatmap',name:'类别色谱',title:'类别色彩分布',description:'格内数字为色系在该类图像中的出现率。点选色格，查看文件数及类别总量，浏览对应原图。',
      note:'色系达到 5% 阈值即计入；分母为该目录全部图像，含未归类色彩图。同图可含多色，各行不要求合计 100%。'},
    {id:'regional',name:'地域记录',title:'地域与村寨记录',description:'从州县走进村寨，梳理文献中的傣锦活动。点选节点，查看原始来源。',
      note:'地域关联取自文献中的织锦活动记录，图像档案的采集地不由此推定。'},
    {id:'tonal',name:'明暗层次',title:'纹样画面的明暗关系',description:'向右看画面由暗到亮，向上看明暗对比增强。每一个点对应一张纹样原图。',
      note:'横轴为透明度加权 CIE L* 平均亮度，纵轴为 CIE L* 标准差。统计时将 sRGB 解码为线性 RGB，长边采样至 320 像素。完全透明的像素不参与计算。这里只比较数字图像，不表示染料或实物色度。'}
  ];
  const $ = s=>host.querySelector(s);
  const $$ = s=>Array.from(host.querySelectorAll(s));
  const esc = s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const fmt = n=>Number.isInteger(n)?String(n):n.toFixed(1);
  const pct = (n,d)=>d?`${(100*n/d).toFixed(1)}%`:'0%';
  const thumb = r=>r.image.replace('assets/patterns/','assets/thumbs/').replace(/\.png$/i,'.webp');
  const svgNS='http://www.w3.org/2000/svg';
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  const staticMode=new URLSearchParams(location.search).get('static')==='1';
  let chosen='composition',selection=null,model=[],idleList=[],inView=false,paused=reduced.matches||staticMode;
  let lastInput=Date.now(),lastStep=Date.now(),idleIndex=0,resizing=0,restoreFocus=null,previousOverflow='',keyboardFocus=false;
  let svg,plotW=0,plotH=0,mobile=false;
  const old=section.querySelector('#atlas');
  const host=document.createElement('div');
  host.className='atlas-exp';
  host.id='atlasExperience';
  host.setAttribute('aria-label','纹样关系交互图谱');
  host.innerHTML=`
    <div class="ax-toolbar">
      <div class="ax-tabs" role="tablist" aria-label="七张图谱">${views.map((v,i)=>`<button type="button" role="tab" id="ax-tab-${v.id}" aria-controls="ax-panel" aria-selected="${i===0}" tabindex="${i===0?0:-1}" data-view="${v.id}"><span>${String(i+1).padStart(2,'0')}</span>${v.name}</button>`).join('')}</div>
      <div class="ax-actions"><button type="button" id="axPlay" aria-pressed="${!paused}"><span class="ax-play-symbol" aria-hidden="true">Ⅱ</span><span class="ax-play-label">暂停巡览</span></button><button type="button" id="axFull" aria-label="全屏查看图谱"><span aria-hidden="true">⛶</span><span>全屏</span></button></div>
    </div>
    <div class="ax-panel" id="ax-panel" role="tabpanel" aria-labelledby="ax-tab-composition">
      <div class="ax-heading"><div><p class="ax-eyebrow">PATTERN ATLAS <span id="axIndex">01 / 07</span></p><h3 id="axTitle"></h3><p id="axIntro"></p></div></div>
      <div class="ax-stage">
        <div class="ax-visual"><div class="ax-plot" id="axPlot"></div><div class="ax-legend" id="axLegend" aria-label="图例与数据选择"></div><div class="ax-mobile-picker" id="axMobilePicker" hidden><label for="axMobileSelect">选择数据</label><select id="axMobileSelect" aria-label="选择图谱中的一组数据"></select></div><div class="ax-tooltip" id="axTooltip" role="tooltip" hidden></div></div>
        <aside class="ax-detail" aria-label="所选数据详情"><p class="ax-detail-kicker" id="axMode">循色读纹</p><h4 id="axDetailTitle"></h4><div class="ax-number"><strong id="axValue"></strong><span id="axUnit"></span></div><p class="ax-ratio" id="axRatio"></p><p class="ax-detail-copy" id="axDetailCopy"></p><div class="ax-samples" id="axSamples"></div><div class="ax-sources" id="axSources"></div><button type="button" class="ax-reset" id="axReset">查看全貌 <span aria-hidden="true">↗</span></button></aside>
      </div>
      <div class="ax-bottom"><p>点选图形或图例，沿着数据回看纹样。</p><p class="ax-status" id="axStatus">点选图形，细看纹样</p></div>
      <details class="ax-data"><summary>图谱数据与统计说明</summary><p id="axNote"></p><div class="ax-table-wrap" id="axTable"></div></details>
    </div><div class="ax-live" aria-live="polite" aria-atomic="true"></div>`;
  if(old) old.replaceWith(host); else section.querySelector('.wrap').append(host);
  const lede=section.querySelector('.chapter-head .lede');
  if(lede) lede.textContent='读纹样形态，观色彩层次，循图谱走近织锦。';
  section.classList.add('has-atlas-experience');

  function node(tag,attrs={},parent=svg,text=''){
    const n=document.createElementNS(svgNS,tag);
    Object.entries(attrs).forEach(([k,v])=>n.setAttribute(k,v));
    if(text!==null&&text!=='')n.textContent=text;
    parent.append(n);return n;
  }
  function label(x,y,text,attrs={},parent=svg){return node('text',{x,y,'font-size':mobile?14:16,...attrs},parent,text);}
  function point(cx,cy,r,a){return [cx+r*Math.cos(a),cy+r*Math.sin(a)];}
  function arc(cx,cy,ri,ro,a,b){
    const p=point(cx,cy,ro,a),q=point(cx,cy,ro,b),s=point(cx,cy,ri,b),t=point(cx,cy,ri,a),big=b-a>Math.PI?1:0;
    return `M${p}A${ro},${ro} 0 ${big} 1 ${q}L${s}A${ri},${ri} 0 ${big} 0 ${t}Z`;
  }
  function addModel(d){model.push(d);return d;}
  function mark(d,tag,attrs,parent=svg){
    const g=node('g',{'data-entity':d.id,'class':'ax-mark',role:'button',tabindex:'0','aria-label':d.aria||`${d.title}，${d.value}${d.unit||'幅'}`,'aria-pressed':'false'},parent);
    node(tag,attrs,g);node('title',{},g,d.aria||`${d.title}，${d.value}${d.unit||'幅'}`);
    return g;
  }
  function recordModel(id,title,rows,extra={}){
    return addModel({id,title,records:rows,value:rows.length,unit:'幅',ratio:`占图像档案的 ${pct(rows.length,records.length)}`,copy:'从这组图像里，观察纹样与颜色。',...extra});
  }
  function makeLegend(items){
    $('#axLegend').innerHTML=items.map(d=>`<button type="button" data-pick="${esc(d.id)}" aria-pressed="false"><i style="--swatch:${d.color||'#C6A35B'}"></i><span>${esc(d.legend||d.title)}</span>${d.legendValue!==undefined?`<b>${d.legendValue}</b>`:''}</button>`).join('');
  }
  function table(headers,rows){
    $('#axTable').innerHTML=`<table><caption>${esc(views.find(v=>v.id===chosen).title)}</caption><thead><tr>${headers.map(h=>`<th scope="col">${esc(h)}</th>`).join('')}</tr></thead><tbody>${rows.map(row=>`<tr>${row.map((c,i)=>`<${i?'td':'th'}${i?'':' scope="row"'}>${esc(c)}</${i?'td':'th'}>`).join('')}</tr>`).join('')}</tbody></table>`;
  }
  function centerCaption(cx,cy,main,sub){
    label(cx,cy,main,{'class':'ax-center-number','font-size':mobile?46:66,'text-anchor':'middle'});
    label(cx,cy+32,sub,{'font-size':mobile?13:15,'text-anchor':'middle','class':'ax-muted'});
  }
  function composition(){
    const cx=plotW/2,cy=plotH/2,R=Math.min(plotW*.34,plotH*.39),ri=R*.67;
    let a=-Math.PI/2;const gap=.018;
    categories.forEach(c=>{
      const d=recordModel(`cat:${c.id}`,`${c.id}纹样`,c.records,{color:c.color,legend:c.id,legendValue:c.records.length,copy:`本批图像中，${c.id}目录共有 ${c.records.length} 幅。下方展示其中的纹样。`});
      const span=c.records.length/records.length*Math.PI*2;
      mark(d,'path',{d:arc(cx,cy,ri,R,a+gap/2,a+span-gap/2),fill:c.color});
      const mid=a+span/2,p=point(cx,cy,R+25,mid);
      if(!mobile)label(p[0],p[1]+5,`${c.id} ${c.records.length}`,{'text-anchor':'middle','font-size':17});
      a+=span;
    });
    for(let i=0;i<records.length;i++){
      const a=-Math.PI/2+i/records.length*Math.PI*2,p=point(cx,cy,R+9,a),q=point(cx,cy,R+13,a);
      node('line',{x1:p[0],y1:p[1],x2:q[0],y2:q[1],stroke:'#D4C499','stroke-opacity':'.45','stroke-width':1});
    }
    centerCaption(cx,cy+4,'五类','纹样档案');
    makeLegend(model);idleList=model.map(d=>d.id);
    table(['原目录','文件数','占本批比例'],categories.map(c=>[c.id,c.records.length,pct(c.records.length,records.length)]));
  }
  function radial(){
    const cx=plotW/2,cy=plotH/2,R=Math.min(plotW*.40,plotH*.43),step=R*.13,thickness=step*.76;
    categories.forEach((cat,i)=>{
      const ro=R-i*step,ri=ro-thickness;let a=-Math.PI/2;
      const rowHeight=(plotH-20)/categories.length,rowTop=10+i*rowHeight,barLeft=8,barWidth=plotW-16;
      let barOffset=0;
      if(mobile){
        label(barLeft,rowTop+17,`${cat.id}纹样`,{'font-size':15});
        label(plotW-8,rowTop+17,`${cat.records.length} 幅`,{'font-size':14,'text-anchor':'end','class':'ax-muted'});
      }
      COLORS.forEach(col=>{
        const rows=cat.records.filter(r=>(r.dominant||'no_stable_color')===col.id);if(!rows.length)return;
        const span=rows.length/cat.records.length*Math.PI*2,gap=.009;
        const d=recordModel(`ring:${cat.id}:${col.id}`,`${cat.id} ${col.label}`,rows,{category:cat.id,colorID:col.id,color:col.color,ratio:`${rows.length} / ${cat.records.length} 幅 类内占比 ${pct(rows.length,cat.records.length)}`,copy:mobile?`${cat.id}纹样中，${col.label}主色图像占 ${pct(rows.length,cat.records.length)}。`:`第 ${i+1} 圈（${i===0?'最外圈':i===4?'最内圈':'由外向内'}）为${cat.id}目录，弧段对应${col.label}主色图像。`});
        if(mobile){
          const width=rows.length/cat.records.length*barWidth;
          mark(d,'rect',{x:barLeft+barOffset,y:rowTop+27,width,height:Math.max(28,Math.min(44,rowHeight-38)),fill:col.color});
          barOffset+=width;
        }else mark(d,'path',{d:arc(cx,cy,ri,ro,a+gap/2,a+span-gap/2),fill:col.color});
        a+=span;
      });
    });
    if(!mobile)centerCaption(cx,cy+2,'五类','外 → 内');
    const legend=COLORS.map(col=>recordModel(`color:${col.id}`,col.label,records.filter(r=>(r.dominant||'no_stable_color')===col.id),{color:col.color,colorID:col.id,copy:`该主色在全部目录中的合计；点选具体${mobile?'色带':'弧段'}，可查看单个目录。`}));
    makeLegend(legend);idleList=model.filter(d=>d.id.startsWith('ring:')).sort((a,b)=>b.value-a.value).map(d=>d.id);
    table(['目录',...COLORS.map(c=>c.label)],categories.map(cat=>[cat.id,...COLORS.map(col=>cat.records.filter(r=>(r.dominant||'no_stable_color')===col.id).length)]));
  }
  function sankey(){
    const left=mobile?42:95,right=plotW-(mobile?78:108),top=mobile?24:28,bottom=plotH-(mobile?24:30),bar=mobile?10:13;
    const gap=20,scale=(bottom-top-gap*7)/records.length;
    let y=top;
    const cats=categories.map(c=>{const n={...c,y,h:c.records.length*scale,offset:0};y+=n.h+gap;return n;});
    y=top;
    const cols=COLORS.map(c=>{const rows=records.filter(r=>(r.dominant||'no_stable_color')===c.id);const n={...c,records:rows,y,h:rows.length*scale,offset:0};y+=n.h+gap;return n;});
    cats.forEach(cat=>{
      cols.forEach(col=>{
        const rows=cat.records.filter(r=>(r.dominant||'no_stable_color')===col.id);if(!rows.length)return;
        const h=rows.length*scale,y0=cat.y+cat.offset,y1=col.y+col.offset,m=(left+right)/2;
        const d=recordModel(`flow:${cat.id}:${col.id}`,`${cat.id} → ${col.label}`,rows,{category:cat.id,colorID:col.id,color:col.color,ratio:`占${cat.id}目录 ${pct(rows.length,cat.records.length)}`,copy:'沿这条带回看原图：每幅文件从所属目录流向它的主色系。'});
        mark(d,'path',{d:`M${left+bar},${y0}C${m},${y0} ${m},${y1} ${right},${y1}L${right},${y1+h}C${m},${y1+h} ${m},${y0+h} ${left+bar},${y0+h}Z`,fill:col.color,'fill-opacity':.7});
        cat.offset+=h;col.offset+=h;
      });
    });
    cats.forEach(cat=>{
      const d=recordModel(`cat:${cat.id}`,`${cat.id}纹样`,cat.records,{category:cat.id,color:cat.color,legend:cat.id});
      const g=mark(d,'rect',{x:left,y:cat.y,width:bar,height:Math.max(1,cat.h),fill:cat.color});
      node('rect',{x:left-45,y:cat.y-8,width:55,height:Math.max(44,cat.h+16),fill:'transparent'},g);
      label(left-9,cat.y+cat.h/2+5,cat.id,{'text-anchor':'end'});
    });
    cols.forEach(col=>{
      const d=recordModel(`color:${col.id}`,col.label,col.records,{color:col.color,colorID:col.id});
      const g=mark(d,'rect',{x:right,y:col.y,width:bar,height:Math.max(1,col.h),fill:col.color});
      node('rect',{x:right,y:col.y-6,width:mobile?65:100,height:Math.max(25,col.h+12),fill:'transparent'},g);
      if(col.id==='no_stable_color'&&mobile){
        label(right+bar+6,col.y+col.h/2-2,'未归类',{'font-size':14});
        label(right+bar+6,col.y+col.h/2+16,col.records.length,{'font-size':14,'class':'ax-muted'});
      }else label(right+bar+(mobile?6:8),col.y+col.h/2+5,col.id==='no_stable_color'?`未归类 ${col.records.length}`:`${col.label} ${col.records.length}`,{'font-size':mobile?14:15});
    });
    makeLegend(categories.map(c=>model.find(d=>d.id===`cat:${c.id}`)));idleList=model.filter(d=>d.id.startsWith('flow:')).sort((a,b)=>b.value-a.value).map(d=>d.id);
    table(['目录','主色','文件数'],model.filter(d=>d.id.startsWith('flow:')).map(d=>[d.category,color(d.colorID).label,d.value]));
  }
  function chord(){
    const palette=COLORS.slice(0,7),matrix=palette.map(a=>palette.map(b=>a.id===b.id?0:records.filter(r=>r.present.includes(a.id)&&r.present.includes(b.id)).length));
    const sums=matrix.map(row=>row.reduce((a,b)=>a+b,0)),total=sums.reduce((a,b)=>a+b,0);
    const gap=.055,k=(2*Math.PI-gap*7)/total,cx=plotW/2,cy=plotH/2,thick=mobile?16:21,R=Math.min(mobile?(plotW-104)/2:plotW*.36,plotH*.39,plotH/2-thick-36);
    let angle=-Math.PI/2;const groups=[],slots=[];
    matrix.forEach((row,i)=>{
      const start=angle;slots[i]=[];
      row.forEach((n,j)=>{slots[i][j]={a:angle,b:angle+n*k};angle+=n*k;});
      groups.push({a:start,b:angle});angle+=gap;
    });
    pairData.forEach(pair=>{
      const i=palette.findIndex(c=>c.id===pair.a),j=palette.findIndex(c=>c.id===pair.b),s=slots[i][j],t=slots[j][i],p=point(cx,cy,R,s.a),q=point(cx,cy,R,s.b),r=point(cx,cy,R,t.a),u=point(cx,cy,R,t.b);
      const d=recordModel(pair.id,`${color(pair.a).label} × ${color(pair.b).label}`,pair.records,{color:color(pair.a).color,colorIDs:[pair.a,pair.b],copy:`${pair.records.length} 幅图像中同时出现这两种色系。下方展示其中的色彩组合。`});
      mark(d,'path',{d:`M${p}A${R},${R} 0 0 1 ${q}Q${cx},${cy} ${r}A${R},${R} 0 0 1 ${u}Q${cx},${cy} ${p}Z`,fill:d.color,'fill-opacity':.60,stroke:d.color,'stroke-width':.65});
    });
    const legend=[];
    groups.forEach((g,i)=>{
      const c=palette[i],rows=records.filter(r=>r.present.includes(c.id));
      const d=recordModel(`presence:${c.id}`,c.label,rows,{color:c.color,colorIDs:[c.id],copy:`${c.label}色系出现于 ${rows.length} 幅图像；高亮弦带展示它与其他颜色的组合。`});
      mark(d,'path',{d:arc(cx,cy,R+4,R+thick+4,g.a,g.b),fill:c.color});
      const p=point(cx,cy,R+thick+22,(g.a+g.b)/2),cos=Math.cos((g.a+g.b)/2);
      label(p[0],p[1]+5,c.label,{'text-anchor':mobile?'middle':cos>.25?'start':cos<-.25?'end':'middle','font-size':mobile?14:17});
      legend.push(d);
    });
    makeLegend(legend);idleList=[...pairData].sort((a,b)=>b.records.length-a.records.length).map(p=>p.id);
    table(['色系一','色系二','共现文件数'],[...pairData].sort((a,b)=>b.records.length-a.records.length).map(p=>[color(p.a).label,color(p.b).label,p.records.length]));
  }
  function heatmap(){
    const left=mobile?42:76,top=mobile?58:64,right=mobile?0:20,bottom=mobile?10:22;
    const cols=mobile?5:7,rows=mobile?7:5,cw=(plotW-left-right)/cols,ch=(plotH-top-bottom)/rows;
    if(mobile) categories.forEach((c,i)=>{label(left+(i+.5)*cw,24,c.id,{'text-anchor':'middle'});label(left+(i+.5)*cw,44,`${c.records.length}幅`,{'text-anchor':'middle','font-size':12,'class':'ax-muted'});});
    else COLORS.slice(0,7).forEach((c,i)=>label(left+(i+.5)*cw,top-22,c.label,{'text-anchor':'middle'}));
    categories.forEach((cat,i)=>{
      if(!mobile){label(left-15,top+(i+.5)*ch-3,cat.id,{'text-anchor':'end'});label(left-15,top+(i+.5)*ch+20,`n=${cat.records.length}`,{'text-anchor':'end','font-size':12,'class':'ax-muted'});}
      COLORS.slice(0,7).forEach((col,j)=>{
        if(mobile&&i===0)label(left-8,top+(j+.5)*ch+5,col.label,{'text-anchor':'end','font-size':14});
        const rr=cat.records.filter(r=>r.present.includes(col.id)),p=rr.length/cat.records.length;
        const d=recordModel(`cell:${cat.id}:${col.id}`,`${cat.id} ${col.label}`,rr,{category:cat.id,colorID:col.id,value:`${Math.round(p*100)}%`,unit:'出现率',ratio:`${rr.length} / ${cat.records.length} 幅 精确占比 ${pct(rr.length,cat.records.length)}`,copy:`${cat.id}目录的 ${cat.records.length} 幅图像中，有 ${rr.length} 幅包含${col.label}色系。`});
        const x=left+(mobile?i:j)*cw,y=top+(mobile?j:i)*ch;
        const fill=p===0?'#233E34':`rgb(${Math.round(61+148*p)},${Math.round(104+106*p)},${Math.round(84+81*p)})`;
        const inset=mobile?2:3;
        const g=mark(d,'rect',{x:x+inset,y:y+inset,width:cw-inset*2,height:ch-inset*2,rx:1,fill});
        label(x+cw/2,y+ch/2+6,`${Math.round(p*100)}%`,{'text-anchor':'middle','fill':p>.48?'#12291F':'#F3EFDF','font-size':mobile?14:21},g);
      });
    });
    $('#axLegend').innerHTML='<span class="ax-scale-label">出现率</span><span class="ax-scale" aria-hidden="true"></span><span class="ax-scale-label">0 — 100%</span><span class="ax-scale-note">同图可计入多色</span>';
    idleList=model.filter(d=>d.records.length).sort((a,b)=>b.records.length-a.records.length).map(d=>d.id);
    table(['目录','分母',...COLORS.slice(0,7).map(c=>c.label)],categories.map(cat=>[cat.id,cat.records.length,...COLORS.slice(0,7).map(c=>{const n=cat.records.filter(r=>r.present.includes(c.id)).length;return `${n} 幅 / ${pct(n,cat.records.length)}`;})]));
  }
  function regional(){
    const rowH=(plotH-48)/Math.max(1,regions.length),start=25;
    const prefectures=[...new Set(regions.map(r=>r.prefecture))];
    if(!mobile){
      label(16,18,'州 / 市',{'class':'ax-muted','font-size':13});
      label(plotW*.34,18,'县 / 市',{'class':'ax-muted','font-size':13});
      label(plotW*.62,18,'文献中的村寨',{'class':'ax-muted','font-size':13});
    }
    const short={'西双版纳傣族自治州':'西双版纳','普洱市':'普洱','德宏傣族景颇族自治州':'德宏'};
    regions.forEach((r,i)=>{
      const y=start+(i+.5)*rowH,site=r.sites?.[0],ev=r.evidence||[],pindex=prefectures.indexOf(r.prefecture),colorHex=CAT[pindex].color;
      const d=addModel({id:`region:${r.id}`,title:r.label,records:[],value:ev.length,unit:'份来源',ratio:site?.name||'文献记录',copy:site?.note||'',region:r,color:colorHex,legend:r.label});
      if(mobile){
        const g=mark(d,'rect',{x:8,y:y-rowH/2+5,width:plotW-16,height:rowH-10,fill:'#1D392F',rx:1});
        node('rect',{x:8,y:y-rowH/2+5,width:3,height:rowH-10,fill:colorHex},g);
        label(24,y-7,r.label,{'font-size':18},g);label(plotW-24,y-9,short[r.prefecture],{'text-anchor':'end','font-size':13,'class':'ax-muted'},g);
        const maxChars=Math.floor((plotW-48)/14),name=site?.name||'';
        const text=name.length>maxChars?name.slice(0,maxChars-1)+'…':name;
        label(24,y+19,text,{'font-size':14,'class':'ax-muted'},g);
      }else{
        const x0=plotW*.14,x1=plotW*.36,x2=plotW*.62;
        const siblings=regions.map((x,j)=>x.prefecture===r.prefecture?j:-1).filter(x=>x>=0);
        const py=start+(siblings.reduce((a,b)=>a+b,0)/siblings.length+.5)*rowH;
        const g=mark(d,'path',{d:`M${x0},${py}C${(x0+x1)/2},${py} ${(x0+x1)/2},${y} ${x1},${y}L${x2},${y}`,fill:'none',stroke:colorHex,'stroke-width':2.5});
        node('rect',{x:x1-12,y:y-27,width:plotW-x1+4,height:54,fill:'transparent'},g);
        node('circle',{cx:x1,cy:y,r:7,fill:colorHex},g);node('circle',{cx:x2,cy:y,r:4,fill:colorHex},g);
        label(x1+17,y-12,r.label,{'font-size':19},g);
        const lines=splitLine(site?.name||'',Math.max(10,Math.floor((plotW-x2-25)/14)));
        lines.forEach((s,j)=>label(x2+12,y+(j-(lines.length-1)/2)*21+5,s,{'font-size':14},g));
        if(siblings[0]===i){node('circle',{cx:x0,cy:py,r:9,fill:colorHex});label(x0-16,py+5,short[r.prefecture],{'text-anchor':'end','font-size':18});}
      }
    });
    makeLegend(model);idleList=model.map(d=>d.id);
    table(['区域','州 / 市','文献中的村寨','来源份数'],regions.map(r=>[r.fullName,r.prefecture,r.sites?.[0]?.name||'',r.evidence?.length||0]));
  }
  function imageModel(r){
    const m=r.metrics;
    return recordModel(`tonal:${r.id}`,r.id,[r],{
      kind:'image',category:r.category,color:CAT.find(c=>c.id===r.category)?.color,
      value:fmt(m.meanLightness),unit:'亮度 L*',
      ratio:`明暗对比 ${fmt(m.lightnessContrast)}`,
      copy:`${r.category}纹样，点开原图观察明暗层次。`,
      aria:`${r.id} ${r.category}纹样 平均亮度 ${m.meanLightness} 明暗对比 ${m.lightnessContrast}`
    });
  }
  function representativeRows(rows,count){
    if(rows.length<=count)return rows;
    return Array.from({length:count},(_,i)=>rows[Math.round(i*(rows.length-1)/(count-1))]);
  }
  function tonal(){
    const left=mobile?42:58,right=mobile?15:24,top=mobile?39:35,bottom=mobile?60:58;
    const width=plotW-left-right,height=plotH-top-bottom;
    const x=v=>left+v/100*width,y=v=>plotH-bottom-v/50*height;
    [0,10,20,30,40,50].forEach(value=>{
      node('line',{x1:left,y1:y(value),x2:plotW-right,y2:y(value),stroke:'#AAC0AE','stroke-opacity':value===0?.42:.13,'stroke-width':1});
      label(left-10,y(value)+4,String(value),{'font-size':mobile?12:13,'text-anchor':'end','class':'ax-muted'});
    });
    [0,20,40,60,80,100].forEach(value=>{
      node('line',{x1:x(value),y1:top,x2:x(value),y2:plotH-bottom,stroke:'#AAC0AE','stroke-opacity':.10,'stroke-width':1});
      label(x(value),plotH-bottom+22,String(value),{'font-size':mobile?12:13,'text-anchor':'middle','class':'ax-muted'});
    });
    label(left,18,'明暗对比',{'font-size':mobile?13:15,'class':'ax-muted'});
    label(left,plotH-10,'暗',{'font-size':mobile?12:13,'class':'ax-muted'});
    label(left+width/2,plotH-10,'平均亮度 L*',{'font-size':mobile?13:14,'text-anchor':'middle','class':'ax-muted'});
    label(plotW-right,plotH-10,'亮',{'font-size':mobile?12:13,'text-anchor':'end','class':'ax-muted'});
    measured.forEach(r=>{
      const d=imageModel(r),cx=x(r.metrics.meanLightness),cy=y(r.metrics.lightnessContrast);
      const g=mark(d,'circle',{cx,cy,r:mobile?10:9,fill:'transparent'});
      g.classList.add('ax-tone-dot');
      node('circle',{cx,cy,r:mobile?4.5:5.5,fill:d.color,'fill-opacity':.82,stroke:'#142B21','stroke-width':1},g);
    });
    const legend=categories.map(c=>recordModel(`cat:${c.id}`,`${c.id}纹样`,measured.filter(r=>r.category===c.id),{category:c.id,color:c.color,legend:c.id,copy:'点选图中的一个点，回看对应原图。'}));
    makeLegend(legend);
    idleList=representativeRows([...measured].sort((a,b)=>a.metrics.meanLightness-b.metrics.meanLightness),10).map(r=>`tonal:${r.id}`);
    table(['原图','目录','平均亮度 L*','明暗对比'],[...measured].sort((a,b)=>a.metrics.meanLightness-b.metrics.meanLightness).map(r=>[r.id,r.category,r.metrics.meanLightness.toFixed(2),r.metrics.lightnessContrast.toFixed(2)]));
  }
  function splitLine(str,n){const a=[];for(let i=0;i<str.length;i+=n)a.push(str.slice(i,i+n));return a;}
  const renderers={composition,radial,sankey,chord,heatmap,regional,tonal};
  function render(){
    const plot=$('#axPlot'),rect=plot.getBoundingClientRect();
    if(!rect.width)return;
    mobile=rect.width<520;plotW=Math.max(240,Math.round(rect.width));plotH=Math.max(300,Math.round(rect.height));
    plot.replaceChildren();model=[];idleList=[];
    svg=node('svg',{viewBox:`0 0 ${plotW} ${plotH}`,width:plotW,height:plotH,role:'group','aria-label':views.find(v=>v.id===chosen).title},plot);
    renderers[chosen]();idleIndex=0;
    $('#axIntro').textContent=mobile&&chosen==='radial'?'每行是一类纹样，色带长度表示类内主色比例。点选色带或选择数据，查看对应纹样。':views.find(v=>v.id===chosen).description;
    $('#ax-tab-radial').innerHTML=`<span>02</span>${mobile?'五类主色':'五类色环'}`;
    $('#axNote').textContent=mobile&&chosen==='radial'?'色带长度表示类内主色比例，各行均为 100%；各行等宽，不代表类别总量。建筑类有 5 幅，文字类有 3 幅，样本较少。':views.find(v=>v.id===chosen).note;
    const imageView=chosen==='tonal';
    $('#axMobilePicker').hidden=!mobile&&!imageView;
    $('#axMobilePicker label').textContent=imageView?'选择原图':'选择数据';
    $('#axMobileSelect').setAttribute('aria-label',imageView?'选择任一纹样原图':'选择图谱中的一组数据');
    $('#axMobileSelect').innerHTML='<option value="">查看全貌</option>'+model.map(d=>`<option value="${esc(d.id)}">${esc(d.title)} ${esc(d.value)}${esc(d.unit)}</option>`).join('');
    select(selection&&model.some(d=>d.id===selection)?selection:null,false);
    host.dataset.ready='true';
  }
  function related(markData,selected){
    if(markData.id===selected.id)return true;
    if(selected.id.startsWith('cat:'))return markData.category===(selected.category||selected.id.slice(4));
    if(selected.id.startsWith('color:'))return markData.colorID===selected.colorID;
    if(selected.id.startsWith('presence:'))return markData.colorIDs?.includes(selected.colorIDs[0]);
    return false;
  }
  function select(id,user=true){
    const d=model.find(x=>x.id===id);
    selection=d?.id||null;
    $('#axMobileSelect').value=selection||'';
    $$('.ax-mark').forEach(el=>{
      const md=model.find(x=>x.id===el.dataset.entity),on=!!d&&related(md,d);
      el.classList.toggle('is-focused',on);el.classList.toggle('is-dimmed',!!d&&!on);el.setAttribute('aria-pressed',String(on));
    });
    $$('[data-pick]').forEach(el=>el.setAttribute('aria-pressed',String(el.dataset.pick===selection)));
    if(user){lastInput=Date.now();lastStep=Date.now();host.classList.remove('is-touring');}
    const v=views.find(v=>v.id===chosen);
    const overview={
      regional:{title:'五地文献记录',ratio:'从地方走向文献',copy:'点选区域，查看村寨记述与原文。'},
      tonal:{title:'纹样的明暗层次',ratio:'点选纹样 查看原图',copy:'比较画面的整体亮度与明暗对比。选择框可查看每一张原图。'}
    }[chosen]||{title:'循图读纹',ratio:'五类纹样 多种色彩',copy:'点选图形或图例，查看对应纹样。'};
    $('#axDetailTitle').textContent=d?d.title:overview.title;
    $('#axValue').textContent=d?d.value:'';
    $('#axUnit').textContent=d?d.unit:'';
    $('.ax-number').hidden=!d;
    $('.ax-detail').classList.toggle('ax-image-detail',d?.kind==='image');
    $('#axRatio').textContent=d?d.ratio:overview.ratio;
    $('#axDetailCopy').textContent=d?d.copy:overview.copy;
    const defaultSamples=chosen==='tonal'?representativeRows([...measured].sort((a,b)=>a.metrics.meanLightness-b.metrics.meanLightness),4):records.filter(r=>['DJ-GEO-003','DJ-BOT-003','DJ-ANI-008','DJ-ARC-002'].includes(r.id));
    const sampleRows=d?d.records:defaultSamples;
    $('#axSamples').innerHTML=chosen==='regional'?'':sampleRows.slice(0,4).map(r=>`<a href="${esc(r.image)}" target="_blank" rel="noopener" aria-label="查看 ${esc(r.id)} 原图"><img src="${esc(thumb(r))}" alt="${esc(r.category)}纹样 ${esc(r.id)}"><span>${esc(r.id)}</span></a>`).join('')+(d&&sampleRows.length===0?'<p class="ax-empty">本批档案中没有符合这一格的图像。</p>':'');
    $('#axSources').innerHTML=d?.region?(d.region.evidence||[]).map(s=>`<a href="${esc(s.url)}" target="_blank" rel="noopener">${esc(s.title)} ↗<small>${esc(s.publisher)}${s.date?' '+esc(s.date):''}</small></a>`).join(''):'';
    $('#axReset').hidden=!d;
    $('#axMode').textContent=d?(user?'正在细读':'循纹巡览'):chosen==='regional'?'地方与文献':'循色读纹';
    if(user&&d)$('.ax-live').textContent=`${v.name}，${d.title}，${d.value}${d.unit}。${d.ratio}`;
    updatePlay();
  }
  function setView(id,user=true){
    if(!views.some(v=>v.id===id))id='composition';
    chosen=id;selection=null;const index=views.findIndex(v=>v.id===id),v=views[index];
    host.dataset.view=id;$('#axTitle').textContent=v.title;$('#axIntro').textContent=v.description;$('#axNote').textContent=v.note;$('#axIndex').textContent=`${String(index+1).padStart(2,'0')} / ${String(views.length).padStart(2,'0')}`;
    $('#ax-panel').setAttribute('aria-labelledby',`ax-tab-${id}`);
    $$('[data-view]').forEach(b=>{const on=b.dataset.view===id;b.setAttribute('aria-selected',String(on));b.tabIndex=on?0:-1;});
    if(user){lastInput=Date.now();lastStep=Date.now();const url=new URL(location.href);url.searchParams.set('chart',id);history.replaceState(history.state,'',url);$(`#ax-tab-${id}`).scrollIntoView({block:'nearest',inline:'nearest',behavior:'instant'});}
    $('#axTooltip').hidden=true;
    render();
  }
  function updatePlay(){
    const disabled=reduced.matches||staticMode;
    $('#axPlay').disabled=disabled;
    $('#axPlay').setAttribute('aria-pressed',String(!paused&&!disabled));
    $('.ax-play-symbol').textContent=paused||disabled?'▷':'Ⅱ';
    $('.ax-play-label').textContent=disabled?'静态浏览':paused?'开启巡览':'暂停巡览';
    $('#axStatus').textContent=disabled?'静态浏览 点选查看数据':paused?'巡览已暂停 点选查看数据':selection&&Date.now()-lastInput<12000?'正在细读 暂缓巡览':'自动巡览 随时点选';
  }
  function tick(){
    if(paused||reduced.matches||staticMode||document.hidden||!inView||!idleList.length)return;
    if(keyboardFocus&&host.contains(document.activeElement)&&document.activeElement!==document.body)return;
    const now=Date.now();if(now-lastInput<12000||now-lastStep<4400)return;
    lastStep=now;host.classList.add('is-touring');select(idleList[idleIndex++%idleList.length],false);updatePlay();
  }
  function tooltip(target,event){
    const d=model.find(x=>x.id===target.dataset.entity);if(!d)return;
    const tip=$('#axTooltip');tip.textContent=`${d.title} ${d.value}${d.unit}`;
    const rect=$('.ax-visual').getBoundingClientRect();
    tip.hidden=false;const tx=event?.clientX?event.clientX-rect.left:rect.width/2,ty=event?.clientY?event.clientY-rect.top:40;
    tip.style.left=`${Math.max(8,Math.min(rect.width-tip.offsetWidth-8,tx+14))}px`;
    tip.style.top=`${Math.max(8,Math.min(rect.height-tip.offsetHeight-8,ty-48))}px`;
  }
  host.addEventListener('click',e=>{
    lastInput=Date.now();lastStep=Date.now();
    const tab=e.target.closest('button[data-view]'),pick=e.target.closest('[data-pick]'),m=e.target.closest('[data-entity]');
    if(tab)setView(tab.dataset.view);
    else if(pick)select(selection===pick.dataset.pick?null:pick.dataset.pick);
    else if(m)select(selection===m.dataset.entity?null:m.dataset.entity);
  });
  host.addEventListener('pointermove',e=>{const m=e.target.closest('[data-entity]');if(e.pointerType==='mouse'&&m){lastInput=Date.now();tooltip(m,e);}else $('#axTooltip').hidden=true;},{passive:true});
  host.addEventListener('pointerleave',()=>{$('#axTooltip').hidden=true;});
  host.addEventListener('focusin',e=>{lastInput=Date.now();const m=e.target.closest('[data-entity]');if(m)tooltip(m);});
  host.addEventListener('focusout',()=>{$('#axTooltip').hidden=true;});
  document.addEventListener('keydown',e=>{if(e.key==='Tab')keyboardFocus=true;});
  document.addEventListener('pointerdown',()=>{keyboardFocus=false;},{passive:true});
  host.addEventListener('keydown',e=>{
    const tab=e.target.closest('button[data-view]'),m=e.target.closest('[data-entity]');
    if(tab&&['ArrowRight','ArrowLeft','Home','End'].includes(e.key)){
      e.preventDefault();let i=views.findIndex(v=>v.id===chosen);
      i=e.key==='Home'?0:e.key==='End'?views.length-1:(i+(e.key==='ArrowRight'?1:-1)+views.length)%views.length;
      setView(views[i].id);$(`#ax-tab-${views[i].id}`).focus();
    }else if(m&&(e.key==='Enter'||e.key===' ')){e.preventDefault();select(selection===m.dataset.entity?null:m.dataset.entity);}
    else if(e.key==='Escape'&&host.classList.contains('is-expanded')){e.preventDefault();closeExpanded();}
    if(e.key==='Tab'&&host.classList.contains('is-expanded')){
      const focusable=$$('button:not(:disabled),a[href],summary,[tabindex="0"]').filter(n=>n.getBoundingClientRect().height>0),first=focusable[0],last=focusable[focusable.length-1];
      if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}
      else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}
    }
  });
  $('#axReset').addEventListener('click',()=>select(null));
  $('#axMobileSelect').addEventListener('change',e=>select(e.target.value||null));
  $('#axPlay').addEventListener('click',()=>{
    paused=!paused;
    if(!paused){lastInput=Date.now()-12001;lastStep=Date.now()-4500;document.activeElement.blur();tick();}
    host.classList.toggle('is-touring',!paused);updatePlay();
  });
  function expandedState(on){
    host.classList.toggle('is-expanded',on);
    $('#axFull').innerHTML=on?'<span aria-hidden="true">×</span><span>退出全屏</span>':'<span aria-hidden="true">⛶</span><span>全屏</span>';
    $('#axFull').setAttribute('aria-label',on?'退出全屏查看':'全屏查看图谱');
    if(on){restoreFocus=document.activeElement;previousOverflow=document.body.style.overflow;document.body.style.overflow='hidden';host.setAttribute('role','dialog');host.setAttribute('aria-modal','true');}
    else{document.body.style.overflow=previousOverflow;host.removeAttribute('role');host.removeAttribute('aria-modal');restoreFocus?.focus();}
    scheduleRender();window.dispatchEvent(new Event('resize'));
  }
  async function openExpanded(){
    if(host.classList.contains('is-expanded'))return;
    expandedState(true);
    try{if(host.requestFullscreen)await host.requestFullscreen();}catch(_){/* Fixed overlay is a complete file:// and embedded-browser fallback. */}
    $('#axFull').focus();
  }
  async function closeExpanded(){
    if(document.fullscreenElement===host){try{await document.exitFullscreen();}catch(_){}}
    if(host.classList.contains('is-expanded'))expandedState(false);
  }
  $('#axFull').addEventListener('click',()=>host.classList.contains('is-expanded')?closeExpanded():openExpanded());
  document.addEventListener('fullscreenchange',()=>{if(document.fullscreenElement!==host&&host.classList.contains('is-expanded'))expandedState(false);scheduleRender();});
  function scheduleRender(){clearTimeout(resizing);resizing=setTimeout(render,90);}
  new ResizeObserver(scheduleRender).observe($('#axPlot'));
  new IntersectionObserver(entries=>{inView=entries[0].isIntersecting;if(inView)lastStep=Date.now();host.classList.toggle('ax-offscreen',!inView);},{threshold:.15}).observe($('#axPlot'));
  document.addEventListener('visibilitychange',()=>{host.classList.toggle('ax-hidden',document.hidden);if(!document.hidden)lastStep=Date.now();});
  reduced.addEventListener('change',()=>{if(reduced.matches){paused=true;host.classList.remove('is-touring');}updatePlay();});
  setInterval(tick,500);
  const url=new URL(location.href),alias={color:'radial',atlas:'composition'};
  setView(alias[url.searchParams.get('chart')]||url.searchParams.get('chart')||'composition',false);
  if(url.searchParams.has('chart')&&url.searchParams.get('chart')!==chosen){url.searchParams.set('chart',chosen);history.replaceState(history.state,'',url);}
  window.DaijinAtlas={
    setView:id=>setView(id),select:id=>select(id),pause(){paused=true;host.classList.remove('is-touring');updatePlay();},
    play(){if(reduced.matches||staticMode)return;paused=false;lastInput=Date.now()-12001;lastStep=Date.now()-4500;updatePlay();},
    expand:openExpanded,close:closeExpanded,
    getState:()=>({view:chosen,selection,paused,inView,reduced:reduced.matches,expanded:host.classList.contains('is-expanded'),entities:model.length}),
    getData:()=>({total:records.length,categories:categories.map(c=>({name:c.id,count:c.records.length})),dominant:COLORS.map(c=>({id:c.id,count:records.filter(r=>r.dominant===c.id).length})),cooccurrence:pairData.map(p=>({source:p.a,target:p.b,count:p.records.length})),threshold:5,tone:measured.map(r=>({id:r.id,category:r.category,...r.metrics}))})
  };
})();
