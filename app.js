{
const COLORS=['#3EE6A8','#4CC9FF','#FFD84D','#FF9E7A','#A78BFA','#FF7AC6','#B6F36A','#2DD4BF'];
const DEF={rate:5.9,
 groups:[{id:'g1',name:'Uber'},{id:'g2',name:'Essen'},{id:'g3',name:'Unternehmungen'},{id:'g4',name:'Sonstiges'}],
 items:[
  {id:'i1',gid:'g1',label:'Zur Oma (Betim)',note:'12 Tage à 130 R$',budget:1560},{id:'i2',gid:'g1',label:'Flughafen Confins',note:'Hin + zurück',budget:260},{id:'i3',gid:'g1',label:'Fahrten nach BH',note:'ca. 6 Tage',budget:720},
  {id:'i4',gid:'g2',label:'Einkauf Familie',note:'300 R$ pro Woche',budget:900},{id:'i5',gid:'g2',label:'Snacks unterwegs',note:'Açaí, Pão de queijo',budget:1000},{id:'i6',gid:'g2',label:'Restaurants',note:'ca. 8× zu zweit',budget:1200},
  {id:'i7',gid:'g3',label:'Silvester',note:'Réveillon',budget:500},{id:'i8',gid:'g3',label:'Ausflüge',note:'Inhotim, Ouro Preto',budget:800},{id:'i9',gid:'g3',label:'Freizeit',note:'Kino, Shopping',budget:400},
  {id:'i10',gid:'g4',label:'Geschenke',note:'Familie',budget:500},{id:'i11',gid:'g4',label:'Chip & Apotheke',note:'Prepaid, Sonnencreme',budget:200},{id:'i12',gid:'g4',label:'Puffer',note:'Für Unerwartetes',budget:220}],
 pre:[{id:'p1',label:'dm-Geschenke für die Familie',note:'Schätzung',budget:80},{id:'p2',label:'Süßigkeiten zum Mitnehmen',note:'Schätzung',budget:40},{id:'p3',label:'Anzug Gustavo (Hochzeit)',note:'Schätzung',budget:150},{id:'p4',label:'Anzug Luca (Hochzeit)',note:'Schätzung',budget:150}],
 spent:{},log:[],smoke:{start:null,price:null,perDay:null},
 income:[{id:'n1',label:'Kontostand jetzt',amt:0,on:true}],
 costs:[{id:'c1',label:'Miete',amt:0,months:1}]};
const TRIP_START=new Date('2026-12-27T00:00:00'),TRIP_END=new Date('2027-01-16T23:59:59'),TRIP_DAYS=20,DAY=864e5;
let S=JSON.parse(JSON.stringify(DEF));try{const l=JSON.parse(localStorage.getItem('brasilState2')||'null');if(l)S=l}catch(e){}
if(/^#import=/.test(location.hash)){try{const raw=location.hash.slice(8).replace(/-/g,'+').replace(/_/g,'/');S=JSON.parse(decodeURIComponent(escape(atob(raw))));localStorage.setItem('brasilState2',JSON.stringify(S));history.replaceState(null,'','#start')}catch(e){}}
if(!S.pre)S.pre=JSON.parse(JSON.stringify(DEF.pre));
S.pre.forEach(p=>{if(!p.share)p.share=/Anzug Gustavo/.test(p.label)?'me':/Anzug Luca/.test(p.label)?'luca':'both'});
S.items.forEach(i=>{if(!i.share)i.share='both'});
{const OLD={'#5BD88A':'#3EE6A8','#6CB8FF':'#4CC9FF','#F5C542':'#FFD84D','#A3A7B0':'#A78BFA','#FF9F6B':'#FF9E7A','#C49BFF':'#A78BFA','#FF7AB6':'#FF7AC6','#4FD1C5':'#2DD4BF'};S.groups.forEach((g,k)=>{if(OLD[g.color])g.color=OLD[g.color];if(!g.color)g.color=COLORS[k%COLORS.length]})}
S.costs.forEach(c=>{if(c.label==='Business-Abos'&&!c.parts){c.parts=[{label:'Claude Max',amt:91},{label:'Google One',amt:22},{label:'Framer (gustavoh.de)',amt:20}];c.amt=133}});if(!S.view)S.view='both';
let seg='br';try{seg=localStorage.getItem('brasilSeg')||'br'}catch(e){}

const $=id=>document.getElementById(id);
const esc=v=>String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const fmt=n=>Math.round(n).toLocaleString('de-DE');
const num=v=>{const n=parseFloat(String(v).replace(',','.'));return isFinite(n)?n:0};
const uid=p=>p+Date.now().toString(36)+Math.random().toString(36).slice(2,5);
const col=g=>g.color||COLORS[S.groups.indexOf(g)%COLORS.length];
const nextColor=()=>COLORS.find(c=>!S.groups.some(g=>g.color===c))||COLORS[S.groups.length%COLORS.length];
const spentOf=id=>S.spent[id]||0;
const myF=i=>i.share==='me'?1:i.share==='luca'?0:.5;
const fv=i=>S.view==='me'?myF(i):1;
const B=i=>num(i.budget)*fv(i),SP=i=>spentOf(i.id)*fv(i);
const total=()=>S.items.reduce((s,i)=>s+B(i),0);
const spentTotal=()=>S.items.reduce((s,i)=>s+SP(i),0);
const gItems=g=>S.items.filter(i=>i.gid===g.id);
const gSum=(g,f)=>gItems(g).reduce((s,i)=>s+f(i),0);
const shareTag=i=>i.share==='me'?'<span class="tag">ich</span>':i.share==='luca'?'<span class="tag">Luca</span>':'';
const RT=()=>num(S.rate||5.9);
const E=n=>fmt(n)+' €<span class="eq">'+fmt(n*RT())+' R$</span>';
const RS=n=>fmt(n)+' R$<span class="eq">'+fmt(n/RT())+' €</span>';
const isPre=id=>!!S.pre.find(p=>p.id===id);

function save(){
  render();
  try{localStorage.setItem('brasilState2',JSON.stringify(S))}catch(e){}
}
function toast(t){const el=$('toast');el.textContent=t;el.style.display='block';clearTimeout(el._t);el._t=setTimeout(()=>el.style.display='none',1800)}

function calc(){
  const now=new Date(),inTrip=now>=TRIP_START&&now<=TRIP_END;
  const T=total(),sp=spentTotal(),left=T-sp;
  const daysLeft=inTrip?Math.max(1,Math.ceil((TRIP_END-now)/DAY)):TRIP_DAYS;
  const inc=S.income.filter(i=>i.on).reduce((s,i)=>s+num(i.amt),0);
  const need=S.costs.reduce((s,c)=>s+num(c.amt)*num(c.months),0);
  const brasilEur=T/num(S.rate||5.9);
  const preT=S.pre.reduce((s,p)=>s+B(p),0),preSp=S.pre.reduce((s,p)=>s+SP(p),0);
  const brMine=S.items.reduce((s,i)=>s+num(i.budget)*myF(i),0)/num(S.rate||5.9),preMine=S.pre.reduce((s,p)=>s+Math.max(num(p.budget),spentOf(p.id))*myF(p),0);
  const buffer=inc-need-brMine-preMine;
  const sd=S.smoke.start?Math.max(0,Math.floor((now-new Date(S.smoke.start))/DAY)):0;
  const smokeSaved=S.smoke.start&&S.smoke.price&&S.smoke.perDay?sd*S.smoke.price*S.smoke.perDay:null;
  return {now,inTrip,T,sp,left,daysLeft,perDay:left/daysLeft,inc,need,brasilEur,buffer,preT,preSp,brMine,preMine,sd,smokeSaved,dTo:Math.ceil((TRIP_START-now)/DAY)};
}

function render(){
  const c=calc(),R=num(S.rate||5.9);
  $('today').textContent=c.now.toLocaleDateString('de-DE',{weekday:'long',day:'numeric',month:'long'});
  $('count').textContent=c.dTo>0?c.dTo+' Tage':c.inTrip?'Tag '+(Math.floor((c.now-TRIP_START)/DAY)+1)+' von '+TRIP_DAYS:'Zurück';
  $('left').textContent=fmt(c.left);$('left').classList.toggle('neg',c.left<0);
  $('eur').textContent='von '+fmt(c.T)+' R$ ≈ '+fmt(c.brasilEur)+' €';
  $('totbar').style.width=Math.min(100,c.T?c.sp/c.T*100:0)+'%';
  $('totline').textContent='≈ '+fmt(c.left/R)+' € übrig · '+fmt(c.sp)+' R$ ('+fmt(c.sp/R)+' €) ausgegeben · '+fmt(c.perDay)+' R$ ('+fmt(c.perDay/R)+' €) pro Tag';
  document.querySelectorAll('[data-view]').forEach(b=>b.classList.toggle('on',b.dataset.view===(S.view||'both')));
  const pb=(s,b)=>'<div class="bar"><i style="width:'+Math.min(100,b?s/b*100:0)+'%;background:'+(s>b?'var(--r)':'var(--g)')+'"></i></div>';
  $('phases').innerHTML='<h2 style="margin-bottom:4px">Budget-Phasen</h2>'+
   '<button class="ph" data-go="pre"><div class="row"><span style="font-weight:500">Vor der Reise</span><span class="amt">'+fmt(c.preSp)+' / '+fmt(c.preT)+' €</span></div><span class="muted" style="font-size:12px">dm, Süßigkeiten, Anzüge</span>'+pb(c.preSp,c.preT)+'</button>'+
   '<button class="ph" data-go="br"><div class="row"><span style="font-weight:500">Brasilien</span><span class="amt">'+fmt(c.sp/R)+' / '+fmt(c.brasilEur)+' €<span class="eq">'+fmt(c.T)+' R$</span></span></div><span class="muted" style="font-size:12px">'+fmt(c.sp)+' von '+fmt(c.T)+' R$</span>'+pb(c.sp,c.T)+'</button>'+
   '<button class="ph" data-go="post"><div class="row"><span style="font-weight:500">Nach der Reise</span><span class="amt">'+fmt(c.need)+' €</span></div><span class="muted" style="font-size:12px">Fixkosten und Einkauf bis Februar</span></button>'+
   '<div class="row" style="padding-top:12px"><span style="font-weight:600">Puffer danach</span><span class="num'+(c.buffer<0?' neg':'')+'" style="font-size:20px">'+fmt(c.buffer)+' €</span></div><div class="row"><span></span><span class="muted">≈ '+fmt(c.buffer*R)+' R$</span></div>';
  const sel=$('qItem').value;
  $('qItem').innerHTML='<optgroup label="Vor der Reise (€)">'+S.pre.map(p=>'<option value="'+esc(p.id)+'">'+esc(p.label)+'</option>').join('')+'</optgroup>'+
   S.groups.map(g=>'<optgroup label="'+esc(g.name)+' (R$)">'+gItems(g).map(i=>'<option value="'+esc(i.id)+'">'+esc(i.label)+'</option>').join('')+'</optgroup>').join('');
  if(sel)$('qItem').value=sel;
  $('qCur').textContent='Betrag in '+(isPre($('qItem').value)?'€':'R$');
  const rec=S.log.slice(-6).reverse();
  $('recent').innerHTML=rec.length?rec.map(l=>{const it=S.items.find(i=>i.id===l.id)||S.pre.find(i=>i.id===l.id);return '<div><span>'+esc(it?it.label:'Gelöscht')+' · <span class="muted">'+new Date(l.t).toLocaleDateString('de-DE',{day:'numeric',month:'short'})+'</span></span><span class="amt">'+(isPre(l.id)?fmt(l.amt)+' €':RS(l.amt))+'</span></div>'}).join(''):'<div><span class="muted">Noch keine Ausgaben</span></div>';

  document.querySelectorAll('.seg button').forEach(b=>b.classList.toggle('on',b.dataset.seg===seg));
  document.querySelectorAll('.segp').forEach(p=>p.classList.toggle('on',p.id==='s-'+seg));
  $('bTotal').textContent=seg==='pre'?fmt(c.preT)+' €':seg==='post'?fmt(c.need)+' €':fmt(c.T)+' R$ ≈ '+fmt(c.brasilEur)+' €';
  $('preList').innerHTML=S.pre.map(p=>{const s=SP(p),b=B(p),over=s>b;
    return '<button class="item" data-id="'+esc(p.id)+'" data-k="pre"><div class="row"><span style="font-weight:500">'+esc(p.label)+shareTag(p)+'</span><span class="amt">'+fmt(b)+' €</span></div>'+
    '<div class="row" style="margin-top:2px"><span class="muted" style="font-size:12px">'+esc(p.note||'')+'</span><span class="muted'+(over?' neg':'')+'" style="font-size:12px;white-space:nowrap">'+fmt(s)+' € ausgegeben</span></div>'+
    '<div class="bar"><i style="width:'+Math.min(100,b?s/b*100:0)+'%;background:'+(over?'var(--r)':'var(--y)')+'"></i></div></button>'}).join('')||'<p class="muted">Noch keine Einträge</p>';
  if(document.activeElement!==$('rate'))$('rate').value=S.rate;
  $('list').innerHTML=S.groups.map(g=>{const color=col(g);
    const shut=(S.collapsed||[]).includes(g.id);
    return '<div class="gh"><button class="grp" data-col="'+esc(g.id)+'" aria-expanded="'+!shut+'"><span><svg class="chev'+(shut?' up':'')+'" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg><span style="color:'+col(g)+'">'+esc(g.name.toUpperCase())+'</span></span><span>'+fmt(gSum(g,B))+' R$ · '+fmt(gSum(g,B)/RT())+' €</span></button><button class="ged" data-g="'+esc(g.id)+'" aria-label="Gruppe '+esc(g.name)+' bearbeiten"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/></svg></button></div><div class="gi'+(shut?' shut':'')+'"><div>'+gItems(g).map(i=>{
      const s=SP(i),b=B(i),over=s>b;
      return '<button class="item" data-id="'+esc(i.id)+'"><div class="row"><span style="font-weight:500">'+esc(i.label)+shareTag(i)+'</span><span class="amt">'+RS(b)+'</span></div>'+
      '<div class="row" style="margin-top:2px"><span class="muted" style="font-size:12px">'+esc(i.note||'')+'</span><span class="muted'+(over?' neg':'')+'" style="font-size:12px;white-space:nowrap">'+fmt(s)+' R$ · '+fmt(s/RT())+' € ausgegeben</span></div>'+
      '<div class="bar"><i style="width:'+Math.min(100,b?s/b*100:0)+'%;background:'+(over?'var(--r)':color)+'"></i></div></button>'}).join('')+'</div></div>'}).join('');

  const max=Math.max(1,...S.groups.map(g=>gSum(g,B)));
  $('bars').innerHTML=S.groups.map(g=>{const b=gSum(g,B),s=gSum(g,SP);
    return '<div><span class="muted" style="font-size:11px">'+fmt(s)+'/'+fmt(b)+'</span><div class="col" style="height:'+Math.max(6,Math.round(b/max*96))+'px"><i style="height:'+Math.min(100,b?s/b*100:0)+'%;background:'+col(g)+'"></i></div></div>'}).join('');
  $('lbls').innerHTML=S.groups.map(g=>'<span>'+esc(g.name)+'</span>').join('');
  $('wDay').innerHTML='<span class="muted" style="font-weight:500">'+(c.inTrip?'Heute möglich':'Pro Tag')+'</span><div><div class="num" style="font-size:30px">'+fmt(c.perDay)+' R$</div><span class="muted">≈ '+fmt(c.perDay/R)+' € zu zweit</span></div><div class="bar"><i style="width:'+Math.max(0,Math.min(100,c.T?c.left/c.T*100:0))+'%"></i></div>';
  const need=c.inc-c.brasilEur,frac=need>0?Math.max(0,Math.min(1,c.buffer/need)):0,C=2*Math.PI*30;
  $('wBuffer').innerHTML='<span class="muted" style="font-weight:500">Puffer bis Feb</span><svg width="72" height="72" viewBox="0 0 72 72" role="img" aria-label="Puffer '+fmt(c.buffer)+' Euro"><circle cx="36" cy="36" r="30" fill="none" stroke="#262931" stroke-width="8"/><circle cx="36" cy="36" r="30" fill="none" stroke="'+(c.buffer<0?'#FF7A6B':'#F5C542')+'" stroke-width="8" stroke-linecap="round" stroke-dasharray="'+(C*frac).toFixed(1)+' '+C.toFixed(1)+'" transform="rotate(-90 36 36)"/></svg><span class="muted"><b class="num'+(c.buffer<0?' neg':'')+'" style="color:var(--ink);font-size:17px">'+fmt(c.buffer)+' €</b> übrig<br>≈ '+fmt(c.buffer*R)+' R$</span>';
  $('wSmoke').innerHTML='<span class="muted" style="font-weight:500">Rauchfrei</span><div><div class="num" style="font-size:40px;color:var(--g)">'+c.sd+'</div><span class="muted">'+(c.sd===1?'Tag':'Tage')+(c.smokeSaved!=null?' · '+fmt(c.smokeSaved)+' € gespart':'')+'</span></div>';
  $('wMonth').innerHTML='<span class="muted" style="font-weight:500">Kosten bis Feb</span><div><div class="num" style="font-size:30px">'+fmt(c.need)+' €</div><span class="muted">Einnahmen '+fmt(c.inc)+' €</span></div>';
  const top=[...S.items].sort((a,b)=>spentOf(b.id)-spentOf(a.id)).filter(i=>spentOf(i.id)>0).slice(0,3);
  $('wTop').innerHTML='<span class="muted" style="font-weight:500">Größte Ausgaben</span>'+(top.length?top.map(i=>'<div class="line"><span>'+esc(i.label)+'</span><span class="amt">'+RS(spentOf(i.id))+'</span></div>').join(''):'<span class="muted">Noch nichts ausgegeben</span>');

  $('smokeCard').innerHTML='<div class="row"><h2>Rauchfrei</h2><button class="link" id="smokeEdit">'+(S.smoke.start?'Bearbeiten':'Starten')+'</button></div>'+
   '<div style="display:flex;align-items:baseline;gap:8px;margin-top:8px"><span class="num" style="font-size:56px;color:var(--g)">'+c.sd+'</span><span class="muted" style="font-size:16px">'+(c.sd===1?'Tag':'Tage')+'</span></div>'+
   '<p class="muted" style="margin:4px 0 0">'+(c.smokeSaved!=null?fmt(c.smokeSaved)+' € gespart · '+fmt(S.smoke.price*S.smoke.perDay*30)+' € pro Monat möglich':S.smoke.start?'Trag den Preis pro Packung ein, dann siehst du, was du sparst.':'Starte heute und sieh, wie viel Geld du behältst.')+'</p>';
  $('bufCard').innerHTML='<h2>Puffer bis Ende Februar</h2><div style="display:flex;align-items:baseline;gap:8px;margin:8px 0"><span class="num'+(c.buffer<0?' neg':'')+'" style="font-size:44px">'+fmt(c.buffer)+'</span><span class="muted" style="font-size:16px">€ · ≈ '+fmt(c.buffer*R)+' R$</span></div>'+
   '<div class="line"><span class="muted">Einnahmen (abgehakt)</span><span class="amt">'+fmt(c.inc)+' €</span></div><div class="line"><span class="muted">Vor der Reise (dein Anteil)</span><span class="amt">−'+fmt(c.preMine)+' €</span></div><div class="line"><span class="muted">Kosten bis Feb</span><span class="amt">−'+fmt(c.need)+' €</span></div><div class="line"><span class="muted">Brasilien (dein Anteil)</span><span class="amt">−'+E(c.brMine)+'</span></div>'+
   (c.buffer<0?'<p class="muted neg" style="margin:8px 0 0">Brasilien-Budget um ca. '+fmt(-c.buffer*R)+' R$ senken oder auf Esplora warten.</p>':'');
  $('incList').innerHTML=S.income.map(i=>'<div class="line"><button class="tog" data-inc-tog="'+esc(i.id)+'" aria-pressed="'+i.on+'"><span class="box'+(i.on?' on':'')+'">'+(i.on?'<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0E0F12" stroke-width="3" aria-hidden="true"><path d="M5 12l5 5 9-10"/></svg>':'')+'</span><span>'+esc(i.label)+'</span></button><button class="link" style="color:var(--ink)" data-inc="'+esc(i.id)+'">'+fmt(num(i.amt))+' €</button></div>').join('');
  $('costList').innerHTML=S.costs.map(x=>{const hp=(x.parts||[]).length,open=(S.openCosts||[]).includes(x.id);
    return '<div class="cl"><div class="line" style="border:0"><button class="tog" '+(hp?'data-cexp':'data-cost')+'="'+esc(x.id)+'" aria-expanded="'+(hp?open:'')+'"><span style="display:flex;align-items:center;gap:6px">'+(hp?'<svg class="chev'+(open?'':' up')+'" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg>':'')+'<span>'+esc(x.label)+' <span class="muted">'+fmt(num(x.amt))+' € × '+String(num(x.months)).replace('.',',')+'</span></span></span></button><span style="display:flex;align-items:center;gap:2px"><span class="amt">'+fmt(num(x.amt)*num(x.months))+' €'+'</span>'+(hp?'<button class="ged" style="margin:0" data-cost="'+esc(x.id)+'" aria-label="'+esc(x.label)+' bearbeiten"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/></svg></button>':'')+'</span></div>'+
    (hp?'<div class="gi'+(open?'':' shut')+'"><div>'+x.parts.map(q=>'<div class="sub"><span>'+esc(q.label)+'</span><span>'+fmt(num(q.amt))+' € / Monat</span></div>').join('')+'</div></div>':'')+'</div>'}).join('');
}

const acts=isNew=>'<div class="row"><button type="button" class="btn" id="x">Abbrechen</button><button class="btn pri" style="flex:1">Speichern</button></div></form>'+(isNew?'':'<details class="more"><summary>Mehr</summary><button type="button" class="btn del" id="d">Löschen</button></details>');
function armDel(fn){const d=$('d');d.onclick=()=>{if(d.dataset.armed){fn();return}d.dataset.armed='1';d.textContent='Wirklich löschen?';d.classList.add('armed')}}
function openSheet(h){const pn=$('panel');pn.innerHTML='<div class="grab" aria-hidden="true"></div>'+h;pn.style.transform='';$('sheet').classList.add('on')}
function closeSheet(){const pn=$('panel');pn.style.transition='transform .2s ease';pn.style.transform='translateY(100%)';setTimeout(()=>{$('sheet').classList.remove('on');pn.style.transition='';pn.style.transform=''},200)}
{const pn=$('panel');let y0=null,dy=0;
 pn.addEventListener('touchstart',e=>{if(pn.scrollTop>0||e.target.closest('input,select'))return;y0=e.touches[0].clientY;dy=0;pn.style.transition='none'},{passive:true});
 pn.addEventListener('touchmove',e=>{if(y0==null)return;dy=Math.max(0,e.touches[0].clientY-y0);pn.style.transform='translateY('+dy+'px)'},{passive:true});
 pn.addEventListener('touchend',()=>{if(y0==null)return;y0=null;if(dy>90)closeSheet();else{pn.style.transition='transform .2s ease';pn.style.transform=''}});}
$('sheet').addEventListener('click',e=>{if(e.target.id==='sheet')closeSheet()});
const groupOpts=sel=>S.groups.map(g=>'<option value="'+esc(g.id)+'"'+(g.id===sel?' selected':'')+'>'+esc(g.name)+'</option>').join('')+'<option value="__new">+ Neue Gruppe…</option>';

function itemSheet(id,k){
  const pre=k==='pre',arr=pre?S.pre:S.items,cur=pre?'€':'R$';
  const isNew=!id;const it=isNew?(pre?{id:uid('p'),label:'',note:'',budget:0}:{id:uid('i'),gid:S.groups[0]?.id,label:'',note:'',budget:0}):arr.find(i=>i.id===id);
  const hist=S.log.filter(l=>l.id===it.id).slice(-8).reverse();
  openSheet((isNew?'<h2>Neuer Eintrag</h2>':'')+'<form id="f" style="display:flex;flex-direction:column;gap:12px">'+
   '<label>Name<input id="eL" value="'+esc(it.label)+'" required></label><label>Notiz<input id="eN" value="'+esc(it.note||'')+'"></label>'+
   '<div class="two"><label>Budget ('+cur+') '+(pre?'':'<span id="eBc" class="muted">≈ '+fmt(num(it.budget)/RT())+' €</span>')+'<input id="eB" type="number" inputmode="decimal" step="1" min="0" value="'+num(it.budget)+'"></label>'+(pre?'<span></span>':'<label>Gruppe<select id="eG">'+groupOpts(it.gid)+'</select></label>')+'</div>'+
   '<label>Wer zahlt?<select id="eS"><option value="both">Geteilt (50/50)</option><option value="me">Nur ich</option><option value="luca">Nur Luca</option></select></label>'+
   '<label id="eGNw" style="display:none">Name der neuen Gruppe<input id="eGN"></label>'+
   (isNew?'':'<label>Ausgabe hinzufügen ('+cur+')<input id="eA" type="number" inputmode="decimal" step="0.01" min="0" placeholder="0"></label><div class="chips">'+(pre?[5,10,20,50]:[20,35,60,130]).map(v=>'<button type="button" class="btn" data-q="'+v+'">'+v+'</button>').join('')+'</div>')+
   acts(isNew)+
   (hist.length?'<div class="log">'+hist.map(h=>'<div><span class="muted">'+new Date(h.t).toLocaleDateString('de-DE',{day:'numeric',month:'short'})+'</span><span>'+fmt(h.amt)+' '+cur+'</span></div>').join('')+'</div>':''));
  $('panel').querySelectorAll('[data-q]').forEach(b=>b.onclick=()=>{$('eA').value=b.dataset.q});
  $('eS').value=it.share||'both';
  if(!pre)$('eB').addEventListener('input',()=>{$('eBc').textContent='≈ '+fmt(num($('eB').value)/RT())+' €'});
  if($('eG'))$('eG').onchange=()=>{const n=$('eG').value==='__new';$('eGNw').style.display=n?'flex':'none';if(n)$('eGN').focus()};
  if($('x'))$('x').onclick=closeSheet;
  if($('d'))armDel(()=>{if(pre)S.pre=S.pre.filter(i=>i.id!==it.id);else S.items=S.items.filter(i=>i.id!==it.id);delete S.spent[it.id];closeSheet();save();toast('Gelöscht')});
  $('f').onsubmit=e=>{e.preventDefault();it.label=$('eL').value.trim()||'Ohne Namen';it.note=$('eN').value.trim();it.budget=Math.max(0,num($('eB').value));it.share=$('eS').value;if(!pre){if($('eG').value==='__new'){const ng={id:uid('g'),name:$('eGN').value.trim()||'Neue Gruppe',color:nextColor()};S.groups.push(ng);it.gid=ng.id}else it.gid=$('eG').value}
    if(isNew)arr.push(it);const a=$('eA')?num($('eA').value):0;if(a>0){S.spent[it.id]=spentOf(it.id)+a;S.log.push({id:it.id,amt:a,t:Date.now()})}
    closeSheet();save();toast('Gespeichert')};
}
function groupSheet(gid){
  const isNew=!gid;const g=isNew?{id:uid('g'),name:''}:S.groups.find(x=>x.id===gid);const i=S.groups.indexOf(g);
  openSheet((isNew?'<h2>Neue Gruppe</h2>':'')+'<form id="f" style="display:flex;flex-direction:column;gap:12px"><label>Name<input id="gN" value="'+esc(g.name)+'" required></label><div><span class="muted">Farbe</span><div class="sw" role="radiogroup" aria-label="Farbe">'+COLORS.map(c=>'<button type="button" role="radio" aria-checked="'+(c===(g.color||nextColor()))+'" aria-label="Farbe '+c+'" data-sw="'+c+'" style="background:'+c+'"></button>').join('')+'</div></div>'+
   (isNew?'':'<div class="two"><button type="button" class="btn" id="up">↑ Nach oben</button><button type="button" class="btn" id="dn">↓ Nach unten</button></div>')+
   acts(isNew)+
   (isNew?'':'<p class="muted" style="margin:0">Beim Löschen wandern die Einträge in die erste andere Gruppe.</p>'));
  if($('x'))$('x').onclick=closeSheet;
  const mv=d=>{const j=i+d;if(j<0||j>=S.groups.length)return;[S.groups[i],S.groups[j]]=[S.groups[j],S.groups[i]];closeSheet();save()};
  if($('up'))$('up').onclick=()=>mv(-1);if($('dn'))$('dn').onclick=()=>mv(1);
  if($('d'))armDel(()=>{const other=S.groups.find(x=>x.id!==g.id);if(!other)return toast('Mindestens eine Gruppe nötig');S.items.forEach(it=>{if(it.gid===g.id)it.gid=other.id});S.groups=S.groups.filter(x=>x.id!==g.id);closeSheet();save()});
  $('f').onsubmit=e=>{e.preventDefault();g.name=$('gN').value.trim()||'Gruppe';g.color=($('panel').querySelector('[data-sw][aria-checked=true]')||{}).dataset?.sw||g.color||nextColor();if(isNew)S.groups.push(g);closeSheet();save()};
}
function moneySheet(kind,id){
  const arr=kind==='inc'?S.income:S.costs;const isNew=!id;
  const x=isNew?(kind==='inc'?{id:uid('n'),label:'',amt:0,on:true}:{id:uid('c'),label:'',amt:0,months:3}):arr.find(a=>a.id===id);
  openSheet('<h2>'+(kind==='inc'?'Einnahme':'Kosten')+'</h2><form id="f" style="display:flex;flex-direction:column;gap:12px"><label>Name<input id="mL" value="'+esc(x.label)+'" required></label>'+
   '<div class="two"><label>Betrag (€)<input id="mA" type="number" inputmode="decimal" step="0.01" min="0" value="'+num(x.amt)+'"></label>'+(kind==='cost'?'<label>Monate<input id="mM" type="number" inputmode="decimal" step="0.1" min="0" value="'+num(x.months)+'"></label>':'<span></span>')+'</div>'+
   (kind==='cost'?'<div><div class="row"><span class="muted">Details pro Monat</span><button type="button" class="link" id="addPart">+ Detail</button></div><div id="parts"></div><p class="muted" style="margin:4px 0 0">Mit Details wird der Betrag automatisch summiert.</p></div>':'')+
   acts(isNew));
  if(kind==='cost'){
    const parts=(x.parts||[]).map(q=>({...q}));
    const draw=()=>{$('parts').innerHTML=parts.map((q,k)=>'<div class="prow"><input aria-label="Name" data-pl="'+k+'" value="'+esc(q.label)+'"><input aria-label="Betrag" data-pa="'+k+'" type="number" inputmode="decimal" step="0.01" min="0" value="'+num(q.amt)+'"><button type="button" class="ged" style="margin:0" data-px="'+k+'" aria-label="Detail entfernen">×</button></div>').join('');
      const sum=parts.reduce((s,q)=>s+num(q.amt),0);if(parts.length){$('mA').value=Math.round(sum*100)/100;$('mA').readOnly=true}else $('mA').readOnly=false};
    draw();
    $('parts').addEventListener('input',e=>{const k=e.target.dataset.pl??e.target.dataset.pa;if(k==null)return;if(e.target.dataset.pl!=null)parts[k].label=e.target.value;else{parts[k].amt=num(e.target.value);const sum=parts.reduce((s,q)=>s+num(q.amt),0);$('mA').value=Math.round(sum*100)/100}});
    $('parts').addEventListener('click',e=>{const b=e.target.closest('[data-px]');if(!b)return;parts.splice(+b.dataset.px,1);draw()});
    $('addPart').onclick=()=>{parts.push({label:'',amt:0});draw();const ins=$('parts').querySelectorAll('[data-pl]');ins[ins.length-1].focus()};
    x._parts=parts;
  }
  if($('x'))$('x').onclick=closeSheet;
  if($('d'))armDel(()=>{const k=kind==='inc'?'income':'costs';S[k]=S[k].filter(a=>a.id!==x.id);closeSheet();save()});
  $('f').onsubmit=e=>{e.preventDefault();x.label=$('mL').value.trim()||'Eintrag';if(x._parts){x.parts=x._parts.filter(q=>q.label.trim()||num(q.amt)>0).map(q=>({label:q.label.trim()||'Detail',amt:num(q.amt)}));delete x._parts;if(!x.parts.length)delete x.parts}x.amt=x.parts?x.parts.reduce((s,q)=>s+q.amt,0):Math.max(0,num($('mA').value));if(kind==='cost')x.months=Math.max(0,num($('mM').value));if(isNew)arr.push(x);closeSheet();save()};
}
function smokeSheet(){
  openSheet('<h2>Rauchfrei</h2><form id="f" style="display:flex;flex-direction:column;gap:12px"><div class="two"><label>Preis pro Packung (€)<input id="pp" type="number" inputmode="decimal" step="0.1" min="0" value="'+(S.smoke.price??'')+'"></label><label>Packungen pro Tag vorher<input id="pd" type="number" inputmode="decimal" step="0.1" min="0" value="'+(S.smoke.perDay??'')+'"></label></div>'+
   '<div class="row">'+(S.smoke.start?'<button type="button" class="btn" id="r">Neu starten</button>':'<button type="button" class="btn" id="x">Abbrechen</button>')+'<button class="btn pri" style="flex:1">'+(S.smoke.start?'Speichern':'Ab heute rauchfrei')+'</button></div></form>');
  if($('x'))$('x').onclick=closeSheet;
  if($('r'))$('r').onclick=()=>{S.smoke.start=new Date().toISOString();closeSheet();save();toast('Neuer Start, du schaffst das')};
  $('f').onsubmit=e=>{e.preventDefault();const p=num($('pp').value),d=num($('pd').value);S.smoke.price=p>0?p:null;S.smoke.perDay=d>0?d:null;if(!S.smoke.start)S.smoke.start=new Date().toISOString();closeSheet();save()};
}

function show(tab){
  if(!['start','budget','over','save'].includes(tab))tab='start';
  document.querySelectorAll('.page').forEach(p=>p.classList.toggle('on',p.id==='p-'+tab));
  document.querySelectorAll('.dock button').forEach(b=>{const on=b.dataset.tab===tab;b.classList.toggle('on',on);b.setAttribute('aria-current',on?'page':'false')});
  try{localStorage.setItem('brasilTab',tab)}catch(e){}
  if(location.hash!=='#'+tab)history.replaceState(null,'','#'+tab);
  window.scrollTo(0,0);
}
document.addEventListener('click',e=>{
  const t=e.target;let el;
  if(el=t.closest('.dock button'))return show(el.dataset.tab);
  if(el=t.closest('[data-sw]')){el.parentNode.querySelectorAll('[data-sw]').forEach(b=>b.setAttribute('aria-checked',b===el));return}
  if(el=t.closest('[data-view]')){S.view=el.dataset.view;save();return}
  if(el=t.closest('.item'))return itemSheet(el.dataset.id,el.dataset.k);
  if(el=t.closest('[data-seg]')){seg=el.dataset.seg;try{localStorage.setItem('brasilSeg',seg)}catch(e){}render();return}
  if(el=t.closest('[data-go]')){seg=el.dataset.go;try{localStorage.setItem('brasilSeg',seg)}catch(e){}render();return show('budget')}
  if(el=t.closest('[data-col]')){const id=el.dataset.col;S.collapsed=S.collapsed||[];S.collapsed=S.collapsed.includes(id)?S.collapsed.filter(x=>x!==id):[...S.collapsed,id];save();return}
  if(el=t.closest('.ged'))return groupSheet(el.dataset.g);
  if(el=t.closest('[data-inc-tog]')){const i=S.income.find(x=>x.id===el.dataset.incTog);i.on=!i.on;save();return}
  if(el=t.closest('[data-inc]'))return moneySheet('inc',el.dataset.inc);
  if(el=t.closest('[data-cexp]')){const id=el.dataset.cexp;S.openCosts=S.openCosts||[];S.openCosts=S.openCosts.includes(id)?S.openCosts.filter(x=>x!==id):[...S.openCosts,id];render();return}
  if(el=t.closest('[data-cost]'))return moneySheet('cost',el.dataset.cost);
  if(t.closest('#smokeEdit'))return smokeSheet();
});
$('addItem').onclick=()=>itemSheet(null);$('addPre').onclick=()=>itemSheet(null,'pre');
const qConv=()=>{const v=num($('qAmt').value),pre=isPre($('qItem').value);$('qConv').textContent=v>0&&!pre?'≈ '+fmt(v/RT())+' €':''};
$('qAmt').addEventListener('input',qConv);
$('qItem').addEventListener('change',()=>{qConv();$('qCur').textContent='Betrag in '+(isPre($('qItem').value)?'€':'R$')});$('addGroup').onclick=()=>groupSheet(null);
$('addInc').onclick=()=>moneySheet('inc',null);$('addCost').onclick=()=>moneySheet('cost',null);
$('rate').addEventListener('change',e=>{const v=num(e.target.value);if(v>0){S.rate=v;save()}});
const qToggle=on=>{$('qCard').style.display=on?'block':'none';$('qOpen').style.display=on?'none':'block';$('qOpen').setAttribute('aria-expanded',on);if(on)$('qAmt').focus()};
$('qOpen').onclick=()=>qToggle(true);$('qClose').onclick=()=>qToggle(false);
$('quick').onsubmit=e=>{e.preventDefault();const id=$('qItem').value,v=num($('qAmt').value);if(!id||!(v>0))return;S.spent[id]=spentOf(id)+v;S.log.push({id,amt:v,t:Date.now()});$('qAmt').value='';$('qConv').textContent='';qToggle(false);save();toast(fmt(v)+(isPre(id)?' €':' R$')+' gebucht')};
$('undo').onclick=()=>{const l=S.log.pop();if(!l)return toast('Nichts zum Rückgängigmachen');S.spent[l.id]=Math.max(0,spentOf(l.id)-l.amt);save();toast(fmt(l.amt)+(isPre(l.id)?' €':' R$')+' entfernt')};
$('exp').onclick=()=>{const b=new Blob([JSON.stringify(S,null,1)],{type:'application/json'});const a=document.createElement('a');a.href=URL.createObjectURL(b);a.download='horizon-backup-'+new Date().toISOString().slice(0,10)+'.json';document.body.appendChild(a);a.click();a.remove();toast('Backup gespeichert')};
$('imp').onchange=async e=>{const f=e.target.files[0];if(!f)return;try{const d=JSON.parse(await f.text());if(!d.items||!d.groups)throw 0;S=d;save();toast('Backup geladen');setTimeout(()=>location.reload(),600)}catch(err){toast('Datei nicht lesbar')}};

// ---- UI fixes + long-press editing ----
{const st=document.createElement('style');st.textContent='html,body{overflow-x:hidden;-webkit-user-select:none;user-select:none;-webkit-touch-callout:none}input,select,textarea{-webkit-user-select:text;user-select:text}.dock{left:0!important;right:0!important;margin:0 auto;width:max-content;transform:none!important}.wrap{min-height:100dvh}.pressing{opacity:.45;transition:opacity .15s}';document.head.appendChild(st);}
if(!S.texts)S.texts={};
const DYN='#today,#count,#eur,#left,#totline,#bTotal,#qCur,#qConv,#phases,#recent,#list,#preList,#costList,#incList,#bars,#lbls,#wDay,#wBuffer,#wSmoke,#wMonth,#wTop,#smokeCard,#bufCard,#panel,#toast';
const txtNode=el=>[...el.childNodes].find(n=>n.nodeType===3&&n.textContent.trim());
let tk=0;
document.querySelectorAll('h1,h2,p,span,button,label').forEach(el=>{
  if(el.closest(DYN)||el.matches(DYN))return;const n=txtNode(el);if(!n)return;
  el.dataset.t='t'+(tk++);el.dataset.def=n.textContent;
});
function applyTexts(){document.querySelectorAll('[data-t]').forEach(el=>{const n=txtNode(el)||el.appendChild(document.createTextNode(''));const v=S.texts[el.dataset.t];n.textContent=v!=null?v:el.dataset.def})}
applyTexts();
function textSheet(el){
  const k=el.dataset.t,cur=(S.texts[k]!=null?S.texts[k]:el.dataset.def).trim();
  openSheet('<form id="f" style="display:flex;flex-direction:column;gap:12px"><label>Text<input id="tx" value="'+esc(cur)+'"></label><div class="row"><button type="button" class="btn" id="x">Abbrechen</button><button class="btn pri" style="flex:1">Speichern</button></div></form><button type="button" class="link" id="trs" style="align-self:flex-start;color:var(--mute)">Original wiederherstellen</button>');
  $('x').onclick=closeSheet;
  $('trs').onclick=()=>{delete S.texts[k];applyTexts();closeSheet();save()};
  $('f').onsubmit=e=>{e.preventDefault();const v=$('tx').value;const pre=(el.dataset.def.match(/^\s*/)||[''])[0],post=(el.dataset.def.match(/\s*$/)||[''])[0];S.texts[k]=pre+v.trim()+post;applyTexts();closeSheet();save()};
  setTimeout(()=>$('tx').focus(),50);
}
function longPress(t){
  let el;
  if(el=t.closest('.item'))return itemSheet(el.dataset.id,el.dataset.k),true;
  if(el=t.closest('.gh')){const b=el.querySelector('[data-g]');return groupSheet(b.dataset.g),true}
  if(el=t.closest('.cl')){const b=el.querySelector('[data-cost]');if(b)return moneySheet('cost',b.dataset.cost),true}
  if(el=t.closest('#incList .line')){const b=el.querySelector('[data-inc]');return moneySheet('inc',b.dataset.inc),true}
  if(t.closest('#smokeCard,#wSmoke'))return smokeSheet(),true;
  if(el=t.closest('[data-t]'))return textSheet(el),true;
  return false;
}
{let tm=null,x0=0,y0=0,tgt=null,fired=false;
 const cancel=()=>{clearTimeout(tm);tm=null;if(tgt)tgt.classList.remove('pressing');tgt=null};
 document.addEventListener('touchstart',e=>{if(e.target.closest('input,select,textarea,#sheet.on .panel'))return;const p=e.touches[0];x0=p.clientX;y0=p.clientY;fired=false;
   tgt=e.target.closest('.item,.gh,.cl,#incList .line,#smokeCard,#wSmoke,[data-t]');if(!tgt)return;tgt.classList.add('pressing');
   const t=e.target;tm=setTimeout(()=>{const el=tgt;cancel();if(longPress(t)){fired=true}},550)},{passive:true});
 document.addEventListener('touchmove',e=>{const p=e.touches[0];if(Math.abs(p.clientX-x0)>10||Math.abs(p.clientY-y0)>10)cancel()},{passive:true});
 document.addEventListener('touchend',cancel,{passive:true});
 document.addEventListener('click',e=>{if(fired){fired=false;e.stopPropagation();e.preventDefault()}},true);
 document.addEventListener('contextmenu',e=>{if(longPress(e.target))e.preventDefault()});
}
window.addEventListener('hashchange',()=>show(location.hash.slice(1)));
render();
let start=location.hash.slice(1);if(!start){try{start=localStorage.getItem('brasilTab')||'start'}catch(e){start='start'}}
show(start);
}
