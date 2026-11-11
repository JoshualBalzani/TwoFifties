'use strict';
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const {readPost}=require('./build-blog.cjs'),root=path.resolve(__dirname,'..'),output=path.join(root,'.site-dist');
const base=new URL(process.env.SITE_BASE_URL||require('../website/site.config.json').baseUrl);
const posts=fs.readdirSync(path.join(root,'website/_posts')).filter(f=>f.endsWith('.md')).map(f=>readPost(path.join(root,'website/_posts',f)));
assert.equal(posts.length,40,'All requested articles');assert.equal(new Set(posts.map(p=>p.order)).size,40);assert.equal(new Set(posts.map(p=>p.slug)).size,40);
let total=0;
for(const post of posts){
 assert.equal(post.date,'2026-11-11');assert(post.title.length<=60,post.slug+' title');assert(post.description.length<=155,post.slug+' description');
 assert(post.words>=1000&&post.words<=1500,post.slug+' body words '+post.words);assert.equal(post.body.match(/^# /gm)?.length,1,post.slug+' one H1');assert(!post.body.includes('\u2014'),post.slug+' no em dash');
 const norm=t=>t.toLocaleLowerCase('it').replace(/\s+/g,' '),keyword=norm(post.keyword||'');assert(keyword,post.slug+' keyword');
 const first=post.body.replace(/^\s*# [^\n]+\n/,'').trim().split(/\n\s*\n/)[0];
 assert(norm(post.title).includes(keyword),post.slug+' keyword title');assert(norm(post.description).includes(keyword),post.slug+' keyword description');assert(norm(first).includes(keyword),post.slug+' keyword introduction');assert([...post.body.matchAll(/^## (.+)$/gm)].some(m=>norm(m[1]).includes(keyword)),post.slug+' keyword H2');
 const faq=post.body.split(/^## Domande frequenti\s*$/m)[1];assert(faq,post.slug+' FAQs');assert.equal(faq.match(/^### /gm)?.length,3,post.slug+' exactly three FAQs');
 const html=fs.readFileSync(path.join(output,'blog',post.slug,'index.html'),'utf8');assert.equal((html.match(/<h1(?:\s[^>]*)?>/g)||[]).length,1);assert(!html.includes('{{'),post.slug+' unresolved Liquid');
 const text=html.match(/<article class="installation-guide">([\s\S]*?)<\/article>/)[1].replace(/<[^>]+>/g,' ').replace(/&[^;]+;/g,' '),visibleWords=text.trim().split(/\s+/u).length;assert(visibleWords>=1000&&visibleWords<=1500,post.slug+' visible word count '+visibleWords);total+=visibleWords;
 const blogLinks=[...post.body.matchAll(/\]\(([^)]+)\)/g)].map(m=>m[1]).filter(target=>target.includes('/blog/'));assert(blogLinks.length>=2&&blogLinks.length<=3,post.slug+' 2-3 internal article links');
 for(const match of html.matchAll(/(?:href|src)="([^"]+)"/g)){
  const target=new URL(match[1],new URL('blog/'+post.slug+'/',base));if(target.origin!==base.origin||!target.pathname.startsWith(base.pathname))continue;
  let resolved=path.join(output,decodeURIComponent(target.pathname.slice(base.pathname.length)));if(fs.existsSync(resolved)&&fs.statSync(resolved).isDirectory())resolved=path.join(resolved,'index.html');assert(fs.existsSync(resolved),post.slug+' missing local resource '+target.href);
 }
 const schema=JSON.parse(html.match(/<script type="application\/ld\+json">(.*?)<\/script>/s)[1]);assert.equal(schema['@type'],'BlogPosting');assert.equal(schema.datePublished,post.date);
 const sitemap=fs.readFileSync(path.join(output,'sitemap.xml'),'utf8');assert(sitemap.includes(new URL('blog/'+post.slug+'/',base).href));
}
for(const file of ['budget-mensile.csv','registro-spese.csv'])assert(fs.statSync(path.join(output,'downloads',file)).size>100);
console.log('OK: 40 original posts, '+total+' visible words, today dates, SEO fields, keywords, 3 FAQs, 2-3 internal links, sitemap, templates and static resources');
