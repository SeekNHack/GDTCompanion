# GDT Companion

Planner statico in italiano per **Game Dev Tycoon**. Seleziona uno o più temi, un genere, una console e il pubblico per ottenere una classifica delle combinazioni. Aprendo un risultato trovi i quattro valori di compatibilità e i cursori suggeriti per le tre fasi di sviluppo.

## Uso

Apri [la webapp su GitHub Pages](https://seeknhack.github.io/GDTCompanion/) oppure `index.html` nel browser. Non servono dipendenze, installazione o build. Per pubblicarla con GitHub Pages, seleziona il branch `main` e la cartella `/ (root)` in **Settings → Pages**.

La console predefinita è la migliore disponibile per ciascuna coppia tema/genere secondo i dati. Puoi scegliere una console specifica oppure mostrare tutte le console. I temi selezionati vengono salvati nel browser. I risultati sono mostrati a blocchi per mantenere la pagina reattiva.

## Come viene calcolata la classifica

I dati in `data.js` contengono la compatibilità di temi e console con i sei generi e i tre pubblici. Il planner somma quattro abbinamenti: tema × genere, genere × console, tema × pubblico e console × pubblico. Ogni valore viene convertito in punti: `+++` = 100, `++` = 80, `+` = 60, `--` = 30, `---` = 0. Il massimo è 400. A parità di totale, ha precedenza tema × genere e poi genere × console. La percentuale mostrata è il totale diviso per quattro.

Le tre fasi usano preset dei cursori per genere. Sono indicazioni iniziali, non valori garantiti: dimensione del gioco, funzionalità, abilità del team, ripetizione delle idee e qualità dei giochi precedenti influenzano il risultato.

Fonti dei dati: [tabelle Steam](https://steamcommunity.com/sharedfiles/filedetails/?l=romanian&id=216784744), [Success Guild 1.7.8](https://gamedevtycoon.fandom.com/wiki/Success_Guild_updated_for_1.7.8) e [GameDevTycoon-Assistant](https://github.com/boeloep/GameDevTycoon-Assistant).
