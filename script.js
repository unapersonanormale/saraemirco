(function () {
  'use strict';

  /* ── Intersection Observer — Scroll Reveal ── */

  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

    revealEls.forEach(function (el) { observer.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('visible'); });
  }


  /* ── Countdown Timer ── */

  var weddingDate = new Date('2026-12-13T11:00:00+01:00').getTime();
  var daysEl   = document.getElementById('cd-days');
  var hoursEl  = document.getElementById('cd-hours');
  var minsEl   = document.getElementById('cd-mins');
  var secsEl   = document.getElementById('cd-secs');

  function pad(n) { return n < 10 ? '0' + n : String(n); }

  function updateCountdown() {
    var now  = Date.now();
    var diff = weddingDate - now;

    if (diff <= 0) {
      daysEl.textContent  = '00';
      hoursEl.textContent = '00';
      minsEl.textContent  = '00';
      secsEl.textContent  = '00';
      return;
    }

    var d = Math.floor(diff / 86400000);
    var h = Math.floor((diff % 86400000) / 3600000);
    var m = Math.floor((diff % 3600000) / 60000);
    var s = Math.floor((diff % 60000) / 1000);

    daysEl.textContent  = pad(d);
    hoursEl.textContent = pad(h);
    minsEl.textContent  = pad(m);
    secsEl.textContent  = pad(s);
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);


  /* ── RSVP Form ── */

  /*
   * ┌──────────────────────────────────────────────────────────┐
   * │  ISTRUZIONI: sostituisci l'URL qui sotto con quello     │
   * │  del tuo Google Apps Script (vedi file istruzioni).      │
   * │  Finché l'URL resta 'INSERISCI_QUI_URL_APPS_SCRIPT'    │
   * │  il form funziona in modalità demo (nessun invio).      │
   * └──────────────────────────────────────────────────────────┘
   */
  var APPS_SCRIPT_URL = 'INSERISCI_QUI_URL_APPS_SCRIPT';

  var form      = document.getElementById('rsvpForm');
  var formWrap  = document.getElementById('rsvpFormWrap');
  var success   = document.getElementById('rsvpSuccess');
  var errorBox  = document.getElementById('rsvpError');
  var submitBtn = form.querySelector('.btn-submit');
  var submitLabel = 'conferma';

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    /* Honeypot: se il campo trappola e pieno, e un bot.
       Fingiamo il successo e non inviamo nulla (comportamento
       identico a un invio riuscito, cosi il bot non se ne accorge). */
    if (form.elements.website && form.elements.website.value.trim() !== '') {
      formWrap.style.display = 'none';
      success.classList.add('show');
      return;
    }

    var name   = form.elements.name.value.trim();
    var email  = form.elements.email.value.trim();
    var attend = form.elements.attend.value;

    if (!name || !email || !attend) {
      var first = form.querySelector(':invalid');
      if (first) first.focus();
      return;
    }

    /* Accompagnatori: numero libero, 0 se assente o non valido */
    var extra = parseInt(form.elements.guests.value, 10);
    if (isNaN(extra) || extra < 0) { extra = 0; }
    var totale = extra + 1;

    /* Modalità demo: se l'URL non è stato configurato */
    if (APPS_SCRIPT_URL === 'INSERISCI_QUI_URL_APPS_SCRIPT') {
      formWrap.style.display = 'none';
      success.classList.add('show');
      return;
    }

    /* Loading state */
    errorBox.classList.remove('show');
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span class="btn-spinner"></span>invio in corso';

    var payload = {
      nome:        name,
      email:       email,
      telefono:    form.elements.phone.value.trim(),
      presenza:    attend === 'yes' ? 'Sì' : 'No',
      accompagnatori: attend === 'yes' ? extra : '—',
      totale:      attend === 'yes' ? totale : 0,
      intolleranze: form.elements.dietary.value.trim(),
      messaggio:   form.elements.note.value.trim(),
      data_invio:  new Date().toLocaleString('it-IT')
    };

    fetch(APPS_SCRIPT_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
    .then(function () {
      formWrap.style.display = 'none';
      success.classList.add('show');
    })
    .catch(function () {
      errorBox.classList.add('show');
      submitBtn.disabled = false;
      submitBtn.textContent = submitLabel;
    });
  });


  /* ── Copy IBAN ── */

  var ibanEl    = document.getElementById('ibanCopy');
  var tooltipEl = document.getElementById('ibanTooltip');
  var ibanText  = 'IT60X0542811101000000123456';

  function copyIban() {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(ibanText).then(showTooltip);
    } else {
      var ta = document.createElement('textarea');
      ta.value = ibanText;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      showTooltip();
    }
  }

  function showTooltip() {
    tooltipEl.classList.add('show');
    setTimeout(function () { tooltipEl.classList.remove('show'); }, 1600);
  }

  ibanEl.addEventListener('click', copyIban);
  ibanEl.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); copyIban(); }
  });

})();
