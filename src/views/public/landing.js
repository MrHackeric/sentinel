'use strict';

(function(){
  // ── Scroll reveal ─────────────────────────────────────────────────────────────
  function showAll() {
    document.querySelectorAll('.reveal').forEach(function(el){ el.classList.add('visible'); });
  }
  // Always show hero/stats immediately
  document.querySelectorAll('.hero-copy,.hero-visual,.stats-strip').forEach(function(el){ el.classList.add('visible'); });
  
  if (!('IntersectionObserver' in window)) { showAll(); return; }
  var obs = new IntersectionObserver(function(entries){
    entries.forEach(function(e){ if(e.isIntersecting){ e.target.classList.add('visible'); obs.unobserve(e.target); } });
  }, { threshold: 0.05 });
  document.querySelectorAll('.reveal').forEach(function(el){ obs.observe(el); });
  // Fallback
  setTimeout(showAll, 800);

  // ── i18n ──────────────────────────────────────────────────────────────────────
  var T={
    en:{
      nav_cta:'Scan my inbox',
      hero_chip:'AI-Powered Inbox Security',
      hero_h1:'Your Gmail.<br>Protected by <span class="g-blue">intelligence</span>,<br>secured by <span class="g-green">trust</span>.',
      hero_desc:'Sentinel performs a deep security scan of your Gmail inbox — detecting phishing campaigns, malware signatures, and spoofed senders — and delivers a comprehensive threat report in minutes.',
      hero_cta:'Start Free Scan',hero_how:'How it works',
      trust1:'Read-only access',trust2:'No messages stored',trust3:'Revoke anytime',
      stat1:'Threats detected globally',stat2:'Phishing detection rate',stat3:'Average scan time',stat4:'Messages read or stored',
      feat_tag:'Security capabilities',feat_title:'Enterprise-grade protection,<br>built for everyone',feat_sub:'Six layers of intelligent analysis working simultaneously on every message in your inbox — without reading a single word.',
      f1t:'Phishing Detection',f1d:'Identifies credential-harvest campaigns, fake login pages, and lookalike domains. Catches attacks that pass standard spam filters.',
      f2t:'Malware Signatures',f2d:'Scans attachment metadata against known malware patterns. Detects Office macro exploits, PDF threats, and compressed archive payloads.',
      f3t:'Suspicious Link Analysis',f3d:'Resolves redirect chains and detects URL shorteners masking malicious destinations. Flags anchor text mismatches and typosquatted domains.',
      f4t:'SPF / DKIM / DMARC',f4d:'Full authentication header analysis on every message. Detects spoofed senders and domain impersonation even when certificates appear valid.',
      f5t:'Attachment Intelligence',f5d:'Analyses file types, double extensions, password-protected archives, and embedded scripts — before any file is opened or downloaded.',
      f6t:'Threat Report',f6d:'Delivers a structured security report with risk scores, finding summaries, and actionable recommendations — not just a list of flags.',
      how_tag:'How it works',how_title:'Security intelligence in three steps',
      s1t:'Create your free account',s1d:'Enter your name and email address. No payment details, no commitments.',
      s2t:'Connect via Google OAuth or IMAP',s2d:'One-click OAuth consent grants Sentinel read-only access. No password is ever stored. Revoke instantly from your Google account.',
      s3t:'Receive your security report',s3d:'Six parallel analysis engines scan your inbox. A structured threat report appears in real time — covering phishing, malware, links, headers, and more.',
      gal_tag:'Gallery',gal_title:'The threat landscape, visualised',gal_sub:'Real-world email threats Sentinel identifies every day across connected inboxes worldwide.',
      g1t:'Credential harvest campaigns targeting enterprise accounts',g2t:'Macro-enabled Office documents used as malware delivery vectors',g3t:'Lookalike domain attacks bypassing traditional spam filters',
      cust_tag:'Customer stories',cust_title:'Trusted by security-conscious professionals',
      t1q:'Sentinel flagged a sophisticated spear-phishing campaign targeting our finance team that had been running for three weeks. The DMARC analysis alone was worth it.',
      t2q:'I was sceptical about connecting my inbox, but the read-only OAuth is genuinely reassuring. The report found a credential-phishing thread I had missed for months.',
      t3q:'The attachment intelligence caught a macro-laden Excel file that our AV missed entirely. The report was clear, actionable and explained the exact risk level in plain language.',
      partners_lbl:'Trusted by professionals at leading institutions',
      cta_title:'Start protecting your inbox today',cta_sub:'Join thousands of professionals who run Sentinel to stay ahead of phishing, malware, and social engineering attacks. Free, no credit card required.',
      cta_btn:'Start Free Scan',cta_priv:'Privacy Policy',
      footer_brand:'AI-powered Gmail security intelligence. Deep threat analysis with zero footprint on your messages.',
      fc1h:'Product',fc1_1:'Features',fc1_2:'How it works',fc1_3:'Customers',fc1_4:'Get started',
      fc2h:'Legal',fc2_1:'Privacy Policy',fc2_2:'Terms of Use',
      fc3h:'Security',fc3_1:'Revoke Gmail access',fc3_2:'Data handling',
      footer_copy:'© 2025 Sentinel. All rights reserved.',fl_priv:'Privacy Policy',fl_terms:'Terms of Use'
    },
    es:{
      nav_cta:'Analizar bandeja',
      hero_chip:'Seguridad de Bandeja con IA',
      hero_h1:'Tu Gmail.<br>Protegido por <span class="g-blue">inteligencia</span>,<br>asegurado con <span class="g-green">confianza</span>.',
      hero_desc:'Sentinel realiza un análisis de seguridad profundo de tu bandeja de Gmail — detecta campañas de phishing, firmas de malware y remitentes falsificados — y entrega un informe completo de amenazas en minutos.',
      hero_cta:'Iniciar escaneo gratis',hero_how:'Cómo funciona',
      trust1:'Solo lectura',trust2:'Sin mensajes almacenados',trust3:'Revoca en cualquier momento',
      stat1:'Amenazas detectadas globalmente',stat2:'Tasa de detección de phishing',stat3:'Tiempo medio de análisis',stat4:'Mensajes leídos o almacenados',
      feat_tag:'Capacidades de seguridad',feat_title:'Protección empresarial,<br>para todos',feat_sub:'Seis capas de análisis inteligente trabajando simultáneamente en cada mensaje de tu bandeja, sin leer ni una sola palabra.',
      f1t:'Detección de Phishing',f1d:'Identifica campañas de captura de credenciales, páginas de inicio de sesión falsas y dominios similares. Detecta ataques que pasan los filtros de spam estándar.',
      f2t:'Firmas de Malware',f2d:'Escanea los metadatos de los adjuntos contra patrones de malware conocidos. Detecta exploits de macros de Office, amenazas en PDF y cargas en archivos comprimidos.',
      f3t:'Análisis de Enlaces Sospechosos',f3d:'Resuelve cadenas de redirección y detecta acortadores de URL que ocultan destinos maliciosos. Señala discrepancias en el texto ancla y dominios con typosquatting.',
      f4t:'SPF / DKIM / DMARC',f4d:'Análisis completo de cabeceras de autenticación en cada mensaje. Detecta remitentes falsificados e impersonación de dominios incluso cuando los certificados parecen válidos.',
      f5t:'Inteligencia de Adjuntos',f5d:'Analiza tipos de archivo, extensiones dobles, archivos protegidos con contraseña y scripts embebidos, antes de que se abra o descargue cualquier archivo.',
      f6t:'Informe de Amenazas',f6d:'Entrega un informe de seguridad estructurado con puntuaciones de riesgo, resúmenes de hallazgos y recomendaciones prácticas, no solo una lista de alertas.',
      how_tag:'Cómo funciona',how_title:'Inteligencia de seguridad en tres pasos',
      s1t:'Crea tu cuenta gratuita',s1d:'Introduce tu nombre y correo electrónico. Sin datos de pago, sin compromisos.',
      s2t:'Conecta mediante Google OAuth o IMAP',s2d:'El consentimiento OAuth de un clic concede a Sentinel acceso de solo lectura. No se almacena ninguna contraseña. Revoca al instante desde tu cuenta de Google.',
      s3t:'Recibe tu informe de seguridad',s3d:'Seis motores de análisis paralelos escanean tu bandeja. Un informe estructurado aparece en tiempo real, cubriendo phishing, malware, enlaces, cabeceras y más.',
      gal_tag:'Galería',gal_title:'El panorama de amenazas, visualizado',gal_sub:'Amenazas de correo electrónico del mundo real que Sentinel identifica cada día en bandejas conectadas de todo el mundo.',
      g1t:'Campañas de captura de credenciales dirigidas a cuentas empresariales',g2t:'Documentos Office con macros usados como vectores de distribución de malware',g3t:'Ataques de dominio similar que eluden los filtros de spam tradicionales',
      cust_tag:'Customer stories',cust_title:'La confianza de profesionales conscientes de la seguridad',
      t1q:'Sentinel detectó una sofisticada campaña de spear-phishing dirigida a nuestro equipo de finanzas que llevaba tres semanas activa. Solo el análisis DMARC ya valió la pena.',
      t2q:'Era escéptico sobre conectar mi bandeja, pero el OAuth de solo lectura es realmente tranquilizador. El informe encontró un hilo de phishing de credenciales que había pasado por alto durante meses.',
      t3q:'La inteligencia de adjuntos detectó un archivo Excel con macros que nuestro antivirus no detectó. El informe fue claro, práctico y explicó el nivel de riesgo exacto en lenguaje sencillo.',
      partners_lbl:'La confianza de profesionales en instituciones líderes',
      cta_title:'Empieza a proteger tu bandeja hoy',cta_sub:'Únete a miles de profesionales que usan Sentinel para adelantarse al phishing, malware e ingeniería social. Gratis, sin tarjeta de crédito.',
      cta_btn:'Iniciar escaneo gratis',cta_priv:'Política de Privacidad',
      footer_brand:'Inteligencia de seguridad Gmail con IA. Análisis profundo de amenazas sin huella en tus mensajes.',
      fc1h:'Producto',fc1_1:'Características',fc1_2:'Cómo funciona',fc1_3:'Clientes',fc1_4:'Empezar',
      fc2h:'Legal',fc2_1:'Política de Privacidad',fc2_2:'Condiciones de Uso',
      fc3h:'Security',fc3_1:'Revocar acceso Gmail',fc3_2:'Gestión de datos',
      footer_copy:'© 2025 Sentinel. Todos los derechos reservados.',fl_priv:'Política de Privacidad',fl_terms:'Condiciones de Uso'
    }
  };

  function setTextNode(id,text){
    var el=document.getElementById(id);
    if(!el) return;
    for(var i=0;i<el.childNodes.length;i++){
      if(el.childNodes[i].nodeType===3){el.childNodes[i].nodeValue=' '+text+' ';return;}
    }
    el.textContent=text;
  }

  function setLang(l){
    try{localStorage.setItem('sentinel_lang',l);}catch(e){}
    document.documentElement.lang=l;
    const btnEn = document.getElementById('btn-en');
    const btnEs = document.getElementById('btn-es');
    if (btnEn) btnEn.classList.toggle('active',l==='en');
    if (btnEs) btnEs.classList.toggle('active',l==='es');
    
    var d=T[l];
    if (!d) return;

    const navCta = document.getElementById('nav-cta-text'); if(navCta) navCta.textContent=d.nav_cta;
    const heroChip = document.getElementById('hero-chip'); if(heroChip) heroChip.textContent=d.hero_chip;
    const heroH1 = document.getElementById('hero-h1'); if(heroH1) heroH1.innerHTML=d.hero_h1;
    const heroDesc = document.getElementById('hero-desc'); if(heroDesc) heroDesc.textContent=d.hero_desc;
    
    setTextNode('hero-cta',d.hero_cta);
    const heroHow = document.getElementById('hero-how'); if(heroHow) heroHow.textContent=d.hero_how;

    ['trust1','trust2','trust3','stat1-lbl','stat2-lbl','stat3-lbl','stat4-lbl',
     'feat-tag','feat-sub','how-tag','how-title','s1t','s1d','s2t','s2d','s3t','s3d',
     'gal-tag','gal-title','gal-sub','g1t','g2t','g3t','cust-tag','cust-title',
     't1q','t2q','t3q','partners-lbl','cta-title','cta-sub',
     'footer-brand-txt','fc1h','fc1-1','fc1-2','fc1-3','fc1-4',
     'fc2h','fc2-1','fc2-2','fc3h','fc3-1','fc3-2','footer-copy','fl-priv','fl-terms'
    ].forEach(function(id){
      var map={
        'stat1_lbl':'stat1','stat2_lbl':'stat2','stat3_lbl':'stat3','stat4_lbl':'stat4',
        'trust1':'trust1','trust2':'trust2','trust3':'trust3',
        'footer_brand_txt':'footer_brand'
      };
      var key=map[id.replace(/-/g,'_')] || id.replace(/-/g,'_');
      var el=document.getElementById(id);
      if(el&&d[key]!==undefined) el.textContent=d[key];
    });

    const featTitle = document.getElementById('feat-title'); if(featTitle) featTitle.innerHTML=d.feat_title;
    ['f1t','f1d','f2t','f2d','f3t','f3d','f4t','f4d','f5t','f5d','f6t','f6d'].forEach(function(id){
      var el=document.getElementById(id); if(el&&d[id])el.textContent=d[id];
    });
    setTextNode('cta-btn',d.cta_btn);
    var cp=document.getElementById('cta-priv'); if(cp) cp.textContent=d.cta_priv;
  }

  // ── Event Listeners (CSP compliant) ──────────────────────────────────────────
  document.addEventListener('DOMContentLoaded', function() {
    const btnEn = document.getElementById('btn-en');
    const btnEs = document.getElementById('btn-es');
    if (btnEn) btnEn.addEventListener('click', function() { setLang('en'); });
    if (btnEs) btnEs.addEventListener('click', function() { setLang('es'); });

    try {
      setLang(localStorage.getItem('sentinel_lang') || 'en');
    } catch(e) {
      setLang('en');
    }
  });

  window.setLang = setLang;
}());
