import {build} from 'esbuild';
import {mkdir,copyFile} from 'node:fs/promises';
await build({entryPoints:[new URL('./theme.mjs',import.meta.url).pathname.replace(/^\/([A-Za-z]:)/,'$1')],bundle:true,format:'iife',globalName:'SpeseTheme',outfile:new URL('../../app/color-theme.js',import.meta.url).pathname.replace(/^\/([A-Za-z]:)/,'$1'),minify:true,target:['es2020'],legalComments:'linked'});
await mkdir(new URL('../../app/vendor/',import.meta.url),{recursive:true});
await copyFile(new URL('./node_modules/@material/material-color-utilities/LICENSE',import.meta.url),new URL('../../app/vendor/material-color-utilities.LICENSE.txt',import.meta.url));
console.log('Material theme bundle generated');
