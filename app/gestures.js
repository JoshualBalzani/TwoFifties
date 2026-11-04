/* Gestures are scoped to non-destructive navigation; native scrolling and zoom remain available. */
(function(root){
  'use strict';
  function swipeDirection(dx,dy,elapsed){
    if(elapsed>700 || Math.abs(dx)<112 || Math.abs(dx)<Math.abs(dy)*2.2) return null;
    return dx<0?'left':'right';
  }
  function shouldDismiss(distance,elapsed){return distance>=96 || (distance>=40 && distance/Math.max(elapsed,1)>.65);}
  function install(options){
    const {document:doc,sheets,dashboard,isTop,dismissSheet,previousMonth,nextMonth}=options;
    const reduced=()=>root.matchMedia && root.matchMedia('(prefers-reduced-motion: reduce)').matches;
    sheets.forEach(sheet=>{
      const handle=sheet.querySelector('.sheet-handle');
      let drag=null,suppressClick=false;
      handle.addEventListener('click',event=>{
        if(suppressClick){event.preventDefault();suppressClick=false;return;}
        if(isTop(sheet))dismissSheet(sheet);
      });
      handle.addEventListener('pointerdown',event=>{
        if(!event.isPrimary || event.button!==0 || !isTop(sheet))return;
        drag={id:event.pointerId,y:event.clientY,time:Date.now(),distance:0};suppressClick=false;
        handle.setPointerCapture(event.pointerId);
      });
      handle.addEventListener('pointermove',event=>{
        if(!drag || event.pointerId!==drag.id)return;
        drag.distance=Math.max(0,event.clientY-drag.y);
        if(drag.distance<6)return;
        sheet.classList.add('gesture-dragging');
        if(!reduced())sheet.style.transform='translateY('+Math.min(drag.distance,sheet.clientHeight)+'px)';
      });
      function finish(event,cancelled){
        if(!drag || event.pointerId!==drag.id)return;
        const current=drag;drag=null;
        suppressClick=current.distance>=6;
        sheet.classList.remove('gesture-dragging');sheet.style.removeProperty('transform');
        if(handle.hasPointerCapture(event.pointerId))handle.releasePointerCapture(event.pointerId);
        if(!cancelled && shouldDismiss(current.distance,Date.now()-current.time) && isTop(sheet))dismissSheet(sheet);
      }
      handle.addEventListener('pointerup',e=>finish(e,false));
      handle.addEventListener('pointercancel',e=>finish(e,true));
      handle.addEventListener('lostpointercapture',e=>finish(e,true));
    });
    function horizontalSwipe(el,callback){
      let start=null;
      el.addEventListener('touchstart',event=>{
        start=null;
        if(event.touches.length!==1 || !isTop(el) || event.target.closest('button,input,textarea,select,a,[role="slider"],.sheet-handle'))return;
        const t=event.touches[0];start={x:t.clientX,y:t.clientY,time:Date.now(),id:t.identifier};
      },{passive:true});
      el.addEventListener('touchmove',event=>{if(event.touches.length!==1){start=null;return;}if(start){const t=event.touches[0];if(Math.abs(t.clientY-start.y)>Math.abs(t.clientX-start.x)*.7)start=null;}},{passive:true});
      el.addEventListener('touchend',event=>{
        if(!start)return;
        const initial=start;start=null;
        const t=[...event.changedTouches].find(t=>t.identifier===initial.id);
        if(!t || !isTop(el))return;
        const direction=swipeDirection(t.clientX-initial.x,t.clientY-initial.y,Date.now()-initial.time);
        if(direction)callback(direction);
      },{passive:true});
      el.addEventListener('touchcancel',()=>{start=null;},{passive:true});
    }
    horizontalSwipe(dashboard,direction=>direction==='left'?nextMonth():previousMonth());
  }
  root.SpeseGestures={install,swipeDirection,shouldDismiss};
})(typeof window!=='undefined'?window:globalThis);
