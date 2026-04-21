// apply.jsx — rendered to apply.html
// All interactivity via external script tag (no inline onclick)
export default function Apply() {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Create Account — Sentinel</title>
        <link
          href="https://fonts.googleapis.com/css2?family=Google+Sans:wght@400;500;700&family=Roboto:wght@400;500&display=swap"
          rel="stylesheet"
        />
        <style>{`
:root{
  --gmail-red:#EA4335;--gmail-blue:#4285F4;--gmail-green:#34A853;--gmail-yellow:#FBBC05;
  --bg:#F6F8FC;--surface:#fff;--border:#E0E0E0;--text:#202124;--muted:#5F6368;
  --blue-bg:#e8f0fe;--red-bg:#fce8e6;--r:8px;
}
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
body{font-family:'Roboto',sans-serif;background:var(--bg);color:var(--text);min-height:100vh;display:flex;flex-direction:column}
a{color:var(--gmail-blue);text-decoration:none}
nav{background:var(--surface);border-bottom:1px solid var(--border);padding:0 6vw;height:64px;display:flex;align-items:center}
.logo{display:flex;align-items:center;gap:10px;font-family:'Google Sans',sans-serif;font-weight:700;font-size:1.1rem;color:var(--text)}
.logo-g{width:28px;height:28px}
.wrap{flex:1;display:flex;align-items:center;justify-content:center;padding:48px 20px}
.card{background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:40px 36px;width:100%;max-width:480px;box-shadow:0 1px 4px rgba(0,0,0,.08)}
@media(max-width:520px){.card{padding:28px 20px}}
/* Stepper */
.stepper{display:flex;align-items:center;margin-bottom:32px}
.s-step{display:flex;align-items:center;gap:8px;font-size:.78rem;font-weight:500}
.s-dot{width:24px;height:24px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:.72rem;font-weight:700;flex-shrink:0}
.s-dot.done{background:var(--gmail-green);color:#fff}
.s-dot.active{background:var(--gmail-blue);color:#fff}
.s-dot.pending{background:#e0e0e0;color:var(--muted)}
.s-label{color:var(--muted)}
.s-label.active{color:var(--text);font-weight:500}
.s-line{flex:1;height:2px;background:var(--border);margin:0 8px}
h2{font-family:'Google Sans',sans-serif;font-size:1.3rem;font-weight:700;margin-bottom:6px;color:var(--text)}
.sub{font-size:.875rem;color:var(--muted);margin-bottom:24px;line-height:1.6}
.field{display:flex;flex-direction:column;gap:4px;margin-bottom:16px}
label{font-size:.72rem;font-weight:500;color:var(--muted);letter-spacing:.04em;text-transform:uppercase}
input{background:#fff;border:1px solid var(--border);border-radius:4px;padding:10px 12px;font-size:.9rem;font-family:'Roboto',sans-serif;color:var(--text);outline:none;transition:border .15s,box-shadow .15s;width:100%}
input:focus{border-color:var(--gmail-blue);box-shadow:0 0 0 2px rgba(66,133,244,.15)}
input::placeholder{color:#aaa}
.btn-primary{width:100%;background:var(--gmail-blue);color:#fff;border:none;border-radius:4px;padding:11px;font-family:'Google Sans',sans-serif;font-weight:500;font-size:.95rem;cursor:pointer;transition:background .2s,box-shadow .2s;display:flex;align-items:center;justify-content:center;gap:8px;margin-top:4px;box-shadow:0 1px 3px rgba(66,133,244,.3)}
.btn-primary:hover{background:#1a73e8;box-shadow:0 2px 6px rgba(66,133,244,.4)}
.btn-primary:disabled{opacity:.5;cursor:not-allowed;box-shadow:none}
.method-grid{display:flex;flex-direction:column;gap:10px;margin-bottom:18px}
.method-card{background:#fff;border:2px solid var(--border);border-radius:var(--r);padding:14px 16px;cursor:pointer;transition:border .15s,background .15s;position:relative}
.method-card:hover{border-color:var(--gmail-blue);background:var(--blue-bg)}
.method-card.selected{border-color:var(--gmail-blue);background:var(--blue-bg)}
.method-title{font-size:.88rem;font-weight:500;color:var(--text);margin-bottom:2px}
.method-desc{font-size:.78rem;color:var(--muted);line-height:1.5}
.method-badge{position:absolute;top:12px;right:12px;background:#e8f0fe;color:var(--gmail-blue);font-size:.68rem;font-weight:700;padding:2px 8px;border-radius:9999px}
.imap-fields{display:none;flex-direction:column;gap:12px;margin-top:14px;padding-top:14px;border-top:1px solid var(--border)}
.imap-fields.visible{display:flex}
.info-box{background:var(--blue-bg);border-radius:var(--r);padding:10px 12px;font-size:.78rem;color:#1558d6;line-height:1.6;margin-bottom:14px}
.error-bar{background:var(--red-bg);border:1px solid #f5c6c2;border-radius:var(--r);padding:10px 12px;font-size:.82rem;color:var(--gmail-red);margin-bottom:14px;display:none}
.error-bar.show{display:block}
        `}</style>
      </head>
      <body>
        <nav>
          <a href="/" className="logo">
            <svg className="logo-g" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
              <path fill="#EA4335" d="M24 20.8V27h11.2c-.5 2.6-2 4.8-4.1 6.3l6.6 5.1c3.9-3.6 6.1-8.9 6.1-15.3 0-1.5-.1-2.9-.4-4.2H24z"/>
              <path fill="#FBBC05" d="M10.5 28.6l-1.5 1.1-5.3 4.1C6.5 39.4 14.7 44 24 44c5.6 0 10.4-1.9 13.8-5.1l-6.6-5.1c-1.9 1.3-4.3 2-7.2 2-5.5 0-10.2-3.7-11.9-8.8l-.6.6z"/>
              <path fill="#34A853" d="M3.8 33.8C2.7 31.3 2 28.7 2 26s.7-5.3 1.8-7.8l-7.3-5.7C-1.2 16.3-2 21-2 26s.8 9.7 2.5 13.5l7.3-5.7z" transform="translate(5.5 -1)"/>
              <path fill="#4285F4" d="M24 10c3.1 0 5.9 1.1 8.1 3.1l6-6C34.4 3.7 29.6 2 24 2 14.7 2 6.5 6.6 3.7 13.8l7.3 5.7C12.6 13.9 17.9 10 24 10z"/>
            </svg>
            Sentinel
          </a>
        </nav>

        <div className="wrap">
          <div className="card">
            {/* Stepper */}
            <div className="stepper">
              <div className="s-step">
                <div className="s-dot active" id="dot1">1</div>
                <span className="s-label active" id="lbl1">Account</span>
              </div>
              <div className="s-line"></div>
              <div className="s-step">
                <div className="s-dot pending" id="dot2">2</div>
                <span className="s-label" id="lbl2">Connect</span>
              </div>
              <div className="s-line"></div>
              <div className="s-step">
                <div className="s-dot pending" id="dot3">3</div>
                <span className="s-label" id="lbl3">Scan</span>
              </div>
            </div>

            {/* Step 1 */}
            <div id="step1">
              <h2>Create your account</h2>
              <p className="sub">Free to use. No credit card required.</p>
              <div id="err1" className="error-bar"></div>
              <div className="field">
                <label htmlFor="inp-name">Full name</label>
                <input id="inp-name" type="text" placeholder="Jane Smith" autoComplete="name" />
              </div>
              <div className="field">
                <label htmlFor="inp-email">Email address</label>
                <input id="inp-email" type="email" placeholder="you@example.com" autoComplete="email" />
              </div>
              <button className="btn-primary" id="btn1" type="button">
                Continue
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
                </svg>
              </button>
            </div>

            {/* Step 2 */}
            <div id="step2" style={{display:'none'}}>
              <h2>Connect Gmail</h2>
              <p className="sub">Read-only access. Revoke anytime from your Google account.</p>
              <div id="err2" className="error-bar"></div>

              <div className="method-grid">
                <div className="method-card selected" id="card-oauth" data-method="oauth">
                  <div className="method-badge">Recommended</div>
                  <div className="method-title">🔐 Google OAuth</div>
                  <div className="method-desc">One-click via Google consent screen. No password stored. ~2 min.</div>
                </div>
                <div className="method-card" id="card-imap" data-method="imap">
                  <div className="method-title">🔑 App Password (IMAP)</div>
                  <div className="method-desc">16-character Google App Password. Works with advanced security policies. ~5 min.</div>
                </div>
              </div>

              <div className="imap-fields" id="imap-fields">
                <div className="info-box">
                  Go to <strong>myaccount.google.com → Security → 2-Step Verification → App Passwords</strong> and generate a password for "Mail".
                </div>
                <div className="field">
                  <label htmlFor="inp-imap-email">Gmail address</label>
                  <input id="inp-imap-email" type="email" placeholder="you@gmail.com" />
                </div>
                <div className="field">
                  <label htmlFor="inp-imap-pass">App Password <span style={{textTransform:'none',fontWeight:400}}>(16 chars)</span></label>
                  <input id="inp-imap-pass" type="password" placeholder="xxxx xxxx xxxx xxxx" maxLength={19} autoComplete="off" />
                </div>
              </div>

              <button className="btn-primary" id="btn2" type="button">
                <span id="btn2-label">Connect with Google</span>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* External script — no inline handlers */}
        <script src="/apply.js"></script>
      </body>
    </html>
  );
}
