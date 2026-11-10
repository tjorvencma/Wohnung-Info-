# Wohnungsplaner als Windows-App

Die App zeigt die Online-Seite in einem eigenen Fenster. Änderungen an der Seite
sind dadurch sofort auch in der App da, ohne neu zu bauen.

Gebaut wird automatisch von GitHub (Reiter **Actions**, Workflow „Windows-App bauen“,
„Run workflow“). Fertig liegt die `.exe` danach beim jeweiligen Lauf unter **Artifacts** („Wohnungsplaner-Windows“, Download als ZIP, nur mit GitHub-Anmeldung).

Selbst bauen (Windows, Node.js nötig): `cd desktop`, `npm install`, `npm run build`.
Die Dateien landen in `desktop/dist`.
