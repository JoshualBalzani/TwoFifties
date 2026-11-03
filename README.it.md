<div align="center">

# TwoFifties

### Dividete le spese. Tenete chiaro il saldo.

L'app per gestire le spese di due persone: un'interfaccia Material 3, divisioni flessibili e una visione condivisa delle uscite quotidiane. Da ospitare sul proprio server.

**Sviluppato da JOSHBALZANI** · [English](README.md) · [Galleria screenshot](docs/screenshots/README.md)

[![Verify TwoFifties](https://github.com/JoshualBalzani/TwoFifties/actions/workflows/ci.yml/badge.svg)](https://github.com/JoshualBalzani/TwoFifties/actions/workflows/ci.yml) [![License: MIT](https://img.shields.io/badge/License-MIT-6750A4.svg)](LICENSE) [![Node.js 24+](https://img.shields.io/badge/Node.js-24%2B-43853D.svg)](https://nodejs.org/)

</div>

<table>
<tr><td align="center"><img src="docs/screenshots/03-spese.png" width="260" alt="Spese e saldo"></td><td align="center"><img src="docs/screenshots/05-nuova-spesa.png" width="260" alt="Nuova spesa"></td><td align="center"><img src="docs/screenshots/09-statistiche.png" width="260" alt="Statistiche"></td></tr>
<tr><td align="center">Il saldo, sempre chiaro</td><td align="center">Ogni spesa, la sua divisione</td><td align="center">Uno sguardo alle abitudini</td></tr>
</table>

## Le spese di tutti i giorni, insieme

La spesa al supermercato, l'affitto, una cena o un biglietto anticipato per l'altra persona: TwoFifties tiene traccia di chi ha pagato, di quanto spetta a ciascuno e di cosa rimane da saldare. È pensata per coppie, coinquilini e due persone che condividono delle spese.

Il nome non obbliga a dividere tutto a metà. Ogni movimento può seguire una divisione diversa, con promemoria per i rimborsi e una conferma prima di registrare il saldo.

## Tutto quello che puoi gestire

| Funzione | Cosa permette di fare |
| --- | --- |
| **Spese e saldo** | Registra pagatore, data, categoria, descrizione e nota. Consulta contributi personali e saldo residuo. |
| **Divisioni flessibili** | Scegli 50/50, percentuali, importi esatti o tutto a carico dell'altra persona, conservando chi ha realmente pagato. |
| **Saldo con conferma** | Dal pulsante + scegli nuova spesa o saldo. Una finestra di conferma protegge la registrazione del pagamento. |
| **Ricerca e filtri** | Cerca nelle descrizioni e nelle note, filtra i movimenti e salva le viste da richiamare. |
| **Statistiche e budget** | Esplora totali mensili e categorie, confronta periodi e imposta limiti mensili per categoria. |
| **Spese ricorrenti** | Gestisci i pagamenti periodici e controlla le proposte prima di registrare le ricorrenze che richiedono conferma. |
| **Anticipi e rimborsi** | Tieni visibili le somme anticipate, aggiungi scadenze, esporta promemoria nel calendario e registra i rimborsi. |
| **Ricevute** | Allega immagini da un file o dalla fotocamera. Le immagini vengono ridimensionate prima del caricamento. |
| **Storico e cestino** | Consulta autore e modifiche, confronta i valori precedenti e recupera le spese eliminate dal cestino entro 30 giorni. |
| **Backup e file** | Crea e ripristina backup, importa JSON/CSV ed esporta i movimenti in Excel. |
| **Preferenze** | Modifica i nomi, scegli tema chiaro/scuro/sistema e imposta italiano o inglese sul singolo dispositivo. |

## Un'interfaccia pensata per il telefono

La navigazione inferiore mette a portata di mano Spese, Statistiche, Budget e Altro. Gli strumenti sono raccolti per funzione; le impostazioni distinguono persone, aspetto, preferenze per le nuove spese e dati. Superfici, tipografia e ruoli colore Material 3 mantengono una struttura coerente nei temi chiaro e scuro. Le gesture supportano la chiusura dei pannelli e le interazioni di navigazione previste.

Al primo avvio una presentazione guidata introduce l'app. Puoi saltare la spiegazione e le preferenze facoltative: **i due nomi rimangono obbligatori e devono essere diversi**. Una nuova installazione parte vuota, senza spese o dati personali precompilati.

## Guarda tutte le funzioni

[**Apri la galleria con 26 screenshot mobile →**](docs/screenshots/README.md)

Le immagini mostrano schermate reali dell'app: configurazione, spese, azioni rapide, saldo, ricerca, statistiche, budget, rimborsi, ricorrenze, categorie, viste salvate, storico, cestino, backup, importazione, esportazione e impostazioni. Sono inclusi tema scuro e interfaccia inglese.

**Nomi e movimenti nelle immagini sono inventati.** Gli screenshot sono generati su un server temporaneo isolato; l'app distribuita continua a partire senza dati.

## Avvio con Docker

Installa Docker Desktop oppure Docker Engine con Compose, quindi:

```sh
git clone https://github.com/JoshualBalzani/TwoFifties.git
cd TwoFifties
cp .env.example .env
docker compose up --build -d
```

In PowerShell puoi usare `Copy-Item .env.example .env`. Apri **http://localhost:5001** e completa la configurazione iniziale. Il volume separato `twofifties-data` conserva i dati anche quando ricostruisci il container.

Prima dell'accesso da internet imposta **entrambe** le credenziali `AUTH_USER` e `AUTH_PASS` nel file `.env` e usa un reverse proxy HTTPS. Senza credenziali l'accesso è libero, adatto all'uso locale. Non pubblicare il file `.env`.

## Avvio con Node.js

Richiede **Node.js 24 o successivo**.

```sh
npm ci
npm ci --prefix server
npm start
```

Apri **http://localhost:5001**. Stato, ricevute e backup vengono conservati nella cartella `data/`, esclusa da Git. Le variabili facoltative sono in [.env.example](.env.example). Prima degli aggiornamenti salva una copia della cartella dati o del volume Docker.

## Offline e sincronizzazione

Dopo una visita online che abbia memorizzato l'app, puoi riaprirla offline e salvare modifiche nel browser. Al ritorno della connessione il server riceve gli aggiornamenti; eventuali conflitti vengono proposti per la risoluzione. I dispositivi collegati allo stesso server condividono uno spazio di lavoro. Nomi e tema sono condivisi; la lingua è una preferenza del dispositivo.

## Dati, privacy e pubblicazione

Scegli tu dove ospitare il server. Il browser mantiene una copia locale; il server conserva stato condiviso, ricevute, storico e backup. L'accesso usa un'autenticazione Basic comune allo spazio di lavoro, senza account personali separati. L'app non cifra i file e i dati del browser a riposo: usa dispositivi affidabili, HTTPS e backup protetti. Consulta [SECURITY.md](SECURITY.md).

**Questo repository pubblica il codice sorgente.** Per usare l'app online serve un host Node.js o Docker: GitHub Pages da solo non esegue l'API. Non è incluso un servizio cloud gestito.

## Verifiche e sviluppo

```sh
npm test
npx playwright install chromium
npm run test:browser
```

I test verificano divisioni, saldi, modifiche concorrenti, conflitti, ricevute, backup, primo avvio, lingue, navigazione mobile e salvataggio offline. GitHub Actions esegue la suite automatica. Il server usa Express 5; l'interfaccia usa HTML, CSS, JavaScript e font Roboto inclusi localmente.

Per rigenerare la galleria: `node scripts/screenshots.cjs`. Lo script crea soltanto dati dimostrativi temporanei e lascia vuota la cartella dati dell'app. Su Windows utilizza Microsoft Edge installato; sulle altre piattaforme Chromium di Playwright.

[Contribuire](CONTRIBUTING.md) · [Novità](CHANGELOG.md) · [Licenze di terze parti](THIRD_PARTY_NOTICES.md)

## Licenza

[MIT](LICENSE) · Copyright © 2026 **JOSHBALZANI**. Font e Material Color Utilities mantengono le proprie licenze.
