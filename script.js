// Mobile menu
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');
navToggle.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', open);
});
navLinks.addEventListener('click', (e) => {
  if (e.target.tagName === 'A') navLinks.classList.remove('open');
});

// Price tabs
const tabs = document.querySelectorAll('.tab');
function showTab(name) {
  tabs.forEach((t) => {
    const active = t.dataset.tab === name;
    t.classList.toggle('active', active);
    t.setAttribute('aria-selected', active);
  });
  document.querySelectorAll('.tab-panel').forEach((p) => {
    p.hidden = p.id !== name;
    p.classList.toggle('active', p.id === name);
  });
}
tabs.forEach((t) => t.addEventListener('click', () => showTab(t.dataset.tab)));

// Hero cards link to a tab
document.querySelectorAll('.hero-card').forEach((card) => {
  card.addEventListener('click', (e) => {
    e.preventDefault();
    showTab(card.getAttribute('href').slice(1));
    document.getElementById('prices').scrollIntoView();
  });
});

// Estimator — per linear foot rates [low, high], CAD
const RATES = {
  interior: [90, 160],
  exterior: [180, 320],
  french: [50, 120],
  sewer: [200, 450],
  none: [0, 0],
};
const CRACK = [600, 1200];

const form = document.getElementById('est-form');
const typeEl = document.getElementById('est-type');
const lenEl = document.getElementById('est-len');
const lenOut = document.getElementById('est-len-out');
const accessEl = document.getElementById('est-access');
const cracksEl = document.getElementById('est-cracks');
const rangeEl = document.getElementById('est-range');
const rebateEl = document.getElementById('est-rebate');

const money = (n) => '$' + (Math.round(n / 100) * 100).toLocaleString('en-CA');

function estimate() {
  const [rLow, rHigh] = RATES[typeEl.value];
  const len = Number(lenEl.value);
  const access = Number(accessEl.value);
  lenOut.textContent = len;
  lenEl.disabled = typeEl.value === 'none';

  let low = rLow * len * access;
  let high = rHigh * len * access;

  let rebateItem = false;
  form.querySelectorAll('.check input:checked').forEach((cb) => {
    low += Number(cb.dataset.low);
    high += Number(cb.dataset.high);
    if (/sump|backwater/i.test(cb.parentElement.textContent)) rebateItem = true;
  });

  const cracks = Math.max(0, Math.min(20, Number(cracksEl.value) || 0));
  low += cracks * CRACK[0];
  high += cracks * CRACK[1];

  rangeEl.textContent = high === 0 ? '$0' : `${money(low)} – ${money(high)}`;
  rebateEl.hidden = !(rebateItem || typeEl.value === 'sewer');
}
form.addEventListener('input', estimate);
form.addEventListener('submit', (e) => e.preventDefault());
estimate();

// Gallery filter
const figures = document.querySelectorAll('.gallery figure');
document.querySelectorAll('.filter').forEach((btn) => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter').forEach((b) => b.classList.toggle('active', b === btn));
    figures.forEach((f) => {
      f.hidden = btn.dataset.filter !== 'all' && f.dataset.cat !== btn.dataset.filter;
    });
  });
});

// Lightbox
const lightbox = document.getElementById('lightbox');
const lbImg = lightbox.querySelector('img');
const lbCaption = lightbox.querySelector('.lightbox-caption');
figures.forEach((f) => {
  f.addEventListener('click', () => {
    const img = f.querySelector('img');
    lbImg.src = img.src;
    lbImg.alt = img.alt;
    lbCaption.textContent = f.querySelector('figcaption').innerText.replace('\n', ' — ');
    lightbox.hidden = false;
  });
});
const closeLightbox = () => { lightbox.hidden = true; };
lightbox.addEventListener('click', (e) => { if (e.target !== lbImg) closeLightbox(); });
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeLightbox(); });

// Contact form (static site: show confirmation only)
const contactForm = document.getElementById('contact-form');
contactForm.addEventListener('submit', (e) => {
  e.preventDefault();
  document.getElementById('form-msg').hidden = false;
  contactForm.reset();
});

document.getElementById('year').textContent = new Date().getFullYear();
