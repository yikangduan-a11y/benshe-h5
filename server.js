const http=require('http'),fs=require('fs'),path=require('path');
const D=__dirname,LOG=path.join(D,'events.jsonl'),TOKEN='bs2026';
function stats(){const ev=fs.existsSync(LOG)?fs.readFileSync(LOG,'utf8').trim().split('\n').filter(Boolean).map(l=>JSON.parse(l)):[];
 const u=(e,f=()=>true)=>new Set(ev.filter(x=>x.e===e&&f(x)).map(x=>x.sid)).size;
 const steps=[['enter','进入页面'],['start','开始测试'],['result','做完测试'],['view_pay','看付费页'],['buy_click','点购买'],['leave_phone','留手机号'],['share_click','点分享']];
 const n=steps.map(([e,k])=>[k,u(e)]);const base=n[0][1]||1;const ph=ev.filter(x=>x.e==='leave_phone');
 const ss={};ev.filter(x=>x.e==='result').forEach(x=>ss[x.season]=(ss[x.season]||0)+1);
 const pv=ev.filter(x=>x.e==='enter').length;const vote={};ev.filter(x=>x.e==='rate').forEach(x=>vote[x.sid]=x.v);const up=Object.values(vote).filter(v=>v==='up').length,dn=Object.values(vote).filter(v=>v==='down').length;
 return `<!doctype html><meta charset=utf-8><meta name=viewport content="width=device-width"><title>本色 · 测试数据</title><body style="font-family:sans-serif;padding:20px;max-width:520px;color:#2B2522">
 <h2>访问量</h2><p style="font-size:18px">访问人数 <b>${u('enter')}</b>　访问次数 <b>${pv}</b></p><h2>满意度（${up+dn} 人评价）</h2><p style="font-size:18px">满意 <b>${up}</b>（${up+dn?(up/(up+dn)*100).toFixed(0):0}%）　不满意 <b>${dn}</b></p><h2>假付费测试漏斗（按人去重）</h2><table border=1 cellpadding=8 style="border-collapse:collapse;width:100%">${n.map(([k,v])=>`<tr><td>${k}</td><td>${v}</td><td>${(v/base*100).toFixed(1)}%</td></tr>`).join('')}</table>
 <h3>点购买时选的价格档</h3><p>9.9 元：${u('buy_click',x=>x.tier==='9.9')} 人　29.9 元：${u('buy_click',x=>x.tier==='29.9')} 人</p>
 <h3>季型分布</h3><p>${Object.entries(ss).map(([k,v])=>k+'：'+v).join('　')||'暂无'}</p>
 <h3>手机号（${ph.length}）</h3><p style="font-size:13px">${ph.map(p=>`${p.phone} · ${p.tier} 元 · ${p.season} · ${p.ts}`).join('<br>')||'暂无'}</p></body>`;}
const types={'.html':'text/html; charset=utf-8','.woff2':'font/woff2'};
http.createServer((q,s)=>{const u=new URL(q.url,'http://x');
 if(q.method==='POST'&&u.pathname.endsWith('/api/e')){let b='';q.on('data',d=>{if(b.length<4096)b+=d});q.on('end',()=>{try{const o=JSON.parse(b);o.ts=new Date().toISOString();fs.appendFileSync(LOG,JSON.stringify(o)+'\n')}catch(e){}s.end('ok')});return}
 if(u.pathname==='/stats'){if(u.searchParams.get('k')!==TOKEN){s.writeHead(403);return s.end('forbidden')}s.writeHead(200,{'content-type':types['.html']});return s.end(stats())}
 let f=u.pathname==='/'?'/index.html':u.pathname;f=path.join(D,path.normalize(f).replace(/^(\.\.[\/\\])+/,''));
 if(!f.startsWith(D)||!fs.existsSync(f)||fs.statSync(f).isDirectory()||/server\.js|events\.jsonl/.test(f)){s.writeHead(404);return s.end('not found')}
 s.writeHead(200,{'content-type':types[path.extname(f)]||'application/octet-stream','cache-control':'no-cache'});fs.createReadStream(f).pipe(s);
}).listen(process.env.PORT||8788,()=>console.log('on',process.env.PORT||8788));
