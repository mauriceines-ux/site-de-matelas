'use strict';

/* Polices Google chargées après l'affichage : si le réseau les bloque, le site s'affiche quand même (polices système) */
(() => {
  const l = document.createElement('link');
  l.rel = 'stylesheet';
  l.href = 'https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,600&family=Manrope:wght@400;500;700&display=swap';
  document.head.appendChild(l);
})();

/* ---------- Outils ---------- */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const eur = n => new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(n);

/* Images Unsplash (si une image ne charge pas, un fond neutre la remplace) */
const PICS = [
  '1631049307264-da0ec9d70304', '1505693416388-ac5ce068fe85', '1522771739844-6a9f6d5f14af',
  '1540518614846-7eded433c457', '1616594039964-ae9021a400a0', '1560448204-e02f11c3d0e2'
];
const pic = i => `https://images.unsplash.com/photo-${PICS[i]}?auto=format&fit=crop&w=900&q=80`;
const FALLBACK = 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="900" height="675"><rect width="100%" height="100%" fill="#dde6f8"/></svg>');
document.addEventListener('error', e => {
  const t = e.target;
  if (t.tagName === 'IMG' && !t.dataset.fb) { t.dataset.fb = 1; t.src = FALLBACK; }
}, true);

/* ---------- Données produits ---------- */
const PRODUCTS = [
  { id: 'nano-spire', name: 'Nano Spire Signature', tech: 'Hybride', firm: 'Équilibré', price: 1290, old: 1790, pic: 0, feat: 1, badge: 'Best-seller', desc: 'Ressorts ensachés Spire et mousse Nano : un soutien précis, zone par zone.' },
  { id: 'aeris', name: 'Aéris HR 35', tech: 'Mousse HR', firm: 'Ferme', price: 549, old: 799, pic: 1, feat: 1, desc: 'Mousse haute résilience 35 kg/m³ pour un maintien ferme et durable.' },
  { id: 'nuage', name: 'Nuage Latex', tech: 'Latex', firm: 'Souple', price: 899, old: 1249, pic: 2, feat: 1, badge: 'Nouveau', desc: 'Latex naturel ventilé : un accueil enveloppant et une nuit au frais.' },
  { id: 'orion', name: 'Orion Hybride', tech: 'Hybride', firm: 'Ferme', price: 1149, old: 1590, pic: 3, desc: 'Ressorts Spire renforcés et mousse Nano pour un dos parfaitement aligné.' },
  { id: 'oceane', name: 'Océane Confort', tech: 'Mousse HR', firm: 'Souple', price: 479, old: 699, pic: 4, desc: 'Un accueil moelleux en mousse HR, idéal pour dormir sur le côté.' },
  { id: 'zenith', name: 'Zénith Latex', tech: 'Latex', firm: 'Équilibré', price: 990, old: 1390, pic: 5, desc: 'Latex à sept zones de confort : soutien équilibré et grande élasticité.' },
  { id: 'harmonie', name: 'Harmonie 3 zones', tech: 'Mousse HR', firm: 'Équilibré', price: 629, old: 899, pic: 1, desc: 'Trois zones de soutien en mousse HR pour un confort polyvalent.' },
  { id: 'sommier-tap', name: 'Sommier Tapissier Pro', tech: 'Sommier', firm: 'Ferme', price: 249, old: 349, pic: 3, desc: 'Structure en hêtre massif et lattes renforcées, pieds inclus.' },
  { id: 'sommier-relax', name: 'Sommier Relax électrique', tech: 'Sommier', firm: 'Équilibré', price: 790, old: 1090, pic: 4, desc: 'Tête et pieds relevables par télécommande, moteur silencieux.' }
];
const SIZES = { '140 × 190': 0, '160 × 200': 150, '180 × 200': 250 };
const prod = id => PRODUCTS.find(p => p.id === id);

function card(p, i = 0) {
  return `<article class="card" style="animation-delay:${i * 70}ms">
    <div class="card-img"><img src="${pic(p.pic)}" alt="${p.name}" loading="lazy">${p.badge ? `<span class="badge">${p.badge}</span>` : ''}</div>
    <div class="card-body">
      <div class="tags"><span>${p.tech}</span><span>${p.firm}</span></div>
      <h3>${p.name}</h3><p>${p.desc}</p>
      <div class="price"><strong>${eur(p.price)}</strong><del>${eur(p.old)}</del><em>-${Math.round((1 - p.price / p.old) * 100)} %</em></div>
      <button class="btn btn-primary" data-view="${p.id}">Voir le produit</button>
    </div></article>`;
}

/* ---------- Accueil ---------- */
$('#featured').innerHTML = PRODUCTS.filter(p => p.feat).map(card).join('');

/* ---------- Catalogue et filtres ---------- */
const FILTERS = { firm: ['Tous', 'Ferme', 'Équilibré', 'Souple'], tech: ['Tous', 'Mousse HR', 'Latex', 'Hybride', 'Sommier'] };
const LABELS = { firm: 'Soutien', tech: 'Technologie' };
const f = { firm: 'Tous', tech: 'Tous' };

$('#filters').innerHTML = Object.keys(FILTERS).map(g =>
  `<div class="frow"><b>${LABELS[g]}</b>${FILTERS[g].map(v => `<button class="chip" data-g="${g}" data-v="${v}">${v}</button>`).join('')}</div>`
).join('');

function renderCatalogue() {
  $$('.chip').forEach(c => c.classList.toggle('on', f[c.dataset.g] === c.dataset.v));
  const list = PRODUCTS.filter(p =>
    (f.firm === 'Tous' || p.firm === f.firm) &&
    (f.tech === 'Tous' ? p.tech !== 'Sommier' : p.tech === f.tech));
  $('#count').textContent = `${list.length} produit${list.length > 1 ? 's' : ''}`;
  $('#grid').innerHTML = list.map(card).join('') ||
    '<p class="empty">Aucun produit ne correspond. Essayez un autre soutien ou une autre technologie.</p>';
}

/* ---------- Fiche produit ---------- */
function openProduct(id) {
  const p = prod(id);
  $('#modal').innerHTML = `<div class="modal-in">
    <img src="${pic(p.pic)}" alt="${p.name}">
    <div class="modal-txt">
      <div class="tags"><span>${p.tech}</span><span>${p.firm}</span></div>
      <h2>${p.name}</h2>
      <p>${p.desc} Fabrication française, garantie 10 ans, 100 nuits d’essai.</p>
      <label>Dimensions<select id="size">${Object.entries(SIZES).map(([s, d]) => `<option value="${s}">${s} cm – ${eur(p.price + d)}</option>`).join('')}</select></label>
      <div class="price"><strong>${eur(p.price)}</strong><del>${eur(p.old)}</del></div>
      <button class="btn btn-primary" data-add="${p.id}">Ajouter au panier</button>
    </div>
    <button class="icon-btn x" id="mClose" aria-label="Fermer">✕</button></div>`;
  $('#modal').showModal();
}

/* ---------- Panier ---------- */
let cart = [];
try { cart = JSON.parse(localStorage.getItem('bl-cart')) || []; } catch (e) { cart = []; }
cart = cart.filter(i => prod(i.id) && i.size in SIZES);
const unit = i => prod(i.id).price + SIZES[i.size];

function renderCart() {
  const n = cart.reduce((s, i) => s + i.qty, 0);
  $('#cartCount').textContent = n;
  $('#cartCount').hidden = !n;
  $('#cartItems').innerHTML = cart.length ? cart.map((i, k) => {
    const p = prod(i.id);
    return `<div class="line"><img src="${pic(p.pic)}" alt="">
      <div><b>${p.name}</b><small>${i.size} cm</small>
        <div class="qty"><button data-q="${k}" data-d="-1" aria-label="Moins">−</button><span>${i.qty}</span><button data-q="${k}" data-d="1" aria-label="Plus">+</button></div></div>
      <div class="line-r"><b>${eur(unit(i) * i.qty)}</b><button data-rm="${k}" aria-label="Retirer">Retirer</button></div></div>`;
  }).join('') : '<p class="empty">Votre panier est vide. Parcourez nos matelas pour commencer.</p>';
  $('#cartTotal').textContent = eur(cart.reduce((s, i) => s + unit(i) * i.qty, 0));
  try { localStorage.setItem('bl-cart', JSON.stringify(cart)); } catch (e) {}
}

function addToCart(id, size) {
  const found = cart.find(i => i.id === id && i.size === size);
  found ? found.qty++ : cart.push({ id, size, qty: 1 });
  renderCart();
  toast('Ajouté au panier');
}

function toggleCart(open) {
  $('#cart').classList.toggle('open', open);
  $('#overlay').classList.toggle('show', open);
  $('#cart').setAttribute('aria-hidden', !open);
}

let tt;
function toast(msg) {
  const t = $('#toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(tt);
  tt = setTimeout(() => t.classList.remove('show'), 2400);
}

/* ---------- Quiz ---------- */
const QUIZ = [
  { k: 'pos', q: 'Quelle est votre position de sommeil ?', o: [['dos', 'Sur le dos'], ['cote', 'Sur le côté'], ['ventre', 'Sur le ventre'], ['mixte', 'Je change souvent']] },
  { k: 'feel', q: 'Préférez-vous un accueil moelleux ou ferme ?', o: [['0', 'Moelleux et enveloppant'], ['1', 'Équilibré'], ['2', 'Ferme et tonique']] },
  { k: 'dos', q: 'Avez-vous mal au dos ?', o: [['oui', 'Oui, régulièrement'], ['parfois', 'Parfois, au réveil'], ['non', 'Non, pas du tout']] }
];
const WHY = {
  'Hybride': 'Les ressorts ensachés soulagent les zones dorsales tout en gardant un accueil confortable.',
  'Latex': 'Le latex épouse les épaules et le bassin : aucun point de pression, même sur le côté.',
  'Mousse HR': 'La mousse HR offre un soutien régulier et durable, avec un excellent rapport qualité-prix.'
};
let qs = 0, ans = {};

function swap() {
  const b = $('#quizBox');
  b.classList.remove('swap');
  void b.offsetWidth;
  b.classList.add('swap');
}

function renderQuiz() {
  if (qs >= QUIZ.length) return showResult();
  const Q = QUIZ[qs];
  $('#quizBox').innerHTML = `<div class="progress"><i style="width:${qs / QUIZ.length * 100}%"></i></div>
    <p class="step">Question ${qs + 1} sur ${QUIZ.length}</p>
    <h2>${Q.q}</h2>
    <div class="opts">${Q.o.map(([v, l]) => `<button class="opt" data-k="${Q.k}" data-v="${v}">${l}</button>`).join('')}</div>
    ${qs ? '<button class="link" id="qBack">← Question précédente</button>' : ''}`;
  swap();
}

function showResult() {
  $('#quizBox').innerHTML = '<div class="loader"><span></span><p>Analyse de votre profil de sommeil…</p></div>';
  swap();
  setTimeout(() => {
    const score = +ans.feel + { cote: -.5, ventre: .5, dos: 0, mixte: 0 }[ans.pos] + { oui: .75, parfois: .25, non: 0 }[ans.dos];
    const firm = ['Souple', 'Équilibré', 'Ferme'][Math.min(2, Math.max(0, Math.round(score)))];
    const pref = ans.dos === 'oui' ? 'Hybride' : ans.pos === 'cote' ? 'Latex' : 'Mousse HR';
    const pool = PRODUCTS.filter(p => p.tech !== 'Sommier' && p.firm === firm);
    const p = pool.find(x => x.tech === pref) || pool[0];
    $('#quizBox').innerHTML = `<div class="result">
      <img src="${pic(p.pic)}" alt="${p.name}">
      <div>
        <span class="match">Compatibilité ${p.tech === pref ? 97 : 92} %</span>
        <h2>${p.name}</h2>
        <p>Soutien ${firm.toLowerCase()} recommandé. ${WHY[p.tech]}</p>
        <div class="price"><strong>${eur(p.price)}</strong><del>${eur(p.old)}</del></div>
        <div class="actions">
          <button class="btn btn-primary" data-add="${p.id}">Ajouter au panier</button>
          <button class="btn btn-line" data-view="${p.id}">Voir le produit</button>
        </div>
        <button class="link" id="qRestart">Refaire le test</button>
      </div></div>`;
    swap();
  }, 1400);
}

/* ---------- Navigation (routage par #hash) ---------- */
const VIEWS = ['accueil', 'catalogue', 'technologies', 'quiz', 'contact'];
function route() {
  const cur = location.hash.slice(1) || 'accueil';
  let v = cur;
  if (cur === 'catalogue' || cur === 'sommiers') {
    f.firm = 'Tous';
    f.tech = cur === 'sommiers' ? 'Sommier' : 'Tous';
    v = 'catalogue';
    renderCatalogue();
  }
  if (!VIEWS.includes(v)) v = 'accueil';
  $$('.view').forEach(s => s.classList.toggle('active', s.id === v));
  $$('#nav a').forEach(a => a.classList.toggle('active', a.hash === '#' + cur));
  $('#nav').classList.remove('open');
  $('#burger').setAttribute('aria-expanded', 'false');
  scrollTo({ top: 0, behavior: 'instant' });
}
addEventListener('hashchange', route);

/* ---------- Événements ---------- */
document.addEventListener('click', e => {
  const c = s => e.target.closest(s);
  let el;
  if (e.target.id === 'modal') return e.target.close();
  if ((el = c('.chip'))) { f[el.dataset.g] = el.dataset.v; return renderCatalogue(); }
  if ((el = c('[data-view]'))) return openProduct(el.dataset.view);
  if ((el = c('[data-add]'))) {
    const size = c('#modal') ? $('#size').value : Object.keys(SIZES)[0];
    addToCart(el.dataset.add, size);
    return $('#modal').open && $('#modal').close();
  }
  if (c('#mClose')) return $('#modal').close();
  if ((el = c('.opt'))) { ans[el.dataset.k] = el.dataset.v; qs++; return renderQuiz(); }
  if (c('#qBack')) { qs--; return renderQuiz(); }
  if (c('#qRestart')) { qs = 0; ans = {}; return renderQuiz(); }
  if ((el = c('[data-q]'))) {
    const k = +el.dataset.q;
    cart[k].qty += +el.dataset.d;
    if (cart[k].qty < 1) cart.splice(k, 1);
    return renderCart();
  }
  if ((el = c('[data-rm]'))) { cart.splice(+el.dataset.rm, 1); return renderCart(); }
  if (c('#cartBtn')) return toggleCart(true);
  if (c('#cartClose') || e.target.id === 'overlay') return toggleCart(false);
  if (c('#checkout')) {
    if (!cart.length) return toast('Votre panier est vide');
    cart = []; renderCart(); toggleCart(false);
    return toast('Merci ! Commande simulée avec succès');
  }
  if (c('#burger')) {
    const open = $('#nav').classList.toggle('open');
    $('#burger').setAttribute('aria-expanded', open);
  }
});
document.addEventListener('keydown', e => { if (e.key === 'Escape') toggleCart(false); });
$('#contactForm').addEventListener('submit', e => {
  e.preventDefault();
  e.target.reset();
  toast('Message envoyé. Nous vous répondons sous 24 h.');
});

/* ---------- Démarrage ---------- */
renderCart();
renderQuiz();
route();
