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
    if (pay) { e.preventDefault(); location.href = '/checkout'; }
  });
})();
