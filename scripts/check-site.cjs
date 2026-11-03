'use strict';
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),config=require('../website/site.config.json');
const root=path.resolve(__dirname,'../.site-dist'),base=new URL(process.env.SITE_BASE_URL||config.baseUrl);
const pages=['index.html','en/index.html','installazione/index.html','en/install/index.html'];
for(const file of pages){
 const html=fs.readFileSync(path.join(root,file),'utf8');assert(html.includes('<h1>'),file);assert(html.includes('name="description"'));assert(html.includes('rel="canonical"'));assert(html.includes('hreflang="it"')&&html.includes('hreflang="en"'));assert(html.includes('application/ld+json'));assert(!html.includes('aggregateRating'));
 const schema=JSON.parse(html.match(/<script type="application\/ld\+json">(.*?)<\/script>/s)[1]);assert.equal(schema.name||schema.headline,file.includes('install')?schema.headline:'TwoFifties');
 for(const match of html.matchAll(/(?:src|href)="([^"]+)"/g)){
  const target=match[1];if(/^[a-z]+:|^#|^\//i.test(target))continue;
  let resolved=path.resolve(root,path.dirname(file),target.split('#')[0]||'.');if(fs.existsSync(resolved)&&fs.statSync(resolved).isDirectory())resolved=path.join(resolved,'index.html');assert(fs.existsSync(resolved),file+' references '+target);
 }
 const imageSources=[...html.matchAll(/src="([^"]+\/screens\/([^/]+)\/[^\"]+)"/g)];for(const image of imageSources)assert.equal(image[2],file.startsWith('en/')?'en':'it',file+' image language');
}
for(const language of ['it','en']){const image=fs.readFileSync(path.join(root,'assets/social-'+language+'.png'));assert.equal(image.readUInt32BE(16),1200);assert.equal(image.readUInt32BE(20),630);}
assert(fs.readFileSync(path.join(root,'sitemap.xml'),'utf8').includes(base.hostname));assert(fs.readFileSync(path.join(root,'robots.txt'),'utf8').includes('Sitemap: '));
for(const forbidden of ['.env','backups','data','server','latest.json','app'])assert(!fs.existsSync(path.join(root,forbidden)),'Private/runtime directory in site output');
console.log('OK: localized static pages, links, SEO metadata, social images and isolated public output');
