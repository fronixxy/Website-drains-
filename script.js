// Mobile menu
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.getElementById('nav-links');
navToggle.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', open);
});
navLinks.addEventListener('click', (e) => {
  if (e.target.tagName === 'A') {
    navLinks.classList.remove('open');
    navToggle.setAttribute('aria-expanded', false);
  }
});

// Price tabs
const tabs = document.querySelectorAll('.tab');
tabs.forEach((tab) => {
  tab.addEventListener('click', () => {
    tabs.forEach((t) => {
      const active = t === tab;
      t.classList.toggle('active', active);
      t.setAttribute('aria-selected', active);
      document.getElementById(t.getAttribute('aria-controls')).hidden = !active;
    });
  });
});

// Estimator — per linear foot rates [low, high], CAD
const RATES = {
  interior: { label: 'Interior waterproofing', rate: [90, 160] },
  exterior: { label: 'Exterior waterproofing', rate: [180, 320] },
  french: { label: 'French drain', rate: [50, 120] },
  sewer: { label: 'Sewer line replacement', rate: [200, 450] },
  none: { label: '', rate: [0, 0] },
};
const CRACK = [600, 1200];

const form = document.getElementById('est-form');
const typeEl = document.getElementById('est-type');
const lenEl = document.getElementById('est-len');
const lenOut = document.getElementById('est-len-out');
const accessEl = document.getElementById('est-access');
const cracksEl = document.getElementById('est-cracks');
const rangeEl = document.getElementById('est-range');
const linesEl = document.getElementById('est-lines');
const rebateEl = document.getElementById('est-rebate');

const round = (n) => Math.round(n / 100) * 100;
const money = (n) => '$' + round(n).toLocaleString('en-CA');
const span = (lo, hi) => `${money(lo)} – ${money(hi)}`;

function estimate() {
  const job = RATES[typeEl.value];
  const len = Number(lenEl.value);
  const access = Number(accessEl.value);
  lenOut.textContent = len;
  lenEl.disabled = typeEl.value === 'none';
  accessEl.disabled = typeEl.value === 'none';

  const lines = [];
  let low = 0;
  let high = 0;
  const add = (label, lo, hi) => {
    low += lo;
    high += hi;
    lines.push(`<li><span>${label}</span><span>${span(lo, hi)}</span></li>`);
  };

  if (typeEl.value !== 'none') {
    add(`${job.label}, ${len} ft`, job.rate[0] * len * access, job.rate[1] * len * access);
  }

  let rebate = typeEl.value === 'sewer';
  form.querySelectorAll('.check input:checked').forEach((cb) => {
    add(cb.parentElement.textContent.trim(), Number(cb.dataset.low), Number(cb.dataset.high));
    if ('rebate' in cb.dataset) rebate = true;
  });

  const cracks = Math.max(0, Math.min(20, Math.floor(Number(cracksEl.value) || 0)));
  if (cracks) add(`Crack injection × ${cracks}`, cracks * CRACK[0], cracks * CRACK[1]);

  rangeEl.textContent = high === 0 ? '$0' : span(low, high);
  linesEl.innerHTML = lines.length > 1 ? lines.join('') : '';
  rebateEl.hidden = !rebate;
}
form.addEventListener('input', estimate);
form.addEventListener('submit', (e) => e.preventDefault());
estimate();

// Quote form — sends to Formspree (see the form's action attribute)
const quote = document.getElementById('quote');
const quoteOk = quote.querySelector('.form-ok');
const quoteErr = quote.querySelector('.form-error');
quote.addEventListener('submit', async (e) => {
  e.preventDefault();
  if (!quote.checkValidity()) {
    quote.reportValidity();
    return;
  }
  quoteOk.hidden = true;
  quoteErr.hidden = true;
  const button = quote.querySelector('button[type=submit]');
  button.disabled = true;
  try {
    // Demo mode until a real Formspree ID is set
    if (!quote.action.includes('YOUR_FORM_ID')) {
      const res = await fetch(quote.action, {
        method: 'POST',
        body: new FormData(quote),
        headers: { Accept: 'application/json' },
      });
      if (!res.ok) throw new Error(res.status);
    }
    quoteOk.hidden = false;
    quote.reset();
  } catch {
    quoteErr.hidden = false;
  } finally {
    button.disabled = false;
  }
});

document.getElementById('year').textContent = new Date().getFullYear();
