# TODO - ADS-B Tracker

## Distribuzione

### Integrazione con tar1090
- [ ] Preparare build per essere integrato in tar1090
  - L'app sarà distribuita nella folder `/html/` di tar1090
  - Gli utenti che installano tar1090 avranno automaticamente questa UI moderna
  - L'app caricherà i dati da `tar1090/data/aircraft.binCraft` in modalità relativa (stesso host)

### Frontend Standalone
- [ ] Preparare distribuzione standalone
  - Per utenti che hanno già tar1090 installato e vogliono solo questa UI
  - Permettere di configurare l'URL di tar1090 remoto
  - Build separato ottimizzato per hosting statico (GitHub Pages, Netlify, Vercel, ecc.)

---

## Problema CORS da Risolvere

### Descrizione
Quando l'app punta ad un IP/host esterno alla rete locale, tutto funziona correttamente.
Quando l'app punta ad un IP interno alla rete locale, si verifica un errore CORS.

### Da Investigare
- [ ] Verificare configurazione CORS del server tar1090
  - Controllare se tar1090 ha header CORS configurati
  - Verificare se i permessi CORS sono diversi per richieste interne vs esterne

- [ ] Analizzare il comportamento del browser
  - Le richieste interne potrebbero essere bloccate per policy di sicurezza
  - Verificare se è un problema specifico del protocollo (http vs https)

- [ ] Possibili soluzioni
  - Configurare header CORS sul server tar1090
  - Usare un proxy locale per bypassare CORS in sviluppo
  - Documentare il setup necessario per utenti finali

### Note
- IP esterno: ✅ funziona
- IP interno (rete locale): ❌ errore CORS
- Questo potrebbe essere un blocker per l'uso standalone se non risolto

---

## Build & Deploy

### Pre-requisiti
- [ ] Verificare che tutti i path siano relativi (no hardcoded URLs)
- [ ] Test con diversi browser (Chrome, Firefox, Safari, Edge)
- [ ] Test su diversi sistemi operativi
- [ ] Performance testing con 100+ aerei

### Build Ottimizzata
- [ ] Configurare build Vite per produzione
- [ ] Minificare assets (JS, CSS, SVG)
- [ ] Tree-shaking per rimuovere codice non usato
- [ ] Lazy loading dei componenti se necessario

### Documentazione
- [ ] README con istruzioni di installazione
- [ ] Guida configurazione tar1090
- [ ] Troubleshooting CORS
- [ ] Screenshots e demo

---

## Future Features (Opzionali)

### Discusse ma non prioritarie
- [ ] Terrain shadowing (ombre del terreno)
- [ ] Filtri avanzati (altitudine, velocità, categoria)
- [ ] Export dati/screenshot
- [ ] Modalità replay con dati storici
- [ ] Multi-language support
