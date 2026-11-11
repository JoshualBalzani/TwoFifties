# TwoFifties — Material 3 Expressive

Audit successivo alla migrazione, 11 novembre 2026.

## Risultato e ambito

L'interfaccia usa un tema Expressive condiviso su home, navigazione, moduli, dettagli,
statistiche, budget, strumenti, impostazioni, onboarding e conferme. La palette
semantica e i dati finanziari esistenti sono conservati. Il font locale Roboto
variabile viene usato con una gerarchia enfatizzata; non sono necessarie nuove
dipendenze né richieste a servizi di font esterni.

Il tema è in `app/expressive.css`. `app/expressive.js` campiona risposte di molle
fisiche in curve CSS `linear()`: le transizioni restano gestite dal browser,
incluse interruzione e inversione. Sono distinti movimento spaziale, risposta
rapida e cambi di colore/opacità, con fallback CSS e movimento ridotto.

## Verifica delle criticità iniziali

| Criticità | Risultato |
| --- | --- |
| Dettaglio mobile privo di quote e metadati | Il dettaglio mostra gli stessi dati su telefono, tablet e desktop. |
| Campi adiacenti nel pannello di modifica | Layout a colonna con spazi fra campi, label e sezioni; verifica automatica da 1000 px. |
| Azioni della selezione non visibili a 1024 px | Toolbar flottante desktop; tutte le azioni controllate per posizione e assenza di sovrapposizioni. |
| Home mobile dominata dai riepiloghi | Riepilogo mensile compatto e accesso anticipato ai movimenti. |
| Rail troppo densa fra 840 e 999 px | Quattro destinazioni principali; strumenti secondari disponibili nella destinazione Tutto/Altro. |
| Contenuto compresso a 1000 px | Navigazione intermedia più stretta e colonne fluide. |
| Angoli sovrapposti nelle preferenze di navigazione | Liste raggruppate con angoli esterni e interni coerenti. |
| Riepilogo da zero nella ricerca vuota | Riepilogo nascosto; stato vuoto con azione Azzera filtri. |
| Azioni e metadati dei backup compressi | Comandi mobile su due righe, dati leggibili e azioni del backup separate. |
| Chiusura del pannello basata su un timeout rigido | Fine della transizione con fallback e cancellazione della chiusura pendente in caso di riapertura. |

## Componenti e schermate

- Importi principali, titoli e azioni usano pesi e dimensioni distinti; cifre tabulari,
  decimali e formattazione locale sono preservati. Il saldo si adatta alla lunghezza.
- Pulsanti principali da almeno 48 px; forme reattive alla pressione, gruppi con
  pulsanti connessi e selezione arrotondata, focus visibile e stati disabilitati.
- Home con badge separati per conferme, rimborsi e avvisi budget.
- FAB e menu mobile coordinati; toolbar contestuale desktop sempre raggiungibile.
- Schede, categorie, ricorrenze, rimborsi, storico, cestino e impostazioni condividono
  superfici e regole di contenimento; gli stati critici usano colori semantici.
- Budget con indicatore più leggibile e trattamento distinto del superamento.
- Moduli di spesa e ricorrenza, filtri, picker, note e ricevute condividono geometrie,
  label, selettori e azioni. Le date conservano il controllo nativo accessibile.
- Onboarding con logo, gerarchia enfatizzata e avanzamento in sei passaggi.
- Conferme e ripristino con titoli e testo più leggibili; stato vuoto iniziale con
  azione diretta per aggiungere una spesa.
- Snackbar, icone, checkbox, scelta lingua, tema e preferenze di navigazione
  seguono il tema comune. Movimento ridotto disattiva transizioni e animazioni.
- Altezza delle sheet collegata al viewport visibile; su mobile viene considerato
  lo spazio occupato dalla tastiera quando comunicato dalla Visual Viewport API.
- Service worker aggiornato per includere i nuovi asset anche offline.

## Matrice del controllo

La suite completa produce **283 stati**: 28 scenari × 2 lingue × 2 temi × 2 layout
(224 catture principali) e 59 stati aggiuntivi di verifica responsive e funzionale.
Il nome `11-more` su desktop documenta la shell con destinazioni persistenti,
non una pagina Altro separata.

Larghezze controllate: **320, 360, 390, 768, 839, 840, 999, 1000, 1024, 1440, 1920 px**.
La verifica aggiuntiva attraversa home, dettaglio, modifica e selezione per ciascuna
larghezza e controlla:

- assenza di overflow orizzontale della pagina;
- quote esatte nel dettaglio, anche sotto 1000 px;
- distanza tra i campi nel pannello laterale;
- raggiungibilità del salvataggio e delle azioni contestuali, inclusa copertura da altri elementi;
- errori di validazione e modalità di divisione percentuale, personalizzata e per l'altra persona;
- preferenze, creazione ricorrenza e modifica categoria;
- ricerca vuota, nomi e descrizioni lunghi, importi elevati e viewport di altezza ridotta;
- caricamento delle curve a molla, preferenza di movimento ridotto e shell offline.

Le immagini sono state riesaminate in chiaro e scuro per controllare gerarchia,
spaziatura, troncamenti, raggruppamenti e coerenza dei componenti.

Esito: suite di logica/server, suite browser esistente, 283 stati dell'audit
Expressive e controlli WebKit/Firefox superati. Questi ultimi coprono 12
combinazioni di motore, tema e larghezza, con quattro viste per combinazione.
Il controllo visivo ha inoltre portato alla disposizione mobile dei backup su
due righe e alla riga dedicata per totali mensili elevati, verificata a 320 e 390 px.
Nei casi controllati non restano le criticità bloccanti identificate nell'audit iniziale.

## Riproduzione

```powershell
npm test
npm run test:browser
npm run audit:expressive
node tests/expressive-engines.cjs
node scripts/check-docs.cjs
```

`audit:expressive` crea screenshot e galleria in
`artifacts/expressive-audit/index.html`, con il riepilogo automatico in
`artifacts/expressive-audit/results.json`. Gli artefatti sono esclusi da Git.
L'audit non modifica le immagini pubblicate in `docs/screenshots`.

`tests/expressive-engines.cjs` aggiunge controlli su WebKit e Firefox, in entrambi
i temi, a 390, 840 e 1024 px, per dettaglio, modifica, selezione e movimento ridotto.
Richiede i browser Playwright installati (`npx playwright install webkit firefox`).
Le sue catture e il risultato sono nella sottocartella `engines`.

Tutti i flussi di prova usano server, workspace e backup temporanei con dati
fittizi. I dati personali e i backup dell'installazione non vengono utilizzati.

## Limiti della verifica

L'emulazione di viewport e WebKit su Windows non equivale a una prova su un iPhone
fisico. Restano da verificare con hardware reale tastiera iOS/Android, safe area,
zoom del sistema e tecnologie assistive. Non viene dichiarata una certificazione
di accessibilità né la verifica di ogni combinazione possibile di dati e rete.

## Immagini pubblicate e controllo continuo

`npm run screenshots` rigenera e pubblica nei file del repository tutte le
224 immagini: 28 scenari mobile e 28 desktop, in italiano e inglese, in chiaro
e scuro. Il manifest conserva entrambe le famiglie di immagini.

Dopo un audit completo riuscito è possibile usare
`node scripts/publish-screenshots.cjs --from-audit` e poi
`node scripts/build-galleries.cjs`: vengono verificati presenza, formato e
dimensioni dell'intera matrice prima di sostituire le immagini pubblicate.
Il sito GitHub Pages e le anteprime social vengono ricompilati usando le nuove
catture. La CI esegue anche `npm run test:expressive` per controllare i layout
e i flussi nelle modifiche successive.

## Riferimenti di progetto

- [Material Design — introduzione a Expressive](https://m3.material.io/get-started)
- [Motion physics](https://m3.material.io/styles/motion)
- [Button groups](https://m3.material.io/components/button-groups/overview)
