# Revisione della banca domande — 5 novembre 2026

## Materiale e copertura

La banca passa da 60 a 120 domande, rivedendo anche i quesiti precedenti. Contiene 20 domande per ciascuna delle sei lezioni caricate dal docente:

| Lezione | Presentazione | Slide totali | Argomenti dei quesiti |
| --- | --- | --- | --- |
| 1 | Google Ads - Lezione 1.pptx | 83 | Funzionamento, reti, dati prodotto, funnel, domanda, targeting, Centro Clienti |
| 2 | Google Ads - Lezione 2.pptx | 85 | Struttura Search, metriche, calcoli, offerte, cronologia ed esperimenti |
| 3 | Google Ads - Lezione 3.pptx | 54 | Keyword, corrispondenze, esclusioni, intento, planner, stagionalità e stime di budget |
| 4 | Google Ads - Lezione 4.pptx | 59 | Annunci adattabili Search, asset, norme di base, qualità e asta |
| 5 | Google Ads - Lezione 5.pptx | 58 | Brand, DSA, landing, Display, pubblici, remarketing e ottimizzazione |
| 6 | Google Ads - Lezione 6.pptx | 43 | Conversioni, valori, conteggio, implementazione, GA4 e attribuzione |

Sono stati letti i testi estraibili dalle 382 slide delle presentazioni PPTX. I riferimenti `sourceSlides` in `questions.js` indicano i numeri delle slide originali, contando anche copertine ed esercitazioni. Le immagini e gli screenshot senza testo estraibile non sono stati usati come unica fonte per formulare domande. Le presentazioni originali non vengono copiate nel repository.

I riferimenti identificano il concetto da ripassare: non implicano che tutte le affermazioni della slide siano ancora valide. Quando la slide contiene una semplificazione o una vecchia denominazione, la spiegazione del quiz la corregge o ne delimita il significato. Il vecchio materiale in `extracted-lessons/` non è la fonte primaria di questa revisione.

## Criteri editoriali

- Una sola risposta corretta su quattro; distrattori riferiti a errori concettuali o di calcolo.
- Alternanza di definizioni, applicazioni pratiche e calcoli con tutti i dati necessari.
- Nessuna promessa di rendimento, posizione, costo o volume garantiti.
- Nessuna soglia numerica presentata come requisito universale quando dipende da campagna, account o configurazione.
- Distinzione fra quantità e qualità dei risultati, ricavi e profitto, clic e conversioni.
- Punteggio di qualità trattato come indicatore diagnostico, distinto dalla valutazione della qualità in asta.
- Terminologia aggiornata: Profilo dell'attività su Google, tag Google, Google Analytics 4 ed eventi chiave, senza riproporre percorsi operativi di Universal Analytics.
- Cinque risposte corrette per ciascuna posizione A/B/C/D in ogni lezione, con ordine distribuito nella banca. Non viene introdotto lo shuffle delle opzioni durante il test.

La numerosità è equilibrata nella banca, non nel singolo tentativo: l'app continua a estrarre 20 domande casuali dall'intero insieme, senza quote obbligatorie per lezione.

## Contenuti esclusi o corretti

| Contenuto delle slide o della vecchia banca | Scelta editoriale |
| --- | --- |
| CPC ottimizzato e requisiti fissi di 30 conversioni in 30 giorni | Eliminati dal quiz: non viene riproposta questa strategia come opzione operativa corrente |
| Soglia di 50 conversioni in 30 giorni per il ROAS target | Sostituita con il significato dell'obiettivo ROAS, senza soglia universale |
| Performance Max con priorità su tutte le altre campagne | Rimossa la priorità assoluta; mantenuta la natura automatizzata e multicanale |
| Elenco storico comprendente Discovery | Nessuna domanda su Discovery come tipologia corrente; nessun nuovo quesito su prodotti sostitutivi non spiegati nelle slide |
| Durata universale degli in-stream non ignorabili, numero fisso di slot Search | Esclusi: dettagli di formato e inventario soggetti a variazioni |
| Liste di campi Merchant Center tutti obbligatori, minimo di prodotti, aggiornamento ogni 30 giorni | Sostituiti con ruolo dei dati prodotto e coerenza di prezzo/disponibilità con il sito |
| Ripartizione dei ricavi AdSense e anzianità minima del sito | Escluse: non necessarie agli obiettivi del quiz e potenzialmente dipendenti da contesto e condizioni |
| Corrispondenza esatta come identità letterale o garanzia del CTR migliore | Corretta: stesso significato o intento, senza garanzie di rendimento |
| Sblocco dei dati precisi del planner dopo un centesimo speso | Escluso: nessuna condizione monetaria assoluta |
| Media dei CPC dell'esempio della lezione 3, slide 49 | Non riprodotto l'errore aritmetico: (2 + 1,5 + 3) / 3 è circa 2,17 €, non 1,50 €. I nuovi esercizi usano dati e risultati ricalcolati |
| Budget mensile stimato come minimo obbligatorio | Il fattore 30,4 viene usato soltanto per una stima, senza garanzia di spesa o risultati |
| Creare sempre senza obiettivo, disattivare sempre partner/Display | Sostituiti da controlli coerenti con il caso; nessuna preferenza del docente presentata come regola universale della piattaforma |
| Asset descritti semplicemente come gratuiti | Distinto il costo di aggiunta dagli eventuali addebiti per clic o altre interazioni |
| Google My Business | Aggiornato a Profilo dell'attività su Google |
| Requisito assoluto che il numero di chiamata sia sempre in landing; CRM sempre obbligatorio per i lead | Nessuna domanda su questi requisiti assoluti; mantenute funzione e pianificazione delle chiamate |
| Quality Score × CPC massimo come formula completa dell'Ad Rank; formula semplificata del CPC effettivo | Rimosse le formule: il ranking dipende da più fattori e il punteggio diagnostico non è il moltiplicatore fisso usato in asta |
| Tabella di sconti CPC e bounce rate come componente diretta del punteggio di qualità | Esclusi; mantenute soltanto le tre componenti diagnostiche e il miglioramento della pertinenza |
| Landing con «nessuna via di uscita» come requisito | Sostituita da chiarezza, pertinenza, velocità e facilità di completamento dell'azione |
| Keyword dei concorrenti come strategia sempre conveniente o automaticamente lecita | Mantenuto soltanto il rischio di disallineamento dell'intento; nessuna garanzia economica o legale |
| Soglie fisse per i pubblici; CPC Display sempre pari a un terzo della Search | Esclusi i valori numerici; mantenuti definizioni, selezione e verifica della copertura |
| Percorsi dell'interfaccia di Universal Analytics e Global Site Tag come nome corrente | Nessuna domanda sui vecchi menu; descrizione concettuale aggiornata a GA4 e tag Google |
| Tag nativo sempre più preciso di Analytics | Sostituito con la necessità di verificare implementazione, eventi e criteri di misurazione |
| Primo clic, lineare, decadimento temporale e posizione come modelli selezionabili correnti | Rimossi; mantenuti concetto di attribuzione, limite dell'ultimo clic e attribuzione basata sui dati |
| Settori regolamentati e regole legali dipendenti da paese | Non trasformati in quiz di abilitazione normativa; mantenute regole generali su chiarezza, destinazioni e cloaking |

## Limite della verifica online

Il tentativo di consultare la guida ufficiale Google Ads sul CPC ottimizzato (`https://support.google.com/google-ads/answer/2464964?hl=it`) ha ricevuto un diniego del proxy di rete (HTTP 403). Non è stata quindi effettuata una verifica online completa della documentazione corrente, né si dichiara la banca validata rispetto all'ultima certificazione Google.

In assenza di quella verifica, sono stati esclusi i dettagli dubbi o soggetti a frequenti variazioni. Prima di usare il quiz come preparazione certificativa formale, resta opportuna una verifica dei limiti di formato e delle funzionalità operative nella guida ufficiale accessibile al docente. La banca privilegia i concetti del corso e non valuta la conoscenza di vecchi menu o requisiti numerici incerti.

## Compatibilità con i tentativi salvati

La revisione cambia contenuti, opzioni e posizione delle domande. Poiché il salvataggio precedente memorizzava indici e non identificativi stabili, l'app usa ora `google-ads-quiz-tool-state-v2`. I tentativi della vecchia banca non sono ripresi né convertiti; il vecchio salvataggio non viene cancellato. I nuovi tentativi continuano a essere salvati e ripristinati normalmente.
