(function(){
 'use strict';
 function render(source,form){
  const c=document.createElement('canvas');c.width=900;c.height=1100;const g=c.getContext('2d');
  const bg=g.createLinearGradient(0,0,900,1100);bg.addColorStop(0,'#eee8d9');bg.addColorStop(1,'#d3d0bd');g.fillStyle=bg;g.fillRect(0,0,900,1100);
  g.strokeStyle='rgba(95,104,77,.045)';g.lineWidth=1;for(let i=0;i<1100;i+=6){g.beginPath();g.moveTo(0,i);g.lineTo(900,i);g.stroke();}
  function path(points){g.beginPath();points.forEach((p,i)=>{if(i)g.lineTo(p[0],p[1]);else g.moveTo(p[0],p[1]);});g.closePath();}
  function polygon(points,fill,shadow){g.save();if(shadow){g.shadowColor='rgba(30,40,24,.25)';g.shadowBlur=28;g.shadowOffsetY=20;}path(points);g.fillStyle=fill;g.fill();g.restore();}
  function triangle(s,d){
   const x0=s[0][0],y0=s[0][1],x1=s[1][0],y1=s[1][1],x2=s[2][0],y2=s[2][1];
   const den=x0*(y1-y2)+x1*(y2-y0)+x2*(y0-y1);
   function coef(k){return [(d[0][k]*(y1-y2)+d[1][k]*(y2-y0)+d[2][k]*(y0-y1))/den,(d[0][k]*(x2-x1)+d[1][k]*(x0-x2)+d[2][k]*(x1-x0))/den,(d[0][k]*(x1*y2-x2*y1)+d[1][k]*(x2*y0-x0*y2)+d[2][k]*(x0*y1-x1*y0))/den];}
   const a=coef(0),b=coef(1);g.save();path(d);g.clip();g.transform(a[0],b[0],a[1],b[1],a[2],b[2]);g.drawImage(source,0,0);g.restore();
  }
  function fabric(map,steps){
   const outline=[];for(let i=0;i<=steps;i++)outline.push(map(i/steps,0));for(let i=1;i<=steps;i++)outline.push(map(1,i/steps));for(let i=steps-1;i>=0;i--)outline.push(map(i/steps,1));for(let i=steps-1;i>0;i--)outline.push(map(0,i/steps));polygon(outline,'#b0a68b',true);
   for(let y=0;y<steps;y++)for(let x=0;x<steps;x++){
    const u=x/steps,v=y/steps,U=(x+1)/steps,V=(y+1)/steps;
    const p=[map(u,v),map(U,v),map(U,V),map(u,V)],s=[[u*source.width,v*source.height],[U*source.width,v*source.height],[U*source.width,V*source.height],[u*source.width,V*source.height]];
    triangle([s[0],s[1],s[2]],[p[0],p[1],p[2]]);triangle([s[0],s[2],s[3]],[p[0],p[2],p[3]]);
   }
   g.save();path(outline);g.clip();const shine=g.createLinearGradient(130,0,800,0);shine.addColorStop(0,'rgba(255,255,235,.17)');shine.addColorStop(.26,'rgba(0,25,18,.18)');shine.addColorStop(.42,'rgba(255,255,245,.22)');shine.addColorStop(.65,'rgba(0,20,12,.17)');shine.addColorStop(1,'rgba(255,255,235,.13)');g.fillStyle=shine;g.fillRect(0,200,900,750);
   g.strokeStyle='rgba(255,255,235,.15)';g.lineWidth=.8;for(let i=220;i<940;i+=3){g.beginPath();g.moveTo(0,i);g.lineTo(900,i);g.stroke();}g.restore();g.strokeStyle='rgba(245,233,195,.7)';g.lineWidth=2;path(outline);g.stroke();
  }
  g.fillStyle='#a48249';g.font='17px sans-serif';g.fillText('傣锦纹录 / 我的锦色',64,74);
  g.fillStyle='#214c43';g.font='48px KaiTi, STKaiti, serif';g.fillText({square:'一方锦色 随身相伴',bookmark:'把锦色 留在书页间',scroll:'经纬成卷 锦色入室'}[form],64,145);
  g.font='18px sans-serif';g.fillStyle='#73806c';g.fillText('你的纹样搭配 走入日常生活',67,185);
  if(form==='square'){
   polygon([[84,360],[710,280],[850,790],[260,930]],'#c6c3af',false);
   fabric((u,v)=>[132+589*u+38*v+14*Math.sin(v*5+u*3),298+540*v+39*u+18*Math.sin(u*Math.PI*4)*(0.35+v*.65)],22);
   g.strokeStyle='#ded1a9';g.lineWidth=1;for(let i=0;i<44;i++){const u=i/43,x=132+589*u+38+14*Math.sin(5+u*3),y=838+39*u+18*Math.sin(u*Math.PI*4);g.beginPath();g.moveTo(x,y);g.lineTo(x+2,y+9);g.stroke();}
  }else if(form==='bookmark'){
   polygon([[95,350],[403,286],[797,350],[805,878],[420,823],[91,894]],'#bbb6a1',true);
   polygon([[103,337],[418,288],[420,813],[102,870]],'#f7f2e4');polygon([[420,288],[789,339],[794,864],[420,813]],'#e9e2d1');
   g.strokeStyle='#cbc5b2';g.lineWidth=1;for(let i=0;i<27;i++){g.beginPath();g.moveTo(143,400+i*14);g.lineTo(366,365+i*14);g.stroke();g.beginPath();g.moveTo(460,365+i*14);g.lineTo(737,402+i*14);g.stroke();}
   const spine=g.createLinearGradient(388,0,455,0);spine.addColorStop(0,'rgba(74,57,31,0)');spine.addColorStop(.5,'rgba(74,57,31,.19)');spine.addColorStop(1,'rgba(74,57,31,0)');g.fillStyle=spine;g.fillRect(388,300,67,512);
   fabric((u,v)=>[500+141*u-48*v,325+13*u+402*v],1);
   g.fillStyle='#bfa05b';g.beginPath();g.arc(568,349,6,0,Math.PI*2);g.fill();g.strokeStyle='#a07a39';g.lineWidth=4;g.beginPath();g.moveTo(568,349);g.bezierCurveTo(582,282,655,287,668,346);g.stroke();for(let i=0;i<13;i++){g.beginPath();g.moveTo(666+i*.5,337);g.lineTo(645+i*3,400+Math.sin(i)*5);g.stroke();}
  }else{
   g.strokeStyle='#a38b62';g.lineWidth=3;g.beginPath();g.moveTo(120,415);g.lineTo(450,305);g.lineTo(780,415);g.stroke();
   polygon([[90,400],[810,400],[810,795],[90,795]],'#e5dcc6',true);
   fabric((u,v)=>[130+640*u,440+320*v+5*Math.sin(u*Math.PI*3)],18);
   [97,788].forEach(x=>{const wood=g.createLinearGradient(x,0,x+20,0);wood.addColorStop(0,'#5c402d');wood.addColorStop(.45,'#b18b58');wood.addColorStop(1,'#4c3628');g.fillStyle=wood;g.fillRect(x,386,20,424);g.fillStyle='#6b4e32';g.fillRect(x-4,382,28,12);g.fillRect(x-4,804,28,12);});
  }
  g.strokeStyle='#b9b99e';g.lineWidth=1;g.beginPath();g.moveTo(64,975);g.lineTo(836,975);g.stroke();g.fillStyle='#214c43';g.font='29px KaiTi, STKaiti, serif';g.fillText('傣锦纹录',64,1024);g.font='16px sans-serif';g.fillStyle='#6c7967';g.textAlign='right';g.fillText('使用效果示意',836,1019);g.fillText('纹样来自本次创作',836,1047);
  return c;
 }
 window.DaijinMockup={render:render};
})();
