(function () {
  'use strict';
  var overlay, raf=0, active=false, elapsed=0, last=0, snapshot, framed, mockup, output, returnFocus, oldOverflow, hiddenSiblings=[];
  var $=function(id){return document.getElementById(id);};
  function setup(){
    if(overlay)return;
    overlay=document.createElement('div');overlay.id='studioLoom';overlay.className='studio-loom';overlay.hidden=true;
    overlay.setAttribute('role','dialog');overlay.setAttribute('aria-modal','true');overlay.setAttribute('aria-labelledby','studioLoomTitle');
    overlay.innerHTML='<button class="studio-loom-close" id="studioLoomClose" type="button" aria-label="返回设计">×</button><header><p>傣锦纹录 / 织锦坊</p><h2 id="studioLoomTitle">让锦色在经纬间成形</h2><p id="studioLoomIntro">梭子引纬 往复成锦</p></header><div class="studio-loom-stage" id="studioLoomStage"><canvas id="studioLoomCanvas" width="600" height="760" role="img" aria-label="木质织机上 当前纹样随梭子往返逐行织成"></canvas></div><div id="studioLoomWeaving" class="studio-loom-controls"><p id="studioLoomPhase" role="status">牵经引线</p><div class="studio-loom-progress" aria-hidden="true"><span id="studioLoomProgress"></span></div><button id="studioLoomSkip" type="button">跳过动画</button></div><div id="studioLoomResult" class="studio-loom-controls" hidden><div class="studio-loom-tabs" role="group" aria-label="成品展示方式"><button id="studioLoomMockup" type="button" aria-pressed="true">使用效果</button><button id="studioLoomCard" type="button" aria-pressed="false">平面作品卡</button></div><p id="studioLoomStatus" role="status">作品已织成</p><div class="studio-loom-actions"><button id="studioLoomAgain" type="button">继续搭配</button><button id="studioLoomSave" type="button">保存 PNG</button></div></div>';
    document.body.appendChild(overlay);
    $('studioLoomClose').onclick=close;$('studioLoomAgain').onclick=close;$('studioLoomSkip').onclick=finish;
    $('studioLoomMockup').onclick=function(){select('mockup');};$('studioLoomCard').onclick=function(){select('card');};
    $('studioLoomSave').onclick=function(){
      try {var a=document.createElement('a');a.href=output.toDataURL('image/png');a.download='傣锦纹录-'+(output===mockup?'使用效果':'作品卡')+'.png';a.click();$('studioLoomStatus').textContent='已生成 PNG';}
      catch(e){$('studioLoomStatus').textContent='保存未完成 请重试';}
    };
    overlay.addEventListener('keydown',function(e){
      if(e.key==='Escape'){e.preventDefault();close();return;}
      if(e.key!=='Tab')return;
      var buttons=Array.from(overlay.querySelectorAll('button')).filter(function(b){return !b.disabled&&b.getClientRects().length;});
      var first=buttons[0],end=buttons[buttons.length-1];
      if(e.shiftKey&&document.activeElement===first){e.preventDefault();end.focus();}
      else if(!e.shiftKey&&document.activeElement===end){e.preventDefault();first.focus();}
    });
    document.addEventListener('visibilitychange',function(){cancelAnimationFrame(raf);last=0;if(active&&!document.hidden&&!output)raf=requestAnimationFrame(tick);});
    window.addEventListener('pagehide',close);
  }
  function close(){
    if(!active)return;active=false;cancelAnimationFrame(raf);overlay.hidden=true;document.body.style.overflow=oldOverflow;
    hiddenSiblings.forEach(function(s){if(s.attr===null)s.el.removeAttribute('aria-hidden');else s.el.setAttribute('aria-hidden',s.attr);if(s.inert!==undefined)s.el.inert=s.inert;});hiddenSiblings=[];
    if(returnFocus&&document.contains(returnFocus))returnFocus.focus({preventScroll:true});
    snapshot=null;framed=null;mockup=null;output=null;
  }
  function select(mode){
    output=mode==='mockup'&&mockup?mockup:framed;
    var c=$('studioLoomCanvas');c.width=output.width;c.height=output.height;c.getContext('2d').drawImage(output,0,0);
    c.setAttribute('aria-label',output===mockup?'当前设计的使用效果示意':'带品牌边框与时间的作品卡');
    $('studioLoomMockup').setAttribute('aria-pressed',String(output===mockup));$('studioLoomCard').setAttribute('aria-pressed',String(output===framed));
    fit();
  }
  function fit(){
    if(!active)return;var box=$('studioLoomStage'),c=$('studioLoomCanvas');
    var scale=Math.min(box.clientWidth/c.width,box.clientHeight/c.height);c.style.width=Math.max(1,Math.floor(c.width*scale))+'px';c.style.height=Math.max(1,Math.floor(c.height*scale))+'px';
  }
  window.addEventListener('resize',fit);
  function finish(){
    if(!active||output)return;cancelAnimationFrame(raf);
    try{
      framed=window.DaijinStudioExport.render(snapshot);
      try{mockup=window.DaijinMockup.render(snapshot,window.DaijinStudio.getState().form);}catch(e){mockup=null;}
      overlay.classList.add('is-finished');$('studioLoomTitle').textContent='一方锦色 已经织就';$('studioLoomIntro').textContent='从纹样搭配 到日常生活';
      $('studioLoomWeaving').hidden=true;$('studioLoomResult').hidden=false;$('studioLoomMockup').disabled=!mockup;
      $('studioLoomStatus').textContent='作品已生成 可保存 PNG';select(mockup?'mockup':'card');$('studioLoomSave').focus({preventScroll:true});
    }catch(e){close();var s=$('studioStatus');if(s)s.textContent='成品生成未完成 请重新尝试';}
  }
  function tick(t){
    if(!active||output)return;
    if(last)elapsed+=Math.min(80,t-last);last=t;
    var p=Math.min(1,elapsed/5000);
    window.DaijinLoom.paint($('studioLoomCanvas').getContext('2d'),snapshot,p,elapsed);
    $('studioLoomProgress').style.width=Math.round(p*100)+'%';
    var label=p<.18?'牵经引线':p<.68?'梭子引纬':p<.96?'经纬成锦':'锦面织就';
    if($('studioLoomPhase').textContent!==label)$('studioLoomPhase').textContent=label;
    if(elapsed>=5350)finish();else raf=requestAnimationFrame(tick);
  }
  function open(source){
    if(active||!source||!source.width||!window.DaijinLoom)return;setup();
    snapshot=document.createElement('canvas');snapshot.width=source.width;snapshot.height=source.height;snapshot.getContext('2d').drawImage(source,0,0);
    returnFocus=document.activeElement;oldOverflow=document.body.style.overflow;document.body.style.overflow='hidden';
    hiddenSiblings=Array.from(document.body.children).filter(function(el){return el!==overlay&&el.tagName!=='SCRIPT'&&el.tagName!=='STYLE';}).map(function(el){var s={el:el,attr:el.getAttribute('aria-hidden'),inert:'inert' in el?el.inert:undefined};el.setAttribute('aria-hidden','true');if(s.inert!==undefined)el.inert=true;return s;});
    active=true;output=null;elapsed=0;last=0;overlay.hidden=false;overlay.classList.remove('is-finished');
    $('studioLoomTitle').textContent='让锦色在经纬间成形';$('studioLoomIntro').textContent='梭子引纬 往复成锦';$('studioLoomPhase').textContent='牵经引线';
    $('studioLoomWeaving').hidden=false;$('studioLoomResult').hidden=true;
    var c=$('studioLoomCanvas');c.width=600;c.height=760;c.setAttribute('aria-label','木质织机上 当前纹样随梭子往返逐行织成');fit();window.DaijinLoom.paint(c.getContext('2d'),snapshot,0,0);$('studioLoomSkip').focus({preventScroll:true});
    if(window.matchMedia('(prefers-reduced-motion: reduce)').matches)finish();else raf=requestAnimationFrame(tick);
  }
  window.DaijinWebLoom={open:open,close:close};
})();
