# Installare TwoFifties: guida completa da zero

Questa guida accompagna dal download al primo salvataggio, poi spiega come accedere da altri dispositivi, mantenere l'app accesa, aggiornare e recuperare i dati. Non serve conoscere Git: è disponibile anche il download ZIP. I comandi sono esempi da eseguire sul proprio computer o server, non sul sito GitHub Pages.

[English guide](INSTALLATION.md) · [Manuale delle funzioni](../README.it.md) · [Sito del progetto](https://joshualbalzani.github.io/TwoFifties/)

## Indice

- [1. Capire cosa si installa](#1-capire-cosa-si-installa)
- [2. Scegliere il percorso](#2-scegliere-il-percorso)
- [3. Preparare file e terminale](#3-preparare-file-e-terminale)
- [4. Docker su Windows o Mac](#4-docker-su-windows-o-mac)
- [5. Docker su Linux](#5-docker-su-linux)
- [6. Avviare con Docker Compose](#6-avviare-con-docker-compose)
- [7. Nodejs su Windows](#7-nodejs-su-windows)
- [8. Nodejs su Mac o Linux](#8-nodejs-su-mac-o-linux)
- [9. Avvio automatico senza Docker](#9-avvio-automatico-senza-docker)
- [10. TrueNAS passo per passo](#10-truenas-passo-per-passo)
- [11. Altri NAS e hosting](#11-altri-nas-e-hosting)
- [12. Primo avvio e verifica dei dati](#12-primo-avvio-e-verifica-dei-dati)
- [13. Telefono e altri dispositivi](#13-telefono-e-altri-dispositivi)
- [14. Accesso remoto e HTTPS](#14-accesso-remoto-e-https)
- [15. Configurazione spiegata](#15-configurazione-spiegata)
- [16. Backup e ripristino](#16-backup-e-ripristino)
- [17. Aggiornare senza perdere i dati](#17-aggiornare-senza-perdere-i-dati)
- [18. Trasferire una vecchia installazione](#18-trasferire-una-vecchia-installazione)
- [19. Problemi e soluzioni](#19-problemi-e-soluzioni)
- [20. Controlli finali e richiesta di aiuto](#20-controlli-finali-e-richiesta-di-aiuto)

## 1. Capire cosa si installa

TwoFifties si apre nel browser ma richiede un **server acceso**. Può essere il tuo PC, un Mac, un piccolo computer Linux, un NAS compatibile o un server in hosting. Il server esegue il programma, conserva i file e permette ai due dispositivi di condividere lo stesso spazio.

Il telefono è un **client**: apre l'indirizzo del server. Non devi installare Docker o Node.js su ogni telefono. I due nomi richiesti al primo avvio non sono account separati: lo spazio è condiviso e l'eventuale password di accesso è comune.

| Termine | Significato pratico |
| --- | --- |
| Repository | La cartella di codice pubblicata su GitHub. |
| Terminale | Una finestra in cui scrivere comandi: PowerShell su Windows, Terminale su Mac/Linux. |
| Server/host | Il dispositivo che esegue TwoFifties e deve restare disponibile. |
| Docker | Esegue l'app in un ambiente separato chiamato container. |
| Compose | Legge il file `docker-compose.yml` e prepara il container. |
| Porta | Il numero dopo i due punti nell'indirizzo, normalmente `5001`. |
| localhost | Il dispositivo su cui stai aprendo il browser, non sempre il server. |
| backups | La cartella che contiene lo stato reale e le immagini delle ricevute. |

**GitHub Pages è il sito di presentazione e questa guida. Non è il server dell'app.** Non basta aprire `app/index.html`, caricare i file su uno spazio solo statico o fare un fork del repository per avere sincronizzazione e backup funzionanti. Non servono MySQL, PostgreSQL, un account cloud o una chiave API.

## 2. Scegliere il percorso

| La tua situazione | Percorso da seguire | Cosa resta acceso |
| --- | --- | --- |
| Voglio provarla sul mio Windows o Mac | Docker Desktop, poi sezione 6; oppure Node.js | Il computer e Docker, oppure il processo Node. |
| Ho un server Linux o un mini PC | Docker Engine + Compose | Il server e il servizio Docker. |
| Ho TrueNAS con Apps Docker | Sezione 10 e modello YAML incluso | Il NAS e l'app personalizzata. |
| Ho un altro NAS che supporta Docker | Sezione 11, verificando compilazione e cartelle persistenti | Il NAS e il container. |
| Non voglio Docker | Node.js 24 o successivo | Il processo Node; per uso stabile prepara l'avvio automatico. |
| Voglio usarla fuori casa | Prima installazione funzionante, poi sezione 14 | Un server raggiungibile e il sistema di accesso remoto. |
| Ho soltanto un telefono | Serve anche un server o un computer che ospiti l'app | Il telefono da solo non ospita questa versione del server. |

Per iniziare scegli **un solo percorso**. Avviare Docker e Node contemporaneamente sulla stessa porta genera un errore. Non è necessario usare tutti i sistemi descritti qui.

Prevedi spazio libero per i file del programma, le immagini Docker se usate, i backup e le ricevute. Il consumo dipende dai tuoi dati: non viene dichiarato un requisito hardware minimo misurato. La prima installazione richiede internet; il tempo dipende da connessione, computer e download dei pacchetti.

## 3. Preparare file e terminale

### Scaricare senza Git

1. Apri il [repository TwoFifties](https://github.com/JoshualBalzani/TwoFifties).
2. Premi il pulsante **Code**, poi **Download ZIP**. Puoi anche usare il [download diretto dello ZIP](https://github.com/JoshualBalzani/TwoFifties/archive/refs/heads/main.zip).
3. Estrai lo ZIP. Su Windows usa **Estrai tutto**; non lavorare dentro la cartella compressa.
4. Sposta la cartella estratta in un posto stabile, per esempio `C:\TwoFifties` oppure `~/TwoFifties`. Evita una cartella temporanea e, per i dati attivi, cartelle sincronizzate da servizi cloud.
5. Apri la cartella e verifica di vedere **insieme** `package.json`, `docker-compose.yml`, `Dockerfile`, `app`, `server` e `scripts`. Se vedi soltanto un'altra cartella `TwoFifties-main`, devi entrare in quella.

Su Windows puoi rinominare `TwoFifties-main` in `TwoFifties`. Attiva la visualizzazione delle estensioni dei file in Esplora file: servirà a distinguere `.env` da `.env.txt`.

### Scaricare con Git, se lo hai già

```sh
git clone https://github.com/JoshualBalzani/TwoFifties.git
cd TwoFifties
```

Git non è obbligatorio per l'installazione via ZIP. Se compare `git non riconosciuto`, scegli lo ZIP oppure installa Git dal [sito ufficiale](https://git-scm.com/downloads).

### Aprire il terminale nella cartella corretta

Su Windows apri PowerShell dal menu Start e scrivi, adattando il percorso:

```powershell
cd "C:\TwoFifties"
Get-ChildItem
```

Su Mac/Linux apri Terminale e usa:

```sh
cd "$HOME/TwoFifties"
ls
```

Le virgolette servono anche quando un percorso contiene spazi. Copia solo le righe dentro al blocco di comandi: non copiare la parola `powershell`, `sh` o eventuali simboli del prompt. Esegui un comando alla volta e aspetta che finisca. I blocchi PowerShell non vanno copiati in Bash e viceversa.

**Risultato atteso:** l'elenco mostra `package.json` e le altre cartelle del progetto. Se manca, correggi il percorso prima di continuare. Non creare nuovi file di progetto per compensare un errore di cartella.

## 4. Docker su Windows o Mac

Docker Desktop contiene gli strumenti necessari per seguire la sezione 6; non serve installare Node.js sul computer per questo percorso.

### Windows

1. Segui la [guida ufficiale Docker Desktop per Windows](https://docs.docker.com/desktop/setup/install/windows-install/), controllando i requisiti del tuo sistema.
2. Installa la versione adatta al computer. Per questa app serve l'ambiente dei **container Linux**.
3. Se l'installazione richiede WSL 2 o un riavvio, completa quei passaggi prima di avviare TwoFifties. Per problemi WSL usa la [guida Microsoft all'installazione](https://learn.microsoft.com/windows/wsl/install).
4. Apri Docker Desktop e aspetta che il motore risulti avviato. La prima apertura può richiedere tempo.
5. Apri una nuova PowerShell nella cartella del progetto ed esegui:

```powershell
docker --version
docker compose version
docker info
```

Le prime due righe devono mostrare numeri di versione; `docker info` deve riuscire a contattare il motore. Se dice `Cannot connect to the Docker daemon`, il motore non è pronto o non è avviato: il problema precede TwoFifties.

### Mac

1. Controlla in **Informazioni su questo Mac** se hai Apple Silicon o Intel.
2. Segui la [guida ufficiale Docker Desktop per Mac](https://docs.docker.com/desktop/setup/install/mac-install/) e scegli il download corretto.
3. Avvia Docker Desktop, completa la configurazione iniziale e aspetta che il motore sia pronto.
4. In un nuovo Terminale esegui gli stessi tre comandi `docker --version`, `docker compose version` e `docker info`.

Non è necessario selezionare manualmente una piattaforma Docker o scaricare una presunta immagine TwoFifties pubblica: la configurazione inclusa **compila il codice locale**. Continua con la sezione 6.

## 5. Docker su Linux

Questa procedura presuppone un normale host Linux con accesso amministrativo. Non installare Docker nel sistema operativo TrueNAS seguendo questi comandi: per TrueNAS usa la sezione dedicata.

1. Identifica la distribuzione del server, per esempio Ubuntu o Debian.
2. Installa Docker Engine seguendo la guida ufficiale per [Ubuntu](https://docs.docker.com/engine/install/ubuntu/) oppure [Debian](https://docs.docker.com/engine/install/debian/). Sono disponibili anche [altre distribuzioni](https://docs.docker.com/engine/install/).
3. Installa il [plugin Compose](https://docs.docker.com/compose/install/linux/) se non è già presente.
4. Verifica `docker --version`, `docker compose version` e `docker info`.

Se la guida Docker richiede `sudo`, usa ad esempio `sudo docker compose version`. Nei comandi successivi puoi anteporre `sudo` a `docker` quando il tuo account non ha accesso al motore. L'accesso al gruppo Docker conferisce privilegi elevati sul server: non aggiungere utenti soltanto per nascondere un errore di permessi.

Nella cartella TwoFifties crea la cartella dei dati prima dell'avvio:

```sh
mkdir -p backups
```

Il container incluso usa **UID 1000 e GID 1000**. Su un host Linux con normali permessi POSIX, se la cartella dedicata non è scrivibile da quell'identità:

```sh
sudo chown -R 1000:1000 ./backups
```

Esegui il comando soltanto dalla cartella del progetto, sulla sua cartella `backups`: non sul disco intero. Con ACL, condivisioni NAS, Docker rootless o mapping degli utenti, i permessi dipendono dall'host; configura l'accesso alla directory montata anziché usare `chmod 777`. Continua con la sezione seguente.

## 6. Avviare con Docker Compose

### Creare il file di configurazione

Dalla cartella del progetto, **alla prima installazione**, copia il modello. Se `.env` esiste già, aprilo e conserva i valori presenti: non sovrascriverlo con un modello vuoto.

PowerShell:

```powershell
Copy-Item .env.example .env
notepad .env
```

Mac/Linux:

```sh
cp .env.example .env
nano .env
```

Puoi usare un normale editor di testo al posto di `nano`. In nano, salva con Ctrl+O, Invio, poi esci con Ctrl+X. Su Mac evita di salvare in formato RTF.

Il modello contiene:

```dotenv
PORT=5001
TZ=Europe/Rome
AUTH_USER=
AUTH_PASS=
CLEAR_ALL_PASSWORD_HASH=
```

Per l'accesso protetto compila **sia** `AUTH_USER` sia `AUTH_PASS`. Usa un nome utente senza `:` e una password lunga e unica, non i nomi delle due persone. Non pubblicare `.env` o le tue credenziali su GitHub.

```dotenv
PORT=5001
TZ=Europe/Rome
AUTH_USER='scegli-un-nome-utente'
AUTH_PASS='sostituisci-con-una-password-lunga-e-unica'
CLEAR_ALL_PASSWORD_HASH=
```

Sostituisci gli esempi. Le virgolette singole aiutano a trattare letteralmente caratteri come `$` e `#`; se la password contiene a sua volta una virgoletta singola, scegli un altro valore o segui la [sintassi ufficiale dei file env Compose](https://docs.docker.com/compose/how-tos/environment-variables/variable-interpolation/). Lasciare entrambi vuoti significa accesso senza login; non farlo su un server esposto o su una rete non fidata. Configurare soltanto un campo non è una configurazione valida: attualmente il server attiva il controllo quando è presente `AUTH_USER`.

### Compilare e avviare

```sh
docker compose up --build -d
docker compose ps
docker compose logs --tail=100 twofifties
```

Il primo comando scarica l'immagine di base Node e compila l'app; le righe di download non sono da sole un errore. `-d` lascia il container acceso dopo la chiusura del terminale. In `ps` cerca uno stato `Up` o equivalente e la porta pubblicata. Nei log deve comparire l'avvio del server, non una sequenza continua di riavvii.

Apri nel browser del computer server **http://localhost:5001**. Se hai abilitato l'autenticazione, il browser chiederà username e password. Passa alla sezione 12 per controllare davvero i salvataggi.

### Comandi da conservare

| Operazione | Comando dalla cartella TwoFifties |
| --- | --- |
| Stato | `docker compose ps` |
| Ultimi log | `docker compose logs --tail=100 twofifties` |
| Seguire i log | `docker compose logs -f twofifties` |
| Interrompere la visualizzazione dei log | Ctrl+C; con avvio `-d` non ferma l'app. |
| Fermare l'app | `docker compose stop twofifties` |
| Riavviare il container esistente | `docker compose restart twofifties` |
| Applicare modifiche a `.env` o al codice | `docker compose up --build -d` |

Un semplice `restart` non ricrea il container con nuove variabili. I dati del modello incluso sono in `./backups` sull'host, montata come `/app/data` nel container. Non cambiare quel collegamento e non eliminare la cartella per risolvere un errore di avvio.

La regola `restart: unless-stopped` aiuta il riavvio quando riparte Docker; non accende un computer spento e non avvia Docker Desktop al posto tuo. Su Windows/Mac configura l'apertura di Docker Desktop nelle sue impostazioni se desideri il riavvio dopo l'accesso. Sul server Linux verifica che il servizio Docker sia abilitato.

## 7. Nodejs su Windows

Questo percorso esegue direttamente l'app: Docker non è necessario.

1. Installa una versione LTS supportata di **Node.js 24 o successivo** dal [download ufficiale Node.js](https://nodejs.org/en/download). Node 24 è la versione usata dal Dockerfile e dalla CI del progetto.
2. Chiudi e riapri PowerShell per aggiornare il PATH.
3. Apri la cartella del progetto come spiegato nella sezione 3.
4. Controlla le versioni:

```powershell
node --version
npm.cmd --version
```

Il primo risultato deve iniziare con `v24` o un numero superiore, non `v18`, `v20` o `v22`.

5. Se vuoi impostare credenziali o cambiare porta, crea `.env` dal modello come nella sezione 6. `npm start` legge quel file.
6. Installa le dipendenze e avvia:

```powershell
npm.cmd ci
npm.cmd ci --prefix server
npm.cmd start
```

`npm.cmd` evita il problema PowerShell «l'esecuzione di script è disabilitata» relativo al wrapper `npm.ps1`; non serve disattivare globalmente le protezioni di PowerShell. In un normale Prompt dei comandi puoi usare `npm`.

**Risultato atteso:** il terminale resta aperto con il messaggio del server. Apri **http://localhost:5001**. Non chiudere quella finestra mentre usi l'app: con questo avvio il processo finirebbe. Per fermarlo deliberatamente premi Ctrl+C. Per riaprirlo torna nella stessa cartella e ripeti solo `npm.cmd start`; non serve reinstallare i pacchetti ogni volta.

## 8. Nodejs su Mac o Linux

Installa una versione LTS supportata di Node 24 o successivo usando il [sito ufficiale](https://nodejs.org/en/download) o un gestore di versioni di cui segui la documentazione. Alcuni repository di distribuzione forniscono versioni più vecchie: verifica il numero, non solo che il comando esista.

```sh
node --version
npm --version
cd "$HOME/TwoFifties"
npm ci
npm ci --prefix server
npm start
```

Se necessario crea prima `.env` con le istruzioni della sezione 6. Apri **http://localhost:5001** sul server. Il processo resta in primo piano: per fermarlo premi Ctrl+C.

Non usare `sudo npm ci` come rimedio generale ai permessi: i file del progetto e la directory dati devono appartenere all'utente che esegue l'app. Non avviare manualmente `node server/server.js` seguendo questa guida: salteresti il caricamento di `.env` e i percorsi predefiniti predisposti da `scripts/start.cjs`. Usa `npm start` oppure `node scripts/start.cjs`.

`npm ci` usa i file lock inclusi. Se non trova `package-lock.json`, controlla la cartella e l'integrità dello ZIP, anziché cancellare i lock o sostituire il comando alla cieca.

## 9. Avvio automatico senza Docker

Un avvio manuale Node non garantisce che l'app rimanga disponibile dopo chiusura del terminale, disconnessione SSH o riavvio. Per un'installazione permanente usa un servizio del sistema o Docker.

### Windows con Utilità di pianificazione

1. Verifica prima che `npm.cmd start` funzioni e fermalo con Ctrl+C: deve esserci una sola istanza sulla porta.
2. Trova l'eseguibile Node con `where.exe node` e conserva il percorso completo, per esempio `C:\Program Files\nodejs\node.exe`.
3. Apri **Utilità di pianificazione** e crea un'attività chiamata TwoFifties per il tuo utente.
4. Per un PC personale scegli l'attivazione all'accesso dell'utente; configura «Esegui indipendentemente dalla connessione» soltanto se conosci le credenziali e i permessi richiesti dal sistema.
5. Come programma indica l'eseguibile Node. Negli argomenti scrivi `"C:\TwoFifties\scripts\start.cjs"`. Nel campo **Inizia in** indica la cartella `C:\TwoFifties`.
6. Salva, avvia l'attività manualmente e apri l'indirizzo dell'app. Controlla che i nomi salvati siano quelli corretti.

Adatta tutti i percorsi. Non sono necessari privilegi amministrativi per la normale esecuzione su porta 5001. Se sposti la cartella o aggiorni Node, controlla di nuovo l'attività. Riavvia il PC una volta per verificare il comportamento realmente desiderato.

### Linux con servizio systemd dell'utente

Questa opzione riguarda distribuzioni che usano systemd. Non va applicata al sistema operativo TrueNAS. Controlla prima `command -v node` e `pwd` dalla directory del progetto: i percorsi dell'esempio potrebbero essere diversi.

```sh
mkdir -p "$HOME/.config/systemd/user"
nano "$HOME/.config/systemd/user/twofifties.service"
```

Esempio da adattare a un utente chiamato `mario`:

```ini
[Unit]
Description=TwoFifties personal expense server

[Service]
Type=simple
WorkingDirectory=/home/mario/TwoFifties
ExecStart=/usr/bin/node /home/mario/TwoFifties/scripts/start.cjs
Environment=NODE_ENV=production
Restart=on-failure
RestartSec=5

[Install]
WantedBy=default.target
```

Sostituisci `/usr/bin/node` con il percorso ottenuto da `command -v node` e `/home/mario/TwoFifties` con la cartella reale. Con un gestore come nvm il percorso può contenere una versione specifica: dopo gli aggiornamenti potrebbe dover essere modificato.

```sh
systemctl --user daemon-reload
systemctl --user enable --now twofifties
systemctl --user status twofifties --no-pager
journalctl --user -u twofifties -n 100 --no-pager
```

Per mantenere attivo il servizio utente anche senza una sessione aperta, l'amministratore può abilitare il lingering del tuo account:

```sh
sudo loginctl enable-linger "$USER"
```

Verifica il risultato dopo un riavvio. Per fermare il servizio usa `systemctl --user stop twofifties`; per disabilitarlo usa `systemctl --user disable --now twofifties`. Per Mac, Docker Desktop resta il percorso descritto qui per riavvio gestito: un Terminale Node non diventa automaticamente un servizio macOS.

## 10. TrueNAS passo per passo

Questa procedura riguarda **TrueNAS con Apps basate su Docker, dalla versione 24.10**. Non riguarda TrueNAS CORE/FreeBSD né le vecchie Apps Kubernetes. Su un sistema non compatibile usa una VM Linux o un host separato. Le etichette dell'interfaccia cambiano fra versioni: consulta anche la [guida ufficiale alle app personalizzate](https://apps.truenas.com/managing-apps/installing-custom-apps/).

### Preparare lo storage

1. Apri l'interfaccia amministrativa TrueNAS.
2. Configura il pool per Apps se non lo hai già fatto.
3. Nel pool crea un dataset dedicato a TwoFifties, poi le directory dei sorgenti e dei dati. L'esempio usa questi percorsi:

| Directory | Deve contenere |
| --- | --- |
| `/mnt/tank/apps/twofifties/source` | Sorgenti, con `Dockerfile` direttamente dentro. |
| `/mnt/tank/apps/twofifties/backups` | Stato reale, JSON di backup e `receipts`. |

`tank` è un esempio: sostituiscilo con il nome del pool reale. Tieni `backups` fuori da `source`, così aggiornare i sorgenti non sostituisce i dati.

4. Scarica ed estrai lo ZIP sul computer. Tramite una condivisione o il tuo metodo di trasferimento, copia **il contenuto estratto** in `source`. Il file deve essere `/mnt/tank/apps/twofifties/source/Dockerfile`, non `source/TwoFifties-main/Dockerfile`.
5. Controlla che ci siano anche `server`, `app` e gli altri file del progetto. Non installare Node o pacchetti con `apt` nel sistema operativo TrueNAS.
6. Prepara i permessi della directory `backups`: il container scrive come UID/GID **1000:1000**. Deve poter attraversare le directory superiori e leggere, creare, aggiornare ed eliminare file nella cartella dati. Con ACL usa l'editor del dataset; conserva l'accesso del tuo amministratore. Non cambiare i permessi dell'intero pool e non usare `777` come soluzione generale.

### Creare l'app

1. Vai in **Apps → Discover Apps** e cerca il menu **Install via YAML**.
2. Scegli un nome come `twofifties`.
3. Copia il [modello del repository](../deploy/truenas.yaml), riportato anche qui:

```yaml
services:
  twofifties:
    build:
      context: /mnt/tank/apps/twofifties/source
      dockerfile: Dockerfile
    environment:
      TZ: Europe/Rome
      AUTH_USER: 'scegli-un-nome-utente'
      AUTH_PASS: 'sostituisci-con-una-password-lunga-e-unica'
      BACKUP_DIR: /app/data
    ports:
      - "5001:8080"
    volumes:
      - type: bind
        source: /mnt/tank/apps/twofifties/backups
        target: /app/data
        bind:
          create_host_path: false
    restart: unless-stopped
```

4. Sostituisci **entrambi** i percorsi e le due credenziali. Non lasciare i valori dimostrativi. La cartella dati deve esistere: `create_host_path: false` evita che un errore di digitazione crei un percorso diverso da quello previsto.
5. Se 5001 è occupata, cambia soltanto il numero a sinistra, per esempio `"15001:8080"`.
6. Salva e attendi la compilazione. Controlla i log se l'app si ferma o si riavvia di continuo.
7. Apri **http://IP_DEL_NAS:5001**, oppure la porta scelta. Sostituisci `IP_DEL_NAS` con un indirizzo come `192.168.1.50` reale del tuo NAS.
8. Completa la sezione 12 e riavvia l'app da TrueNAS per verificare che i dati rimangano.

Il modello TrueNAS passa direttamente le variabili al container: **non legge il file `.env` del tuo PC**. Non richiede un'immagine TwoFifties già pubblicata su Docker Hub o GHCR. Se non trovi il menu YAML, verifica versione, sezione Apps e permessi dell'account; non inserire questo Compose in un campo che richiede soltanto il nome di un'immagine.

La [guida TrueNAS dedicata](TRUENAS.it.md) contiene ulteriori riferimenti a storage e ACL. Non disponiamo di una verifica su ogni versione o modello NAS: la sintassi Compose e il container vengono controllati, l'interfaccia e i permessi del tuo NAS vanno verificati sul dispositivo.

## 11. Altri NAS e hosting

### Synology, QNAP e altri host Docker

Verifica nella documentazione del tuo modello che supporti container Linux, volumi persistenti e **compilazione da Dockerfile/Compose `build`**. I nomi delle funzioni variano; un editor che accetta solo `image:` potrebbe non compilare il progetto.

La struttura resta la stessa: cartella sorgenti completa, cartella dati persistente separata, porta host verso **8080 nel container**, credenziali e accesso in scrittura per l'utente del container. Nei percorsi host usa quelli reali del NAS, non `C:\...` o il percorso di un altro computer.

Se il gestore non supporta `build`, una persona che amministra il NAS può compilare sul suo motore Docker:

```sh
docker build -t twofifties:local .
```

Poi dovrà configurare quel gestore per usare l'immagine locale, senza `build`, mantenendo porta e volume. Il comando va eseguito sulla macchina il cui motore userà l'immagine, o serve un trasferimento dell'immagine per l'architettura corretta. Non viene fornita una procedura identica e certificata per tutti i NAS.

### Server remoto o piattaforma Node

Per una VPS Linux puoi seguire il percorso Docker o Node. Per un hosting gestito, controlla che esegua processi Node 24+, permetta un **disco persistente** e imposti la porta richiesta dalla piattaforma.

Una configurazione Node dal repository usa directory principale del progetto, installazione con `npm ci --prefix server --omit=dev`, comando di avvio `npm start`, `BACKUP_DIR` sul disco persistente e `AUTH_USER`/`AUTH_PASS` nelle variabili del servizio. La piattaforma può impostare `PORT`: non sostituirlo automaticamente con 5001 se il provider ne richiede un altro. Non mettere file `.env` reali nel repository per passare le credenziali.

Un filesystem temporaneo può perdere i dati a ogni ridistribuzione. Serverless, hosting PHP e GitHub Pages non equivalgono a questo server Node. Se il servizio va in pausa o si spegne, gli altri dispositivi non possono sincronizzarsi finché non torna disponibile. Prezzi e limiti dipendono dal provider e non sono inclusi nel progetto.

## 12. Primo avvio e verifica dei dati

Una pagina visibile non basta a dimostrare che i dati siano salvati sul server. Esegui questi controlli nell'ordine:

1. Apri l'indirizzo corretto. Se hai configurato il login, usa le credenziali server.
2. Segui la presentazione. Puoi saltare le spiegazioni, ma devi inserire **due nomi diversi e non vuoti**.
3. Scegli il tema; in seguito lingua e preferenze si trovano in **Altro → Impostazioni** su mobile o nella navigazione desktop.
4. Aggiungi una spesa di prova da €1 con descrizione riconoscibile. Verifica pagatore e divisione, poi salva.
5. Controlla lo stato del server tramite il pulsante con l'indicatore nella barra superiore. Un salvataggio locale non prova che il server sia raggiungibile.
6. Apri **Backup e ripristino**, premi **Crea backup** e verifica che compaia nella lista.
7. Nella cartella `backups` dell'host deve comparire un file `manual-....json`; deve esistere anche `latest.json`. Per Docker guarda la directory montata sull'host, non soltanto i file dentro al container.
8. Ricarica la pagina: nomi e spesa devono essere presenti.
9. Riavvia il container o il processo Node, poi controlla ancora. Questo passaggio verifica che il salvataggio sia persistente.
10. Apri lo stesso indirizzo da un altro browser o dispositivo collegato allo stesso server: devi vedere lo stesso spazio. Poi elimina la spesa di prova dall'app se non vuoi conservarla.

Puoi aprire `/api/health` sullo stesso indirizzo, per esempio **http://localhost:5001/api/health**: con credenziali corrette deve restituire `{"status":"ok"}`. Anche questo endpoint è protetto quando il login è attivo. È un controllo di raggiungibilità, non una verifica completa dei backup.

## 13. Telefono e altri dispositivi

### Trovare l'indirizzo del server

Windows: esegui `ipconfig` e cerca l'indirizzo IPv4 della scheda realmente connessa, oppure apri i dettagli della rete in Impostazioni. Linux: `hostname -I` può mostrare più indirizzi; scegli quello della rete locale. Mac: leggi l'indirizzo nei dettagli Wi-Fi/Ethernet delle impostazioni di rete.

Se il server è `192.168.1.50`, sul telefono apri **http://192.168.1.50:5001**. Non scrivere letteralmente l'esempio se il tuo indirizzo è diverso. Su un telefono, `localhost` indica il telefono stesso e non il PC.

Telefono e server devono essere sulla stessa rete raggiungibile. Una rete ospiti, l'isolamento dei dispositivi Wi-Fi, una VLAN o la connessione dati mobili possono impedirlo. Se il PC si sospende, l'app non è più raggiungibile dagli altri dispositivi.

Se il firewall chiede un'autorizzazione, consenti solo ciò che serve sulla rete privata fidata; non disattivare tutto il firewall. Con Docker su Linux, la pubblicazione delle porte ha regole proprie: verifica anche le [limitazioni documentate da Docker](https://docs.docker.com/engine/install/ubuntu/#firewall-limitations). Una prenotazione DHCP nel router rende più stabile l'indirizzo locale.

### Collegamento sulla schermata Home e offline

Puoi aggiungere un collegamento dal menu del browser, se disponibile. Non è un'app distribuita tramite App Store o Play Store. Le funzioni di installazione e fotocamera dipendono da browser e dispositivo.

Il service worker e la memorizzazione offline richiedono un contesto sicuro supportato dal browser, normalmente **HTTPS** oppure `localhost`. L'app via `http://192.168...` può funzionare online senza tutte le funzioni offline o di installazione. Prima di contare sull'offline, apri l'app online sul dispositivo, verifica la memorizzazione e prova il comportamento.

La sincronizzazione avviene quando il browser dell'app è in esecuzione e riesce a contattare il server; non presumere una sincronizzazione continua con il browser chiuso. Origini diverse, come HTTP/HTTPS, porta o dominio diversi, hanno copie locali distinte. Non cancellare i dati del sito finché ci sono modifiche locali non sincronizzate.

## 14. Accesso remoto e HTTPS

Prima verifica l'installazione in locale, i backup e le credenziali. Un indirizzo `192.168...` non è normalmente raggiungibile da internet. Per il tuo spazio privato puoi usare una VPN già configurata fra i dispositivi; segui le istruzioni del servizio scelto.

Per esporre un dominio pubblico servono un server raggiungibile, dominio/DNS corretti, HTTPS e autenticazione. Il login Basic **non cifra il traffico HTTP** e non crea account separati. Non aprire semplicemente la porta 5001 del router lasciando l'app senza protezione.

Esempio con Caddy installato **sullo stesso host** dell'app, già funzionante su porta 5001:

```caddyfile
spese.example.com {
    reverse_proxy 127.0.0.1:5001
}
```

`spese.example.com` è un segnaposto: usa un dominio che controlli. Configura DNS e raggiungibilità del proxy secondo la [guida HTTPS di Caddy](https://caddyserver.com/docs/automatic-https). Quando le condizioni richieste sono soddisfatte, Caddy gestisce il certificato. Il [riferimento reverse proxy](https://caddyserver.com/docs/quick-starts/reverse-proxy) spiega il collegamento al servizio.

Questo esempio non installa Caddy, non configura router o firewall e non garantisce il funzionamento dietro CGNAT. Se Caddy è in un altro container, `127.0.0.1` indica quel container: usa la rete Docker condivisa e il servizio `twofifties:8080`, configurati dall'amministratore. Preferisci un sottodominio dedicato; il server dell'app usa endpoint assoluti `/api/...` e non va spostato arbitrariamente sotto un prefisso URL.

Se il proxy gira sull'host e l'accesso diretto alla porta non serve, il mapping Compose può essere limitato al loopback con `"127.0.0.1:5001:8080"`. Ciò elimina l'accesso diretto dalla LAN a quella porta: gli utenti dovranno passare dal proxy. Se usi più livelli di autenticazione, evita che si sovrascrivano l'header `Authorization` o chiedano credenziali incompatibili.

## 15. Configurazione spiegata

| Variabile | Node tramite npm start | Docker Compose incluso |
| --- | --- | --- |
| `PORT` | Porta del processo, 5001 se non cambiata. | Porta dell'host; il container resta su 8080. |
| `TZ` | Fuso del processo, per esempio Europe/Rome. | Passato al container. |
| `AUTH_USER` | Username comune; se presente attiva il login. | Passato al container. |
| `AUTH_PASS` | Password comune: configura entrambi i campi. | Passata al container. |
| `CLEAR_ALL_PASSWORD_HASH` | Hash opzionale per la cancellazione completa. | Passato al container. |
| `BACKUP_DIR` | Directory dati alternativa; preferisci un percorso assoluto. | Il modello usa `/app/data`; aggiungerlo solo a `.env` non cambia il mount. |
| `PUBLIC_DIR` | Impostato dallo script di avvio sulla cartella app. | Definito dalla struttura dell'immagine; non serve cambiarlo. |

Le variabili già presenti nell'ambiente del processo possono prevalere su quelle del file. Se una porta o una credenziale non cambia dopo la modifica, verifica anche il servizio, l'attività pianificata o il pannello del provider. Su TrueNAS modifica il YAML dell'app.

Per cambiare porta a 15001, imposta `PORT=15001` in `.env` e riavvia Node oppure ricrea il container con `docker compose up --build -d`. L'indirizzo diventa **http://localhost:15001**. In TrueNAS modifica il mapping come spiegato nella sezione 10.

### Password separata per eliminare tutti i dati

Non è necessaria per installare o usare l'app. Con `CLEAR_ALL_PASSWORD_HASH` vuoto, la cancellazione completa protetta dal server non è disponibile; non inserire in questo campo una password in chiaro.

Il formato richiesto è `salt:hash`: salt casuale di 16 byte e derivazione scrypt da 64 byte, codificati in esadecimale. Per generarlo con un prompt che non visualizza la password, da una macchina con Node esegui:

```sh
node scripts/create-clear-password.cjs
```

Copia soltanto il valore prodotto nel campo `CLEAR_ALL_PASSWORD_HASH` del tuo `.env` o del YAML TrueNAS, poi riavvia Node o ricrea il container. È una password distinta da quella del login. Se la dimentichi, conserva prima un backup e genera un nuovo hash. Il programma non recupera la password originale.

Se hai scelto Docker e non hai Node sull'host, puoi usare il runtime di un container temporaneo montando **soltanto** la cartella `scripts` in lettura. Sostituisci il percorso assoluto dell'esempio con il tuo, mantenendo le virgolette:

```sh
docker run --rm -it --mount "type=bind,source=/percorso/assoluto/TwoFifties/scripts,target=/tools,readonly" node:24-alpine node /tools/create-clear-password.cjs
```

Su Windows il valore `source` può essere, ad esempio, `C:\TwoFifties\scripts`. Questo comando scarica se necessario il runtime Node e non monta la cartella dei dati.

## 16. Backup e ripristino

### Cosa conservare

| File o directory | A cosa serve |
| --- | --- |
| `latest.json` | Stato corrente del server. |
| `daily-*.json` | Snapshot giornalieri creati quando il server salva lo stato; non vengono prodotti mentre il server è spento. |
| `manual-*.json` | Backup creati dal pulsante dell'app. |
| `pre-restore-*.json` e altri file di sicurezza | Copia precedente a operazioni di ripristino o conversione. |
| `receipts/` | Immagini reali delle ricevute; i JSON contengono i riferimenti. |
| `.env` o configurazione del servizio | Porta e credenziali; conservali privatamente, separati dalla galleria pubblica. |

La pulizia automatica del server riguarda i backup `daily` più vecchi della finestra di 90 giorni. Non è un servizio di backup remoto. Una copia sullo stesso disco non protegge dal guasto di quel disco: conserva una copia indipendente protetta.

### Creare e scaricare un backup

1. Apri **Backup e ripristino** dall'app.
2. Premi **Crea backup** e attendi il risultato.
3. Il backup viene creato sul server. Usa l'icona **Scarica** se vuoi il JSON sul tuo dispositivo.
4. Per un trasferimento completo conserva anche la cartella `receipts` oppure tutta `backups`.

L'esportazione Excel è utile per leggere i movimenti ma **non sostituisce** il backup completo dello spazio.

### Ripristinare un JSON nell'app

1. Se hai modifiche offline, riporta online gli altri dispositivi e risolvi i conflitti prima di proseguire.
2. Crea un backup della situazione attuale.
3. In **Backup e ripristino** scegli **Importa backup**, seleziona il JSON e leggi il riepilogo.
4. Il file deve essere nel formato accettato e rispettare il limite indicato dall'interfaccia, normalmente 4,5 MB per questo flusso.
5. Conferma soltanto se vuoi sostituire lo spazio attuale. Il server salva prima una copia di sicurezza.
6. Ricarica gli altri dispositivi, controlla nomi, spese, ricorrenze, budget e ricevute.

**Importa movimenti** serve ad aggiungere dati JSON/CSV e non equivale al ripristino completo. Se il file viene rifiutato, conserva l'originale e leggi il messaggio: non cambiare a mano pagatori e quote per forzarlo.

### Copia completa e recupero se il server non parte

Ferma l'app prima di copiare i file attivi, così JSON e ricevute appartengono a uno stato coerente. Copia l'intera directory dati in una destinazione nuova; non spostarla e non cancellare l'unica copia. Conserva anche configurazione e versione del codice.

Se `latest.json` è corrotto, prima duplica la directory intera e conserva il file corrotto per analisi. Su una copia di lavoro a server fermo puoi ripristinare un backup completo noto come `latest.json`, mantenendo `receipts` e permessi. Se non sei certo del formato, usa un'installazione separata e il ripristino dall'interfaccia invece di sovrascrivere l'unico archivio.

## 17. Aggiornare senza perdere i dati

### Prima di ogni aggiornamento

Avvisa l'altra persona, attendi la sincronizzazione dei dispositivi, crea un backup dall'app e conserva una copia di **tutta** la cartella dati e della configurazione. Evita modifiche contemporanee durante il trasferimento. Conserva il codice precedente o annota il commit attuale con `git rev-parse HEAD` se usi Git.

Esempio di copia della directory, dopo avere fermato Docker dalla cartella TwoFifties:

PowerShell:

```powershell
docker compose stop twofifties
$backupStamp = Get-Date -Format "yyyyMMdd-HHmmss"
Compress-Archive -Path .\backups -DestinationPath "..\TwoFifties-backups-$backupStamp.zip"
```

Mac/Linux:

```sh
docker compose stop twofifties
tar -czf "../TwoFifties-backups-$(date +%Y%m%d-%H%M%S).tar.gz" backups
```

Per Node ferma il processo con Ctrl+C o il relativo servizio, poi copia la directory con il file manager o uno strumento di backup. Gli archivi contengono dati personali: controlla dove li conservi. Se una copia o l'aggiornamento fallisce, puoi riavviare la versione precedente senza cancellare nulla.

### Aggiornamento con Git

```sh
git pull --ff-only
```

Se Git segnala modifiche locali o divergenze, fermati e conservale. Non usare `git reset --hard` per «ripulire» alla cieca.

Docker:

```sh
docker compose up --build -d
docker compose logs --tail=100 twofifties
```

Node: esegui nuovamente `npm ci` e `npm ci --prefix server`, poi avvia `npm start` o il servizio. In PowerShell puoi usare `npm.cmd`. Un semplice riavvio del vecchio container non compila il nuovo codice.

### Aggiornamento con ZIP

Scarica ed estrai la nuova versione in **una nuova cartella**, senza sovrascrivere l'installazione in uso. Dopo avere fermato l'istanza precedente, trasferisci privatamente `.env` e la cartella dati nella posizione corretta della nuova installazione, oppure mantieni il volume dati esterno già configurato. Non eseguire entrambe le versioni sullo stesso archivio contemporaneamente. Per TrueNAS aggiorna `source` lasciando separata `backups`, poi ricompila/ridistribuisci l'app dal suo pannello.

Dopo l'avvio ripeti i controlli della sezione 12 e prova anche il secondo dispositivo. Il service worker può richiedere una ricarica della pagina. Non cancellare i dati del browser se contengono modifiche non sincronizzate.

### Tornare alla versione precedente

Conserva il backup pre-aggiornamento e il codice precedente. Per una prova di recupero ferma il nuovo server, ripristina codice e copia dati **compatibili fra loro** in una directory separata e controlla l'app prima di rimetterla in uso. Non presumere che un formato dati nuovo sia leggibile da ogni versione vecchia.

## 18. Trasferire una vecchia installazione

Per un trasferimento normale, chiudi l'uso sui dispositivi, ferma il vecchio server e copia `backups`, inclusa `receipts`, sul nuovo host. Configura il percorso persistente e i permessi, avvia il nuovo server, verifica i dati e aggiorna l'indirizzo usato dai telefoni. Non eliminare il vecchio archivio finché non hai controllato la nuova istanza.

### Dal precedente volume Docker nominato

Questi comandi servono solo a chi aveva i dati nel vecchio volume del container. Eseguili nella vecchia installazione mentre il suo container esiste ancora, dopo avere conservato una copia degli eventuali dati già presenti sul nuovo host:

```sh
docker compose stop twofifties
docker compose cp twofifties:/app/data/. ./backups
docker compose up --build -d
```

Se `./backups` contiene già un altro spazio, non unire i due archivi: esporta prima il vecchio contenuto in una directory separata e scegli quale ripristinare. Non usare `docker compose down -v` e non eliminare il vecchio volume prima della verifica.

### Dal vecchio percorso Node data

Lo script `npm start` copia il vecchio contenuto di `data` in `backups` al primo avvio soltanto se trova `data/latest.json` e non esiste già lo stato nuovo. Conserva la directory originale; se entrambe contengono dati non forzare la fusione.

### Da backup della precedente app SPESE

Il ripristino prova a convertire i backup legacy quando i due nomi permettono un'associazione non ambigua. Il JSON originale viene conservato insieme alla copia precedente al ripristino. Se l'associazione non è certa, il server rifiuta la sostituzione: conserva il messaggio e chiedi assistenza senza pubblicare il file con dati personali.

## 19. Problemi e soluzioni

Inizia dalla riga che corrisponde al tuo sintomo. Non eliminare `backups`, `.env` o la cache del browser come primo tentativo.

| Sintomo | Causa da verificare | Cosa fare |
| --- | --- | --- |
| `docker` non riconosciuto | Docker non installato o terminale vecchio. | Completa l'installazione ufficiale e riapri il terminale. |
| `Cannot connect to the Docker daemon` | Docker Desktop/Engine non avviato. | Avvia Docker e aspetta che `docker info` funzioni. |
| Compose sconosciuto | Plugin mancante o comando vecchio. | Verifica `docker compose version`; questa guida usa Compose con spazio, non `docker-compose`. |
| WSL/virtualizzazione non disponibile | Requisiti Docker Windows non soddisfatti. | Completa i passaggi ufficiali Windows/WSL; se il PC non è compatibile considera Node. |
| `no configuration file provided` | Comando dalla directory sbagliata. | Entra nella cartella con `docker-compose.yml`. |
| `Dockerfile` o `package.json` non trovato | ZIP non estratto o livello di cartella errato. | Controlla l'elenco file e il contesto di compilazione. |
| Download o `npm ci` fallisce per rete/DNS | Host senza internet, proxy o registro non raggiungibile. | Controlla connessione, DNS, spazio disco e proxy dell'host; riprova dopo avere risolto la causa. |
| `node` o `npm` non riconosciuto | Installazione Node/PATH incompleta. | Installa Node 24+ e apri un nuovo terminale. |
| `npm.ps1` bloccato | Policy PowerShell sul wrapper. | Usa `npm.cmd`, senza disabilitare globalmente la policy. |
| Versione Node non supportata o `process.loadEnvFile` assente | Node troppo vecchio. | Controlla `node --version` nel terminale o servizio che avvia l'app. |
| `EADDRINUSE`, `address already in use` o porta occupata | Due istanze o un altro servizio sulla porta. | Ferma la vecchia istanza o cambia la porta host; non cambiare casualmente 8080 nel container. |
| Pagina non raggiungibile anche sul server | Processo/container spento, porta o indirizzo errato. | Controlla `ps`, log e `/api/health` sullo stesso server. |
| Funziona sul PC ma non sul telefono | Uso di localhost, firewall, Wi-Fi ospiti o sospensione. | Usa l'IP del server, stessa rete raggiungibile e controlli della sezione 13. |
| Richiesta continua di password / HTTP 401 | Credenziali errate o proxy che modifica Authorization. | Verifica entrambi i campi, ricrea il container; prova una finestra privata per evitare credenziali memorizzate. |
| Password cambiata ma ancora vecchia | Container non ricreato o variabili definite altrove. | Esegui `docker compose up --build -d`; su Node riavvia il processo e controlla l'ambiente. |
| `EACCES`, `permission denied` o backup impossibile | Directory dati non scrivibile. | Controlla mount, proprietario e ACL; il container incluso usa UID/GID 1000. |
| TrueNAS «host path does not exist» | Percorso errato o directory assente. | Crea il percorso esatto e correggi il YAML; non rimuovere il controllo soltanto per nascondere l'errore. |
| TrueNAS senza pulsante Web UI | App YAML senza collegamento dedicato. | Apri manualmente IP del NAS e porta configurata. |
| Container in riavvio continuo | Errore di avvio, archivio corrotto, permessi o spazio esaurito. | Leggi gli ultimi log, conserva i dati e risolvi la prima causa utile mostrata. |
| Nomi o spese spariti dopo riavvio | Volume diverso, directory errata o precedente salvataggio solo locale. | Ferma le modifiche, cerca il vecchio `latest.json` e controlla il mount; non creare un nuovo spazio sopra l'archivio. |
| Due dispositivi mostrano spazi diversi | URL/server diversi o uno offline. | Confronta indirizzo, porta e dominio; verifica lo stato del server e attendi la sincronizzazione. |
| Conflitto di modifiche | Stessa voce modificata su più copie. | Leggi e risolvi il confronto nell'app; non scegliere una versione a caso. |
| Ricevute assenti dopo trasferimento | Copiati solo i JSON. | Recupera anche `receipts` dal vecchio server e verifica i permessi. |
| Backup rifiutato / file troppo grande | Formato, limite client o limite proxy/server. | Usa un backup completo compatibile e il flusso corretto; conserva l'originale, non tagliare il JSON. |
| `password non configurata` durante cancellazione | Hash per cancellazione assente. | Configura l'hash opzionale della sezione 15; non serve per il normale utilizzo. |
| HTTPS 502/504 | Proxy non raggiunge l'app. | Controlla backend e rete; localhost in un container non è l'host. |
| Certificato HTTPS non emesso | DNS, proxy, porte, dominio o CGNAT. | Verifica i requisiti del gestore HTTPS e i suoi log; il problema precede l'interfaccia TwoFifties. |
| Offline, fotocamera o installazione non disponibili | HTTP LAN non sicuro, permessi browser o funzione non supportata. | Prova HTTPS e controlla i permessi; non dare per garantita la stessa funzione su tutti i browser. |
| Interfaccia vecchia dopo aggiornamento | Pagina o service worker precedente. | Completa prima la sincronizzazione, chiudi le schede e ricarica; cancella dati del sito solo dopo averli salvati. |
| Disco pieno | Ricevute, backup, immagini Docker o log. | Conserva una copia esterna e libera spazio identificando i file; non eliminare l'unica copia dei dati. |

Per capire chi usa una porta su Windows puoi eseguire `Get-NetTCPConnection -LocalPort 5001 -ErrorAction SilentlyContinue`; su Linux `ss -ltnp` e su Mac `lsof -nP -iTCP:5001 -sTCP:LISTEN`. Leggi il processo trovato prima di fermarlo: potrebbe essere un altro servizio necessario.

Se vuoi disinstallare, ferma l'app e conserva backup e configurazione. Su Docker `docker compose down` rimuove i container del progetto; non è necessario aggiungere `-v`. Cancella sorgenti e dati soltanto quando hai deciso consapevolmente cosa conservare. Su Node disabilita anche l'attività o servizio automatico che hai creato.

## 20. Controlli finali e richiesta di aiuto

- So quale dispositivo ospita il server e dove sono i dati reali.
- Apro l'app dal server e dal secondo dispositivo allo stesso indirizzo corretto.
- Ho salvato una prova e verificato la persistenza dopo il riavvio.
- Ho un backup completo, incluse le ricevute, su una destinazione indipendente.
- Ho verificato l'avvio automatico se mi serve disponibilità continua.
- Ho configurato credenziali e HTTPS o un accesso remoto adatto al mio uso.
- So come fermare il servizio e come leggere i log senza cancellare i dati.

Se serve aiuto, apri una [issue nel repository](https://github.com/JoshualBalzani/TwoFifties/issues) indicando sistema operativo/versione NAS, metodo di installazione, versione Node o Docker, passaggio seguito, messaggio esatto e ultime righe pertinenti dei log. Specifica se il problema esiste anche aprendo l'app direttamente sul server e se usi un proxy.

**Non allegare `.env`, password, header Authorization, backup finanziari o ricevute personali.** Oscura dati e indirizzi privati negli screenshot. I comandi e gli esempi descrivono il progetto incluso; le impostazioni del tuo router, NAS o provider possono richiedere adattamenti.
