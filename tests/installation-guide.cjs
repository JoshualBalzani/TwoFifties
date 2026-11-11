'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),fsp=require('node:fs/promises'),path=require('node:path'),os=require('node:os'),net=require('node:net'),{spawn}=require('node:child_process');
const {chromium}=require('playwright'),{start}=require('../scripts/preview-site.cjs'),{renderInstallation}=require('../scripts/render-installation.cjs');
const root=path.resolve(__dirname,'..');
async function checkNodeStartup(){
 const directory=await fsp.mkdtemp(path.join(os.tmpdir(),'twofifties-install-')),socket=net.createServer();
 await new Promise(resolve=>socket.listen(0,'127.0.0.1',resolve));const port=socket.address().port;await new Promise(resolve=>socket.close(resolve));
 const child=spawn(process.execPath,['scripts/start.cjs'],{cwd:root,windowsHide:true,env:{...process.env,PORT:String(port),BACKUP_DIR:directory,AUTH_USER:'',AUTH_PASS:''},stdio:['ignore','pipe','pipe']});
 try{
  let ready=false;for(let attempt=0;attempt<100;attempt++){try{const response=await fetch('http://127.0.0.1:'+port+'/api/health');if(response.ok){assert.equal((await response.json()).status,'ok');ready=true;break;}}catch(_){}await new Promise(resolve=>setTimeout(resolve,100));}
  assert(ready,'documented Node entry point starts');
  const html=await(await fetch('http://127.0.0.1:'+port+'/')).text();assert(html.includes('<title>TwoFifties</title>'));
 }finally{
  child.kill();if(child.exitCode===null)await new Promise(resolve=>child.once('exit',resolve));
  const target=path.resolve(directory);assert.equal(path.dirname(target),path.resolve(os.tmpdir()));assert(path.basename(target).startsWith('twofifties-install-'));await fsp.rm(target,{recursive:true,force:true});
 }
}
(async()=>{
 const escaped=renderInstallation('# Title\n\n## Code\n\n```sh\necho "<script> & $HOME"\n```\n\n**Important** [link](https://example.com)\n',{language:'en',resolveLink:value=>value});
 assert(escaped.html.includes('&lt;script&gt; &amp; $HOME'));assert(!escaped.html.includes('<script>'));assert(escaped.html.includes('<strong>Important</strong>'));
 assert.throws(()=>renderInstallation('```sh\nunclosed',{language:'en',resolveLink:value=>value}),/Unclosed/);
 assert.throws(()=>renderInstallation('[bad](javascript:alert)',{language:'en',resolveLink:value=>value}),/Unsupported/);
 for(const language of ['it','en']){
  const file=language==='it'?'INSTALLATION.it.md':'INSTALLATION.md',source=fs.readFileSync(path.join(root,'docs',file),'utf8'),rendered=renderInstallation(source,{language,resolveLink:value=>value});
  assert.equal(rendered.headings.length,20,file+' covers every section');
  const ids=[...rendered.html.matchAll(/ id="([^"]+)"/g)].map(match=>match[1]);assert.equal(new Set(ids).size,ids.length,'unique anchors');
  for(const match of source.matchAll(/\]\(#([^)]+)\)/g))assert(ids.includes(match[1]),'valid source table-of-contents anchor '+match[1]);
  assert(!/\u0000\d+\u0000/.test(rendered.html));
 }
 await checkNodeStartup();
 const env=await start(0),browser=await chromium.launch({headless:true,...(process.platform==='win32'?{channel:'msedge'}:{})});
 try{
  fs.mkdirSync(path.join(root,'artifacts'),{recursive:true});
  for(const width of [320,390,768,1440])for(const language of ['it','en'])for(const theme of ['light','dark']){
   const page=await browser.newPage({viewport:{width,height:900},colorScheme:theme});const errors=[];page.on('pageerror',error=>errors.push(error.message));
   await page.goto(env.url+(language==='it'?'installazione/':'en/install/'));await page.evaluate(()=>document.fonts.ready);
   const reject=page.locator('[data-cookie-reject]').first();if(await reject.isVisible())await reject.click();
   assert.equal(await page.locator('h1').count(),1);assert.equal(await page.locator('.installation-guide h2').count(),20);
   assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'no guide page overflow at '+width);
   for(const link of await page.locator('.guide-contents nav a').all()){const href=await link.getAttribute('href');assert.equal(await page.locator('[id="'+href.slice(1)+'"]').count(),1,'unique heading destination');}
   if(width<=760){assert.equal(await page.locator('.guide-contents').getAttribute('open'),null);await page.locator('.guide-contents summary').click();}
   const lastLink=page.locator('.guide-contents nav a').nth(18);await lastLink.click();
   const table=page.locator('.installation-guide h2').nth(18);assert(await table.isVisible());
   await page.evaluate(()=>Object.defineProperty(navigator,'clipboard',{value:{writeText:async text=>window.__guideCopied=text},configurable:true}));
   await page.locator('.guide-code-bar button').first().click();
   assert((await page.evaluate(()=>window.__guideCopied)).includes('git clone https://github.com/JoshualBalzani/TwoFifties.git\ncd TwoFifties'));
   const selector=page.locator('.languages a[lang="'+(language==='it'?'en':'it')+'"]');assert((await selector.getAttribute('href')).includes(language==='it'?'en/install/':'installazione/'));
   await page.evaluate(()=>scrollTo(0,0));await page.screenshot({path:path.join(root,'artifacts','installation-'+language+'-'+theme+'-'+width+'.png')});
   assert.deepEqual(errors,[]);await page.close();
  }
  const plain=await browser.newPage({javaScriptEnabled:false,viewport:{width:390,height:844}});await plain.goto(env.url+'installazione/');assert.equal(await plain.locator('.installation-guide h2').count(),20);assert.equal(await plain.locator('.guide-code-bar button').first().isVisible(),false);await plain.close();
 }finally{await browser.close();await env.close();}
 console.log('OK: complete bilingual installation manuals, source anchors, safe code rendering, copied commands, four widths, both themes, no-JS and documented Node startup');
})().catch(error=>{console.error(error);process.exitCode=1;});
