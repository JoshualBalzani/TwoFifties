const path=require('node:path'),fs=require('node:fs');
const root=path.resolve(__dirname,'..');
if(fs.existsSync(path.join(root,'.env')))process.loadEnvFile(path.join(root,'.env'));
process.env.PORT||='5001';
process.env.PUBLIC_DIR=path.join(root,'app');
if(!process.env.BACKUP_DIR){
 const previous=path.join(root,'data'),destination=path.join(root,'backups');
 // Preserve installations started with the previous Node default.
 if(fs.existsSync(path.join(previous,'latest.json'))&&!fs.existsSync(path.join(destination,'latest.json'))){
  fs.mkdirSync(destination,{recursive:true});
  fs.cpSync(previous,destination,{recursive:true,force:false,errorOnExist:true,filter:source=>path.basename(source)!=='.gitkeep'});
 }
 process.env.BACKUP_DIR=destination;
}
require('../server/server.js');
