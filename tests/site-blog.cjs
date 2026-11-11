'use strict';
const assert=require('node:assert/strict'),{chromium}=require('playwright'),{start}=require('../scripts/preview-site.cjs');
(async()=>{const env=await start(0),browser=await chromium.launch({headless:true,...(process.platform==='win32'?{channel:'msedge'}:{})});
try{
 for(const width of [320,390,768,1440]){
  const context=await browser.newContext({viewport:{width,height:900}}),page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto(env.url+'blog/');await page.locator('[data-cookie-reject]').click();assert.equal(await page.locator('h1').count(),1);assert.equal(await page.locator('.blog-cluster li').count(),40);
  assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'index overflow '+width);
  await page.locator('.blog-card h3 a').first().click();assert(page.url().includes('/blog/budget-mensile-personale/'));assert.equal(await page.locator('h1').count(),1);assert.equal(await page.locator('article h2').last().innerText(),'Domande frequenti');
  assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'article overflow '+width);
  const heading=page.locator('.blog-toc a').first();const destination=await heading.getAttribute('href');await heading.click();assert.equal(await page.locator('[id="'+destination.slice(1)+'"]').count(),1);
  await page.goto(env.url+'blog/template-budget-mensile/');const link=page.locator('article a[href$="budget-mensile.csv"]').first();assert.equal((await page.request.get(new URL(await link.getAttribute('href'),env.url).href)).status(),200);
  await page.goto(env.url+'blog/google-sheets-spese-personali/');assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'formula article overflow '+width);
  assert.deepEqual(errors,[]);await context.close();
 }
 const context=await browser.newContext({javaScriptEnabled:false}),page=await context.newPage();await page.goto(env.url+'blog/');assert.equal(await page.locator('.blog-cluster li').count(),40);await page.locator('.blog-card h3 a').first().click();assert.equal(await page.locator('h1').count(),1);await context.close();
 console.log('OK: blog index, 40 articles, mobile/desktop, article contents, CSV downloads and no-JS navigation');
}finally{await browser.close();await env.close();}})().catch(error=>{console.error(error);process.exitCode=1;});
