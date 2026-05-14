# Projecte 2 - Enquesta intel·ligent d'aula (v0 Local)

## Descripció del Projecte
L'objectiu d'aquest projecte és desenvolupar una aplicació web d'enquesta d'aula amb un panell d'analítica integrat en temps real. S'ha construït seguint una metodologia incremental basada en Scrum i pensat per recollir el feedback i el nivell de satisfacció de l'alumnat respecte a les sessions, mostrant dades de manera accionable.

## Memòria i Decisions Tècniques 🛠️

- **Stack Tecnològic Pur:** S'ha desenvolupat la solució utilitzant exclusivament **HTML5, CSS3 i JavaScript (Vanilla)** de manera estricta, sense incloure cap llibreria ni framework extern (com React, TailwindCSS o Bootstrap).
- **Estètica i Disseny UI/UX Clàssic:** 
  - S'ha replicat exactament la interfície sol·licitada a l'enunciat, apostant per un disseny clàssic, net i estructurat en blocs (tipus targetes).
  - El fons principal gris clar (`#f8f9fa`) fa ressaltar els panells d'informació amb fons blanc, atorgant un contrast suau i professional.
- **Gràfics Dinàmics Sense Llibreries Externes:** Per complir amb la condició de no usar tecnologies addicionals tipus Chart.js, s'ha abordat la creació dels gràfics de "quesito" mitjançant **lògica en JavaScript que genera un `conic-gradient` de CSS**.
- **Arquitectura JavaScript Reactiva:** El codi de `app.js` gestiona l'estat en un *Array* global. Qualsevol interacció de l'usuari (guardar un vot o canviar el filtre) crida a `updateDashboard()`, que s'encarrega d'esborrar i regenerar dinàmicament el DOM per mostrar les estadístiques sempre actualitzades.
- **Dades Inicials (Seed Data):** S'ha poblat l'estat inicial de l'array amb el conjunt exacte de comentaris i puntuacions proporcionades de mostra (12 respostes per a DAW1A), garantint així que tant el llistat de targetes com els càlculs estadístics mostren resultats idèntics a l'enunciat des del primer moment.

## Planificació i Estat dels Sprints (Scrum) 📋

El desenvolupament s'ha organitzat i dut a terme seguint la següent planificació per sprints:

### Sprint 1
- ✅ **US-01:** Formulari d'enviament de valoració (1-5) perquè el docent conegui la satisfacció.
- ✅ **US-02:** Capacitat d'afegir comentaris opcionals que aporten context a la puntuació.
- ✅ **US-03:** Selecció de grup (DAW1A, DAW1B, ASIX1) per vincular les respostes.

### Sprint 2
- ✅ **US-04:** Quadre de KPIs superiors per interpretar ràpid (Respostes, Mitjana, % positives).
- ✅ **US-05:** Distribució de puntuacions en gràfiques de barres horitzontals i "quesitos" (pastís).
- ✅ **US-06:** Gràfica comparativa de mitjanes entre els diferents grups per prendre decisions.
- ✅ **US-07:** Llistat de respostes d'un grup concret (amb disseny de targetes segons valoració).

### Sprint 3
- ✅ **US-08:** Mantenir codi clar i versionat en repositori amb branques per cada història.
- ⏳ **US-09:** Desplegament al núvol per compartir la solució (Es farà amb Vercel - IA3).
- ⏳ **US-10:** Integració de Supabase per passar de dades locals a persistència real (Es farà a IA5).
