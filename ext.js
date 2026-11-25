(()=>{const st=document.createElement('style');st.textContent=`
button svg{transition:transform .2s;transform-origin:center}
.tap svg{animation:ipop .45s cubic-bezier(.3,1.6,.5,1)}
@keyframes ipop{0%{transform:scale(1)}30%{transform:scale(.75) rotate(-10deg)}65%{transform:scale(1.2) rotate(6deg)}100%{transform:scale(1) rotate(0)}}
.dock button.on svg :is(path,rect,circle){stroke-dasharray:1;animation:idraw .6s ease-out}
@keyframes idraw{from{stroke-dashoffset:1}to{stroke-dashoffset:0}}
.dock button{transition:background .25s,color .25s,transform .15s}.dock button:active{transform:scale(.92)}
@media (prefers-reduced-motion:reduce){.tap svg,.dock button.on svg *{animation:none!important}}`;document.head.appendChild(st);
document.querySelectorAll('.dock svg :is(path,rect,circle)').forEach(p=>p.setAttribute('pathLength','1'));
document.addEventListener('pointerdown',e=>{const b=e.target.closest('button');if(!b||!b.querySelector('svg'))return;b.classList.remove('tap');void b.offsetWidth;b.classList.add('tap');setTimeout(()=>b.classList.remove('tap'),500)});
})();
