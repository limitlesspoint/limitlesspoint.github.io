/* Era switcher (the "decade dial").
   Each look draws its own control in its own style; any element with data-era="70s|80s|90s|now"
   becomes a switch. This file handles the shared part: remembering the visitor's pick,
   sending returning visitors to it, and playing an exit transition that suits the era they're leaving.

   Page markup:  <html data-decade="70s|80s|90s|now" data-section="home|research" [data-default]>
                 <script src="…/dial.js"></script>   (in <head>)  */
(function () {
  var script = document.currentScript;
  var base = script ? script.src.replace(/dial\.js(\?.*)?$/, '') : '/';
  var root = document.documentElement;
  var here = root.getAttribute('data-decade') || '70s';
  var KEY = 'decade';

  var ERAS = [
    { id: '70s', label: '70s', name: '1970s magazine', home: '70s/', research: '70s/research.html' },
    { id: '80s', label: '80s', name: '1980s terminal', home: '80s/', research: '80s/#research' },
    { id: '90s', label: '90s', name: '1990s desktop', home: '90s/', research: '90s/#research' },
    { id: 'now', label: 'NOW', name: 'the present day', home: '', research: '#research' }
  ];
  function find(id) { for (var i = 0; i < ERAS.length; i++) if (ERAS[i].id === id) return ERAS[i]; return null; }
  function section() { return root.getAttribute('data-section') === 'research' || /research/.test(location.hash) ? 'research' : 'home'; }
  function url(e) { return base + (section() === 'research' ? e.research : e.home); }
  function load() { try { var v = localStorage.getItem(KEY); return v === 'syn' ? 'now' : v; } catch (e) { return null; } }
  function save(id) { try { localStorage.setItem(KEY, id); } catch (e) {} }

  // Returning visitor landing on the default (NOW) page: take them to the look they picked last.
  var pref = load();
  if (root.hasAttribute('data-default') && find(pref) && pref !== here) {
    location.replace(url(find(pref)));
    return;
  }

  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- exit transitions, one per era ---------- */
  var exits = {
    '70s': function (to, done) { // TV static with a channel number
      var ov = overlay('background:#111');
      var cv = document.createElement('canvas'), w = 160, h = 100; cv.width = w; cv.height = h;
      cv.style.cssText = 'width:100%;height:100%;display:block;image-rendering:pixelated';
      ov.appendChild(cv);
      var osd = document.createElement('div');
      osd.style.cssText = 'position:absolute;top:24px;right:28px;font:700 clamp(28px,6vw,56px)/1 ui-monospace,Menlo,monospace;color:#6dff8a;text-shadow:0 0 10px rgba(109,255,138,.8)';
      osd.textContent = 'CH ' + to.label; ov.appendChild(osd);
      var ctx = cv.getContext('2d'), img = ctx.createImageData(w, h), d = img.data, t0 = performance.now();
      (function frame(t) {
        for (var p = 0; p < d.length; p += 4) { var v = Math.random() * 255 | 0; d[p] = d[p + 1] = d[p + 2] = v; d[p + 3] = 255; }
        ctx.putImageData(img, 0, 0);
        if (t - t0 < 520) requestAnimationFrame(frame); else done();
      })(t0);
    },
    '80s': function (to, done) { // CRT switching off: collapse to a line, then a dot
      var st = document.createElement('style');
      st.textContent = 'html.era-off{background:#000!important}html.era-off body{animation:eraOff .55s cubic-bezier(.6,0,.9,.4) forwards;transform-origin:50% ' + (scrollY + innerHeight / 2) + 'px}' +
        '@keyframes eraOff{0%{transform:none;filter:none}55%{transform:scale(1,.004);filter:brightness(4)}100%{transform:scale(0,.004);filter:brightness(6)}}';
      document.head.appendChild(st); root.classList.add('era-off'); setTimeout(done, 560);
    },
    '90s': function (to, done) { // a quick "Loading…" dialog with a progress bar
      document.body.style.cursor = 'wait';
      var ov = overlay('background:transparent;display:grid;place-items:center');
      ov.innerHTML = '<div style="width:min(340px,90vw);background:#c3c3c3;padding:3px;font:13px Tahoma,Verdana,sans-serif;box-shadow:inset -1px -1px #000,inset 1px 1px #fff,inset -2px -2px #808080,inset 2px 2px #dfdfdf">' +
        '<div style="background:linear-gradient(90deg,#0a1f7a,#2a7fd4);color:#fff;font-weight:700;padding:3px 6px">Changing era…</div>' +
        '<div style="padding:14px 12px">Loading ' + to.name + '…<div style="margin-top:10px;height:18px;padding:2px;background:#fff;box-shadow:inset 1px 1px #808080,inset -1px -1px #fff"><div class="era-bar" style="height:100%;width:0;background:repeating-linear-gradient(90deg,#0a1f7a 0 10px,transparent 10px 12px);transition:width .6s steps(12)"></div></div></div></div>';
      requestAnimationFrame(function () { requestAnimationFrame(function () { ov.querySelector('.era-bar').style.width = '100%'; }); });
      setTimeout(done, 680);
    },
    'now': function (to, done) { // blur out behind a frosted pane
      var ov = overlay('backdrop-filter:blur(0px);-webkit-backdrop-filter:blur(0px);background:rgba(245,246,242,0);transition:backdrop-filter .45s,-webkit-backdrop-filter .45s,background .45s;display:grid;place-items:center;font:600 14px ui-monospace,Menlo,monospace;letter-spacing:.2em;color:#0d0f12');
      ov.innerHTML = '<span style="opacity:0;transition:opacity .3s .1s">→ ' + to.name.toUpperCase() + '</span>';
      requestAnimationFrame(function () { requestAnimationFrame(function () {
        ov.style.backdropFilter = ov.style.webkitBackdropFilter = 'blur(18px)'; ov.style.background = 'rgba(245,246,242,.75)'; ov.firstChild.style.opacity = 1;
      }); });
      setTimeout(done, 520);
    }
  };
  function overlay(css) {
    var ov = document.createElement('div'); ov.className = 'era-overlay'; ov.setAttribute('aria-hidden', 'true');
    ov.style.cssText = 'position:fixed;inset:0;z-index:2147483600;' + css;
    document.body.appendChild(ov); return ov;
  }

  var busy = false;
  function go(id) {
    var to = find(id); if (!to || busy || id === here) return;
    busy = true; save(id);
    var dest = url(to);
    document.dispatchEvent(new CustomEvent('era:leaving', { detail: to }));
    if (reduce) { location.href = dest; return; }
    var fired = false; function done() { if (!fired) { fired = true; location.href = dest; } }
    setTimeout(done, 1400); // safety net if the tab is in the background
    setTimeout(function () { (exits[here] || exits['70s'])(to, done); }, 180);
  }

  function bind(scope) {
    (scope || document).querySelectorAll('[data-era]').forEach(function (el) {
      if (el.__era) return; el.__era = true;
      var id = el.getAttribute('data-era');
      if (id === here) el.setAttribute('aria-current', 'true');
      if (!el.hasAttribute('aria-label') && find(id)) el.setAttribute('aria-label', 'Switch to the ' + find(id).name + ' look');
      el.addEventListener('click', function (e) { e.preventDefault(); go(id); });
    });
  }

  // Back button after a switch: clear the transition and remember where we are again.
  window.addEventListener('pageshow', function (e) {
    if (!e.persisted) return;
    busy = false; root.classList.remove('era-off'); document.body.style.cursor = '';
    document.querySelectorAll('.era-overlay').forEach(function (o) { o.remove(); });
    save(here);
  });

  window.Era = { list: ERAS, current: here, find: find, go: go, bind: bind, url: url };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function () { bind(); }); else bind();
})();
