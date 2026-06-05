/* ─────────────────────────────────────────────────────────────────────────
   uniworks — Personalanfrage: conversational (Typeform-style) wrapper
   One question at a time, keyboard-driven, with conditional logic.
   Launch by giving any element [data-tf-open]. Branche is read from
   document body [data-tf-branche] (falls back to "Logistik").

   ⚠️ BACKEND NOT WIRED YET — set FORM_ENDPOINT to your real submission URL.
   While null, runs in DEMO mode: logs payload + opens a mailto: fallback.
   ───────────────────────────────────────────────────────────────────────── */
(function () {
  'use strict';

  var FORM_ENDPOINT = null;
  var FALLBACK_EMAIL = 'accounts@uniworks.gmbh';

  // ── Question flow ────────────────────────────────────────────────────────
  var FLOW = [
    {
      id: 'anzahl', type: 'number', eyebrow: 'Herzlich Willkommen bei uniworks!',
      q: 'Mit wie vielen Personen dürfen wir Sie unterstützen?', required: true,
      placeholder: 'z. B. 5', min: 1
    },
    {
      id: 'wann', type: 'datetime', q: 'Wann dürfen wir unterstützen?', required: true,
      sub: 'Geben Sie gerne das Datum und die geplante Uhrzeit des Einsatzes an.'
    },
    {
      id: 'qualifikationen', type: 'multi', q: 'Welche Qualifikationen sollen unsere uniworker mitbringen?',
      required: true, sub: 'Sind bestimmte Sprachkenntnisse, Dresscode etc. notwendig? Wählen Sie so viele wie Sie möchten.',
      // when "andere" is chosen a free-text field appears inline
      reveal: { key: 'andere', name: 'andereText', placeholder: 'Welche Qualifikation soll der uniworker mitbringen?' },
      options: [
        { key: 'de', label: 'Deutsch auf C1-Niveau' },
        { key: 'en', label: 'Englisch auf C1-Niveau' },
        { key: 'dresscode', label: 'Bestimmter Dresscode' },
        { key: 'andere', label: 'Andere Qualifikation …' }
      ]
    },
    {
      id: 'dresscode', type: 'text', q: 'Alles klar – welchen Dresscode dürfen wir an unsere uniworker kommunizieren?',
      required: true, placeholder: 'Antworten Sie hier …',
      showIf: function (a) { return (a.qualifikationen || []).indexOf('dresscode') !== -1; }
    },
    {
      id: 'taetigkeit', type: 'textarea', q: 'Für welche Tätigkeit benötigen Sie Personal?',
      required: true, sub: 'Eine kurze Beschreibung hilft uns, Ihren Personalbedarf besser einzuschätzen.',
      placeholder: 'Antworten Sie hier …'
    },
    {
      id: 'einsatzort', type: 'group', q: 'Wo ist der Einsatzort?', cols: true,
      subHtml: 'Bei mehreren Einsatzorten <a class="tf-maillink" href="mailto:info@uniworks.gmbh?subject=Personalanfrage%20%E2%80%93%20mehrere%20Einsatzorte&body=Hallo%20uniworks-Team%2C%0A%0Awir%20ben%C3%B6tigen%20Personal%20an%20mehreren%20Einsatzorten.%20Hier%20die%20Details%3A%0A%0A">schreiben Sie uns gerne direkt per E-Mail</a>.',
      fields: [
        { name: 'anschrift', label: 'Anschrift', required: true, placeholder: 'Gartenstraße 65', full: true },
        { name: 'anschrift2', label: 'Anschrift Zeile 2', placeholder: 'Apartment 4', full: true },
        { name: 'stadt', label: 'Stadt / Ort', required: true, placeholder: 'Hannover' },
        { name: 'bundesland', label: 'Bundesland / Region / Provinz', placeholder: 'Niedersachsen' },
        { name: 'plz', label: 'PLZ / Postleitzahl', required: true, placeholder: '30453' },
        { name: 'land', label: 'Land', placeholder: 'Deutschland' }
      ]
    },
    {
      id: 'kontakt', type: 'group', q: 'Wie können wir Sie erreichen?',
      sub: 'Keine Sorge, wir vermitteln Studierende, keinen Spam.', cols: true,
      fields: [
        { name: 'vorname', label: 'Vorname', placeholder: 'Max' },
        { name: 'nachname', label: 'Nachname', placeholder: 'Mustermann' },
        { name: 'telefon', label: 'Telefonnummer', required: true, placeholder: '01512 3456789', itype: 'tel' },
        { name: 'email', label: 'E-Mail', required: true, placeholder: 'name@beispiel.de', itype: 'email' },
        { name: 'unternehmen', label: 'Unternehmen', placeholder: 'Meyer & Söhne', full: true }
      ]
    }
  ];

  var KEYS = ['A', 'B', 'C', 'D', 'E', 'F'];
  var answers = {};
  var currentId = null;
  var root, viewport, bar, foot, backBtn, nextBtn, countEl, savedScroll = 0;

  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]; }); }
  function visible() { return FLOW.filter(function (s) { return !s.showIf || s.showIf(answers); }); }

  // ── Build a step's DOM ────────────────────────────────────────────────────
  function buildStep(step, index) {
    var el = document.createElement('div');
    el.className = 'tf-step';
    el.dataset.step = step.id;

    var head = '';
    if (step.eyebrow) head += '<div class="tf-eyebrow">' + esc(step.eyebrow) + '</div>';
    head += '<div class="tf-num"><i class="ti ti-arrow-narrow-right" aria-hidden="true"></i><span class="tf-num-v"></span></div>';
    head += '<h2 class="tf-q">' + esc(step.q) + (step.required ? ' <span class="req">*</span>' : '') + '</h2>';
    if (step.subHtml) head += '<p class="tf-sub">' + step.subHtml + '</p>';
    else if (step.sub) head += '<p class="tf-sub">' + esc(step.sub) + '</p>';

    var body = '';
    if (step.type === 'number') {
      body = '<input class="tf-input" type="number" inputmode="numeric" min="' + (step.min || 1) + '" name="' + step.id + '" placeholder="' + esc(step.placeholder || '') + '" />';
    } else if (step.type === 'text') {
      body = '<input class="tf-input" type="text" name="' + step.id + '" placeholder="' + esc(step.placeholder || '') + '" />';
    } else if (step.type === 'textarea') {
      body = '<textarea class="tf-input" rows="2" name="' + step.id + '" placeholder="' + esc(step.placeholder || '') + '"></textarea>';
    } else if (step.type === 'datetime') {
      var hours = '';
      for (var h = 0; h < 24; h++) {
        var hh = (h < 10 ? '0' + h : '' + h) + ':00';
        hours += '<option value="' + hh + '">' + hh + ' Uhr</option>';
      }
      body = '<div class="tf-fields cols">' +
        '<div class="tf-field"><label>Datum <span class="req">*</span></label><input class="tf-input" type="date" name="datum" /></div>' +
        '<div class="tf-field"><label>Uhrzeit</label><select class="tf-input tf-select" name="uhrzeit">' +
        '<option value="">Uhrzeit wählen …</option>' + hours + '</select></div>' +
        '</div>';
    } else if (step.type === 'multi') {
      body = '<div class="tf-choices">' + step.options.map(function (o, i) {
        return '<button type="button" class="tf-choice" data-key="' + o.key + '">' +
          '<span class="key">' + KEYS[i] + '</span><span class="lbl">' + esc(o.label) + '</span>' +
          '<i class="ti ti-check tick" aria-hidden="true"></i></button>';
      }).join('') + '</div>';
      if (step.reveal) {
        body += '<div class="tf-andere" data-andere hidden>' +
          '<input class="tf-input" type="text" name="' + step.reveal.name + '" placeholder="' + esc(step.reveal.placeholder || '') + '" /></div>';
      }
    } else if (step.type === 'group') {
      body = '<div class="tf-fields' + (step.cols ? ' cols' : '') + '">' + step.fields.map(function (f) {
        return '<div class="tf-field' + (f.full ? ' full' : '') + '">' +
          '<label>' + esc(f.label) + (f.required ? ' <span class="req">*</span>' : '') + '</label>' +
          '<input class="tf-input" type="' + (f.itype || 'text') + '" name="' + f.name + '" placeholder="' + esc(f.placeholder || '') + '" />' +
          '</div>';
      }).join('') + '</div>';
    }

    var ok = '<div class="tf-ok"><button type="button" class="btn-ok" data-ok>OK <i class="ti ti-check" aria-hidden="true"></i></button>' +
      '<span class="hint">drücke <kbd>Enter ↵</kbd></span></div>' +
      '<p class="tf-err" role="alert"></p>';

    el.innerHTML = '<div class="tf-inner">' + head + body + ok + '</div>';

    // restrict date pickers to today onward — only eligible (future) dates
    var dateIn = el.querySelector('input[type="date"]');
    if (dateIn) dateIn.min = new Date().toISOString().slice(0, 10);

    // wire multi-select
    if (step.type === 'multi') {
      el.querySelectorAll('.tf-choice').forEach(function (b) {
        b.addEventListener('click', function () { toggleChoice(step, b.dataset.key, el); });
      });
    }
    // wire OK button
    el.querySelector('[data-ok]').addEventListener('click', next);
    return el;
  }

  function buildEnd() {
    var el = document.createElement('div');
    el.className = 'tf-step';
    el.dataset.step = '__end';
    el.innerHTML = '<div class="tf-inner"><div class="tf-end">' +
      '<div class="ok"><i class="ti ti-check" aria-hidden="true"></i></div>' +
      '<h2>Vielen Dank für Ihre Anfrage!</h2>' +
      '<p>Wir haben Ihre Personalanfrage erhalten und melden uns zeitnah mit einem passenden Angebot bei Ihnen.</p>' +
      '<button type="button" class="btn-ok" data-close>Schließen</button>' +
      '</div></div>';
    el.querySelector('[data-close]').addEventListener('click', close);
    return el;
  }

  function toggleChoice(step, key, el) {
    var set = answers[step.id] || [];
    var i = set.indexOf(key);
    if (i === -1) set.push(key); else set.splice(i, 1);
    answers[step.id] = set;
    var btn = el.querySelector('.tf-choice[data-key="' + key + '"]');
    if (btn) btn.classList.toggle('sel', set.indexOf(key) !== -1);
    // reveal / hide the inline free-text field
    if (step.reveal) {
      var box = el.querySelector('[data-andere]');
      var on = set.indexOf(step.reveal.key) !== -1;
      if (box) {
        box.hidden = !on;
        var inp = box.querySelector('input');
        if (on) { setTimeout(function () { inp.focus(); }, 50); }
        else if (inp) { inp.value = ''; answers[step.reveal.name] = ''; }
      }
    }
    clearErr(el);
  }

  // ── Validate + collect current step ───────────────────────────────────────
  function collect(step, el) {
    if (step.type === 'multi') return; // handled live
    if (step.type === 'datetime') {
      answers.datum = el.querySelector('[name=datum]').value;
      answers.uhrzeit = el.querySelector('[name=uhrzeit]').value;
      return;
    }
    if (step.type === 'group') {
      step.fields.forEach(function (f) { answers[f.name] = el.querySelector('[name=' + f.name + ']').value.trim(); });
      return;
    }
    var input = el.querySelector('[name=' + step.id + ']');
    if (input) answers[step.id] = input.value.trim();
  }

  function validate(step, el) {
    collect(step, el);
    var msg = '';
    if (step.type === 'multi') {
      var sel = answers[step.id] || [];
      if (step.reveal) {
        var rin = el.querySelector('[name=' + step.reveal.name + ']');
        if (rin) answers[step.reveal.name] = rin.value.trim();
      }
      if (step.required && sel.length === 0) msg = 'Bitte mindestens eine Option wählen.';
      else if (step.reveal && sel.indexOf(step.reveal.key) !== -1 && !answers[step.reveal.name]) msg = 'Bitte beschreiben Sie die andere Qualifikation.';
    } else if (step.type === 'datetime') {
      if (!answers.datum) msg = 'Bitte ein Datum angeben.';
      else if (answers.datum < new Date().toISOString().slice(0, 10)) msg = 'Bitte ein Datum ab heute wählen.';
    } else if (step.type === 'group') {
      step.fields.forEach(function (f) {
        if (msg) return;
        if (f.required && !answers[f.name]) msg = 'Bitte „' + f.label + '“ ausfüllen.';
        else if (f.itype === 'email' && answers[f.name] && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(answers[f.name])) msg = 'Bitte gültige E-Mail angeben.';
      });
    } else if (step.required && !answers[step.id]) {
      msg = 'Bitte dieses Feld ausfüllen.';
    } else if (step.type === 'number' && answers[step.id] && Number(answers[step.id]) < (step.min || 1)) {
      msg = 'Bitte eine gültige Anzahl angeben.';
    }
    var err = el.querySelector('.tf-err');
    if (msg) { err.textContent = msg; err.classList.add('show'); return false; }
    clearErr(el);
    return true;
  }
  function clearErr(el) { var e = el.querySelector('.tf-err'); if (e) { e.textContent = ''; e.classList.remove('show'); } }

  // ── Navigation ────────────────────────────────────────────────────────────
  function stepEl(id) { return viewport.querySelector('.tf-step[data-step="' + id + '"]'); }

  function show(id, dir) {
    var cur = currentId ? stepEl(currentId) : null;
    if (cur) { cur.classList.remove('is-active'); cur.classList.toggle('is-prev', dir !== 'back'); }
    currentId = id;
    var nextEl = stepEl(id);
    requestAnimationFrame(function () {
      nextEl.classList.remove('is-prev');
      nextEl.classList.add('is-active');
      var f = nextEl.querySelector('input,textarea'); if (f) setTimeout(function () { f.focus(); }, 60);
    });
    updateChrome();
  }

  function updateChrome() {
    var list = visible();
    var idx = list.findIndex(function (s) { return s.id === currentId; });
    if (currentId === '__end') {
      bar.style.width = '100%';
      foot.style.display = 'none';
      return;
    }
    foot.style.display = 'flex';
    bar.style.width = ((idx) / list.length * 100) + '%';
    countEl.textContent = (idx + 1) + ' / ' + list.length;
    backBtn.disabled = idx === 0;
    // step number label
    var el = stepEl(currentId);
    var nv = el && el.querySelector('.tf-num-v'); if (nv) nv.textContent = 'Frage ' + (idx + 1);
  }

  function next() {
    if (currentId === '__end') return;
    var step = FLOW.filter(function (s) { return s.id === currentId; })[0];
    var el = stepEl(currentId);
    if (!validate(step, el)) return;
    var list = visible();
    var idx = list.findIndex(function (s) { return s.id === currentId; });
    if (idx < list.length - 1) show(list[idx + 1].id, 'fwd');
    else submit();
  }
  function back() {
    if (currentId === '__end') return;
    var list = visible();
    var idx = list.findIndex(function (s) { return s.id === currentId; });
    if (idx > 0) show(list[idx - 1].id, 'back');
  }

  // ── Submit ────────────────────────────────────────────────────────────────
  function labelFor(key) {
    var q = FLOW.filter(function (s) { return s.id === 'qualifikationen'; })[0];
    var o = q.options.filter(function (x) { return x.key === key; })[0];
    return o ? o.label : key;
  }
  function payload() {
    return {
      branche: (document.body.dataset.tfBranche || 'Logistik'),
      anzahl: answers.anzahl || '',
      datum: answers.datum || '', uhrzeit: answers.uhrzeit || '',
      qualifikationen: (answers.qualifikationen || []).map(function (k) {
        return (k === 'andere' && answers.andereText) ? 'Andere: ' + answers.andereText : labelFor(k);
      }),
      dresscode: answers.dresscode || '',
      taetigkeit: answers.taetigkeit || '',
      anschrift: answers.anschrift || '', anschrift2: answers.anschrift2 || '', stadt: answers.stadt || '',
      bundesland: answers.bundesland || '', plz: answers.plz || '', land: answers.land || '',
      vorname: answers.vorname || '', nachname: answers.nachname || '',
      telefon: answers.telefon || '', email: answers.email || '', unternehmen: answers.unternehmen || ''
    };
  }
  function mailto(d) {
    var b = [
      'Branche: ' + d.branche, 'Anzahl: ' + d.anzahl,
      'Einsatz: ' + d.datum + ' ' + d.uhrzeit,
      'Qualifikationen: ' + d.qualifikationen.join(', '),
      'Dresscode: ' + (d.dresscode || '–'),
      'Tätigkeit: ' + d.taetigkeit,
      'Einsatzort: ' + d.anschrift + ', ' + (d.anschrift2 ? d.anschrift2 + ', ' : '') + d.plz + ' ' + d.stadt + (d.bundesland ? ', ' + d.bundesland : '') + (d.land ? ', ' + d.land : ''),
      'Kontakt: ' + d.vorname + ' ' + d.nachname + ' · ' + d.telefon + ' · ' + d.email,
      'Unternehmen: ' + (d.unternehmen || '–')
    ].join('\n');
    return 'mailto:' + FALLBACK_EMAIL + '?subject=' + encodeURIComponent('Personalanfrage ' + d.branche + ' – ' + (d.unternehmen || d.nachname)) + '&body=' + encodeURIComponent(b);
  }
  function submit() {
    var d = payload();
    function done() { show('__end', 'fwd'); }
    if (!FORM_ENDPOINT) {
      console.info('[Personalanfrage · Typeform-Flow] DEMO mode (FORM_ENDPOINT not set). Payload:', d);
      var link = mailto(d);
      done(); window.location.href = link; return;
    }
    fetch(FORM_ENDPOINT, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(d) })
      .then(function (r) { if (!r.ok) throw new Error('HTTP ' + r.status); done(); })
      .catch(function (e) { console.error(e); var el = stepEl(currentId); var err = el.querySelector('.tf-err'); err.textContent = 'Senden fehlgeschlagen – bitte erneut versuchen.'; err.classList.add('show'); });
  }

  // ── Open / close ──────────────────────────────────────────────────────────
  function open() {
    answers = {}; currentId = null;
    // lock the page behind so the fixed modal stays full-screen (iOS-safe)
    savedScroll = window.scrollY || window.pageYOffset || 0;
    document.documentElement.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.top = -savedScroll + 'px';
    document.body.style.left = '0';
    document.body.style.right = '0';
    document.body.style.width = '100%';
    // reset all inputs/choices
    viewport.querySelectorAll('input,textarea,select').forEach(function (i) { i.value = ''; });
    viewport.querySelectorAll('.tf-choice.sel').forEach(function (c) { c.classList.remove('sel'); });
    viewport.querySelectorAll('[data-andere]').forEach(function (b) { b.hidden = true; });
    viewport.querySelectorAll('.tf-step').forEach(function (s) { s.classList.remove('is-active', 'is-prev'); });
    root.hidden = false;
    requestAnimationFrame(function () { root.classList.add('open'); show(visible()[0].id, 'fwd'); });
  }
  function close() {
    root.classList.remove('open');
    document.documentElement.style.overflow = '';
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.left = '';
    document.body.style.right = '';
    document.body.style.width = '';
    window.scrollTo(0, savedScroll);
    setTimeout(function () { root.hidden = true; }, 300);
  }

  // ── Init ──────────────────────────────────────────────────────────────────
  function init() {
    root = document.createElement('div');
    root.className = 'tf'; root.id = 'tf'; root.hidden = true;
    root.setAttribute('role', 'dialog'); root.setAttribute('aria-modal', 'true');
    root.innerHTML =
      '<div class="tf-progress"><span class="tf-progress-bar"></span></div>' +
      '<div class="tf-top"><a class="tf-brand" href="../index.html"><img src="../../images/branding/AppIcon.webp" alt="" /><span>uniworks</span></a>' +
      '<button class="tf-close" aria-label="Schließen">&times;</button></div>' +
      '<div class="tf-viewport"></div>' +
      '<div class="tf-foot"><span class="count"></span>' +
      '<button class="tf-nav tf-back" aria-label="Zurück"><i class="ti ti-chevron-up"></i></button>' +
      '<button class="tf-nav tf-next" aria-label="Weiter"><i class="ti ti-chevron-down"></i></button></div>';
    document.body.appendChild(root);

    viewport = root.querySelector('.tf-viewport');
    bar = root.querySelector('.tf-progress-bar');
    foot = root.querySelector('.tf-foot');
    countEl = root.querySelector('.count');
    backBtn = root.querySelector('.tf-back');
    nextBtn = root.querySelector('.tf-next');

    FLOW.forEach(function (s, i) { viewport.appendChild(buildStep(s, i)); });
    viewport.appendChild(buildEnd());

    root.querySelector('.tf-close').addEventListener('click', close);
    backBtn.addEventListener('click', back);
    nextBtn.addEventListener('click', next);

    document.querySelectorAll('[data-tf-open]').forEach(function (b) {
      b.addEventListener('click', function (e) { e.preventDefault(); open(); });
    });

    document.addEventListener('keydown', function (e) {
      if (root.hidden) return;
      if (e.key === 'Escape') return close();
      if (e.key === 'Enter') {
        var ta = e.target && e.target.tagName === 'TEXTAREA';
        if (ta && e.shiftKey) return;        // Shift+Enter = newline in long text
        e.preventDefault(); next(); return;
      }
      // A–F toggle on multi steps
      var step = FLOW.filter(function (s) { return s.id === currentId; })[0];
      if (step && step.type === 'multi') {
        var k = e.key.toUpperCase(); var i = KEYS.indexOf(k);
        if (i !== -1 && step.options[i]) { e.preventDefault(); toggleChoice(step, step.options[i].key, stepEl(currentId)); }
      }
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
