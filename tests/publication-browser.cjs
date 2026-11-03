const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const {chromium}=require('playwright'),{start}=require('./server-integration.cjs');
(async()=>{const env=await start();let browser;try{
 browser=await chromium.launch({headless:true,...(process.platform==='win32'?{channel:'msedge'}:{})});
 const context=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true});const page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(env.url);await page.locator('#initialSetup').waitFor();assert.equal((await (await fetch(env.url+'/api/state')).json()).entries.length,0);
 await page.locator('[data-setup="skip"]').click();await page.locator('[data-setup="next"]').click();assert(await page.locator('#setupError').textContent());
 await page.locator('#setupNameJ').fill('Casa');await page.locator('#setupNameG').fill('casa');await page.locator('[data-setup="next"]').click();assert(await page.locator('#setupError').textContent());
 await page.locator('#setupNameG').fill('Alex');await page.locator('[data-setup="next"]').click();await page.locator('[data-setup="finish"]').first().click();await page.waitForFunction(()=>!document.getElementById('initialSetup'));
 await page.waitForTimeout(1500);await page.reload();await page.waitForTimeout(600);assert.equal(await page.locator('#initialSetup').count(),0);assert.equal(await page.title(),'TwoFifties');
 await page.evaluate(()=>localStorage.setItem('twofifties-language','en'));await page.reload();await page.waitForTimeout(600);assert.equal(await page.locator('html').getAttribute('lang'),'en');assert((await page.locator('body').innerText()).includes('Statistics'));assert((await page.locator('body').innerText()).includes('Casa'));
 await page.locator('#fab').click();assert((await page.locator('#fabActions').innerText()).includes('expense'));await page.locator('#fabAddExpense').click();await page.waitForTimeout(200);
 assert((await page.locator('#sheet').innerText()).includes('Amount'));assert((await page.locator('#sheet').innerText()).includes('Other'));
 fs.mkdirSync(path.join(__dirname,'../artifacts'),{recursive:true});await page.screenshot({path:path.join(__dirname,'../artifacts/english-mobile.png')});
 assert.deepEqual(errors,[]);const state=await(await fetch(env.url+'/api/state')).json();assert.equal(state.entries.length,0);assert.equal(state.settings.nameJ,'Casa');assert.equal(state.settings.nameG,'Alex');assert.equal(state.settings.setupCompleted,true);
 await page.locator('#sheet .sheet-handle').click();
 for(const route of ['statistics','budget','more','expenses']){await page.locator('#nav-'+route).click();assert.equal(await page.locator('body').getAttribute('data-primary'),route);assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));}
 await page.locator('#nav-more').click();await page.locator('#drawerSettingsBtn').click();await page.locator('[data-settings-page="appearance"]').click();assert.equal(await page.locator('#appLanguage').inputValue(),'en');
 await page.locator('#appLanguage').selectOption('it');await page.waitForFunction(()=>document.documentElement.lang==='it');await page.waitForTimeout(500);assert((await page.locator('body').innerText()).includes('Statistiche'));
 const fresh=await browser.newContext({viewport:{width:360,height:640}});const second=await fresh.newPage();await second.goto(env.url);await second.waitForTimeout(700);assert.equal(await second.locator('#initialSetup').count(),0);await fresh.close();
 await page.evaluate(async()=>{await navigator.serviceWorker.ready;if(!navigator.serviceWorker.controller)await new Promise(r=>navigator.serviceWorker.addEventListener('controllerchange',r,{once:true}));});
 await page.locator('#nav-expenses').click();await context.setOffline(true);await page.reload();await page.locator('#fab').waitFor();await page.locator('#fab').click();await page.locator('#fabAddExpense').click();await page.locator('#f-desc').fill('Casa');await page.locator('#f-amount').fill('12');await page.locator('#saveBtn').click();await page.waitForTimeout(250);assert((await page.locator('body').innerText()).includes('Casa'));await context.setOffline(false);
 assert.deepEqual(errors,[]);
 console.log('OK: mobile setup, mandatory distinct names, skip, persistence, English, unchanged user names, empty state and second device');
 }finally{await browser?.close();await env.close();}})().catch(e=>{console.error(e);process.exitCode=1;});

