'use strict';
const assert=require('node:assert/strict'),{chromium}=require('playwright'),{start}=require('./server-integration.cjs'),L=require('../app/logic.js').SpeseLogic;
(async()=>{const env=await start();let browser;try{
 const state=await(await fetch(env.url+'/api/state')).json();
 const seed={...state,settings:{...L.DEFAULT_SETTINGS,setupCompleted:true,nameJ:'Casa',nameG:'More'},categories:L.DEFAULT_CATEGORIES,entries:[{id:'language-fixture',type:'expense',desc:'Spesa di casa',note:'Nota originale',amount:1234.56,payer:'person-a',shareJ:617.28,shareG:617.28,categoryId:'casa',date:L.todayISO()}]};
 assert((await fetch(env.url+'/api/state',{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify({...seed,baseRevision:state.revision,actor:'person-a'})})).ok);
 browser=await chromium.launch({headless:true,...(process.platform==='win32'?{channel:'msedge'}:{})});
 for(const mobile of [false,true]){
  const context=await browser.newContext({viewport:mobile?{width:360,height:740}:{width:1280,height:900},isMobile:mobile,hasTouch:mobile}),page=await context.newPage(),errors=[];
  page.on('pageerror',e=>errors.push(e.message));await page.goto(env.url);if(mobile){await page.locator('#nav-more').click();await page.locator('#drawerSettingsBtn').click();}else{await page.locator('[data-proxy="drawerSettingsBtn"]').click();}await page.locator('#settingsLanguageRow').click();
  const english=page.locator('[data-language-opt="en"]');if(mobile)await english.tap();else await english.click();
  await page.waitForFunction(()=>document.documentElement.lang==='en');await page.locator('[data-settings-panel="language"]').waitFor({state:'visible'});assert.equal(await page.locator('[data-language-opt="en"]').getAttribute('aria-checked'),'true');assert.equal(await page.locator('#settingsSheetTitle').innerText(),'Language');
  assert.equal(await page.evaluate(()=>SpeseLogic.fmtEur(1234.56)),'€1,234.56');
  await page.locator('[data-language-opt="en"]').focus();await page.keyboard.press('ArrowLeft');await page.waitForFunction(()=>document.documentElement.lang==='it');await page.locator('[data-settings-panel="language"]').waitFor({state:'visible'});assert.equal(await page.locator('#settingsSheetTitle').innerText(),'Lingua');
  await page.evaluate(async()=>{await navigator.serviceWorker.ready;if(!navigator.serviceWorker.controller)await new Promise(r=>navigator.serviceWorker.addEventListener('controllerchange',r,{once:true}));});
  await context.setOffline(true);await page.locator('[data-language-opt="en"]').click();await page.waitForFunction(()=>document.documentElement.lang==='en');await page.locator('[data-settings-panel="language"]').waitFor({state:'visible'});await context.setOffline(false);
  if(mobile){await page.locator('#settingsSheet .sheet-handle').click();await page.locator('#nav-expenses').click();}else{await page.locator('#settingsCloseBtn').click();await page.locator('#nav-expenses').click();}assert((await page.locator('#listWrap').innerText()).includes('Spesa di casa'));assert((await page.locator('#listWrap').innerText()).includes('Nota originale'));assert((await page.locator('body').innerText()).includes('Casa'));assert.deepEqual(errors,[]);await context.close();
 }
 const final=await(await fetch(env.url+'/api/state')).json();assert.equal(final.settings.nameJ,'Casa');assert.equal(final.settings.nameG,'More');assert.equal(final.entries[0].amount,1234.56);assert.equal(final.entries[0].desc,'Spesa di casa');
 console.log('OK: real desktop clicks, mobile taps, keyboard and offline language changes; settings return, locale formatting and user data preserved');
 }finally{await browser?.close();await env.close();}})().catch(error=>{console.error(error);process.exitCode=1;});
