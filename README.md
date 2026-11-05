# Simulatore Quiz Google Ads

Mini tool statico per condividere con gli studenti una simulazione quiz da `20 domande` con `punteggio finale da 1 a 20`.

## Cosa include

- `index.html`: struttura dell'interfaccia
- `questions.js`: banca dati delle domande
- `styles.css`: stile del quiz
- `app.js`: logica domande, estrazione casuale, navigazione e punteggio
- `vercel.json`: configurazione pronta per Vercel
- `netlify.toml`: configurazione pronta per Netlify
- `docs/revisione-contenuti.md`: criteri editoriali, riferimenti alle slide PPTX e contenuti esclusi
- `extracted-lessons/`: precedente estrazione testuale dalle lezioni PDF; per la banca aggiornata fanno riferimento le slide PPTX indicate nella nota editoriale

## Avvio locale

Dal folder del progetto:

```bash
cd /workspace/quiz-google-ads-Mancin
python3 -m http.server 8000
```

Poi apri nel browser:

```text
http://localhost:8000
```

## Come personalizzare le domande

Apri il file `questions.js` e modifica l'array `window.questionBank`.

Ogni domanda ha questa struttura:

```js
{
  module: "Lezione 1",
  question: "Testo della domanda",
  options: [
    "Risposta A",
    "Risposta B",
    "Risposta C",
    "Risposta D",
  ],
  correctAnswer: 1,
  explanation: "Breve spiegazione finale",
  sourceSlides: [8]
}
```

## Come funziona il quiz

- Il tool contiene una banca da `120 domande`, con `20 domande per ciascuna delle 6 lezioni`.
- La banca include definizioni, casi pratici e calcoli guidati. Ogni domanda ha quattro opzioni, una risposta corretta, una spiegazione e i numeri delle slide da ripassare, visibili nel riepilogo.
- A ogni nuovo tentativo estrae `20 domande casuali` senza ripetizioni nella stessa sessione.
- `correctAnswer` parte da `0`, quindi `0` = prima risposta, `1` = seconda, e cosi' via.
- Il tool mostra numero di risposte corrette, percentuale e riepilogo finale.
- Il punteggio finale e' impostato con minimo `1/20`, come richiesto.
- I tentativi della precedente banca da 60 domande non vengono ripresi: la nuova banca usa una chiave di salvataggio distinta per evitare di associare vecchie risposte a domande diverse.

## Verifica della banca domande

Non occorre installare dipendenze. Con Node.js disponibile:

```bash
node --test tests/question-bank.test.cjs
```

Il controllo verifica struttura, copertura delle lezioni, riferimenti alle slide, assenza di testi duplicati e distribuzione delle risposte corrette. La correttezza didattica richiede anche revisione editoriale, documentata nella nota sui contenuti.

## Deploy consigliato

Il progetto non richiede backend ne' build system. Puoi pubblicarlo come sito statico.

### Vercel

1. carica il contenuto della cartella in un repository Git
2. importa il repository su Vercel
3. usa come root la cartella del progetto
4. esegui il deploy

### Netlify

1. carica il contenuto della cartella in un repository Git
2. importa il repository su Netlify
3. imposta `.` come publish directory
4. esegui il deploy

## Evoluzioni possibili

- shuffle casuale anche delle risposte
- timer per simulazione esame
- soglia di superamento
- esportazione risultato in PDF
- pannello admin con inserimento domande da file JSON
