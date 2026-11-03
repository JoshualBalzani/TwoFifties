# TwoFifties

App per dividere le spese tra due persone, sviluppata da **JOSHBALZANI**.

La copia parte vuota, senza dati personali, credenziali o movimenti dimostrativi. La presentazione si può saltare, ma due nomi diversi sono obbligatori. I nomi si cambiano in Impostazioni → Persone. La lingua si cambia in Altro → Impostazioni → Aspetto e vale per il dispositivo.

## Avvio

Con Docker copia .env.example in .env, esegui docker compose up --build -d e apri http://localhost:5001. I dati risiedono nel volume separato twofifties-data.

Con Node.js 24 o successivo esegui npm ci, npm ci --prefix server e npm start. I dati vengono salvati in data/, esclusa da Git.

Prima di esporre il server a internet imposta entrambe le credenziali AUTH_USER e AUTH_PASS e usa HTTPS. Senza credenziali l'accesso è libero, adatto solo all'uso locale. Ogni server corrisponde a uno spazio condiviso, senza account individuali. Proteggi dispositivi, ricevute e backup: l'app non cifra i dati a riposo.

## Pubblicazione

Il README inglese contiene i comandi per JOSHBALZANI/TwoFifties. Sono inclusi licenza MIT, workflow GitHub Actions e configurazione Docker. GitHub Pages da solo non esegue l'API Node necessaria. Nessuna pubblicazione viene effettuata automaticamente.

Le funzioni comprendono divisioni personalizzate e 100/0, saldo con conferma, categorie, ricorrenze, rimborsi, ricevute, statistiche, budget, filtri, storico, cestino, backup e importazione/esportazione. L'uso offline mantiene una copia nel browser e sincronizza al ritorno della connessione.

Verifica: npm test. Test browser: npx playwright install chromium, poi npm run test:browser.
