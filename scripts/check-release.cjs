const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),acorn=require('acorn');
const root=path.resolve(__dirname,'..');
for(const file of ['README.md','README.it.md','LICENSE','.env.example','docker-compose.yml','.github/workflows/ci.yml','app/i18n.js','app/onboarding.js','app/locales/en.json'])assert(fs.existsSync(path.join(root,file)),file);
// Runtime backups are allowed locally, but must never be tracked or published.
const ignore=fs.readFileSync(path.join(root,'.gitignore'),'utf8');
assert(ignore.includes('backups/*')&&ignore.includes('!backups/.gitkeep'),'Ignore private backup files');
assert(fs.existsSync(path.join(root,'backups','.gitkeep')),'Ship an empty backups directory');
if(fs.existsSync(path.join(root,'.git'))){
 const tracked=require('node:child_process').execFileSync('git',['ls-files','-z'],{cwd:root,encoding:'utf8'}).split('\0').filter(Boolean);
 assert(!tracked.some(file=>file==='.env'||(/^(backups|data|receipts)\//.test(file)&&!file.endsWith('/.gitkeep'))),'No tracked credentials or runtime data');
}
for(const file of fs.readdirSync(path.join(root,'app')).filter(x=>x.endsWith('.js')))acorn.parse(fs.readFileSync(path.join(root,'app',file),'utf8'),{ecmaVersion:'latest'});
const html=fs.readFileSync(path.join(root,'app/index.html'),'utf8');for(const match of html.matchAll(/<script>([\s\S]*?)<\/script>/g))acorn.parse(match[1],{ecmaVersion:'latest'});
assert(html.includes('<title>TwoFifties</title>'));assert(html.includes('TwoFiftiesSetup'));assert(Object.keys(JSON.parse(fs.readFileSync(path.join(root,'app/locales/en.json'),'utf8'))).length>300);
console.log('OK: private runtime files excluded, backup folder, publication files, branding, translations and JavaScript syntax');
