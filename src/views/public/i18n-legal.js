(function(){
  var T = {
    en: {
      nav_home: 'Home', nav_privacy: 'Privacy Policy', nav_terms: 'Terms of Use', nav_apply: 'Get started',
      footer_copy: '© 2025 Sentinel', footer_privacy: 'Privacy Policy', footer_terms: 'Terms of Use', footer_home: 'Home',
      page_tag: 'Legal'
    },
    es: {
      nav_home: 'Inicio', nav_privacy: 'Política de Privacidad', nav_terms: 'Condiciones de Uso', nav_apply: 'Empezar',
      footer_copy: '© 2025 Sentinel', footer_privacy: 'Política de Privacidad', footer_terms: 'Condiciones de Uso', footer_home: 'Inicio',
      page_tag: 'Legal'
    }
  };

  // Page-specific translations
  var pageT = {
    privacy: {
      en: {
        page_title: 'Privacy Policy',
        page_sub: 'How Sentinel handles your data — written in plain language, not legalese. Last updated: January 2025.',
        summary: 'Plain-language summary: Sentinel scans your inbox metadata to produce a security report and submits only that report. No message content is ever read, copied, downloaded, or transmitted to any server. No action is taken on any message.',
        s1_title: '1. What we collect',
        s1_intro: 'When you create a Sentinel account, we collect the following information:',
        s1_li1: 'Your name and email address, used to identify your account.',
        s1_li2: 'An encrypted OAuth refresh token, which allows Sentinel to maintain read-only Gmail access across sessions.',
        s1_li3: 'Aggregate scan statistics (total messages scanned, threat counts) included in your security report.',
        s1_li4: 'Standard server access logs (IP address, user agent, timestamp) for security and abuse prevention.',
        s1_outro: 'We do not collect the content, subject lines, sender addresses, or body text of any email messages.',
        s2_title: '2. How we use your Gmail access',
        s2_intro: 'Sentinel connects to Gmail using Google OAuth with the read-only scope (gmail.readonly). This access is used exclusively to:',
        s2_li1: 'Count and enumerate message metadata (message IDs, date ranges) to determine scan scope.',
        s2_li2: 'Analyse message header fields — From, To, Reply-To, Received, SPF results, DKIM signatures, and DMARC policy — for authentication and spoofing indicators.',
        s2_li3: 'Inspect attachment MIME type metadata (filename, content type, size) for malware pattern matching.',
        s2_li4: 'Extract and evaluate hyperlink URLs for redirect chains and domain reputation signals.',
        s2_box: 'At no point does Sentinel read, reproduce, copy, store, transmit, display, or process the text body or HTML content of any email. Message content is never accessed by any Sentinel system or personnel.',
        s3_title: '3. Data storage and retention',
        s3_p1: 'Account data (name, email address, encrypted token) is stored in an encrypted database on our servers. Scan report results are stored temporarily and associated with your account for up to 30 days.',
        s3_p2: 'Access logs are retained for up to 90 days for security purposes, after which they are permanently deleted.',
        s3_p3: 'You may request deletion of all your account data at any time. Upon deletion, all associated records including your token and scan history are permanently removed.',
        s4_title: '4. Third-party sharing',
        s4_p1: 'Sentinel does not sell, rent, or share your personal data with any third parties for marketing or commercial purposes.',
        s4_p2: 'We may share anonymised, aggregate statistics (e.g. "X% of scanned inboxes contained phishing indicators") for research and product improvement purposes. These statistics contain no personally identifiable information.',
        s4_p3: 'We may disclose account information where required by applicable law, court order, or governmental authority.',
        s5_title: '5. Your rights and controls',
        s5_li1: 'Revoke Gmail access at any time from myaccount.google.com/permissions. Revoking access stops all future scans immediately.',
        s5_li2: 'Request account deletion by contacting us. All data is permanently deleted within 7 days.',
        s5_li3: 'Access your data — you may request a copy of all personal data we hold about you.',
        s5_li4: 'Correct inaccuracies — you may request correction of any inaccurate account data.',
        s6_title: '6. Contact',
        s6_p1: 'For privacy enquiries, data deletion requests, or questions about this policy, please use the account settings page or contact our support team.',
        s6_p2: 'This policy may be updated periodically. Continued use of Sentinel after a policy update constitutes acceptance of the revised terms.'
      },
      es: {
        page_title: 'Política de Privacidad',
        page_sub: 'Cómo Sentinel gestiona tus datos — escrito en lenguaje sencillo, sin tecnicismos legales. Última actualización: enero de 2025.',
        summary: 'Resumen simplificado: Sentinel analiza los metadatos de tu bandeja de entrada para generar un informe de seguridad y solo envía ese informe. Nunca se lee, copia, descarga ni transmite contenido de mensajes a ningún servidor. No se toma ninguna acción sobre ningún mensaje.',
        s1_title: '1. Qué recopilamos',
        s1_intro: 'Al crear una cuenta en Sentinel, recopilamos la siguiente información:',
        s1_li1: 'Tu nombre y dirección de correo electrónico, utilizados para identificar tu cuenta.',
        s1_li2: 'Un token de actualización OAuth cifrado, que permite a Sentinel mantener el acceso de solo lectura a Gmail entre sesiones.',
        s1_li3: 'Estadísticas agregadas del análisis (total de mensajes analizados, recuento de amenazas) incluidas en tu informe de seguridad.',
        s1_li4: 'Registros de acceso estándar del servidor (dirección IP, agente de usuario, marca de tiempo) para la seguridad y prevención de abusos.',
        s1_outro: 'No recopilamos el contenido, las líneas de asunto, las direcciones de remitentes ni el texto del cuerpo de ningún mensaje de correo electrónico.',
        s2_title: '2. Cómo usamos tu acceso a Gmail',
        s2_intro: 'Sentinel se conecta a Gmail mediante Google OAuth con el alcance de solo lectura (gmail.readonly). Este acceso se utiliza exclusivamente para:',
        s2_li1: 'Contar y enumerar los metadatos de los mensajes (IDs de mensajes, rangos de fechas) para determinar el alcance del análisis.',
        s2_li2: 'Analizar los campos de cabecera de los mensajes — De, Para, Responder a, Recibido, resultados SPF, firmas DKIM y política DMARC — para indicadores de autenticación y suplantación de identidad.',
        s2_li3: 'Inspeccionar los metadatos de tipo MIME de los archivos adjuntos (nombre de archivo, tipo de contenido, tamaño) para detectar patrones de malware.',
        s2_li4: 'Extraer y evaluar las URL de los hipervínculos para detectar cadenas de redirección y señales de reputación de dominios.',
        s2_box: 'En ningún momento Sentinel lee, reproduce, copia, almacena, transmite, muestra ni procesa el cuerpo de texto o el contenido HTML de ningún correo electrónico. Ningún sistema o personal de Sentinel accede nunca al contenido de los mensajes.',
        s3_title: '3. Almacenamiento y retención de datos',
        s3_p1: 'Los datos de la cuenta (nombre, dirección de correo electrónico, token cifrado) se almacenan en una base de datos cifrada en nuestros servidores. Los resultados del informe de análisis se almacenan temporalmente y se asocian a tu cuenta durante un máximo de 30 días.',
        s3_p2: 'Los registros de acceso se conservan durante un máximo de 90 días por motivos de seguridad, tras los cuales se eliminan de forma permanente.',
        s3_p3: 'Puedes solicitar la eliminación de todos los datos de tu cuenta en cualquier momento. Tras la eliminación, se borran de forma permanente todos los registros asociados, incluidos el token y el historial de análisis.',
        s4_title: '4. Compartir con terceros',
        s4_p1: 'Sentinel no vende, alquila ni comparte tus datos personales con ningún tercero con fines de marketing o comerciales.',
        s4_p2: 'Podemos compartir estadísticas anónimas y agregadas (p. ej., "X% de las bandejas analizadas contenían indicadores de phishing") con fines de investigación y mejora del producto. Estas estadísticas no contienen información de identificación personal.',
        s4_p3: 'Podemos divulgar información de la cuenta cuando lo exija la legislación aplicable, una orden judicial o una autoridad gubernamental.',
        s5_title: '5. Tus derechos y controles',
        s5_li1: 'Revoca el acceso a Gmail en cualquier momento desde myaccount.google.com/permissions. La revocación del acceso detiene inmediatamente todos los análisis futuros.',
        s5_li2: 'Solicita la eliminación de la cuenta poniéndote en contacto con nosotros. Todos los datos se eliminan de forma permanente en un plazo de 7 días.',
        s5_li3: 'Accede a tus datos — puedes solicitar una copia de todos los datos personales que conservamos sobre ti.',
        s5_li4: 'Corrige inexactitudes — puedes solicitar la corrección de cualquier dato de cuenta inexacto.',
        s6_title: '6. Contacto',
        s6_p1: 'Para consultas sobre privacidad, solicitudes de eliminación de datos o preguntas sobre esta política, utiliza la página de configuración de la cuenta o ponte en contacto con nuestro equipo de soporte.',
        s6_p2: 'Esta política puede actualizarse periódicamente. El uso continuado de Sentinel tras una actualización de la política implica la aceptación de los términos revisados.'
      }
    },
    terms: {
      en: {
        page_title: 'Terms of Use',
        page_sub: 'The conditions under which you may use the Sentinel security scanning service. Last updated: January 2025.',
        summary: 'Key point: By connecting your Gmail account, you grant Sentinel temporary read-only access solely for generating a security analysis report. Sentinel takes no action on any message. No message content is read, stored, or transmitted.',
        s1_title: '1. Acceptance of terms',
        s1_p1: 'By accessing Sentinel at any domain operated by us, creating an account, or connecting a Gmail account, you agree to be bound by these Terms of Use and our Privacy Policy.',
        s1_p2: 'If you do not agree to these terms, you must not use the service. Use of the service by persons under 16 years of age is not permitted.',
        s2_title: '2. Scope of service',
        s2_intro: 'Sentinel is a security diagnostic tool. By using the service, you authorise Sentinel to:',
        s2_li1: 'Access your Gmail account with read-only permissions via Google OAuth or IMAP.',
        s2_li2: 'Analyse message metadata, authentication headers, attachment type information, and hyperlink structures for security indicators.',
        s2_li3: 'Generate and store a security report associated with your account.',
        s2_box: 'Sentinel will never send, forward, delete, move, label, archive, or otherwise take any action on any message in your inbox. The service is strictly read-only at all times.',
        s3_title: '3. Disclaimers and limitations',
        s3_intro: 'The service is provided "as is" and "as available" without warranties of any kind, either express or implied.',
        s3_li1: 'Sentinel does not guarantee that all threats present in your inbox will be detected. No security tool achieves 100% detection rates.',
        s3_li2: 'Sentinel is a diagnostic tool only. You are solely responsible for evaluating the report findings and deciding what protective action, if any, to take.',
        s3_li3: 'Sentinel is not liable for any direct, indirect, incidental, or consequential damages arising from your use of the service or reliance on report findings.',
        s3_li4: 'The service may be interrupted, modified, or discontinued at any time without notice.',
        s4_title: '4. Acceptable use',
        s4_intro: 'You agree not to:',
        s4_li1: 'Use the service to scan Gmail accounts you do not own or have explicit permission to scan.',
        s4_li2: 'Attempt to reverse-engineer, decompile, or tamper with the service infrastructure.',
        s4_li3: 'Use the service for any unlawful purpose or in violation of Google\'s Terms of Service.',
        s4_li4: 'Circumvent rate limits, authentication mechanisms, or other security controls.',
        s5_title: '5. Termination and access revocation',
        s5_p1: 'You may terminate your use of the service at any time by revoking Gmail access from your Google account settings at myaccount.google.com/permissions.',
        s5_p2: 'We reserve the right to suspend or terminate accounts that violate these terms, engage in abusive behaviour, or pose a security risk to the service.',
        s5_p3: 'Upon termination, your right to use the service ceases immediately. You may request deletion of all associated data per our Privacy Policy.',
        s6_title: '6. Governing law and changes',
        s6_p1: 'These terms are governed by applicable law. We reserve the right to update these terms at any time. Continued use of the service after an update constitutes acceptance of the revised terms.',
        s6_p2: 'For questions about these terms, contact us through the account settings page.'
      },
      es: {
        page_title: 'Condiciones de Uso',
        page_sub: 'Las condiciones bajo las cuales puedes utilizar el servicio de análisis de seguridad Sentinel. Última actualización: enero de 2025.',
        summary: 'Punto clave: Al conectar tu cuenta de Gmail, concedes a Sentinel acceso temporal de solo lectura únicamente para generar un informe de análisis de seguridad. Sentinel no realiza ninguna acción sobre ningún mensaje. No se lee, almacena ni transmite ningún contenido de mensajes.',
        s1_title: '1. Aceptación de los términos',
        s1_p1: 'Al acceder a Sentinel en cualquier dominio operado por nosotros, crear una cuenta o conectar una cuenta de Gmail, aceptas quedar vinculado por estas Condiciones de Uso y nuestra Política de Privacidad.',
        s1_p2: 'Si no estás de acuerdo con estas condiciones, no debes utilizar el servicio. El uso del servicio por personas menores de 16 años no está permitido.',
        s2_title: '2. Alcance del servicio',
        s2_intro: 'Sentinel es una herramienta de diagnóstico de seguridad. Al utilizar el servicio, autorizas a Sentinel a:',
        s2_li1: 'Acceder a tu cuenta de Gmail con permisos de solo lectura mediante Google OAuth o IMAP.',
        s2_li2: 'Analizar los metadatos de los mensajes, las cabeceras de autenticación, la información del tipo de archivo adjunto y las estructuras de hipervínculos en busca de indicadores de seguridad.',
        s2_li3: 'Generar y almacenar un informe de seguridad asociado a tu cuenta.',
        s2_box: 'Sentinel nunca enviará, reenviará, eliminará, moverá, etiquetará, archivará ni realizará ninguna otra acción en ningún mensaje de tu bandeja de entrada. El servicio es estrictamente de solo lectura en todo momento.',
        s3_title: '3. Exenciones de responsabilidad y limitaciones',
        s3_intro: 'El servicio se proporciona "tal cual" y "según disponibilidad" sin garantías de ningún tipo, ya sean expresas o implícitas.',
        s3_li1: 'Sentinel no garantiza que se detecten todas las amenazas presentes en tu bandeja de entrada. Ninguna herramienta de seguridad alcanza tasas de detección del 100%.',
        s3_li2: 'Sentinel es únicamente una herramienta de diagnóstico. Eres el único responsable de evaluar los resultados del informe y de decidir qué medidas de protección tomar, si las hubiera.',
        s3_li3: 'Sentinel no es responsable de ningún daño directo, indirecto, incidental o consecuente derivado del uso del servicio o de la dependencia de los resultados del informe.',
        s3_li4: 'El servicio puede interrumpirse, modificarse o discontinuarse en cualquier momento sin previo aviso.',
        s4_title: '4. Uso aceptable',
        s4_intro: 'Aceptas no:',
        s4_li1: 'Usar el servicio para analizar cuentas de Gmail que no sean de tu propiedad o para las que no tengas permiso explícito.',
        s4_li2: 'Intentar realizar ingeniería inversa, descompilar o manipular la infraestructura del servicio.',
        s4_li3: 'Usar el servicio para cualquier propósito ilegal o en violación de las Condiciones de Servicio de Google.',
        s4_li4: 'Eludir los límites de velocidad, los mecanismos de autenticación u otros controles de seguridad.',
        s5_title: '5. Rescisión y revocación de acceso',
        s5_p1: 'Puedes dejar de usar el servicio en cualquier momento revocando el acceso a Gmail desde la configuración de tu cuenta de Google en myaccount.google.com/permissions.',
        s5_p2: 'Nos reservamos el derecho de suspender o cancelar cuentas que violen estas condiciones, incurran en comportamientos abusivos o supongan un riesgo de seguridad para el servicio.',
        s5_p3: 'Tras la rescisión, tu derecho a utilizar el servicio cesa inmediatamente. Puedes solicitar la eliminación de todos los datos asociados conforme a nuestra Política de Privacidad.',
        s6_title: '6. Legislación aplicable y cambios',
        s6_p1: 'Estas condiciones se rigen por la legislación aplicable. Nos reservamos el derecho de actualizar estas condiciones en cualquier momento. El uso continuado del servicio tras una actualización implica la aceptación de los términos revisados.',
        s6_p2: 'Para preguntas sobre estas condiciones, contáctanos a través de la página de configuración de la cuenta.'
      }
    }
  };

  function setLang(l) {
    try { localStorage.setItem('sentinel_lang', l); } catch (e) { }
    document.documentElement.lang = l;
    var btnEn = document.getElementById('btn-en');
    var btnEs = document.getElementById('btn-es');
    if (btnEn) btnEn.classList.toggle('active', l === 'en');
    if (btnEs) btnEs.classList.toggle('active', l === 'es');

    var common = T[l];
    var path = window.location.pathname;
    var pageKey = path.includes('privacy') ? 'privacy' : (path.includes('terms') ? 'terms' : null);
    
    if (!pageKey) return;
    var page = pageT[pageKey][l];

    // Combine for easier access
    var d = Object.assign({}, common, page);

    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var k = el.getAttribute('data-i18n');
      if (d[k] !== undefined) el.textContent = d[k];
    });

    // Update nav links text
    var nh = document.querySelector('.nav-links a[href="/"]'); if (nh) nh.textContent = d.nav_home;
    var np = document.querySelector('.nav-links a[href="/privacy"]'); if (np) np.textContent = d.nav_privacy;
    var nt = document.querySelector('.nav-links a[href="/terms"]'); if (nt) nt.textContent = d.nav_terms;
    var na = document.querySelector('.nav-links a[href="/apply"]'); if (na) na.textContent = d.nav_apply;

    // Update footer
    var fc = document.querySelector('footer span'); if (fc) fc.textContent = d.footer_copy;
    var flinks = document.querySelectorAll('.footer-links a');
    if (flinks[0]) flinks[0].textContent = d.footer_privacy;
    if (flinks[1]) flinks[1].textContent = d.footer_terms;
    if (flinks[2]) flinks[2].textContent = d.footer_home;
  }

  window.setLang = setLang;
  
  // Attach event listeners to buttons
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
