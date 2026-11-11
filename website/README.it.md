# Sito di presentazione TwoFifties

[English](README.md)

Sito statico in italiano e inglese per GitHub Pages: presenta l’app, mostra screenshot nella lingua scelta, permette di scaricare lo ZIP pubblico e spiega le opzioni Docker, Node.js e TrueNAS. Non ospita le API dell’app o i dati finanziari.

## Anteprima locale

Le guide complete per principianti sono in [`docs/INSTALLATION.it.md`](../docs/INSTALLATION.it.md) e [`docs/INSTALLATION.md`](../docs/INSTALLATION.md). Pages mostra gli stessi file con indice e comandi copiabili. Modifica i manuali per aggiornare insieme GitHub e Pages: il workflow pubblica automaticamente. `npm run site:test` controlla gli indici, quattro larghezze, entrambi i temi, la copia dei comandi e l'avvio Node documentato.

Con Node.js 24+ e le dipendenze del repository installate:

```sh
npm run site:build
npm run site:preview
```

Apri l’indirizzo stampato dal server di anteprima. `npm run site:test` controlla metadati, collegamenti, visualizzazione mobile/desktop, temi, lingue e passaggio a un dominio personalizzato. I test usano Edge su Windows oppure Chromium di Playwright sulle altre piattaforme.

La compilazione copia in `.site-dist/` solo i file del sito, i font locali e alcuni screenshot dimostrativi. Le cartelle dei dati reali, come `backups/`, non vengono copiate. Il container dell’app resta indipendente.

## Pubblicazione su GitHub Pages

1. Apri **Settings → Pages** nel repository.
2. Come sorgente di pubblicazione scegli **GitHub Actions**.
3. In **Actions** apri **Publish TwoFifties website** e avvia **Run workflow** sul ramo `main`.
4. Il collegamento pubblicato compare nell’ambiente del workflow. L’indirizzo iniziale configurato è `https://joshualbalzani.github.io/TwoFifties/`.

Il workflow compila e controlla sempre il sito. Se Pages non è ancora attivo, scrive nel riepilogo cosa configurare e salta la pubblicazione: una compilazione riuscita da sola non significa che il sito sia online. Dopo l’attivazione, le modifiche ai file del sito vengono pubblicate automaticamente. Il modello segue la [documentazione GitHub sui workflow personalizzati](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages).

## Passaggio a un dominio acquistato

Modifica **`website/site.config.json` → `baseUrl`** inserendo l’indirizzo HTTPS definitivo, per esempio `https://www.tuo-dominio.example/`. La compilazione aggiorna URL canonici, lingue alternative, immagini social, sitemap e file del dominio. I collegamenti ai file locali restano relativi.

Devi anche impostare il dominio personalizzato in GitHub Pages e configurare i DNS dal fornitore del dominio. Verifica la proprietà e attiva HTTPS quando il certificato è disponibile. Segui la [guida GitHub ai domini personalizzati](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site): i record dipendono dall’uso del dominio principale o di un sottodominio. Cambiare soltanto il file di configurazione non modifica DNS o impostazioni dell’account.

## Come farlo trovare e scaricare

- Inserisci il sito online nel campo **About → Website** del repository.
- Aggiungi topic pertinenti: `expense-tracker`, `expense-sharing`, `split-bills`, `couples`, `roommates`, `self-hosted`, `personal-finance`, `budgeting`, `material-design`, `docker`, `truenas`, `nodejs`, `open-source`.
- Usa `website/assets/social-it.png` o `social-en.png` come anteprima social del repository.
- Condividi sito e download nelle community pertinenti che consentono la presentazione di progetti. Lo ZIP contiene il sorgente, non un installer Windows: serve comunque Docker, Node.js o un NAS compatibile.
- Per distribuire versioni riconoscibili puoi aggiungere release GitHub con numero di versione, novità e archivi verificati. Per ora il sito offre lo ZIP del ramo `main`, scaricabile da chiunque senza account GitHub.

I topic aiutano a classificare il progetto nella ricerca di GitHub: [guida ufficiale](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/classifying-your-repository-with-topics).

## Indicizzazione su Google

Usa la proprietà Search Console con prefisso URL `https://joshualbalzani.github.io/TwoFifties/` e invia `https://joshualbalzani.github.io/TwoFifties/sitemap.xml` nel rapporto Sitemap. Controlla homepage e guida nelle due lingue con Controllo URL e richiedi l'indicizzazione se necessario. Il tag HTML presente non dimostra da solo che proprietà e pagine siano già verificate o indicizzate.

Google legge il `robots.txt` alla radice dell'host, non quello sotto `/TwoFifties/`: invia quindi direttamente la sitemap in Search Console. L'assenza del file alla radice non blocca la scansione. Con un dominio dedicato configurato alla radice, il build colloca automaticamente il file nel punto corretto. La sitemap omette `lastmod`, un campo facoltativo, evitando date di aggiornamento fittizie a ogni compilazione.

Il sito include testo HTML visibile, titoli e descrizioni localizzati, URL canonici, `hreflang`, dati strutturati SoftwareApplication, anteprime social, `sitemap.xml` e `robots.txt`. Non sono presenti valutazioni, recensioni o approvazioni inventate.

Dopo la pubblicazione aggiungi in [Google Search Console](https://search.google.com/search-console/) una proprietà **Prefisso URL** con l’indirizzo esatto del sito. Se scegli la verifica con tag HTML, inserisci il token in `googleSiteVerification` dentro `website/site.config.json`, pubblica e completa la verifica. Poi invia `sitemap.xml` e controlla l’URL principale e quello inglese. Con il dominio acquistato puoi anche usare la verifica della proprietà Dominio tramite DNS.

Su un sito di progetto, `robots.txt` si trova sotto `/TwoFifties/`, mentre i crawler normalmente lo cercano alla radice del dominio: invia quindi direttamente la sitemap in Search Console. Con un dominio personalizzato alla radice, il file generato si trova nella posizione prevista.

Google precisa che richiesta d’indicizzazione e sitemap **non garantiscono** inserimento nei risultati o tempi immediati. La [guida Google alla scansione](https://developers.google.com/search/docs/crawling-indexing/ask-google-to-recrawl) spiega il processo. Search Console servirà a misurare la visibilità reale.
