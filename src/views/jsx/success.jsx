// success.jsx — rendered to success.html
export default function Success() {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Scanning — Sentinel</title>
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
body{font-family:'Roboto',sans-serif;background:var(--bg);color:var(--text);min-height:100vh;display:flex;flex-direction:column}
nav{background:var(--surface);border-bottom:1px solid var(--border);padding:0 6vw;height:64px;display:flex;align-items:center}
.logo{display:flex;align-items:center;gap:10px;font-family:'Google Sans',sans-serif;font-weight:700;font-size:1.1rem;color:var(--text)}
.logo-g{width:28px;height:28px}
.layout{display:grid;grid-template-columns:320px 1fr;flex:1;min-height:0;height:calc(100vh - 64px)}
@media(max-width:700px){.layout{grid-template-columns:1fr;grid-template-rows:auto 1fr;height:auto}}
/* Panel */
.panel{background:var(--surface);border-right:1px solid var(--border);padding:24px 20px;display:flex;flex-direction:column;gap:18px;overflow-y:auto}
.status-header{display:flex;align-items:center;gap:10px}
.pulse{width:10px;height:10px;border-radius:50%;background:var(--gmail-blue);animation:pulse 1.4s ease-in-out infinite;flex-shrink:0}
@keyframes pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.45;transform:scale(.75)}}
.status-text{font-size:.82rem;font-weight:500;color:var(--gmail-blue)}
.status-text.done{color:var(--gmail-green)}
.stats-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px}
.stat{background:var(--bg);border:1px solid var(--border);border-radius:var(--r);padding:14px 12px}
.stat-val{font-size:1.4rem;font-weight:700;font-family:'Google Sans',sans-serif;letter-spacing:-.02em;line-height:1;color:var(--text)}
.stat-lbl{font-size:.68rem;color:var(--muted);text-transform:uppercase;letter-spacing:.07em;margin-top:4px}
.progress-wrap{background:var(--bg);border:1px solid var(--border);border-radius:var(--r);padding:14px}
.progress-label{display:flex;justify-content:space-between;font-size:.75rem;color:var(--muted);margin-bottom:8px}
.progress-bar{height:4px;background:#e0e0e0;border-radius:9999px;overflow:hidden}
.progress-fill{height:100%;background:var(--gmail-blue);border-radius:9999px;transition:width .4s ease;width:0%}
/* Feed */
.feed{padding:16px 20px;overflow-y:auto;display:flex;flex-direction:column;gap:6px}
.feed-empty{display:flex;align-items:center;justify-content:center;flex:1;flex-direction:column;gap:10px;color:var(--muted);font-size:.88rem;min-height:200px}
.feed-empty svg{opacity:.25}
.email-row{background:var(--surface);border:1px solid var(--border);border-radius:var(--r);padding:10px 12px;display:flex;align-items:center;gap:10px;animation:slideIn .2s ease}
@keyframes slideIn{from{opacity:0;transform:translateY(-4px)}to{opacity:1;transform:translateY(0)}}
.email-dot{width:9px;height:9px;border-radius:50%;flex-shrink:0}
.email-dot.threat{background:var(--gmail-red)}
.email-dot.warning{background:var(--gmail-yellow)}
.email-dot.safe{background:var(--gmail-green)}
.email-info{flex:1;min-width:0}
.email-subject{font-size:.82rem;font-weight:500;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;color:var(--text)}
.email-sender{font-size:.72rem;color:var(--muted);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.email-badge{font-size:.66rem;font-weight:700;padding:2px 7px;border-radius:9999px;flex-shrink:0}
.email-badge.threat{background:#fce8e6;color:var(--gmail-red)}
.email-badge.warning{background:#fef7e0;color:#b06000}
.email-badge.safe{background:#e6f4ea;color:var(--gmail-green)}
.done-banner{background:#e6f4ea;border:1px solid #ceead6;border-radius:var(--r);padding:14px;text-align:center}
.done-banner strong{display:block;font-size:.9rem;font-weight:700;color:var(--gmail-green);margin-bottom:3px}
.done-banner span{font-size:.78rem;color:var(--muted)}
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
        </nav>

        <div className="layout">
          {/* Left panel */}
          <div className="panel">
            <div className="status-header">
              <div className="pulse" id="pulse"></div>
              <div className="status-text" id="status-text">Connecting to Gmail…</div>
            </div>
            <div className="stats-grid">
              <div className="stat"><div className="stat-val" id="s-total">—</div><div className="stat-lbl">Total</div></div>
              <div className="stat"><div className="stat-val" id="s-done">0</div><div className="stat-lbl">Scanned</div></div>
              <div className="stat"><div className="stat-val" style={{color:'var(--gmail-red)'}} id="s-threats">0</div><div className="stat-lbl">Threats</div></div>
              <div className="stat"><div className="stat-val" style={{color:'#b06000'}} id="s-warn">0</div><div className="stat-lbl">Warnings</div></div>
            </div>
            <div className="progress-wrap">
              <div className="progress-label"><span>Progress</span><span id="pct">0%</span></div>
              <div className="progress-bar"><div className="progress-fill" id="prog"></div></div>
            </div>
          </div>

          {/* Right feed */}
          <div className="feed" id="feed">
            <div className="feed-empty" id="feed-empty">
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#5F6368" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                <polyline points="22,6 12,13 2,6"/>
              </svg>
              Waiting for scan to begin…
            </div>
          </div>
        </div>

        <script src="/success.js"></script>
      </body>
    </html>
  );
}
