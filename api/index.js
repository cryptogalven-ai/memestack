export default async function handler(req, res) {
  try {
    const upstream = await fetch('https://raw.githubusercontent.com/cryptogalven-ai/memestack/main/index.html', { cache: 'no-store' });
    if (!upstream.ok) throw new Error('Impossible de charger MEMESTACK');
    let html = await upstream.text();
    const inject = `<script>(function(){
      const KEY='memestack_published_meme';
      function capture(){const c=document.getElementById('canvas');if(!c)return null;return {battle:(document.getElementById('battleContext')||{}).textContent||localStorage.getItem('memestack_active_battle')||'Battle MEMESTACK',background:getComputedStyle(c).backgroundImage,layers:c.innerHTML,createdAt:Date.now(),votes:0};}
      function save(){const m=capture();if(m)localStorage.setItem(KEY,JSON.stringify(m));}
      function participant(){try{return JSON.parse(localStorage.getItem(KEY)||'null')}catch(e){return null}}
      function render(){const m=participant();if(!m)return;document.querySelectorAll('[data-user-meme-card]').forEach(e=>e.remove());const active=[...document.querySelectorAll('.page.active')][0];if(!active)return;const text=(active.innerText||'').toLowerCase();if(!(text.includes('battle')||text.includes('participants')||text.includes('classement')))return;const card=document.createElement('div');card.dataset.userMemeCard='1';card.style.cssText='margin-top:14px;padding:14px;border:2px solid #b996ff;border-radius:20px;background:#211833';card.innerHTML='<div style="font-size:11px;font-weight:900;color:#c9b5ff;letter-spacing:1px;margin-bottom:10px">🔥 TON MÈME EST DANS CETTE BATTLE</div><div class="canvasPreview" style="position:relative;height:220px;border-radius:14px;overflow:hidden;background:#18141f center/cover no-repeat;border:1px solid #4d3b70"></div><div style="display:flex;justify-content:space-between;align-items:center;margin-top:10px"><b>👑 TON MÈME</b><span class="voteCount">😂 '+m.votes+' votes</span></div><button class="primary userVote" style="margin-top:10px">🔥 VOTER POUR MON MÈME</button>';
        const p=card.querySelector('.canvasPreview');p.style.backgroundImage=m.background;p.innerHTML=m.layers;card.querySelector('.userVote').onclick=()=>{m.votes++;localStorage.setItem(KEY,JSON.stringify(m));card.querySelector('.voteCount').textContent='😂 '+m.votes+' votes';card.querySelector('.userVote').textContent='❤️ Vote enregistré';card.querySelector('.userVote').disabled=true};
        active.appendChild(card);
      }
      function hook(){const btn=document.getElementById('publishBtn');if(btn&&!btn.dataset.memestackHook){btn.dataset.memestackHook='1';btn.addEventListener('click',()=>setTimeout(save,0));}render();}
      const obs=new MutationObserver(()=>hook());obs.observe(document.documentElement,{childList:true,subtree:true});document.addEventListener('click',e=>{if(e.target.closest('#publishBtn'))setTimeout(save,10);if(e.target.closest('button'))setTimeout(render,250)});setInterval(hook,800);hook();
    })();</script>`;
    html = html.replace('</body>', inject + '</body>');
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Cache-Control', 'no-store, max-age=0');
    res.status(200).send(html);
  } catch (e) { res.status(500).send('MEMESTACK loading error'); }
}
