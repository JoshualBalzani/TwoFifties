/* Sample physical spring responses into CSS linear() timing functions.
   CSS transitions retain browser-managed reversal and interruption behavior. */
(function(root){
  'use strict';
  function spring(stiffness,damping,duration){
    const frequency=Math.sqrt(stiffness),ratio=damping/(2*frequency),points=[];
    for(let i=0;i<=60;i++){
      const t=i/60*duration;
      const value=ratio<1
        ?1-Math.exp(-ratio*frequency*t)*(Math.cos(frequency*Math.sqrt(1-ratio*ratio)*t)+ratio/Math.sqrt(1-ratio*ratio)*Math.sin(frequency*Math.sqrt(1-ratio*ratio)*t))
        :1-(1+frequency*t)*Math.exp(-frequency*t);
      points.push((i===60?1:value).toFixed(5));
    }
    return 'linear('+points.join(',')+')';
  }
  function install(){
    const doc=root.document,style=doc.documentElement.style;
    if(root.CSS?.supports('transition-timing-function','linear(0, 1)')){
      style.setProperty('--motion-spatial',spring(450,32,.42));
      style.setProperty('--motion-fast-spatial',spring(700,40,.32));
      style.setProperty('--motion-effects',spring(1600,80,.24));
    }
    // Track the visible viewport so sheet actions remain reachable above mobile keyboards.
    const viewport=root.visualViewport;
    const resize=()=>{
      style.setProperty('--viewport-height',Math.round(viewport?.height||root.innerHeight)+'px');
      style.setProperty('--keyboard-inset',Math.max(0,Math.round(root.innerHeight-(viewport?.height||root.innerHeight)-(viewport?.offsetTop||0)))+'px');
    };
    resize();viewport?.addEventListener('resize',resize);root.addEventListener('resize',resize);
    // Native titles provide a discoverable label for icon-only controls in a collapsed rail.
    doc.querySelectorAll('.bottom-nav-item').forEach(button=>{
      if(!button.title)button.title=button.textContent.trim();
    });
  }
  if(root.document.readyState==='loading')root.document.addEventListener('DOMContentLoaded',install,{once:true});else install();
})(window);
