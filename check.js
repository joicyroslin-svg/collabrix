const fs=require('fs');
const html=fs.readFileSync('dashboard.html','utf8');
const scripts=[...html.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/g)].map(m=>m[1]);
console.log('scripts', scripts.length);
scripts.forEach((s,i)=>{
  try{ new Function(s); console.log('script',i,'OK'); }
  catch(e){ console.error('script',i,'ERR', e.message); }
});
