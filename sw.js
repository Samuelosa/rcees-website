const CACHE='rcees-v1-1776112245415';
const PRECACHE=['./','./index.html','./cropped-RCEES-LOGO-web-2048x641.png','./images/img-009uvt3x.jpg','./images/img-00ug8xok.webp'];
self.addEventListener('install',e=>{
  e.waitUntil(caches.open(CACHE).then(c=>c.addAll(PRECACHE)).then(()=>self.skipWaiting()));
});
self.addEventListener('activate',e=>{
  e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));
});
self.addEventListener('fetch',e=>{
  const url=new URL(e.request.url);
  const isImage=url.pathname.startsWith('/rcees-website/images/');
  const isHTML=url.pathname.endsWith('.html')||url.pathname.endsWith('/');
  if(isImage){
    e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request).then(res=>{
      const clone=res.clone();
      caches.open(CACHE).then(c=>c.put(e.request,clone));
      return res;
    })));
  } else if(isHTML){
    e.respondWith(fetch(e.request).then(res=>{
      const clone=res.clone();
      caches.open(CACHE).then(c=>c.put(e.request,clone));
      return res;
    }).catch(()=>caches.match(e.request)));
  } else {
    e.respondWith(fetch(e.request).catch(()=>caches.match(e.request)));
  }
});