(function(){'use strict';
 const root=document.documentElement,button=document.getElementById('themeToggle'),english=root.lang==='en';
 function updateImages(){const dark=root.dataset.theme==='dark';document.querySelectorAll('[data-theme-image]').forEach(image=>{image.src=dark?image.dataset.dark:image.dataset.light;});if(button){button.setAttribute('aria-pressed',String(dark));button.setAttribute('aria-label',english?(dark?'Use light theme':'Use dark theme'):(dark?'Passa al tema chiaro':'Passa al tema scuro'));button.title=button.getAttribute('aria-label');}}
 if(button)button.addEventListener('click',()=>{root.dataset.theme=root.dataset.theme==='dark'?'light':'dark';try{localStorage.setItem('twofifties-site-theme',root.dataset.theme);}catch(_){}updateImages();});
 updateImages();
 const banner=document.getElementById('cookieBanner'), consentKey='twofifties-analytics-consent';
 function loadAnalytics(){if(window.__twofiftiesAnalyticsLoaded)return;window.__twofiftiesAnalyticsLoaded=true;window.dataLayer=window.dataLayer||[];window.gtag=function(){window.dataLayer.push(arguments);};window.gtag('js',new Date());window.gtag('config','G-P9818C52WC',{anonymize_ip:true});const script=document.createElement('script');script.async=true;script.src='https://www.googletagmanager.com/gtag/js?id=G-P9818C52WC';document.head.appendChild(script);}
 function saveConsent(value){try{localStorage.setItem(consentKey,value);}catch(_){}if(value==='accepted')loadAnalytics();if(banner)banner.hidden=true;}
 let consent=null;try{consent=localStorage.getItem(consentKey);}catch(_){}if(consent==='accepted')loadAnalytics();else if(consent!=='rejected'&&banner)banner.hidden=false;
 document.querySelectorAll('[data-cookie-accept]').forEach(el=>el.addEventListener('click',()=>saveConsent('accepted')));
 document.querySelectorAll('[data-cookie-reject]').forEach(el=>el.addEventListener('click',()=>saveConsent('rejected')));
 document.querySelectorAll('[data-cookie-settings]').forEach(el=>el.addEventListener('click',()=>{if(banner)banner.hidden=false;}));
 const tabs=[...document.querySelectorAll('[data-gallery-tab]')];
 function choose(tab,focus){tabs.forEach(item=>{const selected=item===tab;item.setAttribute('aria-selected',String(selected));item.tabIndex=selected?0:-1;document.getElementById(item.getAttribute('aria-controls')).hidden=!selected;});if(focus)tab.focus();}
 tabs.forEach(tab=>{tab.addEventListener('click',()=>choose(tab,false));tab.addEventListener('keydown',event=>{if(!['ArrowLeft','ArrowRight','Home','End'].includes(event.key))return;event.preventDefault();const index=tabs.indexOf(tab),next=event.key==='Home'?0:event.key==='End'?tabs.length-1:(index+(event.key==='ArrowRight'?1:-1)+tabs.length)%tabs.length;choose(tabs[next],true);});});
 document.querySelectorAll('[data-copy]').forEach(copy=>copy.addEventListener('click',async()=>{const content=document.getElementById(copy.dataset.copy).textContent;try{await navigator.clipboard.writeText(content);copy.textContent=copy.dataset.success;}catch(_){copy.textContent=copy.dataset.failure;}setTimeout(()=>{copy.textContent=copy.dataset.label;},2600);}));
})();
