(function(root){
 'use strict';
 let language='it';try{language=localStorage.getItem('twofifties-language')||'it';}catch(_){}
 if(!['it','en'].includes(language))language='it';
 const dictionary=root.TwoFiftiesEnglish||{};
 function t(value){if(typeof value!=='string'||language==='it')return value;const key=value.trim();return dictionary[value]|| (dictionary[key] ? value.replace(key,dictionary[key]) : value);}
 function fragment(value){return value.replace(/(^|>)([^<>]*)(?=<|$)/g,(_,prefix,text)=>prefix+t(text)).replace(/((?:aria-label|aria-description|placeholder|title)=")(.*?)(?="|$)/g,(_,prefix,text)=>prefix+t(text));}
 function translateStatic(scope){const walker=document.createTreeWalker(scope,NodeFilter.SHOW_TEXT);let node;while((node=walker.nextNode()))if(!node.parentElement.closest('script,style,textarea'))node.nodeValue=t(node.nodeValue);scope.querySelectorAll('[aria-label],[title],[placeholder]').forEach(el=>['aria-label','title','placeholder'].forEach(attr=>{if(el.hasAttribute(attr))el.setAttribute(attr,t(el.getAttribute(attr)));}));document.documentElement.lang=language;}
 function categoryName(c){const defaults={cibo:'Cibo',casa:'Casa',trasporti:'Trasporti',svago:'Svago',salute:'Salute',regali:'Regali',altro:'Altro'};return language==='en'&&defaults[c.id]===c.name?(c.id==='altro'?'Other':t(c.name)):c.name;}
 root.TwoFiftiesI18n={categoryName,language,locale:language==='en'?'en-GB':'it-IT',t,fragment,translateStatic,setLanguage(value,options={}){if(!['it','en'].includes(value))return false;if(value===language)return true;try{localStorage.setItem('twofifties-language',value);if(localStorage.getItem('twofifties-language')!==value)return false;if(options.returnTo)sessionStorage.setItem('twofifties-settings-return',options.returnTo);}catch(_){return false;}location.reload();return true;}};
})(window);
