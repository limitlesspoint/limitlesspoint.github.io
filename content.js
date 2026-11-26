/* ============================================================
   SITE CONTENT: edit this one file and every look updates.
   (70s magazine, 80s terminal, 90s desktop and NOW all read from here.)

   To add news: put a new line at the TOP of `news`, e.g.
     { date: '2026-12', tag: 'talk', html: 'Gave a talk at <a href="https://…">Somewhere</a>.' },
   tag is one of: 'event', 'research', 'talk', 'milestone' (add tags: [...] for more than one).
   To add a paper: copy one of the entries in `papers`.
   Your favourite paper: give it  favourite: true  (only one). Its record in the 70s look
   plays the favourite song below.
   ============================================================ */
window.SITE = {
  name: 'Ayub Kharel',
  first: 'Ayub',
  last: 'Kharel',
  role: 'DPhil student',
  org: 'University of Oxford',
  units: [
    { name: 'Laboratory for AI Security Research (LASR)', short: 'LASR', url: 'https://www.lasr.ac.uk/' },
    { name: 'Department of Statistics', short: 'Statistics', url: 'https://www.stats.ox.ac.uk/' }
  ],
  supervisor: { name: 'Patrick Rebeschini', url: 'https://www.stats.ox.ac.uk/~rebeschi/' },
  location: 'Oxford, UK',
  email: 'ayub.kharel@stats.ox.ac.uk',
  github: 'limitlesspoint',
  photo: 'pfp.jpg',
  tagline: 'Safety, security and alignment of large language models',

  bio: [
    'Hi! I\'m Ayub, a DPhil student at the University of Oxford, based in the <a href="https://www.lasr.ac.uk/">Laboratory for AI Security Research (LASR)</a> and the <a href="https://www.stats.ox.ac.uk/">Department of Statistics</a>. I\'m supervised by <a href="https://www.stats.ox.ac.uk/~rebeschi/">Patrick Rebeschini</a>.',
    'My research is on the safety, security and alignment of large language models. I\'m especially interested in robust reward modelling, to prevent reward hacking and the other failures that appear during post-training. I also use mechanistic interpretability to understand these behaviours from the model\'s internals.',
    'On the theory side, I\'m interested in neural networks and transformers, and in what makes these systems stable and able to generalise.'
  ],

  news: [
    { date: '2026-11', tag: 'event', html: 'Attending the <a href="https://www.iliad.ac/">Iliad Intensive</a> in London.' },
    { date: '2026-10', tag: 'event', html: 'Attended the <a href="https://safeaigermany.org/maths-workshop">Maths for AI Safety Workshop</a>, hosted by <a href="https://safeaigermany.org/">SAIGE (Safe AI Germany)</a>.' },
    { date: '2026-09', tag: 'research', html: 'Started a <a href="https://sparai.org/">SPAR</a> project on agent identifiability, supervised by Jonathan Richens.' },
    { date: '2026-08', tag: 'talk', tags: ['talk', 'event'], html: 'Presented at the <a href="https://mlschool.princeton.edu/">Princeton Machine Learning Theory Summer School</a>.' },
    { date: '2026-07', tag: 'talk', tags: ['talk', 'event'], html: 'Presented at the <a href="https://lxmls.github.io/2026/">Lisbon Machine Learning School (LxMLS)</a> in Lisbon, Portugal.' },
    { date: '2026-03', tag: 'event', html: 'Attended the <a href="https://vectorinstitute.swoogo.com/foundations_of_ai_security_symposium_2026">Foundations of AI Security Symposium</a> at the Vector Institute in Toronto, Canada.' },
    { date: '2026-01', tag: 'event', html: 'Attended <a href="https://aaai.org/conference/aaai/aaai-26/">AAAI 2026</a> in Singapore.' },
    { date: '2025-11', tag: 'talk', html: 'Talk at the LASR reading group: <i>Generative Models: the Causal Case</i>.' },
    { date: '2025-10', tag: 'milestone', html: 'Started my DPhil at the University of Oxford.' }
  ],

  interestsIntro: 'My research is on the safety, security and alignment of large language models, with a focus on:',
  interests: [
    { id: 'reward', title: 'Robust reward modelling', blurb: 'Reward models that hold up under optimisation pressure, to prevent reward hacking and the other failures that appear during post-training.' },
    { id: 'interp', title: 'Mechanistic interpretability', blurb: 'Understanding these behaviours from the model\'s internals, at a foundational level.' },
    { id: 'theory', title: 'Theory of neural networks and transformers', blurb: 'What makes these systems stable, and how and when they generalise.' }
  ],
  collab: 'Please get in touch if you\'d like to collaborate.',

  favouriteSong: { audio: 'media/bad-apple-70s.mp3?v=41555cc9', volume: 0.18 },   // Bad Apple!! (70s version)
  badApple: { terminal: 'media/bad-apple-terminal.mp4?v=fd878756', nes: 'media/bad-apple-nes.mp4?v=16cc00df', modern: 'media/bad-apple-modern.mp4?v=6cc5dbee', screensaver: 'media/bad-apple.mp4?v=d48e91f3' },

  papers: [
    {
      id: 'proximalfm',
      short: 'ProximalFM',
      title: 'ProximalFM: Amortized Proximal Causal Inference under Hidden Confounding',
      authors: ['Christophe Muller', 'Ayub Kharel', 'Alex Luedtke', 'Chan Park', 'Eric Tchetgen Tchetgen', 'Juan L. Gamella', 'Rahul G. Krishnan', 'Ricardo Silva', 'Jakob Zeitler'],
      venue: 'arXiv preprint', year: 2026, arxiv: '2610.08078', url: 'https://arxiv.org/abs/2610.08078',
      abstract: 'Standard causal identification methods often assume no unmeasured confounding and can fail when relevant confounders are unobserved. Proximal causal inference instead uses proxy variables to identify effects under hidden confounding. However, nonparametric proximal estimation can be challenging in practice: recovering causal estimands such as the conditional average treatment effect (CATE) requires solving an ill-posed integral equation that is data-hungry, hyperparameter-sensitive, and optimization-unstable. Bayesian inference for such models provides a desirable alternative, mitigating these difficulties by regularizing through the prior. However, computing a posterior is itself challenging, as a typical likelihood function will include latent variables. Following the recent success of tabular foundation models in backdoor, instrumental variable, and frontdoor settings, we propose that prior-data fitted networks (PFNs) are uniquely suited to resolve this bottleneck. Indeed, by training on synthetic data sampled from compliant structural causal models with access to oracle counterfactuals, we simplify the task substantially, amortizing the implied Bayesian operator inversion into a single transformer forward pass. Compared to prior literature that focuses primarily on point estimation, our model, ProximalFM, explicitly targets the Bayesian posterior distribution of the CATE. One unique aspect of this problem is that we need to provide Monte Carlo estimates of the oracle CATEs, leading to a novel variation of PFNs that accounts for the added stochastic error. Across a diverse suite of proximal regimes, ProximalFM achieves consistently strong CATE-estimation performance without dataset-specific tuning, with its largest advantage when latent confounding is substantial and the proxies are weakly informative; it also provides fast inference through a single amortized forward pass.'
    },
    {
      id: 'nlls',
      favourite: true,
      short: 'Learned Feature Geometry',
      title: 'Generalization in Nonlinear Least Squares via Learned Feature Geometry',
      authors: ['Ayub Kharel', 'Ilja Kuzborskij', 'Patrick Rebeschini', 'Yasin Abbasi-Yadkori'],
      venue: 'arXiv preprint', year: 2026, arxiv: '2606.08799', url: 'https://arxiv.org/abs/2606.08799',
      abstract: 'We study the generalization of ridge-regularized nonlinear least-squares models via on-average algorithmic stability, deriving error bounds for local minimizers in terms of a data-dependent effective dimension that reflects the geometry of the gradient model at the trained parameters, through the empirical Jacobian Gram matrix and a residual-curvature term. In the linear case, where the curvature term vanishes, this recovers the classical effective dimension of the Jacobian kernel covariance, but evaluated at the trained model rather than at initialization as is typical in neural tangent kernel analyses. We further bound this effective dimension via covering complexity of the gradient features, leading to guarantees that depend on learned geometry rather than parameter count. In particular, for manifold-supported data and piecewise Lipschitz Jacobians, the bounds scale with intrinsic dimension, while for one-hidden-layer ReLU networks, the mechanism can be made explicit through counts of activation-stable regions. Experiments on synthetic manifolds, clustered distributions, and benchmark datasets illustrate trained-Jacobian compression, the tightness of the residual-curvature linearization, and agreement between the stability bound and observed generalization gaps. A key feature of our bounds is the simplicity of their derivation, which follows from first principles using the Brascamp-Lieb inequality under strongly log-concave noise.'
    }
  ]
};

/* ---------- small helpers every look uses ---------- */
(function (S) {
  var MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  S.base = (document.currentScript && document.currentScript.src || '').replace(/content\.js(\?.*)?$/, '');
  S.photoUrl = S.base + S.photo;
  S.month = function (d, style) { // d = 'YYYY-MM'
    var y = d.slice(0, 4), m = +d.slice(5, 7) - 1;
    if (style === 'short') return MONTHS[m].slice(0, 3) + ' ' + y;
    if (style === 'slash') return y + '/' + d.slice(5, 7);
    return MONTHS[m] + ' ' + y;
  };
  S.tags = function (n) { return n.tags || [n.tag]; };
  S.text = function (html) { var t = document.createElement('div'); t.innerHTML = html; return t.textContent; };
  S.authorsHTML = function (p, tag) {
    tag = tag || 'b';
    return p.authors.map(function (a) { return a === S.name ? '<' + tag + ' class="me">' + a + '</' + tag + '>' : a; }).join(', ');
  };
  S.bibtex = function (p) {
    var key = p.authors[0].split(' ').pop().toLowerCase() + p.year + p.short.split(' ')[0].toLowerCase().replace(/[^a-z]/g, '');
    return '@article{' + key + ',\n  title   = {' + p.title + '},\n  author  = {' + p.authors.join(' and ') + '},\n  journal = {arXiv preprint arXiv:' + p.arxiv + '},\n  year    = {' + p.year + '}\n}';
  };
  /* a small video player for the easter eggs (files live in /media; volume is 0..1, default 35%) */
  S.videoPlayer = function (el, src, o) {
    o = o || {};
    var v = document.createElement('video');
    v.src = S.base + src; v.playsInline = true; v.preload = 'auto'; v.controls = !!o.controls; v.loop = !!o.loop;
    v.volume = o.volume != null ? o.volume : .35;
    v.style.cssText = 'display:block;width:100%;height:100%;background:#000;object-fit:contain';
    if (o.onEnd) v.addEventListener('ended', o.onEnd);
    el.appendChild(v);
    function go() { var p = v.play(); if (p && p.catch) p.catch(function () {}); }
    go();
    return {
      el: v, play: go, pause: function () { v.pause(); },
      destroy: function () { v.pause(); v.removeAttribute('src'); v.load(); v.remove(); },
      time: function () { return [v.currentTime || 0, v.duration || 0]; },
      seek: function (t) { v.currentTime = t; },
      volume: function (x) { v.volume = Math.max(0, Math.min(1, x / 100)); }   // takes 0..100, like a slider
    };
  };
  S.esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
})(window.SITE);
