module.exports={
 it:{
  title:'TwoFifties — Spese condivise e bill splitting self-hosted',
  description:'App open source per dividere spese e bollette tra coppie o coinquilini. Expense tracker self-hosted con budget, rimborsi, Docker e Node.js.',
  skip:'Vai al contenuto',nav:['Funzioni','Schermate','Installazione','Domande'],theme:'Cambia tema',github:'Codice su GitHub',
  eyebrow:'LE SPESE SONO CONDIVISE. LA CHIAREZZA ANCHE.',headline:['Le spese in due.','Finalmente chiare.'],
  intro:'Chi ha pagato? Quanto spetta a ciascuno? TwoFifties mette spese, saldo e budget nello stesso posto, così potete dedicarvi a tutto il resto.',
  download:'Scarica il progetto',install:'Come installarla',downloadNote:'ZIP del codice sorgente · Gratis, licenza MIT · Nessun account GitHub necessario',
  chips:['Divisioni flessibili','Sul tuo server','Italiano e inglese'],demo:'Schermate reali con dati dimostrativi.',
  clarity:'Un solo spazio. Due punti di vista.',clarityText:'Dalla spesa al supermercato al prossimo affitto: una vista condivisa per coppie, coinquilini e due persone che dividono le uscite.',
  features:[
   ['split','Una spesa, la divisione giusta','Metà ciascuno, percentuali, importi esatti o tutto a carico dell’altra persona. Il pagatore resta sempre quello reale.'],
   ['balance','Un saldo che si capisce','Vedi chi deve cosa. Quando il pagamento è avvenuto, registra il saldo con una conferma prima di procedere.'],
   ['chart','Il mese sotto controllo','Statistiche, categorie e budget mensili aiutano a leggere le abitudini e tenere d’occhio le uscite.'],
   ['repeat','Le scadenze, al loro posto','Gestisci ricorrenze, proposte da confermare e anticipi da rimborsare, con scadenze e promemoria esportabili nel calendario.'],
   ['receipt','Ogni dettaglio ritrovabile','Aggiungi note e ricevute, cerca nei movimenti, consulta lo storico e recupera le spese dal cestino entro 30 giorni.'],
   ['folder','I dati restano gestibili','Backup JSON in una cartella visibile, ripristino da file, importazione dei movimenti ed esportazione Excel.']
  ],
  exampleLabel:'ANCHE QUANDO NON È 50/50',exampleTitle:'Hai pagato tu. La spesa è dell’altra persona.',exampleText:'Alex anticipa €80 per Sofia. Imposti tutto a carico di Sofia: TwoFifties conserva Alex come pagatore e attribuisce a Sofia il costo completo. Nessun conto da ricostruire a mano.',exampleFrom:'Ha pagato Alex',exampleTo:'A carico di Sofia',
  galleryEyebrow:'GUARDA COME FUNZIONA',galleryTitle:'Fatta per i gesti di ogni giorno.',galleryText:'Schermate reali dell’app mobile in italiano e inglese, con temi chiari e scuri. Trovi anche la galleria completa desktop.',galleryAll:'Galleria completa: 64 schermate',desktopTitle:'Anche su desktop, con tutto a portata di mano.',desktopText:'La barra laterale Material 3 si espande o si riduce a icone. Ogni destinazione resta accessibile; finestre e moduli sfruttano lo spazio disponibile.',desktopMore:'Apri tutte le schermate desktop',desktopLabels:['Spese e navigazione laterale','Impostazioni organizzate'],
  screens:['Spese e saldo','Nuova spesa','Statistiche','Budget','Rimborsi','Ricorrenze','Backup','Lingua'],
  controlTitle:'La vostra quotidianità. Il vostro spazio.',controlText:'TwoFifties è un’app web da installare sul proprio computer o server. Dopo il primo accesso online può mantenere una copia locale per l’uso offline e sincronizzare quando il server torna disponibile.',controlFacts:['Uno spazio condiviso per due persone','Nomi modificabili e lingua per dispositivo','Nessun abbonamento software','Codice aperto con licenza MIT'],
  installEyebrow:'INIZIA DA QUI',installTitle:'Scegli dove farla vivere.',installIntro:'Scarica lo ZIP, estrailo e apri il terminale nella cartella del progetto. Puoi scegliere Docker, Node.js o un NAS TrueNAS compatibile.',
  dockerTitle:'Docker',dockerText:'Il percorso più diretto su un computer o server con Docker Compose.',nodeTitle:'Node.js',nodeText:'Avvio diretto con Node.js 24 o successivo, senza database esterno.',nasTitle:'TrueNAS',nasText:'App personalizzata su TrueNAS con Docker Apps 24.10+, dataset e configurazione YAML.',
  copy:'Copia comandi',copied:'Copiato',copyFailed:'Seleziona e copia i comandi qui sopra.',openApp:'Poi apri http://localhost:5001 e inserisci i due nomi.',serverNote:'Per un server remoto usa il suo indirizzo. Configura le credenziali e HTTPS prima di renderlo accessibile da internet.',guide:'Guida completa',nasGuide:'Installare su TrueNAS',yaml:'Apri il modello YAML',backupNote:'I dati restano nella cartella backups. Conserva anche receipts quando sposti le immagini delle ricevute.',
  faqTitle:'Prima di iniziare.',faq:[
   ['È gratuita?','Sì. Il codice è disponibile con licenza MIT e puoi scaricarlo senza registrarti su GitHub. Computer, server, dominio e hosting sono a tua scelta e possono avere costi propri.'],
   ['Posso usarla direttamente da questo sito?','Questo è il sito di presentazione. L’app completa richiede il suo server Node.js o Docker; GitHub Pages ospita soltanto queste pagine statiche.'],
   ['Devo dividere tutte le spese a metà?','No. Ogni spesa può essere divisa 50/50, per percentuale, per importi esatti o interamente a carico dell’altra persona.'],
   ['Posso usarla senza connessione?','Dopo una visita online che abbia memorizzato l’app, puoi salvare modifiche nel browser offline. Si sincronizzano quando il server è di nuovo raggiungibile.'],
   ['Funziona sul telefono?','L’interfaccia si adatta al telefono e al computer. La stessa installazione può essere raggiunta dai dispositivi che hanno accesso al server, condividendo lo stesso spazio.'],
   ['Posso importare un backup della vecchia app SPESE?','Sì, quando i nomi salvati consentono di associare le persone senza ambiguità. L’importazione converte gli identificativi e conserva pagatori e quote; prima del ripristino crea una copia di sicurezza.'],
   ['Dove cambio lingua?','Nell’app apri Altro → Impostazioni → Lingua. Italiano e inglese sono una preferenza del singolo dispositivo; nomi e testi inseriti restano invariati.'],
   ['Come segnalo un problema?','Apri una segnalazione su GitHub con i passaggi per riprodurlo. Evita di allegare dati personali, ricevute o backup reali a una segnalazione pubblica.']
  ],
  closing:'Meno conti da rifare. Più chiarezza, insieme.',closingText:'Scarica TwoFifties e prepara il vostro spazio condiviso.',issues:'Segnala un problema',privacy:'Questo sito non raccoglie spese e non offre account. Salva solo la preferenza del tema nel browser; non include analytics o font da servizi esterni. L’hosting GitHub Pages applica la propria informativa.',privacyLink:'Privacy Google',consentTitle:'Ci aiuti a migliorare il sito?',consentText:'Con il tuo consenso Google Analytics usa cookie per misurare le visite. Puoi rifiutare o cambiare scelta in qualsiasi momento.',acceptAnalytics:'Accetta analytics',rejectAnalytics:'Rifiuta',changeConsent:'Preferenze cookie',built:'Sviluppato da',source:'Sorgente aperto',notFound:'Questa pagina non esiste.',back:'Torna a TwoFifties'
 },
 en:{
  title:'TwoFifties — Self-hosted expense sharing and bill splitting',
  description:'Open-source expense tracker for couples and roommates. Split bills, track shared expenses, reimbursements and budgets with Docker or Node.js.',
  skip:'Skip to content',nav:['Features','Screenshots','Installation','Questions'],theme:'Change theme',github:'Source on GitHub',
  eyebrow:'SHARED EXPENSES. SHARED CLARITY.',headline:['Life together.','Expenses, clearer.'],
  intro:'Who paid? What does each person owe? TwoFifties brings expenses, your balance and budgets together, so you can get on with everything else.',
  download:'Download the project',install:'How to install',downloadNote:'Source code ZIP · Free, MIT license · No GitHub account needed',chips:['Flexible splits','Your own server','Italian & English'],demo:'Real app screens with fictitious data.',
  clarity:'One workspace. Both perspectives.',clarityText:'From grocery shopping to the next rent payment: a shared view for couples, roommates and any two people splitting everyday costs.',
  features:[
   ['split','The right split for each expense','Half each, percentages, exact amounts or entirely owed by the other person. Always retain who actually paid.'],
   ['balance','A balance you can understand','See who owes what. After payment has happened, record the settlement with a confirmation before proceeding.'],
   ['chart','Understand your month','Statistics, categories and monthly budgets help you understand spending patterns and keep an eye on expenses.'],
   ['repeat','Keep track of what is due','Manage recurring expenses, proposed amounts and outstanding reimbursements, with due dates and calendar exports.'],
   ['receipt','Find the details again','Attach notes and receipts, search transactions, review change history and restore deleted expenses from the 30-day trash.'],
   ['folder','Keep your data manageable','JSON backups in a visible folder, file restoration, transaction import and Excel export.']
  ],
  exampleLabel:'FOR THE TIMES IT ISN’T HALF EACH',exampleTitle:'You paid. The cost belongs to the other person.',exampleText:'Alex pays €80 for Sofia. Assign the full cost to Sofia: TwoFifties retains Alex as the payer and allocates the expense to Sofia. No manual calculations to reconstruct.',exampleFrom:'Paid by Alex',exampleTo:'Owed by Sofia',
  galleryEyebrow:'SEE IT IN ACTION',galleryTitle:'Made for everyday interactions.',galleryText:'Real app screens in English and Italian, with light and dark themes. A full desktop gallery is available too.',galleryAll:'Full gallery: 64 screens',desktopTitle:'A full desktop workspace, with every tool close by.',desktopText:'The Material 3 side navigation expands or collapses to icons. Every destination stays accessible, while dialogs and forms make use of the available space.',desktopMore:'Browse all desktop screens',desktopLabels:['Expenses with side navigation','Organized settings'],screens:['Expenses','New expense','Statistics','Budget','Reimbursements','Recurring','Backups','Language'],
  controlTitle:'Your everyday life. Your shared workspace.',controlText:'TwoFifties is a web app you install on your own computer or server. After an initial online visit, it can keep a local copy for offline use and synchronize when your server is available again.',controlFacts:['One shared workspace for two people','Editable names and per-device language','No software subscription','Open-source code with an MIT license'],
  installEyebrow:'START HERE',installTitle:'Choose where it lives.',installIntro:'Download the ZIP, extract it and open a terminal in the project folder. Choose Docker, Node.js or a compatible TrueNAS server.',
  dockerTitle:'Docker',dockerText:'The straightforward option on a computer or server with Docker Compose.',nodeTitle:'Node.js',nodeText:'Run directly with Node.js 24 or newer, with no external database.',nasTitle:'TrueNAS',nasText:'A custom app on TrueNAS Docker Apps 24.10+, with a dataset and YAML configuration.',copy:'Copy commands',copied:'Copied',copyFailed:'Select and copy the commands above.',openApp:'Then open http://localhost:5001 and enter both names.',serverNote:'For a remote server, use its address. Configure authentication and HTTPS before exposing it to the internet.',guide:'Complete guide',nasGuide:'Install on TrueNAS',yaml:'Open the YAML template',backupNote:'Data stays in the backups folder. Keep receipts too when moving receipt images.',
  faqTitle:'Before you begin.',faq:[
   ['Is it free?','Yes. The code is available under the MIT license and you can download it without a GitHub account. Your computer, server, domain and hosting are your choice and may have their own costs.'],
   ['Can I use the app directly on this website?','This is the product website. The full application needs its Node.js or Docker server; GitHub Pages hosts only these static pages.'],
   ['Do I have to split everything in half?','No. Each expense can be split 50/50, by percentage, by exact amounts or entirely assigned to the other person.'],
   ['Can I use it offline?','After an online visit has cached the app, you can save changes in your browser offline. They synchronize when your server becomes reachable again.'],
   ['Does it work on my phone?','The interface adapts to phones and computers. Devices that can reach the same installation share one workspace.'],
   ['Can I import a backup from the previous SPESE app?','Yes, when the saved names identify both people unambiguously. Import maps the identifiers while preserving payers and shares, and creates a safety copy before restoring.'],
   ['Where do I change the language?','In the app, open More → Settings → Language. Italian and English are a per-device preference; names and text you enter remain unchanged.'],
   ['How do I report a problem?','Open an issue on GitHub with steps to reproduce it. Avoid attaching personal records, receipts or real backups to public issues.']
  ],
  closing:'Less recalculating. More clarity, together.',closingText:'Download TwoFifties and set up your shared workspace.',issues:'Report an issue',privacy:'This website does not collect expenses or provide accounts. Google Analytics (Google Ireland Limited) loads only if you consent and may use cookies to measure visits. You can reject or change your choice at any time; rejecting does not limit the site. GitHub Pages hosting may process technical connection data under its own privacy notice.',privacyLink:'Google Privacy Policy',consentTitle:'Help us improve this website?',consentText:'With your consent, Google Analytics uses cookies to measure visits. You can reject without restriction and change your choice later.',acceptAnalytics:'Accept analytics',rejectAnalytics:'Reject',changeConsent:'Cookie preferences',built:'Developed by',source:'Open source',notFound:'This page does not exist.',back:'Back to TwoFifties'
 }
};
