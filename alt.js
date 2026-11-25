(()=>{
const TS=new Date('2026-12-27T00:00:00'),TE=new Date('2027-01-16T23:59:59');
const f=n=>Math.round(n).toLocaleString('de-DE');const N=v=>{const n=parseFloat(String(v).replace(',','.'));return isFinite(n)?n:0};
const css=document.createElement('style');css.textContent=`
.car{display:flex;gap:12px;overflow-x:auto;scroll-snap-type:x mandatory;margin:0 -16px;padding:0 16px 4px;scrollbar-width:none}.car::-webkit-scrollbar{display:none}
.car>button{flex:0 0 82%;scroll-snap-align:center;text-align:left;background:var(--card);border:0;color:inherit;font:inherit;border-radius:24px;padding:18px;cursor:pointer;display:flex;flex-direction:column;gap:8px}
.cdots{display:flex;gap:6px;justify-content:center;margin-top:10px}.cdots i{width:6px;height:6px;border-radius:3px;background:var(--track);transition:all .25s}.cdots i.on{background:var(--g);width:16px}
.st{font-size:11px;font-weight:700;padding:3px 8px;border-radius:999px;white-space:nowrap}`;document.head.appendChild(css);
function data(){let S;try{S=JSON.parse(localStorage.getItem('brasilState2'))}catch(x){}if(!S)return null;
 const R=N(S.rate||5.9),fv=i=>S.view==='me'?(i.share==='me'?1:i.share==='luca'?0:.5):1,sp=id=>(S.spent||{})[id]||0;
 const pre=S.pre||[],it=S.items||[],costs=S.costs||[];
 const preT=pre.reduce((s,p)=>s+N(p.budget)*fv(p),0),preS=pre.reduce((s,p)=>s+sp(p.id)*fv(p),0);
 const brT=it.reduce((s,i)=>s+N(i.budget)*fv(i),0)/R,brS=it.reduce((s,i)=>s+sp(i.id)*fv(i),0)/R;
 const post=costs.reduce((s,c)=>s+N(c.amt)*N(c.months),0);
 const now=new Date(),ph=now<TS?0:now<=TE?1:2;
 return {preT,preS,brT,brS,post,ph}}
function status(s,t){if(!t)return['Leer','var(--track)','var(--mute)'];const r=s/t;return r>1?['Drüber','rgba(255,122,107,.18)','var(--r)']:r>.85?['Knapp','rgba(245,197,66,.18)','var(--y)']:['Im Plan','rgba(91,216,138,.16)','var(--g)']}
function draw(){const d=data(),box=document.getElementById('phaseAlt');if(!d||!box)return;
 const names=['Vor der Reise','Brasilien','Nach der Reise'],keys=['pre','br','post'];
 const cards=[[0,d.preS,d.preT],[1,d.brS,d.brT],[2,0,d.post]].map(([i,s,t])=>{const st=status(s,t);return '<button data-go="'+keys[i]+'"><div class="row"><span class="muted" style="font-weight:600">'+names[i]+'</span><span class="st" style="background:'+st[1]+';color:'+st[2]+'">'+(i===d.ph?'Jetzt':st[0])+'</span></div><div class="num" style="font-size:32px">'+f(t-s)+' €</div><span class="muted">übrig von '+f(t)+' €</span><div class="bar" style="margin-top:4px"><i style="width:'+Math.min(100,t?s/t*100:0)+'%"></i></div></button>'}).join('');
 document.getElementById('phases').style.display='none';box.innerHTML='<div class="car">'+cards+'</div><div class="cdots"><i></i><i></i><i></i></div>';
 const car=box.querySelector('.car'),dots=box.querySelectorAll('.cdots i'),set=i=>dots.forEach((x,j)=>x.classList.toggle('on',j===i));set(d.ph);
 requestAnimationFrame(()=>{const c=car.children[d.ph];if(c)car.scrollLeft=c.offsetLeft-16});
 car.addEventListener('scroll',()=>{const w=car.children[0].offsetWidth+12;set(Math.round(car.scrollLeft/w))},{passive:true})}
function init(){const ph=document.getElementById('phases');if(!ph)return setTimeout(init,100);
 if(!localStorage.getItem('brasilState2')){const v=document.querySelector('[data-view].on');if(v)v.click()}
 if(!document.getElementById('phaseAlt')){const b=document.createElement('div');b.id='phaseAlt';ph.after(b)}
 new MutationObserver(()=>setTimeout(draw,0)).observe(ph,{childList:true});draw()}
init();
init=null;
})();
