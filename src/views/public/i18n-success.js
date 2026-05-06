'use strict';

(function(){
  var T={
    en:{
      scan_title:'Scanning your inbox…',
      scan_subtitle:'Analysing messages for security threats. No content is read or stored.',
      prog_of:'of',prog_emails:'messages scanned',
      mod_phishing:'Phishing Detection',mod_malware:'Malware Signatures',mod_links:'Suspicious Links',
      mod_spoof:'Domain Spoofing',mod_attach:'Dangerous Attachments',mod_headers:'Header Analysis',
      rpt_total:'Scanned',rpt_clean:'Clean',rpt_phish:'Phishing',rpt_malware:'Malware',
      rpt_phish_title:'Phishing Analysis',rpt_malware_title:'Malware Analysis',
      phish_li1:'Sender domain reputation: checked',phish_li2:'SPF / DKIM / DMARC header analysis: complete',
      phish_li3:'Look-alike domain detection: no matches found',phish_li4:'Credential-harvest link patterns: none detected',
      malware_li1:'Attachment file-type analysis: complete',malware_li2:'Office macro indicators: none detected',
      malware_li3:'Executable or script attachments: none found',malware_li4:'Archive (ZIP/RAR) threat patterns: none detected',
      rpt_footer:'Sentinel is a diagnostic tool. Results are based on metadata analysis only.',
      verdict_clean:'Clean',rpt_badge:'Scan Complete',rpt_title:'Security Report',
      rpt_meta:'Scan completed · No message content was read or stored'
    },
    es:{
      scan_title:'Analizando tu bandeja…',
      scan_subtitle:'Analizando mensajes en busca de amenazas de seguridad. No se lee ni almacena ningún contenido.',
      prog_of:'de',prog_emails:'mensajes analizados',
      mod_phishing:'Detección de Phishing',mod_malware:'Firmas de Malware',mod_links:'Enlaces Sospechosos',
      mod_spoof:'Suplantación de Dominio',mod_attach:'Adjuntos Peligrosos',mod_headers:'Análisis de Cabeceras',
      rpt_total:'Analizados',rpt_clean:'Limpios',rpt_phish:'Phishing',rpt_malware:'Malware',
      rpt_phish_title:'Análisis de Phishing',rpt_malware_title:'Análisis de Malware',
      phish_li1:'Reputación del dominio remitente: verificada',phish_li2:'Análisis de cabeceras SPF / DKIM / DMARC: completo',
      phish_li3:'Detección de dominios similares: no se encontraron coincidencias',phish_li4:'Patrones de enlaces de captura de credenciales: ninguno detectado',
      malware_li1:'Análisis del tipo de archivo adjunto: completo',malware_li2:'Indicadores de macros de Office: ninguno detectado',
      malware_li3:'Archivos ejecutables o scripts adjuntos: ninguno encontrado',malware_li4:'Patrones de amenazas en archivos comprimidos (ZIP/RAR): ninguno detectado',
      rpt_footer:'Sentinel es una herramienta de diagnóstico. Los resultados se basan únicamente en el análisis de metadatos.',
      verdict_clean:'Limpio',rpt_badge:'Análisis Completo',rpt_title:'Informe de Seguridad',
      rpt_meta:'Análisis completado · No se leyó ni almacenó ningún mensaje'
    }
  };

  function setLang(l){
    try{localStorage.setItem('sentinel_lang',l);}catch(e){}
    document.documentElement.setAttribute('data-lang',l);
    
    const btnEn = document.getElementById('btn-en');
    const btnEs = document.getElementById('btn-es');
    if (btnEn) btnEn.classList.toggle('active',l==='en');
    if (btnEs) btnEs.classList.toggle('active',l==='es');
    
    document.querySelectorAll('[data-i18n]').forEach(function(el){
      var k=el.getAttribute('data-i18n');
      if(T[l][k]!==undefined) el.textContent=T[l][k];
    });
    
    window._lang=l; 
    window._T=T;

    // update scan title/subtitle live
    const st=document.getElementById('scan-title');
    const ss=document.getElementById('scan-subtitle');
    if(st && T[l].scan_title) st.textContent=T[l].scan_title;
    if(ss && T[l].scan_subtitle) ss.textContent=T[l].scan_subtitle;
    
    const pof=document.getElementById('prog-of');
    const pe=document.getElementById('prog-emails');
    if(pof) pof.textContent=T[l].prog_of;
    if(pe) pe.textContent=T[l].prog_emails;
  }

  document.addEventListener('DOMContentLoaded', function() {
    const btnEn = document.getElementById('btn-en');
    const btnEs = document.getElementById('btn-es');
    if (btnEn) btnEn.addEventListener('click', function() { setLang('en'); });
    if (btnEs) btnEs.addEventListener('click', function() { setLang('es'); });

    try{
      setLang(localStorage.getItem('sentinel_lang')||'en');
    }catch(e){
      setLang('en');
    }
  });

  window.setLang=setLang; 
  window._T=T;
}());
