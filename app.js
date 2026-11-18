const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

// Animate a DOM change with a view transition when the browser supports it
// and the visitor hasn't asked for reduced motion. Otherwise change instantly.
function transition(update) {
  if (document.startViewTransition && !reduceMotion.matches) {
    document.startViewTransition(update);
  } else {
    update();
  }
}

function press(button) {
  $$('button', button.parentElement).forEach((b) => b.setAttribute('aria-pressed', String(b === button)));
}

/* Copy install command ---------------------------------------------------- */
$$('[data-copy]').forEach((button) => {
  button.addEventListener('click', async () => {
    const text = $(button.dataset.copy).textContent.trim();
    const label = $('span', button);
    try {
      await navigator.clipboard.writeText(text);
      label.textContent = 'Copied';
    } catch {
      label.textContent = 'Select and copy';
    }
    window.setTimeout(() => { label.textContent = 'Copy'; }, 1800);
  });
});

/* Hero read card ------------------------------------------------------------ */
const reads = [
  {
    case: 'From case 02, Solace',
    read: 'Reading this as: a one-off transfer for an anxious, occasional sender, with a calm, exact interface, on iOS and Android.',
    thesis: 'One job: send the right amount to the right person. Remembered by a settlement line that never lies.',
    mirror: 'A generic bank would show a success tick after sending. Changed: “sent” and “arrived” are separate, timed states.'
  },
  {
    case: 'From case 05, Trailguard',
    read: 'Reading this as: a live ride log for cyclists glancing at it in sunlight, with a high-contrast, utilitarian interface, on Android first.',
    thesis: 'One job: keep an honest record of the ride. Remembered by a route drawn only where it was measured.',
    mirror: 'A generic fitness app would smooth the route over gaps. Changed: gaps are labelled, never interpolated.'
  },
  {
    case: 'From case 01, Kiln',
    read: 'Reading this as: a members’ utility for a shared ceramics studio, used with clay on their hands, with a calm workshop interface, on iOS, Android, and a wall tablet.',
    thesis: 'One job: know where your piece is. Remembered by the kiln shelf.',
    mirror: 'A generic studio app would lead with a class calendar. Changed: the firing queue comes first.'
  },
  {
    case: 'From case 06, Maison North',
    read: 'Reading this as: an editorial fashion checkout for considered buyers, with a quiet, decisive interface, on phones and tablets, in English, German, and Arabic.',
    thesis: 'One job: confirm where the coat is going. Remembered by its typography, not a coloured button.',
    mirror: 'Already specific to Maison North, so the plan stays as it is.'
  }
];
const readCard = $('[data-read-card]');
const readFigure = readCard.closest('figure');
let readIndex = 0;
let readTimer;

function showRead(index) {
  readIndex = (index + reads.length) % reads.length;
  const data = reads[readIndex];
  const apply = () => {
    Object.entries(data).forEach(([key, value]) => { $(`[data-read="${key}"]`, readFigure).textContent = value; });
    readCard.classList.remove('is-swapping');
  };
  if (reduceMotion.matches) { apply(); return; }
  readCard.classList.add('is-swapping');
  window.setTimeout(apply, 280);
}
function scheduleReads() {
  window.clearInterval(readTimer);
  if (reduceMotion.matches) return;
  readTimer = window.setInterval(() => showRead(readIndex + 1), 7000);
}
$$('[data-read-step]').forEach((button) => button.addEventListener('click', () => {
  showRead(readIndex + Number(button.dataset.readStep));
  scheduleReads();
}));
readFigure.addEventListener('mouseenter', () => window.clearInterval(readTimer));
readFigure.addEventListener('mouseleave', scheduleReads);
readFigure.addEventListener('focusin', () => window.clearInterval(readTimer));
scheduleReads();

/* 01 Kiln — Shape ------------------------------------------------------------ */
const kiln = $('[data-kiln]');
const kilnConfirm = $('[data-kiln-confirm]');
let kilnStep = 0;

function renderKiln() {
  $$('.kiln-qs li', kiln).forEach((item, index) => {
    item.classList.toggle('done', index < kilnStep);
    item.classList.toggle('active', index === kilnStep);
  });
  $$('.brief section', kiln).forEach((section) => {
    section.classList.toggle('filled', Number(section.dataset.fill) < kilnStep);
  });
  const complete = kilnStep >= 3;
  kilnConfirm.disabled = complete;
  kilnConfirm.textContent = complete ? 'Brief confirmed' : `Confirm answer ${kilnStep + 1}`;
  const status = $('[data-kiln-status]', kiln);
  status.textContent = complete ? 'Confirmed' : 'Draft';
  status.classList.toggle('confirmed', complete);
  const foot = $('[data-kiln-foot]', kiln);
  foot.textContent = complete
    ? 'Shape stops here. The next step is Design mode, working from this brief.'
    : `${3 - kilnStep} of 3 answers left to confirm.`;
  foot.classList.toggle('done', complete);
}
kilnConfirm.addEventListener('click', () => { kilnStep = Math.min(3, kilnStep + 1); renderKiln(); });
$('[data-kiln-reset]').addEventListener('click', () => { kilnStep = 0; renderKiln(); });
renderKiln();

/* 02 Solace — Design --------------------------------------------------------- */
const solace = $('[data-solace]');
const solaceCta = $('[data-solace-cta]');
const solaceSecondary = $('[data-solace-secondary]');
const solaceArrive = $('[data-solace-arrive]');
const solaceCopy = {
  review: {
    title: 'Review transfer', status: 'You’re about to send', t1: 'With Face ID', t2: 'Straight after you approve',
    t3: 'Usually within 2 hours', note: 'Transfers can’t be cancelled once they leave your account. Check it’s Maya.',
    cta: 'Send £420.00', done: [], active: null, rail: 'review'
  },
  auth: {
    title: 'Review transfer', status: 'You’re about to send', t1: 'With Face ID', t2: 'Straight after you approve',
    t3: 'Usually within 2 hours', note: 'Transfers can’t be cancelled once they leave your account. Check it’s Maya.',
    cta: 'Send £420.00', done: [], active: 'approve', rail: 'review', busy: true
  },
  sending: {
    title: 'Sending', status: 'Sending to Maya', t1: 'Approved at 13:02', t2: 'Leaving your account now',
    t3: 'Usually within 2 hours', note: 'You can leave this screen. We’ll notify you when it has been sent.',
    cta: 'Sending…', done: ['approve'], active: 'send', rail: 'sending', busy: true
  },
  sent: {
    title: 'Transfer sent', status: 'Sent. It has left your account.', t1: 'Approved at 13:02', t2: 'Sent at 13:02',
    t3: 'Expected by 15:02. We’ll tell you when it lands.', note: 'If it hasn’t arrived by 15:02, we’ll chase Maya’s bank for you.',
    cta: 'Done', done: ['approve', 'send'], active: null, rail: 'sent'
  },
  arrived: {
    title: 'Arrived', status: 'Maya’s bank confirmed it arrived.', t1: 'Approved at 13:02', t2: 'Sent at 13:02',
    t3: 'Arrived at 13:19', note: 'Receipt saved to your transfers.',
    cta: 'Done', done: ['approve', 'send', 'arrive'], active: null, rail: 'arrived'
  }
};
let solaceTimers = [];

function setSolace(state) {
  const copy = solaceCopy[state];
  solace.dataset.state = state;
  ['title', 'status', 't1', 't2', 't3', 'note', 'cta'].forEach((key) => { $(`[data-sl="${key}"]`, solace).textContent = copy[key]; });
  $$('.settle li', solace).forEach((li) => {
    li.classList.toggle('done', copy.done.includes(li.dataset.step));
    li.classList.toggle('active', copy.active === li.dataset.step && state !== 'auth');
  });
  solaceCta.disabled = Boolean(copy.busy);
  solaceSecondary.hidden = !(state === 'sent' || state === 'arrived');
  solaceArrive.disabled = state !== 'sent';
  $$('[data-rail]').forEach((chip) => chip.classList.toggle('on', chip.dataset.rail === copy.rail));
}
function resetSolace() {
  solaceTimers.forEach(window.clearTimeout);
  solaceTimers = [];
  transition(() => setSolace('review'));
}
solaceCta.addEventListener('click', () => {
  const state = solace.dataset.state;
  if (state === 'sent' || state === 'arrived') { resetSolace(); return; }
  if (state !== 'review') return;
  setSolace('auth');
  solaceTimers.push(window.setTimeout(() => transition(() => setSolace('sending')), 1100));
  solaceTimers.push(window.setTimeout(() => transition(() => setSolace('sent')), 2900));
});
solaceArrive.addEventListener('click', () => transition(() => setSolace('arrived')));
$('[data-solace-reset]').addEventListener('click', resetSolace);
$$('[data-solace-theme]').forEach((button) => button.addEventListener('click', () => {
  press(button);
  transition(() => { solace.dataset.theme = button.dataset.solaceTheme; });
}));
setSolace('review');

/* 03 Relay — Critique --------------------------------------------------------- */
const relay = $('[data-relay]');
function selectFinding(id) {
  $$('[data-finding]', relay).forEach((b) => b.classList.toggle('on', b.dataset.finding === id));
  $$('.pin', relay).forEach((p) => p.classList.toggle('on', p.dataset.pin === id));
}
$$('[data-finding]', relay).forEach((button) => {
  button.addEventListener('click', () => selectFinding(button.dataset.finding));
  button.addEventListener('mouseenter', () => selectFinding(button.dataset.finding));
});
$$('[data-relay-view]').forEach((button) => button.addEventListener('click', () => {
  press(button);
  const after = button.dataset.relayView === 'after';
  transition(() => {
    relay.dataset.view = after ? 'after' : 'before';
    $('[data-relay-screen="before"]', relay).hidden = after;
    $('[data-relay-screen="after"]', relay).hidden = !after;
    $('[data-relay-findings]', relay).hidden = after;
    $('[data-relay-resolved]', relay).hidden = !after;
    $('[data-relay-title]', relay).textContent = after ? 'What changed' : '6 findings';
    $('[data-relay-sub]', relay).textContent = after ? 'Same content, rebuilt' : 'Tap one to locate it';
  });
}));

/* 04 Levain — Refine ---------------------------------------------------------- */
const levain = $('[data-levain-screen]');
const levainNotes = {
  original: {
    kicker: 'Shipped version',
    note: 'A gradient header, a streak badge, a tips card, a floating button and a bottom button for the same job, and seven type sizes. Nothing is wrong enough to block; everything competes.',
    list: ['The signature is there, but small', 'Three buttons for one job', 'Accent colour on six different things']
  },
  quieter: {
    kicker: 'Quieter',
    note: 'Removed the gradient, the streak badge, the tip, and the floating button. The accent now marks only the next action. Seven type sizes became four.',
    list: ['Kept the rise curve and the Fraunces title', 'Boxes replaced by spacing and rules', 'One primary action']
  },
  bolder: {
    kicker: 'Bolder',
    note: 'Found the signature, the rise of the dough, and gave it the screen: a committed wheat field, the percentage set large in Fraunces, the curve full width.',
    list: ['One bold move; everything else stays quiet', 'Controls stay standard iOS', 'Ink on wheat reads at 10:1']
  },
  distill: {
    kicker: 'Distill',
    note: 'One job while the dough rises: the next fold. The curve, the timeline, and the tip moved behind All steps. Three buttons for one job became one.',
    list: ['One decision on screen', 'A large target for floury hands', 'Everything else is one tap away']
  }
};
$$('[data-levain]').forEach((button) => button.addEventListener('click', () => {
  press(button);
  const variant = button.dataset.levain;
  const note = levainNotes[variant];
  transition(() => {
    levain.dataset.variant = variant;
    $('[data-levain-kicker]').textContent = note.kicker;
    $('[data-levain-note]').textContent = note.note;
    $('[data-levain-list]').innerHTML = note.list.map((item) => `<li>${item}</li>`).join('');
  });
}));

/* 05 Trailguard — Harden ------------------------------------------------------- */
const trail = $('[data-trail-screen]');
const tr = (key) => $(`[data-tr="${key}"]`, trail);
const trailStates = {
  ok: {
    chip: ['i-pin', 'GPS good'], banner: null, km: '24.6', speed: '21.4', speedLabel: 'km/h now',
    sync: ['i-check', 'Saved on this phone and synced'], rec: 'Recording since 10:20', gap: ''
  },
  offline: {
    chip: ['i-pin', 'GPS good, map not loaded'],
    banner: { tone: 'info', icon: 'i-wifi-off', title: 'No signal', text: 'Still recording. Your ride is saved on this phone and uploads when you’re back online.', action: '' },
    km: '24.6', speed: '21.4', speedLabel: 'km/h now', sync: ['i-wifi-off', 'Saved on this phone, 214 points to upload'],
    rec: 'Recording since 10:20', gap: '', weakSignal: true
  },
  nolocation: {
    chip: ['i-pin-off', 'No location'],
    banner: { tone: 'warn', icon: 'i-pin-off', title: 'Location is off', text: 'The route stopped at 10:52. Time is still recording; distance resumes when location is back.', action: 'Turn on location' },
    km: '18.2', speed: '–', speedLabel: 'km/h', sync: ['i-check', 'Saved on this phone and synced'],
    rec: 'Recording time only', gap: 'Location off since 10:52'
  },
  battery: {
    chip: ['i-pin', 'Route point every 30 s'],
    banner: { tone: 'warn', icon: 'i-battery', title: 'Battery at 8%', text: 'Route points every 30 s instead of 5 s, so recording lasts about 40 more minutes.', action: 'Keep every 5 s' },
    km: '24.6', speed: '21.4', speedLabel: 'km/h now', sync: ['i-check', 'Saved on this phone and synced'],
    rec: 'Recording since 10:20', gap: '', lowBattery: true
  },
  killed: {
    chip: ['i-pin', 'GPS good'],
    banner: { tone: 'info', icon: 'i-restore', title: 'Ride resumed at 10:55', text: 'Android closed Trailguard for 3 minutes. Your time kept counting; that stretch has no route.', action: 'Review the gap' },
    km: '24.6', speed: '21.4', speedLabel: 'km/h now', sync: ['i-check', 'Saved on this phone and synced'],
    rec: 'Recording since 10:20', gap: 'No route for 3 min'
  }
};
function setTrail(state) {
  const s = trailStates[state];
  trail.dataset.state = state;
  $('use', tr('chip')).setAttribute('href', `#${s.chip[0]}`);
  $('span', tr('chip')).textContent = s.chip[1];
  const banner = tr('banner');
  banner.hidden = !s.banner;
  if (s.banner) {
    banner.className = `tg-banner ${s.banner.tone}`;
    $('.tg-banner-icon use', banner).setAttribute('href', `#${s.banner.icon}`);
    tr('btitle').textContent = s.banner.title;
    tr('btext').textContent = s.banner.text;
    tr('baction').textContent = s.banner.action;
  }
  tr('km').textContent = s.km;
  tr('speed').textContent = s.speed;
  tr('speedlabel').textContent = s.speedLabel;
  $('use', tr('sync')).setAttribute('href', `#${s.sync[0]}`);
  $('span', tr('sync')).textContent = s.sync[1];
  tr('rec').textContent = s.rec;
  tr('gaplabel').textContent = s.gap;
  tr('sig').style.opacity = s.weakSignal ? '.3' : '1';
  $('use', tr('batt')).setAttribute('href', s.lowBattery ? '#s-battery-low' : '#s-battery');
}
$$('[data-trail]').forEach((button) => button.addEventListener('click', () => {
  press(button);
  transition(() => setTrail(button.dataset.trail));
}));

/* 06 Maison North — Adapt --------------------------------------------------------- */
const maison = $('[data-mn]');
const maisonDevice = $('[data-mn-device]');
const maisonFit = $('.mn-fit');
const maisonText = {
  en: {
    locale: 'en-GB', currency: 'GBP', item: 320, express: 12, dir: 'ltr',
    back: 'Bag', title: 'Delivery', step: 'Step 2 of 3', p1: 'Bag', p2: 'Delivery', p3: 'Payment',
    section: 'Delivery address', name: 'Full name', address: 'Address', city: 'City', postcode: 'Postcode',
    speed: 'Delivery speed', std: 'Standard', stdTime: '2–4 working days', free: 'Free', exp: 'Express', expTime: 'Next working day',
    product: 'Wool wrap coat', variant: 'Size M, oat', total: 'Total', cta: 'Continue to payment',
    values: { name: 'Maya Thompson', address: '17 Chapel Lane', city: 'London', postcode: 'N1 8QZ' }
  },
  de: {
    locale: 'de-DE', currency: 'EUR', item: 375, express: 14, dir: 'ltr',
    back: 'Warenkorb', title: 'Lieferung', step: 'Schritt 2 von 3', p1: 'Warenkorb', p2: 'Lieferung', p3: 'Zahlung',
    section: 'Lieferadresse', name: 'Vollständiger Name', address: 'Straße und Hausnummer', city: 'Stadt', postcode: 'Postleitzahl',
    speed: 'Versandgeschwindigkeit', std: 'Standardversand', stdTime: '2–4 Werktage', free: 'Kostenlos', exp: 'Expressversand', expTime: 'Nächster Werktag',
    product: 'Wickelmantel aus Schurwolle', variant: 'Größe M, Haferbeige', total: 'Gesamtsumme', cta: 'Weiter zur Zahlungsmethode',
    values: { name: 'Lena Hoffmann', address: 'Schönhauser Allee 148', city: 'Berlin', postcode: '10435' }
  },
  ar: {
    locale: 'ar-SA-u-nu-arab', currency: 'SAR', item: 1520, express: 55, dir: 'rtl',
    back: 'الحقيبة', title: 'التوصيل', step: 'الخطوة ٢ من ٣', p1: 'الحقيبة', p2: 'التوصيل', p3: 'الدفع',
    section: 'عنوان التوصيل', name: 'الاسم الكامل', address: 'العنوان', city: 'المدينة', postcode: 'الرمز البريدي',
    speed: 'سرعة التوصيل', std: 'شحن عادي', stdTime: 'من ٢ إلى ٤ أيام عمل', free: 'مجاني', exp: 'شحن سريع', expTime: 'يوم العمل التالي',
    product: 'معطف صوف ملفوف', variant: 'المقاس M، لون الشوفان', total: 'الإجمالي', cta: 'المتابعة إلى الدفع',
    values: { name: 'ريم الحربي', address: 'شارع الأمير سلطان ٢٤', city: 'جدة', postcode: '٢٣٤٢٣' }
  }
};
function setMaisonLanguage(lang) {
  const t = maisonText[lang];
  const money = new Intl.NumberFormat(t.locale, { style: 'currency', currency: t.currency });
  maison.lang = lang;
  maison.dir = t.dir;
  $$('[data-t]', maison).forEach((el) => { el.textContent = t[el.dataset.t]; });
  $$('[data-v]', maison).forEach((input) => { input.value = t.values[input.dataset.v]; });
  $$('[data-price="item"], [data-price="total"]', maison).forEach((el) => { el.textContent = money.format(t.item); });
  $('[data-price="express"]', maison).textContent = money.format(t.express);
}
function fitMaison() {
  const width = maisonDevice.classList.contains('tablet') ? 660 : 312;
  const available = maisonFit.clientWidth;
  const scale = Math.min(1, available / width);
  maisonDevice.style.zoom = scale < 1 ? String(Math.floor(scale * 100) / 100) : '';
}
$$('[data-mn-platform]').forEach((button) => button.addEventListener('click', () => {
  press(button);
  transition(() => {
    const android = button.dataset.mnPlatform === 'android';
    maisonDevice.classList.toggle('android', android);
    maisonDevice.classList.toggle('ios', !android);
  });
}));
$$('[data-mn-lang]').forEach((button) => button.addEventListener('click', () => {
  press(button);
  transition(() => setMaisonLanguage(button.dataset.mnLang));
}));
$$('[data-mn-size]').forEach((button) => button.addEventListener('click', () => {
  press(button);
  transition(() => {
    maisonDevice.classList.toggle('tablet', button.dataset.mnSize === 'tablet');
    fitMaison();
  });
}));
new ResizeObserver(fitMaison).observe(maisonFit);
setMaisonLanguage('en');
