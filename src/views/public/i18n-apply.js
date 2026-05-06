'use strict';

(function(){
  var T={
    en:{
      step_account:'Account',step_connect:'Connect',step_scan:'Scan',
      s1_title:'Create your account',s1_sub:'Free to use. No credit card required.',
      lbl_name:'Full name',lbl_email:'Email address',btn_continue:'Continue',
      s2_title:'Connect Gmail',s2_sub:'Read-only access. Revoke anytime from your Google account.',
      badge_recommended:'Recommended',oauth_title:'🔐 Google OAuth',oauth_desc:'One-click via Google consent screen. No password stored.',
      imap_title:'🔑 App Password (IMAP)',imap_desc:'16-character Google App Password. Works with advanced security policies.',
      imap_info:'Go to myaccount.google.com → Security → 2-Step Verification → App Passwords and generate a password for "Mail".',
      lbl_imap_email:'Gmail address',lbl_imap_pass:'App Password (16 chars)',
      btn_oauth:'Connect with Google',btn_imap:'Connect via IMAP',btn_connecting:'Connecting…'
    },
    es:{
      step_account:'Cuenta',step_connect:'Conectar',step_scan:'Escanear',
      s1_title:'Crea tu cuenta',s1_sub:'Gratis. Sin tarjeta de crédito.',
      lbl_name:'Nombre completo',lbl_email:'Correo electrónico',btn_continue:'Continuar',
      s2_title:'Conecta Gmail',s2_sub:'Acceso de solo lectura. Revoca en cualquier momento desde tu cuenta de Google.',
      badge_recommended:'Recomendado',oauth_title:'🔐 Google OAuth',oauth_desc:'Un clic en la pantalla de consentimiento de Google. Sin contraseña almacenada.',
      imap_title:'🔑 Contraseña de App (IMAP)',imap_desc:'Contraseña de app de Google de 16 caracteres. Compatible con políticas de seguridad avanzadas.',
      imap_info:'Ve a myaccount.google.com → Seguridad → Verificación en 2 pasos → Contraseñas de aplicación y genera una para "Correo".',
      lbl_imap_email:'Dirección de Gmail',lbl_imap_pass:'Contraseña de app (16 caracteres)',
      btn_oauth:'Conectar con Google',btn_imap:'Conectar por IMAP',btn_connecting:'Conectando…'
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
  window.T=T;
}());
