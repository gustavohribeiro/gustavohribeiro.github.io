(()=>{
const TS=new Date('2026-12-27T00:00:00'),TE=new Date('2027-01-16T23:59:59');
const f=n=>Math.round(n).toLocaleString('de-DE');const N=v=>{const n=parseFloat(String(v).replace(',','.'));return isFinite(n)?n:0};
const css=document.createElement('style');css.textContent=`
.alt-l{font-size:11px;font-weight:700;letter-spacing:.6px;color:var(--g);text-transform:uppercase;margin-bottom:10px}
.tl{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));position:relative;margin-top:6px}
.tl:before{content:'';position:absolute;left:16%;right:16%;top:13px;height:2px;background:var(--track)}
.tl>div{display:flex;flex-direction:column;align-items:center;gap:4px;text-align:center;position:relative}
.tl .dot{width:28px;height:28px;border-radius:50%;background:var(--track);display:grid;place-items:center;font-size:12px;font-weight:700;color:var(--mute)}
.tl .on .dot{background:var(--g);color:#070B16;box-shadow:0 0 0 6px rgba(110,139,255,.18)}
.tl .done .dot{background:var(--y);color:#070B16}
.sbar{display:flex;height:16px;border-radius:8px;overflow:hidden;gap:2px;margin:10px 0 12px}
.sbar i{display:block;height:100%}
.leg{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px 12px}
.leg div{display:flex;align-items:center;gap:8px;font-size:13px}.leg b{margin-left:auto;font-weight:600}
.leg s{width:10px;height:10px;border-radius:3px;flex:none;text-decoration:none}
.rings{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px;text-align:center}
.rings svg{width:76px;height:76px;display:block;margin:0 auto 6px}
.wf div.r{display:grid;grid-template-columns:92px minmax(0,1fr) 70px;align-items:center;gap:8px;padding:6px 0;font-size:13px}
.wf .t{height:12px;position:relative}.wf .t i{position:absolute;top:0;bottom:0;border-radius:4px}
.wf .v{text-align:right;font-weight:600}`;document.head.appendChild(css);
function data(){let S;try{S=JSON.parse(localStorage.getItem('brasilState2'))}catch(e){}if(!S)return null;
 const R=N(S.rate||5.9),my=i=>i.share==='me'?1:i.share==='luca'?0:.5,fv=i=>S.view==='me'?my(i):1,sp=id=>(S.spent||{})[id]||0;
 const pre=S.pre||[],it=S.items||[];
 const preT=pre.reduce((s,p)=>s+N(p.budget)*fv(p),0),preS=pre.reduce((s,p)=>s+sp(p.id)*fv(p),0);
 const brT=it.reduce((s,i)=>s+N(i.budget)*fv(i),0)/R,brS=it.reduce((s,i)=>s+sp(i.id)*fv(i),0)/R;
 const post=(S.costs||[]).reduce((s,c)=>s+N(c.amt)*N(c.months),0);
 const inc=(S.income||[]).filter(i=>i.on).reduce((s,i)=>s+N(i.amt),0);
 const preM=pre.reduce((s,p)=>s+Math.max(N(p.budget),sp(p.id))*my(p),0),brM=it.reduce((s,i)=>s+N(i.budget)*my(i),0)/R;
 const buf=inc-post-preM-brM,now=new Date(),ph=now<TS?0:now<=TE?1:2;
 return {preT,preS,brT,brS,post,inc,preM,brM,buf,ph,R}}
function ring(p,c){const C=2*Math.PI*30,fr=Math.max(0,Math.min(1,p));return '<svg viewBox="0 0 72 72" aria-hidden="true"><circle cx="36" cy="36" r="30" fill="none" stroke="var(--track)" stroke-width="8"/><circle cx="36" cy="36" r="30" fill="none" stroke="'+c+'" stroke-width="8" stroke-linecap="round" stroke-dasharray="'+(C*fr).toFixed(1)+' '+C.toFixed(1)+'" transform="rotate(-90 36 36)"/><text x="36" y="41" text-anchor="middle" font-size="15" font-weight="700" fill="var(--ink)">'+Math.round(fr*100)+'%</text></svg>'}
function draw(){const d=data(),box=document.getElementById('phaseAlt');if(!d||!box)return;
 const P=[['Vor der Reise',d.preS,d.preT,'#FFD84D'],['Brasilien',d.brS,d.brT,'#6E8BFF'],['Nach der Reise',0,d.post,'#38E1D6']];
 const A='<div class="card"><div class="alt-l">Variante A · Zeitstrahl</div><div class="tl">'+P.map((p,i)=>'<div class="'+(i===d.ph?'on':i<d.ph?'done':'')+'"><span class="dot">'+(i+1)+'</span><b style="font-size:13px">'+p[0]+'</b><span class="muted">'+f(p[2])+' €</span></div>').join('')+'</div><div class="row" style="margin-top:14px"><span class="muted">Puffer danach</span><b class="num'+(d.buf<0?' neg':'')+'" style="font-size:20px">'+f(d.buf)+' €</b></div></div>';
 const tot=Math.max(d.inc,d.preM+d.brM+d.post+Math.max(0,d.buf),1),seg=[['Vor der Reise',d.preM,'#FFD84D'],['Brasilien',d.brM,'#6E8BFF'],['Fixkosten',d.post,'#38E1D6'],['Puffer',Math.max(0,d.buf),'#3EE6A8']];
 const B='<div class="card"><div class="alt-l">Variante B · Wohin geht dein Geld</div><div class="row"><span class="muted">Dein Geld bis Februar</span><b class="num" style="font-size:22px">'+f(d.inc)+' €</b></div><div class="sbar">'+seg.map(s=>'<i style="width:'+(s[1]/tot*100)+'%;background:'+s[2]+'"></i>').join('')+'</div><div class="leg">'+seg.map(s=>'<div><s style="background:'+s[2]+'"></s>'+s[0]+'<b>'+f(s[1])+' €</b></div>').join('')+'</div>'+(d.buf<0?'<p class="muted neg" style="margin:10px 0 0">Es fehlen '+f(-d.buf)+' €</p>':'')+'</div>';
 const C='<div class="card"><div class="alt-l">Variante C · Ringe</div><div class="rings">'+P.map(p=>'<div>'+ring(p[2]?p[1]/p[2]:0,p[3])+'<b style="font-size:13px">'+p[0]+'</b><div class="muted">'+f(p[1])+' / '+f(p[2])+' €</div></div>').join('')+'</div><div class="row" style="margin-top:12px;padding-top:12px;border-top:1px solid var(--line)"><span class="muted">Puffer danach</span><b class="num'+(d.buf<0?' neg':'')+'" style="font-size:20px">'+f(d.buf)+' €</b></div></div>';
 const mx=Math.max(d.inc,1);let run=d.inc;const rows=[['Einnahmen',0,d.inc,'#3EE6A8',d.inc]];[['Vor der Reise',d.preM,'#FFD84D'],['Brasilien',d.brM,'#6E8BFF'],['Fixkosten',d.post,'#38E1D6']].forEach(s=>{const a=run-s[1];rows.push([s[0],Math.max(0,a),run,s[2],-s[1]]);run=a});
 const D='<div class="card"><div class="alt-l">Variante D · Geld-Fluss</div><div class="wf">'+rows.map(r=>'<div class="r"><span class="muted">'+r[0]+'</span><div class="t"><i style="left:'+(Math.min(r[1],r[2])/mx*100)+'%;width:'+(Math.abs(r[2]-r[1])/mx*100)+'%;background:'+r[3]+'"></i></div><span class="v">'+(r[4]<0?'−':'')+f(Math.abs(r[4]))+' €</span></div>').join('')+'<div class="r" style="border-top:1px solid var(--line);margin-top:4px;padding-top:10px"><b>Puffer</b><div class="t"><i style="left:0;width:'+(Math.max(0,d.buf)/mx*100)+'%;background:var(--g)"></i></div><span class="v'+(d.buf<0?' neg':'')+'">'+f(d.buf)+' €</span></div></div></div>';
 box.innerHTML=A+B+C+D}
function init(){const ph=document.getElementById('phases');if(!ph)return setTimeout(init,100);
 if(!document.getElementById('phaseAlt')){const b=document.createElement('div');b.id='phaseAlt';b.style.cssText='display:flex;flex-direction:column;gap:20px';ph.after(b)}
 new MutationObserver(()=>setTimeout(draw,0)).observe(ph,{childList:true});draw()}
init();
})();
