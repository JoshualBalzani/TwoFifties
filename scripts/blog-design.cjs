'use strict';
const fs=require('node:fs'),path=require('node:path');
const {renderInstallation}=require('./render-installation.cjs');
const priority=[1,2,4,9,10,14,25,27,28,32];
const categories={
 'basi-del-budget':{label:'Le basi del budget',short:'Budget',description:'Metti ordine tra entrate, spese e scadenze. Un passo alla volta.'},
 'risparmio-e-abitudini':{label:'Risparmio e abitudini',short:'Risparmio',description:'Piccoli cambiamenti, scelte consapevoli e spazio per ciò che conta.'},
 'situazioni-di-vita':{label:'I conti nella vita reale',short:'Vita quotidiana',description:'Casa, coppia, studio e viaggi: organizza i conti intorno alla tua vita.'},
 'confronti-e-strumenti':{label:'Strumenti che semplificano',short:'Strumenti',description:'Confronti chiari e modelli da provare, per trovare il tuo metodo.'},
 'educazione-finanziaria':{label:'Capire i propri soldi',short:'Consapevolezza',description:'Fai chiarezza su obiettivi, risparmio e decisioni di ogni giorno.'}
};
const photoAlt={
 'budget-desk':'Mani che usano una calcolatrice e prendono appunti su un quaderno.',
 envelopes:'Buste di carta e monete organizzate su un tavolo.',
 receipts:'Mani che ordinano ricevute cartacee accanto a un quaderno.',
 savings:'Un barattolo con monete e un mazzo di chiavi su un tavolo.',
 couple:'Due adulti esaminano insieme un quaderno e alcune ricevute al tavolo di casa.',
 groceries:'Frutta e verdura fresca raccolte in un cesto al mercato.',
 utilities:'Una mano regola il termostato di casa accanto a una bolletta.',
 student:'Una persona giovane studia a una scrivania con libri e computer.',
 home:'Scatole e chiavi per organizzare un trasloco in appartamento.',
 travel:'Zaino e cartina vicino al finestrino di un treno.',
 tools:'Computer portatile e quaderno su una scrivania luminosa.',
 planning:'Agenda, calendario e appunti organizzati su un tavolo.'
};
const escape=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const categoryOf=post=>String(post.categories).replace(/[\[\]'"]/g,'').trim();
function buildBlog({root,output,base,header,footer,cookieBanner,readPost}){
 const editorial=require(path.join(root,'website/blog-editorial.cjs'));
 const assetVersion=require('node:crypto').createHash('sha256').update(fs.readFileSync(path.join(root,'website/assets/site.js'))).update(fs.readFileSync(path.join(root,'website/assets/blog.css'))).digest('hex').slice(0,10);
 const directory=path.join(root,'website/_posts');
 if(!fs.existsSync(directory))return [];
 const posts=fs.readdirSync(directory).filter(f=>f.endsWith('.md')).map(f=>readPost(path.join(directory,f))).sort((a,b)=>{
  const pa=priority.indexOf(a.order),pb=priority.indexOf(b.order);return (pa<0?100+a.order:pa)-(pb<0?100+b.order:pb);
 });
 const bySlug=new Map(posts.map(p=>[p.slug,p]));
 const local=route=>new URL(route,base).pathname;
 const absolute=route=>new URL(route,base).href;
 const photoPath=(topic,small=false)=>'assets/blog/photos/'+topic+(small?'-small':'')+'.jpg';
 const topics=[...new Set(posts.map(post=>editorial[post.order]?.photo))];
 for(const topic of topics){
  if(!photoAlt[topic])throw Error('Missing photo/editorial metadata for '+topic);
  for(const small of [false,true]){
   const relative=photoPath(topic,small),source=path.join(root,'website',relative);
   if(!fs.existsSync(source))throw Error('Missing editorial image '+source);
   fs.mkdirSync(path.dirname(path.join(output,relative)),{recursive:true});fs.copyFileSync(source,path.join(output,relative));
  }
 }
 const photo=(post,{eager=false,card=false}={})=>{
  const topic=editorial[post.order].photo,large=local(photoPath(topic)),small=local(photoPath(topic,true));
  return '<img src="'+(card?small:large)+'" srcset="'+small+' 720w, '+large+' 1440w" sizes="'+(card?'(max-width: 650px) 100vw, (max-width: 1000px) 50vw, 380px':'(max-width: 800px) 100vw, 660px')+'" width="1440" height="960" alt="'+escape(photoAlt[topic])+'" loading="'+(eager?'eager':'lazy')+'" decoding="async"'+(eager?' fetchpriority="high"':'')+'>';
 };
 const date=post=>new Intl.DateTimeFormat('it-IT',{day:'numeric',month:'long',year:'numeric',timeZone:'Europe/Rome'}).format(new Date(post.date+'T12:00:00Z'));
 const reading=post=>Math.max(1,Math.ceil(post.words/200));
 const resolveLink=target=>{
  if(target.startsWith('/blog/')){const slug=target.slice(6).replace(/\/$/,'');if(slug&&!bySlug.has(slug))throw Error('Unknown blog target '+target);return local(target.slice(1));}
  if(target.startsWith('/downloads/'))return local(target.slice(1));
  return target;
 };
 const shell=(route,title,description,main,schema,image)=>{
  const prefix='../'.repeat(route.split('/').filter(Boolean).length),canonical=absolute(route);
  const imageUrl=absolute(photoPath(editorial[image.order].photo));
  return '<!doctype html><html lang="it" class="no-js"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>'+escape(title)+'</title><meta name="description" content="'+escape(description)+'"><link rel="canonical" href="'+canonical+'"><meta property="og:type" content="'+(schema['@type']==='BlogPosting'?'article':'website')+'"><meta property="og:title" content="'+escape(title)+'"><meta property="og:description" content="'+escape(description)+'"><meta property="og:url" content="'+canonical+'"><meta property="og:locale" content="it_IT"><meta property="og:image" content="'+imageUrl+'"><meta property="og:image:width" content="1440"><meta property="og:image:height" content="960"><meta name="twitter:card" content="summary_large_image"><link rel="icon" href="'+prefix+'assets/logo.svg" type="image/svg+xml"><script src="'+prefix+'assets/theme-init.js"></script><link rel="stylesheet" href="'+prefix+'assets/site.css"><link rel="stylesheet" href="'+prefix+'assets/blog.css?v='+assetVersion+'"><script src="'+prefix+'assets/site.js?v='+assetVersion+'" defer></script><script type="application/ld+json">'+JSON.stringify(schema).replace(/</g,'\\u003c')+'</script></head><body class="journal">'+header('it',prefix,'blog')+main+footer('it',prefix)+cookieBanner('it',prefix)+'</body></html>';
 };
 const card=(post,{featured=false}={})=>'<article class="blog-card'+(featured?' blog-featured':'')+'" data-blog-card data-search="'+escape((post.title+' '+post.description+' '+categories[categoryOf(post)].label).toLocaleLowerCase('it'))+'"><a class="blog-card-link" href="'+local('blog/'+post.slug+'/')+'"><div class="blog-card-photo">'+photo(post,{eager:featured,card:!featured})+'<span class="blog-photo-badge">'+escape(categories[categoryOf(post)].short)+'</span></div><div class="blog-card-copy"><p class="blog-card-meta">'+(featured?'DA QUI SI COMINCIA':reading(post)+' min di lettura')+'</p><'+(featured?'h2':'h3')+'>'+escape(post.title)+'</'+(featured?'h2':'h3')+'><p>'+escape(post.description)+'</p><span class="blog-card-action">Leggi la guida <span aria-hidden="true">↗</span></span></div></a></article>';
 const appCard=original=>'<aside class="blog-app-card" aria-label="TwoFifties per le spese condivise"><div class="blog-app-copy"><p class="blog-kicker">DALLE IDEE AI CONTI DI CASA</p><p class="blog-app-title">I vostri conti, più chiari.</p>'+original+'<a class="button primary" href="'+base.href+'">Scopri TwoFifties <span aria-hidden="true">↗</span></a><p class="blog-app-note">Gratis e open source. Per due persone, sul vostro server.</p></div><figure class="blog-app-screen"><img src="'+local('assets/screens/it/light/03-expenses.png')+'" alt="Schermata reale di TwoFifties con spese e saldo, usando dati dimostrativi." width="860" height="1864" loading="lazy" decoding="async"><figcaption>Schermata dell’app, dati dimostrativi.</figcaption></figure></aside>';
 function styledBody(rendered,meta){
  let body=rendered.html.replace(/^<h1\b[^>]*>[\s\S]*?<\/h1>\s*/,'');
  const paragraphs=[...body.matchAll(/<p>[\s\S]*?<\/p>/g)],last=paragraphs.at(-1);
  let originalCta='';if(last&&body.slice(last.index+last[0].length).trim()===''){originalCta=last[0];body=body.slice(0,last.index);}
  body=body.replace('<p>','<p class="blog-lead">').replace(/<td>([^<]+)<\/td>/g,(full,text)=>/^\s*[-+]?\d[\d., ]*\s*(?:euro|€|%)/.test(text)?'<td class="blog-money">'+text+'</td>':full);
  const chunks=body.split(/(?=<h2\b)/),sectionCount=chunks.filter(c=>c.startsWith('<h2')).length;let number=0;
  const exercise='<aside class="blog-exercise"><p class="blog-kicker">PROVA PRATICA</p><h3>'+escape(meta.exercise.title)+'</h3><ol>'+meta.exercise.steps.map(step=>'<li>'+escape(step)+'</li>').join('')+'</ol></aside>';
  const result=chunks.map(chunk=>{
   if(!chunk.startsWith('<h2'))return chunk;
   number++;
   if(chunk.includes('id="domande-frequenti"'))return '<section class="blog-faq">'+chunk.replace(/<h3([^>]*)>([\s\S]*?)<\/h3>\s*(<p>[\s\S]*?<\/p>)/g,(_,attributes,title,answer)=>'<details class="blog-faq-item"><summary><h3'+attributes+'>'+title+'</h3></summary><div class="blog-faq-answer">'+answer+'</div></details>')+'</section>';
   return '<section class="blog-section" data-section-number="'+String(number).padStart(2,'0')+'">'+chunk+'</section>'+(number===Math.max(2,Math.floor(sectionCount/2))?exercise:'');
  }).join('');
  return result+appCard(originalCta);
 }
 for(const post of posts){
  const meta=editorial[post.order],category=categories[categoryOf(post)],route='blog/'+post.slug+'/',canonical=absolute(route);
  const markdown=post.body.replace(/\{\{\s*['"]([^'"]+)['"]\s*\|\s*relative_url\s*\}\}/g,'$1');
  const rendered=renderInstallation(markdown,{language:'it',resolveLink});
  const summary='<section class="blog-summary" aria-label="I tre punti chiave"><div><span class="blog-summary-icon" aria-hidden="true">✓</span><p>In questa guida</p></div><ul>'+meta.takeaways.map(t=>'<li>'+escape(t)+'</li>').join('')+'</ul></section>';
  const relatedSlugs=[...markdown.matchAll(/\]\(\/blog\/([^/)]+)\/\)/g)].map(m=>m[1]).filter(s=>bySlug.has(s)&&s!==post.slug);
  const related=[...new Set(relatedSlugs)].slice(0,3).map(s=>bySlug.get(s));
  const relatedHtml='<section class="blog-related"><div class="blog-section-intro"><p class="blog-kicker">IL PROSSIMO PASSO</p><h2>Continua da qui</h2></div><div class="blog-related-grid">'+related.map(p=>card(p)).join('')+'</div></section>';
  const main='<div class="blog-progress" aria-hidden="true"><span data-reading-progress></span></div><main id="main" class="wrap blog-article"><nav class="blog-breadcrumb" aria-label="Percorso"><a href="'+local('blog/')+'">Guide</a><span aria-hidden="true">/</span><a href="'+local('blog/')+'#'+categoryOf(post)+'">'+escape(category.short)+'</a></nav><header class="blog-hero"><div class="blog-hero-copy"><p class="blog-kicker">'+escape(category.label)+'</p><h1>'+escape(post.title)+'</h1><p class="blog-deck">'+escape(post.description)+'</p><div class="blog-meta"><img src="'+local('assets/logo.svg')+'" width="36" height="36" alt=""><span><strong>Redazione TwoFifties</strong><br><time datetime="'+post.date+'">'+date(post)+'</time><span aria-hidden="true"> · </span>'+reading(post)+' min di lettura</span></div><div class="blog-article-tools"><a href="#article-start">Inizia a leggere <span aria-hidden="true">↓</span></a><button type="button" class="blog-copy-link" data-copy="article-permalink" data-label="Copia link" data-success="Link copiato" data-failure="Copia l’indirizzo dalla barra del browser">Copia link</button><span id="article-permalink" hidden>'+canonical+'</span></div></div><figure class="blog-cover">'+photo(post,{eager:true})+'<figcaption>Immagine editoriale generata con IA.</figcaption></figure></header>'+summary+'<div class="blog-reading" id="article-start"><aside class="blog-rail"><details class="blog-toc" open><summary>Indice dell’articolo</summary><nav aria-label="Indice articolo">'+rendered.headings.map(h=>'<a href="#'+escape(h.id)+'">'+escape(h.title)+'</a>').join('')+'</nav><a class="blog-toc-top" href="#main">Torna all’inizio ↑</a></details></aside><article class="installation-guide">'+styledBody(rendered,meta)+'</article></div>'+relatedHtml+'</main>';
  const schema={'@context':'https://schema.org','@type':'BlogPosting',headline:post.title,description:post.description,image:[absolute(photoPath(meta.photo))],inLanguage:'it',datePublished:post.date,mainEntityOfPage:canonical,author:{'@type':'Person',name:'Joshual Balzani'},publisher:{'@type':'Organization',name:'TwoFifties',url:base.href}};
  fs.mkdirSync(path.join(output,route),{recursive:true});fs.writeFileSync(path.join(output,route,'index.html'),shell(route,post.title,post.description,main,schema,post));
 }
 const categoryKeys=Object.keys(categories),feature=posts[0];
 const index='<main id="main" class="wrap blog-index"><header class="blog-index-heading"><div><p class="blog-kicker">IL QUADERNO DI TWOFIFTIES</p><h1>Più chiarezza.<br><span>Meno conti a mente.</span></h1></div><p>Budget, risparmio e vita insieme. Guide concrete, esempi in euro e piccoli passi per sentirti più a tuo agio con i tuoi soldi.</p></header>'+card(feature,{featured:true})+'<section class="blog-library" aria-labelledby="library-title"><div class="blog-library-heading"><div><p class="blog-kicker">TROVA IL TUO PUNTO DI PARTENZA</p><h2 id="library-title">Una guida per ogni domanda.</h2></div><p>'+posts.length+' guide da esplorare</p></div><div class="blog-tools"><label for="blog-search">Cerca nelle guide</label><div class="blog-search-field"><span aria-hidden="true">⌕</span><input id="blog-search" type="search" placeholder="Per esempio: bollette, coppia, risparmio" data-blog-search autocomplete="off"></div><p class="blog-search-status" data-blog-search-status aria-live="polite"></p></div><nav class="blog-clusters" aria-label="Argomenti">'+categoryKeys.map(c=>'<a href="#'+c+'">'+escape(categories[c].short)+'</a>').join('')+'</nav>'+categoryKeys.map(c=>'<section id="'+c+'" class="blog-cluster" data-blog-cluster><div class="blog-cluster-heading"><span class="blog-cluster-number" aria-hidden="true">0'+(categoryKeys.indexOf(c)+1)+'</span><div><h2>'+escape(categories[c].label)+'</h2><p>'+escape(categories[c].description)+'</p></div><span class="blog-cluster-count">'+posts.filter(p=>categoryOf(p)===c).length+' guide</span></div><div class="blog-grid">'+posts.filter(p=>categoryOf(p)===c).map(p=>card(p)).join('')+'</div></section>').join('')+'<div class="blog-search-empty" data-blog-search-empty hidden><h3>Nessuna guida trovata.</h3><p>Prova una parola diversa, oppure esplora gli argomenti.</p><button type="button" class="button outlined" data-blog-search-clear>Mostra tutte le guide</button></div></section><aside class="blog-note"><strong>Un passo concreto, ogni volta.</strong><p>Le guide usano esempi illustrativi e non sostituiscono una valutazione della tua situazione. TwoFifties è un’app gratuita per le spese condivise tra due persone, da installare sul proprio server.</p><a href="'+base.href+'">Conosci l’app <span aria-hidden="true">↗</span></a></aside></main>';
 fs.mkdirSync(path.join(output,'blog'),{recursive:true});fs.writeFileSync(path.join(output,'blog/index.html'),shell('blog/','Blog TwoFifties: budget, risparmio e spese condivise','Guide pratiche su budget, risparmio e spese condivise. Esempi in euro, confronti e template gratuiti per organizzare i tuoi conti.',index,{'@context':'https://schema.org','@type':'Blog',name:'Guide TwoFifties',url:absolute('blog/'),inLanguage:'it'},feature));
 const downloads=path.join(root,'website/downloads');if(fs.existsSync(downloads))fs.cpSync(downloads,path.join(output,'downloads'),{recursive:true});
 fs.writeFileSync(path.join(output,'blog/feed.xml'),'<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>Guide TwoFifties</title><link>'+escape(absolute('blog/'))+'</link><description>Budget, risparmio e spese condivise</description>'+posts.map(p=>'<item><title>'+escape(p.title)+'</title><link>'+escape(absolute('blog/'+p.slug+'/'))+'</link><guid>'+escape(absolute('blog/'+p.slug+'/'))+'</guid><description>'+escape(p.description)+'</description></item>').join('')+'</channel></rss>');
 console.log('Built illustrated blog: '+posts.length+' articles, '+topics.length+' editorial photos');return ['blog/',...posts.map(p=>'blog/'+p.slug+'/')];
}
module.exports={buildBlog};
