'use strict';
// Visual audit and behavioral regression checks use isolated, fictitious workspaces.
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const {chromium}=require('playwright'),{capture}=require('../scripts/screenshots.cjs');
const output=path.resolve('artifacts/expressive-audit'),results=[];
const widths=[320,360,390,768,839,840,999,1000,1024,1440,1920];
async function visibleInViewport(locator){
  await locator.page().waitForTimeout(200);
  await locator.scrollIntoViewIfNeeded();
  await locator.page().waitForTimeout(100);
  const box=await locator.boundingBox(),size=locator.page().viewportSize();
  assert(box&&box.width>0&&box.height>0,'control has a visible box');
  if(!(box.x>=-1&&box.y>=-1&&box.x+box.width<=size.width+1&&box.y+box.height<=size.height+1))await locator.page().screenshot({path:path.join(output,'failure.png')});
  assert(box.x>=-1&&box.y>=-1&&box.x+box.width<=size.width+1&&box.y+box.height<=size.height+1,'control stays inside the viewport: '+JSON.stringify({box,size}));
  assert(await locator.evaluate(el=>{const r=el.getBoundingClientRect(),hit=document.elementFromPoint(r.x+r.width/2,r.y+r.height/2);return hit===el||el.contains(hit);}), 'control is not covered');
}
async function noOverflow(page,label){
  const dimensions=await page.evaluate(()=>({viewport:innerWidth,document:document.documentElement.scrollWidth}));
  assert(dimensions.document<=dimensions.viewport+1,label+': horizontal page overflow '+JSON.stringify(dimensions));
}
async function extra({page,context,home,more,env,desktop,language,theme}){
  if(language!=='it'||theme!=='light'||desktop)return;
  const save=async name=>{await page.waitForTimeout(450);await page.waitForFunction(()=>!document.querySelector('#snackbar.show'));await noOverflow(page,name);await page.screenshot({path:path.join(output,name+'.png'),animations:'disabled'});results.push(name);};
  for(const width of widths){
    await page.setViewportSize({width,height:width<500?844:900});await home();
    await save('home-'+width);
    await page.locator('#listWrap .item').first().click();
    await page.locator('#actionsSheet').waitFor({state:'visible'});
    await page.waitForTimeout(450);
    assert(await page.locator('#actionsDetails').isVisible(),'expense details available at '+width);
    assert((await page.locator('#actionsDetails').innerText()).includes('43,20'),'exact split displayed at '+width);
    await save('detail-'+width);
    await page.locator('#actionEditBtn').click();await page.waitForTimeout(450);
    await save('edit-'+width);
    if(width>=1000){
      const desc=await page.locator('#f-desc').boundingBox(),amount=await page.locator('#f-amount').boundingBox();
      assert(amount.y-desc.y-desc.height>=16,'separate floating-label fields in the context panel at '+width);
    }
    await visibleInViewport(page.locator('#saveBtn'));
    await home();await page.locator('#listWrap .item').first().dispatchEvent('contextmenu');await page.waitForTimeout(450);
    for(const control of await page.locator('#selectionActions button').all())await visibleInViewport(control);
    await save('selection-'+width);
  }
  await page.setViewportSize({width:390,height:844});
  for(const key of ['defaults','navigation','data']){await more('drawerSettingsBtn');await page.locator('[data-settings-page="'+key+'"]').click();await save('settings-'+key);}
  await more('drawerCatBtn');await page.locator('.cat-item button').first().click();await save('category-edit');
  await more('drawerRecBtn');await page.getByRole('button',{name:'Nuova ricorrente',exact:false}).click();await save('recurring-create');
  await home();await page.locator('#fab').click();await page.locator('#fabAddExpense').click();await page.locator('#saveBtn').click();
  assert(await page.locator('#f-desc').getAttribute('aria-invalid'),'empty expense validation');await save('expense-validation');
  await page.locator('#f-desc').fill('Spesa con divisione personalizzata');await page.locator('#f-amount').fill('80');
  for(const mode of ['percent','custom','other']){await page.locator('#splitSeg [data-split="'+mode+'"]').click();await save('split-'+mode);}
  await home();await page.locator('#searchToggle').click();await page.locator('#quickSearch').fill('nessun-risultato-xyz');await page.waitForTimeout(300);
  assert.equal(await page.locator('#summaryWrap').isVisible(),false,'zero summary does not compete with empty-state action');
  await visibleInViewport(page.locator('#listWrap .empty-action'));await save('search-empty');
  await page.emulateMedia({reducedMotion:'reduce'});await home();
  assert.equal(await page.locator('#fab').evaluate(el=>getComputedStyle(el).transitionDuration),'0s','reduced motion switches off transitions');
  await page.locator('#fab').click();assert.equal(await page.locator('#fabActions').evaluate(el=>getComputedStyle(el).animationName),'none');await save('reduced-motion');
  await page.emulateMedia({reducedMotion:'no-preference'});
  assert(await page.evaluate(()=>getComputedStyle(document.documentElement).getPropertyValue('--motion-spatial').includes('linear(')),'sampled spring timing loaded');
  // Exact values and long user content must survive the layout change.
  let state=await(await fetch(env.url+'/api/state')).json();
  state.settings.nameJ='Alessandro Massimiliano';state.settings.nameG='Sofia Francesca Maria';
  state.entries[0].desc='Spesa al supermercato con descrizione molto lunga e dettagli da leggere';
  state.entries[0].amount=987654321.98;state.entries[0].shareJ=493827160.99;state.entries[0].shareG=493827160.99;
  const response=await fetch(env.url+'/api/state',{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify({...state,baseRevision:state.revision,actor:'person-a'})});assert(response.ok);
  await page.setViewportSize({width:320,height:568});await home();await save('long-content-320');
  assert(await page.locator('.monthly-total').evaluate(el=>el.scrollWidth<=el.clientWidth+1),'large monthly total is fully readable at 320px');
  await page.locator('#listWrap .item').first().click();await save('long-detail-320');
  assert((await page.locator('#actionsSheet .ap-desc').innerText()).includes('dettagli da leggere'));
  await page.locator('#actionEditBtn').click();await page.setViewportSize({width:320,height:420});
  await visibleInViewport(page.locator('#saveBtn'));await save('short-viewport-form');
  await context.setOffline(true);await home();await save('offline');await context.setOffline(false);
}
(async()=>{
  fs.mkdirSync(output,{recursive:true});const browser=await chromium.launch({headless:true,...(process.platform==='win32'?{channel:'msedge'}:{})});
  try{
    const languages=process.argv.includes('--full')?['it','en']:['it'];
    for(const language of languages)await Promise.all((process.argv.includes('--responsive-only')?[false]:[false,true]).flatMap(desktop=>(process.argv.includes('--responsive-only')?['light']:['light','dark']).map(theme=>capture(browser,language,theme,{
      desktop,output,afterCaptureOnly:process.argv.includes('--responsive-only'),onScreen:async({page,id})=>{await noOverflow(page,[desktop,language,theme,id].join('/'));results.push([desktop?'desktop':'mobile',language,theme,id].join('/'));},afterCapture:process.argv.includes('--screens-only')?undefined:extra
    }))));
    fs.writeFileSync(path.join(output,'results.json'),JSON.stringify({date:new Date().toISOString(),widths,checks:results.length,results},null,2)+'\n');
    console.log('OK: '+results.length+' visual states; responsive details, form spacing, reachable selection actions, validation, spring timing, reduced motion, long content and offline shell');
  }finally{await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
