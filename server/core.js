'use strict';
const crypto=require('crypto');
const DAY=86400000;
const canonical=x=>Array.isArray(x)?x.map(canonical):x&&typeof x==='object'?Object.fromEntries(Object.keys(x).sort().map(k=>[k,canonical(x[k])])):x;
const same=(a,b)=>JSON.stringify(canonical(a))===JSON.stringify(canonical(b));
function workspace(s={}){
 return {trash:(Array.isArray(s.trash)?s.trash:[]).filter(x=>x&&x.entry&&Number(x.deletedAt)>Date.now()-30*DAY),budgets:s.budgets&&typeof s.budgets==='object'&&!Array.isArray(s.budgets)?s.budgets:{},savedFilters:Array.isArray(s.savedFilters)?s.savedFilters:[],pending:Array.isArray(s.pending)?s.pending:[],history:Array.isArray(s.history)?s.history:[]};
}
function personName(settings, id) {
 if(id==='person-a')return settings.nameJ||'person-a';if(id==='person-b')return settings.nameG||'person-b';return id;
}
function audit(before,after,actor){
 const logs=[];
 const actorName=personName(after.settings||{},actor);
 function rows(a,b,kind){
  const am=new Map((a||[]).map(x=>[x.id,x])),bm=new Map((b||[]).map(x=>[x.id,x]));
  for(const id of new Set([...am.keys(),...bm.keys()])){
   const old=am.get(id),now=bm.get(id);
   if(same(old,now))continue;
   logs.push({id:crypto.randomUUID(),at:Date.now(),actor,actorName,kind,entityId:id,action:!old?'aggiunto':!now?'eliminato':'modificato',label:(now||old).desc||(now||old).name||id,before:old||null,after:now||null});
  }
 }
 rows(before.entries,after.entries,'spesa');rows(before.recurrences,after.recurrences,'ricorrenza');rows(before.categories,after.categories,'categoria');
 for(const key of ['budgets','savedFilters','pending'])if(!same(before.workspace[key],after.workspace[key]))logs.push({id:crypto.randomUUID(),at:Date.now(),actor,actorName,kind:key,action:'modificato',label:{budgets:'Budget',savedFilters:'Filtri salvati',pending:'Ricorrenze da confermare'}[key],before:before.workspace[key],after:after.workspace[key]});
 if(!same({nameJ:before.settings.nameJ||'person-a',nameG:before.settings.nameG||'person-b'},{nameJ:after.settings.nameJ||'person-a',nameG:after.settings.nameG||'person-b'}))logs.push({id:crypto.randomUUID(),at:Date.now(),actor,actorName,kind:'persone',action:'modificato',label:'Nomi delle persone',before:{nameJ:before.settings.nameJ||'person-a',nameG:before.settings.nameG||'person-b'},after:{nameJ:after.settings.nameJ||'person-a',nameG:after.settings.nameG||'person-b'}});
 const colorDefaults={themeColor:'#6750A4',secondaryColor:'',tertiaryColor:'',surfaceColor:'',personColorJ:'#6750A4',personColorG:'#7D5260',contrastLevel:'standard'},colorKeys=Object.keys(colorDefaults);
 const oldColors=Object.fromEntries(colorKeys.map(key=>[key,before.settings[key]??colorDefaults[key]])),newColors=Object.fromEntries(colorKeys.map(key=>[key,after.settings[key]??colorDefaults[key]]));
 if(!same(oldColors,newColors))logs.push({id:crypto.randomUUID(),at:Date.now(),actor,actorName,kind:'aspetto',action:'modificato',label:'Colori e personalizzazione',before:oldColors,after:newColors});
 return (before.workspace.history||[]).concat(logs).slice(-5000);
}
function validate(s){
 for(const key of ['themeColor','secondaryColor','tertiaryColor','surfaceColor','personColorJ','personColorG']){
  const value=s.settings[key];if(value===undefined)continue;
  if(typeof value!=='string'||(!/^#[0-9a-f]{6}$/i.test(value)&&!(['secondaryColor','tertiaryColor','surfaceColor'].includes(key)&&value==='')))throw Object.assign(Error('Colore non valido'),{status:400});
  s.settings[key]=value.toUpperCase();
 }
 if(s.settings.contrastLevel!==undefined&&!['standard','high'].includes(s.settings.contrastLevel))throw Object.assign(Error('Contrasto non valido'),{status:400});
 if(s.settings.setupCompleted!==undefined&&typeof s.settings.setupCompleted!=='boolean')throw Object.assign(Error('Configurazione non valida'),{status:400});
 if(s.settings.setupCompleted===true&&(!s.settings.nameJ||!s.settings.nameG))throw Object.assign(Error('I nomi sono obbligatori'),{status:400});
 const names=[s.settings.nameJ===undefined?'person-a':s.settings.nameJ,s.settings.nameG===undefined?'person-b':s.settings.nameG].map(n=>typeof n==='string'?n.normalize('NFC').replace(/\s+/g,' ').trim():n);
 if(names.some(n=>typeof n!=='string'||!n.trim()||n.length>40||/[\u0000-\u001f\u007f]/.test(n))||names[0].trim().toLocaleLowerCase('it-IT')===names[1].trim().toLocaleLowerCase('it-IT'))throw Object.assign(Error('Inserisci due nomi diversi, da 1 a 40 caratteri'),{status:400});
 if(s.settings.nameJ!==undefined)s.settings.nameJ=names[0].normalize('NFC').replace(/\s+/g,' ').trim();
 if(s.settings.nameG!==undefined)s.settings.nameG=names[1].normalize('NFC').replace(/\s+/g,' ').trim();
 for(const key of ['entries','recurrences','categories']){
  if(!Array.isArray(s[key]))throw Object.assign(Error(key+' non valido'),{status:400});
  const ids=new Set();for(const row of s[key]){if(!row||typeof row.id!=='string'||!row.id||ids.has(row.id))throw Object.assign(Error('ID non valido o duplicato'),{status:400});ids.add(row.id);}
 }
 for(const e of s.entries){
  if(!Number.isFinite(e.amount)||e.amount<=0||!/^\d{4}-\d{2}-\d{2}$/.test(e.date||''))throw Object.assign(Error('Spesa non valida'),{status:400});
  if(e.type!=='settle' && (!Number.isFinite(e.shareJ)||!Number.isFinite(e.shareG)||e.shareJ<0||e.shareG<0||Math.abs(e.shareJ+e.shareG-e.amount)>.011))throw Object.assign(Error('Quote non valide'),{status:400});
 }
 for(const value of Object.values(s.workspace.budgets))if(!Number.isFinite(value)||value<=0)throw Object.assign(Error('Budget non valido'),{status:400});
}
function reconcileReminders(entries){
 const links=new Map();
 for(const e of entries)if(e.type==='settle')for(const id of e.reimbursementFor?[e.reimbursementFor]:(e.reimbursedEntryIds||[]))links.set(id,Number(e.created)||Date.now());
 for(const e of entries)if(e.type==='expense'){if(links.has(e.id))e.reimbursedAt=links.get(e.id);else delete e.reimbursedAt;}
 return entries;
}
function migrateBackup(source){
 const snapshot=structuredClone(source),aliases=[new Set(),new Set()];
 const identity=value=>typeof value==='string'?value.normalize('NFKD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^\p{L}\p{N}]/gu,''):'';
 const remember=settings=>{if(!settings||typeof settings!=='object')return;for(const [index,key]of ['nameJ','nameG'].entries()){const name=identity(settings[key]);if(name)aliases[index].add(name);}};
 remember(snapshot.settings);
 for(const event of snapshot.workspace?.history||[])if(event?.kind==='persone'){remember(event.before);remember(event.after);}
 const canonical=['person-a','person-b'],fields=new Set(['payer','from','to','actor','deletedBy','defaultPayer','person','advance']);
 let converted=0;
 function walk(value){
  if(!value||typeof value!=='object')return;
  for(const [key,item]of Object.entries(value)){
   const dateRange=(key==='from'||key==='to')&&value.type!=='settle';
   const allPeople=(key==='person'||key==='advance')&&item==='all';
   if(fields.has(key)&&!dateRange&&!allPeople&&typeof item==='string'&&!canonical.includes(item)){
    const normalized=identity(item),matches=aliases.map((names,index)=>names.has(normalized)?index:-1).filter(index=>index>=0);
    // Only an unambiguous match to the saved first/second names is safe.
    if(matches.length===1){value[key]=canonical[matches[0]];converted++;}
   }else if(item&&typeof item==='object')walk(item);
  }
 }
 walk(snapshot);
 const settings=snapshot.settings;
 if(settings&&typeof settings==='object'&&!Array.isArray(settings)&&settings.setupCompleted===undefined&&typeof settings.nameJ==='string'&&typeof settings.nameG==='string'&&settings.nameJ.trim()&&settings.nameG.trim()&&settings.nameJ.trim().toLowerCase()!==settings.nameG.trim().toLowerCase())settings.setupCompleted=true;
 return {snapshot,converted};
}
module.exports={workspace,audit,validate,reconcileReminders,migrateBackup};
