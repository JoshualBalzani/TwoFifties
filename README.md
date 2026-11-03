<div align="center">

# TwoFifties

### Share the expenses. Keep the balance clear.

A self-hosted expense-sharing app for two people, with a Material 3 interface, flexible splits and a shared view of everyday spending.

**Developed by JOSHBALZANI** · [Italiano](README.it.md) · [Screenshot gallery](docs/screenshots/README.md)

[![Verify TwoFifties](https://github.com/JoshualBalzani/TwoFifties/actions/workflows/ci.yml/badge.svg)](https://github.com/JoshualBalzani/TwoFifties/actions/workflows/ci.yml) [![License: MIT](https://img.shields.io/badge/License-MIT-6750A4.svg)](LICENSE) [![Node.js 24+](https://img.shields.io/badge/Node.js-24%2B-43853D.svg)](https://nodejs.org/)

</div>

<table>
<tr><td align="center"><img src="docs/screenshots/03-spese.png" width="260" alt="Expenses and balance"></td><td align="center"><img src="docs/screenshots/05-nuova-spesa.png" width="260" alt="New expense"></td><td align="center"><img src="docs/screenshots/09-statistiche.png" width="260" alt="Statistics"></td></tr>
<tr><td align="center">Your balance at a glance</td><td align="center">A fair split for every expense</td><td align="center">Understand your spending</td></tr>
</table>

## Built for everyday life, together

Groceries, rent, a weekend away or a ticket bought for the other person: TwoFifties keeps track of who paid, who owes what and what remains to be settled. It works well for couples, roommates and any two people sharing a budget.

The name does not mean every expense must be split in half. Choose the split that fits the situation, keep reimbursement deadlines visible and confirm a settlement when payment has actually happened.

## What you can do

| Area | Features |
| --- | --- |
| **Expenses & balance** | Record the payer, date, category, description and note. See each person's contributions and the remaining balance. |
| **Flexible splits** | Split 50/50, choose percentages, enter exact shares or assign the full cost to the other person while recording who paid. |
| **Safe settlements** | Open the + button for expense and settlement actions. A confirmation dialog guards settlement registration. |
| **Find what matters** | Search descriptions and notes, filter transactions and save reusable views. |
| **Statistics & budgets** | Explore monthly totals and category breakdowns, compare periods and set monthly category limits. |
| **Recurring expenses** | Manage recurring payments and review proposed amounts before recording expenses that require confirmation. |
| **Reimbursements** | Track advances, set due dates, export calendar reminders and record reimbursements. |
| **Receipts** | Attach receipt images from a file or the device camera. Images are resized before upload. |
| **History & recovery** | Review changes and their author, compare previous values and restore deleted expenses from the 30-day trash. |
| **Your data** | Create and restore backups, import JSON/CSV and export transactions to Excel. |
| **Your preferences** | Edit both names, select light/dark/system theme and switch between Italian and English on each device. |

## A mobile interface with room to breathe

Bottom navigation keeps Expenses, Statistics, Budget and More within reach. Related tools are grouped in More; settings separate people, appearance, defaults and data. Material 3 surfaces, typography and fixed color roles provide a consistent interface in both themes. Touch gestures support sheet dismissal and supported navigation interactions.

The first-run guide introduces the app and asks for the two names. You can skip the introduction and optional preferences; both names remain required and must be different. A new installation contains no personal records or sample transactions.

## See the app in action

[**Browse all 26 mobile screenshots →**](docs/screenshots/README.md)

The gallery covers onboarding, expenses, quick actions, settlements, search, statistics, budgets, reimbursements, recurring expenses, categories, saved views, history, trash, backup, import/export, settings and both themes. Screenshots use **fictitious names and transactions** in an isolated temporary server. The installable app still starts empty. Most gallery images show Italian; an English interface example is included.

## Start with Docker

Requirements: Docker Engine with Docker Compose, or Docker Desktop.

```sh
git clone https://github.com/JoshualBalzani/TwoFifties.git
cd TwoFifties
cp .env.example .env
docker compose up --build -d
```

On Windows PowerShell, use `Copy-Item .env.example .env` instead of `cp` if preferred. Open **http://localhost:5001** and complete the first-run setup. The separate `twofifties-data` Docker volume preserves server data across container rebuilds.

Set **both** `AUTH_USER` and `AUTH_PASS` in `.env`, and use an HTTPS reverse proxy before exposing the app to the internet. Blank credentials allow unauthenticated access and are intended for local use. Do not commit `.env`.

## Run with Node.js

Requires **Node.js 24 or newer**.

```sh
npm ci
npm ci --prefix server
npm start
```

Open **http://localhost:5001**. Local server state, receipts and backups are written to `data/`, which Git ignores. Optional environment variables are documented in [.env.example](.env.example). Back up the data directory or Docker volume before upgrades.

## Offline use and synchronization

After an online visit has cached the app shell, the browser can reopen it offline and save changes locally. When the configured server is reachable again, changes synchronize; conflicting edits are presented for resolution. Devices connected to the same server use the same shared workspace. Names and theme belong to that workspace; language is a per-device preference.

## Privacy and deployment

You choose where to run the server. The browser keeps a local copy; the server stores shared state, receipts, history and backups. There is one workspace with shared Basic authentication, not separate user accounts. The app does not encrypt browser storage or server files at rest. Use trusted devices, HTTPS and protected backups. See [SECURITY.md](SECURITY.md).

**GitHub hosts this source repository.** Running TwoFifties online requires a Node.js or Docker host; GitHub Pages alone cannot run the API. This repository does not provide a managed cloud service.

## Development and verification

```sh
npm test
npx playwright install chromium
npm run test:browser
```

Tests cover split arithmetic, balances, concurrent edits, conflicts, receipts, backup/restore, onboarding, language switching, mobile navigation and offline saving. GitHub Actions repeats the automated suite. Express 5 serves the API and static app; the interface uses HTML, CSS and JavaScript with locally bundled Roboto fonts.

To reproduce the documentation images, run `node scripts/screenshots.cjs` after installing the browser. The script uses temporary fictitious data and leaves the application data directory empty. On Windows the browser scripts use installed Microsoft Edge; other platforms use Playwright Chromium.

[Contributing](CONTRIBUTING.md) · [Changelog](CHANGELOG.md) · [Third-party notices](THIRD_PARTY_NOTICES.md)

## License

[MIT](LICENSE) · Copyright © 2026 **JOSHBALZANI**. Fonts and Material Color Utilities retain their respective licenses.
