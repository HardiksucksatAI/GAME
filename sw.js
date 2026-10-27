const CACHE='territory-kingdoms-v2',FILES=['./','index.html','demo-engine.js','manifest.json','icon.svg'];
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(FILES)).then(()=>self.skipWaiting())));
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('territory-')&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',event=>{
  const request=event.request,url=new URL(request.url);
  if(request.method!=='GET'||url.origin!==self.location.origin)return;
  event.respondWith((async()=>{
    try{
      const response=await fetch(request,{cache:'no-cache'});
      if(response.ok){const copy=response.clone();event.waitUntil(caches.open(CACHE).then(cache=>cache.put(request,copy)))}
      return response;
    }catch(error){
      const cached=await caches.match(request);if(cached)return cached;
      if(request.mode==='navigate'){const page=await caches.match('index.html');if(page)return page}
      throw error;
    }
  })());
});
