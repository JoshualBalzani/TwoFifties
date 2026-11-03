'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const L=require('../app/logic.js').SpeseLogic,F=require('../app/features-core.js');
for(let cents=1;cents<=10000;cents++)for(const normalize of [L.normalizeEntry,L.normalizeRecurrence]){const e=normalize({amount:cents/100});assert.equal(Math.round((e.shareJ+e.shareG)*100),cents);}
const base=F.snapshot({entries:[{id:'a',desc:'originale',amount:10}],workspace:{},settings:{theme:'light'}});
let local=F.clone(base),remote=F.clone(base);local.entries.push({id:'b'});remote.entries.push({id:'c'});let merged=F.merge(base,local,remote);assert.equal(merged.conflicts.length,0);assert.equal(merged.state.entries.length,3);
local=F.clone(base);remote=F.clone(base);local.entries[0].amount=12;remote.entries[0].amount=15;merged=F.merge(base,local,remote);assert.equal(merged.conflicts.length,1);assert.equal(F.merge(base,local,remote,{'entries:a':'local'}).state.entries[0].amount,12);
remote.entries=[];assert.equal(F.merge(base,local,remote).conflicts.length,1,'edit versus deletion must ask');
assert.equal(F.workspace({trash:[{id:'x',entry:{id:'x'},deletedAt:Date.now()-31*86400000}]}).trash.length,0);
const e=L.normalizeEntry({id:'a',amount:30,payer:'person-a',shareJ:0,shareG:30,note:'farmacia',dueDate:'2026-12-01',receipts:[{id:'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa.jpg',name:'foto'}]});
assert.equal(e.dueDate,'2026-12-01');assert.equal(e.receipts.length,1);
const filters={period:'all',person:'all',categoryId:'all',search:'farmacia',advance:'person-a'};assert.equal(L.applyFilters([e],filters).length,1);filters.advance='person-b';assert.equal(L.applyFilters([e],filters).length,0);
assert.equal(L.normalizeRecurrence({amount:10,requiresConfirmation:true}).requiresConfirmation,true);
const reminder={id:'reminder',type:'expense',reimbursedAt:1},repayment={id:'paid',type:'settle',reimbursementFor:'reminder',created:5};
F.reconcileReminders([reminder]);assert.equal(reminder.reimbursedAt,undefined);F.reconcileReminders([reminder,repayment]);assert.equal(reminder.reimbursedAt,5);
const src=fs.readFileSync(path.join(__dirname,'../server/server.js'),'utf8');
(async()=>{const context={writeLock:Promise.resolve(),state:{},ensureDir:async()=>{},writeJson:async()=>{throw Error('disk full')},path,STATE_FILE:'test',BACKUP_DIR:'.',todayStamp:()=>'',cleanupOldDaily:async()=>{}};vm.createContext(context);vm.runInContext(src.slice(src.indexOf('function persistState('),src.indexOf('// Serialize API')),context);await assert.rejects(context.persistState(),/disk full/);context.writeJson=async()=>{};await context.persistState();console.log('OK: 20.000 quote, merge concorrente, conflitti modifica/eliminazione, cestino, metadati, ricerca note, anticipi, ricorrenze e errori disco');})().catch(e=>{console.error(e);process.exitCode=1});
