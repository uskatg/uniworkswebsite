/* ─────────────────────────────────────────────────────────────────────────
   uniworks — Branchen-Subpages behaviour
   • nav: scroll state, "Für Unternehmen" dropdown, mobile menu
   • Personalanfrage: custom request form — client-side validation + submit
   ───────────────────────────────────────────────────────────────────────── */
(function () {
  'use strict';

  /* ⚠️ BACKEND NOT WIRED YET ─────────────────────────────────────────────
     This repo has no backend. Set FORM_ENDPOINT to the real submission URL
     (e.g. a Formspree/Basin form, or your own POST API) to send requests to
     the backend. It receives a JSON body of all fields below.
     While null, the form runs in DEMO mode: it validates, shows the success
     state, logs the payload to the console, and offers a mailto: fallback to
     accounts@uniworks.gmbh so nothing is silently lost.                      */
  var FORM_ENDPOINT = null;
  var FALLBACK_EMAIL = 'accounts@uniworks.gmbh';

  /* ── NAV ─────────────────────────────────────────────────────────────── */
  var nav = document.querySelector('.nav');
  if (nav) {
    addEventListener('scroll', function () {
      nav.classList.toggle('scrolled', scrollY > 8);
    });
  }
  // Nav category dropdowns open on hover (CSS :hover / :focus-within) — no JS toggle.
  var hbg = document.getElementById('nav-hbg');
  var mob = document.getElementById('mob-overlay');
  if (hbg && mob) {
    hbg.addEventListener('click', function () { mob.classList.toggle('open'); });
    mob.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () { mob.classList.remove('open'); });
    });
  }

  /* ── REQUEST FORM ────────────────────────────────────────────────────── */
  var form = document.getElementById('anfrage-form');
  if (!form) return;

  var success = document.getElementById('form-success');
  var statusBox = document.getElementById('form-status');
  var submitBtn = form.querySelector('button[type="submit"]');

  function setError(field, msg) {
    var input = form.elements[field];
    if (!input) return;
    input.setAttribute('aria-invalid', 'true');
    var err = form.querySelector('[data-error="' + field + '"]');
    if (err) { err.textContent = msg; err.classList.add('show'); }
  }
  function clearError(field) {
    var input = form.elements[field];
    if (input) input.removeAttribute('aria-invalid');
    var err = form.querySelector('[data-error="' + field + '"]');
    if (err) { err.textContent = ''; err.classList.remove('show'); }
  }

  // live-clear errors on input
  form.querySelectorAll('input,select,textarea').forEach(function (el) {
    el.addEventListener('input', function () { clearError(el.name); });
  });

  function validate(data) {
    var ok = true;
    function fail(f, m) { setError(f, m); ok = false; }
    if (!data.unternehmen) fail('unternehmen', 'Bitte Firmenname angeben.');
    if (!data.ansprechpartner) fail('ansprechpartner', 'Bitte Name angeben.');
    if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) fail('email', 'Bitte gültige E-Mail angeben.');
    if (!data.anzahl || Number(data.anzahl) < 1) fail('anzahl', 'Bitte Anzahl angeben.');
    if (!data.einsatzort) fail('einsatzort', 'Bitte Einsatzort angeben.');
    if (!data.beginn) fail('beginn', 'Bitte Datum angeben.');
    if (!form.elements.consent.checked) fail('consent', 'Bitte zustimmen.');
    return ok;
  }

  function showStatus(msg) {
    if (!statusBox) return;
    statusBox.textContent = msg;
    statusBox.classList.add('show', 'err');
  }
  function hideStatus() { if (statusBox) statusBox.classList.remove('show', 'err'); }

  function showSuccess() {
    form.style.display = 'none';
    if (success) success.classList.add('show');
  }

  function mailtoFallback(data) {
    var subject = 'Personalanfrage ' + (data.branche || '') + ' – ' + data.unternehmen;
    var body =
      'Branche: ' + data.branche + '\n' +
      'Unternehmen: ' + data.unternehmen + '\n' +
      'Ansprechpartner:in: ' + data.ansprechpartner + '\n' +
      'E-Mail: ' + data.email + '\n' +
      'Telefon: ' + (data.telefon || '–') + '\n' +
      'Anzahl: ' + data.anzahl + '\n' +
      'Einsatzort: ' + data.einsatzort + '\n' +
      'Einsatzbeginn: ' + data.beginn + '\n' +
      'Zeitraum/Dauer: ' + (data.zeitraum || '–') + '\n' +
      'Nachricht: ' + (data.nachricht || '–');
    return 'mailto:' + FALLBACK_EMAIL + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    hideStatus();
    ['unternehmen', 'ansprechpartner', 'email', 'anzahl', 'einsatzort', 'beginn', 'consent']
      .forEach(clearError);

    var fd = new FormData(form);
    var data = Object.fromEntries(fd.entries());
    data.branche = form.dataset.branche || data.branche || '';

    if (!validate(data)) return;

    submitBtn.disabled = true;
    var label = submitBtn.textContent;
    submitBtn.textContent = 'Wird gesendet …';

    if (!FORM_ENDPOINT) {
      // DEMO mode — no backend configured.
      console.info('[Personalanfrage] DEMO mode (FORM_ENDPOINT not set). Payload:', data);
      var link = mailtoFallback(data);
      setTimeout(function () { showSuccess(); window.location.href = link; }, 500);
      return;
    }

    fetch(FORM_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(data)
    })
      .then(function (r) { if (!r.ok) throw new Error('HTTP ' + r.status); return r; })
      .then(showSuccess)
      .catch(function (err) {
        console.error('[Personalanfrage] submit failed:', err);
        submitBtn.disabled = false;
        submitBtn.textContent = label;
        showStatus('Senden fehlgeschlagen. Bitte erneut versuchen oder an ' + FALLBACK_EMAIL + ' schreiben.');
      });
  });
})();
