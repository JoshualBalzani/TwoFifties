---
layout: post
title: "Template gratuito di budget mensile da scaricare"
description: "Scarica il template gratuito di budget mensile in CSV e personalizza entrate, uscite e accantonamenti con esempi e controlli semplici."
date: 2026-11-11
categories: [confronti-e-strumenti]
tags: [template, csv, budget]
permalink: /blog/template-budget-mensile/
keyword: 'template gratuito di budget mensile'
order: 28
---

# Template gratuito di budget mensile da scaricare

Questo template gratuito di budget mensile permette di confrontare entrate, uscite e accantonamenti previsti con gli importi effettivi. Scarica il CSV, sostituisci le righe ipotetiche e usalo in un foglio di calcolo senza dipendere da un modello complicato.

## Template gratuito di budget mensile: i file disponibili

Il [budget mensile da scaricare](/downloads/budget-mensile.csv) contiene sei colonne: mese, tipo di movimento, categoria, previsto, effettivo e note. È un file testuale CSV con separatore punto e virgola, senza macro e senza formule preinserite. I calcoli descritti più avanti si aggiungono nel programma che preferisci.

Puoi abbinarlo al [registro delle spese](/downloads/registro-spese.csv), che serve per annotare i singoli acquisti. I due file hanno ruoli diversi: il budget mostra i totali per categoria, il registro conserva gli eventi che spiegano quei totali.

Gli importi presenti sono esempi ipotetici. Non rappresentano costi medi, soglie consigliate o un modello di vita da replicare. Prima dell'uso, sostituisci sia i numeri sia le categorie che non corrispondono alla tua situazione.

## Apri il CSV senza mescolare le colonne

Importa il file dal menu del tuo foglio di calcolo. Se tutti i valori finiscono nella prima colonna, imposta esplicitamente il punto e virgola come separatore. Controlla che Previsto_EUR ed Effettivo_EUR contengano numeri utilizzabili nei calcoli.

Applica un formato valuta alle colonne D ed E. Nel file di esempio gli importi sono interi; se il foglio usa le impostazioni italiane, puoi inserire i centesimi con la virgola. Non aggiungere testo come «circa 50 euro» in una cella numerica: scrivi 50 e spiega l'incertezza nelle note.

Salva poi una copia nel formato del programma scelto se aggiungi formule, colori o più schede. Il CSV conserva una tabella di valori, non tutte le caratteristiche di un documento di lavoro complesso.

## Leggi la struttura prima di modificarla

| Campo | Come compilarlo |
| --- | --- |
| Mese | Periodo del budget, per esempio 2026-11 |
| Tipo | Entrata, Uscita oppure Accantonamento |
| Categoria | Destinazione comprensibile e stabile |
| Previsto_EUR | Importo pianificato all'inizio |
| Effettivo_EUR | Importo realmente verificato |
| Note | Ipotesi, scadenze e spiegazioni |

La distinzione tra Uscita e Accantonamento è intenzionale. Un trasferimento verso una riserva modifica la disponibilità destinata al consumo, ma non equivale automaticamente a un acquisto. Conservare la distinzione aiuta a non gonfiare le spese.

Non cambiare continuamente le etichette del campo Tipo se utilizzi formule che le cercano. Se scrivi Entrate in alcune righe e Entrata in altre, un riepilogo basato sul secondo termine potrebbe ignorare le prime.

## Compila prima le previsioni

Parti dalle entrate ragionevolmente disponibili nel mese. Poi inserisci gli impegni già noti e le spese essenziali. Aggiungi le categorie flessibili soltanto dopo aver verificato quanto resta. Questo ordine rende esplicite le priorità, senza imporre una percentuale unica.

Per i pagamenti periodici, indica nelle note la scadenza e la somma ancora da raccogliere. Esempio illustrativo: se mancano 180 euro a una spesa prevista tra tre mesi, l'accantonamento richiesto è 60 euro mensili. Il numero deriva dal tempo disponibile, non da una regola generale.

La guida al [budget mensile personale](/blog/budget-mensile-personale/) spiega come passare dalla fotografia delle uscite alla pianificazione. Il modello è il supporto; le decisioni dipendono dagli impegni e dal reddito reali.

## Aggiungi riepiloghi semplici e controllabili

In un foglio configurato con funzioni italiane puoi sommare le entrate previste usando `=SOMMA.SE(B2:B1000;"Entrata";D2:D1000)`. Sostituisci Entrata con Uscita o Accantonamento per ottenere gli altri totali. Per gli importi effettivi usa la colonna E al posto della D.

Il residuo pianificato si ottiene sottraendo alle entrate sia le uscite sia gli accantonamenti scelti. Non sommare indiscriminatamente tutta la colonna: entrate e impieghi sono inseriti come importi positivi e hanno ruoli opposti.

La [documentazione di SOMMA.SE di Google](https://support.google.com/docs/answer/3093583?hl=it) chiarisce la logica del criterio. Se il tuo programma usa nomi inglesi o impostazioni differenti, adatta la sintassi prima di copiare le formule.

## Verifica i risultati con il campione ipotetico

Nel file iniziale le entrate previste sono 1.600 euro, le uscite previste 1.200 euro e gli accantonamenti 250 euro. Il residuo pianificato è quindi 150 euro. Gli importi effettivi producono invece 1.165 euro di uscite e lo stesso accantonamento, lasciando 185 euro.

La differenza di 35 euro non significa che devi spenderla immediatamente. Puoi lasciarla disponibile, destinarla a un obiettivo o usarla per una voce sottostimata, dopo aver verificato che il mese sia completo. Il risultato dipende sempre dalla presenza di tutte le spese.

Se i tuoi totali non coincidono con questi numeri prima della personalizzazione, controlla separatore, formato numerico e criteri delle formule. È preferibile scoprire un problema sul campione che dopo aver inserito il tuo archivio.

## Aggiorna l'effettivo senza riscrivere la storia

Durante il mese aggiorna la colonna Effettivo_EUR con i totali verificati. Mantieni la previsione iniziale per capire dove il piano differisce dalla realtà. Se modifichi entrambe continuamente fino a farle coincidere, perdi l'informazione più utile del confronto.

Puoi aggiungere una colonna di differenza, ma definisci il significato del segno. Per una spesa, effettivo meno previsto positivo indica un superamento; per un'entrata indica un incasso maggiore. Una formula identica può avere implicazioni diverse.

Usa poche [categorie di spesa](/blog/categorie-di-spesa/) coerenti. Se una voce pesa molto e non capisci perché, dividila in sottocategorie nel mese seguente. Non occorre ricostruire ogni dettaglio retroattivamente per ottenere una prima decisione utile.

Conserva il mese concluso in una cartella riconoscibile prima di preparare la copia successiva. Un nome come budget-2026-11 distingue il periodo senza dover aprire ogni documento. Se condividi il file, concorda una sola copia di riferimento per evitare aggiornamenti paralleli difficili da riconciliare.

## Domande frequenti

### Devo pagare o creare un account per scaricare il file?

Il collegamento porta direttamente al CSV gratuito. L'eventuale programma usato per aprirlo può avere proprie condizioni, indipendenti da questo download.

### Posso usare il modello anche in due?

Sì, come riepilogo concordato. Per pagatori e quote usa anche un registro dedicato: il totale della categoria non spiega da solo chi deve rimborsare chi.

### Come inizio il mese successivo?

Crea una copia, aggiorna il mese e rivedi le previsioni usando il risultato precedente. Svuota gli importi effettivi senza eliminare categorie o formule che vuoi conservare.

Se il foglio vi serve soprattutto per le spese condivise in due, valutate [TwoFifties](https://joshualbalzani.github.io/TwoFifties/): registra pagatori e quote, offre budget mensili per categoria ed esporta in Excel. È gratuita e self-hosted, quindi richiede una vostra installazione con Docker o Node.js 24+.
