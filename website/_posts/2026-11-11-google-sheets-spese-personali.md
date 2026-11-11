---
layout: post
title: "Come usare Google Sheets per le spese personali"
description: "Google Sheets per le spese personali: scarica il registro CSV, imposta le colonne e usa formule italiane per categorie, quote e controlli."
date: 2026-11-11
categories: [confronti-e-strumenti]
tags: [google-sheets, template, formule]
permalink: /blog/google-sheets-spese-personali/
keyword: 'Google Sheets per le spese personali'
order: 27
---

# Come usare Google Sheets per le spese personali

Puoi usare Google Sheets per le spese personali creando un registro con data, categoria, descrizione e importo, poi un riepilogo che somma le uscite per categoria. Qui trovi un CSV scaricabile e formule con nomi italiani e separatori adatti a un foglio configurato per l'Italia.

## Google Sheets per le spese personali: scarica il registro

Scarica il [registro delle spese in CSV](/downloads/registro-spese.csv). Il file contiene intestazioni e quattro movimenti ipotetici: sostituiscili prima di iniziare il tuo archivio. Le righe di esempio servono a verificare i calcoli, non descrivono un budget consigliato.

Il formato usa il punto e virgola come separatore delle colonne e importi interi per evitare ambiguità iniziali. Per i centesimi, dopo l'importazione inserisci numeri come 12,50 nel foglio configurato per l'Italia e applica il formato valuta. Non digitare il simbolo dell'euro dentro una cella che dovrebbe contenere un numero.

È disponibile anche il [budget mensile in CSV](/downloads/budget-mensile.csv), destinato a confrontare previsione ed effettivo. Tieni distinto il registro degli eventi dal piano che usi per decidere le destinazioni del denaro.

## Importa il CSV e imposta lingua e posizione

Apri un nuovo foglio, usa File, Importa e seleziona il CSV scaricato. Nell'importazione scegli il punto e virgola come separatore se non viene riconosciuto. Controlla che ciascuna intestazione occupi una colonna distinta e che gli importi siano numerici.

In File, Impostazioni, scegli Italia come impostazione internazionale e il fuso orario appropriato. Per usare le formule italiane, verifica la lingua di visualizzazione e disattiva l'opzione che mantiene sempre i nomi delle funzioni in inglese. La [guida ufficiale alle impostazioni di Fogli Google](https://support.google.com/docs/answer/58515?hl=it) descrive queste scelte e i loro effetti.

Rinomina la scheda importata `Registro`. Mantieni quel nome nei passaggi successivi: i riferimenti delle formule dipendono anche dal nome della scheda, non soltanto dalle lettere delle colonne.

## Comprendi le colonne prima di inserire dati

Le prime quattro colonne bastano per un registro individuale. Le successive permettono anche di descrivere un acquisto condiviso tra due persone, senza confondere il pagamento con il costo attribuito a ciascuna.

| Colonna | Contenuto |
| --- | --- |
| A | Data dell'acquisto |
| B | Categoria |
| C | Descrizione riconoscibile |
| D | Importo complessivo in euro |
| E | Pagatore, A oppure B |
| F | Quota attribuita ad A |
| G | Quota attribuita a B |
| H | Note e chiarimenti |

Per un uso soltanto personale, usa A come pagatore, copia l'importo in F e lascia zero in G. Puoi anche nascondere le colonne che non ti servono, mantenendo intatta la struttura del modello.

## Crea un riepilogo delle categorie

Aggiungi una scheda chiamata `Riepilogo`. In A1 scrivi Categoria, in B1 Totale; in A2 inserisci Alimentari. In B2 usa questa formula, poi copia verso il basso dopo aver inserito altre categorie in colonna A:

```text
=SOMMA.SE(Registro!B2:B1000;A2;Registro!D2:D1000)
```

La funzione cerca il testo di A2 nella colonna delle categorie e somma gli importi corrispondenti. La [documentazione ufficiale di SOMMA.SE](https://support.google.com/docs/answer/3093583?hl=it) descrive sintassi e criterio. Gli intervalli qui arrivano alla riga 1000: estendili quando il registro cresce oltre quel limite.

Questo riepilogo somma tutte le righe presenti, senza filtrare il mese. Per iniziare in modo semplice, usa una copia del registro per ciascun mese oppure limita esplicitamente i dati al periodo che stai analizzando.

## Aggiungi controlli che scoprono gli errori

Nella scheda Registro scrivi Controllo quote in I1. In I2 inserisci la formula seguente e copiala per le righe compilate. Il risultato deve essere zero quando le quote coprono esattamente la spesa:

```text
=D2-F2-G2
```

Per contare i movimenti della categoria presente in A2 di Riepilogo, puoi usare in C2:

```text
=CONTA.SE(Registro!B2:B1000;A2)
```

La [guida ufficiale di CONTA.SE](https://support.google.com/docs/answer/3093480?hl=it) spiega il conteggio condizionale. Il numero di movimenti non misura il peso economico della categoria, ma aiuta a notare se mancano acquisti o se una voce è stata scritta in modo incoerente.

## Verifica il modello con i dati di esempio

Prima di cancellare le righe ipotetiche, controlla che il totale degli importi sia 135 euro. Puoi calcolarlo con `=SOMMA(Registro!D2:D1000)`. Le quote di A sommano 75 euro, quelle di B 60 euro; la somma delle quote torna quindi al totale.

Nel campione A ha pagato 95 euro e B 40 euro. Poiché la quota di A è 75 euro, A ha anticipato 20 euro per B. Questo esempio illustrativo permette di verificare la distinzione tra quanto una persona paga e quanto effettivamente le compete.

Non inserire il rimborso tra le normali spese della colonna D: aumenterebbe il costo totale senza un nuovo acquisto. Se vuoi monitorare i trasferimenti, usa una scheda separata con data, mittente, destinatario e importo.

## Mantieni categorie coerenti e copie leggibili

Scegli poche etichette e riutilizzale identiche. Alimentari, Spesa alimentare e Supermercato diventano tre criteri diversi se non li uniformi. Puoi partire dalle [categorie di spesa](/blog/categorie-di-spesa/) e adattarle alle decisioni che vuoi prendere.

Conserva una copia prima di modificare formule o struttura. Se condividi il file, stabilisci chi può cambiare le formule e chi inserisce i movimenti. Evita una copia per persona quando volete mantenere un solo registro comune.

Chiudi il mese confrontando totale e documenti disponibili, poi usa il [template di budget mensile](/blog/template-budget-mensile/) per decidere il mese successivo. Il riepilogo descrive quanto è successo; il budget trasforma quei dati in un piano.

Quando aggiungi nuove righe, copia il controllo delle quote anche nella colonna I corrispondente. Verifica poi un acquisto appena inserito nel riepilogo della sua categoria: questo controllo distingue un problema nell'importo da un intervallo che non raggiunge più le ultime righe. Se rinomini una categoria, aggiorna sia le righe del Registro sia l'etichetta nel Riepilogo, così il criterio della formula continua a trovare gli acquisti attesi.

## Domande frequenti

### Perché la formula non viene riconosciuta?

Controlla lingua delle funzioni, separatori e nome Registro. Se mantieni i nomi inglesi, SOMMA.SE diventa SUMIF e CONTA.SE diventa COUNTIF.

### Perché una spesa non entra nel totale?

Verifica che l'importo sia un numero, che la categoria coincida con il criterio e che la riga sia inclusa negli intervalli della formula.

### Il CSV contiene già formule automatiche?

No. Contiene dati semplici e intestazioni. Le formule vengono aggiunte nel foglio seguendo i passaggi, così puoi controllarne posizione e significato.

Se usate il registro in due e preferite moduli dedicati per quote e rimborsi, considerate [TwoFifties](https://joshualbalzani.github.io/TwoFifties/). È gratuita e self-hosted, installabile con Docker o Node.js 24+, e offre esportazione Excel per continuare le analisi nel vostro foglio.
