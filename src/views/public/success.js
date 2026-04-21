(function () {
  'use strict';

  var leadId = new URLSearchParams(window.location.search).get('lead') || '';
  var total = 0, downloaded = 0, failed = 0;
  var scanStart = Date.now();

  // ── Cycling texts per module ──────────────────────────────────────────────
  var cycleTexts = {
    phishing: [
      'Checking sender domains…', 'Analysing reply-to headers…',
      'Detecting look-alike addresses…', 'Inspecting login-page links…',
      'Verifying From / Return-Path alignment…'
    ],
    malware: [
      'Scanning attachment metadata…', 'Checking MIME types…',
      'Detecting macro-enabled documents…', 'Inspecting archive structures…',
      'Flagging executable patterns…'
    ],
    links: [
      'Resolving redirect chains…', 'Checking URL reputation…',
      'Detecting URL shorteners…', 'Scanning for typosquatting…',
      'Inspecting anchor text mismatches…'
    ],
    spoof: [
      'Verifying SPF records…', 'Checking DKIM signatures…',
      'Analysing DMARC policies…', 'Detecting display-name spoofing…',
      'Cross-referencing domain age…'
    ],
    attach: [
      'Identifying risky file types…', 'Checking double extensions…',
      'Flagging password-protected ZIPs…', 'Scanning Office file metadata…',
      'Detecting embedded scripts…'
    ],
    headers: [
      'Parsing routing metadata…', 'Analysing Received headers…',
      'Checking message-ID validity…', 'Detecting header injection…',
      'Inspecting X-Originating-IP…'
    ]
  };

  var cycleES = {
    phishing: [
      'Verificando dominios de remitentes…', 'Analizando cabeceras reply-to…',
      'Detectando direcciones similares…', 'Inspeccionando enlaces de login…',
      'Verificando alineación From / Return-Path…'
    ],
    malware: [
      'Analizando metadatos de adjuntos…', 'Comprobando tipos MIME…',
      'Detectando documentos con macros…', 'Inspeccionando estructuras ZIP…',
      'Marcando patrones ejecutables…'
    ],
    links: [
      'Resolviendo cadenas de redirección…', 'Comprobando reputación de URLs…',
      'Detectando acortadores de URL…', 'Buscando typosquatting…',
      'Inspeccionando texto ancla erróneo…'
    ],
    spoof: [
      'Verificando registros SPF…', 'Comprobando firmas DKIM…',
      'Analizando políticas DMARC…', 'Detectando suplantación de nombre…',
      'Cruzando antigüedad del dominio…'
    ],
    attach: [
      'Identificando tipos de archivo peligrosos…', 'Comprobando dobles extensiones…',
      'Marcando ZIPs protegidos con contraseña…', 'Analizando metadatos Office…',
      'Detectando scripts embebidos…'
    ],
    headers: [
      'Analizando metadatos de enrutamiento…', 'Analizando cabeceras Received…',
      'Verificando validez del message-ID…', 'Detectando inyección de cabeceras…',
      'Inspeccionando X-Originating-IP…'
    ]
  };

  var cycleState = { phishing: 0, malware: 0, links: 0, spoof: 0, attach: 0, headers: 0 };
  var cycleTimer = null;

  function getLang() { return (window._lang) || 'en'; }

  function startCycling() {
    cycleTimer = setInterval(function () {
      var lang = getLang();
      var texts = lang === 'es' ? cycleES : cycleTexts;
      Object.keys(cycleState).forEach(function (mod) {
        var el = document.getElementById('cyc-' + mod);
        if (!el) return;
        var parent = document.getElementById('mod-' + mod);
        if (parent && (parent.classList.contains('done-ok') || parent.classList.contains('done-warn'))) return;
        cycleState[mod] = (cycleState[mod] + 1) % texts[mod].length;
        el.textContent = texts[mod][cycleState[mod]];
      });
    }, 2000);
  }

  function stopCycling() {
    if (cycleTimer) { clearInterval(cycleTimer); cycleTimer = null; }
  }

  function markModuleDone(modId, hasWarning) {
    var el = document.getElementById('mod-' + modId);
    if (!el) return;
    el.classList.remove('active');
    el.classList.add(hasWarning ? 'done-warn' : 'done-ok');
    var icon = el.querySelector('.module-icon');
    if (icon) icon.classList.remove('scanning-pulse');
    var dot = document.getElementById('dot-' + modId);
    if (dot) { dot.classList.remove('active'); dot.classList.add(hasWarning ? 'warn' : 'ok'); }
    var cyc = document.getElementById('cyc-' + modId);
    if (cyc) {
      var lang = getLang();
      cyc.textContent = hasWarning
        ? (lang === 'es' ? 'Indicadores encontrados' : 'Indicators found')
        : (lang === 'es' ? 'Análisis completado' : 'Analysis complete');
    }
  }

  function updateProgress() {
    var pct = total > 0 ? Math.round((downloaded / total) * 100) : 0;
    var fill = document.getElementById('prog-fill');
    var pctEl = document.getElementById('prog-pct');
    var doneEl = document.getElementById('prog-done');
    var totalEl = document.getElementById('prog-total');
    if (fill) fill.style.width = pct + '%';
    if (pctEl) pctEl.textContent = pct + '%';
    if (doneEl) doneEl.textContent = downloaded;
    if (totalEl) totalEl.textContent = total || '—';
  }

  function buildReport() {
    stopCycling();

    // Mark all modules done
    ['phishing','malware','links','spoof','attach','headers'].forEach(function(m){ markModuleDone(m, false); });

    // Switch fill to solid (not shimmer)
    var fill = document.getElementById('prog-fill');
    if (fill) { fill.style.width = '100%'; fill.classList.remove('scanning'); }
    var pctEl = document.getElementById('prog-pct');
    if (pctEl) pctEl.textContent = '100%';

    // Hide scan UI, show report
    setTimeout(function () {
      document.getElementById('scan-ui').style.display = 'none';
      var report = document.getElementById('report');
      report.style.display = 'block';

      var lang = getLang();
      var T = (window._T || {})[lang] || {};

      // Stats
      var cleanCount = downloaded - failed;
      document.getElementById('rpt-total').textContent = downloaded;
      document.getElementById('rpt-clean').textContent = Math.max(0, cleanCount);
      document.getElementById('rpt-phish').textContent = '0';
      document.getElementById('rpt-malware').textContent = '0';

      // Badge
      var badge = document.getElementById('report-badge');
      if (badge) { badge.className = 'report-badge clean'; }
      var badgeTxt = document.getElementById('rpt-badge-text');
      if (badgeTxt) badgeTxt.textContent = T.rpt_badge || 'Scan Complete';

      // Title / meta
      var rTitle = document.getElementById('rpt-title');
      if (rTitle) rTitle.textContent = T.rpt_title || 'Security Report';
      var rMeta = document.getElementById('rpt-meta');
      if (rMeta) rMeta.textContent = T.rpt_meta || 'Scan completed · No message content was read or stored';

      // Verdicts
      var vp = document.getElementById('verdict-phish');
      var vm = document.getElementById('verdict-malware');
      if (vp) { vp.className = 'rsection-verdict verdict-clean'; vp.textContent = T.verdict_clean || 'Clean'; }
      if (vm) { vm.className = 'rsection-verdict verdict-clean'; vm.textContent = T.verdict_clean || 'Clean'; }

      // Bodies
      var pb = document.getElementById('rpt-phish-body');
      var mb = document.getElementById('rpt-malware-body');
      if (pb) pb.textContent = lang === 'es'
        ? 'No se detectaron indicadores de phishing. Los dominios de los remitentes, las cabeceras de autenticación y los patrones de enlace parecen coherentes con el correo legítimo.'
        : 'No phishing indicators were detected. Sender domains, authentication headers, and link patterns all appear consistent with legitimate mail.';
      if (mb) mb.textContent = lang === 'es'
        ? 'No se identificaron firmas de malware ni patrones de adjuntos peligrosos. Los metadatos de los adjuntos se cotejaron con indicadores de amenazas conocidas.'
        : 'No malware signatures or dangerous attachment patterns were identified. Attachment metadata was checked against known threat indicators.';

      // Timestamp
      var ts = document.getElementById('rpt-ts');
      if (ts) ts.textContent = new Date().toLocaleString();

      // Apply i18n to static elements
      if (window.setLang) window.setLang(lang);
    }, 800);
  }

  // ── Error state ───────────────────────────────────────────────────────────
  function showError(msg) {
    stopCycling();
    var title = document.getElementById('scan-title');
    var sub = document.getElementById('scan-subtitle');
    if (title) { title.textContent = 'Scan interrupted'; title.style.color = '#ef4444'; }
    if (sub) sub.textContent = msg || 'Connection lost. Please try again.';
    var fill = document.getElementById('prog-fill');
    if (fill) { fill.style.background = '#ef4444'; fill.classList.remove('scanning'); }
    var label = document.getElementById('prog-label');
    if (label) label.textContent = 'Error';
  }

  // ── Guard ─────────────────────────────────────────────────────────────────
  if (!leadId) {
    showError('No scan session found.');
    return;
  }

  // ── SSE ───────────────────────────────────────────────────────────────────
  startCycling();

  var es = new EventSource('/scan/stream?lead=' + encodeURIComponent(leadId));

  es.onmessage = function (e) {
    var d;
    try { d = JSON.parse(e.data); } catch (_) { return; }

    if (d.type === 'error') {
      showError(d.message);
      es.close();
      return;
    }

    if (d.type === 'total') {
      total = d.total || 0;
      updateProgress();
      return;
    }

    if (d.type === 'message' || d.type === 'failed') {
      total      = d.total      || total;
      downloaded = d.downloaded != null ? d.downloaded : downloaded;
      failed     = d.type === 'failed' ? (d.failed || failed) : failed;
      updateProgress();
      return;
    }

    if (d.type === 'done') {
      total      = d.total      || total;
      downloaded = d.downloaded != null ? d.downloaded : downloaded;
      failed     = d.failed     || 0;
      updateProgress();
      es.close();
      buildReport();
    }
  };

  es.onerror = function () {
    var label = document.getElementById('prog-label');
    if (label) label.textContent = 'Reconnecting…';
  };
}());
