(()=>{
 const button=document.querySelector('.menu-button'),nav=document.querySelector('.profile-nav');
 const setOpen=open=>{if(!button||!nav)return;nav.classList.toggle('is-open',open);button.setAttribute('aria-expanded',String(open));button.setAttribute('aria-label',open?'Close navigation':'Open navigation');};
 button?.addEventListener('click',()=>setOpen(button.getAttribute('aria-expanded')!=='true'));
 nav?.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>setOpen(false)));
 document.addEventListener('keydown',e=>{if(e.key==='Escape'&&button?.getAttribute('aria-expanded')==='true'){setOpen(false);button.focus();}});
 document.addEventListener('click',e=>{if(nav?.classList.contains('is-open')&&!e.target.closest('.profile-header'))setOpen(false);});
 const sections=[...document.querySelectorAll('main>section[id],main>div>section[id]')];
 if(nav&&sections.length&&location.pathname.split('/').pop()!=='education.html'&&location.pathname.split('/').pop()!=='experience.html'){
 const observer=new IntersectionObserver(entries=>{for(const e of entries){if(!e.isIntersecting)continue;const current=nav.querySelector('a[href="index.html#'+e.target.id+'"]')||nav.querySelector('a[href="'+e.target.id+'.html"]');if(current){for(const a of nav.querySelectorAll('a'))a.removeAttribute('aria-current');current.setAttribute('aria-current','location');}}},{rootMargin:'-10% 0px -65% 0px',threshold:0});sections.forEach(s=>observer.observe(s));
 }
 document.querySelectorAll('.finance-entry').forEach(d=>d.addEventListener('toggle',()=>{if(d.open)for(const sibling of document.querySelectorAll('.finance-entry'))if(sibling!==d)sibling.open=false;}));
})();
(()=>{
 document.addEventListener('click',e=>{
  const button=e.target.closest('[data-gallery]');if(!button)return;
  let items;try{items=JSON.parse(button.dataset.gallery)}catch{return}if(!Array.isArray(items)||!items.length)return;
  const dialog=document.getElementById('media-dialog');let position=0;
  window.openEvidence({path:items[0].path,title:items[0].title,caption:items[0].caption});
  dialog.querySelector('.gallery-navigation')?.remove();
  const controls=document.createElement('div');controls.className='gallery-navigation';controls.setAttribute('aria-label','Original material gallery');
  const previous=document.createElement('button'),next=document.createElement('button'),count=document.createElement('span');
  previous.type=next.type='button';previous.textContent='Previous';next.textContent='Next';count.setAttribute('role','status');count.setAttribute('aria-live','polite');
  controls.append(previous,count,next);dialog.append(controls);
  const update=()=>{const item=items[position];const img=dialog.querySelector('.media-content img');if(img){img.src=item.path;img.alt=item.title;}dialog.querySelector('#media-title').textContent=item.title;dialog.querySelector('.media-caption').textContent=item.caption;count.textContent=(position+1)+' / '+items.length;previous.disabled=position===0;next.disabled=position===items.length-1;};
  previous.addEventListener('click',()=>{if(position>0){position--;update();}});next.addEventListener('click',()=>{if(position<items.length-1){position++;update();}});update();
  dialog.addEventListener('close',()=>controls.remove(),{once:true});
 });
})();
