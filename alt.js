(()=>{
const TS=new Date('2026-12-27T00:00:00'),TE=new Date('2027-01-16T23:59:59');
const f=n=>Math.round(n).toLocaleString('de-DE');const N=v=>{const n=parseFloat(String(v).replace(',','.'));return isFinite(n)?n:0};
const e=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const css=document.createElement('style');css.textContent=`
.alt-l{font-size:11px;font-weight:700;letter-spacing:.6px;color:var(--g);text-transform:uppercase;margin-bottom:10px}
.ck{display:flex;align-items:center;gap:10px;padding:7px 0;font-size:14px}.ck i{width:18px;height:18px;border-radius:6px;border:2px solid var(--dim);flex:none}.ck.done i{background:var(--g);border-color:var(--g)}.ck b{margin-left:auto;font-weight:600}
.chips2{display:flex;gap:8px;flex-wrap:wrap;margin-top:12px}.chips2 button{background:var(--track);border:0;color:var(--ink);border-radius:999px;padding:7px 12px;font:600 12px Inter,sans-serif;cursor:pointer}
.car{display:flex;gap:12px;overflow-x:auto;scroll-snap-type:x mandatory;margin:0 -16px;padding:0 16px 4px;scrollbar-width:none}.car::-webkit-scrollbar{display:none}
.car>button{flex:0 0 82%;scroll-snap-align:center;text-align:left;background:var(--card);border:0;color:inherit;font:inherit;border-radius:24px;padding:18px;cursor:pointer;display:flex;flex-direction:column;gap:8px}
.cdots{display:flex;gap:6px;justify-content:center;margin-top:10px}.cdots i{width:6px;height:6px;border-radius:3px;background:var(--track)}
.amp>button{display:flex;align-items:center;gap:12px;width:100%;background:none;border:0;border-bottom:1px solid var(--line);color:inherit;font:inherit;padding:12px 0;cursor:pointer;text-align:left}.amp>button:last-child{border-bottom:0}
.st{font-size:11px;font-weight:700;padding:3px 8px;border-radius:999px;white-space:nowrap}`;document.head.appendChild(css);
function data(){let S;try{S=JSON.parse(localStorage.getItem('brasilState2'))}catch(x){}if(!S)return null;
 const R=N(S.rate||5.9),my=i=>i.share==='me'?1:i.share==='luca'?0:.5,fv=i=>S.view==='me'?my(i):1,sp=id=>(S.spent||{})[id]||0;
 const pre=S.pre||[],it=S.items||[],costs=S.costs||[];
 const preT=pre.reduce((s,p)=>s+N(p.budget)*fv(p),0),preS=pre.reduce((s,p)=>s+sp(p.id)*fv(p),0);
 const brT=it.reduce((s,i)=>s+N(i.budget)*fv(i),0)/R,brS=it.reduce((s,i)=>s+sp(i.id)*fv(i),0)/R;
 const post=costs.reduce((s,c)=>s+N(c.amt)*N(c.months),0);
 const inc=(S.income||[]).filter(i=>i.on).reduce((s,i)=>s+N(i.amt),0);
 const preM=pre.reduce((s,p)=>s+Math.max(N(p.budget),sp(p.id))*my(p),0),brM=it.reduce((s,i)=>s+N(i.budget)*my(i),0)/R;
 const buf=inc-post-preM-brM,now=new Date(),ph=now<TS?0:now<=TE?1:2;
 return {S,R,pre,it,costs,sp,fv,preT,preS,brT,brS,post,inc,preM,brM,buf,ph}}
function status(s,t){if(!t)return['Leer','var(--track)','var(--mute)'];const r=s/t;return r>1?['Drüber','rgba(255,122,107,.18)','var(--r)']:r>.85?['Knapp','rgba(245,197,66,.18)','var(--y)']:['Im Plan','rgba(91,216,138,.16)','var(--g)']}
function draw(){const d=data(),box=document.getElementById('phaseAlt');if(!d||!box)return;
 const names=['Vor der Reise','Brasilien','Nach der Reise'],keys=['pre','br','post'];
 let list='';if(d.ph===0)list=d.pre.map(p=>{const s=d.sp(p.id),b=N(p.budget);return '<div class="ck'+(s>=b&&b>0?' done':'')+'"><i></i>'+e(p.label)+'<b>'+f(s)+' / '+f(b)+' €</b></div>'}).join('');
 else if(d.ph===1)list=d.it.slice().sort((a,b)=>N(b.budget)-N(a.budget)).slice(0,4).map(i=>'<div class="ck"><i></i>'+e(i.label)+'<b>'+f(d.sp(i.id))+' / '+f(N(i.budget))+' R$</b></div>').join('');
 else list=d.costs.slice(0,4).map(c=>'<div class="ck"><i></i>'+e(c.label)+'<b>'+f(N(c.amt))+' €</b></div>').join('');
 const curT=[d.preT,d.brT,d.post][d.ph],curS=[d.preS,d.brS,0][d.ph];
 const E='<div class="card"><div class="alt-l">Variante E · Jetzt dran</div><div class="row"><h2>'+names[d.ph]+'</h2><span class="muted">noch '+f(curT-curS)+' €</span></div><div style="margin-top:8px">'+list+'</div><div class="chips2">'+names.map((n,i)=>i===d.ph?'':'<button data-go="'+keys[i]+'">'+(i<d.ph?'Vorher: ':'Danach: ')+n+' · '+f([d.preT,d.brT,d.post][i])+' €</button>').join('')+'</div></div>';
 const cards=[[0,d.preS,d.preT],[1,d.brS,d.brT],[2,0,d.post]].map(([i,s,t])=>{const st=status(s,t);return '<button data-go="'+keys[i]+'"><div class="row"><span class="muted" style="font-weight:600">'+names[i]+'</span><span class="st" style="background:'+st[1]+';color:'+st[2]+'">'+(i===d.ph?'Jetzt':st[0])+'</span></div><div class="num" style="font-size:32px">'+f(t-s)+' €</div><span class="muted">übrig von '+f(t)+' €</span><div class="bar" style="margin-top:4px"><i style="width:'+Math.min(100,t?s/t*100:0)+'%"></i></div></button>'}).join('');
 const F='<div><div class="alt-l" style="padding:0 4px">Variante F · Wischen</div><div class="car">'+cards+'</div><div class="cdots">'+[0,1,2].map(i=>'<i style="'+(i===d.ph?'background:var(--g);width:16px':'')+'"></i>').join('')+'</div></div>';
 const cpm=d.post/3,pts=[['Heute',d.inc]];let bal=d.inc-d.preM;const br1=d.brM*5/20,br2=d.brM-br1;
 bal-=br1+cpm;pts.push(['Ende Dez',bal]);bal-=br2+cpm;pts.push(['Ende Jan',bal]);bal-=cpm;pts.push(['Ende Feb',bal]);
 const vals=pts.map(p=>p[1]),mx=Math.max(...vals,1),mn=Math.min(...vals,0),W=300,H=110,px=i=>20+i*(W-40)/3,py=v=>12+(mx-v)/(mx-mn||1)*(H-34);
 const line=pts.map((p,i)=>(i?'L':'M')+px(i).toFixed(1)+' '+py(p[1]).toFixed(1)).join(' ');
 const G='<div class="card"><div class="alt-l">Variante G · Kontostand-Verlauf</div><div class="row"><span class="muted">Ende Februar</span><b class="num'+(bal<0?' neg':'')+'" style="font-size:22px">'+f(bal)+' €</b></div><svg viewBox="0 0 '+W+' '+H+'" style="width:100%;height:auto;margin-top:8px" role="img" aria-label="Kontostand-Verlauf">'+(mn<0?'<line x1="10" x2="'+(W-10)+'" y1="'+py(0)+'" y2="'+py(0)+'" stroke="var(--r)" stroke-dasharray="3 4" stroke-width="1"/>':'')+'<path d="'+line+' L'+px(3)+' '+(H-22)+' L'+px(0)+' '+(H-22)+'Z" fill="rgba(91,216,138,.12)"/><path d="'+line+'" fill="none" stroke="var(--g)" stroke-width="2.5" stroke-linejoin="round"/>'+pts.map((p,i)=>'<circle cx="'+px(i)+'" cy="'+py(p[1])+'" r="4" fill="'+(p[1]<0?'var(--r)':'var(--g)')+'"/><text x="'+px(i)+'" y="'+(H-6)+'" text-anchor="middle" font-size="10" fill="var(--mute)">'+p[0]+'</text>').join('')+'</svg><div class="row" style="margin-top:4px">'+pts.map(p=>'<span class="muted" style="font-size:11px;flex:1;text-align:center">'+f(p[1])+' €</span>').join('')+'</div></div>';
 const H2='<div class="card amp"><div class="alt-l">Variante H · Ampel</div>'+[[0,d.preS,d.preT],[1,d.brS,d.brT],[2,0,d.post]].map(([i,s,t])=>{const st=status(s,t);return '<button data-go="'+keys[i]+'"><span class="st" style="background:'+st[1]+';color:'+st[2]+'">'+st[0]+'</span><span style="flex:1;font-weight:500">'+names[i]+'</span><span class="amt">'+f(t-s)+' €<span class="eq">übrig</span></span></button>'}).join('')+'<div class="row" style="padding-top:12px"><span class="muted">Puffer danach</span><b class="num'+(d.buf<0?' neg':'')+'" style="font-size:20px">'+f(d.buf)+' €</b></div></div>';
 box.innerHTML=E+F+G+H2}
function init(){const ph=document.getElementById('phases');if(!ph)return setTimeout(init,100);
 if(!document.getElementById('phaseAlt')){const b=document.createElement('div');b.id='phaseAlt';b.style.cssText='display:flex;flex-direction:column;gap:20px';ph.after(b)}
 new MutationObserver(()=>setTimeout(draw,0)).observe(ph,{childList:true});draw()}
init();
})();
