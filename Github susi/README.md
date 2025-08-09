# TeaseMachine.ai
Prototype med Mistress Susi kontrollknapper for Handy.

## Kom i gang
1. Installer avhengigheter:
   ```bash
   npm install
   ```
2. Kopier `.env.example` til `.env` og fyll inn din HANDY_API_KEY.
3. Kjør lokalt:
   ```bash
   npm run dev
   ```
4. Deploy til Vercel eller annen hosting.

## Mapper
- `app/page.js` – Hovedside med knapper
- `app/api/handy/route.js` – API-endepunkt for Handy-integrasjon
