(function(){
  'use strict';
  const section=document.getElementById('translate');
  const patterns=window.DAIJIN_STUDIO_PATTERNS||[];
  if(!section||!patterns.length)return;
  const old=section.querySelector('.trans-grid');
  if(!old)return;
  section.querySelector('.lede').textContent='从搭配方案开始，或自由选锦配花。调整构图与配色，设计自己的方巾或书签，也可以织成长卷。';
  const host=document.createElement('div');host.className='pattern-studio';old.replaceWith(host);
  const forms={square:{name:'方巾',w:1600,h:1600},bookmark:{name:'书签',w:800,h:2000},scroll:{name:'长卷',w:2400,h:1200}};
  const grounds={paper:'#F5F1E6',jade:'#214C43',ink:'#16241D',rose:'#B46152'};
  const layouts={grid:'满幅',mirror:'对镜',offset:'错行',patchwork:'拼锦'};
  const exporter=window.DaijinStudioExport;
  const recipes=window.DAIJIN_STUDIO_RECIPES||[];
  const themes=[...new Map(recipes.map(r=>[r.theme,r.themeName])).entries()];
  const categories=['几何','植物','动物','建筑','文字'].filter(c=>patterns.some(p=>p.category===c));
  const colorFamilies={red:'红色',pink:'玫红',orange:'橙色',gold:'金黄',green:'青绿',blue:'蓝色',purple:'紫色',mono:'黑白',neutral:'灰褐',multi:'多色'};
  const pageSize=12,recipePageSize=4;
  const firstRecipe=recipes.find(r=>r.id==='blue-1')||recipes[0];
  const recipeSettings=recipe=>Object.fromEntries(Object.entries(recipe||{}).filter(([key])=>['main','pair','layout','density','gap','ground','border','rotation','name'].includes(key)));
  const initial={main:'DJ-GEO-060',pair:'DJ-BOT-009',layout:'mirror',density:3,gap:0,ground:'paper',border:true,rotation:0,name:'蓝金对映',...recipeSettings(firstRecipe),form:'square',turns:{},recipeId:firstRecipe?.id||null};
  const clone=o=>JSON.parse(JSON.stringify(o));
  const draftKey='daijin-studio-draft',draftVersion=1;
  const patternIds=new Set(patterns.map(p=>p.id));
  const owns=(object,key)=>typeof key==='string'&&Object.prototype.hasOwnProperty.call(object,key);
  const bounded=(value,min,max,fallback)=>typeof value==='number'&&Number.isFinite(value)?Math.max(min,Math.min(max,Math.round(value))):fallback;
  const quarterTurn=value=>typeof value==='number'&&Number.isFinite(value)?((Math.round(value/90)*90)%360+360)%360:0;
  let draftStatus='已随当前构图更新';
  function validateDraft(value){
    if(!value||value.version!==draftVersion||!value.state||typeof value.state!=='object'||Array.isArray(value.state))return null;
    const saved=value.state,next=clone(initial);
    next.main=patternIds.has(saved.main)?saved.main:initial.main;
    next.pair=patternIds.has(saved.pair)?saved.pair:initial.pair;
    next.form=owns(forms,saved.form)?saved.form:initial.form;
    next.layout=owns(layouts,saved.layout)?saved.layout:initial.layout;
    next.ground=owns(grounds,saved.ground)?saved.ground:initial.ground;
    next.density=bounded(saved.density,2,8,initial.density);
    next.gap=bounded(saved.gap,0,16,initial.gap);
    next.border=typeof saved.border==='boolean'?saved.border:initial.border;
    next.rotation=quarterTurn(saved.rotation);
    next.turns={};
    if(saved.turns&&typeof saved.turns==='object'&&!Array.isArray(saved.turns)){
      Object.entries(saved.turns).slice(0,400).forEach(([key,angle])=>{
        const match=/^(\d{1,2}):(-?\d{1,2})$/.exec(key);
        if(match&&+match[1]<=40&&+match[2]>=-1&&+match[2]<=8){const turn=quarterTurn(angle);if(turn)next.turns[key]=turn;}
      });
    }
    const recipe=recipes.find(r=>r.id===saved.recipeId);
    const exactRecipe=recipe&&['main','pair','layout','ground','density','gap','border','rotation'].every(key=>recipe[key]===next[key])&&!Object.keys(next.turns).length;
    next.recipeId=exactRecipe?recipe.id:null;
    next.name=exactRecipe?recipe.name:'自由搭配';
    return next;
  }
  function readDraft(){
    try{
      const raw=localStorage.getItem(draftKey);if(!raw)return null;
      let saved;try{saved=JSON.parse(raw);}catch(_){return null;}
      const restored=validateDraft(saved);if(restored)draftStatus='已恢复上次创作';return restored;
    }catch(_){draftStatus='当前浏览器未保存草稿';return null;}
  }
  let state=clone(initial),slot='main',recipeIndex=0,ready=false,renderFrame=0,cells=[],previewKey='',patternPage=0,recipePage=0;
  state=readDraft()||state;
  let history=[clone(state)],cursor=0;
  let sliderGesture=null,sliderKey=null;
  const imageCache=new Map();
  const get=id=>patterns.find(p=>p.id===id)||patterns[0];
  const $=s=>host.querySelector(s), $$=s=>[...host.querySelectorAll(s)];
  host.innerHTML=`
    <div class="studio-bar">
      <div class="studio-forms" role="group" aria-label="作品形制">
        ${Object.entries(forms).map(([key,f])=>`<button type="button" data-form="${key}">${f.name}</button>`).join('')}
      </div>
      <div class="studio-actions">
        <button type="button" data-action="undo" aria-label="撤销上一步">撤销</button>
        <button type="button" data-action="reset">重置</button>
        <button type="button" data-action="weave" disabled>织成作品</button><button type="button" data-action="save" disabled>保存 PNG</button>
      </div>
    </div>
    <div class="studio-grid">
      <div class="studio-desk">
        <div class="studio-object"><canvas id="studioCanvas" width="1600" height="1600" tabindex="0" role="img" aria-label="方巾纹样预览，点击锦面可旋转局部纹样" aria-describedby="studioHint"></canvas></div>
        <div class="studio-caption"><strong id="studioName">蓝金对映　方巾</strong><span id="studioHint">点锦面转一格，试试不同花向</span></div>
      </div>
      <aside class="studio-panel" aria-label="织锦创作工具">
        <div class="studio-tool-tabs" role="tablist" aria-label="创作工具">
          <button type="button" id="studio-tab-pattern" role="tab" data-tool="pattern" aria-selected="true" aria-controls="studio-tool-pattern">纹样</button>
          <button type="button" id="studio-tab-layout" role="tab" data-tool="layout" aria-selected="false" tabindex="-1" aria-controls="studio-tool-layout">构图</button>
          <button type="button" id="studio-tab-finish" role="tab" data-tool="finish" aria-selected="false" tabindex="-1" aria-controls="studio-tool-finish">配色</button>
          <button type="button" id="studio-tab-recipes" role="tab" data-tool="recipes" aria-selected="false" tabindex="-1" aria-controls="studio-tool-recipes">方案</button>
        </div>
        <div class="studio-tool" id="studio-tool-pattern" role="tabpanel" aria-labelledby="studio-tab-pattern">
        <div class="studio-pick-head"><h3>选锦配花</h3><div class="studio-slot" role="group" aria-label="选择主纹或配纹">
          <button type="button" data-slot="main" aria-pressed="true">主纹</button><button type="button" data-slot="pair" aria-pressed="false">配纹</button>
        </div></div>
        <div class="studio-pattern-filters">
          <div class="studio-pattern-filter"><label for="studioPatternCategory">类别</label><select id="studioPatternCategory"><option value="all">全部纹样</option>${categories.map(c=>`<option value="${c}">${c}纹样</option>`).join('')}</select></div>
          <div class="studio-pattern-filter"><label for="studioPatternColor">主色</label><select id="studioPatternColor"><option value="all">全部颜色</option>${Object.entries(colorFamilies).map(([key,name])=>`<option value="${key}">${name}</option>`).join('')}</select></div>
        </div>
        <div class="studio-motifs" role="group" aria-label="全部纹样" id="studioMotifs"></div>
        <div class="studio-pattern-empty" id="studioPatternEmpty" hidden><p>没有匹配的纹样</p><button type="button" data-action="patterns-clear">查看全部</button></div>
        <div class="studio-pattern-pages" id="studioPatternPages" role="group" aria-label="纹样翻页" hidden><button type="button" data-action="patterns-prev" aria-label="上一组纹样" aria-controls="studioMotifs">上一组</button><span id="studioPatternPage" role="status"></span><button type="button" data-action="patterns-next" aria-label="下一组纹样" aria-controls="studioMotifs">下一组</button></div>
        <p class="studio-selection" id="studioSelection"></p>
        </div>
        <div class="studio-tool" id="studio-tool-layout" role="tabpanel" aria-labelledby="studio-tab-layout" hidden>
        <div class="studio-group"><h4>构图</h4><div class="studio-layouts" role="group" aria-label="锦面排列方式">
          ${Object.entries(layouts).map(([key,name],i)=>`<button type="button" data-layout="${key}"><span class="studio-layout-glyph" aria-hidden="true">${['▦','◇','▱','▧'][i]}</span>${name}</button>`).join('')}
        </div></div>
        <div class="studio-group">
          <div class="studio-range"><label for="studioDensity">疏密 <output id="studioDensityValue">4 列</output></label><input id="studioDensity" type="range" min="2" max="8" step="1" value="4"></div>
          <div class="studio-range"><label for="studioGap">留隙 <output id="studioGapValue">0%</output></label><input id="studioGap" type="range" min="0" max="16" step="1" value="0"></div>
        </div></div>
        <div class="studio-tool" id="studio-tool-finish" role="tabpanel" aria-labelledby="studio-tab-finish" hidden>
        <div class="studio-group">
          <h4>底色与锦边</h4><div class="studio-finishing">
            <div class="studio-grounds" role="group" aria-label="锦面底色">${Object.entries(grounds).map(([key,color],i)=>`<button type="button" data-ground="${key}" style="--swatch:${color}" aria-label="${['米白','青绿','墨绿','赭红'][i]}"></button>`).join('')}</div>
            <button type="button" class="studio-border" data-action="border">加锦边</button>
          </div>
        </div>
        </div>
        <div class="studio-tool" id="studio-tool-recipes" role="tabpanel" aria-labelledby="studio-tab-recipes" hidden>
          <div class="studio-recipe-filter"><label for="studioRecipeTheme">搭配风格</label><select id="studioRecipeTheme">${themes.map(([key,name])=>`<option value="${key}">${name}</option>`).join('')}</select></div>
          <div class="studio-recipes" role="group" aria-label="搭配方案" id="studioRecipes"></div>
          <div class="studio-pattern-pages studio-recipe-pages" id="studioRecipePages" role="group" aria-label="方案翻页" hidden><button type="button" data-action="recipes-prev" aria-label="上一页搭配方案" aria-controls="studioRecipes">上一页</button><span id="studioRecipePage" role="status"></span><button type="button" data-action="recipes-next" aria-label="下一页搭配方案" aria-controls="studioRecipes">下一页</button></div>
        </div>
        <button type="button" class="studio-inspire" data-action="inspire">换一组搭配<span aria-hidden="true">↻</span></button>
      </aside>
    </div>
    <div class="studio-footer">
      <span class="studio-recipe-name" id="studioRecipe">蓝金对映</span>
      <p class="studio-status" id="studioStatus" role="status">正在铺开锦面…</p>
      <button type="button" data-action="rotate">整体转一转</button>
    </div>`;
  const canvas=$('#studioCanvas');
  function persistDraft(){
    try{
      const saved=Object.fromEntries(Object.keys(initial).map(key=>[key,state[key]]));
      localStorage.setItem(draftKey,JSON.stringify({version:draftVersion,state:saved}));
      draftStatus='本机草稿已保存';
    }catch(_){draftStatus='当前浏览器未保存草稿';}
  }
  function remember(){
    history=history.slice(0,cursor+1);history.push(clone(state));
    if(history.length>30)history.shift();cursor=history.length-1;
    persistDraft();
  }
  function finishSlider(){
    if(!sliderGesture)return;
    const before=sliderGesture.before;sliderGesture=null;sliderKey=null;
    if(JSON.stringify(before)!==JSON.stringify(state))remember();
    sync();schedule();
  }
  function commit(patch,resetTiles=true){
    finishSlider();
    if(!('recipeId' in patch)&&Object.keys(patch).some(k=>!['form'].includes(k)))patch={...patch,recipeId:null,name:'自由搭配'};
    state={...state,...patch,turns:resetTiles?{}:state.turns};
    remember();schedule();sync();
  }
  function sync(){
    const main=get(state.main),pair=get(state.pair),form=forms[state.form];
    $$('[data-form]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.form===state.form)));
    $$('[data-layout]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.layout===state.layout)));
    $$('[data-ground]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.ground===state.ground)));
    $$('[data-slot]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.slot===slot)));
    $$('[data-pattern]').forEach(b=>{
      b.setAttribute('aria-pressed',String(b.dataset.pattern===state[slot]));
      b.dataset.pair=String(b.dataset.pattern===state.pair);
    });
    $('[data-action="undo"]').disabled=cursor===0&&!sliderGesture;
    $('[data-action="border"]').setAttribute('aria-pressed',String(state.border));
    $('#studioDensity').value=state.density;$('#studioDensityValue').textContent=state.density+' 列';
    $('#studioGap').value=state.gap;$('#studioGapValue').textContent=state.gap+'%';
    $('#studioSelection').innerHTML=`${slot==='main'?'主纹':'配纹'}　<b>${get(state[slot]).label}</b>`;
    $('#studioSelection').title=`主纹 ${main.id}　配纹 ${pair.id}`;
    $('#studioName').textContent=state.name+'　'+form.name;
    $('#studioRecipe').textContent=state.name;
    $('.studio-desk').style.setProperty('--ratio',form.w/form.h);
    canvas.setAttribute('aria-label',`${form.name}预览，${main.label}与${pair.label}，${layouts[state.layout]}排列。点击局部或按回车旋转。`);
    $$('[data-recipe]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.recipe===state.recipeId)));
    const activeRecipe=recipes.findIndex(r=>r.id===state.recipeId);if(activeRecipe>=0)recipeIndex=activeRecipe;
    renderRecipePreviews();
  }
  function renderPatterns(){
    const category=$('#studioPatternCategory').value;
    const color=$('#studioPatternColor').value;
    const pool=patterns.filter(p=>(category==='all'||p.category===category)&&(color==='all'||(p.colors||[]).includes(color)));
    const pages=Math.max(1,Math.ceil(pool.length/pageSize));
    patternPage=Math.max(0,Math.min(patternPage,pages-1));
    $('#studioMotifs').innerHTML=pool.slice(patternPage*pageSize,(patternPage+1)*pageSize).map(p=>`<button type="button" class="studio-motif" data-pattern="${p.id}" data-fit="${p.fit||'cover'}" aria-label="${p.label}，${p.category}纹样，${p.id}" title="${p.label}　${p.id}"><img src="${p.src}" alt="" loading="lazy" decoding="async"></button>`).join('');
    $('#studioMotifs').setAttribute('aria-label',$('#studioPatternCategory').selectedOptions[0].textContent+' '+$('#studioPatternColor').selectedOptions[0].textContent);
    $('#studioPatternEmpty').hidden=pool.length!==0;
    $('#studioPatternPages').hidden=pages===1;
    $('#studioPatternPage').textContent=`${patternPage+1} / ${pages}`;
    $('[data-action="patterns-prev"]').disabled=patternPage===0;
    $('[data-action="patterns-next"]').disabled=patternPage===pages-1;
    sync();
  }
  function renderRecipeGroup(){
    const theme=$('#studioRecipeTheme').value;
    const pool=recipes.filter(r=>r.theme===theme),pages=Math.max(1,Math.ceil(pool.length/recipePageSize));
    recipePage=Math.max(0,Math.min(recipePage,pages-1));
    $('#studioRecipes').innerHTML=pool.slice(recipePage*recipePageSize,(recipePage+1)*recipePageSize).map(r=>`<button type="button" class="studio-recipe-card" data-recipe="${r.id}" aria-pressed="${r.id===state.recipeId}" aria-label="应用${r.name}搭配"><canvas aria-hidden="true" width="144" height="144"></canvas><span>${r.name}</span></button>`).join('');
    $('#studioRecipePages').hidden=pages===1;
    $('#studioRecipePage').textContent=`${recipePage+1} / ${pages}`;
    $('[data-action="recipes-prev"]').disabled=recipePage===0;
    $('[data-action="recipes-next"]').disabled=recipePage===pages-1;
    previewKey='';renderRecipePreviews();
  }
  function renderRecipePreviews(){
    if(!ready)return;
    const key=$('#studioRecipeTheme').value+':'+recipePage+':'+state.form;if(key===previewKey)return;
    previewKey=key;
    const form=forms[state.form],scale=144/Math.max(form.w,form.h);
    $$('[data-recipe]').forEach(b=>{
      const recipe=recipes.find(r=>r.id===b.dataset.recipe);
      paint(b.querySelector('canvas'),{...initial,...recipe,form:state.form,turns:{}},Math.round(form.w*scale),Math.round(form.h*scale));
    });
  }
  function applyRecipe(index){
    if(!recipes.length)return;
    recipeIndex=(index+recipes.length)%recipes.length;
    const recipe=recipes[recipeIndex];
    $('#studioRecipeTheme').value=recipe.theme;
    recipePage=Math.floor(recipes.filter(r=>r.theme===recipe.theme).findIndex(r=>r.id===recipe.id)/recipePageSize);
    renderRecipeGroup();
    commit({...recipeSettings(recipe),recipeId:recipe.id});
  }
  function restoreRecipeGroup(){
    const recipe=recipes.find(r=>r.id===state.recipeId);
    if(recipe){
      $('#studioRecipeTheme').value=recipe.theme;
      recipePage=Math.floor(recipes.filter(r=>r.theme===recipe.theme).findIndex(r=>r.id===recipe.id)/recipePageSize);
      renderRecipeGroup();
    }
  }
  function tile(ctx,img,meta,x,y,size,angle=0,flipX=false,flipY=false){
    const roi=meta.roi||[0,0,img.naturalWidth,img.naturalHeight];
    const [sx,sy,sw,sh]=roi;
    const side=Math.min(sw,sh);
    ctx.save();ctx.beginPath();ctx.rect(x,y,size,size);ctx.clip();
    ctx.translate(x+size/2,y+size/2);
    ctx.rotate(angle*Math.PI/180);ctx.scale(flipX?-1:1,flipY?-1:1);
    // Every swatch fills its square tile at the original aspect ratio.
    ctx.drawImage(img,sx+(sw-side)/2,sy+(sh-side)/2,side,side,-size/2,-size/2,size,size);
    ctx.restore();
  }
  function draw(){
    renderFrame=0;if(!ready)return;
    const form=forms[state.form],W=form.w,H=form.h;
    cells=paint(canvas,state,W,H);
    $('#studioStatus').textContent=`${form.w} × ${form.h}　${sliderGesture?'调整后自动保存':draftStatus}`;
  }
  function paint(canvas,state,W,H){
    const ctx=canvas.getContext('2d'),cells=[];
    if(canvas.width!==W)canvas.width=W;if(canvas.height!==H)canvas.height=H;
    ctx.imageSmoothingEnabled=true;ctx.imageSmoothingQuality='high';
    ctx.fillStyle=grounds[state.ground];ctx.fillRect(0,0,W,H);
    const frame=state.border?Math.min(W,H)*.065:0;
    const inset=frame?frame+Math.min(W,H)*.016:0;
    const fieldW=W-inset*2,fieldH=H-inset*2,step=fieldW/state.density,gap=step*state.gap/100;
    const main=get(state.main),pair=get(state.pair);
    ctx.save();ctx.beginPath();ctx.rect(inset,inset,fieldW,fieldH);ctx.clip();
    for(let row=0;row<Math.ceil(fieldH/step)+1;row++){
      const offset=state.layout==='offset'&&row%2?step/2:0;
      for(let col=-1;col<state.density+1;col++){
        const x=inset+col*step+offset+gap/2,y=inset+row*step+gap/2,size=step-gap;
        const meta=state.layout==='patchwork'&&(row+col)%2!==0?pair:main;
        const angle=state.rotation+(state.turns[row+':'+col]||0);
        tile(ctx,imageCache.get(meta.id),meta,x,y,size,angle,state.layout==='mirror'&&col%2!==0,state.layout==='mirror'&&row%2!==0);
        if(x+size>inset&&x<inset+fieldW&&y<inset+fieldH)cells.push({key:row+':'+col,x,y,size});
      }
    }
    ctx.restore();
    if(frame){
      const img=imageCache.get(pair.id),edge=Math.min(W,H)*.012;
      for(let x=edge;x<W-edge;x+=frame){
        tile(ctx,img,pair,x,edge,frame,0);tile(ctx,img,pair,x,H-edge-frame,frame,180);
      }
      for(let y=edge+frame;y<H-edge-frame;y+=frame){
        tile(ctx,img,pair,edge,y,frame,90);tile(ctx,img,pair,W-edge-frame,y,frame,270);
      }
      ctx.strokeStyle=grounds[state.ground];ctx.lineWidth=edge*.65;
      ctx.strokeRect(edge/2,edge/2,W-edge,H-edge);
      ctx.strokeStyle='#C6A35B';ctx.lineWidth=Math.max(2,edge*.12);
      ctx.strokeRect(inset-edge*.35,inset-edge*.35,W-2*inset+edge*.7,H-2*inset+edge*.7);
    }
    return cells;
  }
  function schedule(){if(!renderFrame)renderFrame=requestAnimationFrame(draw);}
  host.addEventListener('click',event=>{
    const b=event.target.closest('button');if(!b)return;
    finishSlider();
    if(b.dataset.tool)showTool(b.dataset.tool);
    if(b.dataset.slot){slot=b.dataset.slot;sync();}
    if(b.dataset.pattern)commit({[slot]:b.dataset.pattern,name:'我的锦色'});
    if(b.dataset.form)commit({form:b.dataset.form});
    if(b.dataset.layout)commit({layout:b.dataset.layout});
    if(b.dataset.ground)commit({ground:b.dataset.ground});
    if(b.dataset.recipe)applyRecipe(recipes.findIndex(r=>r.id===b.dataset.recipe));
    switch(b.dataset.action){
      case 'undo':
        if(cursor>0){state=clone(history[--cursor]);persistDraft();restoreRecipeGroup();sync();schedule();}break;
      case 'reset':state=clone(initial);remember();restoreRecipeGroup();sync();schedule();break;
      case 'border':commit({border:!state.border},false);break;
      case 'rotate':commit({rotation:(state.rotation+90)%360},false);break;
      case 'inspire':
        applyRecipe(recipeIndex+1);break;
      case 'save':save();break;
      case 'weave':if(ready){draw();window.DaijinWebLoom.open(canvas);}break;
      case 'patterns-prev':patternPage--;renderPatterns();break;
      case 'patterns-next':patternPage++;renderPatterns();break;
      case 'recipes-prev':recipePage--;renderRecipeGroup();break;
      case 'recipes-next':recipePage++;renderRecipeGroup();break;
    }
  });
  function showTool(name){
    finishSlider();
    $$('[data-tool]').forEach(b=>{const on=b.dataset.tool===name;b.setAttribute('aria-selected',String(on));b.tabIndex=on?0:-1;});
    $$('.studio-tool').forEach(p=>p.hidden=p.id!=='studio-tool-'+name);
  }
  $('.studio-tool-tabs').addEventListener('keydown',event=>{
    if(!['ArrowLeft','ArrowRight','Home','End'].includes(event.key))return;
    const tabs=$$('[data-tool]'),i=tabs.indexOf(event.target);if(i<0)return;
    event.preventDefault();const next=event.key==='Home'?0:event.key==='End'?tabs.length-1:(i+(event.key==='ArrowRight'?1:tabs.length-1))%tabs.length;
    showTool(tabs[next].dataset.tool);tabs[next].focus();
  });
  const rangeKeys=['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Home','End','PageUp','PageDown'];
  [['#studioDensity','density'],['#studioGap','gap']].forEach(([selector,key])=>{
    const input=$(selector);
    input.addEventListener('input',()=>{
      if(sliderGesture&&sliderGesture.input!==input)finishSlider();
      if(!sliderGesture)sliderGesture={input,before:clone(state)};
      state={...state,[key]:+input.value,recipeId:null,name:'自由搭配',turns:key==='density'?{}:state.turns};
      sync();schedule();
    });
    input.addEventListener('change',()=>{if(sliderKey!==input)finishSlider();});
    input.addEventListener('keydown',event=>{if(rangeKeys.includes(event.key))sliderKey=input;});
    input.addEventListener('keyup',event=>{if(rangeKeys.includes(event.key)){sliderKey=null;finishSlider();}});
    input.addEventListener('blur',()=>{sliderKey=null;finishSlider();});
    input.addEventListener('pointerup',()=>finishSlider());
    input.addEventListener('pointercancel',()=>finishSlider());
  });
  $('#studioRecipeTheme').addEventListener('change',()=>{finishSlider();recipePage=0;renderRecipeGroup();});
  $('#studioPatternCategory').addEventListener('change',()=>{finishSlider();patternPage=0;renderPatterns();});
  $('#studioPatternColor').addEventListener('change',()=>{finishSlider();patternPage=0;renderPatterns();});
  $('[data-action="patterns-clear"]').addEventListener('click',()=>{
    $('#studioPatternCategory').value='all';$('#studioPatternColor').value='all';patternPage=0;renderPatterns();
  });
  canvas.addEventListener('click',event=>{
    if(!ready)return;
    finishSlider();
    const rect=canvas.getBoundingClientRect(),x=(event.clientX-rect.left)/rect.width*canvas.width,y=(event.clientY-rect.top)/rect.height*canvas.height;
    const cell=cells.find(c=>x>=c.x&&x<c.x+c.size&&y>=c.y&&y<c.y+c.size);
    if(!cell)return;
    state.turns={...state.turns,[cell.key]:((state.turns[cell.key]||0)+90)%360};
    state.recipeId=null;state.name='自由搭配';
    remember();sync();schedule();
  });
  canvas.addEventListener('keydown',event=>{
    if(event.key==='Enter'||event.key===' '){event.preventDefault();commit({rotation:(state.rotation+90)%360},false);}
  });
  function save(){
    if(!ready)return;finishSlider();draw();
    const a=document.createElement('a');
    a.download=`傣锦纹录-${forms[state.form].name}-${state.main}-${layouts[state.layout]}.png`;
    try{a.href=exporter.render(canvas).toDataURL('image/png');a.click();$('#studioStatus').textContent='已生成带品牌边框和时间的 PNG';}
    catch(_){$('#studioStatus').textContent='保存暂未完成，请重试';}
  }
  const loaded=Promise.all([exporter.ready,...patterns.map(meta=>new Promise(resolve=>{
    const img=new Image();
    img.onload=()=>{imageCache.set(meta.id,img);resolve(true);};
    img.onerror=()=>resolve(false);img.src=meta.imageData;
  }))]).then(ok=>{
    ready=ok.every(Boolean);host.querySelector('[data-action=weave]').disabled=!ready;$('[data-action="save"]').disabled=!ready;
    if(ready){draw();renderRecipePreviews();}else{$('#studioStatus').textContent='部分纹样未能载入，请刷新后重试';}
    return ready;
  });
  restoreRecipeGroup();renderRecipeGroup();renderPatterns();
  addEventListener('pagehide',finishSlider);
  document.addEventListener('visibilitychange',()=>{if(document.hidden)finishSlider();});
  // Same pixels drive preview and PNG export; data URLs keep offline export origin-clean.
  window.DaijinStudio={ready:loaded,getState:()=>clone(state),getPatterns:()=>patterns.map(p=>({id:p.id,label:p.label,category:p.category,colors:[...(p.colors||[])],featured:!!p.featured})),
    getRecipes:()=>clone(recipes),
    exportData:options=>{finishSlider();draw();return exporter.render(canvas,options).toDataURL('image/png');},
    artworkData:()=>{finishSlider();draw();return canvas.toDataURL('image/png');}};
  window.dispatchEvent(new Event('daijin:studio-ready'));
})();
