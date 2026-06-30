/* Agência Logue — interações leves do site estático */
(function () {
  // Ano no rodapé
  var yr = document.getElementById('yr');
  if (yr) yr.textContent = new Date().getFullYear();

  // Reveal on scroll
  var els = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e, i) {
        if (e.isIntersecting) {
          var el = e.target;
          // pequeno atraso em cascata por grupo
          var delay = (el.dataset.delay ? +el.dataset.delay : (i % 4) * 70);
          el.style.animationDelay = delay + 'ms';
          el.classList.add('in');
          io.unobserve(el);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    els.forEach(function (el) { io.observe(el); });
  } else {
    els.forEach(function (el) { el.classList.add('in'); });
  }

  // Fecha menu mobile ao clicar num link
  var mnav = document.getElementById('mnav');
  if (mnav) {
    mnav.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () { mnav.classList.remove('open'); });
    });
  }
})();
