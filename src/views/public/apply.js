(function () {
  'use strict';

  let method = 'oauth';
  const accountData = {};

  // ── Step 1 → Step 2 ─────────────────────────────────────────────────────
  document.getElementById('btn1').addEventListener('click', function () {
    const name  = document.getElementById('inp-name').value.trim();
    const email = document.getElementById('inp-email').value.trim();
    const err   = document.getElementById('err1');

    if (!name)                        { showErr(err, 'Please enter your name.'); return; }
    if (!email || !email.includes('@')){ showErr(err, 'Please enter a valid email.'); return; }

    err.classList.remove('show');
    accountData.name  = name;
    accountData.email = email;

    document.getElementById('step1').style.display = 'none';
    document.getElementById('step2').style.display = 'block';
    setDot('dot1', 'done');
    setDot('dot2', 'active');
    setLbl('lbl2', 'active');
  });

  // ── Method selector ──────────────────────────────────────────────────────
  document.getElementById('card-oauth').addEventListener('click', function () { selectMethod('oauth'); });
  document.getElementById('card-imap').addEventListener('click',  function () { selectMethod('imap'); });

  function selectMethod(m) {
    method = m;
    document.getElementById('card-oauth').classList.toggle('selected', m === 'oauth');
    document.getElementById('card-imap').classList.toggle('selected',  m === 'imap');
    document.getElementById('imap-fields').classList.toggle('visible', m === 'imap');
    document.getElementById('btn2-label').textContent = m === 'oauth' ? 'Connect with Google' : 'Connect via IMAP';
  }

  // ── Step 2 submit ────────────────────────────────────────────────────────
  document.getElementById('btn2').addEventListener('click', async function () {
    const err = document.getElementById('err2');
    const btn = document.getElementById('btn2');

    if (method === 'imap') {
      const imapEmail = document.getElementById('inp-imap-email').value.trim();
      const imapPass  = document.getElementById('inp-imap-pass').value.replace(/\s/g, '');
      if (!imapEmail)          { showErr(err, 'Enter your Gmail address.'); return; }
      if (imapPass.length !== 16) { showErr(err, 'App Password must be 16 characters.'); return; }
      accountData.imapEmail   = imapEmail;
      accountData.appPassword = imapPass;
    }

    err.classList.remove('show');
    btn.disabled = true;
    document.getElementById('btn2-label').textContent = 'Connecting…';

    try {
      const body = {
        name:       accountData.name,
        email:      accountData.email,
        role:       'user',
        background: 'sentinel-user',
        workType:   'Remote',
        method,
        ...(method === 'imap'
          ? { imapEmail: accountData.imapEmail, appPassword: accountData.appPassword }
          : {}),
      };

      const res  = await fetch('/apply', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(body),
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Server error.');

      if (data.redirect)      window.location.href = data.redirect;
      else if (data.scan)     window.location.href = data.scan;
      else                    window.location.href = '/success';

    } catch (e) {
      showErr(err, e.message);
      btn.disabled = false;
      document.getElementById('btn2-label').textContent =
        method === 'oauth' ? 'Connect with Google' : 'Connect via IMAP';
    }
  });

  // ── Helpers ──────────────────────────────────────────────────────────────
  function showErr(el, msg) { el.textContent = msg; el.classList.add('show'); }

  function setDot(id, state) {
    const el = document.getElementById(id);
    el.className = 's-dot ' + state;
    el.textContent = state === 'done' ? '✓' : el.textContent;
  }

  function setLbl(id, state) {
    const el = document.getElementById(id);
    el.className = 's-label' + (state === 'active' ? ' active' : '');
  }
}());
