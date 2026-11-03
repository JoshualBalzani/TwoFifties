(function(){'use strict';
 const root=document.documentElement,button=document.getElementById('themeToggle'),english=root.lang==='en';
 function updateImages(){const dark=root.dataset.theme==='dark';document.querySelectorAll('[data-theme-image]').forEach(image=>{image.src=dark?image.dataset.dark:image.dataset.light;});if(button){button.setAttribute('aria-pressed',String(dark));button.setAttribute('aria-label',english?(dark?'Use light theme':'Use dark theme'):(dark?'Passa al tema chiaro':'Passa al tema scuro'));button.title=button.getAttribute('aria-label');}}
 if(button)button.addEventListener('click',()=>{root.dataset.theme=root.dataset.theme==='dark'?'light':'dark';try{localStorage.setItem('twofifties-site-theme',root.dataset.theme);}catch(_){}updateImages();});
 updateImages();
 const tabs=[...document.querySelectorAll('[data-gallery-tab]')];
 function choose(tab,focus){tabs.forEach(item=>{const selected=item===tab;item.setAttribute('aria-selected',String(selected));item.tabIndex=selected?0:-1;document.getElementById(item.getAttribute('aria-controls')).hidden=!selected;});if(focus)tab.focus();}
 tabs.forEach(tab=>{tab.addEventListener('click',()=>choose(tab,false));tab.addEventListener('keydown',event=>{if(!['ArrowLeft','ArrowRight','Home','End'].includes(event.key))return;event.preventDefault();const index=tabs.indexOf(tab),next=event.key==='Home'?0:event.key==='End'?tabs.length-1:(index+(event.key==='ArrowRight'?1:-1)+tabs.length)%tabs.length;choose(tabs[next],true);});});
 document.querySelectorAll('[data-copy]').forEach(copy=>copy.addEventListener('click',async()=>{const content=document.getElementById(copy.dataset.copy).textContent;try{await navigator.clipboard.writeText(content);copy.textContent=copy.dataset.success;}catch(_){copy.textContent=copy.dataset.failure;}setTimeout(()=>{copy.textContent=copy.dataset.label;},2600);}));
})();
