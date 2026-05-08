'use strict';

(function(){
  var T = {
    en: {
      nav_features: 'Features', nav_how: 'How it works', nav_customers: 'Customers', nav_privacy: 'Privacy Policy', nav_terms: 'Terms of Use',
      nav_cta: 'Scan my inbox',
      hero_chip: 'AI-Powered Inbox Security',
      hero_h1: 'Your Gmail.<br>Protected by <span class="g-blue">intelligence</span>,<br>secured by <span class="g-green">trust</span>.',
      hero_desc: 'Sentinel performs a deep security scan of your Gmail inbox — detecting phishing campaigns, malware signatures, and spoofed senders — and delivers a comprehensive threat report in minutes.',
      hero_cta: 'Start Free Scan',
      hero_how: 'How it works',
      trust1: 'Read-only access', trust2: 'No messages stored', trust3: 'Revoke anytime',
      badge1: 'Threat scan active', badge2: 'SPF / DKIM verified', badge3: '3 warnings flagged',
      stat1: 'Threats detected globally', stat2: 'Phishing detection rate', stat3: 'Average scan time', stat4: 'Messages read or stored',
      feat_tag: 'Security capabilities', feat_title: 'Enterprise-grade protection,<br>built for everyone', feat_sub: 'Six layers of intelligent analysis working simultaneously on every message in your inbox — without reading a single word.',
      f1t: 'Phishing Detection', f1d: 'Identifies credential-harvest campaigns, fake login pages, and lookalike domains. Catches attacks that pass standard spam filters.',
      f2t: 'Malware Signatures', f2d: 'Scans attachment metadata against known malware patterns. Detects Office macro exploits, PDF threats, and compressed archive payloads.',
      f3t: 'Suspicious Link Analysis', f3d: 'Resolves redirect chains and detects URL shorteners masking malicious destinations. Flags anchor text mismatches and typosquatted domains.',
      f4t: 'SPF / DKIM / DMARC', f4d: 'Full authentication header analysis on every message. Detects spoofed senders and domain impersonation even when certificates appear valid.',
      f5t: 'Attachment Intelligence', f5d: 'Analyses file types, double extensions, password-protected archives, and embedded scripts — before any file is opened or downloaded.',
      f6t: 'Threat Report', f6d: 'Delivers a structured security report with risk scores, finding summaries, and actionable recommendations — not just a list of flags.',
      how_tag: 'How it works', how_title: 'Security intelligence in three steps',
      s1t: 'Create your free account', s1d: 'Enter your name and email address. No payment details, no commitments.',
      s2t: 'Connect via Google OAuth or IMAP', s2d: 'One-click OAuth consent grants Sentinel read-only access. No password is ever stored. Revoke instantly from your Google account.',
      s3t: 'Receive your security report', s3d: 'Six parallel analysis engines scan your inbox. A structured threat report appears in real time — covering phishing, malware, links, headers, and more.',
      term_title: 'sentinel — scan', term_connect: 'Connecting to Gmail API…', term_list: 'Listing messages…', term_list_out: '5,645 found',
      term_phish: 'Running phishing engine…', term_malware: 'Running malware engine…', term_links: 'Running link resolver…', term_links_out: '2 redirects flagged',
      term_auth: 'Analysing SPF/DKIM/DMARC…', term_attach: 'Scanning attachments…', term_attach_out: '1 macro detected',
      term_report: 'Generating report…', term_complete: 'Scan complete.', term_findings: '3 findings · 0 critical',
      gal_tag: 'Gallery', gal_title: 'The threat landscape, visualised', gal_sub: 'Real-world email threats Sentinel identifies every day across connected inboxes worldwide.',
      gal_t1: 'Phishing', gal_t2: 'Malware', gal_t3: 'Domain Spoofing',
      g1t: 'Credential harvest campaigns targeting enterprise accounts',
      g2t: 'Macro-enabled Office documents used as malware delivery vectors',
      g3t: 'Lookalike domain attacks bypassing traditional spam filters',
      cust_tag: 'Customer stories', cust_title: 'Trusted by security-conscious professionals',
      t1q: 'Sentinel flagged a sophisticated spear-phishing campaign targeting our finance team that had been running for three weeks. The DMARC analysis alone was worth it.',
      t2q: 'I was sceptical about connecting my inbox, but the read-only OAuth is genuinely reassuring. The report found a credential-phishing thread I had missed for months.',
      t3q: 'The attachment intelligence caught a macro-laden Excel file that our AV missed entirely. The report was clear, actionable and explained the exact risk level in plain language.',
      partners_lbl: 'Trusted by professionals at leading institutions',
      cta_title: 'Ready to secure your inbox?',
      cta_sub: 'Join thousands of professionals who trust Sentinel for their email security. No credit card required.',
      cta_btn: 'Start your free scan',
      err_title: 'Something went wrong',
      err_p: 'The connection could not be completed. This may be because access was denied or the session expired. Please try again.',
      err_btn: 'Try again',
      footer_desc: 'Next-generation Gmail security intelligence. Powered by advanced metadata analysis.',
      footer_prod: 'Product', footer_legal: 'Legal', footer_comp: 'Company',
      footer_home: 'Home', footer_feat: 'Features', footer_how: 'How it works', footer_cust: 'Customers',
      footer_privacy: 'Privacy Policy', footer_terms: 'Terms of Use', footer_contact: 'Contact Us',
      footer_apply: 'Get started',
      footer_blog: 'Security Blog', footer_api: 'API Documentation', footer_copy: '© 2025 Sentinel. All rights reserved.'
    },
    es: {
      nav_features: 'Funciones', nav_how: 'Cómo funciona', nav_customers: 'Clientes', nav_privacy: 'Privacidad', nav_terms: 'Términos',
      nav_cta: 'Escanear mi bandeja',
      hero_chip: 'Seguridad impulsada por IA',
      hero_h1: 'Tu Gmail.<br>Protegido por <span class="g-blue">inteligencia</span>,<br>asegurado por la <span class="g-green">confianza</span>.',
      hero_desc: 'Sentinel realiza un escaneo profundo de tu bandeja de entrada de Gmail — detectando campañas de phishing, firmas de malware y remitentes suplantados — y entrega un informe completo en minutos.',
      hero_cta: 'Iniciar escaneo gratis',
      hero_how: 'Cómo funciona',
      trust1: 'Acceso de solo lectura', trust2: 'Sin mensajes almacenados', trust3: 'Revoca cuando quieras',
      badge1: 'Escaneo activo', badge2: 'SPF / DKIM verificado', badge3: '3 advertencias marcadas',
      stat1: 'Amenazas detectadas globalmente', stat2: 'Tasa de detección de phishing', stat3: 'Tiempo medio de escaneo', stat4: 'Mensajes leídos o guardados',
      feat_tag: 'Capacidades de seguridad', feat_title: 'Protección empresarial,<br>creada para todos', feat_sub: 'Seis capas de análisis inteligente trabajando simultáneamente en cada mensaje — sin leer una sola palabra.',
      f1t: 'Detección de Phishing', f1d: 'Identifica campañas de robo de credenciales, páginas de inicio falsas y dominios similares. Detecta ataques que los filtros estándar omiten.',
      f2t: 'Firmas de Malware', f2d: 'Analiza metadatos de adjuntos contra patrones de malware conocidos. Detecta exploits de Office, amenazas en PDF y archivos comprimidos.',
      f3t: 'Análisis de Enlaces', f3d: 'Resuelve cadenas de redirección y detecta acortadores que ocultan destinos maliciosos. Marca errores tipográficos en dominios.',
      f4t: 'SPF / DKIM / DMARC', f4d: 'Análisis completo de cabeceras de autenticación. Detecta suplantación de remitentes incluso con certificados aparentemente válidos.',
      f5t: 'Inteligencia de Adjuntos', f5d: 'Analiza tipos de archivos, extensiones dobles, archivos protegidos y scripts embebidos — antes de abrir o descargar cualquier archivo.',
      f6t: 'Informe de Amenazas', f6d: 'Entrega un informe estructurado con puntuaciones de riesgo, resúmenes de hallazgos y recomendaciones accionables — no solo una lista.',
      how_tag: 'Cómo funciona', how_title: 'Inteligencia de seguridad en tres pasos',
      s1t: 'Crea tu cuenta gratuita', s1d: 'Introduce tu nombre y correo. Sin detalles de pago ni compromisos.',
      s2t: 'Conecta por Google OAuth o IMAP', s2d: 'Un clic para acceso de solo lectura. Nunca guardamos tu contraseña. Revoca al instante desde tu cuenta de Google.',
      s3t: 'Recibe tu informe de seguridad', s3d: 'Seis motores de análisis escanean tu bandeja. Un informe estructurado aparece en tiempo real — phishing, malware, enlaces y más.',
      term_title: 'sentinel — escaneo', term_connect: 'Conectando a Gmail API…', term_list: 'Listando mensajes…', term_list_out: '5,645 encontrados',
      term_phish: 'Ejecutando motor de phishing…', term_malware: 'Ejecutando motor de malware…', term_links: 'Ejecutando resolvedor…', term_links_out: '2 redirecciones marcadas',
      term_auth: 'Analizando SPF/DKIM/DMARC…', term_attach: 'Escaneando adjuntos…', term_attach_out: '1 macro detectada',
      term_report: 'Generando informe…', term_complete: 'Escaneo completo.', term_findings: '3 hallazgos · 0 críticos',
      gal_tag: 'Galería', gal_title: 'El panorama de amenazas, visualizado', gal_sub: 'Amenazas reales que Sentinel identifica cada día en bandejas de entrada de todo el mundo.',
      gal_t1: 'Phishing', gal_t2: 'Malware', gal_t3: 'Suplantación de Dominio',
      g1t: 'Campañas de robo de credenciales dirigidas a cuentas corporativas',
      g2t: 'Documentos de Office con macros usados como vectores de malware',
      g3t: 'Ataques de dominios similares que evaden filtros de spam tradicionales',
      cust_tag: 'Historias de clientes', cust_title: 'Con la confianza de profesionales de la seguridad',
      t1q: 'Sentinel marcó una sofisticada campaña de phishing dirigida a nuestro equipo de finanzas. Solo el análisis DMARC ya valió la pena.',
      t2q: 'Dudaba sobre conectar mi bandeja, pero el OAuth de solo lectura es muy tranquilo. El informe halló un hilo de phishing que no vi en meses.',
      t3q: 'La inteligencia de adjuntos detectó un Excel con macros que nuestro antivirus omitió. El informe fue claro, accionable y en lenguaje sencillo.',
      partners_lbl: 'Con la confianza de profesionales de instituciones líderes',
      cta_title: '¿Listo para asegurar tu bandeja?',
      cta_sub: 'Únete a miles de profesionales que confían en Sentinel. Sin tarjeta de crédito.',
      cta_btn: 'Empezar escaneo gratis',
      err_title: 'Algo salió mal',
      err_p: 'No se pudo completar la conexión. Esto puede deberse a que se denegó el acceso o la sesión expiró. Por favor, inténtalo de nuevo.',
      err_btn: 'Reintentar',
      footer_desc: 'Inteligencia de seguridad de Gmail de próxima generación. Basada en análisis avanzado de metadatos.',
      footer_prod: 'Producto', footer_legal: 'Legal', footer_comp: 'Empresa',
      footer_home: 'Inicio', footer_feat: 'Funciones', footer_how: 'Cómo funciona', footer_cust: 'Clientes',
      footer_privacy: 'Privacidad', footer_terms: 'Términos', footer_contact: 'Contacto',
      footer_apply: 'Empezar',
      footer_blog: 'Blog de Seguridad', footer_api: 'Documentación API', footer_copy: '© 2025 Sentinel. Todos los derechos reservados.'
    }
  };

  function setLang(l) {
    try { localStorage.setItem('sentinel_lang', l); } catch (e) { }
    document.documentElement.lang = l;
    
    var btnEn = document.getElementById('btn-en');
    var btnEs = document.getElementById('btn-es');
    if (btnEn) btnEn.classList.toggle('active', l === 'en');
    if (btnEs) btnEs.classList.toggle('active', l === 'es');

    var d = T[l];

    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var k = el.getAttribute('data-i18n');
      if (d[k] !== undefined) el.innerHTML = d[k];
    });

    // Handle IDs directly for complex structures
    var ids = ['hero-chip','hero-h1','hero-desc','hero-cta','hero-how','trust1','trust2','trust3',
               'stat1-lbl','stat2-lbl','stat3-lbl','stat4-lbl','feat-tag','feat-title','feat-sub',
               'f1t','f1d','f2t','f2d','f3t','f3d','f4t','f4d','f5t','f5d','f6t','f6d',
               'how-tag','how-title','s1t','s1d','s2t','s2d','s3t','s3d','gal-tag','gal-title','gal-sub',
               'g1t','g2t','g3t','cust-tag','cust-title','t1q','t2q','t3q','partners-lbl',
               'nav-cta-text','cta-title','cta-sub','cta-btn','footer-desc','footer-copy',
               'fl-priv','fl-terms'];
    
    ids.forEach(function(id){
      var el = document.getElementById(id);
      var k = id.replace(/-/g, '_');
      // Special mappings
      if (id === 'fl-priv') k = 'nav_privacy';
      if (id === 'fl-terms') k = 'nav_terms';
      if(el && d[k]) el.innerHTML = d[k];
    });

    // Special cases for nav/footer links
    var links = document.querySelectorAll('.nav-links a, .footer-col ul li a');
    links.forEach(function(a){
      var txt = a.textContent.toLowerCase().trim();
      if(txt === 'features' || txt === 'funciones') a.textContent = d.nav_features;
      if(txt === 'how it works' || txt === 'cómo funciona') a.textContent = d.nav_how;
      if(txt === 'customers' || txt === 'clientes') a.textContent = d.nav_customers;
      if(txt === 'privacy policy' || txt === 'privacidad') a.textContent = d.nav_privacy;
      if(txt === 'terms of use' || txt === 'términos') a.textContent = d.nav_terms;
      if(txt === 'home' || txt === 'inicio') a.textContent = d.footer_home;
    });
    
    // Footer headers
    var heads = document.querySelectorAll('.footer-col h4');
    heads.forEach(function(h){
      var txt = h.textContent.toLowerCase().trim();
      if(txt === 'product') h.textContent = d.footer_prod;
      if(txt === 'legal') h.textContent = d.footer_legal;
      if(txt === 'company') h.textContent = d.footer_comp;
    });

    // Terminal
    var termLines = document.querySelectorAll('.terminal-body .term-line .term-out');
    if(termLines.length > 5) {
      termLines[0].textContent = d.term_connect;
      termLines[1].textContent = d.term_list;
      termLines[1].nextElementSibling.textContent = d.term_list_out;
      termLines[2].textContent = d.term_phish;
      termLines[3].textContent = d.term_malware;
      termLines[4].textContent = d.term_links;
      termLines[4].nextElementSibling.textContent = d.term_links_out;
      termLines[5].textContent = d.term_auth;
      termLines[6].textContent = d.term_attach;
      termLines[6].nextElementSibling.textContent = d.term_attach_out;
      termLines[7].textContent = d.term_report;
      var lastLine = document.querySelectorAll('.terminal-body .term-line .term-green');
      if(lastLine.length > 0) {
        lastLine[lastLine.length-1].textContent = d.term_complete;
        lastLine[lastLine.length-1].nextElementSibling.textContent = d.term_findings;
      }
    }
  }

  window.setLang = setLang;

  document.addEventListener('DOMContentLoaded', function() {
    var btnEn = document.getElementById('btn-en');
    var btnEs = document.getElementById('btn-es');
    if (btnEn) btnEn.addEventListener('click', function() { setLang('en'); });
    if (btnEs) btnEs.addEventListener('click', function() { setLang('es'); });
    
    try {
      setLang(localStorage.getItem('sentinel_lang') || 'en');
    } catch (e) {
      setLang('en');
    }
  });
}());
