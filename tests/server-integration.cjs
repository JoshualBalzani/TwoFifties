'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs/promises'),path=require('node:path'),os=require('node:os'),net=require('node:net'),crypto=require('node:crypto'),{spawn}=require('node:child_process');
const root=path.resolve(__dirname,'..');
async function start(){
 const dir=await fs.mkdtemp(path.join(os.tmpdir(),'spese-test-'));
 const socket=net.createServer();await new Promise(r=>socket.listen(0,'127.0.0.1',r));const port=socket.address().port;await new Promise(r=>socket.close(r));
 const salt=crypto.randomBytes(16),hash=crypto.scryptSync('test-password',salt,64);
 const child=spawn(process.execPath,['server/server.js'],{cwd:root,env:{...process.env,PORT:String(port),BACKUP_DIR:dir,PUBLIC_DIR:path.join(root,'app'),AUTH_USER:'',AUTH_PASS:'',CLEAR_ALL_PASSWORD_HASH:salt.toString('hex')+':'+hash.toString('hex')},windowsHide:true,stdio:['ignore','pipe','pipe']});
 let output='';child.stdout.on('data',d=>output+=d);child.stderr.on('data',d=>output+=d);
 const url='http://127.0.0.1:'+port;
 for(let i=0;i<100;i++){try{if((await fetch(url+'/api/health')).ok)break;}catch(_){}await new Promise(r=>setTimeout(r,100));if(i===99)throw Error(output);}
 return {dir,url,child,async close(){child.kill();await new Promise(resolve=>{if(child.exitCode!==null)return resolve();child.once('exit',resolve);});const target=path.resolve(dir),parent=path.resolve(os.tmpdir());if(path.dirname(target)!==parent||!path.basename(target).startsWith('spese-test-'))throw Error('Unsafe temporary path');await fs.rm(target,{recursive:true,force:true});}};
}
module.exports={start};
if(require.main===module)(async()=>{
 const env=await start();
 try{
 const call=async(route,method='GET',body)=>{const res=await fetch(env.url+route,{method,headers:{'Content-Type':'application/json'},body:body?JSON.stringify(body):undefined});const text=await res.text();return {status:res.status,body:text?JSON.parse(text):null};};
 let state=(await call('/api/state')).body;assert.equal(state.revision,0);
 const entry={id:'test-entry',type:'expense',desc:'Anticipo',amount:30,payer:'person-a',date:'2026-11-02',shareJ:0,shareG:30,categoryId:'cibo',dueDate:'2026-11-03'};
 const payload={...state,entries:[entry],actor:'person-a',baseRevision:0};
 const results=await Promise.all([call('/api/state','PUT',payload),call('/api/state','PUT',{...payload,entries:[{...entry,desc:'concorrente'}]})]);assert.deepEqual(results.map(r=>r.status).sort(),[200,409]);
 state=(await call('/api/state')).body;assert.equal(state.entries.length,1);assert.ok(state.workspace.history.some(h=>h.actor==='person-a'));
 assert.equal((await call('/api/state','PUT',{entries:[]})).status,428);
 const png='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jRZkAAAAASUVORK5CYII=';
 const receipt=await call('/api/receipts','POST',{name:'scontrino.png',data:png});assert.equal(receipt.status,201);
 assert.equal((await fetch(env.url+'/api/receipts/'+receipt.body.id)).status,200);
 assert.equal((await call('/api/receipts','POST',{data:'data:image/png;base64,ZmFrZQ=='})).status,400);
 state.entries[0].receipts=[receipt.body];state.workspace.budgets={cibo:50};state.workspace.savedFilters=[{id:'f',name:'Anticipi',filters:{advance:'person-a'}}];
 let next=await call('/api/state','PUT',{...state,baseRevision:state.revision,actor:'person-b'});assert.equal(next.status,200);state=next.body;
 const snap=await call('/api/backup','POST',{});assert.equal(snap.status,200);
 const trashItem={id:entry.id,entry:state.entries[0],deletedAt:Date.now(),deletedBy:'person-b'};state.entries=[];state.workspace.trash=[trashItem];
 state=(await call('/api/state','PUT',{...state,baseRevision:state.revision,actor:'person-b'})).body;assert.equal(state.entries.length,0);assert.equal(state.workspace.trash.length,1);
 const restore=await call('/api/restore','POST',{file:snap.body.file,baseRevision:state.revision,actor:'person-a'});assert.equal(restore.status,200);state=restore.body;assert.equal(state.entries[0].receipts[0].id,receipt.body.id);assert.equal(state.workspace.budgets.cibo,50);assert.equal(state.workspace.savedFilters.length,1);
 const today=new Date(),iso=today.getFullYear()+'-'+String(today.getMonth()+1).padStart(2,'0')+'-'+String(today.getDate()).padStart(2,'0');
 state.recurrences=[{id:'bill',desc:'Bolletta',amount:40,payer:'person-a',shareJ:20,shareG:20,startDate:iso,dayOfMonth:today.getDate(),active:true,requiresConfirmation:true}];
 state=(await call('/api/state','PUT',{...state,baseRevision:state.revision})).body;assert.equal(state.workspace.pending.length,1);assert.equal(state.entries.length,1);
 await call('/api/recurrences/run','POST',{});state=(await call('/api/state')).body;assert.equal(state.workspace.pending.length,1,'no duplicated proposal');
 const proposal=state.workspace.pending.pop();state.entries.push({...proposal,amount:60,shareJ:30,shareG:30});state=(await call('/api/state','PUT',{...state,baseRevision:state.revision})).body;assert.equal(state.entries.length,2);assert.equal(state.workspace.pending.length,0);
 await call('/api/recurrences/run','POST',{});state=(await call('/api/state')).body;assert.equal(state.workspace.pending.length,0);
 // Failed writes must not publish an unpersisted state.
 const revision=state.revision;const target=path.join(env.dir,'latest.json.tmp');await fs.mkdir(target);
 const failed=await call('/api/state','PUT',{...state,entries:[],baseRevision:revision});assert.equal(failed.status,500);assert.equal((await call('/api/state')).body.revision,revision);await fs.rmdir(target);
 const stale=await call('/api/restore','POST',{file:snap.body.file,baseRevision:0});assert.equal(stale.status,409);
 const clear=await call('/api/clear-all','POST',{password:'test-password',baseRevision:state.revision});assert.equal(clear.status,200);assert.equal(clear.body.state.entries.length,0);assert.equal(clear.body.state.workspace.pending.length,0);
 console.log('OK: server reale isolato, CAS simultaneo, audit, ricevute, cestino, backup completo, ricorrenze proposte/confermate, rollback disco, ripristino obsoleto e cancellazione protetta');
 }finally{await env.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
