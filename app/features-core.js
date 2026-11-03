/* Pure state helpers shared by synchronization and tests. */
(function(root){
'use strict';
const clone=x=>x===undefined?undefined:JSON.parse(JSON.stringify(x));
const canonical=x=>Array.isArray(x)?x.map(canonical):x&&typeof x==='object'?Object.fromEntries(Object.keys(x).sort().map(k=>[k,canonical(x[k])])):x;
const equal=(a,b)=>JSON.stringify(canonical(a))===JSON.stringify(canonical(b));
function workspace(input){
 const s=input&&typeof input==='object'?input:{};
 return {trash:(Array.isArray(s.trash)?s.trash:[]).filter(x=>x&&x.entry&&Number(x.deletedAt)>Date.now()-30*86400000),
 budgets:s.budgets&&typeof s.budgets==='object'&&!Array.isArray(s.budgets)?s.budgets:{},
 savedFilters:Array.isArray(s.savedFilters)?s.savedFilters:[],pending:Array.isArray(s.pending)?s.pending:[],history:Array.isArray(s.history)?s.history:[]};
}
function snapshot(s){return {entries:clone(s.entries||[]),recurrences:clone(s.recurrences||[]),categories:clone(s.categories||[]),settings:clone(s.settings||{}),workspace:workspace(clone(s.workspace)),revision:Number(s.revision)||0};}
function syncSnapshot(s){const out=snapshot(s);out.workspace.history=[];return out;}
function reconcileReminders(entries){
 const links=new Map();
 for(const e of entries)if(e.type==='settle')for(const id of e.reimbursementFor?[e.reimbursementFor]:(e.reimbursedEntryIds||[]))links.set(id,Number(e.created)||Date.now());
 for(const e of entries)if(e.type==='expense'){if(links.has(e.id))e.reimbursedAt=links.get(e.id);else delete e.reimbursedAt;}
 return entries;
}
function merge(base,local,remote,choices={}){
 base=snapshot(base||{});local=snapshot(local);remote=snapshot(remote);
 const result=snapshot(remote),conflicts=[];
 function pick(b,l,r,key,label){
  if(equal(l,b))return clone(r);if(equal(r,b)||equal(l,r))return clone(l);
  if(choices[key])return clone(choices[key]==='local'?l:r);
  conflicts.push({key,label,base:clone(b),local:clone(l),remote:clone(r)});return clone(r);
 }
 function rows(b,l,r,key){
  const bm=new Map(b.map(x=>[x.id,x])),lm=new Map(l.map(x=>[x.id,x])),rm=new Map(r.map(x=>[x.id,x]));
  return [...new Set([...bm.keys(),...lm.keys(),...rm.keys()])].map(id=>pick(bm.get(id),lm.get(id),rm.get(id),key+':'+id,(lm.get(id)||rm.get(id)||bm.get(id)).desc||(lm.get(id)||rm.get(id)||bm.get(id)).name||id)).filter(Boolean);
 }
 for(const key of ['entries','recurrences','categories'])result[key]=rows(base[key],local[key],remote[key],key);
 for(const key of ['trash','pending','savedFilters'])result.workspace[key]=rows(base.workspace[key],local.workspace[key],remote.workspace[key],'workspace.'+key);
 for(const key of ['budgets']){
  result.workspace[key]={};
  for(const id of new Set([...Object.keys(base.workspace[key]),...Object.keys(local.workspace[key]),...Object.keys(remote.workspace[key])])){
   const v=pick(base.workspace[key][id],local.workspace[key][id],remote.workspace[key][id],'workspace.'+key+':'+id,'Budget '+id);
   if(v!==undefined)result.workspace[key][id]=v;
  }
 }
 for(const key of new Set([...Object.keys(base.settings),...Object.keys(local.settings),...Object.keys(remote.settings)])){
  if(key==='updatedAt')continue;
  result.settings[key]=pick(base.settings[key],local.settings[key],remote.settings[key],'settings:'+key,'Impostazione '+key);
 }
 result.settings.updatedAt=Math.max(Number(local.settings.updatedAt)||0,Number(remote.settings.updatedAt)||0);
 // An entry cannot be active and in the trash at once. Conflicting delete/edit is resolved above.
 result.workspace.trash=result.workspace.trash.filter(x=>!result.entries.some(e=>e.id===x.id));
 return {state:result,conflicts};
}
root.SpeseFeaturesCore={clone,equal,workspace,snapshot,syncSnapshot,merge,reconcileReminders};
if(typeof module!=='undefined')module.exports=root.SpeseFeaturesCore;
})(typeof window!=='undefined'?window:globalThis);
