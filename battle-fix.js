// MEMESTACK Battle fix helper
// Load queue directly from battle_queue, then fetch the corresponding active memes.
async function loadBattleDirect(){
  if(!db)return;
  const content=$('battleContent'), queue=$('queue');
  content.innerHTML='<div class="card empty">Loading Battle…</div>';
  try{
    const q=await db.from('battle_queue').select('meme_id,created_at').order('created_at',{ascending:true});
    if(q.error)throw q.error;
    const ids=[...new Set((q.data||[]).map(x=>x.meme_id))];
    if(!ids.length){
      content.innerHTML='<div class="card empty"><h3>⚔️ Battle needs 2 memes</h3><p class="muted">Add a meme to the Battle Queue.</p></div>';
      queue.innerHTML='<p class="muted tiny">No memes in queue yet.</p>';
      return;
    }
    const m=await db.from('memes').select('id,title,image_url,user_id').in('id',ids).eq('status','active');
    if(m.error)throw m.error;
    const byId=new Map((m.data||[]).map(x=>[x.id,x]));
    const battleMemes=ids.map(id=>byId.get(id)).filter(Boolean);
    queue.innerHTML=battleMemes.map(x=>'<div class="queue-item card"><img src="'+esc(x.image_url)+'"><b>'+esc(x.title||'Untitled meme')+'</b></div>').join('')||'<p class="muted tiny">No active memes in queue.</p>';
    if(battleMemes.length<2){content.innerHTML='<div class="card empty"><h3>⚔️ Battle needs 2 memes</h3><p class="muted">Add one more meme to the queue.</p></div>';return;}
    const a=battleMemes[0],b=battleMemes[1];
    content.innerHTML='<div class="battle-grid"><div class="fighter"><img src="'+esc(a.image_url)+'"><b>'+esc(a.title||'Untitled meme')+'</b><button class="primary pick" data-id="'+a.id+'">VOTE A</button></div><div class="fighter"><img src="'+esc(b.image_url)+'"><b>'+esc(b.title||'Untitled meme')+'</b><button class="primary pick" data-id="'+b.id+'">VOTE B</button></div></div>';
    document.querySelectorAll('.pick').forEach(x=>x.addEventListener('click',()=>voteBattle(x.dataset.id)));
  }catch(e){console.warn(e);content.innerHTML='<div class="card empty"><h3>⚠️ Battle unavailable</h3><p class="muted tiny">'+esc(e.message||'Please reload.')+'</p></div>';}
}
