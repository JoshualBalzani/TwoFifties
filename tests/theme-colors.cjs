'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');const ctx={};vm.createContext(ctx);vm.runInContext(fs.readFileSync('app/color-theme.js','utf8'),ctx);const T=ctx.SpeseTheme;let checks=0;
for(const dark of [false,true]){
const c=T.create({},dark),legacy={themeColor:'#00FF00',secondaryColor:'#FF00FF',tertiaryColor:'#FFFF00',surfaceColor:'#000000',personColorJ:'#FFFFFF',personColorG:'#00FFFF',contrastLevel:'high'};assert.deepEqual(T.create(legacy,dark),c,'legacy custom colors cannot affect the fixed palette');checks++;
for(const [a,b]of [['on-primary','primary'],['on-primary-container','primary-container'],['on-secondary','secondary'],['on-secondary-container','secondary-container'],['on-tertiary','tertiary'],['on-tertiary-container','tertiary-container'],['on-error','error'],['on-error-container','error-container'],['inverse-on-surface','inverse-surface']]){assert.ok(T.contrast(c['--md-'+a],c['--md-'+b])>=4.5,a+' on '+b);checks++;}
for(const surface of ['surface','surface-container-lowest','surface-container-low','surface-container','surface-container-high','surface-container-highest'])for(const text of ['on-surface','on-surface-variant']){assert.ok(T.contrast(c['--md-'+text],c['--md-'+surface])>=7,text+' on '+surface);checks++;}
for(const person of ['j','g'])for(const context of ['primary','secondary']){assert.ok(T.contrast(c['--person-'+person+'-on-'+context+'-container'],c['--md-'+context+'-container'])>=7);checks++;}
for(const color of ['#FFFFFF','#000000','#FFFF00','#00FF00','#FF0000','#FF00FF','#00FFFF','#6750A4','#B3261E']){const group=T.category({},dark,color);assert.ok(T.contrast(group.foreground,group.background)>=7,'category label '+color);checks++;}
}
console.log('OK: '+checks+' checks; fixed M3 reference palette, neutral text contrast >=7:1, readable containers and category labels, legacy custom colors ignored');
