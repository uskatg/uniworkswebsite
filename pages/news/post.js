// Shared chrome for uniworks News post subpages (live in /pages/news/)
(function () {
  if ("scrollRestoration" in history) history.scrollRestoration = "manual";
  (function(){
    function toTop(){ if(location.hash) return; var h=document.documentElement,p=h.style.scrollBehavior; h.style.scrollBehavior="auto"; window.scrollTo(0,0); h.style.scrollBehavior=p; }
    addEventListener("DOMContentLoaded",toTop);
    addEventListener("load",function(){ toTop(); requestAnimationFrame(toTop); setTimeout(toTop,80); setTimeout(toTop,250); });
    addEventListener("pageshow",function(e){ if(e.persisted) toTop(); });
  })();
  const navHTML = `
  <nav class="nav" id="main-nav" role="banner">
    <div class="nav-inner">
      <a href="/" class="nav-logo" aria-label="uniworks Startseite">
        <img src="/images/branding/AppIcon.webp" alt="uniworks" />
        <span class="nav-logo-text">uni<span class="nav-logo-works">works</span></span>
      </a>
      <div class="nav-ctas">
        <a href="/#studierende" class="btn btn-s">Für Studierende</a>
        <a href="/unternehmen" class="btn btn-p">Für Unternehmen</a>
        <a href="/about" class="nav-textlink">Über uns</a>
        <div class="lang-switch" aria-label="Sprache wählen">
          <a href="/about#news" hreflang="de" data-lang="de">DE</a>
          <span class="sep" aria-hidden="true"></span>
          <a href="/en/about#news" hreflang="en" data-lang="en">EN</a>
        </div>
      </div>
      <button class="nav-hbg" id="nav-hbg" aria-label="Menü öffnen" aria-expanded="false">
        <span></span><span></span><span></span>
      </button>
    </div>
  </nav>
  <div class="mob-overlay" id="mob-overlay" role="dialog" aria-label="Navigation" aria-modal="true">
    <a href="/#studierende">Für Studierende</a>
    <a href="/#unternehmen">Für Unternehmen</a>
    <a href="/about">Über uns</a>
    <div class="lang-switch" aria-label="Sprache wählen" style="padding:14px 0;border-bottom:1px solid var(--border)">
      <a href="/about#news" hreflang="de" data-lang="de">DE</a>
      <span class="sep" aria-hidden="true"></span>
      <a href="/en/about#news" hreflang="en" data-lang="en">EN</a>
    </div>
    <div class="mob-ctas">
      <a href="/#studierende" class="btn btn-s">Für Studierende</a>
      <a href="/#unternehmen" class="btn btn-p">Personal anfragen</a>
    </div>
  </div>`;

  const footerHTML = `
  <footer>
    <div class="wrap">
      <div class="footer-grid">
        <div class="footer-brand">
          <div style="display:flex;align-items:center;gap:10px;margin-bottom:16px">
            <img src="/images/branding/AppIcon.webp" alt="" style="width:32px;height:32px;border-radius:7px" />
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
            <li><a href="/#studierende">Für Studierende</a></li>
            <li><a href="/#unternehmen">Für Unternehmen</a></li>
            <li><a href="/#app">App herunterladen</a></li>
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
            <li><a href="/about#news">Blog</a></li>
            <li><a href="/faq">FAQ</a></li>
            <li><a href="/impressum">Impressum</a></li>
            <li><a href="/datenschutz">Datenschutz</a></li>
          </ul>
        </div>
      </div>
      <div class="footer-bottom">
        <span>© 2026 uniworks GmbH. Alle Rechte vorbehalten.</span>
        <div class="footer-bottom-links">
          <a href="/impressum">Impressum</a>
          <a href="/datenschutz">Datenschutz</a>
        </div>
      </div>
    </div>
  </footer>`;

  const navMount = document.getElementById('site-nav');
  const footMount = document.getElementById('site-footer');
  if (navMount) navMount.innerHTML = navHTML;
  if (footMount) footMount.innerHTML = footerHTML;

  // Nav scroll shadow
  const mainNav = document.getElementById('main-nav');
  window.addEventListener('scroll', () => {
    mainNav.classList.toggle('scrolled', window.scrollY > 8);
  }, {passive: true});

  // Language switch
  const isEN = location.pathname.startsWith('/en');
  document.documentElement.lang = isEN ? 'en' : 'de';
  document.querySelectorAll('.lang-switch a').forEach(a => {
    a.classList.toggle('active', a.dataset.lang === (isEN ? 'en' : 'de'));
  });

  // Mobile hamburger
  const hbg = document.getElementById('nav-hbg');
  const mobOverlay = document.getElementById('mob-overlay');
  let menuOpen = false;
  hbg.addEventListener('click', () => {
    menuOpen = !menuOpen;
    mobOverlay.classList.toggle('open', menuOpen);
    hbg.setAttribute('aria-expanded', String(menuOpen));
    document.body.style.overflow = menuOpen ? 'hidden' : '';
  });
  mobOverlay.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    menuOpen = false;
    mobOverlay.classList.remove('open');
    document.body.style.overflow = '';
  }));

  // Category dropdown
  const navDd = document.getElementById('nav-dd');
  const navDdToggle = document.getElementById('nav-dd-toggle');
  navDdToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    const open = navDd.classList.toggle('open');
    navDdToggle.setAttribute('aria-expanded', String(open));
  });
  document.addEventListener('click', (e) => {
    if (!navDd.contains(e.target)) { navDd.classList.remove('open'); navDdToggle.setAttribute('aria-expanded', 'false'); }
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') { navDd.classList.remove('open'); navDdToggle.setAttribute('aria-expanded', 'false'); }
  });
})();
