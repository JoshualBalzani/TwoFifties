(function(root){
'use strict';
const T=root.TwoFiftiesI18n||{t:x=>x,fragment:x=>x,locale:"it-IT"};
function install(api){
 const {$}={ $:id=>document.getElementById(id) };
 const {esc,fmtEur,todayISO}=api;
 const P=id=>api.personName(id);
 let editorToken=0,budgetBaseline={};
 const readStorage=key=>{try{return localStorage.getItem(key);}catch(_){return null;}};
 let tab='pending',actor=readStorage('twofifties-actor-v1')||'person-a',draftReceipts=[],busy=false,conflictResolve=null,conflicts=[];
 if(!['person-a','person-b'].includes(actor))actor='person-a';
 const titles={pending:T.fragment('Ricorrenze da confermare'),reminders:T.fragment('Rimborsi'),budgets:T.fragment('Budget mensili'),filters:T.fragment('Filtri salvati'),trash:T.fragment('Cestino'),history:T.fragment('Storico modifiche')};
 const date=x=>new Date(x).toLocaleString(T.locale,{dateStyle:'short',timeStyle:'short'});
 const empty=text=>'<div class="feature-empty"><span class="empty-symbol" aria-hidden="true"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M19 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2zm0 16H5V5h14v14zM7 7h10v2H7V7zm0 4h10v2H7v-2zm0 4h6v2H7v-2z"/></svg></span><p>'+esc(text)+'</p></div>';
 const button=(action,id,label,kind='tonal')=>'<button type="button" class="btn '+kind+'" data-action="'+action+'" data-id="'+esc(id||'')+'">'+esc(label)+'</button>';
 const field=(id,label,type='text',value='')=>'<div class="feature-field"><label for="'+esc(id)+'">'+label+'</label><input id="'+esc(id)+'" type="'+type+'" value="'+esc(String(value))+'"></div>';
 function reminders(){return api.get().entries.filter(e=>e.type==='expense'&&e.dueDate&&!e.reimbursedAt&&(e.payer==='person-a'?e.shareG:e.shareJ)>0).sort((a,b)=>a.dueDate.localeCompare(b.dueDate));}
 function budgetRows(){
  const s=api.get(),month=todayISO().slice(0,7);
  return s.categories.map(c=>{const limit=Number(s.workspace.budgets[c.id])||0,spent=s.entries.filter(e=>e.type==='expense'&&e.categoryId===c.id&&e.date.startsWith(month)).reduce((sum,e)=>sum+e.amount,0);return {c,limit,spent};});
 }
 function render(){
  const s=api.get(),due=reminders().filter(e=>e.dueDate<=todayISO()),pending=s.workspace.pending.length,warnings=budgetRows().filter(r=>r.limit&&r.spent>=r.limit*.8);
  const count=pending+due.length+warnings.length;
  const overviewPath=count?'M11 17h2v-2h-2v2zm0-4h2V7h-2v6zm1-11a10 10 0 1 0 0 20 10 10 0 0 0 0-20z':'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm-1 15-5-5 1.4-1.4L11 14.2l6.6-6.6L19 9l-8 8z';
  $('featureOverview').innerHTML='<button type="button" class="feature-overview" id="openToolsOverview"><span class="overview-symbol" aria-hidden="true"><svg viewBox="0 0 24 24" fill="currentColor"><path fill-rule="evenodd" d="'+overviewPath+'"/></svg></span><span class="overview-content"><strong>'+ (count?T.fragment('Da controllare'):T.fragment('Tutto aggiornato'))+'</strong><small>'+esc([pending?pending+(pending===1?T.fragment(' conferma'):T.fragment(' conferme')):'',due.length?due.length+(due.length===1?T.fragment(' rimborso'):T.fragment(' rimborsi')):'',warnings.length?warnings.length+' avvis'+(warnings.length===1?'o':'i')+' budget':''].filter(Boolean).join(' · ')||T.fragment('Gestisci budget, rimborsi e archivio'))+'</small></span><svg class="overview-arrow" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="m9 6 6 6-6 6-1.4-1.4L12.2 12 7.6 7.4 9 6z"/></svg></button>';
  $('drawerActorName').textContent=P(actor);$('drawerActorName').dataset.personName=actor;$('drawerIdentityBtn').dataset.personId=actor;$('drawerIdentityBtn').setAttribute('aria-description',T.fragment('Gestisci persone e nome nello storico'));$('drawerActorInitial').textContent=api.personInitial(actor);
  document.querySelectorAll('#featureActor option').forEach(option=>{option.textContent=P(option.value);});
  const namesForm=$('personNamesForm');if(namesForm&&!namesForm.contains(document.activeElement)){$('settings-nameJ').value=P('person-a');$('settings-nameG').value=P('person-b');}
  for(const [id,value] of [['pendingNavBadge',pending],['remindersNavBadge',due.length]]){const badge=$(id);badge.hidden=!value;badge.textContent=value;badge.setAttribute('aria-label',value+T.fragment(' in attesa'));}
  const moreBadge=$('moreNavBadge'),moreCount=pending+due.length;if(moreBadge){moreBadge.hidden=!moreCount;moreBadge.textContent=moreCount>99?'99+':String(moreCount);$('nav-more').setAttribute('aria-description',moreCount?moreCount+T.fragment(' elementi da controllare'):T.fragment('Altre funzioni'));}
  $('openToolsOverview').onclick=()=>open(pending?'pending':due.length?'reminders':warnings.length?'budgets':tab);
  for(const r of warnings){const key='twofifties-budget-'+todayISO().slice(0,7)+'-'+r.c.id+'-'+(r.spent>=r.limit?'over':'near');if(!readStorage(key)){try{localStorage.setItem(key,'1');}catch(_){}api.toast(T.categoryName(r.c)+': '+(r.spent>=r.limit?T.fragment('budget superato'):T.fragment('raggiunto l\u201980% del budget')));}}
  if($('toolsSheet').classList.contains('open')&&!conflictResolve&&!$('toolsContent').contains(document.activeElement))renderTools();
 }
 function open(next=tab){tab=next;api.open(next);renderTools();}
 function pretty(value){
  if(value==null)return T.fragment('<p>Voce assente</p>');
  if(Array.isArray(value))return value.length?'<ul>'+value.map(v=>'<li>'+esc(v.desc||v.name||v.entry?.desc||T.fragment('Voce'))+(v.amount?' · '+fmtEur(v.amount):'')+'</li>').join('')+'</ul>':T.fragment('<p>Nessuna voce</p>');
  if(typeof value!=='object')return '<p>'+esc(String(value))+'</p>';
  const labels={desc:T.fragment('Descrizione'),amount:T.fragment('Importo'),date:T.fragment('Data'),payer:T.fragment('Pagato da'),shareJ:T.fragment('Quota ')+P('person-a'),shareG:T.fragment('Quota ')+P('person-b'),note:T.fragment('Nota'),dueDate:T.fragment('Scadenza rimborso'),categoryId:T.fragment('Categoria'),dayOfMonth:T.fragment('Giorno del mese'),startDate:T.fragment('Prima scadenza'),active:T.fragment('Attiva'),requiresConfirmation:T.fragment('Conferma prima di registrare'),name:T.fragment('Nome'),nameJ:T.fragment('Prima persona'),nameG:T.fragment('Seconda persona'),themeColor:'Colore principale',secondaryColor:'Colore secondario',tertiaryColor:'Colore terziario',surfaceColor:'Superfici',personColorJ:T.fragment('Colore ')+P('person-a'),personColorG:T.fragment('Colore ')+P('person-b'),contrastLevel:'Contrasto',from:T.fragment('Da'),to:T.fragment('A'),reimbursedAt:T.fragment('Rimborsata'),receipts:T.fragment('Ricevute'),theme:T.fragment('Tema'),defaultPayer:T.fragment('Pagatore predefinito'),defaultSplit:T.fragment('Divisione predefinita')};
  let pairs=Object.entries(value).filter(([key])=>labels[key]).map(([key,v])=>{
    let text=v;
    if(['amount','shareJ','shareG'].includes(key))text=fmtEur(v);
    if(['payer','from','to','defaultPayer'].includes(key))text=P(v);
    if(key==='categoryId')text=api.get().categories.find(c=>c.id===v)?.name||v;
    if(key==='receipts')text=v.map(r=>r.name).join(', ')||'Nessuna';
    if(key==='reimbursedAt')text=v?date(v):'No';
    if(typeof v==='boolean')text=v?'Si':'No';
    return '<dt>'+esc(labels[key])+'</dt><dd>'+esc(String(text))+'</dd>';
  });
  if(!pairs.length)pairs=Object.entries(value).map(([key,v])=>'<dt>'+esc(api.get().categories.find(c=>c.id===key)?.name||key)+'</dt><dd>'+esc(typeof v==='number'?fmtEur(v):String(v))+'</dd>');
  return '<dl class="feature-description">'+pairs.join('')+'</dl>';
 }
 const symbols={pending:'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm1 5v5.4l3.3 2-.8 1.3L11 13V7h2z',reminders:'M12 22a2 2 0 0 0 2-2h-4a2 2 0 0 0 2 2zm6-6v-5a6 6 0 0 0-5-5.91V4a1 1 0 0 0-2 0v1.09A6 6 0 0 0 6 11v5l-2 2v1h16v-1l-2-2z',trash:'M6 19a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V7H6v12zm9-16-1-1h-4L9 3H5v2h14V3h-4z',filters:'M3 5h18v2H3V5zm3 6h12v2H6v-2zm4 6h4v2h-4v-2z',history:'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm1 5v5.4l3.3 2-.8 1.3L11 13V7h2z'};
 const symbol=kind=>'<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="'+(symbols[kind]||symbols.pending)+'"/></svg>';
 const shortDate=value=>new Date(value+'T12:00:00').toLocaleDateString(T.locale,{day:'numeric',month:'short',year:'numeric'});
 const intro=text=>'<p class="management-intro">'+esc(text)+'</p>';
 const sectionTitle=text=>'<h3 class="management-section-title">'+esc(text)+'</h3>';
 function itemHeader(title,description,kind,amount,html=false){return '<div class="management-item-header"><span class="management-symbol">'+symbol(kind)+'</span><div class="management-item-copy"><h3>'+esc(title)+'</h3><p>'+(html?description:esc(description))+'</p></div>'+(amount!==undefined?'<strong class="management-amount">'+fmtEur(amount)+'</strong>':'')+'</div>';}
 function renderTools(){
  if(conflictResolve)return;
  const s=api.get();let content='';
  if(tab==='trash')content=intro(T.fragment('Le spese eliminate restano recuperabili per 30 giorni e non entrano nei saldi.'))+(s.workspace.trash.length?'<div class="management-list">'+s.workspace.trash.map(t=>'<article class="management-card feature-row">'+itemHeader(t.entry.desc,T.fragment('Eliminata da ')+P(t.deletedBy)+' · '+date(t.deletedAt),'trash',t.entry.amount)+'<div class="feature-actions">'+button('restore',t.id,T.fragment('Ripristina'))+'</div></article>').join('')+'</div>':empty(T.fragment('Nessuna spesa nel cestino.')));
  if(tab==='reminders')content=intro(T.fragment('Tieni sotto controllo gli anticipi, aggiungi una scadenza al calendario o registra il rimborso.'))+(reminders().length?'<div class="management-list">'+reminders().map(e=>'<article class="management-card feature-row">'+itemHeader(e.desc,api.personMarkup(e.payer==='person-a'?'person-b':'person-a')+T.fragment(' rimborsa ')+api.personMarkup(e.payer),'reminders',e.payer==='person-a'?e.shareG:e.shareJ,true)+'<p class="management-status '+(e.dueDate<todayISO()?'overdue':'')+'">'+esc(e.dueDate<todayISO()?T.fragment('Scaduto il ')+shortDate(e.dueDate):e.dueDate===todayISO()?T.fragment('In scadenza oggi'):T.fragment('Scadenza: ')+shortDate(e.dueDate))+'</p><div class="feature-actions">'+button('edit',e.id,T.fragment('Modifica'),'text')+button('calendar',e.id,T.fragment('Calendario'),'text')+button('reimburse',e.id,T.fragment('Registra rimborso'))+'</div></article>').join('')+'</div>':empty(T.fragment('Nessun rimborso in attesa.')));
  if(tab==='budgets'){
   budgetBaseline=root.SpeseFeaturesCore.clone(s.workspace.budgets);
   content=intro(T.fragment('Imposta un limite mensile per ogni categoria. Lascia vuoto per disattivarlo.'))+'<form id="budgetForm"><div class="management-list">'+budgetRows().map(({c,limit,spent})=>'<section class="management-card feature-budget'+(limit&&spent>limit?' is-over':'')+'"><div class="management-item-header"><span class="management-category cat-tone" style="--cat:'+esc(c.color)+'" aria-hidden="true">'+esc(c.icon)+'</span><div class="management-item-copy"><h3>'+esc(T.categoryName(c))+T.fragment('</h3><p>Speso ')+fmtEur(spent)+T.fragment(' questo mese</p></div></div>')+field('budget-'+c.id,T.fragment('Limite mensile (€)'),'number',limit||'').replace('type="number"','type="number" min="0.01" step="0.01" inputmode="decimal" data-budget="'+esc(c.id)+'"')+(limit?'<progress max="'+limit+'" value="'+Math.min(spent,limit)+T.fragment('" aria-label="Budget ')+esc(T.categoryName(c))+'"></progress><p class="management-supporting">'+(spent>limit?T.fragment('Superato di ')+fmtEur(spent-limit):T.fragment('Disponibili ')+fmtEur(limit-spent))+'</p>':T.fragment('<p class="management-supporting">Nessun limite impostato</p>'))+'</section>').join('')+T.fragment('</div><div class="feature-form-actions"><button class="btn filled" type="submit">Salva budget</button></div></form>');
  }
  if(tab==='filters')content=intro(T.fragment('Richiama una vista salvata o ritrova gli anticipi per l’altra persona.'))+sectionTitle(T.fragment('Scorciatoie'))+'<div class="management-shortcuts">'+button('advances','person-a',T.fragment('Anticipi di ')+P('person-a'),'outlined')+button('advances','person-b',T.fragment('Anticipi di ')+P('person-b'),'outlined')+button('clear-filters','',T.fragment('Tutti i movimenti'),'text')+'</div><section class="management-card management-save-view">'+sectionTitle(T.fragment('Salva la vista attuale'))+'<form id="savedFilterForm">'+field('savedFilterName',T.fragment('Nome della vista'))+T.fragment('<div class="feature-actions"><button class="btn filled" type="submit">Salva vista</button></div></form></section>')+sectionTitle(T.fragment('Viste salvate'))+(s.workspace.savedFilters.length?'<div class="management-list">'+s.workspace.savedFilters.map(f=>'<article class="management-card feature-row">'+itemHeader(f.name,({all:T.fragment('Tutti i periodi'),this_month:T.fragment('Questo mese'),last_month:T.fragment('Mese scorso'),last_7:T.fragment('Ultimi 7 giorni'),last_30:T.fragment('Ultimi 30 giorni'),custom:T.fragment('Intervallo personalizzato')}[f.filters.period]||T.fragment('Tutti i periodi'))+(f.filters.search?T.fragment(' · Ricerca: ')+f.filters.search:''),'filters')+'<div class="feature-actions">'+button('delete-filter',f.id,T.fragment('Elimina'),'text')+button('apply-filter',f.id,T.fragment('Applica'))+'</div></article>').join('')+'</div>':empty(T.fragment('Nessuna vista salvata.')));
  if(tab==='history')content=intro(T.fragment('Consulta chi ha cambiato una voce e confronta le versioni precedenti.'))+T.fragment('<div class="management-toolbar"><span>Ultime operazioni salvate</span>')+button('sync','',T.fragment('Sincronizza'),'text')+'</div>'+(s.workspace.history.length?'<div class="management-list">'+s.workspace.history.slice().reverse().map(h=>'<details class="feature-history management-card"><summary><span class="management-history-title">'+esc(h.label)+'</span><span>'+api.personMarkup(h.actor,h.actorName||P(h.actor))+esc(' · '+h.action+' · '+date(h.at))+T.fragment('</span></summary><div class="feature-diff"><div><b>Prima</b>')+pretty(h.before)+T.fragment('</div><div><b>Dopo</b>')+pretty(h.after)+'</div></div></details>').join('')+'</div>':empty(T.fragment('Nessuna modifica registrata.')));
  if(tab==='pending')content=intro(T.fragment('Verifica gli importi prima di registrarli. Le proposte non pesano ancora sui saldi.'))+(s.workspace.pending.length?'<div class="management-toolbar"><span>'+s.workspace.pending.length+' '+(s.workspace.pending.length===1?'proposta':'proposte')+T.fragment(' in attesa</span>')+button('sync','',T.fragment('Aggiorna'),'text')+'</div><div class="management-list">'+s.workspace.pending.map(e=>'<form class="management-card feature-row pending-form" data-id="'+esc(e.id)+'">'+itemHeader(e.desc,esc(shortDate(e.date))+T.fragment(' · Paga ')+api.personMarkup(e.payer),'pending',undefined,true)+field('pending-'+e.id,T.fragment('Importo da registrare (€)'),'number',e.amount).replace('type="number"','type="number" min="0.01" step="0.01" inputmode="decimal" required')+'<div class="feature-actions">'+button('skip-pending',e.id,T.fragment('Salta'),'text')+T.fragment('<button class="btn filled" type="submit">Conferma spesa</button></div></form>')).join('')+'</div>':empty(T.fragment('Nessuna ricorrenza da confermare.')));
  $('toolsTitle').textContent=titles[tab];
  $('toolsContent').innerHTML='<section class="feature-panel management-screen" aria-label="'+esc(titles[tab])+'">'+content+'</section>';
 }
 document.querySelectorAll('[data-feature-target]').forEach(button=>{button.onclick=()=>{open(button.dataset.featureTarget);};});
 const identity=document.createElement('section');identity.className='feature-identity';
 identity.innerHTML=T.fragment('<h3 class="settings-section-title">Nomi delle persone</h3><p class="management-intro">Personalizza i due nomi. Le spese già registrate restano associate alle stesse persone.</p><form id="personNamesForm">')+field('settings-nameJ',T.fragment('Prima persona'),'text',P('person-a'))+field('settings-nameG',T.fragment('Seconda persona'),'text',P('person-b'))+T.fragment('<p id="personNamesError" class="management-form-error" role="alert" hidden></p><div class="feature-actions"><button type="submit" class="btn filled" id="savePersonNamesBtn">Salva nomi</button></div></form><h3 class="settings-section-title">Chi sta usando l’app</h3>')+field('featureActor',T.fragment('Operazioni attribuite a'),'text',actor).replace(/<input[^>]+>/,'<select id="featureActor"><option value="person-a"'+(actor==='person-a'?' selected':'')+'>'+esc(P('person-a'))+'</option><option value="person-b"'+(actor==='person-b'?' selected':'')+'>'+esc(P('person-b'))+'</option></select>')+T.fragment('<p class="hint">Il nome scelto viene mostrato nello storico. Il pagatore si sceglie per ogni spesa.</p>');
 $('settingsPeopleContent').append(identity);
 $('personNamesForm').noValidate=true;
 for(const id of ['settings-nameJ','settings-nameG']){$(id).required=true;$(id).maxLength=40;$(id).autocomplete='off';$(id).setAttribute('aria-describedby','personNamesError');$(id).addEventListener('input',()=>{$('personNamesError').hidden=true;$('settings-nameJ').removeAttribute('aria-invalid');$('settings-nameG').removeAttribute('aria-invalid');});}
 $('personNamesForm').onsubmit=event=>{
  event.preventDefault();const nameJ=root.SpeseLogic.normalizePersonName($('settings-nameJ').value,''),nameG=root.SpeseLogic.normalizePersonName($('settings-nameG').value,'');
  if(!nameJ||!nameG||nameJ.toLocaleLowerCase('it-IT')===nameG.toLocaleLowerCase('it-IT')){$('personNamesError').textContent=T.fragment('Inserisci due nomi diversi, da 1 a 40 caratteri.');$('personNamesError').hidden=false;$('settings-nameJ').setAttribute('aria-invalid','true');$('settings-nameG').setAttribute('aria-invalid','true');$(nameJ&&!nameG?'settings-nameG':'settings-nameJ').focus();return;}
  $('personNamesError').hidden=true;$('settings-nameJ').removeAttribute('aria-invalid');$('settings-nameG').removeAttribute('aria-invalid');$('settings-nameJ').value=nameJ;$('settings-nameG').value=nameG;api.saveSettings({nameJ,nameG});api.renderAll();$('settingsFeedback').textContent=T.fragment('Nomi aggiornati');
 };
 $('featureActor').onchange=event=>{actor=event.target.value;try{localStorage.setItem('twofifties-actor-v1',actor);}catch(_){}$('settingsFeedback').textContent=T.fragment('Operazioni attribuite a ')+P(actor);render();};
 $('toolsContent').addEventListener('click',async event=>{
  const target=event.target.closest('[data-action]');if(!target)return;
  const {action,id}=target.dataset,s=api.get();
  if(action==='restore'){const item=s.workspace.trash.find(x=>x.id===id);if(item){api.mutate(()=>{if(!s.entries.some(e=>e.id===id))s.entries.push(api.normalizeEntry(item.entry));s.workspace.trash=s.workspace.trash.filter(x=>x.id!==id);});api.toast(T.fragment('Spesa recuperata'));}}
  if(action==='edit'){api.openEdit(id);return;}
  if(action==='sync'){target.disabled=true;try{await api.sync();}finally{target.disabled=false;}}
  if(action==='advances'){api.filter({period:'all',person:'all',categoryId:'all',search:'',advance:id});api.close();return;}
  if(action==='clear-filters'){api.filter({period:'all',person:'all',categoryId:'all',search:'',from:null,to:null,advance:'all'});api.close();return;}
  if(action==='apply-filter'){const f=s.workspace.savedFilters.find(x=>x.id===id);if(f)api.filter(f.filters);api.close();return;}
  if(action==='delete-filter')api.mutate(()=>{s.workspace.savedFilters=s.workspace.savedFilters.filter(x=>x.id!==id);});
  if(action==='skip-pending'&&await api.showConfirm({title:T.fragment('Saltare questa scadenza?'),text:T.fragment('La proposta non verra registrata. Le scadenze successive restano attive.'),confirmLabel:T.fragment('Salta')}))api.mutate(()=>{const current=api.get();current.workspace.pending=current.workspace.pending.filter(x=>x.id!==id);});
  if(action==='calendar'){
   const e=s.entries.find(x=>x.id===id);if(e){const escape=x=>String(x).replace(/\\/g,'\\\\').replace(/\n/g,'\\n').replace(/,/g,'\\,').replace(/;/g,'\\;');const start=e.dueDate.replace(/-/g,'');const end=new Date(e.dueDate+'T12:00:00');end.setDate(end.getDate()+1);const endISO=end.getFullYear()+String(end.getMonth()+1).padStart(2,'0')+String(end.getDate()).padStart(2,'0');download('rimborso.ics','text/calendar;charset=utf-8','BEGIN:VCALENDAR\r\nVERSION:2.0\r\nPRODID:-//TwoFifties//Reminders//EN\r\nBEGIN:VEVENT\r\nUID:'+escape(e.id)+'@twofifties\r\nDTSTAMP:'+new Date().toISOString().replace(/[-:]/g,'').replace(/\.\d{3}/,'')+'\r\nDTSTART;VALUE=DATE:'+start+'\r\nDTEND;VALUE=DATE:'+endISO+'\r\nSUMMARY:'+escape(T.fragment('Rimborso: ')+e.desc)+'\r\nBEGIN:VALARM\r\nTRIGGER:-PT9H\r\nACTION:DISPLAY\r\nDESCRIPTION:Rimborso in scadenza\r\nEND:VALARM\r\nEND:VEVENT\r\nEND:VCALENDAR\r\n');}
  }
  if(action==='reimburse'){
   const e=s.entries.find(x=>x.id===id);if(!e)return;const amount=e.payer==='person-a'?e.shareG:e.shareJ,from=e.payer==='person-a'?'person-b':'person-a';
   if(await api.showConfirm({title:T.fragment('Registrare il rimborso?'),text:P(from)+T.t(' restituisce ')+fmtEur(amount)+T.fragment(' a ')+P(e.payer)+T.t('. Verra aggiunto un movimento di saldo.'),confirmLabel:T.fragment('Registra')})){const live=api.get(),current=live.entries.find(x=>x.id===id);if(!current||!root.SpeseFeaturesCore.equal(e,current)){api.toast(T.fragment('La spesa e cambiata: verifica di nuovo il rimborso.'));return;}api.mutate(()=>{current.reimbursedAt=Date.now();live.entries.push({id:api.uid(),type:'settle',date:todayISO(),desc:T.fragment('Rimborso: ')+current.desc,amount,from,to:current.payer,created:Date.now(),reimbursementFor:current.id});});}
  }
  renderTools();
 });
 $('toolsContent').addEventListener('submit',async event=>{
  event.preventDefault();const s=api.get(),form=event.target;
  if(form.id==='budgetForm'){
   const budgets={};for(const input of form.querySelectorAll('[data-budget]')){if(input.value){const n=Number(input.value);if(!Number.isFinite(n)||n<=0)return;budgets[input.dataset.budget]=Math.round(n*100)/100;}}
   const base={workspace:{budgets:budgetBaseline}},local={workspace:{budgets}},remote={workspace:{budgets:s.workspace.budgets}};
   let merged=root.SpeseFeaturesCore.merge(base,local,remote);
   if(merged.conflicts.length){const choices=await resolveConflicts(merged.conflicts);if(!choices)return;merged=root.SpeseFeaturesCore.merge(base,local,remote,choices);}
   api.mutate(()=>{api.get().workspace.budgets=merged.state.workspace.budgets;});api.toast(T.fragment('Budget aggiornati'));
  }
  if(form.id==='savedFilterForm'){
   const name=$('savedFilterName').value.trim().slice(0,60);if(!name){$('savedFilterName').focus();return;}
   api.mutate(()=>{s.workspace.savedFilters.push({id:api.uid(),name,filters:{...s.filters}});});api.toast(T.fragment('Filtro salvato'));
  }
  if(form.classList.contains('pending-form')){
   const e=s.workspace.pending.find(x=>x.id===form.dataset.id);if(!e)return;
   const amount=Number(form.querySelector('input').value);if(!Number.isFinite(amount)||amount<=0)return;
   const shares=api.sharesFromPercent(amount,e.amount?e.shareJ/e.amount*100:50);
   api.mutate(()=>{if(!s.entries.some(x=>x.id===e.id))s.entries.push(api.normalizeEntry({...e,amount,shareJ:shares.shareJ,shareG:shares.shareG}));s.workspace.pending=s.workspace.pending.filter(x=>x.id!==e.id);});api.toast(T.fragment('Spesa confermata'));
  }
  renderTools();
 });
 function download(name,type,data){const url=URL.createObjectURL(new Blob([data],{type}));const a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
 // Expense metadata stays compatible with existing entries and exports.
 const metadata=document.createElement('div');metadata.id='expenseMetadata';metadata.innerHTML=field('f-dueDate',T.fragment('Scadenza rimborso (opzionale)'),'date')+T.fragment('<p class="hint">Per le spese anticipate, mostra un promemoria fino alla registrazione del rimborso.</p><p class="field-label">Ricevute</p><div id="receiptList"></div><div class="feature-actions"><label class="btn tonal feature-upload">Scegli immagine<input id="receiptInput" type="file" accept="image/jpeg,image/png,image/webp"></label><label class="btn text feature-upload">Fotografa<input id="receiptCamera" type="file" accept="image/*" capture="environment"></label></div><p class="hint" id="receiptStatus" aria-live="polite">Le ricevute vengono ridimensionate e caricate sul server.</p>');
 $('sheet').insertBefore(metadata,$('sheet').querySelector('.sheet-actions'));
 function renderReceipts(){
  $('receiptList').innerHTML=draftReceipts.map((r,i)=>'<div class="feature-receipt"><a href="/api/receipts/'+encodeURIComponent(r.id)+'" target="_blank" rel="noopener">'+esc(r.name)+'</a><button class="btn text" type="button" data-remove-receipt="'+i+T.fragment('">Rimuovi</button></div>')).join('');
 }
 $('receiptList').onclick=e=>{const b=e.target.closest('[data-remove-receipt]');if(b){draftReceipts.splice(Number(b.dataset.removeReceipt),1);renderReceipts();}};
 async function upload(event){
  const file=event.target.files[0];if(!file)return;
  if(busy||draftReceipts.length>=5){api.toast(T.fragment('Massimo cinque ricevute per spesa'));return;}
  if(file.size>25*1024*1024){api.toast(T.fragment('Immagine troppo grande (massimo 25 MB prima della riduzione)'));return;}
  const uploadToken=editorToken;
  busy=true;$('saveBtn').disabled=true;$('receiptStatus').textContent=T.fragment('Caricamento ricevuta...');
  try{
   const data=await compress(file);const response=await fetch('/api/receipts',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({name:file.name,data})});
   if(!response.ok)throw Error((await response.json()).error||T.fragment('Caricamento non riuscito'));
   const receipt=await response.json();if(uploadToken!==editorToken)return;
   draftReceipts.push(receipt);renderReceipts();$('receiptStatus').textContent=T.fragment('Ricevuta caricata. Salva la spesa per associarla.');
  }catch(error){$('receiptStatus').textContent=T.fragment('Ricevuta non caricata: ')+error.message+'. Riprova quando sei online.';}
  finally{busy=false;$('saveBtn').disabled=false;event.target.value='';}
 }
 $('receiptInput').onchange=upload;$('receiptCamera').onchange=upload;
 async function compress(file){
  const url=URL.createObjectURL(file);try{
   const image=new Image();image.src=url;await image.decode();const scale=Math.min(1,1600/Math.max(image.width,image.height));
   const canvas=document.createElement('canvas');canvas.width=Math.max(1,Math.round(image.width*scale));canvas.height=Math.max(1,Math.round(image.height*scale));const ctx=canvas.getContext('2d');ctx.fillStyle='#fff';ctx.fillRect(0,0,canvas.width,canvas.height);ctx.drawImage(image,0,0,canvas.width,canvas.height);return canvas.toDataURL('image/jpeg',.82);
  }finally{URL.revokeObjectURL(url);}
 }
 function resolveConflicts(items){
  conflicts=items;api.open();$('toolsTitle').textContent=T.fragment('Confronta le modifiche');
  return new Promise(resolve=>{
   conflictResolve=resolve;
   $('toolsContent').innerHTML=T.fragment('<p class="hint">La stessa voce e cambiata su due dispositivi. Scegli quale versione conservare per ciascuna voce. Nessuna scelta viene applicata finche non confermi.</p><form id="conflictForm">')+items.map((c,i)=>'<fieldset class="feature-conflict"><legend>'+esc(c.label)+'</legend><div class="feature-diff">'+['local','remote'].map(side=>'<label><input type="radio" name="conflict-'+i+'" value="'+side+'" required> '+(side==='local'?T.fragment('Questo dispositivo'):T.fragment('Versione sul server'))+''+pretty(c[side])+'</label>').join('')+'</div></fieldset>').join('')+T.fragment('<div class="feature-actions"><button class="btn filled" type="submit">Conferma scelte</button><button class="btn text" type="button" id="conflictCancel">Decidi dopo</button></div></form>');
   $('conflictForm').onsubmit=event=>{event.preventDefault();const data=new FormData(event.target),choices={};items.forEach((c,i)=>{choices[c.key]=data.get('conflict-'+i);});conflictResolve=null;resolve(choices);renderTools();};
   $('conflictCancel').onclick=()=>{conflictResolve=null;resolve(null);renderTools();};
  });
 }
 // Closing the conflict panel is equivalent to deciding later, never choosing a version.
 new MutationObserver(()=>{if(!$('toolsSheet').classList.contains('open')&&conflictResolve){const done=conflictResolve;conflictResolve=null;done(null);}}).observe($('toolsSheet'),{attributes:true,attributeFilter:['class']});
 return {open,render,actor:()=>actor,resolveConflicts,
  openExpense(e){editorToken++;draftReceipts=(e&&e.receipts?e.receipts:[]).map(x=>({...x}));$('f-dueDate').value=e&&e.dueDate?e.dueDate:'';metadata.hidden=!!(e&&e.type==='settle');renderReceipts();$('receiptStatus').textContent=T.fragment('Le ricevute vengono ridimensionate e caricate sul server.');},
  applyExpenseFields(e){if(e.type==='settle')return;if($('f-dueDate').value)e.dueDate=$('f-dueDate').value;else delete e.dueDate;e.receipts=draftReceipts.map(x=>({...x}));},
  storageError(){api.toast(T.fragment('Memoria locale piena: mantieni aperta la pagina e sincronizza prima di uscire.'));},
  syncError(error){if(navigator.onLine&&error.message&&!/fetch/i.test(error.message))api.toast(error.message);}
 };
}
root.SpeseFeatureUI={install};
})(window);
