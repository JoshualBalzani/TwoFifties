'use strict';
const fs=require('node:fs'),path=require('node:path');
const {renderInstallation}=require('./render-installation.cjs');
const priority=[1,2,4,9,10,14,25,27,28,32];
const esc=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function readPost(file){
 const text=fs.readFileSync(file,'utf8').replace(/^\uFEFF/,'').replace(/\r\n/g,'\n'),match=text.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
 if(!match)throw Error('Missing blog front matter: '+file);
 const meta={};for(const line of match[1].split('\n')){const pair=line.match(/^([\w-]+):\s*(.*)$/);if(!pair)continue;let value=pair[2].trim();if(value.startsWith('"'))value=JSON.parse(value);else if(value.startsWith("'"))value=value.slice(1,-1).replace(/''/g,"'");meta[pair[1]]=value;}
 const body=match[2],slug=path.basename(file).replace(/^\d{4}-\d{2}-\d{2}-/,'').replace(/\.md$/,'');
 return {...meta,order:Number(meta.order),slug,body,file,words:body.trim().split(/\s+/u).length};
}
function buildBlog({root,output,base,header,footer,cookieBanner}){
 const directory=path.join(root,'website/_posts');if(!fs.existsSync(directory))return [];
 const posts=fs.readdirSync(directory).filter(f=>f.endsWith('.md')).map(f=>readPost(path.join(directory,f))).sort((a,b)=>{
  const pa=priority.indexOf(a.order),pb=priority.indexOf(b.order);return (pa<0?100+a.order:pa)-(pb<0?100+b.order:pb);
 });
 const slugs=new Set(posts.map(p=>p.slug));
 const resolveLink=target=>{
  if(target.startsWith('/blog/')){const slug=target.slice(6).replace(/\/$/,'');if(slug&&!slugs.has(slug))throw Error('Unknown blog target '+target);return new URL(target.slice(1),base).pathname;}
  if(target.startsWith('/downloads/'))return new URL(target.slice(1),base).pathname;
  return target;
 };
 const shell=(route,title,description,main,schema)=>{
  const prefix='../'.repeat(route.split('/').filter(Boolean).length),canonical=new URL(route,base).href;
  return '<!doctype html><html lang="it" class="no-js"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>'+esc(title)+'</title><meta name="description" content="'+esc(description)+'"><link rel="canonical" href="'+canonical+'"><meta property="og:type" content="'+(schema['@type']==='BlogPosting'?'article':'website')+'"><meta property="og:title" content="'+esc(title)+'"><meta property="og:description" content="'+esc(description)+'"><meta property="og:url" content="'+canonical+'"><meta property="og:locale" content="it_IT"><meta name="twitter:card" content="summary"><link rel="icon" href="'+prefix+'assets/logo.svg" type="image/svg+xml"><script src="'+prefix+'assets/theme-init.js"></script><link rel="stylesheet" href="'+prefix+'assets/site.css"><script src="'+prefix+'assets/site.js" defer></script><script type="application/ld+json">'+JSON.stringify(schema).replace(/</g,'\\u003c')+'</script></head><body>'+header('it',prefix,'blog')+main+footer('it',prefix)+cookieBanner('it',prefix)+'</body></html>';
 };
 for(const post of posts){
  const route='blog/'+post.slug+'/',canonical=new URL(route,base).href;
  const markdown=post.body.replace(/\{\{\s*['"]([^'"]+)['"]\s*\|\s*relative_url\s*\}\}/g,'$1');
  const rendered=renderInstallation(markdown,{language:'it',resolveLink});
  const main='<main id="main" class="wrap section blog-article"><nav class="blog-breadcrumb" aria-label="Percorso"><a href="'+new URL('blog/',base).pathname+'">Tutte le guide</a><span> / '+esc(String(post.categories).replace(/[\[\]]/g,'').replace(/-/g,' '))+'</span></nav><p class="blog-byline">Redazione TwoFifties · '+esc(post.date)+' · '+post.words+' parole</p><div class="blog-reading"><aside class="blog-toc"><nav aria-label="Indice articolo">'+rendered.headings.map(h=>'<a href="#'+esc(h.id)+'">'+esc(h.title)+'</a>').join('')+'</nav></aside><article class="installation-guide">'+rendered.html+'</article></div></main>';
  const schema={'@context':'https://schema.org','@type':'BlogPosting',headline:post.title,description:post.description,inLanguage:'it',datePublished:post.date,mainEntityOfPage:canonical,author:{'@type':'Person',name:'Joshual Balzani'},publisher:{'@type':'Organization',name:'TwoFifties',url:base.href}};
  fs.mkdirSync(path.join(output,route),{recursive:true});fs.writeFileSync(path.join(output,route,'index.html'),shell(route,post.title,post.description,main,schema));
 }
 const categories=[...new Set(posts.map(p=>String(p.categories).replace(/[\[\]'"]/g,'').trim()))];
 const index='<main id="main" class="wrap section blog-index"><p class="eyebrow">GUIDE PRATICHE</p><h1>Budget, risparmio e spese condivise</h1><p class="blog-intro">Esempi in euro e strumenti concreti per organizzare i conti. Parti dalle guide essenziali, poi scegli il tema che ti serve.</p><nav class="blog-clusters" aria-label="Argomenti">'+categories.map(c=>'<a href="#'+c+'">'+esc(c.replace(/-/g,' '))+'</a>').join('')+'</nav><h2>Da dove iniziare</h2><div class="blog-grid">'+posts.slice(0,10).map(p=>'<article class="blog-card"><p class="eyebrow">'+esc(String(p.categories).replace(/[\[\]]/g,'').replace(/-/g,' '))+'</p><h3><a href="'+new URL('blog/'+p.slug+'/',base).pathname+'">'+esc(p.title)+'</a></h3><p>'+esc(p.description)+'</p></article>').join('')+'</div>'+categories.map(c=>'<section id="'+c+'" class="blog-cluster"><h2>'+esc(c.replace(/-/g,' '))+'</h2><ul>'+posts.filter(p=>String(p.categories).includes(c)).map(p=>'<li><a href="'+new URL('blog/'+p.slug+'/',base).pathname+'">'+esc(p.title)+'</a></li>').join('')+'</ul></section>').join('')+'<p class="blog-note">Gli esempi sono illustrativi e non sostituiscono una valutazione della tua situazione. TwoFifties è un’app gratuita da installare sul proprio server per condividere le spese tra due persone.</p></main>';
 fs.mkdirSync(path.join(output,'blog'),{recursive:true});fs.writeFileSync(path.join(output,'blog/index.html'),shell('blog/','Blog TwoFifties: budget, risparmio e spese condivise','Guide pratiche su budget, risparmio e spese condivise. Esempi in euro, confronti e template gratuiti per organizzare i tuoi conti.',index,{'@context':'https://schema.org','@type':'Blog',name:'Guide TwoFifties',url:new URL('blog/',base).href,inLanguage:'it'}));
 const downloads=path.join(root,'website/downloads');if(fs.existsSync(downloads))fs.cpSync(downloads,path.join(output,'downloads'),{recursive:true});
 fs.writeFileSync(path.join(output,'blog/feed.xml'),'<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>Guide TwoFifties</title><link>'+esc(new URL('blog/',base).href)+'</link><description>Budget, risparmio e spese condivise</description>'+posts.map(p=>'<item><title>'+esc(p.title)+'</title><link>'+esc(new URL('blog/'+p.slug+'/',base).href)+'</link><guid>'+esc(new URL('blog/'+p.slug+'/',base).href)+'</guid><description>'+esc(p.description)+'</description></item>').join('')+'</channel></rss>');
 console.log('Built blog: '+posts.length+' articles');return ['blog/',...posts.map(p=>'blog/'+p.slug+'/')];
}
module.exports={buildBlog,readPost};
