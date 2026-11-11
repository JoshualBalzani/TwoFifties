'use strict';
// Deliberately limited Markdown renderer for the two trusted installation manuals.
// HTML is escaped; the documentation remains the single source for GitHub and Pages.
function escape(text){return text.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
function renderInstallation(markdown,{language,resolveLink}){
 const tokens=[],headings=[],usedIds=new Map();let codeIndex=0;
 const token=html=>'\u0000'+(tokens.push(html)-1)+'\u0000';
 function inline(source){
  let text=source.replace(/`([^`]+)`/g,(_,code)=>token('<code>'+escape(code)+'</code>'));
  text=text.replace(/\[([^\]]+)\]\(([^)]+)\)/g,(_,label,url)=>{
   if(!/^(?:https?:\/\/|mailto:|#|[.\w/-])/.test(url)||/^(?:javascript|data):/i.test(url))throw Error('Unsupported documentation link');
   return token('<a href="'+escape(resolveLink(url))+'">'+inline(label)+'</a>');
  });
  text=escape(text).replace(/\*\*([^*]+)\*\*/g,'<strong>$1</strong>');
  return text.replace(/\u0000(\d+)\u0000/g,(_,index)=>tokens[Number(index)]);
 }
 const lines=markdown.replace(/\r\n/g,'\n').replace(/^## (Indice|Contents)\n[\s\S]*?(?=^## )/m,'').split('\n'),html=[];
 const special=line=>/^#{1,3} |^```|^\| |^\d+\. |^- |^> /.test(line);
 for(let i=0;i<lines.length;){
  const line=lines[i];if(!line.trim()){i++;continue;}
  const fence=line.match(/^```([\w-]*)\s*$/);
  if(fence){
   const code=[];i++;while(i<lines.length&&!/^```\s*$/.test(lines[i]))code.push(lines[i++]);
   if(i===lines.length)throw Error('Unclosed documentation code block');i++;
   const id='guide-code-'+(++codeIndex),label=language==='it'?'Copia':'Copy',success=language==='it'?'Copiato':'Copied',failure=language==='it'?'Seleziona e copia il testo':'Select and copy the text';
   html.push('<div class="guide-code"><div class="guide-code-bar"><span>'+escape(fence[1]||'text')+'</span><button type="button" data-copy="'+id+'" data-label="'+label+'" data-success="'+success+'" data-failure="'+failure+'">'+label+'</button></div><pre tabindex="0"><code id="'+id+'">'+escape(code.join('\n'))+'</code></pre></div>');continue;
  }
  const heading=line.match(/^(#{1,3}) (.+)$/);
  if(heading){
   const level=heading[1].length,plain=heading[2].replace(/`|\*\*/g,''),baseId=plain.toLowerCase().replace(/[^\p{L}\p{N}\s-]/gu,'').replace(/\s/g,'-');
   const count=usedIds.get(baseId)||0;usedIds.set(baseId,count+1);const id=baseId+(count?'-'+count:'');
   if(level===2)headings.push({id,title:plain});
   html.push('<h'+level+' id="'+escape(id)+'">'+inline(heading[2])+'</h'+level+'>');i++;continue;
  }
  if(/^\| /.test(line)){
   const rows=[];while(i<lines.length&&/^\|/.test(lines[i]))rows.push(lines[i++]);
   const cells=row=>row.trim().replace(/^\||\|$/g,'').split('|').map(cell=>cell.trim());
   if(rows.length<2||!cells(rows[1]).every(cell=>/^:?-{3,}:?$/.test(cell)))throw Error('Invalid documentation table');
   html.push('<div class="guide-table" role="region" tabindex="0" aria-label="'+(language==='it'?'Tabella scorrevole':'Scrollable table')+'"><table><thead><tr>'+cells(rows[0]).map(cell=>'<th scope="col">'+inline(cell)+'</th>').join('')+'</tr></thead><tbody>'+rows.slice(2).map(row=>'<tr>'+cells(row).map(cell=>'<td>'+inline(cell)+'</td>').join('')+'</tr>').join('')+'</tbody></table></div>');continue;
  }
  const list=line.match(/^(\d+\.|-) (.+)$/);
  if(list){
   const ordered=list[1]!=='-',tag=ordered?'ol':'ul',items=[];
   while(i<lines.length){const match=lines[i].match(ordered?/^\d+\. (.+)$/:/^- (.+)$/);if(!match)break;items.push('<li>'+inline(match[1])+'</li>');i++;}
   html.push('<'+tag+'>'+items.join('')+'</'+tag+'>');continue;
  }
  if(/^> /.test(line)){html.push('<blockquote>'+inline(line.slice(2))+'</blockquote>');i++;continue;}
  const paragraph=[line];i++;while(i<lines.length&&lines[i].trim()&&!special(lines[i]))paragraph.push(lines[i++]);
  html.push('<p>'+inline(paragraph.join(' '))+'</p>');
 }
 return {html:html.join('\n'),headings};
}
module.exports={renderInstallation};
