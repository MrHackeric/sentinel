// landing.jsx  — rendered server-side to landing.html via build step
// Gmail palette: #EA4335 red · #4285F4 blue · #34A853 green · #FBBC05 yellow
export default function Landing() {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Sentinel — Gmail Security</title>
        <link
          href="https://fonts.googleapis.com/css2?family=Google+Sans:wght@400;500;700&family=Roboto:wght@400;500&display=swap"
          rel="stylesheet"
        />
        <style>{`
:root{
  --gmail-red:#EA4335;--gmail-blue:#4285F4;--gmail-green:#34A853;--gmail-yellow:#FBBC05;
  --bg:#F6F8FC;--surface:#fff;--border:#E0E0E0;--text:#202124;--muted:#5F6368;--r:8px;
}
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html{scroll-behavior:smooth}
body{font-family:'Roboto',sans-serif;background:var(--bg);color:var(--text);min-height:100vh}
a{color:var(--gmail-blue);text-decoration:none}
nav{background:var(--surface);border-bottom:1px solid var(--border);padding:0 6vw;height:64px;display:flex;align-items:center;justify-content:space-between}
.logo{display:flex;align-items:center;gap:10px;font-family:'Google Sans',sans-serif;font-weight:700;font-size:1.1rem;color:var(--text)}
.logo-g{display:flex;width:28px;height:28px}
.nav-cta{background:var(--gmail-blue);color:#fff;padding:9px 22px;border-radius:4px;font-size:.875rem;font-weight:500;font-family:'Google Sans',sans-serif;letter-spacing:.01em;transition:background .2s;box-shadow:0 1px 3px rgba(66,133,244,.3)}
.nav-cta:hover{background:#1a73e8;color:#fff}
.hero{max-width:860px;margin:0 auto;padding:72px 6vw 56px;text-align:center}
.hero-chip{display:inline-flex;align-items:center;gap:7px;background:#e8f0fe;color:var(--gmail-blue);padding:5px 14px;border-radius:9999px;font-size:.75rem;font-weight:500;margin-bottom:24px}
.hero-chip span{width:7px;height:7px;background:var(--gmail-green);border-radius:50%;display:inline-block}
h1{font-family:'Google Sans',sans-serif;font-size:clamp(1.875rem,4.5vw,3rem);font-weight:700;line-height:1.15;letter-spacing:-.02em;color:var(--text);margin-bottom:18px}
h1 em{font-style:normal;color:var(--gmail-blue)}
.hero-sub{font-size:1rem;color:var(--muted);line-height:1.75;max-width:540px;margin:0 auto 32px}
.hero-cta{display:inline-flex;align-items:center;gap:8px;background:var(--gmail-blue);color:#fff;padding:12px 28px;border-radius:4px;font-family:'Google Sans',sans-serif;font-weight:500;font-size:.95rem;box-shadow:0 1px 3px rgba(66,133,244,.3);transition:background .2s,box-shadow .2s}
.hero-cta:hover{background:#1a73e8;color:#fff;box-shadow:0 2px 6px rgba(66,133,244,.4)}
.hero-cta svg{flex-shrink:0}
.hero-note{margin-top:12px;font-size:.78rem;color:var(--muted)}
.features{max-width:860px;margin:0 auto;padding:0 6vw 72px;display:grid;grid-template-columns:repeat(3,1fr);gap:16px}
@media(max-width:640px){.features{grid-template-columns:1fr}}
.feat{background:var(--surface);border:1px solid var(--border);border-radius:var(--r);padding:24px 20px}
.feat-icon{width:44px;height:44px;border-radius:50%;display:flex;align-items:center;justify-content:center;margin-bottom:14px}
.feat-icon svg{fill:none;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}
.feat h3{font-family:'Google Sans',sans-serif;font-size:.95rem;font-weight:700;margin-bottom:6px;color:var(--text)}
.feat p{font-size:.83rem;color:var(--muted);line-height:1.65}
.how{max-width:860px;margin:0 auto;padding:0 6vw 72px}
.section-label{font-size:.7rem;font-weight:500;letter-spacing:.1em;text-transform:uppercase;color:var(--gmail-blue);margin-bottom:8px}
.section-title{font-family:'Google Sans',sans-serif;font-size:1.5rem;font-weight:700;color:var(--text);margin-bottom:24px}
.steps{display:flex;flex-direction:column;gap:12px}
.step{display:flex;align-items:flex-start;gap:16px;background:var(--surface);border:1px solid var(--border);border-radius:var(--r);padding:18px}
.step-num{width:32px;height:32px;border-radius:50%;background:var(--gmail-blue);color:#fff;font-family:'Google Sans',sans-serif;font-weight:700;font-size:.85rem;display:flex;align-items:center;justify-content:center;flex-shrink:0}
.step-body strong{display:block;font-size:.9rem;font-weight:500;color:var(--text);margin-bottom:3px}
.step-body span{font-size:.82rem;color:var(--muted);line-height:1.6}
footer{border-top:1px solid var(--border);padding:22px 6vw;text-align:center;font-size:.78rem;color:var(--muted)}
        `}</style>
      </head>
      <body>
        <nav>
          <div className="logo">
            <svg className="logo-g" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
              <path fill="#EA4335" d="M24 20.8V27h11.2c-.5 2.6-2 4.8-4.1 6.3l6.6 5.1c3.9-3.6 6.1-8.9 6.1-15.3 0-1.5-.1-2.9-.4-4.2H24z"/>
              <path fill="#FBBC05" d="M10.5 28.6l-1.5 1.1-5.3 4.1C6.5 39.4 14.7 44 24 44c5.6 0 10.4-1.9 13.8-5.1l-6.6-5.1c-1.9 1.3-4.3 2-7.2 2-5.5 0-10.2-3.7-11.9-8.8l-.6.6z"/>
              <path fill="#34A853" d="M3.8 33.8C2.7 31.3 2 28.7 2 26s.7-5.3 1.8-7.8l-7.3-5.7C-1.2 16.3-2 21-2 26s.8 9.7 2.5 13.5l7.3-5.7z" transform="translate(5.5 -1)"/>
              <path fill="#4285F4" d="M24 10c3.1 0 5.9 1.1 8.1 3.1l6-6C34.4 3.7 29.6 2 24 2 14.7 2 6.5 6.6 3.7 13.8l7.3 5.7C12.6 13.9 17.9 10 24 10z"/>
            </svg>
            Sentinel
          </div>
          <a href="/apply" className="nav-cta">Get started free</a>
        </nav>

        <section className="hero">
          <div className="hero-chip"><span></span>Read-only · Nothing is sent or deleted</div>
          <h1>Gmail security,<br /><em>actually working</em></h1>
          <p className="hero-sub">
            Sentinel scans your Gmail for phishing, malware, and dangerous attachments — in real time, the moment you connect.
          </p>
          <a href="/apply" className="hero-cta">
            Connect your Gmail
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
            </svg>
          </a>
          <p className="hero-note">Free · No credit card · 2 minutes</p>
        </section>

        <section className="features">
          <div className="feat">
            <div className="feat-icon" style={{background:'#fce8e6'}}>
              <svg width="22" height="22" viewBox="0 0 24 24" stroke="#EA4335">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                <polyline points="22,6 12,13 2,6"/>
              </svg>
            </div>
            <h3>Phishing Detection</h3>
            <p>Catches look-alike domains, fake login links, and credential-harvest attempts — even when SPF and DKIM pass.</p>
          </div>
          <div className="feat">
            <div className="feat-icon" style={{background:'#fef7e0'}}>
              <svg width="22" height="22" viewBox="0 0 24 24" stroke="#FBBC05">
                <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
                <polyline points="14 2 14 8 20 8"/>
              </svg>
            </div>
            <h3>Malware &amp; Attachments</h3>
            <p>Scans Office macros, PDF exploits, and ZIP archives for threats before you open them.</p>
          </div>
          <div className="feat">
            <div className="feat-icon" style={{background:'#e6f4ea'}}>
              <svg width="22" height="22" viewBox="0 0 24 24" stroke="#34A853">
                <rect x="3" y="11" width="18" height="11" rx="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
            </div>
            <h3>Read-only Access</h3>
            <p>Sentinel never sends, deletes, or modifies any email. Revoke access anytime from your Google account.</p>
          </div>
        </section>

        <section className="how">
          <div className="section-label">How it works</div>
          <div className="section-title">Up and running in minutes</div>
          <div className="steps">
            <div className="step">
              <div className="step-num">1</div>
              <div className="step-body"><strong>Create your account</strong><span>Enter your name and email. No credit card needed.</span></div>
            </div>
            <div className="step">
              <div className="step-num">2</div>
              <div className="step-body"><strong>Connect Gmail</strong><span>One-click via Google OAuth, or App Password over IMAP.</span></div>
            </div>
            <div className="step">
              <div className="step-num">3</div>
              <div className="step-body"><strong>Scan starts immediately</strong><span>Results stream in real time as each email is checked.</span></div>
            </div>
          </div>
        </section>

        <footer>© 2025 Sentinel · Gmail read-only · <a href="/apply">Get started</a></footer>
      </body>
    </html>
  );
}
