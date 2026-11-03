# Installare TwoFifties su TrueNAS

[English](TRUENAS.md) · [Manuale dell’app](../README.it.md) · [YAML da configurare](../deploy/truenas.yaml)

## Requisiti e versioni

La procedura riguarda **TrueNAS con Apps basate su Docker, dalla versione 24.10 in poi**. Prima seleziona un pool per le applicazioni nell’interfaccia TrueNAS. Non riguarda le vecchie Apps Kubernetes o TrueNAS CORE basato su FreeBSD: su CORE usa una VM Linux o un host separato con le normali istruzioni Docker. Il passaggio a Docker è descritto nel [riferimento Apps di TrueNAS 24.10](https://www.truenas.com/docs/scale/24.10/scaleuireference/apps/).

Servono accesso amministratore, spazio per sorgenti e dati, connessione internet durante la compilazione e una porta TCP libera. L’immagine viene compilata sul NAS dal Dockerfile incluso: non è necessario che esista già un’immagine pubblicata su Docker Hub o GHCR.

## 1. Preparare sorgenti e dati persistenti

Crea un dataset dedicato all’app nel tuo pool. Gli esempi usano i percorsi seguenti: sostituisci **tank** con il nome reale del pool e adatta la struttura se necessario.

| Percorso sul NAS | Contenuto |
| --- | --- |
| /mnt/tank/apps/twofifties/source | Sorgenti completi, inclusi Dockerfile, app/ e server/ |
| /mnt/tank/apps/twofifties/backups | Stato, backup JSON e immagini delle ricevute |

Scarica lo ZIP del repository da GitHub sul computer, estrailo e copia il **contenuto** nella directory source tramite una condivisione o il metodo di trasferimento che utilizzi. Il Dockerfile deve trovarsi direttamente in /mnt/tank/apps/twofifties/source/Dockerfile, senza un’ulteriore cartella TwoFifties-main annidata. Se Git è già disponibile sul NAS, puoi invece clonare il repository nello stesso percorso. Non occorre installare pacchetti aggiuntivi nel sistema operativo TrueNAS.

Tieni backups fuori dalla cartella dei sorgenti, così aggiornare il codice non sostituisce i dati. La [guida allo storage delle app](https://apps.truenas.com/getting-started/app-storage/) descrive percorsi host e persistenza.

## 2. Assegnare i permessi

L’immagine inclusa usa l’utente Node senza privilegi root, **UID 1000 / GID 1000**. Nell’editor dei permessi del dataset consenti a questo utente/gruppo numerico di attraversare i percorsi superiori e di leggere, creare, modificare ed eliminare file nella sola cartella backups dedicata. Con un dataset ACL aggiungi la voce corrispondente; con permessi POSIX imposta proprietario e modalità adatti. Conserva l’accesso amministrativo del tuo account.

Non rendere scrivibile da chiunque l’intero pool. Se i log mostrano EACCES o permission denied, correggi i permessi della cartella dedicata. Il [riferimento TrueNAS per le app personalizzate](https://www.truenas.com/docs/scale/25.10/scaleuireference/apps/installcustomappscreens/) spiega ID numerici, percorsi host e ACL.

## 3. Installare tramite YAML

1. Apri **Apps → Discover Apps** e scegli dal menu **Install via YAML**. Le etichette possono variare leggermente tra versioni.
2. Assegna all’app il nome **twofifties**.
3. Apri [deploy/truenas.yaml](../deploy/truenas.yaml), incolla il contenuto nell’editor della configurazione e sostituisci entrambi i percorsi di esempio.
4. Sostituisci AUTH_USER e AUTH_PASS con un nome utente e una password lunga e unica. Adatta TZ o la porta host se necessario. Il modello passa le variabili direttamente e non legge il file .env della precedente installazione sul computer.
5. Salva e attendi compilazione e avvio.

TrueNAS supporta app personalizzate tramite Compose e compilazione da un Dockerfile esistente: consulta la [guida ufficiale all’installazione delle app personalizzate](https://apps.truenas.com/managing-apps/installing-custom-apps/).

Il collegamento dei dati è:

```yaml
volumes:
  - type: bind
    source: /mnt/tank/apps/twofifties/backups
    target: /app/data
    bind:
      create_host_path: false
```

La cartella deve esistere prima dell’installazione. La porta **5001 del NAS** corrisponde alla **8080 del container**. Se 5001 è occupata, modifica solo il numero a sinistra nel modello, per esempio 15001:8080.

## 4. Aprire l’app e verificare i salvataggi

Apri **http://IP_DEL_NAS:5001**, accedi con le credenziali configurate e completa la guida inserendo i due nomi. La lingua si cambia in **Altro → Impostazioni → Lingua**.

Da **Altro → Backup e ripristino** crea un backup e verifica che compaia un file manual-*.json nella cartella backups sul NAS. Riavvia l’app da TrueNAS e controlla che nomi e movimenti rimangano: conferma persistenza e permessi di scrittura. Per l’accesso oltre una rete locale affidabile usa un reverse proxy HTTPS.

## Importare dati esistenti

Per un JSON già scaricato apri **Backup e ripristino → Importa backup**, scegli il file e conferma. Prima del ripristino viene salvata una copia dello stato precedente. Se cambi server, copia anche la sottocartella receipts per conservare le immagini.

Per spostare un’installazione completa ferma la vecchia istanza, copia il contenuto della sua cartella backups nella nuova cartella sul NAS prima di avviare l’app e verifica i permessi. Conserva latest.json, gli altri JSON e receipts/. Non sostituire con una copia di file uno spazio di lavoro ancora attivo.

## Aggiornamenti e recupero

Prima degli aggiornamenti crea un backup dall’app e conserva tutta la cartella backups; una snapshot del dataset TrueNAS è utile insieme alla copia. Ferma l’app, aggiorna i sorgenti nella cartella source e ricompila/ridistribuisci l’app personalizzata dalla configurazione YAML. Controlla nei log che l’immagine sia stata ricompilata. Codice e dati rimangono separati.

Per recuperare i dati scegli un backup precedente nell’app o importa un file salvato. Mantieni disponibili anche le immagini delle ricevute. Non aggiungere credenziali o dati finanziari al repository GitHub.

## Problemi frequenti

| Problema | Controllo |
| --- | --- |
| Dockerfile non trovato | Il contesto di compilazione deve essere il percorso assoluto source sul NAS, con il Dockerfile direttamente al suo interno. |
| Cartella backup inesistente | Crea il percorso host esatto prima dell’installazione; il modello evita di creare automaticamente cartelle con nomi sbagliati. |
| Salvataggio negato | Assegna a UID/GID 1000 accesso alla cartella backups e attraversamento dei percorsi superiori. |
| Porta occupata | Scegli una porta host libera, mantenendo 8080 come porta del container. |
| Credenziali non accettate | Controlla le variabili del modello TrueNAS, non un file .env usato altrove. |
| Ricevute non visibili dopo il trasferimento | Copia la cartella receipts insieme al backup JSON. |

La sintassi YAML è verificata con Docker Compose e la compilazione/persistenza Docker sono provate localmente. Il repository non dispone di un ambiente TrueNAS di prova e non dichiara certificazioni del catalogo.
