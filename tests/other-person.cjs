const fs=require('fs'),vm=require('vm'),assert=require('node:assert/strict');
const html=fs.readFileSync('app/index.html','utf8');const L=require('../app/logic.js').SpeseLogic;
for(const recurring of [false,true])for(const payer of ['person-a','person-b']){
 const start=html.indexOf('  let shareJ =',html.indexOf(recurring?'function saveRecurrence()':'function saveEntry()'));
 const end=html.indexOf(recurring?'\n  if (currentEditRecId)':'\n  const isSettle',start);
 const c={amount:10.01,splitMode:'other',recSplitMode:'other',currentPayer:payer,recPayer:payer,round2:L.round2,$:()=>({hidden:false})};
 vm.createContext(c);vm.runInContext('(function(){'+html.slice(start,end)+'\nresult={shareJ,shareG};})()',c);
 assert.equal(c.result.shareJ,payer==='person-a'?0:10.01);
 assert.equal(c.result.shareG,payer==='person-a'?10.01:0);
 const totals=L.computeTotals([{type:'expense',payer,amount:10.01,...c.result}]);
 assert.equal(totals.balance,payer==='person-a'?10.01:-10.01);
}
console.log('OK: Solo l’altro per entrambi i pagatori, spese e ricorrenze, saldo completo');

