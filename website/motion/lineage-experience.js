/* Circular layout restored from charts/exports/transmission.svg.
   SITE remains the authority for people and directed relationships.
   Equal line widths carry no quantity. No timer or automatic selection. */
(function () {
  'use strict';
  const host = document.querySelector('.lineage');
  const data = window.SITE;
  if (!host || !data || !Array.isArray(data.people)) return;
  const people = new Map(data.people.map(p => [p.id, p]));
  const src = {
    yu: { title: '玉儿甩 国家级代表性传承人档案', url: 'https://www.ihchina.cn/ccr_detail/3384/' },
    ye: { title: '叶娟 国家级代表性传承人档案', url: 'https://www.ihchina.cn/art/detail/id/3113.html' },
    mi: { title: '咪么 云南省非遗传承人档案', url: 'https://www.ynich.cn/men/631.html' },
    workshop: { title: '2013年曼洪村织锦培训报道', url: 'https://www.ynich.cn/news/new/1108.html' }
  };
  const routes = [
    { id: 'grandmother', label: '祖孙相授', source: 'yu', learner: 'person-yuershuai',
      nodes: ['person-yuzhuang', 'person-yuershuai'], roles: ['祖母 传授', '孙女 学艺'],
      links: ['15岁开始学艺'], caption: '从祖母身边，走向传习课堂。' },
    { id: 'mother-ye', label: '母女相传', source: 'ye', learner: 'person-yejuan',
      nodes: ['person-yula', 'person-yejuan'], roles: ['母亲 传授', '女儿 学艺'],
      links: ['11岁开始学艺'], caption: '母亲是最初的织锦老师。' },
    { id: 'mother-mi', label: '母女与师徒', source: 'mi', learner: 'person-mime',
      nodes: ['person-mime-mother', 'person-mime', 'person-mixiangzai'], roles: ['母亲 传授', '女儿 传授', '徒弟 学艺'],
      links: ['13岁开始学艺', '师徒相授'], caption: '从母亲那里学来，再交到徒弟手中。' }
  ];
  const stories = {
    'person-yuzhuang': { kicker: '祖孙之间', title: '祖母的经纬', text: '玉庄将织锦技艺传授给孙女玉儿甩。15岁时开始的学艺，成为玉儿甩后来传习授课的起点。', sources: ['yu'] },
    'person-yuershuai': { kicker: '从学艺到授课', title: '玉儿甩', text: '15岁随祖母玉庄学习织锦。2013年，她受邀来到勐海曼洪村，为傣族织锦技艺培训班授课。', sources: ['yu', 'workshop'] },
    'person-yula': { kicker: '母女之间', title: '母亲的教习', text: '玉腊是叶娟的母亲，也是她学习傣族织锦的老师。叶娟11岁时，便开始在母亲身边学艺。', sources: ['ye'] },
    'person-yejuan': { kicker: '从家中启蒙', title: '叶娟', text: '11岁随母亲玉腊学习傣族织锦。2009年，叶娟入选第三批国家级非物质文化遗产项目代表性传承人。', sources: ['ye'] },
    'person-mime-mother': { kicker: '母女之间', title: '母女传艺', text: '咪么13岁时，开始向母亲学习纺线染线与织造。这段家中的学艺经历，连接着她此后的传承。', sources: ['mi'] },
    'person-mime': { kicker: '母女与师徒', title: '咪么', text: '13岁随母亲学习纺线染线与织造。后来，咪香再成为她的徒弟，手艺沿着师徒关系继续传授。', sources: ['mi'] },
    'person-mixiangzai': { kicker: '师徒相授', title: '咪香再', text: '咪香再师从咪么。织锦的传授从家庭走向师徒，让学艺的路径继续延伸。', sources: ['mi'] },
    'event-manhong-training-2013': { kicker: '2013 勐海曼洪村', title: '村寨传习', text: '西双版纳州文化馆与勐遮镇政府共同举办傣族织锦技艺培训班，邀请玉儿甩授课。家中学来的手艺，在村寨课堂中继续传授。', sources: ['workshop'] }
  };
  const esc = str => String(str || '').replace(/[&<>"']/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[c]));
  const order = ['person-yuzhuang','person-yuershuai','person-yula','person-yejuan','person-mime-mother','person-mime','person-mixiangzai','org-xishuangbanna-cultural-center','org-mengzhe-government','event-manhong-training-2013'].filter(id => people.has(id));
  const types = {
    kinship:{label:'亲属',color:'#91a06d'}, learning:{label:'学艺',color:'#347d67'},
    apprenticeship:{label:'师徒',color:'#6b9b87'}, co_organizing:{label:'举办',color:'#b38b42'},
    workshop_teaching:{label:'授课',color:'#568e9c'}
  };
  const relations = (data.relations || []).filter(r => order.includes(r.s) && order.includes(r.t) && types[r.type]);
  const positions = new Map(order.map((id,i) => {
    const angle = -Math.PI/2+i*Math.PI*2/order.length;
    return [id,{x:300+180*Math.cos(angle),y:300+180*Math.sin(angle),labelX:50+38*Math.cos(angle),labelY:50+38*Math.sin(angle)}];
  }));
  const labels = {
    'person-mime-mother':['咪么','母亲'],
    'org-xishuangbanna-cultural-center':['州文化馆'],
    'org-mengzhe-government':['勐遮镇','政府'],
    'event-manhong-training-2013':['2013','曼洪培训']
  };
  for (const id of order) {
    if (!stories[id]) {
      const p=people.get(id);
      stories[id]={kicker:'村寨传习',title:p.label,text:p.summary,sources:['workshop']};
    }
  }
  function arc(r) {
    const a=positions.get(r.s),b=positions.get(r.t);
    // Separate the kinship and learning arcs between the same two people.
    const offset=r.type==='kinship'?-32:r.type==='learning'?22:0;
    const dx=b.x-a.x,dy=b.y-a.y,length=Math.hypot(dx,dy)||1;
    const control={x:300-dy/length*offset,y:300+dx/length*offset};
    const inset=(point,distance)=>{const dx=control.x-point.x,dy=control.y-point.y,l=Math.hypot(dx,dy)||1;return {x:point.x+dx/l*distance,y:point.y+dy/l*distance};};
    const start=inset(a,8),end=inset(b,12);
    return `M${start.x.toFixed(2)} ${start.y.toFixed(2)}Q${control.x.toFixed(2)} ${control.y.toFixed(2)} ${end.x.toFixed(2)} ${end.y.toFixed(2)}`;
  }
  host.classList.add('lineage-experience');
  host.id = 'lineage';
  host.setAttribute('aria-label', '傣锦师承与学艺互动关系图');
  host.innerHTML = `
    <header class="lc-head">
      <div><h3>一线相承</h3><p>家中启蒙，师徒相授，村寨传习。</p></div>
    </header>
    <div class="lc-layout">
      <div class="lc-visual">
        <div class="lc-circle" role="group" aria-label="环形师承关系，点击人名阅读故事">
          <svg class="lc-graph" viewBox="0 0 600 600" aria-hidden="true">
            <defs>${Object.entries(types).map(([id,t])=>`<marker id="lc-arrow-${id}" viewBox="0 -3 6 6" refX="5" refY="0" markerWidth="5" markerHeight="5" orient="auto"><path d="M0 -3L6 0L0 3" fill="${t.color}"/></marker>`).join('')}</defs>
            <circle class="lc-ring" cx="300" cy="300" r="180"/>
            ${relations.map(r=>`<path class="lc-relation lc-${r.type}" d="${arc(r)}" stroke="${types[r.type].color}" data-lc-source="${esc(r.s)}" data-lc-target="${esc(r.t)}" data-lc-type="${r.type}" ${r.type==='kinship'?'stroke-dasharray="5 5"':`marker-end="url(#lc-arrow-${r.type})"`}><title>${esc(people.get(r.s).label)}到${esc(people.get(r.t).label)} ${esc(r.label)}</title></path>`).join('')}
            ${order.map(id=>{const p=people.get(id),q=positions.get(id);return `<g class="lc-dot" data-lc-dot="${id}">${p.type==='person'?`<circle cx="${q.x}" cy="${q.y}" r="8"/>`:`<rect x="${q.x-8}" y="${q.y-8}" width="16" height="16" rx="${p.type==='training_event'?5:1}"/>`}</g>`;}).join('')}
          </svg>
          ${order.map(id=>{const q=positions.get(id);return `<button class="lc-node" type="button" data-lx-person="${id}" aria-pressed="false" aria-controls="lineageStory" aria-label="查看${esc(people.get(id).label)}" style="left:${q.labelX}%;top:${q.labelY}%">${(labels[id]||[people.get(id).label]).map(t=>`<span>${esc(t)}</span>`).join('')}</button>`;}).join('')}
        </div>
        <div class="lc-legend" aria-label="关系类型">${Object.entries(types).map(([id,t])=>`<span><i class="${id==='kinship'?'is-dashed':''}" style="--lc-key:${t.color}"></i>${t.label}</span>`).join('')}</div>
      </div>
      <aside class="lc-story" id="lineageStory" aria-live="polite" aria-atomic="true"></aside>
    </div>`;

  const story = host.querySelector('.lc-story');
  const allNodes = [...host.querySelectorAll('[data-lx-person]')];
  let current = 'person-yuershuai';
  function select(id, sync = true) {
    if (!stories[id]) id = 'person-yuershuai';
    current = id;
    const r = routes.find(x => x.nodes.includes(id));
    const s = stories[id];
    allNodes.forEach(n => n.setAttribute('aria-pressed', String(n.dataset.lxPerson === id)));
    host.querySelectorAll('.lc-relation').forEach(path => path.classList.toggle('is-chosen',path.dataset.lcSource===id||path.dataset.lcTarget===id||!!r&&r.nodes.includes(path.dataset.lcSource)&&r.nodes.includes(path.dataset.lcTarget)));
    host.querySelectorAll('.lc-dot').forEach(dot => dot.classList.toggle('is-chosen',dot.dataset.lcDot===id));
    const p = people.get(id);
    story.innerHTML = `<p class="lc-story-kicker">${esc(s.kicker)}</p><h4>${esc(s.title)}</h4>
      ${p && p.age ? `<p class="lc-story-age"><b>${p.age}</b><span>岁开始学艺</span></p>` : ''}
      <p class="lc-story-text">${esc(s.text)}</p>
      <details class="lc-story-source"><summary>阅读资料</summary>${s.sources.map(k => `<a href="${src[k].url}" target="_blank" rel="noreferrer">${esc(src[k].title)} ↗</a>`).join('')}</details>`;
    if (sync) {
      const u = new URL(location.href); u.searchParams.set('lineage', id);
      history.replaceState(history.state, '', u.href);
    }
  }
  allNodes.forEach(n => n.addEventListener('click', () => select(n.dataset.lxPerson)));
  const keyOrder = allNodes;
  host.addEventListener('keydown', e => {
    if (!['ArrowRight','ArrowLeft','ArrowDown','ArrowUp','Home','End'].includes(e.key)) return;
    const index = keyOrder.indexOf(document.activeElement); if (index < 0) return;
    e.preventDefault();
    const next = e.key === 'Home' ? 0 : e.key === 'End' ? keyOrder.length - 1 : (index + (e.key === 'ArrowRight' || e.key === 'ArrowDown' ? 1 : -1) + keyOrder.length) % keyOrder.length;
    keyOrder[next].focus({preventScroll:true}); keyOrder[next].click();
  });
  window.addEventListener('popstate', () => select(new URLSearchParams(location.search).get('lineage'), false));
  select(new URLSearchParams(location.search).get('lineage'), false);
  const oldList=document.getElementById('peopleTrack');
  if(oldList){oldList.hidden=true;oldList.dataset.lineageReplaced='true';}
  window.DaijinLineage = { select, getSelection: () => current, ready: true };
})();
