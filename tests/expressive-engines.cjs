'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const playwright=require('playwright'),{capture}=require('../scripts/screenshots.cjs');
const output=path.resolve('artifacts/expressive-audit/engines');
(async()=>{
 const results=[];
 for(const engine of ['webkit','firefox']){
  const browser=await playwright[engine].launch({headless:true});
  try{
   for(const theme of ['light','dark'])await capture(browser,'it',theme,{
    desktop:true,output:path.join(output,engine),afterCaptureOnly:true,
    afterCapture:async({page,home})=>{
     for(const width of [390,840,1024]){
      await page.setViewportSize({width,height:844});await home();await page.waitForTimeout(500);
      assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),engine+' home overflow at '+width);
      await page.screenshot({path:path.join(output,engine,'home-'+theme+'-'+width+'.png'),animations:'disabled'});
      await page.locator('#listWrap .item').first().click();await page.waitForTimeout(500);
      assert(await page.locator('#actionsDetails').isVisible(),engine+' details at '+width);
      await page.screenshot({path:path.join(output,engine,'detail-'+theme+'-'+width+'.png'),animations:'disabled'});
      await page.locator('#actionEditBtn').click();await page.waitForTimeout(500);
      const save=page.locator('#saveBtn');await save.scrollIntoViewIfNeeded();await page.waitForTimeout(200);
      const box=await save.boundingBox();assert(box&&box.x>=0&&box.y>=0&&box.x+box.width<=width+1&&box.y+box.height<=845,engine+' reachable save at '+width);
      await page.screenshot({path:path.join(output,engine,'edit-'+theme+'-'+width+'.png'),animations:'disabled'});
      await home();await page.locator('#listWrap .item').first().dispatchEvent('contextmenu');await page.waitForTimeout(500);
      for(const button of await page.locator('#selectionActions button').all()){
       const b=await button.boundingBox();assert(b&&b.x>=0&&b.y>=0&&b.x+b.width<=width+1&&b.y+b.height<=845,engine+' reachable selection at '+width);
      }
      await page.screenshot({path:path.join(output,engine,'selection-'+theme+'-'+width+'.png'),animations:'disabled'});
      results.push(engine+'/'+theme+'/'+width);
     }
     await page.emulateMedia({reducedMotion:'reduce'});await home();
     assert.equal(await page.locator('#fab').evaluate(el=>getComputedStyle(el).transitionDuration),'0s');
    }
   });
  }finally{await browser.close();}
 }
 fs.writeFileSync(path.join(output,'results.json'),JSON.stringify({date:new Date().toISOString(),results},null,2)+'\n');
 console.log('OK: WebKit and Firefox, light/dark, 390/840/1024px, details, editing, selection and reduced motion');
})().catch(error=>{console.error(error);process.exitCode=1;});
