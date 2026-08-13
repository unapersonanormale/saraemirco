# Invito di nozze, Mirco & Sara

Sito one-page statico che fa da partecipazione digitale, con countdown, programma della
giornata, modulo RSVP e lista nozze.

- **Sposi:** Mirco Parisi e Sara Boscolo Marchi
- **Data:** 13 dicembre 2026, ore 11:00
- **Cerimonia:** Chiesa dei Filippini, Fondamenta Canal Vena 1156, Chioggia (VE)
- **Ricevimento:** Palazzo delle Figure, Corso del Popolo 1331, Chioggia (VE)

Il pubblico sono gli invitati al matrimonio, in larga maggioranza **da smartphone**.
Questo vincolo guida quasi tutte le scelte di tipografia e layout descritte più sotto.

---

## Struttura dei file

| File | Ruolo |
|---|---|
| `index.html` | Sola struttura semantica, nessuno script inline |
| `style.css` | Tutti gli stili, nessun framework |
| `script.js` | Countdown, scroll reveal, invio RSVP, copia IBAN |
| `sm_forever.svg` | Monogramma "S & M Forever", sfondo della hero |
| `istruzioni-rsvp.md` | Guida in italiano per gli sposi, setup Google Sheets |

Nessuna build, nessun package manager, nessuna dipendenza. Si apre facendo doppio clic
su `index.html`.

Sezioni della pagina, nell'ordine: hero, countdown, cerimonia e ricevimento, timeline
della giornata, info card, RSVP, lista nozze, footer.

---

## Deploy

Hosting **Tophost/Topname**, piano statico economico. Caricamento via FTP o file manager,
tutti i file nella stessa cartella principale.

Vincoli che ne derivano:

- **Niente PHP, niente MySQL, nessun backend.** Il server serve solo file statici.
  Qualsiasi funzione dinamica va risolta lato browser o con servizi esterni.
- **HTTPS obbligatorio**, incluso nel piano. La chiamata `fetch()` del form RSVP verso
  Google lo richiede.
- `sm_forever.svg` è referenziato dal CSS con percorso relativo, quindi deve restare
  accanto a `style.css`.

---

## Palette

I colori non sono scelti a caso: sono estratti da una **bomboniera fisica** già prodotta,
una scatolina verde bosco con un fiore di ciliegio bianco e pistilli dorati. Il sito e le
bomboniere devono parlare la stessa lingua visiva, quindi la palette è sostanzialmente
chiusa.

```css
--ivory:           #FEFCF9  /* sfondo principale */
--cream:           #F3F0EA  /* sfondo sezioni alternate */
--charcoal:        #1C3528  /* verde bosco, testo principale */
--gold:            #7A5E12  /* oro scuro, SOLO TESTO */
--gold-deco:       #C8A530  /* oro brillante, SOLO DECORAZIONI */
--warm-gray:       #3D5E4A  /* verde medio, testi secondari */
--warm-gray-light: #527257  /* verde salvia, hint e placeholder */
```

### Regola critica sui due ori

Questa è la trappola principale del progetto. I due ori **non sono intercambiabili**:

- `--gold` (#7A5E12) per **qualsiasi testo**. Contrasto 5,97:1 su avorio, conforme WCAG AA.
- `--gold-deco` (#C8A530) **solo per decorazioni prive di testo**: linee divisorie,
  rombi ornamentali, pallini della timeline, la e commerciale della hero.

Un'unica variabile oro c'era nella prima versione ed è stata **eliminata di proposito**:
l'oro brillante su avorio dà un contrasto di 2,25:1, illeggibile su schermo di telefono
alla luce del giorno. Se una modifica futura fa apparire testo in `--gold-deco`, è una
regressione, non una scelta estetica.

Contrasti attuali, tutti verificati e conformi:

| Colore | Su avorio | Su crema |
|---|---|---|
| oro testo `#7A5E12` | 5,97:1 | 5,37:1 |
| verde principale `#1C3528` | 12,90:1 | 11,62:1 |
| verde medio `#3D5E4A` | 7,08:1 | 6,37:1 |
| verde salvia `#527257` | 5,25:1 | 4,73:1 |

Ogni colore nuovo va verificato ad almeno **4,5:1 su entrambi gli sfondi** prima di entrare.

---

## Tipografia

Font da Google Fonts: **Cormorant Garamond** (display), **Cormorant SC** (maiuscoletto per
le etichette), **Jost** (corpo testo).

I caratteri sono **volutamente grandi e in grassetto**. Non è un difetto da correggere:
è il risultato di una richiesta esplicita e ripetuta, motivata dalla lettura su telefono.
Riferimenti: testi di lettura 1,45rem peso 400, etichette 1,45rem peso 600, titoli di
sezione fino a 4,3rem, numeri del countdown fino a 6,2rem.

L'aumento di **peso** conta più della dimensione: prima erano a peso 200 o 300 e
sparivano. Non riportare i pesi verso il basso.

---

## Comportamenti mobile già risolti

Sotto i 760px il layout cambia in modo sostanziale, e questi accorgimenti servono proprio
a reggere i caratteri grandi:

- Il **countdown passa a griglia 2×2**, quattro numeri in fila non entrano in uno schermo stretto.
- **Pulsanti a larghezza piena**, più comodi da premere col pollice.
- L'**IBAN va a capo** invece di sfondare la card.
- Bordi di card, campi e pulsanti a **2px** invece di 1px, per reggere il confronto con
  testi più pesanti.
- Numeri del countdown in **cifre tabulari**, così i secondi non fanno saltare il layout.
- Sotto i 380px c'è un ulteriore scalino di riduzione.

C'è anche il rispetto di `prefers-reduced-motion`, che disattiva le animazioni di scroll.

---

## Hero

Il cerchio con le iniziali della prima versione è stato sostituito da un **monogramma
vettoriale**. `.monogram-ring` è ora un contenitore vuoto con la classe `.hero-sfondo`,
che carica `sm_forever.svg` come immagine di sfondo. Il bordo circolare e il testo delle
iniziali sono commentati nel CSS, e la regola `.monogram` è rimasta orfana.

---

## RSVP

Il form invia in POST a un **Google Apps Script** che scrive su **Google Sheets**.
Nessun backend proprio, coerente con i limiti dell'hosting.

L'URL è ancora un segnaposto in `script.js`:

```js
var APPS_SCRIPT_URL = 'INSERISCI_QUI_URL_APPS_SCRIPT';
```

Finché resta quel valore il form gira in **modalità demo**: valida i campi e mostra il
messaggio di ringraziamento senza inviare nulla. È voluto, permette di provare il sito
prima che gli sposi abbiano l'account Google. La procedura di attivazione è in
`istruzioni-rsvp.md`.

Il form gestisce già stato di caricamento con spinner, messaggio d'errore e fallback per
la copia dell'IBAN nei browser senza `navigator.clipboard`.

### Logica del conteggio ospiti

Da non reinterpretare, perché è passata per due revisioni prima di arrivare qui.

Chi compila il modulo **è già il primo partecipante**. Il campo si chiama "altri ospiti"
e raccoglie le persone **in più**, non il totale. Il codice calcola `totale = altri + 1`
e invia entrambi i valori al foglio.

Il foglio Google ha **9 colonne**: Nome, Email, Telefono, Presenza, Accompagnatori,
Totale persone, Intolleranze, Messaggio, Data invio. Chi risponde di non poter venire
ottiene un trattino negli accompagnatori e zero nel totale, così la somma dei coperti
resta pulita.

Toccare questa logica significa aggiornare **anche** `istruzioni-rsvp.md` e lo script
lato Google, che si aspetta esattamente quelle colonne in quell'ordine.

---

## Lingua e stile

- Tutti i contenuti e i commenti nel codice sono **in italiano**.
- Formule **neutre rispetto al genere**. Esempio concreto: nel menù ospiti si è scelto
  "io più uno" al posto di "io e un accompagnatore".
- Il sito dà del **voi** agli invitati ("Vi preghiamo", "Scriveteci", "avervi al nostro
  fianco"). Mantenere il registro.
- Negli incisi usare la **virgola**, non il trattino lungo.
- Registro elegante e sobrio, l'obiettivo dichiarato è l'alta stamperia su carta pregiata.

---

## Lavori aperti

### Segnaposto da sostituire

- **IBAN** nella sezione "un contributo", ora è un numero di esempio
- **Link della lista nozze**, ora è `href="#"`
- **URL dell'Apps Script** in `script.js`

### Difetti noti, segnalati e non ancora corretti

Sono stati rilevati in una revisione e lasciati di proposito, il committente deciderà se
intervenire.

1. **Monogramma ritagliato.** `sm_forever.svg` è in proporzione 1,60:1, mentre
   `.monogram-ring` è 350×250 (1,40:1) con `background-size: cover`. Si perde circa il
   **13% in larghezza su desktop e il 25% su mobile**, cioè le foglioline laterali.
   Rimedi possibili: `contain` al posto di `cover`, oppure contenitore a 400×250 e
   240×150 per rispettare la proporzione.

2. **Residui della sede precedente.** Il progetto era ambientato a Bellagio prima di
   spostarsi a Chioggia. Sono rimasti indietro: la card "pernottamento", che parla ancora
   di camere *"nella villa"*, e l'`aria-label` del secondo pulsante mappa, che dice
   "Apri mappa per la villa" invece di Palazzo delle Figure.

3. **Incoerenze di registro nel form.** Il suggerimento sotto "altri ospiti" recita
   *"Oltre a te. Se vieni da solo, lascia 0."*: è al maschile e dà del tu, mentre il resto
   del sito è neutro e dà del voi. Versione coerente: *"Oltre a voi. Se venite senza altri
   ospiti, lasciate 0."*

4. **Terminologia lista nozze.** L'introduzione parla ancora di *"un riferimento
   bancario"*, mentre la card accanto è stata rinominata "un contributo" con sottotitolo
   "Le nostre coordinate".

### Regole orfane nel CSS

`.monogram`, `.btn-spinner` (usata solo da JavaScript), più `.show` e `.visible` che sono
classi di stato aggiunte a runtime. Solo `.monogram` è davvero inutilizzata.

---

## Come lavorare su questo progetto

Prima di modificare stili, tenere presente che tre cose sono state decise dopo iterazione
e non vanno "migliorate" per iniziativa autonoma: la **separazione dei due ori**, la
**dimensione e il peso dei caratteri**, la **logica additiva del conteggio ospiti**.

Per il resto il codice è volutamente semplice, senza astrazioni: HTML semantico, CSS con
variabili e media query, JavaScript vanilla dentro un IIFE. Mantenere questo livello,
il progetto deve restare modificabile a mano anche fra sei mesi.
