'use strict';
// Publish only captures from isolated fictitious workspaces, never user runtime data.
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const {chromium}=require('playwright'),{capture,labels}=require('./screenshots.cjs');
const root=path.resolve(__dirname,'..'),destination=path.join(root,'docs/screenshots');
const fromAudit=process.argv.includes('--from-audit');
const source=path.join(root,'artifacts',fromAudit?'expressive-audit':'publication-screenshots');
(async()=>{
 if(fromAudit){
  const audit=JSON.parse(fs.readFileSync(path.join(source,'results.json'),'utf8'));
  for(const device of ['mobile','desktop'])for(const language of ['it','en'])for(const theme of ['light','dark'])for(const screen of labels)
   assert(audit.results.includes([device,language,theme,screen.id].join('/')),'Missing audited capture: '+screen.id);
 }else{
  const browser=await chromium.launch({headless:true,...(process.platform==='win32'?{channel:'msedge'}:{})});
  try{for(const language of ['it','en'])await Promise.all([false,true].flatMap(desktop=>['light','dark'].map(theme=>capture(browser,language,theme,{desktop,output:source}))));}
  finally{await browser.close();}
 }
 // Validate the entire input matrix before replacing any published images.
 const files=[];
 for(const device of ['mobile','desktop'])for(const language of ['it','en'])for(const theme of ['light','dark'])for(const screen of labels){
  const file=path.join(source,device,language,theme,screen.id+'.png'),bytes=fs.readFileSync(file);
  assert.equal(bytes.subarray(0,8).toString('hex'),'89504e470d0a1a0a',file);
  assert.equal(bytes.readUInt32BE(16),device==='mobile'?860:1440,file);
  assert.equal(bytes.readUInt32BE(20),device==='mobile'?1864:1000,file);
  files.push([file,path.join(destination,language,theme,(device==='desktop'?'desktop-':'')+screen.id+'.png')]);
 }
 for(const [file,target]of files){fs.mkdirSync(path.dirname(target),{recursive:true});fs.copyFileSync(file,target);}
 const manifest={viewport:{width:430,height:932,scale:2},languages:['it','en'],themes:['light','dark'],screens:labels,
  desktop:{viewport:{width:1440,height:1000,scale:1},screens:labels.map(screen=>({...screen,id:'desktop-'+screen.id}))}};
 fs.writeFileSync(path.join(destination,'manifest.json'),JSON.stringify(manifest,null,2)+'\n');
 console.log('Published '+files.length+' screenshots: complete mobile and desktop galleries in both languages and themes.');
})().catch(error=>{console.error(error);process.exitCode=1;});
