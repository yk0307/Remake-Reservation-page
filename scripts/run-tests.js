const fs=require('fs');
const path=require('path');
const read=(p)=>fs.readFileSync(path.join(__dirname,'..',p),'utf8');
const config=JSON.parse(read('public/data/hubs.json'));
const html=read('public/index.html');
const appJs=read('public/app.js');
const vercel=JSON.parse(read('vercel.json'));
const routes=vercel.routes||[];
const rewrites=vercel.rewrites||[];
const errors=[];
if(!config.hubs?.length)errors.push('hubsが空です。');
const slugs=config.hubs.map((hub)=>hub.slug);
if(!slugs.includes(config.default_slug))errors.push('default_slugがhubs内に存在しません。');
const slugSet=new Set();
config.hubs.forEach((hub)=>{
  if(slugSet.has(hub.slug))errors.push(`slugが重複しています: ${hub.slug}`);
  slugSet.add(hub.slug);
  if(!Array.isArray(hub.buttons)||hub.buttons.length===0)errors.push(`${hub.slug} のbuttonsが空です。`);
});
if(!html.includes('id="app"'))errors.push('#app コンテナが存在しません。');
if(!appJs.includes('CONFIG_URL'))errors.push('app.jsにCONFIG_URL定義がありません。');
const hasDataRoute=routes.some((r)=>r.src==='/data/hubs.json')||
  rewrites.some((r)=>r.source==='/data/hubs.json');
const hasCatchAll=routes.some((r)=>r.src==='/(.*)'&&r.dest==='/index.html')||
  rewrites.some((r)=>r.source==='/(.*)'&&r.destination==='/index.html');
if(!hasDataRoute)errors.push('vercel.json にデータ用ルート/リライトがありません。');
if(!hasCatchAll)errors.push('vercel.json にcatch-allルート/リライトがありません。');
if(errors.length){console.error('テスト失敗:');errors.forEach((err)=>console.error(`- ${err}`));process.exit(1);}
console.log('設定とビルド対象ファイルの整合性が確認できました。');
