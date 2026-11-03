# TwoFifties

Expense sharing for two people, developed by **JOSHBALZANI**. Material 3, mobile navigation, Italian/English and offline support.

[Italiano](README.it.md)

## Features

- Guided setup with skippable introduction and two required distinct names.
- Equal, percentage, exact and other-person-only expense splits.
- Confirmed settlements, search, filters, statistics and budgets.
- Categories, recurring expenses, reimbursements, receipts, history and trash.
- Backup/restore, JSON/CSV import, Excel export and calendar reminders.
- Light/dark/system themes, editable names and per-device language under More → Settings → Appearance.

The workspace starts empty. No personal records, credentials or sample transactions are included.

## Docker

Copy .env.example to .env, then run:

```sh
docker compose up --build -d
```

Open http://localhost:5001. Data is stored in the separate twofifties-data volume. Set BOTH AUTH_USER and AUTH_PASS and use an HTTPS reverse proxy before internet exposure. Blank credentials allow unauthenticated access and are intended only for local use.

## Node.js 24+

```sh
npm ci
npm ci --prefix server
npm start
```

Open http://localhost:5001. Runtime files are stored in data/, ignored by Git. Back up the directory or Docker volume before upgrades.

## Verify

```sh
npm test
npx playwright install chromium
npm run test:browser
```

Browser tests run against isolated temporary data.

## Publish on GitHub

Create an empty TwoFifties repository in the JOSHBALZANI account. Review staged files and run:

```sh
git init -b main
git add .
git commit -m "Initial TwoFifties release"
git remote add origin https://github.com/JOSHBALZANI/TwoFifties.git
git push -u origin main
```

GitHub Actions runs verification. GitHub Pages only hosts static files; deploy this app with Docker or a Node.js host because its API requires a server. Publishing the repository does not deploy a running service.

## Data and privacy

Each server hosts one shared workspace, with workspace-wide Basic authentication rather than individual accounts. The browser stores a local offline copy; the server stores shared state, receipts, audit history and backups. Offline changes synchronize on reconnection, with conflict resolution. Files and browser storage are not encrypted by the app. Use trusted devices, HTTPS, protected backups and configured authentication. Never commit .env, financial exports or runtime data.

## License

MIT, copyright JOSHBALZANI. See THIRD_PARTY_NOTICES.md for bundled fonts and color utilities.
