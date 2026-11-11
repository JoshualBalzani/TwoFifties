'use strict';
const assert=require('node:assert/strict'),{chromium}=require('playwright'),{start}=require('../scripts/preview-site.cjs');
const key='twofifties-analytics-consent';
(async()=>{
 const env=await start(0),browser=await chromium.launch({headless:true,...(process.platform==='win32'?{channel:'msedge'}:{})});
 try{
  const context=await browser.newContext({viewport:{width:390,height:844}}),requests=[];
  await context.route('https://www.googletagmanager.com/**',route=>{requests.push(route.request().url());return route.fulfill({contentType:'application/javascript',body:'window.__analyticsTestLoaded=true;'});});
  const page=await context.newPage();await page.goto(env.url);assert.equal(requests.length,0,'no tag before consent');
  await page.locator('[data-cookie-close]').click();assert.equal(await page.locator('#cookieBanner').isVisible(),false);assert.equal(requests.length,0,'closing does not accept');
  await page.reload();assert.equal(await page.locator('#cookieBanner').isVisible(),false,'rejection persists');
  await page.locator('[data-cookie-settings]').first().click();await page.locator('[data-cookie-accept]').click();
  await page.waitForFunction(()=>window.__analyticsTestLoaded);assert.equal(requests.length,1);
  const choice=await page.evaluate(key=>JSON.parse(localStorage.getItem(key)),key);assert.equal(choice.value,'accepted');assert.equal(choice.version,'3');assert(Date.parse(choice.expiresAt)>Date.now());
  const commands=await page.evaluate(()=>window.dataLayer.map(item=>Array.from(item)));
  assert.equal(commands[0][0],'consent');assert.equal(commands[0][1],'default');assert.equal(commands[0][2].analytics_storage,'denied');
  assert.equal(commands[1][2].analytics_storage,'granted');assert.equal(commands[1][2].ad_storage,'denied');
  const settings=commands.find(item=>item[0]==='config')[2];assert.equal(settings.allow_google_signals,false);assert.equal(settings.allow_ad_personalization_signals,false);assert.equal(settings.cookie_update,false);assert.equal(settings.cookie_expires,180*86400);
  await context.addCookies([{name:'_ga',value:'test',url:env.origin,path:'/'},{name:'_ga_P9818C52WC',value:'test',domain:'127.0.0.1',path:'/TwoFifties/'}].map(c=>{if(c.url&&c.path){delete c.path;}return c;}));
  const other=await context.newPage();await other.goto(env.url+'en/');await other.waitForFunction(()=>window.__analyticsTestLoaded);
  const requestsBeforeReject=requests.length;
  await page.locator('[data-cookie-settings]').first().click();await page.locator('[data-cookie-reject]').click();
  await page.waitForFunction(key=>!window.__analyticsTestLoaded&&JSON.parse(localStorage.getItem(key))?.value==='rejected',key);
  await other.waitForFunction(()=>!window.__analyticsTestLoaded);assert.equal(requests.length,requestsBeforeReject,'revocation and other-tab reload do not request tag');
  assert.equal((await context.cookies()).filter(c=>/^_ga(?:_|$)/.test(c.name)).length,0,'revocation removes accessible Analytics cookies');
  for(const route of ['privacy/','en/privacy/'])for(const width of [320,1440]){
   await page.setViewportSize({width,height:900});await page.goto(env.url+route);assert.equal(await page.locator('h1').count(),1);assert.equal(await page.locator('article h2').count(),14);
   assert((await page.locator('article').innerText()).includes('Joshual Balzani'));assert(await page.locator('a[href="mailto:joshbalzani@gmail.com"]').count()>0);
   assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'no privacy overflow '+route+' '+width);
   assert((await page.locator('meta[name="description"]').getAttribute('content')).length>70);
   for(const href of await page.locator('.privacy-contents a').evaluateAll(links=>links.map(a=>a.getAttribute('href'))))assert.equal(await page.locator('[id="'+href.slice(1)+'"]').count(),1);
  }
  await context.close();
  const blocked=await browser.newContext();await blocked.addInitScript(()=>{Storage.prototype.setItem=function(){throw new Error('Storage blocked');};});
  await blocked.route('https://www.googletagmanager.com/**',route=>route.fulfill({contentType:'application/javascript',body:'window.__analyticsTestLoaded=true;'}));
  const blockedPage=await blocked.newPage();await blockedPage.goto(env.url);await blockedPage.locator('[data-cookie-accept]').click();await blockedPage.waitForFunction(()=>window.__analyticsTestLoaded);
  await blockedPage.locator('[data-cookie-settings]').first().click();await blockedPage.locator('[data-cookie-reject]').click();assert.equal(await blockedPage.evaluate(()=>window['ga-disable-G-P9818C52WC']),true,'withdrawal works without persistent storage');
  await blockedPage.locator('[data-cookie-settings]').first().click();await blockedPage.locator('[data-cookie-accept]').click();assert.equal(await blockedPage.evaluate(()=>window['ga-disable-G-P9818C52WC']),false,'new explicit acceptance can restore collection in memory');await blocked.close();
  const expired=await browser.newContext();await expired.addInitScript(key=>localStorage.setItem(key,JSON.stringify({value:'accepted',version:'3',updatedAt:'2025-01-01T00:00:00Z',expiresAt:'2025-07-01T00:00:00Z'})),key);
  const expiredPage=await expired.newPage();const expiredRequests=[];await expired.route('https://www.googletagmanager.com/**',route=>{expiredRequests.push(route.request().url());return route.abort();});await expiredPage.goto(env.url);assert.equal(await expiredPage.locator('#cookieBanner').isVisible(),true);assert.equal(expiredRequests.length,0,'expired consent does not load tag');await expired.close();
  const legacy=await browser.newContext();await legacy.addInitScript(key=>localStorage.setItem(key,JSON.stringify({value:'rejected',version:'2',updatedAt:new Date().toISOString()})),key);const legacyPage=await legacy.newPage();await legacyPage.goto(env.url);assert.equal(await legacyPage.locator('#cookieBanner').isVisible(),false,'recent legacy rejection preserved');await legacy.close();
  const plain=await browser.newContext({javaScriptEnabled:false,viewport:{width:390,height:844}}),plainPage=await plain.newPage();await plainPage.goto(env.url+'privacy/');assert.equal(await plainPage.locator('article h2').count(),14);assert.equal(await plainPage.locator('[data-cookie-settings]').first().isVisible(),false);await plain.close();
  console.log('OK: consent gate, rejection, withdrawal, cross-tab revocation, cookies, expiry, legacy refusal and bilingual responsive/no-JS privacy notice');
 }finally{await browser.close();await env.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
