export default async function handler(req, res) {
  try {
    const upstream = await fetch('https://raw.githubusercontent.com/cryptogalven-ai/memestack/main/index.html', { cache: 'no-store' });
    if (!upstream.ok) throw new Error('Impossible de charger MEMESTACK');
    let html = await upstream.text();
    const inject = `<script>(function(){
      const KEY='memestack_published_meme';
      function capture(){
        const c=document.getElementById('canvas');
        if(!c)return null;
        const context=(document.getElementById('battleContext')||{}).textContent||'';
        return {
          battle:context.trim()||localStorage.getItem('memestack_active_battle')||'Battle de la semaine',
          background:c.style.backgroundImage||getComputedStyle(c).backgroundImage,
          filter:c.style.filter||getComputedStyle(c).filter,
          layers:c.innerHTML,
          createdAt:Date.now(),votes:0
        };
      }
      function save(){const m=capture();if(m)localStorage.setItem(KEY,JSON.stringify(m));return m;}
      function participant(){try{return JSON.parse(localStorage.getItem(KEY)||'null')}catch(e){return null}}
      function show(id){document.querySelectorAll('.page').forEach(p=>p.classList.remove('active'));const p=document.getElementById(id);if(p)p.classList.add('active');window.scrollTo(0,0);}
      function showSuccess(){
        let page=document.getElementById('publishSuccess');
        if(!page){
          page=document.createElement('section');
          page.id='publishSuccess';page.className='page';
          page.innerHTML='<div class="success"><div class="successIcon">🎉</div><div class="eyebrow">PUBLICATION RÉUSSIE</div><h2>Ton mème est publié !</h2><p class="muted">Il a bien rejoint ta Battle. Tu peux maintenant le voir parmi les participants.</p><button class="primary" id="goMyBattle">⚔️ VOIR MA BATTLE</button><button class="voteBtn" id="goHomeAfterPublish">🏠 RETOUR À L\'ACCUEIL</button></div>';
          document.querySelector('main.app').appendChild(page);
          page.querySelector('#goMyBattle').addEventListener('click',()=>{
            const b=document.querySelector('[data-go="battles"]');
            if(b)b.click();else show('battles');
            setTimeout(render,180);
          });
          page.querySelector('#goHomeAfterPublish').addEventListener('click',()=>show('home'));
        }
        show('publishSuccess');
      }
      function render(){
        const m=participant();if(!m)return;
        document.querySelectorAll('[data-user-meme-card]').forEach(e=>e.remove());
        const active=[...document.querySelectorAll('.page.active')][0];if(!active)return;
        const text=(active.innerText||'').toLowerCase();
        if(!(text.includes('battle')||text.includes('participants')||text.includes('classement')))return;
        const card=document.createElement('div');card.dataset.userMemeCard='1';
        card.style.cssText='margin-top:14px;padding:14px;border:2px solid #b996ff;border-radius:20px;background:#211833';
        card.innerHTML='<div style="font-size:11px;font-weight:900;color:#c9b5ff;letter-spacing:1px;margin-bottom:8px">🔥 TON MÈME EST DANS CETTE BATTLE</div><div style="font-size:13px;color:#d8d0e6;margin-bottom:10px">'+m.battle.replace(/[<>]/g,'')+'</div><div class="canvasPreview" style="position:relative;height:220px;border-radius:14px;overflow:hidden;background:#18141f center/cover no-repeat;border:1px solid #4d3b70"></div><div style="display:flex;justify-content:space-between;align-items:center;margin-top:10px"><b>👑 TON MÈME</b><span class="voteCount">😂 '+(m.votes||0)+' votes</span></div><button class="primary userVote" style="margin-top:10px">😂 VOTER POUR MON MÈME</button>';
        const p=card.querySelector('.canvasPreview');p.style.backgroundImage=m.background;p.style.filter=m.filter;p.innerHTML=m.layers;
        p.querySelectorAll('.layer').forEach(el=>el.style.pointerEvents='none');
        card.querySelector('.userVote').onclick=()=>{m.votes=(m.votes||0)+1;localStorage.setItem(KEY,JSON.stringify(m));card.querySelector('.voteCount').textContent='😂 '+m.votes+' votes';card.querySelector('.userVote').textContent='❤️ Vote enregistré';card.querySelector('.userVote').disabled=true};
        active.insertBefore(card,active.firstChild);
      }
      document.addEventListener('click',e=>{
        const publish=e.target.closest('#publishBtn');
        if(publish){
          e.preventDefault();e.stopImmediatePropagation();
          save();showSuccess();
          return;
        }
        if(e.target.closest('[data-go="battles"]'))setTimeout(render,220);
      },true);
      const obs=new MutationObserver(()=>setTimeout(render,80));obs.observe(document.documentElement,{childList:true,subtree:true});
      setTimeout(render,250);
    })();</script>`;
    html = html.replace('</body>', inject + '</body>');
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Cache-Control', 'no-store, max-age=0');
    res.status(200).send(html);
  } catch (e) { res.status(500).send('MEMESTACK loading error'); }
}
