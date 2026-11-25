(()=>{const st=document.createElement('style');st.textContent=`
button svg{transition:transform .2s;transform-origin:center}
.tap svg{animation:ipop .45s cubic-bezier(.3,1.6,.5,1)}
@keyframes ipop{0%{transform:scale(1)}30%{transform:scale(.75) rotate(-10deg)}65%{transform:scale(1.2) rotate(6deg)}100%{transform:scale(1) rotate(0)}}
.dock button.on svg :is(path,rect,circle){stroke-dasharray:1;animation:idraw .6s ease-out}
@keyframes idraw{from{stroke-dashoffset:1}to{stroke-dashoffset:0}}
.dock button{transition:background .25s,color .25s,transform .15s}.dock button:active{transform:scale(.92)}
@media (prefers-reduced-motion:reduce){.tap svg,.dock button.on svg *{animation:none!important}}`;document.head.appendChild(st);
{const l=document.createElement('link');l.rel='stylesheet';l.href='/themes/v2.css?t='+Date.now();document.head.appendChild(l)}
const IC={start:'<path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"/>',save:'<path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z"/>'};
Object.entries(IC).forEach(([k,v])=>{const s=document.querySelector('.dock [data-tab="'+k+'"] svg');if(s){s.innerHTML=v;s.setAttribute('stroke-linejoin','round')}});
document.querySelectorAll('.dock svg :is(path,rect,circle)').forEach(p=>p.setAttribute('pathLength','1'));
document.addEventListener('pointerdown',e=>{const b=e.target.closest('button');if(!b||!b.querySelector('svg'))return;b.classList.remove('tap');void b.offsetWidth;b.classList.add('tap');setTimeout(()=>b.classList.remove('tap'),500)});
{const h=document.querySelector('#p-start header');if(h){const row=h.querySelector('.row'),route=[...h.children].find(e=>e.matches('span.muted')&&e.id!=='today'),pill=document.getElementById('count'),td=document.getElementById('today'),h1=row&&row.querySelector('h1');
 if(td)td.style.display='none';
 if(row&&h1){row.className='head';row.style.cssText='padding:0 4px';if(!h1.dataset.t||!(JSON.parse(localStorage.getItem('brasilState2')||'{}').texts||{})[h1.dataset.t]){h1.textContent='Reisebudget'}h1.dataset.def='Reisebudget'}
 if(route){route.style.fontSize='12px';route.style.padding='0 4px'}
 if(pill){pill.style.fontSize='12px';pill.style.padding='4px 9px'}
 const lab=document.querySelector('#p-start .card .row .muted');if(lab&&!lab.id)lab.closest('.row').style.display='none'}}
{const s=document.createElement('script');s.src='/alt.js?t='+Date.now();document.body.appendChild(s)}
})();
