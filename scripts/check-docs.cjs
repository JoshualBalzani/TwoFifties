const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..'),manifest=JSON.parse(fs.readFileSync(path.join(root,'docs/screenshots/manifest.json'),'utf8'));
let images=0;for(const language of manifest.languages)for(const theme of manifest.themes)for(const item of manifest.screens){
 const file=path.join(root,'docs/screenshots',language,theme,item.id+'.png'),bytes=fs.readFileSync(file);assert.equal(bytes.readUInt32BE(16),860,file);assert.equal(bytes.readUInt32BE(20),1864,file);images++;
}
assert.equal(images,112);
for(const [file,language]of [['README.md','en'],['README.it.md','it']]){
 const text=fs.readFileSync(path.join(root,file),'utf8'),sources=[...text.matchAll(/src="([^"]+)"/g)].map(m=>m[1]);assert.equal(sources.length,6);for(const source of sources){assert(source.startsWith('docs/screenshots/'+language+'/'),file+' has wrong-language image');assert(fs.existsSync(path.join(root,source)),source);}assert(sources.some(x=>x.includes('/light/'))&&sources.some(x=>x.includes('/dark/')));assert(text.includes('TrueNAS'));
}
for(const file of ['README.md','README.it.md','docs/TRUENAS.md','docs/TRUENAS.it.md','docs/screenshots/README.md','docs/screenshots/en/README.md','docs/screenshots/it/README.md']){
 const text=fs.readFileSync(path.join(root,file),'utf8');for(const match of text.matchAll(/\]\(([^)]+)\)|(?:src|href)="([^"]+)"/g)){const target=(match[1]||match[2]).split('#')[0];if(!target||/^[a-z]+:|^\//i.test(target))continue;assert(fs.existsSync(path.resolve(root,path.dirname(file),target)),file+' links to missing '+target);}
}
console.log('OK: 112 screenshots, dimensions, localized manual images, both themes and documentation links');
