'use strict';
const fs=require('node:fs');
(async()=>{
 const repository=process.env.GITHUB_REPOSITORY,token=process.env.GH_TOKEN;if(!repository||!token)throw Error('GitHub workflow context is required');
 const response=await fetch((process.env.GITHUB_API_URL||'https://api.github.com')+'/repos/'+repository+'/pages',{headers:{Authorization:'Bearer '+token,Accept:'application/vnd.github+json','User-Agent':'TwoFifties-Pages'}});
 let enabled=false;if(response.status===200)enabled=(await response.json()).build_type==='workflow';else if(response.status!==404)throw Error('Could not read Pages configuration: HTTP '+response.status);
 fs.appendFileSync(process.env.GITHUB_OUTPUT,'enabled='+enabled+'\n');
 if(!enabled){const settings='https://github.com/'+repository+'/settings/pages';fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY,'## Website built; Pages setup required\n\nThe static website artifact is ready. Open [repository Pages settings]('+settings+'), choose **GitHub Actions** as the publishing source, then run this workflow again using **Run workflow**.\n\nThe app server and personal backups are not included in the website.\n');console.log('Site built. Enable GitHub Actions in repository Pages settings to deploy.');}
 else console.log('Pages is configured for workflow deployment.');
})().catch(error=>{console.error(error.message);process.exitCode=1;});
