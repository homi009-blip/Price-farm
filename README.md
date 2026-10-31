# Limited Hunter v1.0 – Android-PWA-Projekt

## Enthaltene Funktionen
- Mobile-first Oberfläche im Schwarz/Grün-Gaming-Design
- Dashboard mit Watchlist, Deal-Kandidaten und Potenzialsumme
- Watchlist für Gaming, Pokémon, LEGO, Sneaker, Technik, Sammler und frei wählbare Kategorien
- Produkte anlegen, bearbeiten, löschen, suchen und filtern
- Status: Beobachten, Verfügbar, Vorbestellung, Ausverkauft
- Händler, Produktlink, Einkaufslimit, Verkaufsschätzung, Gebühren, Versand und Notizen
- Gewinnrechner inkl. Gesamtüberschuss und ROI
- Einstellbares Kapital-Limit und Mindestüberschuss
- JSON-Backup exportieren/importieren
- Offline-Caching über Service Worker
- Browser-Benachrichtigungsberechtigung vorbereitbar

## Ehrliche Funktionsgrenze
Diese Version ist eine funktionsfähige lokale PWA, aber noch kein automatischer Händler-Scanner. Produktstatus und Preise werden vom Nutzer eingetragen und gepflegt. Sie enthält keine Händler-API-Keys, kein Scraping, keine Echtzeit-Verfügbarkeitsprüfung, keine Marktpreisdaten und keinen serverseitigen Push-Dienst. Die Browser-Push-Berechtigung allein sendet keine Hintergrundalarme.

Für echte 24/7-Überwachung braucht die nächste Ausbaustufe:
1. Backend/Worker mit Zeitplan und sicherer Speicherung
2. Offizielle Händler-APIs oder autorisierte Produkt-/Affiliate-Feeds je Händler
3. Einhaltung von Rate-Limits, Nutzungsbedingungen und Produktdatenlizenzen
4. Marktpreisquelle mit tatsächlich abgeschlossenen Verkäufen, soweit rechtmäßig verfügbar
5. Firebase Cloud Messaging oder ein anderer Web-Push-Dienst mit HTTPS, Service-Worker-Push-Handler und Server-Schlüsseln
6. Sicheres Geräte-Token- und Nutzerkonto-Management

## Android installieren – kostenloser Start
Die PWA benötigt eine HTTPS-Adresse. GitHub Pages eignet sich für einen einfachen kostenlosen Start:

1. Entpacke `limited-hunter-v1.zip` auf einem PC.
2. Erstelle ein privates oder öffentliches GitHub-Repository und lade die fünf Projektdateien (`index.html`, `style.css`, `app.js`, `manifest.webmanifest`, `sw.js`) hoch.
3. In GitHub: **Settings → Pages → Deploy from a branch → main → /(root) → Save**.
4. Warte, bis GitHub Pages eine HTTPS-Adresse anzeigt.
5. Öffne diese Adresse auf deinem Android-Handy in Chrome.
6. Menü **⋮ → App installieren** oder **Zum Startbildschirm hinzufügen**.
7. Starte Limited Hunter über das neue Symbol.

## Nutzung
- Unter „＋ Produkt“ ein Produkt eintragen.
- Produktlink möglichst zur offiziellen Produktseite setzen.
- Status und Preise regelmäßig manuell überprüfen.
- Im Gewinnrechner Gebühren, Versand und Rücklagen vollständig eintragen.
- Unter „Guide“ regelmäßig ein JSON-Backup exportieren.

## Datenschutz
Alle Watchlist-Daten und Einstellungen liegen in `localStorage` auf dem Gerät bzw. im Browserprofil. Sie werden nicht automatisch synchronisiert. Browserdaten löschen kann die Watchlist entfernen. Keine Zahlungsdaten, Passwörter oder Händler-Logins speichern.

## Recht & Risiko
Der Rechner ist eine vereinfachte Planung und keine Steuer- oder Rechtsberatung. Bei planmäßigem gewerblichem Wiederverkauf sind Gewerbe-, Steuer-, Verbraucher- und Gewährleistungspflichten zu prüfen. Die App führt keine Käufe aus und umgeht keine Warteschlangen, CAPTCHAs oder Händlerlimits.
