/* uniworks cookie-consent banner — self-coded, wires Google Consent Mode v2.
   The gtag head snippet on every page sets the denied-by-default baseline and
   re-applies a stored "granted" before gtag.js initialises; this banner only
   collects the visitor's choice. The choice persists in localStorage
   ("uw_consent": granted | denied) and the banner stays hidden once set.

   Layout: bottom-center card, non-blocking — no scrim, no scroll lock, the
   page stays fully usable behind it. Reject stays first-layer and same-sized
   as Accept (TTDSG/DSK equivalence). */
(function () {
  var KEY = 'uw_consent';
  function storedChoice() {
    try { return localStorage.getItem(KEY); } catch (e) { return null; /* storage blocked — banner shows, choice won't persist */ }
  }

  var en = location.pathname === '/en' || location.pathname.indexOf('/en/') === 0;
  var t = en
    ? {
        heading: 'Cookies at uniworks',
        text: 'We use cookies solely to measure the effectiveness of our advertising (Google Ads). More information in our ',
        policy: 'privacy policy', policyHref: '/en/datenschutz',
        accept: 'Accept all', reject: 'Decline',
        note: 'You can change your selection at any time.',
        aria: 'Cookie consent'
      }
    : {
        heading: 'Cookies bei uniworks',
        text: 'Wir verwenden Cookies ausschließlich zur Messung der Wirksamkeit unserer Werbeanzeigen (Google Ads). Weitere Informationen in der ',
        policy: 'Datenschutzerklärung', policyHref: '/datenschutz',
        accept: 'Alle akzeptieren', reject: 'Ablehnen',
        note: 'Die Auswahl kann jederzeit geändert werden.',
        aria: 'Cookie-Einwilligung'
      };

  function applyGranted() {
    if (typeof window.gtag === 'function') {
      window.gtag('consent', 'update', {
        'ad_storage': 'granted',
        'ad_user_data': 'granted',
        'ad_personalization': 'granted',
        'analytics_storage': 'granted'
      });
    }
  }
  function applyDenied() {
    if (typeof window.gtag === 'function') {
      window.gtag('consent', 'update', {
        'ad_storage': 'denied',
        'ad_user_data': 'denied',
        'ad_personalization': 'denied',
        'analytics_storage': 'denied'
      });
    }
  }
  function store(value) {
    try { localStorage.setItem(KEY, value); } catch (e) {}
  }
  function hide() {
    var el = document.getElementById('uw-cookie-overlay');
    if (el && el.parentNode) el.parentNode.removeChild(el);
  }

  /* Global helpers so other scripts (e.g. the Datenschutz page) can reuse the wiring. */
  window.uwAccept = function () { store('granted'); applyGranted(); hide(); };
  window.uwReject = function () { store('denied'); applyDenied(); hide(); };
  /* Reopen the banner so a stored choice can be changed — linked from the
     Datenschutzerklärung ("Cookie-Einstellungen"). The stored choice stays
     untouched until a button is clicked. */
  window.uwConsentSettings = function () { init(); };

  function init() {
    if (document.getElementById('uw-cookie-overlay')) return;

    var style = document.getElementById('uw-cc-style') || document.createElement('style');
    style.id = 'uw-cc-style';
    style.textContent =
      /* Transparent, click-through positioner — only the card itself catches input. */
      '#uw-cookie-overlay{position:fixed;inset:0;z-index:1000;pointer-events:none;' +
      'display:flex;align-items:flex-end;justify-content:center;' +
      'padding:16px 16px calc(16px + env(safe-area-inset-bottom,0px))}' +
      '@media(min-width:768px){#uw-cookie-overlay{padding:24px}}' +
      '#uw-cookie-banner{width:100%;max-width:460px;pointer-events:auto;background:#fff;border:1px solid #E5E7EB;' +
      'border-radius:20px;box-shadow:0 16px 48px rgba(0,0,0,.16);padding:24px;outline:none;' +
      "font-family:'IBM Plex Sans','Helvetica Neue',Arial,sans-serif;color:#374151;" +
      'animation:uwCcRise 240ms ease-out}' +
      '@media(min-width:768px){#uw-cookie-banner{padding:28px}}' +
      '@media(prefers-reduced-motion:reduce){#uw-cookie-banner{animation:none}}' +
      '@keyframes uwCcRise{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:none}}' +
      '#uw-cookie-banner .uw-cc-icon{width:44px;height:44px;border-radius:12px;background:#E9F8ED;' +
      'display:flex;align-items:center;justify-content:center;margin-bottom:14px;color:#2ab54a}' +
      '#uw-cookie-banner h2{margin:0 0 8px;font-size:17px;line-height:1.3;font-weight:600;color:#111827}' +
      '#uw-cookie-banner p{margin:0 0 18px;font-size:14px;line-height:1.55}' +
      '#uw-cookie-banner a{color:#21993d;text-decoration:underline}' +
      '#uw-cookie-banner .uw-cc-row{display:flex;flex-direction:column;gap:10px}' +
      '@media(min-width:480px){#uw-cookie-banner .uw-cc-row{flex-direction:row-reverse}}' +
      '#uw-cookie-banner button{flex:1;font-family:inherit;font-size:15px;font-weight:600;border-radius:10px;' +
      'padding:12px 16px;cursor:pointer;transition:all 200ms ease-out;white-space:nowrap}' +
      '#uw-cookie-banner .uw-cc-accept{background:#2ab54a;color:#fff;border:none}' +
      '#uw-cookie-banner .uw-cc-accept:hover{background:#21993d}' +
      '#uw-cookie-banner .uw-cc-reject{background:transparent;color:#374151;border:1px solid #E5E7EB}' +
      '#uw-cookie-banner .uw-cc-reject:hover{background:#F5F5F5}' +
      '#uw-cookie-banner .uw-cc-note{margin:12px 0 0;font-size:12px;line-height:1.4;color:#6B7280;text-align:center}';
    document.head.appendChild(style);

    var overlay = document.createElement('div');
    overlay.id = 'uw-cookie-overlay';

    var banner = document.createElement('div');
    banner.id = 'uw-cookie-banner';
    banner.setAttribute('role', 'dialog');
    banner.setAttribute('aria-label', t.aria);

    /* Lucide "cookie" icon — substitution, no custom uniworks cookie icon yet */
    var icon = document.createElement('div');
    icon.className = 'uw-cc-icon';
    icon.innerHTML =
      '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" ' +
      'stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
      '<path d="M12 2a10 10 0 1 0 10 10 4 4 0 0 1-5-5 4 4 0 0 1-5-5"/>' +
      '<path d="M8.5 8.5v.01"/><path d="M16 15.5v.01"/><path d="M12 12v.01"/>' +
      '<path d="M11 17v.01"/><path d="M7 14v.01"/></svg>';
    banner.appendChild(icon);

    var h = document.createElement('h2');
    h.textContent = t.heading;
    banner.appendChild(h);

    var p = document.createElement('p');
    p.appendChild(document.createTextNode(t.text));
    var a = document.createElement('a');
    a.href = t.policyHref;
    a.textContent = t.policy;
    p.appendChild(a);
    p.appendChild(document.createTextNode('.'));
    banner.appendChild(p);

    var row = document.createElement('div');
    row.className = 'uw-cc-row';
    /* DOM order accept → reject: accept sits on top when stacked (mobile)
       and on the right in the row-reverse desktop layout. */
    var accept = document.createElement('button');
    accept.type = 'button';
    accept.className = 'uw-cc-accept';
    accept.textContent = t.accept;
    accept.addEventListener('click', window.uwAccept);
    var reject = document.createElement('button');
    reject.type = 'button';
    reject.className = 'uw-cc-reject';
    reject.textContent = t.reject;
    reject.addEventListener('click', window.uwReject);
    row.appendChild(accept);
    row.appendChild(reject);
    banner.appendChild(row);

    var note = document.createElement('p');
    note.className = 'uw-cc-note';
    note.textContent = t.note;
    banner.appendChild(note);

    overlay.appendChild(banner);
    document.body.appendChild(overlay);
  }

  /* Auto-show only while no choice is stored; afterwards the banner is
     reachable via uwConsentSettings() on the Datenschutz pages. */
  var stored = storedChoice();
  if (stored !== 'granted' && stored !== 'denied') {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', init);
    } else {
      init();
    }
  }
})();
