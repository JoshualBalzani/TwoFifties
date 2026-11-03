const fs=require('fs');const dictionary={};for(const line of fs.readFileSync('tools/translations.psv','utf8').replace(/^\uFEFF/,'').split(/\r?\n/)){if(!line.trim())continue;const separator=line.indexOf('|');if(separator<0)throw Error(line);dictionary[line.slice(0,separator).replaceAll('\\n','\n')]=line.slice(separator+1).replaceAll('\\n','\n');}fs.writeFileSync('app/locales/en.json',JSON.stringify(dictionary,null,2)+'\n');console.log(Object.keys(dictionary).length+' UI translations');

fs.writeFileSync('app/translations.js','window.TwoFiftiesEnglish='+JSON.stringify(dictionary)+';\n');
