// Mobile navigation (burger menu)
(function () {
  var nav = document.querySelector('nav');
  var burger = nav.querySelector('.burger');

  function setOpen(open) {
    nav.classList.toggle('open', open);
    burger.setAttribute('aria-expanded', open);
    burger.setAttribute('aria-label', open ? 'Menü schließen' : 'Menü öffnen');
  }

  burger.addEventListener('click', function () {
    setOpen(!nav.classList.contains('open'));
  });

  nav.querySelectorAll('ul a').forEach(function (link) {
    link.addEventListener('click', function () { setOpen(false); });
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') setOpen(false);
  });
})();
