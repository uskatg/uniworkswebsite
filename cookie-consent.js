/* uniworks cookie-consent banner — self-coded, wires Google Consent Mode v2.
   The gtag head snippet on every page sets the denied-by-default baseline and
   re-applies a stored "granted" before gtag.js initialises; this banner only
   collects the visitor's choice. The choice persists in localStorage
   ("uw_consent": granted | denied) and the banner stays hidden once set. */
(function () {
  var KEY = 'uw_consent';
  function storedChoice() {
    try { return localStorage.getItem(KEY); } catch (e) { return null; /* storage blocked — banner shows, choice won't persist */ }
  }

  var en = location.pathname === '/en' || location.pathname.indexOf('/en/') === 0;
  var t = en
    ? {
        text: 'We use cookies for advertising measurement and analytics (Google Ads). Details in our ',
        policy: 'privacy policy', policyHref: '/en/datenschutz',
        accept: 'Accept all', reject: 'Decline'
      }
    : {
        text: 'Wir verwenden Cookies für Werbemessung und Analyse (Google Ads). Details in der ',
        policy: 'Datenschutzerklärung', policyHref: '/datenschutz',
        accept: 'Alle akzeptieren', reject: 'Ablehnen'
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
    var el = document.getElementById('uw-cookie-banner');
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
    if (document.getElementById('uw-cookie-banner')) return;

    var style = document.getElementById('uw-cc-style') || document.createElement('style');
    style.id = 'uw-cc-style';
    style.textContent =
      '#uw-cookie-banner{position:fixed;left:16px;right:16px;bottom:calc(16px + env(safe-area-inset-bottom,0px));' +
      'z-index:1000;max-width:420px;margin:0 auto;background:#fff;border:1px solid #E5E7EB;border-radius:16px;' +
      'box-shadow:0 8px 24px rgba(0,0,0,.10);padding:18px 20px;' +
      "font-family:'IBM Plex Sans','Helvetica Neue',Arial,sans-serif;color:#374151}" +
      '@media(min-width:768px){#uw-cookie-banner{left:24px;right:auto;bottom:24px}}' +
      '#uw-cookie-banner p{margin:0 0 14px;font-size:14px;line-height:1.5}' +
      '#uw-cookie-banner a{color:#21993d;text-decoration:underline}' +
      '#uw-cookie-banner .uw-cc-row{display:flex;gap:10px}' +
      '#uw-cookie-banner button{flex:1;font-family:inherit;font-size:14px;font-weight:600;border-radius:8px;' +
      'padding:10px 16px;cursor:pointer;transition:all 200ms ease-out;white-space:nowrap}' +
      '#uw-cookie-banner .uw-cc-accept{background:#2ab54a;color:#fff;border:none}' +
      '#uw-cookie-banner .uw-cc-accept:hover{background:#21993d}' +
      '#uw-cookie-banner .uw-cc-reject{background:transparent;color:#374151;border:1px solid #E5E7EB}' +
      '#uw-cookie-banner .uw-cc-reject:hover{background:#F5F5F5}';
    document.head.appendChild(style);

    var banner = document.createElement('div');
    banner.id = 'uw-cookie-banner';
    banner.setAttribute('role', 'dialog');
    banner.setAttribute('aria-live', 'polite');
    banner.setAttribute('aria-label', en ? 'Cookie consent' : 'Cookie-Einwilligung');

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
    var reject = document.createElement('button');
    reject.type = 'button';
    reject.className = 'uw-cc-reject';
    reject.textContent = t.reject;
    reject.addEventListener('click', window.uwReject);
    var accept = document.createElement('button');
    accept.type = 'button';
    accept.className = 'uw-cc-accept';
    accept.textContent = t.accept;
    accept.addEventListener('click', window.uwAccept);
    row.appendChild(reject);
    row.appendChild(accept);
    banner.appendChild(row);

    document.body.appendChild(banner);
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
