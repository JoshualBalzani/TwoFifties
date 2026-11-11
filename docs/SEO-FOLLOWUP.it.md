# TwoFifties: seguito dell’audit SEO

Audit del 11 novembre 2026. Questo documento distingue gli interventi locali dalle operazioni ancora da eseguire in Search Console.

## Correzioni nel sito

- Aggiunte descrizioni specifiche alle informative privacy italiana e inglese.
- Allineato il footer italiano all’informativa esistente: Analytics viene caricato solo con il consenso.
- Conservati sitemap, collegamenti bilingue e guide d’installazione già presenti.

Le modifiche locali diventano pubbliche quando vengono pubblicate tramite il workflow GitHub Pages esistente. Non è necessario cambiare hosting.

## Prima azione: Search Console

L’ispezione dell’11 novembre riporta la home italiana indicizzata, con ultima scansione il 3 novembre. La home inglese e le due guide risultano sconosciute a Google. Sono stati osservati HTTP 200 e direttive che consentono l’indicizzazione su tutte e quattro le pagine.

1. Apri la proprietà con prefisso URL `https://joshualbalzani.github.io/TwoFifties/` in [Google Search Console](https://search.google.com/search-console/).
2. Nel rapporto **Sitemap**, verifica se è già presente `https://joshualbalzani.github.io/TwoFifties/sitemap.xml`. Se manca, invia quell’indirizzo. Se è già presente con esito positivo, non occorre reinviarla senza modifiche.
3. Controlla che l’esito sia positivo; in caso di errore, apri i dettagli prima di riprovare.
4. In **Controllo URL**, apri singolarmente le pagine qui sotto, esegui il test dell’URL pubblicato e, se disponibile, premi **Richiedi indicizzazione**.

| Pagina | URL |
| --- | --- |
| Home inglese | https://joshualbalzani.github.io/TwoFifties/en/ |
| Guida italiana | https://joshualbalzani.github.io/TwoFifties/installazione/ |
| Guida inglese | https://joshualbalzani.github.io/TwoFifties/en/install/ |

Gli strumenti OpenSEO disponibili in questa sessione leggono le ispezioni, ma non inviano sitemap o richieste di indicizzazione. Queste operazioni non sono state eseguite dall’agente.

Ricontrolla indicizzazione e impressioni fra il 18 e il 25 novembre 2026. Se la richiesta viene inviata più tardi, conta 7–14 giorni dalla data effettiva. È una finestra di verifica, non una promessa di indicizzazione. Google può richiedere giorni o settimane; richieste ripetute non accelerano la scansione.

## Seconda azione: confronto mirato

Dopo il controllo della scoperta delle pagine, valuta una pagina inglese per chi cerca un’alternativa a Splitwise da installare sul proprio server. Il campione OpenSEO stima 590 ricerche mensili USA per `splitwise alternative`; la quota interessata a un’app per due persone con server proprio non è misurata.

La pagina dovrà chiarire chi dovrebbe scegliere TwoFifties, il limite dello spazio condiviso a due persone, server e installazione richiesti, divisioni delle spese, backup e costi eventuali dell’hosting. Ogni affermazione sul concorrente dovrà avere fonte e data aggiornate. Non dichiarare importazione da Splitwise senza una funzione verificata. Collega la guida inglese e aggiungi il confronto alla navigazione e alla sitemap quando sarà pubblicato.

## Fonti

- [Rapporto OpenSEO del 11 novembre 2026](https://app.openseo.so/p/2531f897-da19-4e8d-8a60-c87ec6961229/reports/015608f2-af6d-4562-b924-46e6afd8a61e)
- [Google: richiedere una nuova scansione](https://developers.google.com/search/docs/crawling-indexing/ask-google-to-recrawl)
- [Google: rapporto Sitemap](https://support.google.com/webmasters/answer/7451001)
