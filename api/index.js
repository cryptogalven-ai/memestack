export default async function handler(req, res) {
  try {
    const upstream = await fetch('https://raw.githubusercontent.com/cryptogalven-ai/memestack/main/index.html', { cache: 'no-store' });
    if (!upstream.ok) throw new Error('Impossible de charger MEMESTACK');
    let html = await upstream.text();
    const inject = `<script>(function(){
      const KEY='memestack_published_meme';
      const qs=(s,r=document)=>r.querySelector(s);
      function show(id){document.querySelectorAll('.page').forEach(p=>p.classList.remove('active'));const p=document.getElementById(id);if(p)p.classList.add('active');window.scrollTo(0,0);}
      function snapshot(){const c=qs('#canvas');if(!c)return null;return {battle:(qs('#battleContext')?.textContent||localStorage.getItem('memestack_active_battle')||'Battle de la semaine').trim(),background:c.style.backgroundImage||getComputedStyle(c).backgroundImage,filter:c.style.filter||getComputedStyle(c).filter,layers:c.innerHTML,votes:0,time:Date.now()};}
      function save(){const m=snapshot();if(m)localStorage.setItem(KEY,JSON.stringify(m));return m;}
      function get(){try{return JSON.parse(localStorage.getItem(KEY)||'null')}catch(e){return null}}
      function cleanSuccess(){
        let p=qs('#publishSuccessClean');
        if(!p){p=document.createElement('section');p.id='publishSuccessClean';p.className='page';document.querySelector('main.app').appendChild(p);}
        p.innerHTML='<div class="success"><div class="successIcon">🎉</div><div class="eyebrow">PUBLICATION RÉUSSIE</div><h2>Ton mème est publié !</h2><p class="muted">Ton mème a rejoint la Battle. Tu peux maintenant le retrouver parmi les participants.</p><button class="primary" id="viewBattleClean">⚔️ VOIR MA BATTLE</button><button class="voteBtn" id="homeClean">🏠 RETOUR À L\'ACCUEIL</button></div>';
        qs('#viewBattleClean',p).onclick=function(){openBattle()};qs('#homeClean',p).onclick=function(){show('home')};show('publishSuccessClean');
      }
      function battlePage(){return qs('#battles')||[...document.querySelectorAll('.page')].find(p=>/battle/i.test(p.innerText||''));}
      function openBattle(){const nav=qs('[data-go="battles"]');if(nav)nav.click();else {const p=battlePage();if(p)show(p.id);}setTimeout(renderMine,120);setTimeout(renderMine,350);}
      function renderMine(){const m=get(),p=document.querySelector('.page.active');if(!m||!p)return;if(!/battle|participants|classement|votes/i.test(p.innerText||''))return;qs('#myPublishedMeme')?.remove();const card=document.createElement('div');card.id='myPublishedMeme';card.className='card';card.innerHTML='<div class="battleBadge">🔥 TON MÈME EST DANS CETTE BATTLE</div><div style="font-weight:900;margin-bottom:10px">👑 TON MÈME</div><div id="myPreview" style="height:220px;border-radius:16px;overflow:hidden;position:relative;background:#18141f center/cover no-repeat"></div><div class="battleMeta" id="myVotes">😂 '+(m.votes||0)+' votes</div><button class="primary" id="voteMine">😂 VOTER</button>';const prev=qs('#myPreview',card);prev.style.backgroundImage=m.background;prev.style.filter=m.filter;prev.innerHTML=m.layers;prev.querySelectorAll('.layer').forEach(x=>x.style.pointerEvents='none');qs('#voteMine',card).onclick=function(){m.votes=(m.votes||0)+1;localStorage.setItem(KEY,JSON.stringify(m));qs('#myVotes',card).textContent='😂 '+m.votes+' votes';this.textContent='❤️ VOTE ENREGISTRÉ';this.disabled=true};p.insertBefore(card,p.firstChild);}
      document.addEventListener('click',function(e){const b=e.target.closest('button');if(!b)return;if(/publier\s*(mon|le)\s*mème/i.test((b.textContent||'').replace(/\s+/g,' '))){e.preventDefault();e.stopImmediatePropagation();save();cleanSuccess();}},true);
      document.addEventListener('click',e=>{if(e.target.closest('[data-go="battles"]'))setTimeout(renderMine,200)},true);
      const observer=new MutationObserver(()=>setTimeout(renderMine,50));observer.observe(document.body,{childList:true,subtree:true});
    })();</script>`;
    html = html.replace('</body>', inject + '</body>');
    res.setHeader('Content-Type','text/html; charset=utf-8');res.setHeader('Cache-Control','no-store, max-age=0');res.status(200).send(html);
  } catch(e) { res.status(500).send('MEMESTACK loading error'); }
}
