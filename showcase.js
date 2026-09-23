// Static stand-in for CartTrigger's scroll logic: undock the "My vacation" pill
// once the header scrolls away (same 160px threshold as the React component).
(function () {
  var pill = document.querySelector('.concept-cart-trigger:not(.concept-cart-trigger--placeholder)');
  if (!pill) return;
  var ph = document.createElement('span');
  ph.className = 'concept-cart-trigger concept-cart-trigger--placeholder';
  ph.setAttribute('aria-hidden', 'true');
  ph.innerHTML = pill.innerHTML;
  ph.style.display = 'none';
  pill.parentNode.insertBefore(ph, pill);
  var floating = null;
  function update() {
    var f = window.scrollY > 160;
    if (f === floating) return;
    floating = f;
    pill.classList.toggle('is-floating', f);
    ph.style.display = f ? '' : 'none';
  }
  window.addEventListener('scroll', update, { passive: true });
  update();
})();

// Static wiring for the flows the React app drives at runtime:
// the cart pill opens the populated cart page, and the cart's checkout button
// goes to the checkout page.
(function () {
  var here = location.pathname.replace(/\.html$/, '').replace(/\/$/, '') || '/';
  document.addEventListener('click', function (e) {
    var pill = e.target.closest && e.target.closest('.concept-cart-trigger:not(.concept-cart-trigger--placeholder)');
    if (pill && here !== '/cart') { e.preventDefault(); location.href = '/cart'; return; }
    var pay = e.target.closest && e.target.closest('.move-to-checkout');
    if (pay) { e.preventDefault(); location.href = '/checkout'; return; }
    // checkout's final CTA lands on the order page, as it does after payment
    var submit = e.target.closest && e.target.closest('#checkout .submit-wrapper button');
    if (submit) { e.preventDefault(); location.href = '/manage'; }
  });
})();

// The itinerary cards open a detail modal in the app; the snapshot ships one
// captured modal per card, so the static page can do the same.
(function () {
  var store = document.getElementById('itinerary-modal-store');
  if (!store) return;
  var cards = document.querySelectorAll('.itinerary-card');
  var open = null;
  function close() {
    if (!open) return;
    open.remove();
    open = null;
    document.body.style.overflow = '';
  }
  cards.forEach(function (card, i) {
    card.addEventListener('click', function () {
      var tpl = store.querySelector('template[data-stop="' + i + '"]');
      if (!tpl || !tpl.innerHTML.trim()) return;
      close();
      open = document.createElement('div');
      open.innerHTML = tpl.innerHTML;
      open = open.firstElementChild;
      document.body.appendChild(open);
      document.body.style.overflow = 'hidden';
      open.addEventListener('click', function (e) {
        if (e.target.closest('.ant-modal-close') || e.target.classList.contains('ant-modal-wrap')) close();
      });
    });
  });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });
  // the journey bar scrolls the strip to the matching card
  document.querySelectorAll('.itinerary-journey__step').forEach(function (step, i) {
    step.addEventListener('click', function () {
      document.querySelectorAll('.itinerary-journey__step').forEach(function (s) { s.classList.remove('is-active'); });
      step.classList.add('is-active');
      cards.forEach(function (c) { c.classList.remove('is-active'); });
      if (cards[i]) {
        cards[i].classList.add('is-active');
        cards[i].scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
      }
    });
  });
  document.querySelectorAll('.itinerary-strip__nav').forEach(function (nav) {
    nav.addEventListener('click', function () {
      var track = document.querySelector('.itinerary-strip__track');
      if (track) track.scrollBy({ left: (nav.classList.contains('is-next') ? 1 : -1) * track.clientWidth * 0.8, behavior: 'smooth' });
    });
  });
})();

// The snapshot froze checkout's submit button in its disabled state (the terms
// box was unticked); enable it so the static flow can reach the order page.
(function () {
  var submit = document.querySelector('#checkout .submit-wrapper button');
  if (submit) submit.removeAttribute('disabled');
})();
