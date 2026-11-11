'use strict';
const fs=require('node:fs'),path=require('node:path'),{chromium}=require('playwright');
const root=path.resolve('artifacts/expressive-audit');
const escape=s=>s.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
(async()=>{
 const browser=await chromium.launch({headless:true,...(process.platform==='win32'?{channel:'msedge'}:{})});
 let index='<!doctype html><html lang="it"><meta charset="utf-8"><title>TwoFifties · Audit Expressive</title><style>body{font:16px system-ui;margin:24px;background:#f7f2fa;color:#1d1b20}h2{margin-top:40px}.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:16px}figure{margin:0;padding:12px;background:white;border-radius:16px}img{width:100%;height:360px;object-fit:contain}a{color:#6750a4}figcaption{padding:8px 0}</style><h1>TwoFifties · Audit Material 3 Expressive</h1><p>Apri le immagini per esaminarle a dimensione originale. Tutti i dati sono fittizi.</p>';
 try{
  for(const device of ['mobile','desktop'])for(const language of ['it','en'])for(const theme of ['light','dark']){
   const dir=path.join(root,device,language,theme);if(!fs.existsSync(dir))continue;
   const files=fs.readdirSync(dir).filter(f=>f.endsWith('.png')).sort(),label=[device,language,theme].join(' · ');
   index+='<h2>'+label+'</h2><div class="grid">'+files.map(file=>{const url=[device,language,theme,file].join('/');return '<figure><a href="'+url+'"><img loading="lazy" src="'+url+'" alt="'+escape(file)+'"></a><figcaption>'+escape(file)+'</figcaption></figure>';}).join('')+'</div>';
   for(let batch=0;batch<4;batch++){
    const page=await browser.newPage({viewport:{width:device==='mobile'?1320:1440,height:1000}});
    await page.setContent('<style>body{margin:8px;background:'+(theme==='dark'?'#333;color:#fff':'#ddd;color:#222')+';font:16px Arial}.grid{display:grid;grid-template-columns:repeat('+(device==='mobile'?4:2)+',1fr);gap:12px}figure{margin:0}img{width:100%;display:block}figcaption{height:24px}</style><h2>'+label+'</h2><div class="grid">'+files.slice(batch*7,batch*7+7).map(file=>'<figure><figcaption>'+file+'</figcaption><img src="data:image/png;base64,'+fs.readFileSync(path.join(dir,file)).toString('base64')+'"></figure>').join('')+'</div>');
    await page.screenshot({path:path.join(root,[device,language,theme,batch].join('-')+'.png'),fullPage:true});await page.close();
   }
  }
  const extras=fs.readdirSync(root).filter(f=>f.endsWith('.png')&&!/^(mobile|desktop)-/.test(f));
  index+='<h2>Responsive e stati aggiuntivi</h2><div class="grid">'+extras.map(file=>'<figure><a href="'+file+'"><img loading="lazy" src="'+file+'" alt="'+escape(file)+'"></a><figcaption>'+escape(file)+'</figcaption></figure>').join('')+'</div></html>';
  fs.writeFileSync(path.join(root,'index.html'),index);console.log(path.join(root,'index.html'));
 }finally{await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
