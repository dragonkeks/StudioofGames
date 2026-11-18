# SHOWSTUDIO – Beta 1.1 (Grundregeln)

**Eigenständige Web-App auf Basis von SHOWSTUDIO Beta 1.0.** MÁLAGA GAMES bleibt unverändert. Die Beta 1.1 baut auf den bestehenden Dateien und der bekannten GitHub-Pages-/Firebase-Struktur auf.

## Das ist in Beta 1.1 umgesetzt

- **Show-Builder / Grundregeln:** Teilnahmeformat Teams, Einzelspieler oder gemischt, maximal vier Parteien; Moderator immer separat. Gesamtpunktesystem (nur Siegpunkte / direkte Spielpunkte / Kombination), Münzen an/aus, standardisierte Antwortzeit und Buzzersperre, TV-Übergänge.
- **Teambildung:** außerhalb der App, manuell, zufällig, Auslosungsquiz oder Kategorie-Rad mit Auslosungsfrage. Bei richtiger Antwort wird die antwortende Person dem derzeit möglichst kleinen Team zugeteilt. Einzelspieler-Parteien sind auf eine zugeteilte Person begrenzt. Teamzusammensetzung wird beim Start fixiert.
- **Spielregeln:** Punktwerte, Münzen für Gewinner oder alle bzw. freie Moderator-Vergabe, wählbare Spielende-Art (manuell, Fragenanzahl, Punktziel, Spielzeit), Gleichstand an/aus und Entscheidungs-Schätzfrage unter den punktgleichen führenden Parteien.
- **Fragenregeln:** Eigene Zeitlimits und Buzzersperren je Frage; ein leeres Feld übernimmt den Standard des Spiels bzw. der Show. Frage ist zunächst nur dem Moderator bekannt; er gibt sie ausdrücklich für TV/Handys frei.
- **Live-Regie:** Automatische Antwortöffnung und Timer bei Freigabe optional; Antworten und Buzzer schließen nach Timerablauf. Unabhängig davon sind manuelle Start-, Öffnen-, Schließen-, Auflösen- und Rückgängig-Befehle möglich.
- **Geheimfinale als vorbereiteter Baustein:** Externes JSON-Fragenpaket **lokal** importieren; Kategorien und Anzahl je Finale festlegen; zufällige Auswahl ohne Wiederholung innerhalb derselben Show-Sitzung. Die Antwort ist im üblichen Moderatorbildschirm bis zur Auflösung verborgen. Der Moderator kann als **Finalgegner ohne regulären Teamplatz** eine Antwort einreichen. Eine vollständig automatisierte Münzfinale-Wertung ist **noch nicht** implementiert.
- **Darstellung:** Einige kleinere Änderungen an Kopfzeile/Seitenleiste, sanfte TV-Übergänge und verbesserte Handybuzzer-Bedienung gegen Scrollen/versehentliches Verschieben.
- **Migrationsschutz:** Einmalige Kopie der bisherigen lokalen Vorlagen im Browser unter `showstudio:v1:backup-before-beta11`, bevor Daten auf vier Parteien normalisiert werden.

## Grenzen der Beta 1.1

**Die ersten Showformate sind noch nicht umgesetzt.** Der neue Tab „Gameshow“ zeigt die geplanten Formate als Vorschau; nur **Freie Gameshow** ist aktiv. Besondere Mechaniken wie das originale oder das Mehrparteien-Münzfinale, Gewinnleitern, Jokersysteme, automatisch erkannte uneinholbare Gesamtsiege und umfassende Show-Automation folgen beim Ausbau einzelner Showformate. Bei den Spielende-Regeln zeigt das Regiepult momentan an, wann ein Punktziel, eine Fragenzahl oder eine Spieldauer erfüllt wurde; der Moderator **bestätigt den Gewinner weiterhin ausdrücklich**. Das verhindert zu frühe Abbrüche, bevor Antworten ausgewertet wurden.

Das Drehrad in Beta 1.1 ist eine **vereinfachte Kategorien-Auswahl**, noch keine vollständig animierte Übernahme des alten Málaga-Drehrads. Die Teamauslosung orientiert sich am eingegebenen Teilnehmernamen und ist keine fälschungssichere Identitätsprüfung.

**Ein endgültiger Pool mit 1.000 redaktionell geprüften Finalfragen ist noch nicht enthalten.** Die Datei `finalfragen-BEISPIEL.json` enthält **28 bekannte Testfragen**, nicht den späteren geheimen Fragenbestand. Für einen qualitativen 1.000er-Pool müssen wir zuerst das gewünschte Fragemuster/Kategorienniveau festlegen und Antworten verifizieren.

**Keine absolute Geheimhaltung in einer Offline-/Browser-App:** Wer den Fragenpool selbst besitzt, importiert oder Zugriff auf den Rechner und dessen Browserdaten hat, kann ihn technisch lesen. SHOWSTUDIO zeigt die Lösung im normalen Finale-Bildschirm zwar nicht vorzeitig, stellt aber keine kryptographische Abschottung gegen den eigenen Betreiber dar. Der Vorteil: keine laufenden KI- oder Serverkosten für den Fragenpool. Lade deine **privaten** Fragenbank-Dateien **nicht** auf GitHub hoch. Auch beim Start einer Online-Show liegen die für die Sitzung ausgewählten Fragen in den nur für den angemeldeten Moderator lesbaren Firebase-Privatdaten.

Eine Live-Show mit mehreren echten Geräten, Cloud-Regeln und realen Netzwerkverzögerungen ist noch nicht abschließend getestet. Für den Test zunächst lokal starten. Wenn die Seite ohne Firebase läuft, kann sie nur Tabs desselben Browsers synchronisieren.

## Aktualisierung von Beta 1.0 auf 1.1

1. **Vorher:** Öffne deine derzeitige Beta 1.0 und exportiere unter „Einstellungen“ deine vorhandenen Shows als JSON-Datei. Insbesondere wenn du in einer Show mehr als vier Parteien angelegt hast: Beta 1.1 lässt nur vier zu; die überzähligen Parteien werden bei der Umstellung nicht in die aktuelle Vorlage übernommen. Bewahre unbedingt den alten Export auf.
2. Lade die ZIP-Datei herunter und entpacke sie.
3. Gehe in dein bestehendes GitHub-Repository `showstudio` (nicht `malaga-games`) und ersetze `index.html`, `styles.css`, `app.js`, `model.js` und die übrigen Dateien durch die Dateien aus dieser ZIP-Datei. Am einfachsten über **Add file → Upload files**; bei gleichen Namen lässt GitHub einen Ersatz bestätigen.
4. Warte, bis GitHub Pages die neue Version veröffentlicht hat, und aktualisiere deine Seite. Die Shows bleiben im selben Browser unter derselben Adresse gespeichert.
5. **Teste zuerst „Lokal testen“**, möglichst mit Regie und TV in zwei verschiedenen Browser-Tabs. Anschließend gegebenenfalls eine separate Firebase-Live-Show mit Testgeräten ausprobieren.

`firebase-config.js` ist bewusst eine **leere Beispielkonfiguration**. **Wenn du Firebase bereits in der bisherigen Beta konfiguriert hast, bewahre deine funktionierende `firebase-config.js` auf und überschreibe sie nicht blind mit dieser Datei.** Die in Beta 1.0 bereitgestellte Regelergänzung `firebase-rules-ADDITION.json` bleibt für die hier verwendeten Live-Pfade grundsätzlich unverändert. Auch hier gilt: Vorhandene Málaga-Regeln nicht überschreiben.

## Der kostenlose Finalfragenpool

1. SHOWSTUDIO → **Einstellungen → Finalfragenpool**.
2. `finalfragen-BEISPIEL.json` importieren (oder später deine eigene 1.000-Fragen-Datei). Die importierten Fragen werden **nur lokal in diesem Browser** gespeichert; sie werden nicht durch das Hochladen des Programms auf GitHub veröffentlicht.
3. Show-Builder → **Spiele** → das gewünschte Finalspiel → **Geheimer Finalfragenpool = Ja**. Optional Anzahl und zugelassene Kategorien festlegen. Für gemeinsame schriftliche Antworten den Antwortmodus „Handy-Eingabe“ verwenden.
4. Starte die Show und dann das betreffende Finalspiel. Fragen werden jetzt aus dem lokalen Pool gezogen. Die Moderator-Lösung bleibt im Regiepult verborgen, bis die Regie „Lösung aufdecken“ drückt.
5. Falls der Moderator im Finale mitantwortet, nutzt er das gesonderte Feld „Moderator als Finalgegner“. Er bleibt trotzdem **außerhalb** der regulären Teilnehmerliste.
6. Du kannst später eine **erweiterte JSON-Datei importieren**. Fragen mit demselben Fragetext werden zusammengeführt, neue ergänzt. Ein normaler Export der Shows enthält den privaten Vollpool nicht.

Einträge im JSON-Array:

```json
[
  {"id":"frage-001","category":"Geografie","text":"Welches Land hat die Hauptstadt Ljubljana?","answer":"Slowenien"},
  {"id":"frage-002","category":"Naturwissenschaften","text":"Welches Element hat das Symbol Au?","answer":"Gold"}
]
```

Das Beispiel ist absichtlich öffentlich und enthält Fragen, die man leicht kennen kann. Für das tatsächlich überraschende Finale sollte später ein eigens zusammengestellter, redaktionell geprüfter Pool verwendet werden.

## Tipps für die neue Regie

- Beim Start des Spiels sehen die Teilnehmenden zunächst noch **keine** Frage. Der Moderator liest Frage und ggf. normale Lösung im Regiepult und klickt erst dann **„Frage auf TV freigeben“**.
- Je nach eingestellter Spielregel öffnen sich anschließend Eingaben/Buzzer automatisch oder erst nach manuellem Regie-Befehl. Die Buzzersperre kann automatisch auslaufen.
- Falls die Spielregel „Timer automatisch“ lautet, beginnt der Countdown beim Freigeben. Mit „Timer starten“ bzw. „Timer stoppen“ lässt sich die Runde auch manuell steuern. Bei Ablauf werden die Handyeingaben und Buzzer geschlossen.
- Eine „Entscheidungs-Schätzfrage“ vergleicht nur die führenden Parteien, die aktuell denselben Punktestand haben. Ein erneuter identischer Abstand muss mit einer weiteren Schätzfrage entschieden werden.
- Münzen und Punkte sind **unabhängige** Werte. Der Modus „Nur Spielsiege“ überträgt einzelne Fragepunkte nicht in die Gesamtwertung.
- **Daten sichern:** Browserdaten können gelöscht werden. Vorlagen als JSON exportieren und separate Finalfragenpools außerhalb des Browsers aufbewahren.

## Dateien

| Datei | Zweck |
|---|---|
| `index.html` | Einstiegspunkt / GitHub Pages |
| `styles.css` | Oberfläche, TV-Übergänge, Handy-Buzzer |
| `app.js` | UI, Show-Builder, Regie, Fragefreigabe, Timer, Auslosung, Finale-Pool |
| `model.js` | Grundregeln, Migration, Showdaten, öffentliches Fragenmodell |
| `sync.js` | Lokale und optionale Firebase-Synchronisation (unverändert) |
| `firebase-config.js` | Optionale Firebase-Webkonfiguration – **vorherige eigene Werte erhalten** |
| `firebase-rules-ADDITION.json` | Nur Ergänzungsbeispiel; nicht die komplette bestehende Regeldatei ersetzen |
| `finalfragen-BEISPIEL.json` | 28 öffentlich bekannte, austauschbare Fragen zum Testen |
| `favicon.svg` | App-Logo |
| `UPDATE-NOTES.md` | Kurzer Versionsvergleich |

## Tests und Hinweise

Die JavaScript-Module wurden mit `node --check` auf Syntax geprüft. Ein isolierter automatisierter Test prüft das Datenmodell, die Migration, die Trennung zwischen Regie und TV, eine zufällige Teamauslosung, die Fragefreigabe, Timerinitialisierung, die geheime Fragerunde und die Punkte-/Münzkonten. Der Browser in dieser Arbeitsumgebung blockiert lokale Testseiten, daher konnte kein vollständiger echter Browsertest durchgeführt werden. **Vor einem Showabend unbedingt mit eigener GitHub-Pages-Instanz und mehreren Geräten testen.**

*SHOWSTUDIO ist ein privates, eigenständiges Fanprojekt. Es besteht keine offizielle Verbindung zu den erwähnten Fernsehshows oder deren Marken.*
