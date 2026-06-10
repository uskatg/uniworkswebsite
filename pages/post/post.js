// Shared chrome for uniworks blog post pages (live in /pages/post/, links use ../)
(function () {
  if ("scrollRestoration" in history) history.scrollRestoration = "manual";
  (function(){
    function toTop(){ if(location.hash) return; var h=document.documentElement,p=h.style.scrollBehavior; h.style.scrollBehavior="auto"; window.scrollTo(0,0); h.style.scrollBehavior=p; }
    addEventListener("DOMContentLoaded",toTop);
    addEventListener("load",function(){ toTop(); requestAnimationFrame(toTop); setTimeout(toTop,80); setTimeout(toTop,250); });
    addEventListener("pageshow",function(e){ if(e.persisted) toTop(); });
  })();

  // Dynamic up-scaling on very large screens (mirrors the other pages)
  (function(){
    var el = document.documentElement, REF = 1440, MAX = 1.6;
    function applyZoom(){ el.style.zoom=''; var w=el.clientWidth; if(w>REF) el.style.zoom=Math.min(w/REF,MAX); }
    applyZoom(); addEventListener('resize', applyZoom); addEventListener('DOMContentLoaded', applyZoom);
  })();

  const navHTML = `
  <nav class="nav" id="main-nav" role="banner">
    <div class="nav-inner">
      <a href="/" class="nav-logo" aria-label="uniworks Startseite">
        <img src="../../images/branding/AppIcon.webp" alt="uniworks" />
        <span class="nav-logo-text">uniworks</span>
      </a>
      <div class="nav-ctas">
        <div class="nav-dd" id="nav-dd-uw">
          <button type="button" class="btn btn-s nav-dd-toggle" aria-haspopup="true" aria-expanded="false">Für uniworker <i class="ti ti-chevron-down" aria-hidden="true"></i></button>
          <div class="nav-dd-menu" role="menu" aria-label="uniworkers">
            <a href="/studierende" role="menuitem"><i class="ti ti-school" aria-hidden="true"></i>Studierende</a>
            <a href="#" role="menuitem"><i class="ti ti-tools" aria-hidden="true"></i>Fachkräfte</a>
          </div>
        </div>
        <div class="nav-dd" id="nav-dd">
          <button type="button" class="btn btn-p nav-dd-toggle" aria-haspopup="true" aria-expanded="false">Für Unternehmen <i class="ti ti-chevron-down" aria-hidden="true"></i></button>
          <div class="nav-dd-menu" role="menu" aria-label="Branchen">
            <a href="/unternehmen" role="menuitem"><i class="ti ti-layout-grid" aria-hidden="true"></i>Übersicht</a>
            <a href="/unternehmen/logistik-personal" role="menuitem"><i class="ti ti-truck" aria-hidden="true"></i>Logistik</a>
            <a href="/unternehmen/events" role="menuitem"><i class="ti ti-confetti" aria-hidden="true"></i>Event</a>
            <a href="/unternehmen/catering" role="menuitem"><i class="ti ti-tools-kitchen-2" aria-hidden="true"></i>Catering</a>
            <a href="/unternehmen/einzelhandel" role="menuitem"><i class="ti ti-shopping-cart" aria-hidden="true"></i>Einzelhandel</a>
            <a href="/unternehmen/gastronomie-hotellerie" role="menuitem"><i class="ti ti-glass-full" aria-hidden="true"></i>Gastronomie &amp; Hotellerie</a>
            <a href="/unternehmen/promotion" role="menuitem"><i class="ti ti-speakerphone" aria-hidden="true"></i>Promotion</a>
            <a href="/unternehmen/buro" role="menuitem"><i class="ti ti-briefcase" aria-hidden="true"></i>Büro</a>
          </div>
        </div>
        <a href="/blog" class="nav-textlink active">Blog</a>
        <a href="/about" class="nav-textlink">Über uns</a>
        <div class="lang-switch" aria-label="Sprache wählen">
          <a href="#" class="active" hreflang="de" data-lang="de">DE</a>
          <span class="sep" aria-hidden="true"></span>
          <a href="#" hreflang="en" data-lang="en">EN</a>
        </div>
      </div>
      <button class="nav-hbg" id="nav-hbg" aria-label="Menü öffnen" aria-expanded="false">
        <span></span><span></span><span></span>
      </button>
    </div>
  </nav>
  <div class="mob-overlay" id="mob-overlay" role="dialog" aria-label="Navigation" aria-modal="true">
    <details class="mob-dd">
      <summary>Für uniworker <i class="ti ti-chevron-down" aria-hidden="true"></i></summary>
      <div class="mob-dd-list">
        <a href="/studierende"><i class="ti ti-school" aria-hidden="true"></i>Studierende</a>
        <a href="#"><i class="ti ti-tools" aria-hidden="true"></i>Fachkräfte</a>
      </div>
    </details>
    <details class="mob-dd">
      <summary>Für Unternehmen <i class="ti ti-chevron-down" aria-hidden="true"></i></summary>
      <div class="mob-dd-list">
        <a href="/unternehmen"><i class="ti ti-layout-grid" aria-hidden="true"></i>Übersicht</a>
        <a href="/unternehmen/logistik-personal"><i class="ti ti-truck" aria-hidden="true"></i>Logistik</a>
        <a href="/unternehmen/events"><i class="ti ti-confetti" aria-hidden="true"></i>Event</a>
        <a href="/unternehmen/catering"><i class="ti ti-tools-kitchen-2" aria-hidden="true"></i>Catering</a>
        <a href="/unternehmen/einzelhandel"><i class="ti ti-shopping-cart" aria-hidden="true"></i>Einzelhandel</a>
        <a href="/unternehmen/gastronomie-hotellerie"><i class="ti ti-glass-full" aria-hidden="true"></i>Gastronomie &amp; Hotellerie</a>
        <a href="/unternehmen/promotion"><i class="ti ti-speakerphone" aria-hidden="true"></i>Promotion</a>
        <a href="/unternehmen/buro"><i class="ti ti-briefcase" aria-hidden="true"></i>Büro</a>
      </div>
    </details>
    <a href="/blog">Blog</a>
    <a href="/about">Über uns</a>
  </div>`;

  const footerHTML = `
  <footer>
    <div class="wrap">
      <div class="footer-grid">
        <div class="footer-brand">
          <div style="display:flex;align-items:center;gap:10px;margin-bottom:16px">
            <img src="../../images/branding/AppIcon.webp" alt="" style="width:32px;height:32px;border-radius:7px" />
            <h3>uniworks</h3>
          </div>
          <p>Deutschlands schnellst wachsender Personaldienstleister — wir verbinden Unternehmen mit motivierten Studierenden.</p>
          <div class="footer-social">
            <a href="https://instagram.com/uniworks.gmbh" class="foot-social-a" aria-label="Instagram" target="_blank" rel="noopener noreferrer"><i class="ti ti-brand-instagram" aria-hidden="true"></i></a>
            <a href="https://linkedin.com/company/uniworks" class="foot-social-a" aria-label="LinkedIn" target="_blank" rel="noopener noreferrer"><i class="ti ti-brand-linkedin" aria-hidden="true"></i></a>
          </div>
        </div>
        <div class="footer-col">
          <h4>Plattform</h4>
          <ul>
            <li><a href="/studierende">Für Studierende</a></li>
            <li><a href="/unternehmen">Für Unternehmen</a></li>
            <li><a href="/studierende#app">App herunterladen</a></li>
          </ul>
        </div>
        <div class="footer-col">
          <h4>Branchen</h4>
          <ul>
            <li><a href="/unternehmen/logistik-personal">Logistik</a></li>
            <li><a href="/unternehmen/events">Event</a></li>
            <li><a href="/unternehmen/catering">Catering</a></li>
            <li><a href="/unternehmen/einzelhandel">Einzelhandel</a></li>
            <li><a href="/unternehmen/gastronomie-hotellerie">Gastronomie</a></li>
            <li><a href="/unternehmen/promotion">Promotion</a></li>
          </ul>
        </div>
        <div class="footer-col">
          <h4>Unternehmen</h4>
          <ul>
            <li><a href="/about">Über Uns</a></li>
            <li><a href="/blog">Blog</a></li>
            <li><a href="/faq">FAQ</a></li>
            <li><a href="/impressum">Impressum</a></li>
            <li><a href="/datenschutz">Datenschutz</a></li>
          </ul>
        </div>
      </div>
      <div class="footer-bottom">
        <span>© 2025 uniworks GmbH. Alle Rechte vorbehalten.</span>
        <div class="footer-bottom-links">
          <a href="/impressum">Impressum</a>
          <a href="/datenschutz">Datenschutz</a>
        </div>
      </div>
    </div>
  </footer>`;

  var navMount = document.getElementById('site-nav');
  var footMount = document.getElementById('site-footer');
  if (navMount) navMount.innerHTML = navHTML;
  if (footMount) footMount.innerHTML = footerHTML;

  // Nav scroll shadow
  var mainNav = document.getElementById('main-nav');
  window.addEventListener('scroll', function () {
    mainNav.classList.toggle('scrolled', window.scrollY > 8);
  }, { passive: true });

  // Mobile hamburger
  var hbg = document.getElementById('nav-hbg');
  var mobOverlay = document.getElementById('mob-overlay');
  var menuOpen = false;
  hbg.addEventListener('click', function () {
    menuOpen = !menuOpen;
    mobOverlay.classList.toggle('open', menuOpen);
    hbg.setAttribute('aria-expanded', String(menuOpen));
    document.body.style.overflow = menuOpen ? 'hidden' : '';
  });
  mobOverlay.querySelectorAll('a').forEach(function (a) {
    a.addEventListener('click', function () {
      menuOpen = false; mobOverlay.classList.remove('open'); document.body.style.overflow = '';
    });
  });

  // Scroll-triggered fade-up
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('vis'); io.unobserve(e.target); } });
  }, { threshold: 0.08, rootMargin: '0px 0px -32px 0px' });
  document.querySelectorAll('.fu').forEach(function (el) { io.observe(el); });
})();
