/* uniworks smart app banner — iPhone only.
   Intentionally no localStorage/sessionStorage: the banner reappears on every
   page view (dismissing only hides it for the current page). */
(function () {
  if (!/iPhone|iPod/.test(navigator.userAgent)) return;
  if (window.navigator.standalone) return; // already running as installed web app

  var APP_URL = 'https://apps.apple.com/de/app/uniworks/id6470999822?l=en-GB';
  var ICON = '/images/branding/AppIcon.webp';
  var en = location.pathname === '/en' || location.pathname.indexOf('/en/') === 0;
  var t = en
    ? { sub: 'Flexible jobs for students', cta: 'Get', close: 'Close' }
    : { sub: 'Flexible Jobs für Studierende', cta: 'Laden', close: 'Schließen' };

  function init() {
    if (document.getElementById('uw-app-banner')) return;

    var style = document.createElement('style');
    style.textContent =
      '#uw-app-banner{position:fixed;top:0;left:0;right:0;z-index:999;display:flex;align-items:center;gap:12px;' +
      'padding:10px 14px;padding-top:calc(10px + env(safe-area-inset-top,0px));background:rgba(255,255,255,.97);' +
      '-webkit-backdrop-filter:blur(12px);backdrop-filter:blur(12px);border-bottom:1px solid rgba(13,27,18,.10);' +
      'box-shadow:0 6px 18px rgba(13,27,18,.06);font-family:"IBM Plex Sans",system-ui,sans-serif}' +
      '#uw-app-banner .uwb-icon{width:50px;height:50px;border-radius:12px;display:block;flex-shrink:0;' +
      'box-shadow:0 2px 8px rgba(13,27,18,.14)}' +
      '#uw-app-banner .uwb-txt{display:flex;flex-direction:column;line-height:1.25;min-width:0;flex:1}' +
      '#uw-app-banner .uwb-title{font-size:15px;font-weight:700;color:#0d1b12}' +
      '#uw-app-banner .uwb-sub{font-size:12px;color:#5b6b60;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}' +
      '#uw-app-banner .uwb-cta{flex-shrink:0;background:#2ab54a;color:#fff;font-size:14px;font-weight:700;' +
      'text-decoration:none;padding:8px 18px;border-radius:999px}' +
      '#uw-app-banner .uwb-cta:active{background:#21993d}' +
      '#uw-app-banner .uwb-x{flex-shrink:0;background:none;border:0;padding:6px;margin-right:-4px;color:#8a978e;' +
      'font-size:0;line-height:0;cursor:pointer}' +
      '#uw-app-banner .uwb-x svg{width:18px;height:18px;display:block}';
    document.head.appendChild(style);

    var b = document.createElement('div');
    b.id = 'uw-app-banner';
    b.setAttribute('role', 'region');
    b.setAttribute('aria-label', 'uniworks App');
    b.innerHTML =
      '<img class="uwb-icon" src="' + ICON + '" alt="" />' +
      '<span class="uwb-txt"><span class="uwb-title">uniworks</span><span class="uwb-sub">' + t.sub + '</span></span>' +
      '<a class="uwb-cta" href="' + APP_URL + '" rel="noopener">' + t.cta + '</a>' +
      '<button class="uwb-x" type="button" aria-label="' + t.close + '">' +
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">' +
      '<path d="M6 6l12 12M18 6L6 18"/></svg></button>';
    document.body.prepend(b);

    // Push the page and any top-anchored fixed chrome down by the banner height.
    var nav = document.querySelector('.nav');
    var overlay = document.querySelector('.mob-overlay');
    var overlayTop = overlay ? parseFloat(getComputedStyle(overlay).top) || 0 : 0;
    function offset() {
      var h = b.offsetHeight;
      document.body.style.marginTop = h + 'px';
      if (nav) nav.style.top = h + 'px';
      if (overlay) overlay.style.top = overlayTop + h + 'px';
    }
    offset();
    window.addEventListener('resize', offset);

    b.querySelector('.uwb-x').addEventListener('click', function () {
      window.removeEventListener('resize', offset);
      b.remove();
      document.body.style.marginTop = '';
      if (nav) nav.style.top = '';
      if (overlay) overlay.style.top = '';
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
