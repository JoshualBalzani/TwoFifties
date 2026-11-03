const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),acorn=require('acorn');
const root=path.resolve(__dirname,'..');
for(const file of ['README.md','README.it.md','LICENSE','.env.example','docker-compose.yml','.github/workflows/ci.yml','app/i18n.js','app/onboarding.js','app/locales/en.json'])assert(fs.existsSync(path.join(root,file)),file);
assert(!fs.existsSync(path.join(root,'.env')),'No credentials in release');
for(const item of fs.readdirSync(path.join(root,'data')))assert.equal(item,'.gitkeep','Release data must be empty');
for(const file of fs.readdirSync(path.join(root,'app')).filter(x=>x.endsWith('.js')))acorn.parse(fs.readFileSync(path.join(root,'app',file),'utf8'),{ecmaVersion:'latest'});
const html=fs.readFileSync(path.join(root,'app/index.html'),'utf8');for(const match of html.matchAll(/<script>([\s\S]*?)<\/script>/g))acorn.parse(match[1],{ecmaVersion:'latest'});
assert(html.includes('<title>TwoFifties</title>'));assert(html.includes('TwoFiftiesSetup'));assert(Object.keys(JSON.parse(fs.readFileSync(path.join(root,'app/locales/en.json'),'utf8'))).length>300);
console.log('OK: empty release, publication files, branding, translations and JavaScript syntax');
