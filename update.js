// Sincro — actualización automática.
// Cada página lleva su número de versión (window.SINCRO_VERSION). Al abrirla, y cada
// vez que se vuelve a la app, se pregunta al servidor cuál es la última versión
// (version.json, sin caché). Si hay una más nueva:
// aparece un aviso con el botón "Actualizar" (no recarga sola, para no cortar
// la conexión de la app ni perder lo que estés escribiendo).
(function(){
  var V = window.SINCRO_VERSION || '';
  var shown = false;
  function irA(v){
    try{ var u = new URL(location.href); u.searchParams.set('v', v); location.replace(u.toString()); }
    catch(e){ location.reload(); }
  }
  function aviso(v){
    if (shown || !document.body) return; shown = true;
    var b = document.createElement('div');
    b.style.cssText = 'position:fixed;left:12px;right:12px;bottom:calc(12px + env(safe-area-inset-bottom,0px));z-index:99999;' +
      'background:var(--bg,#fff);color:var(--ink,#111827);border:1px solid var(--line,#e5e7eb);border-radius:16px;padding:14px 16px;display:flex;align-items:center;gap:12px;' +
      'box-shadow:0 8px 28px rgba(0,0,0,.25);font:600 15px/1.3 Inter,system-ui,sans-serif;max-width:560px;margin:0 auto;';
    b.innerHTML = '<span style="flex:1;">✨ Hay una versión nueva de Sincro</span>' +
      '<button style="background:var(--blue,#2563EB);color:#fff;border:none;border-radius:12px;padding:12px 16px;font:800 15px Inter,sans-serif;cursor:pointer;">Actualizar</button>';
    b.querySelector('button').onclick = function(){ irA(v); };
    document.body.appendChild(b);
  }
  function comprobar(){
    if (!window.fetch) return;
    fetch('version.json?t=' + Date.now(), { cache: 'no-store' })
      .then(function(r){ return r.ok ? r.json() : null; })
      .then(function(d){
        if (!d || !d.v || d.v === V) return;
        // No se recarga sola: se muestra el aviso y se actualiza al pulsar «Actualizar»,
        // para no cortar la sincronización mientras la app está en uso.
        if (document.body) aviso(d.v); else document.addEventListener('DOMContentLoaded', function(){ aviso(d.v); });
      })
      .catch(function(){});
  }
  // Se comprueba un poco después de abrir, cuando la app ya ha cargado.
  window.addEventListener('load', function(){ setTimeout(comprobar, 3000); });
  document.addEventListener('visibilitychange', function(){ if (document.visibilityState === 'visible') comprobar(); });
  window.addEventListener('pageshow', function(e){ if (e.persisted) comprobar(); });
})();
