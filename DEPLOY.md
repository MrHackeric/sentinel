# Production Deployment Guide
## app.takazaobio.com → DigitalOcean Droplet

---

## Part 1 — Google Cloud Console

### 1a. Update the redirect URI
Go to **APIs & Services → Credentials → your OAuth 2.0 Client ID**.

| Field | Value |
|-------|-------|
| Authorized JavaScript origins | `https://app.takazaobio.com` |
| Authorized redirect URIs | `https://app.takazaobio.com/auth/callback` |

Keep `http://localhost:3000/auth/callback` in the list too so local dev still works. Save.

### 1b. Switch from Testing to Production
Go to **APIs & Services → OAuth consent screen → Publish App → Confirm**.
This removes the 100-user cap. Since `gmail.readonly` is a restricted scope, Google will ask you to complete a verification form. Fill it out — your app still works for added test users while the review is pending.

---

## Part 2 — Point the subdomain at your Droplet (Truehost cPanel)

You are only changing DNS here — nothing else touches your shared hosting.

1. Log into **cPanel** at Truehost
2. Go to **Zone Editor** (or "DNS Zone Editor")
3. Find the zone for `takazaobio.com`
4. Add a new record:

| Type | Name | Value | TTL |
|------|------|-------|-----|
| A | app | `<your-droplet-IP>` | 3600 |

5. Save. DNS propagation takes up to 30 minutes — you can check with:
   ```bash
   nslookup app.takazaobio.com 8.8.8.8
   ```
   When it returns your droplet IP, you're ready for the next steps.

---

## Part 3 — Droplet Setup (one-time)

SSH into your droplet:
```bash
ssh root@<your-droplet-IP>
```

### 3a. System packages
```bash
apt update && apt upgrade -y
apt install -y nginx certbot python3-certbot-nginx ufw git curl
```

### 3b. Node.js 20 + pm2
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs
npm install -g pm2
pm2 startup systemd -u root --hp /root
# Copy and run the command it prints out
```

### 3c. Firewall
```bash
ufw allow OpenSSH
ufw allow 'Nginx Full'
ufw enable
```

---

## Part 4 — Deploy the App

### 4a. Upload your project files
From your **local machine**, run:
```bash
rsync -avz \
  --exclude node_modules \
  --exclude data \
  --exclude logs \
  --exclude downloads \
  ./ root@<your-droplet-IP>:/var/www/gmail-collector/
```

Or if using git:
```bash
# On the droplet:
git clone <your-repo-url> /var/www/gmail-collector
```

### 4b. Install dependencies
```bash
cd /var/www/gmail-collector
npm install --omit=dev
```

### 4c. Set up .env on the server
```bash
nano /var/www/gmail-collector/.env
```

Set it to:
```env
NODE_ENV=production
PORT=3000
BASE_URL=https://app.takazaobio.com

ENCRYPTION_KEY=<your-32-char-key>

GOOGLE_CLIENT_ID=<your-client-id>
GOOGLE_CLIENT_SECRET=<your-client-secret>
GOOGLE_REDIRECT_URI=https://app.takazaobio.com/auth/callback

DB_PATH=./data/collector.sqlite
DOWNLOADS_PATH=./downloads
LOGS_PATH=./logs

HARVEST_CONCURRENCY=5
HARVEST_BATCH_SIZE=500
HARVEST_DELAY_MS=50
```

### 4d. Start with pm2
```bash
cd /var/www/gmail-collector
npm run prod        # pm2 start src/app.js --name gmail-collector
pm2 save            # persist across reboots
```

Verify it's running:
```bash
pm2 status
pm2 logs gmail-collector --lines 30
```

---

## Part 5 — Nginx Reverse Proxy

### 5a. Create the site config
```bash
nano /etc/nginx/sites-available/gmail-collector
```

Paste (replace the domain if needed):
```nginx
server {
    listen 80;
    server_name app.takazaobio.com;

    location / {
        proxy_pass         http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header   Host              $host;
        proxy_set_header   X-Real-IP         $remote_addr;
        proxy_set_header   X-Forwarded-For   $proxy_add_x_forwarded_for;
        proxy_set_header   X-Forwarded-Proto $scheme;
        proxy_read_timeout 60s;
    }
}
```

```bash
ln -s /etc/nginx/sites-available/gmail-collector /etc/nginx/sites-enabled/
nginx -t          # must print "syntax is ok"
systemctl reload nginx
```

### 5b. Issue the SSL certificate
Make sure DNS has propagated first (Step 2), then:
```bash
certbot --nginx -d app.takazaobio.com
```

Certbot will automatically edit your Nginx config to enable HTTPS and redirect all HTTP traffic to HTTPS. Certificates renew automatically — nothing else to do.

Your app is now live at **https://app.takazaobio.com**

---

## Part 6 — Updating HTML Files

Because the app serves HTML via `res.sendFile()`, the file is read from disk on every request. **You do not need to restart pm2 to see HTML changes.**

Just push the updated file to the server:
```bash
# From your local machine:
scp src/views/landing.html root@<your-droplet-IP>:/var/www/gmail-collector/src/views/landing.html

# Or for all views at once:
rsync -avz src/views/ root@<your-droplet-IP>:/var/www/gmail-collector/src/views/
```

The change is live on the next page load. No restart needed.

**Only restart pm2 when you change `.js` or `.env` files:**
```bash
pm2 restart gmail-collector --update-env
```

---

## Quick Reference

| Task | Command |
|------|---------|
| View live logs | `pm2 logs gmail-collector` |
| Restart after JS change | `pm2 restart gmail-collector` |
| Reload after .env change | `pm2 restart gmail-collector --update-env` |
| Update HTML only | `scp` or `rsync` the file — no restart |
| Check Nginx config | `nginx -t` |
| Reload Nginx | `systemctl reload nginx` |
| Check SSL renewal | `certbot renew --dry-run` |
| Check DNS propagation | `nslookup app.takazaobio.com 8.8.8.8` |