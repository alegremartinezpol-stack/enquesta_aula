# Projecte 2 - Enquesta intel·ligent d'aula (v0 Local)

## Descripció del Projecte
L'objectiu d'aquest projecte és desenvolupar una aplicació web d'enquesta d'aula amb un panell d'analítica integrat en temps real. S'ha construït seguint una metodologia incremental basada en Scrum i pensat per recollir el feedback i el nivell de satisfacció de l'alumnat respecte a les sessions, mostrant dades de manera accionable.

## Memòria i Decisions Tècniques 🛠️

- **Stack Tecnològic Pur:** S'ha desenvolupat la solució utilitzant exclusivament **HTML5, CSS3 i JavaScript (Vanilla)** de manera estricta, sense incloure cap llibreria ni framework extern (com React, TailwindCSS o Bootstrap).
- **Estètica i Disseny UI/UX Modern:** 
  - S'ha establert un sistema de disseny mitjançant l'ús de **Variables CSS (`:root`)**, el que permet coherència visual.
  - S'han inclòs dissenys *card-based* amb ombres suaus, colors clars i fons moderns (glassmorphism/clean design).
  - La UI inclou un sistema de notificacions dinàmics tipus "Toast" per a la retroalimentació visual de l'usuari.
- **Gràfics Dinàmics Sense Llibreries (Chart.js):** Per complir amb la condició de no usar tecnologies addicionals, s'ha abordat la creació dels gràfics de "quesito" mitjançant **lògica matemàtica en JavaScript que genera un `conic-gradient` de CSS**. Aquest s'actualitza reactivament segons les valoracions emeses.
- **Arquitectura JavaScript Reactiva:** El codi de `app.js` gestiona l'estat localitzat en un *Array* d'objectes. Qualsevol interacció de l'usuari (enviar formulari o canviar el selector de filtre de grup) dispara una re-renderització asíncrona a la funció principal `updateDashboard()`, actualitzant únicament la informació processada a les gràfiques de barres, les targetes de respostes i els KPIs.

## Estat de les Històries d'Usuari (Scrum) 📋

S'han completat satisfactòriament totes les funcionalitats "Core" de nivell local requerides al *backlog*:

- ✅ **US-01:** Formulari d'enviament de valoració (1-5) amb confirmació visual.
- ✅ **US-02:** Capacitat d'afegir comentaris opcionals que apareixen reflectits a l'analítica.
- ✅ **US-03:** Selecció i categorització de grup (DAW1A, DAW1B, ASIX1).
- ✅ **US-04:** Panell de KPIs (Respostes, Mitjana matemàtica global, % de positius (4-5)).
- ✅ **US-05:** Distribució estadística dissenyada mitjançant gràfiques de barres reactives i "quesitos" (pastís).
- ✅ **US-06:** Comparativa constant de mitjanes entre grups mitjançant la gràfica respectiva.
- ✅ **US-07:** Segmentació i filtratge complet de respostes, mostrant targetes acolorides segons si el comentari conté un vot positiu (verd), neutral (groc) o negatiu (vermell).
- ✅ **US-08:** Iniciat i preparat un ecosistema de versionat de codi amb Git, documentant les *User Stories* mitjançant la creació de les seves respectives branques d'estructura funcional.

## Millores Pendents i Propers Passos (Cloud) ☁️

D'acord amb els requisits i instruments següents del projecte (IA3 i IA5), la plataforma s'escalarà de la següent manera:
1. **US-09 (Desplegament al Núvol):** Pujar el codi i configurar la branca `main` a **Vercel** per tal de proveir accessibilitat pública a la solució i permetre l'avaluació externa.
2. **US-10 (Persistència Real amb BD):** Substituir l'emulació per defecte de l'Array en local introduint crides asíncrones a l'API de **Supabase**, evitant que les dades s'esborrin quan la sessió de la finestra s'acaba de recarregar.
