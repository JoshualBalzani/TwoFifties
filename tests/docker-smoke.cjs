'use strict';
const {spawnSync}=require('node:child_process'),assert=require('node:assert/strict');
function docker(args){const r=spawnSync('docker',args,{encoding:'utf8',windowsHide:true});if(r.status!==0)throw Error(r.stderr||r.stdout);return r.stdout.trim();}
(async()=>{
 let id;
 try{
  id=docker(['run','--rm','-d','--name','twofifties-validation-'+Date.now(),'-p','127.0.0.1::8080','twofifties:validation']);
  const info=JSON.parse(docker(['inspect',id]))[0],port=info.NetworkSettings.Ports['8080/tcp'][0].HostPort,url='http://127.0.0.1:'+port;
  for(let i=0;i<40;i++){try{if((await fetch(url+'/api/health')).ok)break;}catch(_){}await new Promise(r=>setTimeout(r,200));}
  const html=await fetch(url+'/').then(r=>r.text());
  const assets=['/','/sw.js',...[...html.matchAll(/(?:src|href)="([^"]+\.(?:js|css)(?:\?[^"]*)?)"/g)].map(m=>m[1]).filter(src=>!src.startsWith('http')).map(src=>'/'+src)];
  for(const asset of assets)assert.equal((await fetch(url+asset)).status,200,asset);
  const state=await fetch(url+'/api/state').then(r=>r.json());assert.equal(state.revision,0);
  const save=await fetch(url+'/api/state',{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify({...state,baseRevision:0,actor:'person-a',workspace:{...state.workspace,budgets:{cibo:100}}})});assert.equal(save.status,200);assert.equal((await save.json()).workspace.budgets.cibo,100);
  console.log('OK: immagine Docker avviata isolata, tutti gli asset disponibili, API e persistenza funzionanti');
 }finally{if(id)docker(['stop','--time','2',id]);}
})().catch(e=>{console.error(e);process.exitCode=1;});
