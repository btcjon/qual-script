# QualScript - Youngevity Qualification Data Scraper

Automated Puppeteer script that scrapes Youngevity MLM qualification data and exports to Google Sheets.

## Architecture

- **Node.js** + **Express** web server
- **Puppeteer** for browser automation
- **Google Sheets API** for data export
- **Docker** containerized deployment

## Quick Start

### Local Development
```bash
npm install
node app.js
```

### Production Deployment (VPS)

```bash
# Clone repository
cd /opt
git clone https://github.com/btcjon/qual-script.git
cd qual-script

# Configure environment
cp .env.example .env
# Edit .env with your settings

# Start container
docker-compose up -d

# View logs
docker-compose logs -f

# Restart after code changes
git pull
docker-compose restart
```

## Update Workflow

```bash
# SSH to VPS
ssh -i ~/.ssh/vps_automation root@62.146.229.99

# Navigate to repo
cd /opt/qual-script

# Pull latest changes
git pull

# Restart container (picks up new code via volume mounts)
docker-compose restart

# Or rebuild if Dockerfile changed
docker-compose up -d --build
```

## API Endpoints

- `GET /qualification_script/run` - Trigger qualification data scrape

## Files

- `app.js` - Express web server wrapper
- `qualification_script.js` - Main Puppeteer scraping logic
- `google-service-account.json` - Google Sheets API credentials
- `Dockerfile` - Container build configuration
- `docker-compose.yml` - Deployment orchestration

## Recent Fixes (Nov 2025)

- ✅ Fixed syntax error: removed invalid `continue` statement outside loop
- ✅ Fixed double semicolon on continue statement
- ✅ Script now processes all 33 accounts, skipping invalid credentials
- ✅ Added volume mounts for live code updates without rebuild
- ✅ Moved to standalone Docker Compose (removed Coolify dependency)

## Nginx Configuration

The VPS nginx configuration at `/etc/nginx/sites-available/qualscript.aifunnel.chat` proxies HTTPS traffic to this container on port 8090.
