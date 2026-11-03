const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'../docs/screenshots'),manifest=JSON.parse(fs.readFileSync(path.join(root,'manifest.json'),'utf8'));
for(const language of manifest.languages){
 const it=language==='it',header=it?'# TwoFifties · Galleria mobile':'# TwoFifties · Mobile gallery';
 let text=header+'\n\n'+(it?'[Manuale italiano](../../../README.it.md) · [English gallery](../en/README.md)':'[English manual](../../../README.md) · [Galleria italiana](../it/README.md)')+'\n\n';
 text+=it?'28 schermate reali in italiano, ognuna nei temi chiaro e scuro: **56 immagini**. Nomi e movimenti sono inventati e generati su un server temporaneo isolato. La versione distribuita parte vuota.\n\n':'28 real English screens, each in light and dark mode: **56 images**. Names and transactions are fictitious and generated on an isolated temporary server. The released app starts empty.\n\n';
 for(const item of manifest.screens){
  const title=item[language];text+='## '+title+'\n\n<table>\n<tr><th>'+(it?'Tema chiaro':'Light mode')+'</th><th>'+(it?'Tema scuro':'Dark mode')+'</th></tr>\n<tr>';
  for(const theme of manifest.themes){const file=theme+'/'+item.id+'.png';assert(fs.existsSync(path.join(root,language,file)),file);const caption=it?(theme==='light'?'tema chiaro':'tema scuro'):(theme==='light'?'light mode':'dark mode');text+='<td width="50%" valign="top"><a href="'+file+'"><img src="'+file+'" width="300" alt="'+title+' — '+caption+'" loading="lazy"></a></td>';}
  text+='</tr>\n</table>\n\n';
 }
 text+=it?'## Rigenerare le immagini\n\nEsegui `node scripts/screenshots.cjs` dalla radice del repository. Puoi selezionare una variante con `--language=it --theme=dark`. Poi esegui `node scripts/build-galleries.cjs`. Le immagini hanno viewport 430 × 932 e risoluzione 2×. Lo script non usa i dati dell’istanza personale.\n':'## Reproduce the images\n\nRun `node scripts/screenshots.cjs` from the repository root. Select a variant with `--language=en --theme=dark` if needed, then run `node scripts/build-galleries.cjs`. Captures use a 430 × 932 viewport at 2× resolution. The script does not use your personal server data.\n';
 fs.writeFileSync(path.join(root,language,'README.md'),text);
}
fs.writeFileSync(path.join(root,'README.md'),'# TwoFifties · Screenshots\n\nChoose your language / Scegli la lingua:\n\n- [English: 28 screens in light and dark mode](en/README.md)\n- [Italiano: 28 schermate nei temi chiaro e scuro](it/README.md)\n\n112 real mobile screenshots in total. All data is fictitious. / 112 screenshot mobile reali in totale, con soli dati inventati.\n');
console.log('OK: separate English and Italian galleries, each with both themes');
