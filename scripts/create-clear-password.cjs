'use strict';
const crypto=require('node:crypto'),readline=require('node:readline');
// Never echo the password or put it in a command-line argument.
const hash=password=>{const salt=crypto.randomBytes(16);return salt.toString('hex')+':'+crypto.scryptSync(password,salt,64).toString('hex');};
if(!process.stdin.isTTY||!process.stdout.isTTY){
 console.error('Use an interactive terminal: node scripts/create-clear-password.cjs');process.exitCode=1;
}else{
 let value='',first=null;
 readline.emitKeypressEvents(process.stdin);process.stdin.setRawMode(true);process.stdin.resume();
 console.log('TwoFifties: password for complete data deletion (not the login password).');
 process.stdout.write('New password (12–256 characters; input hidden): ');
 const close=()=>{process.stdin.setRawMode(false);process.stdin.pause();};
 process.stdin.on('keypress',(text,key={})=>{
  if(key.ctrl&&key.name==='c'){close();process.stdout.write('\nCancelled.\n');return;}
  if(key.name==='return'){
   process.stdout.write('\n');
   if(first===null){if(value.length<12){process.stdout.write('Use at least 12 characters. Try again: ');value='';return;}first=value;value='';process.stdout.write('Confirm password (input hidden): ');return;}
   if(value!==first){first=null;value='';process.stdout.write('Passwords differ. New password: ');return;}
   const result=hash(value);value='';first=null;close();
   console.log('\nPaste this value into CLEAR_ALL_PASSWORD_HASH, then restart/recreate the app:\n'+result+'\n');return;
  }
  if(key.name==='backspace'){value=Array.from(value).slice(0,-1).join('');return;}
  if(text&&!key.ctrl&&!key.meta&&!/[\x00-\x1f\x7f]/.test(text)){
   if(value.length+text.length<=256)value+=text;
  }
 });
}
