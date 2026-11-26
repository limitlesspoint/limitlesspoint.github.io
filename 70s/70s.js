/* 70s magazine: renders both pages from content.js and runs the interactive bits. */
(function () {
  var S = window.SITE, $ = function (s, r) { return (r || document).querySelector(s); };
  var page = document.documentElement.getAttribute('data-section');

  /* ---------- issue number: Vol = years since 2024, No = month ---------- */
  var d = new Date();
  document.querySelectorAll('.issue-no').forEach(function (el) {
    el.textContent = 'Vol. ' + (d.getFullYear() - 2024) + ' · No. ' + (d.getMonth() + 1) + ' · ' + d.toLocaleString('en-GB', { month: 'long' }) + ' ' + d.getFullYear();
  });

  /* ---------- masthead: one span per letter so they can bounce ---------- */
  var nameEl = $('.masthead .name a');
  if (nameEl) nameEl.innerHTML = S.name.split('').map(function (c) { return c === ' ' ? '<span class="sp"></span>' : '<span class="ch">' + c + '</span>'; }).join('');
  var line = $('.issue-line');
  if (line) line.innerHTML = '<span><b>' + S.role + '</b>, ' + S.org + '</span><span>' + S.units.map(function (u) { return '<a href="' + u.url + '">' + u.name + '</a>'; }).join(' &amp; ') + '</span>';

  /* ---------- the era sticker ---------- */
  function sticker() {
    var eras = Era.list, cur = 0, ANG = [-72, -26, 26, 72], R = 64;
    eras.forEach(function (e, i) { if (e.id === Era.current) cur = i; });
    var html = '<div class="sticker" role="group" aria-label="Change the decade this site is styled in">' +
      '<svg class="ring" viewBox="0 0 200 200" aria-hidden="true"><defs><path id="arc-' + page + '" d="M 18,100 A 82,82 0 0 1 182,100"/></defs>' +
      '<text><textPath href="#arc-' + page + '" startOffset="50%" text-anchor="middle">★ AK Radio · Stereo Hi-Fi ★</textPath></text></svg>';
    eras.forEach(function (e, i) {
      var a = ANG[i] * Math.PI / 180;
      html += '<button type="button" class="ch-btn" data-era="' + e.id + '" style="transform:translate(' + (Math.sin(a) * R).toFixed(1) + 'px,' + (-Math.cos(a) * R).toFixed(1) + 'px)">' + e.label + '</button>';
    });
    html += '<button type="button" class="knob" aria-label="Knob" style="transform:rotate(' + ANG[cur] + 'deg)"></button></div>';
    var wrap = document.createElement('div'); wrap.innerHTML = html; var st = wrap.firstChild;
    var knob = st.querySelector('.knob');
    knob.addEventListener('click', function () { var n = (cur + 1) % eras.length; knob.style.transform = 'rotate(' + ANG[n] + 'deg)'; Era.go(eras[n].id); });
    st.querySelectorAll('.ch-btn').forEach(function (b, i) { b.addEventListener('click', function () { knob.style.transform = 'rotate(' + ANG[i] + 'deg)'; }); });
    return st;
  }
  document.querySelectorAll('[data-sticker]').forEach(function (slot) { slot.appendChild(sticker()); Era.bind(slot); });

  /* ---------- contacts ---------- */
  var c = $('.contacts');
  if (c) c.innerHTML = '<span><b>Location</b>' + S.location + '</span><span><b>Email</b><a href="mailto:' + S.email + '">' + S.email + '</a></span><span><b>GitHub</b><a href="https://github.com/' + S.github + '">' + S.github + '</a></span>';

  var photo = $('.arch img'); if (photo) photo.src = S.photoUrl;

  /* ---------- HOME: bio, lava lamp, news ---------- */
  var cols = $('#bio-cols');
  if (cols) cols.innerHTML = S.bio.map(function (p) { return '<p>' + p + '</p>'; }).join('');

  var lamp = $('.lamp');
  if (lamp) {
    var WAX = [['#e0702a', '#ffd27a'], ['#a8431f', '#ffb66b'], ['#6f7436', '#e9e28f'], ['#2f6b66', '#bfe6d8'], ['#c0396b', '#ffc1d6']], wi = 0;
    lamp.addEventListener('click', function () { wi = (wi + 1) % WAX.length; lamp.style.setProperty('--wax', WAX[wi][0]); lamp.style.setProperty('--glow', WAX[wi][1]); });
  }

  /* ---------- the shelf ---------- */
  var cradle = $('.cradle');
  if (cradle) {
    cradle.addEventListener('click', function () { cradle.classList.remove('go'); void cradle.offsetWidth; cradle.classList.add('go'); });
    cradle.addEventListener('animationend', function (e) { if (e.target === cradle.querySelector('.pend:last-child')) cradle.classList.remove('go'); });
  }
  var cam = $('.camera'), print = $('.print');
  if (cam) {
    print.querySelector('img').src = S.photoUrl;
    cam.addEventListener('click', function () {
      var f = document.createElement('div'); f.className = 'flash'; document.body.appendChild(f); setTimeout(function () { f.remove(); }, 600);
      print.hidden = true; void print.offsetWidth; setTimeout(function () { print.hidden = false; }, 250);
    });
    print.addEventListener('click', function () { print.hidden = true; });
  }
  var disco = $('.disco');
  if (disco) {
    var lights = document.createElement('div'); lights.className = 'disco-lights'; lights.setAttribute('aria-hidden', 'true');
    var COLS = ['#ff4fa3', '#3fd0ff', '#ffe14d', '#ffffff', '#ff8a3d', '#9b6bff', '#5dff9b'];
    for (var i = 0; i < 90; i++) { var dot = document.createElement('i'); dot.style.left = (Math.random() * 100) + '%'; dot.style.top = (Math.random() * 100) + '%'; dot.style.background = COLS[i % COLS.length]; dot.style.boxShadow = '0 0 12px ' + COLS[i % COLS.length]; lights.appendChild(dot); }
    document.body.appendChild(lights);
    disco.addEventListener('click', function () { var on = !disco.classList.contains('on'); disco.classList.toggle('on', on); lights.classList.toggle('on', on); disco.setAttribute('aria-pressed', String(on)); });
  }
  var plate = $('.plate'), tape = $('.tape');
  if (plate) {
    var STOP = 135, busy = false, dialed = '', YEARS = { 1975: '70s', 1985: '80s', 1995: '90s', 2026: 'now' };
    [1, 2, 3, 4, 5, 6, 7, 8, 9, 0].forEach(function (d, i) {
      var a = 105 - i * 30, b = document.createElement('button');
      b.type = 'button'; b.className = 'hole'; b.textContent = d; b.setAttribute('aria-label', String(d));
      b.style.transform = 'rotate(' + a + 'deg) translateY(-40px) rotate(' + (-a) + 'deg)';
      b.addEventListener('click', function () {
        if (busy) return; busy = true;
        var turn = STOP - a; if (turn <= 0) turn += 360;
        plate.style.transition = 'transform ' + (0.25 + turn / 900).toFixed(2) + 's ease-in'; plate.style.transform = 'rotate(' + turn + 'deg)';
        setTimeout(function () {
          plate.style.transition = 'transform ' + (0.35 + turn / 420).toFixed(2) + 's cubic-bezier(.3,.1,.3,1)'; plate.style.transform = 'rotate(0deg)';
          dialed = (dialed + d).slice(-8); tape.textContent = dialed;
          var last4 = dialed.slice(-4);
          setTimeout(function () { busy = false; if (YEARS[last4] && YEARS[last4] !== Era.current) { tape.textContent = '☎ ' + last4; Era.go(YEARS[last4]); } }, (350 + turn / 420 * 1000));
        }, (250 + turn / 900 * 1000));
      });
      plate.appendChild(b);
    });
  }

  /* ---------- the wind-up tin robot collects paper clips (a very small paperclip maximiser) ---------- */
  var bot = $('.tinbot'), objs = $('.objects');
  if (bot && objs) {
    var CLIP = '<svg viewBox="0 0 10 24"><path d="M3 6v11a2 2 0 0 0 4 0V4.5a3 3 0 0 0-6 0V18a4 4 0 0 0 8 0V7" fill="none" stroke="#5f656d" stroke-width="1.6" stroke-linecap="round"/></svg>';
    var loose = [], carried = 0, piled = 0, botX = 0, energy = 0, raf = null, hungry = false, prey = null, chew = 0, eaten = [], motionOff = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
    var shelfItems = [].slice.call(objs.children).filter(function (o) { return o !== bot; });
    var pile = document.createElement('button'); pile.type = 'button'; pile.className = 'clippile'; pile.hidden = true; pile.setAttribute('aria-label', 'A pile of paper clips'); objs.appendChild(pile);
    function home() { return bot.offsetLeft; }
    function scatter(n) {
      var W = objs.scrollWidth, h = home();
      for (var i = 0; i < n; i++) {
        var x; do { x = 16 + Math.random() * (W - 40); } while (Math.abs(x - h - 28) < 60);
        var c = document.createElement('span'); c.className = 'clip'; c.innerHTML = CLIP; c.dataset.x = x;
        c.style.left = x + 'px'; c.style.transform = 'rotate(' + (Math.random() < .5 ? 1 : -1) * (70 + Math.random() * 40) + 'deg)';
        objs.appendChild(c); loose.push(c);
      }
    }
    function renderPile() {
      var n = Math.min(piled, 70), w = n > 9 ? Math.round(34 + Math.sqrt(n - 9) * 9) : 34;
      pile.hidden = !piled; pile.style.width = w + 'px'; pile.style.left = (home() + 32 - w / 2 + (n > 9 ? 0 : 15 - 32 + 17)) + 'px';
      pile.innerHTML = new Array(n + 1).join('x').split('').map(function (_, i) {
        if (n <= 9) return '<span style="left:' + (i * 3.4) + 'px;transform:rotate(' + ((i * 47) % 140 - 70) + 'deg)">' + CLIP + '</span>';
        var u = ((i * 0.6180339) % 1), v = ((i * 0.7548776) % 1), x = (u - .5) * (w - 8), hgt = Math.sqrt(n) * 2.6 * (1 - Math.abs(x) / (w / 2)) * v;   // a little mound
        return '<span style="left:' + (w / 2 - 4 + x).toFixed(1) + 'px;bottom:' + (hgt - 6).toFixed(1) + 'px;transform:rotate(' + ((i * 47) % 160 - 80) + 'deg)">' + CLIP + '</span>';
      }).join('');
      pile.setAttribute('aria-label', piled + ' paper clips, neatly hoarded');
    }
    function renderCarry() {
      bot.querySelector('.carry').innerHTML = new Array(Math.min(carried, 6) + 1).join(CLIP);
      bot.classList.toggle('carrying', carried > 0);
    }
    function nearest() {
      var cx = home() + 32 + botX, best = null, bd = 1e9;
      loose.forEach(function (c) { var d = Math.abs(+c.dataset.x + 4 - cx); if (d < bd) { bd = d; best = c; } });
      return best;
    }
    /* once every clip is home, the only paper-clip-shaped resource left is everything else on the shelf */
    function victims() {
      return shelfItems.filter(function (o) { return !o.classList.contains('gone') && !o.classList.contains('munched') && o.offsetWidth; });
    }
    function centre(o) { return o.offsetLeft + o.offsetWidth / 2; }
    function nextPrey() {
      var cx = home() + 32 + botX, best = null, bd = 1e9;
      victims().forEach(function (o) { var d = Math.abs(centre(o) - cx); if (d < bd) { bd = d; best = o; } });
      return best;
    }
    function sparks(x, y) {
      for (var i = 0; i < 9; i++) {
        var k = document.createElement('i'); k.className = 'spark';
        k.style.left = x + 'px'; k.style.bottom = y + 'px';
        k.style.setProperty('--dx', ((Math.random() - .5) * 90).toFixed(0) + 'px'); k.style.setProperty('--dy', (-20 - Math.random() * 60).toFixed(0) + 'px');
        k.style.animationDelay = (Math.random() * .5).toFixed(2) + 's';
        objs.appendChild(k); setTimeout(function (k) { k.remove(); }.bind(null, k), 1400);
      }
    }
    function devour(o) {
      if (o.classList.contains('disco') && o.classList.contains('on')) o.click();       // lights off first
      var pr = o.querySelector('.print'); if (pr) pr.hidden = true;
      o.classList.add('munched'); sparks(centre(o), o.offsetHeight * .35);
      setTimeout(function () {
        o.classList.add('gone'); o.classList.remove('munched'); eaten.push(o);
        var n = Math.max(5, Math.round(o.offsetWidth * o.offsetHeight / 2600)), l = o.offsetLeft;
        for (var i = 0; i < n; i++) {
          var x = l + 6 + Math.random() * Math.max(10, o.offsetWidth - 16);
          var c = document.createElement('span'); c.className = 'clip fresh'; c.innerHTML = CLIP; c.dataset.x = x;
          c.style.left = x + 'px'; c.style.transform = 'rotate(' + (Math.random() < .5 ? 1 : -1) * (60 + Math.random() * 50) + 'deg)';
          objs.appendChild(c); loose.push(c);
        }
      }, 1050);
    }
    function follow(cx) {
      if (objs.scrollWidth > objs.clientWidth + 4) objs.scrollLeft += ((cx - objs.clientWidth / 2) - objs.scrollLeft) * .08;
    }
    function stop() {
      cancelAnimationFrame(raf); raf = null; bot.classList.remove('walking', 'winding', 'grinding');
      setTimeout(function () { if (!raf) bot.classList.remove('on'); }, 900);
    }
    function tick() { if (advance()) raf = requestAnimationFrame(tick); }
    function advance() {
      if (energy <= 0) { stop(); return false; }
      if (chew > 0) { if (--chew === 0) bot.classList.remove('grinding'); return true; }
      if (!hungry) energy--;
      var speed = hungry ? 2.24 : energy < 100 ? .42 + energy / 100 * 1.47 : 1.89;     // the spring runs down (unless it has found purpose)
      var target = nearest(), h = home(), cx = h + 32 + botX, tx;
      follow(cx);
      if (hungry && !target && !carried && !prey) {
        prey = nextPrey();
        if (!prey && Math.abs(botX) < 3) { hungry = false; energy = 1; bot.classList.add('maxed'); return true; }
      }
      if (prey && !target && !carried) {
        var side = prey.offsetWidth / 2 + 18, pc = centre(prey);
        tx = pc + (cx < pc ? -side : side);
        if (Math.abs(tx - cx) <= 2) { bot.classList.toggle('flip', cx > pc); bot.classList.add('grinding'); devour(prey); prey = null; chew = 70; return true; }
      } else if (target) tx = +target.dataset.x + 4;
      else if (carried) tx = h + 32;                                  // all collected: take them home
      else { energy = Math.min(energy, 80); tx = h + 32 + Math.sin(energy / 12) * 20; }
      var d = tx - cx;
      if (Math.abs(d) > 2) { var step = Math.sign(d) * Math.min(Math.abs(d), speed); botX += step; bot.classList.toggle('flip', step < 0); }
      else if (target) {
        loose.splice(loose.indexOf(target), 1); target.classList.add('got'); target.style.transform = 'translateY(-34px) scale(.4)';
        setTimeout(function () { target.remove(); }, 420); carried++; renderCarry();
      } else if (carried && Math.abs(botX) < 3) { piled += carried; carried = 0; renderCarry(); renderPile(); }
      bot.style.transform = 'translateX(' + botX.toFixed(1) + 'px)';
      return true;
    }
    bot.addEventListener('click', function () {
      if (hungry) return;
      bot.classList.add('on', 'winding');
      if (motionOff) { setTimeout(function () { bot.classList.remove('winding', 'on'); }, 1200); return; }
      if (!loose.length && !carried && piled && victims().length) { hungry = true; bot.classList.add('hungry'); bot.setAttribute('aria-label', 'Wind-up tin robot, optimising'); }
      energy = hungry ? 1e9 : Math.min(energy + 620, 1100);
      setTimeout(function () { bot.classList.remove('winding'); bot.classList.add('walking'); if (!raf) raf = requestAnimationFrame(tick); }, 650);
    });
    pile.addEventListener('click', function () {
      if (hungry) return;
      if (eaten.length) {                     // put the shelf back together
        eaten.forEach(function (o) { o.classList.remove('gone'); o.classList.add('reborn'); setTimeout(function () { o.classList.remove('reborn'); }, 700); });
        eaten = []; piled = 0; renderPile(); bot.classList.remove('maxed', 'hungry'); bot.setAttribute('aria-label', 'Wind-up tin robot'); scatter(6); return;
      }
      var n = piled; piled = 0; renderPile(); scatter(n);
    });
    scatter(6);
    var rzc; addEventListener('resize', function () { clearTimeout(rzc); rzc = setTimeout(renderPile, 150); });
    window.__tinbot = function (n) { for (var i = 0; i < (n || 0); i++) if (!advance()) break; return { loose: loose.length, carried: carried, piled: piled, energy: energy, x: Math.round(botX), hungry: hungry, eaten: eaten.length, left: victims().length }; }; // handy for debugging
  }

  var news = $('#news-list');
  if (news) {
    var TAGS = { event: 'Events', talk: 'Talks', research: 'Research', milestone: 'Milestones' };
    news.innerHTML = S.news.map(function (n, i) {
      var ts = S.tags(n);
      return '<li data-tag="' + ts.join(' ') + '"><time datetime="' + n.date + '">' + S.month(n.date, 'short') + '</time><span>' + ts.map(function (t) { return '<i class="tag-dot tag-' + t + '" aria-hidden="true"></i>'; }).join('') + n.html + '</span></li>';
    }).join('');
    var legend = $('#news-legend'), used = {};
    S.news.forEach(function (n) { S.tags(n).forEach(function (t) { used[t] = true; }); });
    legend.innerHTML = '<button type="button" aria-pressed="true" data-f="all">All</button>' + Object.keys(TAGS).filter(function (t) { return used[t]; }).map(function (t) {
      return '<button type="button" aria-pressed="false" data-f="' + t + '"><i class="tag-dot tag-' + t + '"></i>' + TAGS[t] + '</button>';
    }).join('');
    legend.addEventListener('click', function (e) {
      var b = e.target.closest('button'); if (!b) return;
      legend.querySelectorAll('button').forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); });
      news.querySelectorAll('li').forEach(function (li) { li.hidden = b.dataset.f !== 'all' && li.dataset.tag.split(' ').indexOf(b.dataset.f) < 0; });
    });
  }

  /* ---------- RESEARCH: interests, turntable, crate ---------- */
  var ints = $('#interests-list');
  if (ints) {
    $('#interests-lede').textContent = S.interestsIntro;
    ints.innerHTML = S.interests.map(function (x) { return '<li><h3>' + x.title + '</h3><p>' + x.blurb + '</p></li>'; }).join('');
    $('#collab').textContent = S.collab;
    var cl = $('.coverlist');
    if (cl) cl.innerHTML = S.interests.map(function (x) { return '<li><a href="#interests">' + x.title + '</a></li>'; }).join('') +
      '<li><a href="#hifi">Plus: ' + (S.papers.length === 1 ? 'one new preprint' : S.papers.length + ' new preprints') + ', out now on wax</a></li>';
  }

  /* a tiny die-cut apple sticker for the favourite paper's sleeve: white border follows the bitten outline */
  var APPLE_PATH = 'M8 5.2C6.4 3.6 2.2 3.9 2.2 8.4c0 3.6 2.6 6.4 4 6.4.8 0 1.2-.4 1.8-.4s1 .4 1.8.4c1.4 0 4-2.8 4-6.4 0-4.5-4.2-4.8-5.8-3.2z';
  var APPLE_STICKER = '<span class="applesticker"><svg viewBox="-1 -1 18 18"><defs><mask id="stickerbite"><rect x="-2" y="-2" width="22" height="22" fill="#fff"/><circle cx="14.6" cy="8.3" r="2.6" fill="#000"/></mask></defs>' +
    '<g mask="url(#stickerbite)"><path d="' + APPLE_PATH + '" fill="#fbf6ea" stroke="#fbf6ea" stroke-width="2.6" stroke-linejoin="round"/><path d="M8 5.2c0-1.4.4-2.6 1.4-3.4" stroke="#fbf6ea" stroke-width="2.6" stroke-linecap="round"/><path d="M9.2 2.6c1.2-.9 2.6-.8 3.2-.2-.8.9-2.2 1-3.2.2z" fill="#fbf6ea" stroke="#fbf6ea" stroke-width="2"/>' +
    '<path d="' + APPLE_PATH + '" fill="#d3212d"/><path d="M4.9 7.1c-.6.7-.8 1.7-.5 2.5" stroke="#ff8f8f" stroke-width=".9" fill="none" stroke-linecap="round"/></g>' +
    '<path d="M8 5.2c0-1.4.4-2.6 1.4-3.4" stroke="#5b3a22" stroke-width=".9" fill="none" stroke-linecap="round"/><path d="M9.2 2.6c1.2-.9 2.6-.8 3.2-.2-.8.9-2.2 1-3.2.2z" fill="#4c9a3a"/></svg></span>';

  var hifi = $('#hifi');
  if (hifi) {
    var LABELS = ['var(--mustard)', 'var(--olive)', 'var(--orange)'];
    var deck = $('.deckbox', hifi), lbl = $('.disc .lbl', hifi), play = $('.play', hifi), notes = $('.liner-notes', hifi), crate = $('.crate', hifi);
    var cur = 0, playing = false;
    crate.innerHTML = S.papers.map(function (p, i) {
      return '<li><button type="button" class="sleeve-btn" data-i="' + i + '" aria-pressed="' + (i === 0) + '" aria-label="Put ' + S.esc(p.short) + ' on the turntable">' +
        '<span class="peek" aria-hidden="true"></span><span class="sleeve-art art-' + (i % 3) + '" aria-hidden="true"><span class="cat"><span>' + p.arxiv + '</span><span>' + p.year + '</span></span><span class="album">' + p.short + '</span>' + (p.favourite ? APPLE_STICKER : '') + '</span></button></li>';
    }).join('');
    function show(i) {
      var p = S.papers[i]; cur = i;
      deck.style.setProperty('--lab', LABELS[i % 3]);
      lbl.textContent = p.short;
      notes.innerHTML = '<span class="kicker">Now on the platter · Side A</span><h3>' + p.title + '</h3>' +
        '<p class="au">' + S.authorsHTML(p) + '</p><div class="abs" tabindex="0" aria-label="Abstract">' + p.abstract + '</div>' +
        '<div class="meta"><span class="pill pill-out">' + p.venue + ' · ' + p.year + '</span><a class="pill" href="' + p.url + '">Read the paper</a><button type="button" class="pill" data-bib>Copy BibTeX</button></div>';
      notes.querySelector('[data-bib]').addEventListener('click', function (e) {
        var b = e.currentTarget, done = function (t) { b.textContent = t; setTimeout(function () { b.textContent = 'Copy BibTeX'; }, 2000); };
        if (navigator.clipboard) navigator.clipboard.writeText(S.bibtex(p)).then(function () { done('Copied'); }, function () { done('Copy failed'); });
        else done('Copy failed');
      });
      crate.querySelectorAll('.sleeve-btn').forEach(function (b) { b.setAttribute('aria-pressed', String(+b.dataset.i === i)); });
    }
    var song = null, vol = S.favouriteSong ? S.favouriteSong.volume : .18, knob = $('#vol70'), KA = 135;   // the favourite paper's record plays its song
    try { var sv = parseFloat(localStorage.getItem('vol70')); if (sv >= 0 && sv <= 1) vol = sv; } catch (e) {}
    function setVol(v, save) {
      vol = Math.max(0, Math.min(1, v)); if (song) song.volume = vol;
      if (knob) { knob.style.transform = 'rotate(' + (vol * 2 * KA - KA).toFixed(1) + 'deg)'; knob.setAttribute('aria-valuenow', Math.round(vol * 100)); }
      if (save) { try { localStorage.setItem('vol70', vol.toFixed(2)); } catch (e) {} }
    }
    if (knob) {
      setVol(vol);
      var turning = false;
      knob.addEventListener('pointerdown', function (e) { turning = true; try { knob.setPointerCapture(e.pointerId); } catch (_) {} });
      knob.addEventListener('pointermove', function (e) {
        if (!turning) return; var r = knob.getBoundingClientRect();
        var a = Math.atan2(e.clientX - (r.left + r.width / 2), -(e.clientY - (r.top + r.height / 2))) * 180 / Math.PI;
        setVol((Math.max(-KA, Math.min(KA, a)) + KA) / (2 * KA), true);
      });
      knob.addEventListener('pointerup', function () { turning = false; });
      knob.addEventListener('keydown', function (e) { var d = e.key === 'ArrowUp' || e.key === 'ArrowRight' ? .05 : e.key === 'ArrowDown' || e.key === 'ArrowLeft' ? -.05 : 0; if (d) { e.preventDefault(); setVol(vol + d, true); } });
    }
    function songOn() {
      if (!S.favouriteSong) return;
      if (!song) { song = new Audio(S.base + S.favouriteSong.audio); song.loop = true; song.volume = vol; }
      var p = song.play(); if (p && p.catch) p.catch(function () {});
    }
    function songOff() { if (song) song.pause(); }
    function setPlaying(v, withSong) {      // the record only makes a sound if you found the sticker
      playing = v; deck.classList.toggle('playing', v); play.textContent = v ? '❚❚' : '▶'; play.setAttribute('aria-label', v ? 'Stop the record' : 'Play the record');
      if (v && withSong && S.papers[cur].favourite) songOn(); else songOff();
    }
    play.addEventListener('click', function () { setPlaying(!playing); });
    crate.addEventListener('click', function (e) {
      var b = e.target.closest('.sleeve-btn'); if (!b) return;
      var sticker = !!e.target.closest('.applesticker'), singing = song && !song.paused;
      var i = +b.dataset.i;
      if (i === cur) { if (sticker && playing && !singing) songOn(); else setPlaying(!playing, sticker); return; }
      var was = playing; setPlaying(false);
      setTimeout(function () { show(i); setPlaying(true, sticker); }, was ? 650 : 0);
    });
    show(0); setPlaying(false);
  }
})();
