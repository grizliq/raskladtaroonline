/* ============================================================
   Таро — лендинг. Рубашка карты, демо расклада, шапка.
   ============================================================ */
(function () {
  'use strict';

  /* ----------------------------------------------------------
     Лицевые стороны — настоящая колода Райдера-Уэйта 1909 года,
     общественное достояние (Памела Колман Смит умерла в 1951-м).
     Лежат картинками в img/cards.

     Рубашка рисуется SVG: это узор, а не иллюстрация, и в виде
     кода он весит меньше килобайта вместо полусотни.
     ---------------------------------------------------------- */
  function backSvg() {
    return '<svg viewBox="0 0 340 585" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
      '<defs>' +
      '<linearGradient id="tb" x1="0" y1="0" x2="1" y2="1">' +
      '<stop offset="0" stop-color="#2d2070"/><stop offset="1" stop-color="#160e3c"/>' +
      '</linearGradient>' +
      '<pattern id="tp" width="40" height="40" patternUnits="userSpaceOnUse">' +
      '<path d="M20 7l3.4 9.6L33 20l-9.6 3.4L20 33l-3.4-9.6L7 20l9.6-3.4z" fill="rgba(185,169,255,.22)"/>' +
      '</pattern>' +
      '</defs>' +
      '<rect width="340" height="585" fill="url(#tb)"/>' +
      '<rect x="14" y="14" width="312" height="557" rx="8" fill="url(#tp)" ' +
      'stroke="rgba(229,189,104,.55)" stroke-width="2"/>' +
      '<circle cx="170" cy="292" r="74" fill="none" stroke="rgba(229,189,104,.8)" stroke-width="3"/>' +
      '<circle cx="170" cy="292" r="58" fill="none" stroke="rgba(229,189,104,.38)" stroke-width="2" stroke-dasharray="5 8"/>' +
      '<path d="M170 240l11 34 34 11-34 11-11 34-11-34-34-11 34-11z" fill="#e5bd68"/>' +
      '</svg>';
  }

  function paintBacks() {
    var backs = document.querySelectorAll('.tcard--back');
    [].forEach.call(backs, function (el) { el.innerHTML = backSvg(); });
  }

  /* ----------------------------------------------------------
     Демо расклада.
     Состояние держим классом is-dealt на контейнере, а не
     переменной в замыкании: иначе оно расходится с DOM, если
     переворот прервать на середине.
     ---------------------------------------------------------- */
  function initDeal() {
    var box = document.getElementById('demoDeal');
    if (!box) return;

    var btn = box.querySelector('[data-role="run"]');
    var label = box.querySelector('[data-role="run-label"]');
    if (!btn || !label) return;

    btn.addEventListener('click', function () {
      var dealt = box.classList.toggle('is-dealt');
      label.textContent = dealt ? 'Собрать заново' : 'Сделать расклад';
      btn.setAttribute('aria-pressed', dealt ? 'true' : 'false');
    });

    btn.setAttribute('aria-pressed', 'false');
  }

  /* ----------------------------------------------------------
     Шапка: тень появляется, когда страница ушла вверх
     ---------------------------------------------------------- */
  function initNav() {
    var nav = document.querySelector('.nav');
    if (!nav) return;
    var ticking = false;
    function upd() {
      nav.classList.toggle('is-stuck', window.scrollY > 12);
      ticking = false;
    }
    window.addEventListener('scroll', function () {
      if (!ticking) { ticking = true; requestAnimationFrame(upd); }
    }, { passive: true });
    upd();
  }

  function boot() { paintBacks(); initDeal(); initNav(); }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();