const byData = (value) => document.querySelector(`[data-demo="${value}"]`);

const financeButton = document.querySelector('[data-action="finance"]');
const financeDemo = byData('finance');
let financeState = 'review';

function showFinanceSuccess() {
  financeState = 'success';
  financeDemo.querySelector('.finance-pending').hidden = true;
  financeDemo.querySelector('.finance-success').hidden = false;
  financeButton.hidden = true;
  financeDemo.querySelector('[data-label="finance"]').textContent = 'Receipt available';
}

financeButton.addEventListener('click', () => {
  const review = financeDemo.querySelector('.finance-review');
  const pending = financeDemo.querySelector('.finance-pending');
  const success = financeDemo.querySelector('.finance-success');
  const label = financeDemo.querySelector('[data-label="finance"]');

  if (financeState === 'review') {
    financeState = 'pending';
    review.hidden = true;
    pending.hidden = false;
    financeButton.disabled = true;
    financeButton.textContent = 'Sending…';
    label.textContent = 'Confirming transfer status';
    window.setTimeout(showFinanceSuccess, 900);
    return;
  }

  showFinanceSuccess();
});

const trailDemo = byData('trail');
const trailNetwork = document.querySelector('[data-action="trail-network"]');
trailNetwork.addEventListener('click', () => {
  const offline = trailDemo.classList.toggle('is-offline');
  trailNetwork.textContent = offline ? 'Go online' : 'Go offline';
  trailDemo.querySelector('[data-label="trail-gps"]').textContent = offline ? 'Weak' : 'Strong';
  trailDemo.querySelector('[data-label="trail-sync"]').textContent = offline
    ? 'Saved on this device · Sync paused'
    : 'Saved on this device · Syncing when online';
});

const checkoutDemo = byData('checkout');
const checkoutLabels = {
  en: {
    title: 'Delivery details', name: 'Full name', address: 'Address', city: 'City', postcode: 'Postcode',
    product: 'Wool wrap coat', delivery: 'Standard delivery · 2–4 days', price: '$320.00',
    continue: 'Continue to payment', total: 'Total $320.00', direction: 'ltr', nameValue: 'Maya Thompson',
    addressValue: '17 Chapel Lane', cityValue: 'London', postcodeValue: 'N1 8QZ'
  },
  ar: {
    title: 'تفاصيل التوصيل', name: 'الاسم الكامل', address: 'العنوان', city: 'المدينة', postcode: 'الرمز البريدي',
    product: 'معطف صوف ملفوف', delivery: 'توصيل عادي · ٢–٤ أيام', price: '١٬٢٠٠ ر.س',
    continue: 'المتابعة إلى الدفع', total: 'الإجمالي ١٬٢٠٠ ر.س', direction: 'rtl', nameValue: 'مايا طومسون',
    addressValue: '١٧ تشابل لين', cityValue: 'لندن', postcodeValue: 'N1 8QZ'
  }
};

function setCheckoutLanguage(language) {
  const labels = checkoutLabels[language];
  checkoutDemo.dir = labels.direction;
  checkoutDemo.lang = language === 'ar' ? 'ar' : 'en';
  Object.entries(labels).forEach(([key, value]) => {
    const target = checkoutDemo.querySelector(`[data-label="checkout-${key}"]`);
    if (target) target.textContent = value;
  });
  const inputs = checkoutDemo.querySelectorAll('input');
  [labels.nameValue, labels.addressValue, labels.cityValue, labels.postcodeValue].forEach((value, index) => { inputs[index].value = value; });
  document.querySelectorAll('[data-action^="checkout-"]').forEach((button) => button.classList.remove('active'));
  document.querySelector(`[data-action="checkout-${language}"]`).classList.add('active');
}

document.querySelector('[data-action="checkout-en"]').addEventListener('click', () => setCheckoutLanguage('en'));
document.querySelector('[data-action="checkout-ar"]').addEventListener('click', () => setCheckoutLanguage('ar'));
document.querySelector('[data-action="checkout-wide"]').addEventListener('click', (event) => {
  checkoutDemo.classList.toggle('is-wide');
  event.currentTarget.classList.toggle('active');
});

const auditDemo = byData('audit');
const auditFindings = document.querySelector('[data-label="audit-findings"]');
function setAuditState(state) {
  const after = state === 'after';
  auditDemo.querySelector('.audit-before-screen').hidden = after;
  auditDemo.querySelector('.audit-after-screen').hidden = !after;
  document.querySelector('[data-action="audit-before"]').classList.toggle('active', !after);
  document.querySelector('[data-action="audit-after"]').classList.toggle('active', after);
  document.querySelector('[data-action="audit-before"]').setAttribute('aria-selected', String(!after));
  document.querySelector('[data-action="audit-after"]').setAttribute('aria-selected', String(after));
  auditFindings.innerHTML = after
    ? '<span>Resolved</span> Visible row actions and 48dp targets<br /><span>Resolved</span> Priority and task state scan cleanly<br /><span>Resolved</span> Closed-ticket management replaces destructive swipe'
    : '<span>P1 · MD-001</span> Delete has no visible alternative<br /><span>P1 · MD-004</span> Icon targets are too small<br /><span>P2 · MD-008</span> Priority is not scannable';
}
document.querySelector('[data-action="audit-before"]').addEventListener('click', () => setAuditState('before'));
document.querySelector('[data-action="audit-after"]').addEventListener('click', () => setAuditState('after'));
