export default async function handler(req, res) {
  try {
    const upstream = await fetch('https://raw.githubusercontent.com/cryptogalven-ai/memestack/main/index.html', { cache: 'no-store' });
    if (!upstream.ok) throw new Error('Impossible de charger MEMESTACK');
    let html = await upstream.text();
    const inject = `<script>(function(){
      const KEY='memestack_published_meme';
      function capture(){const c=document.getElementById('canvas');if(!c)return null;return {battle:(document.getElementById('battleContext')?.textContent||'Battle de la semaine').trim(),background:c.style.backgroundImage||getComputedStyle(c).backgroundImage,filter:c.style.filter||getComputedStyle(c).filter,layers:c.innerHTML,votes:0,time:Date.now()};}
      function save(){const m=capture();if(m)localStorage.setItem(KEY,JSON.stringify(m));return m;}
      function show(id){document.querySelectorAll('.page').forEach(p=>p.classList.remove('active'));document.getElementById(id)?.classList.add('active');window.scrollTo(0,0);}
      function addBattleButton(){
        const pages=[...document.querySelectorAll('.page')];
        const success=pages.find(p=>/publication réussie|ton mème est publié/i.test(p.innerText||''));
        if(!success||success.querySelector('#forceBattleAfterPublish'))return;
        const btn=document.createElement('button');
        btn.id='forceBattleAfterPublish';btn.className='primary';btn.textContent='⚔️ VOIR MA BATTLE';
        btn.style.marginBottom='12px';
        btn.onclick=function(e){e.preventDefault();e.stopPropagation();const nav=document.querySelector('[data-go="battles"]');if(nav)nav.click();else show('battles');setTimeout(render,300);};
        const home=[...success.querySelectorAll('button')].find(b=>/accueil/i.test(b.textContent||''));
        if(home)home.parentNode.insertBefore(btn,home);else success.appendChild(btn);
      }
      function render(){
        let m;try{m=JSON.parse(localStorage.getItem(KEY)||'null')}catch(e){};if(!m)return;
        const active=document.querySelector('.page.active');if(!active||!/battle|classement|participant/i.test(active.innerText||''))return;
        if(active.querySelector('#myPublishedMeme'))return;
        const card=document.createElement('div');card.id='myPublishedMeme';card.className='card';card.innerHTML='<div class="battleBadge">🔥 TON MÈME EST DANS CETTE BATTLE</div><div style="font-weight:900;margin-bottom:10px">👑 TON MÈME</div><div class="preview" style="height:220px;border-radius:16px;overflow:hidden;position:relative;background:#18141f center/cover no-repeat"></div><div class="battleMeta">😂 '+(m.votes||0)+' votes</div>';
        const p=card.querySelector('.preview');p.style.backgroundImage=m.background;p.style.filter=m.filter;p.innerHTML=m.layers;p.querySelectorAll('.layer').forEach(x=>x.style.pointerEvents='none');active.insertBefore(card,active.firstChild);
      }
      document.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;if(/publier mon mème/i.test(b.textContent||'')){save();setTimeout(addBattleButton,100);setTimeout(addBattleButton,400);}},true);
      const obs=new MutationObserver(()=>{addBattleButton();render();});obs.observe(document.documentElement,{childList:true,subtree:true});
      document.addEventListener('DOMContentLoaded',()=>{addBattleButton();render();});
      setInterval(addBattleButton,500);
    })();</script>`;
    html = html.replace('</body>', inject + '</body>');
    res.setHeader('Content-Type','text/html; charset=utf-8');
    res.setHeader('Cache-Control','no-store, max-age=0');
    res.status(200).send(html);
  } catch(e) { res.status(500).send('MEMESTACK loading error'); }
}
