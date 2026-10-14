/* ============================================================
   Таро — лендинг. Два скрипта: отрисовка карт и демо расклада.
   ============================================================ */
(function () {
  'use strict';

  /* ----------------------------------------------------------
     Карты рисуются SVG по одному шаблону.
     Растровых картинок нет совсем: колода Уэйта 1909 года —
     это чужие изображения, а рисунок в своём стиле ничем
     не ограничен и весит килобайты вместо мегабайт.
     ---------------------------------------------------------- */
  var ART = {
    // Луна: месяц в круге, две башни, капли
    moon:
      '<circle cx="150" cy="150" r="52" fill="#f2d88a"/>' +
      '<path d="M150 104a46 46 0 000 92 38 38 0 010-92z" fill="#fff8e4"/>' +
      '<rect x="36" y="188" width="36" height="104" rx="4" fill="#cdbfa0"/>' +
      '<rect x="228" y="188" width="36" height="104" rx="4" fill="#cdbfa0"/>' +
      '<path d="M54 188l18-26 18 26zM246 188l-18-26-18 26z" fill="#b9a988"/>' +
      '<path d="M112 236q38-22 76 0" stroke="#9c8f74" stroke-width="5" fill="none" stroke-linecap="round"/>' +
      '<circle cx="104" cy="206" r="4" fill="#f2d88a"/><circle cx="150" cy="196" r="4" fill="#f2d88a"/><circle cx="196" cy="206" r="4" fill="#f2d88a"/>',
    // Звезда: большая восьмиконечная звезда и семь малых
    star:
      '<path d="M150 72l12 36 36 12-36 12-12 36-12-36-36-12 36-12z" fill="#f2d88a"/>' +
      '<g fill="#e8cd84">' +
      '<path d="M66 102l6 16 16 6-16 6-6 16-6-16-16-6 16-6z"/>' +
      '<path d="M234 102l6 16 16 6-16 6-6 16-6-16-16-6 16-6z"/>' +
      '<path d="M48 176l5 13 13 5-13 5-5 13-5-13-13-5 13-5z"/>' +
      '<path d="M252 176l5 13 13 5-13 5-5 13-5-13-13-5 13-5z"/>' +
      '</g>' +
      '<path d="M40 300q110-46 220 0z" fill="#bcd6d4"/>' +
      '<path d="M96 258q54-20 108 0" stroke="#9fc0bd" stroke-width="6" fill="none" stroke-linecap="round"/>',
    // Солнце: лучи и круг
    sun:
      '<circle cx="150" cy="156" r="58" fill="#f2d88a"/>' +
      '<g stroke="#e8c45e" stroke-width="9" stroke-linecap="round">' +
      '<path d="M150 62v24M150 226v24M56 156h24M220 156h24"/>' +
      '<path d="M84 90l17 17M199 211l17 17M216 90l-17 17M101 211l-17 17"/>' +
      '</g>' +
      '<circle cx="132" cy="148" r="5" fill="#8c7540"/><circle cx="168" cy="148" r="5" fill="#8c7540"/>' +
      '<path d="M130 172q20 14 40 0" stroke="#8c7540" stroke-width="5" fill="none" stroke-linecap="round"/>' +
      '<path d="M36 300q114-40 228 0z" fill="#d9a05a"/>',
    // Верховная жрица: колонны, занавес, полумесяц
    priestess:
      '<rect x="44" y="92" width="34" height="200" rx="4" fill="#2f3b52"/>' +
      '<rect x="222" y="92" width="34" height="200" rx="4" fill="#e6e2d6"/>' +
      '<path d="M94 110h112v182H94z" fill="#9dc6c0"/>' +
      '<circle cx="150" cy="150" r="30" fill="#f4efe0"/>' +
      '<path d="M150 180q30 18 30 54v58h-60v-58q0-36 30-54z" fill="#dfe9ea"/>' +
      '<path d="M122 124a28 28 0 0156 0z" fill="#e8cd84"/>' +
      '<path d="M128 256a46 46 0 0144 0z" fill="#c8d8dc"/>' +
      '<path d="M122 282q14-10 28 0t28 0" stroke="#aebfc6" stroke-width="5" fill="none" stroke-linecap="round"/>',
    // Влюблённые: две фигуры и солнце над ними
    lovers:
      '<circle cx="150" cy="78" r="30" fill="#f2d88a"/>' +
      '<g stroke="#e8c45e" stroke-width="6" stroke-linecap="round">' +
      '<path d="M150 32v14M110 48l9 10M190 48l-9 10"/></g>' +
      '<circle cx="104" cy="168" r="24" fill="#f0d9c0"/>' +
      '<path d="M104 196q24 10 24 44v52H80v-52q0-34 24-44z" fill="#e8c9ad"/>' +
      '<circle cx="196" cy="168" r="24" fill="#f0d9c0"/>' +
      '<path d="M196 196q24 10 24 44v52h-48v-52q0-34 24-44z" fill="#dcbb9c"/>' +
      '<path d="M44 300q46-70 46-118" stroke="#94b07c" stroke-width="7" fill="none" stroke-linecap="round"/>' +
      '<path d="M256 300q-46-70-46-118" stroke="#94b07c" stroke-width="7" fill="none" stroke-linecap="round"/>' +
      '<circle cx="62" cy="206" r="7" fill="#c9553f"/><circle cx="238" cy="206" r="7" fill="#c9553f"/>'
  };

  var FRAME =
    '<rect x="5" y="5" width="290" height="502" rx="10" fill="none" stroke="#2b2318" stroke-width="5"/>' +
    '<rect x="16" y="16" width="268" height="480" rx="6" fill="none" stroke="#b4a687" stroke-width="2"/>';

  function cardSvg(key) {
    var art = ART[key] || ART.star;
    return '<svg viewBox="0 0 300 512" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
      '<rect width="300" height="512" fill="#f4ecd8"/>' +
      '<rect x="28" y="60" width="244" height="300" fill="#dfe8ea"/>' +
      '<g transform="translate(28 60) scale(0.813 1)">' + art + '</g>' +
      '<rect x="28" y="60" width="244" height="300" fill="none" stroke="#2b2318" stroke-width="3"/>' +
      FRAME +
      '</svg>';
  }

  function backSvg() {
    return '<svg viewBox="0 0 300 512" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
      '<defs><pattern id="tp" width="38" height="38" patternUnits="userSpaceOnUse">' +
      '<path d="M19 6l3.4 8.6L31 18l-8.6 3.4L19 30l-3.4-8.6L7 18l8.6-3.4z" fill="rgba(185,169,255,.30)"/>' +
      '</pattern></defs>' +
      '<rect width="300" height="512" fill="#1a1140"/>' +
      '<rect x="14" y="14" width="272" height="484" rx="8" fill="url(#tp)" stroke="rgba(185,169,255,.5)" stroke-width="2"/>' +
      '<circle cx="150" cy="256" r="58" fill="none" stroke="rgba(229,189,104,.75)" stroke-width="3"/>' +
      '<circle cx="150" cy="256" r="44" fill="none" stroke="rgba(229,189,104,.4)" stroke-width="2" stroke-dasharray="4 7"/>' +
      '<path d="M150 214l9 28 28 9-28 9-9 28-9-28-28-9 28-9z" fill="#e5bd68"/>' +
      '</svg>';
  }

  function paintCards() {
    var faces = document.querySelectorAll('.tcard[data-card]');
    [].forEach.call(faces, function (el) {
      el.innerHTML = cardSvg(el.getAttribute('data-card'));
    });
    var backs = document.querySelectorAll('.tcard--back');
    [].forEach.call(backs, function (el) {
      el.innerHTML = backSvg();
    });
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
    if (!btn) return;

    var LABEL_RUN = 'Сделать расклад';
    var LABEL_AGAIN = 'Собрать заново';

    btn.addEventListener('click', function () {
      var dealt = box.classList.toggle('is-dealt');
      // первый узел кнопки — текстовый, иконку не трогаем
      btn.firstChild.nodeValue = '\n              ' + (dealt ? LABEL_AGAIN : LABEL_RUN) + '\n              ';
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

  function boot() { paintCards(); initDeal(); initNav(); }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
