'use strict';
const fs=require('node:fs'),path=require('node:path');
const esc=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function readPost(file){
 const text=fs.readFileSync(file,'utf8').replace(/^\uFEFF/,'').replace(/\r\n/g,'\n'),match=text.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
 if(!match)throw Error('Missing blog front matter: '+file);
 const meta={};for(const line of match[1].split('\n')){const pair=line.match(/^([\w-]+):\s*(.*)$/);if(!pair)continue;let value=pair[2].trim();if(value.startsWith('"'))value=JSON.parse(value);else if(value.startsWith("'"))value=value.slice(1,-1).replace(/''/g,"'");meta[pair[1]]=value;}
 const body=match[2],slug=path.basename(file).replace(/^\d{4}-\d{2}-\d{2}-/,'').replace(/\.md$/,'');
 return {...meta,order:Number(meta.order),slug,body,file,words:body.trim().split(/\s+/u).length};
}
function buildBlog(options){return require('./blog-design.cjs').buildBlog({...options,readPost});}
module.exports={buildBlog,readPost};
