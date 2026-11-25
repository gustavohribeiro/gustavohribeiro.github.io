(()=>{
const K='brasilState2',TK='horizonToken',TT='horizonSyncT',API='https://api.github.com/repos/gustavohribeiro/horizon-data/contents/state.json';
const tok=()=>{try{return localStorage.getItem(TK)||''}catch(e){return''}};
let sha=null,timer=null,busy=false;
const b64=s=>btoa(unescape(encodeURIComponent(s))),u64=s=>decodeURIComponent(escape(atob(s.replace(/\n/g,''))));
const hd=()=>({Authorization:'Bearer '+tok(),Accept:'application/vnd.github+json'});
function stat(m,ok){const el=document.getElementById('syncSt');if(el){el.textContent=m;el.style.color=ok===false?'var(--r)':'var(--mute)'}}
async function pull(){if(!tok())return;try{const r=await fetch(API+'?t='+Date.now(),{headers:hd(),cache:'no-store'});if(r.status===404){sha=null;return push()}if(!r.ok)throw r.status;const j=await r.json();sha=j.sha;const d=JSON.parse(u64(j.content));const lt=+localStorage.getItem(TT)||0;
 if(d.t>lt&&d.S){origSet.call(localStorage,K,JSON.stringify(d.S));origSet.call(localStorage,TT,String(d.t));location.reload();return}
 stat('Synchron · '+new Date(Math.max(d.t,lt)).toLocaleString('de-DE'))}catch(e){stat('Sync-Fehler ('+e+')',false)}}
async function push(){if(!tok()||busy)return;busy=true;try{const t=Date.now(),S=JSON.parse(localStorage.getItem(K)||'null');if(!S)return;
 const body={message:'sync '+new Date(t).toISOString(),content:b64(JSON.stringify({t,S},null,1))};if(sha)body.sha=sha;
 let r=await fetch(API,{method:'PUT',headers:hd(),body:JSON.stringify(body)});
 if(r.status===409||r.status===422){const g=await fetch(API+'?t='+t,{headers:hd(),cache:'no-store'});if(g.ok){body.sha=(await g.json()).sha;r=await fetch(API,{method:'PUT',headers:hd(),body:JSON.stringify(body)})}}
 if(!r.ok)throw r.status;sha=(await r.json()).content.sha;origSet.call(localStorage,TT,String(t));stat('Gespeichert · '+new Date(t).toLocaleTimeString('de-DE'))}catch(e){stat('Sync-Fehler ('+e+')',false)}finally{busy=false}}
const origSet=Storage.prototype.setItem;
Storage.prototype.setItem=function(k,v){origSet.call(this,k,v);if(this===localStorage&&k===K&&tok()){clearTimeout(timer);timer=setTimeout(push,2500)}};
function ui(){const pg=document.getElementById('p-save');if(!pg)return setTimeout(ui,100);if(document.getElementById('syncCard'))return;
 const c=document.createElement('div');c.className='card';c.id='syncCard';
 c.innerHTML='<h2>Sync mit Claude</h2><p class="muted" style="margin:4px 0 10px">Änderungen werden automatisch in dein privates Repo gespeichert.</p><input id="syncTok" type="password" placeholder="GitHub-Token einfügen" autocomplete="off" style="width:100%;background:var(--track);border:0;border-radius:12px;padding:12px;color:var(--ink);font:500 14px Inter,sans-serif"><div class="row" style="margin-top:10px"><span class="muted" id="syncSt" style="font-size:12px">'+(tok()?'Verbunden':'Nicht verbunden')+'</span><button class="link" id="syncGo">'+(tok()?'Jetzt syncen':'Verbinden')+'</button></div>';
 const bk=[...pg.querySelectorAll('.card')].find(x=>/Backup/.test(x.textContent));bk?bk.before(c):pg.appendChild(c);
 c.querySelector('#syncGo').onclick=()=>{const v=c.querySelector('#syncTok').value.trim();if(v){origSet.call(localStorage,TK,v);c.querySelector('#syncTok').value='';c.querySelector('#syncGo').textContent='Jetzt syncen'}stat('Verbinde …');pull().then(()=>push())}}
ui();pull();
document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible')pull()});
})();
