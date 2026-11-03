'use strict';
const http=require('node:http'),fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'../.site-dist'),config=require('../website/site.config.json');
const prefix=new URL(process.env.SITE_BASE_URL||config.baseUrl).pathname.replace(/\/?$/,'/');
const types={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.svg':'image/svg+xml','.png':'image/png','.woff2':'font/woff2','.xml':'application/xml; charset=utf-8','.txt':'text/plain; charset=utf-8'};
async function start(port=4173){
 if(!fs.existsSync(path.join(root,'index.html')))throw Error('Run npm run site:build first');
 const server=http.createServer((req,res)=>{try{
  let pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);if(prefix!=='/'&&pathname.startsWith(prefix))pathname='/'+pathname.slice(prefix.length);
  let file=path.resolve(root,'.'+pathname);if(file!==root&&!file.startsWith(root+path.sep)){res.writeHead(403);return res.end();}
  if(fs.existsSync(file)&&fs.statSync(file).isDirectory())file=path.join(file,'index.html');
  const exists=fs.existsSync(file)&&fs.statSync(file).isFile();if(!exists)file=path.join(root,'404.html');
  res.writeHead(exists?200:404,{'Content-Type':types[path.extname(file)]||'application/octet-stream','Cache-Control':'no-store'});res.end(req.method==='HEAD'?undefined:fs.readFileSync(file));
 }catch(_){res.writeHead(400);res.end('Bad request');}});
 await new Promise((resolve,reject)=>{server.once('error',reject);server.listen(port,'127.0.0.1',resolve);});
 const origin='http://127.0.0.1:'+server.address().port;return {origin,url:origin+prefix,close:()=>new Promise(resolve=>server.close(resolve))};
}
module.exports={start};
if(require.main===module)start(Number(process.env.SITE_PREVIEW_PORT)||4173).then(env=>console.log('TwoFifties website preview: '+env.url)).catch(error=>{console.error(error.message);process.exitCode=1;});
