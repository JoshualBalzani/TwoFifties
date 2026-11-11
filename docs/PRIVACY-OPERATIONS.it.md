# Gestione privacy del sito TwoFifties

Aggiornato l’11 novembre 2026. Questo promemoria operativo non è una certificazione di conformità né sostituisce una valutazione professionale degli accordi e dei trattamenti effettivi.

## Dati confermati dal titolare

- Titolare: Joshual Balzani; contatto privacy: joshbalzani@gmail.com.
- Mantenere Analytics, stream G-P9818C52WC.
- Impostazioni GA4 comunicate: eventi 2 mesi; dati utente 14 mesi; ripristino della conservazione a ogni nuova attività utente attivo.

Il codice fiscale non è necessario per questa informativa e non viene pubblicato. Non inserire credenziali, documenti o informazioni finanziarie nelle issue pubbliche.

## Configurazione del sito

Le informative sono in `website/privacy.it.md` e `website/privacy.en.md`, compilate tramite il renderer esistente. Devono essere aggiornate insieme quando cambia il trattamento. Il dominio viene inserito dalla configurazione del sito.

Il tag Analytics si carica solo dopo accettazione. I consensi pubblicitari restano negati; Google Signals e segnali di personalizzazione sono disabilitati nel tag. I cookie sono configurati sul percorso del sito, a 180 giorni e senza rinnovo automatico. La scelta nel browser ha validità di sei mesi; una revoca disabilita la raccolta, rimuove i cookie accessibili e ricarica le pagine che avevano caricato Analytics. Le revoche si propagano fra schede della stessa origine.

La scelta resta nella memoria del browser: non esiste un registro centralizzato di consenso e non va dichiarato che esista. Conserva le versioni pubblicate di testi, configurazione, banner e verifiche. La sufficienza delle evidenze per dimostrare i consensi deve essere valutata rispetto ai trattamenti reali e al principio di responsabilizzazione; non aggiungere identificatori personali solo per costruire un registro.

## Controlli nell’account da completare

1. Verifica e conserva prova dell’accettazione dei termini di trattamento dati applicabili a Google Analytics e degli accordi utilizzati con hosting e posta. Il codice non può accettare o verificare questi accordi per il titolare.
2. Controlla Google Signals, personalizzazione, Google Ads, condivisione dati con altri prodotti, misurazione avanzata e ogni altro tag collegato. Il blocco nel tag non dimostra che tutte le impostazioni dell’account siano disattivate. Per un uso soltanto statistico, disattiva le funzioni pubblicitarie non necessarie e rimuovi collegamenti non usati.
3. Conferma che la conservazione resti quella comunicata. Valuta se servono davvero 14 mesi e il rinnovo a ogni attività: scegli periodi più brevi quando sufficienti. Non modificarli senza aggiornare l’informativa.
4. Documenta destinatari, ruoli e basi dei trasferimenti internazionali effettivi, gli accordi e le eventuali valutazioni necessarie. Un link alla policy del fornitore non sostituisce questa verifica.
5. Proteggi account GitHub, Google e posta con autenticazione a più fattori, accessi limitati e recupero sicuro. Non inviare in Analytics dati identificativi o dati dell’app.

## Richieste e conservazione

Controlla regolarmente la casella privacy e rispondi entro i termini applicabili. Verifica l’identità con misure proporzionate soltanto quando necessario. Registra richiesta, riscontro ed eventuale motivo della conservazione senza accumulare documenti non necessari.

Elimina periodicamente comunicazioni e allegati che non servono più. Se mantieni dati per una controversia o un obbligo, documenta motivo e termine. Non promettere la cancellazione di tutte le copie nei sistemi di terzi senza averne verificato la fattibilità. Valuta gli obblighi di notifica e comunicazione in caso di violazione di dati personali.

Il titolare non ha fornito una valutazione su eventuale obbligo di designare un DPO: l’informativa non inventa una nomina o un’esenzione. Verifica gli obblighi organizzativi applicabili alla situazione effettiva. Per installazioni offerte ad altre persone occorre valutare separatamente ruoli, informativa, accessi e sicurezza.

## Verifica tecnica

Esegui `npm run site:test` prima di pubblicare. Il test privacy intercetta il tag per non inviare visite di prova alla proprietà reale; verifica blocco preventivo, rifiuto, revoca, scadenza, schede concorrenti e accessibilità dei contenuti senza JavaScript. Non certifica la configurazione dell’account Google o tutti i comportamenti futuri della libreria esterna. Dopo modifiche ad Analytics controlla anche le richieste effettive e i cookie nel browser.

## Fonti ufficiali

- https://www.garanteprivacy.it/regolamentoue
- https://www.garanteprivacy.it/home/docweb/-/docweb-display/docweb/9677876
- https://www.garanteprivacy.it/home/diritti/come-agire-per-tutelare-i-tuoi-dati-personali
- https://developers.google.com/tag-platform/security/guides/consent
- https://developers.google.com/analytics/devguides/collection/ga4/reference/config
- https://support.google.com/analytics/answer/7667196
- https://business.safety.google/adsprocessorterms/
- https://policies.google.com/privacy/frameworks
- https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement
