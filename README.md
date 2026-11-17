# SHOWSTUDIO – Gameshow-Baukasten (Beta 1)

**Aus MÁLAGA GAMES entstanden.** Diese App ist ein *neues, separates* Projekt. Deine bisherige Website unter `dragonkeks.github.io/malaga-games/` und deren Firebase-Daten bleiben unverändert.

## Was in dieser ersten Version funktioniert

- **Show-Bibliothek:** neue Shows erstellen, bearbeiten, duplizieren, löschen, lokal speichern und als JSON exportieren/importieren.
- **Show-Builder:** Titel, Untertitel, vier Designs, zwei bis sechs Teams, Wertungsmodus (Siegbonus / direkte Spielpunkte / gemischt), optionales Münzsystem.
- **Spielplan:** beliebig viele Spiele bis zu 50 hinzufügen, sortieren und entfernen; sieben Grundmodule (Quiz, Multiple Choice, Schätzen, Musik/Medien, Challenge, Sammelkarten, Risiko).
- **Regeln je Spiel:** eigene Sieg- und Antwortpunkte, Strafpunkte, Münzen pro richtige Antwort oder Sieg, Antwortmodus, Timer-Wert als Einstellung, Fragenpool, Aufgaben, Mediendatei-URL.
- **Moderation:** Fragen aufrufen, Lösungen einblenden, Buzzer freischalten, Eingaben lesen, Antworten auf TV einblenden, manuell werten, Kategoriesieg vergeben und letzte Aktionen rückgängig machen.
- **TV-Ansicht und Handyansicht:** separate Links. **Lokal** synchronisiert sich die Show zwischen Tabs desselben Browsers; **Firebase** kann nach sicherer Einrichtung verschiedene Geräte verbinden.
- **Spielstände:** bleiben lokal erhalten und können später fortgesetzt werden. Templates können wiederholt gespielt werden.
- **Import alter Fragen:** Eine mit MÁLAGA GAMES V4 als JSON exportierte Sicherung wird zu einer neuen Vorlage. Vorhandene alte Spielstände werden *nicht* übernommen oder überschrieben.

**Wichtige Grenzen von Beta 1:** Dies ist **kein** vollständiger Ersatz für jede Spezialmechanik der alten MÁLAGA GAMES. Manche Spiele wie Padel-Tic-Tac-Toe werden zunächst als frei moderierbare Challenges übernommen. Der Timer-Wert ist konfigurierbar, aber noch keine automatisierte Countdown-/Soundshow. Für Medien werden **direkte HTTPS-Links** zu Bild-, Audio- oder Videodateien genutzt; lokale MP3-/Videodateien und YouTube-/Spotify-Seitenlinks sind im neuen Builder noch nicht als Dateiupload oder Player integriert. Ein Münz-Shop, automatische Team-Matchmaking-Regeln und ein vollständig allgemeiner Regel-Editor sind Folgeversionen. Eine produktive Firebase-Liveshow sollte erst nach ausführlichem Geräte- und Sicherheitstest stattfinden.

## Schnellstart ohne Installation (GitHub Pages)

1. Erstelle ein **neues** öffentliches GitHub-Repository, z. B. `showstudio` – bitte **nicht** dein funktionierendes `malaga-games`-Repository ersetzen.
2. Entpacke die ZIP-Datei.
3. Lade die Dateien **aus dem ZIP-Hauptordner** über **Add file → Upload files** hoch. `index.html` muss im Repository-Hauptverzeichnis liegen.
4. Unter **Settings → Pages** wähle **Deploy from a branch → main → /(root)** und speichere.
5. Öffne `https://dragonkeks.github.io/showstudio/` (falls dein Repo exakt `showstudio` heißt).
6. Wähle zunächst **„Lokal testen“**. Öffne auf demselben Mac die TV-Ansicht in einem zweiten Tab. So kannst du den Builder und das Regiepult in Ruhe testen.

Zum Import eines exportierten **Spielstands** nutze ebenfalls „JSON importieren“. Er wird unter **Spielstände** angelegt und lässt sich danach fortsetzen.

Die lokale Show-Bibliothek liegt in deinem **Browser** (localStorage). Browserdaten löschen oder eine andere URL benutzen kann sie löschen bzw. unzugänglich machen. Exportiere wichtige Show-Vorlagen regelmäßig als JSON.

## Vorhandene Málaga-Fragen übernehmen

1. Öffne die bisherige Málaga-App und gehe zu **Einstellungen → Spielstand als JSON herunterladen**.
2. Öffne SHOWSTUDIO → **Übersicht** oder **Einstellungen → JSON importieren**.
3. Wähle die Málaga-Sicherung aus. SHOWSTUDIO erstellt die neue Vorlage **„MÁLAGA GAMES · Import“**.
4. Die grundlegenden Fragepools für die Auslosung sowie Spiele 1, 2, 3, 5, 8 und Finale werden übernommen, sofern sie in der Datei enthalten sind. Spezielle Alt-Spielregeln müssen im neuen Builder geprüft und angepasst werden.

Der Import verändert **keine Daten** deiner alten Firebase-Datenbank.

## Optional: Firebase-Live-Funktionen (Laptop, Fernseher, Handys)

Die vorhandene MÁLAGA-GAMES-Anwendung nutzt bereits Firebase. Die neue App nutzt **einen eigenen Datenbankpfad** `showstudioV1/` und berührt `rooms/` nicht.

1. In `firebase-config.js` trägst du die fünf Werte deiner Firebase-Web-App ein: `apiKey`, `authDomain`, `databaseURL`, `projectId`, `appId`. **Niemals** ein Passwort oder einen Service-Account-Schlüssel dort eintragen.
2. Aktiviere in Firebase Authentication die Methoden **Anonym** und **E-Mail/Passwort** (falls noch nicht aktiv).
3. **Sehr wichtig:** Öffne deine bisherigen **Realtime Database → Regeln**. Sicher die bestehenden Regeln zuerst lokal. Ergänze **innerhalb des vorhandenen `"rules"`-Objekts** die Eigenschaft `"showstudioV1"` aus der Datei `firebase-rules-ADDITION.json`. **Nicht die gesamte Regeldatei durch diesen Ausschnitt ersetzen**, sonst könnte die alte Málaga-App nicht mehr funktionieren.
4. Prüfe das JSON und veröffentliche die zusammengeführten Regeln. Eine schematische Darstellung (nur Illustration, niemals als Ersatz für echte Regeln verwenden):

```json
{
  "rules": {
    "rooms": { "...": "hier deine unveränderten alten Regeln" },
    "showstudioV1": { "...": "hier den Inhalt aus firebase-rules-ADDITION.json einsetzen" }
  }
}
```

5. Lade die geänderte `firebase-config.js` über GitHub hoch; GitHub Pages veröffentlicht sie automatisch.
6. In SHOWSTUDIO → **Show starten → Online starten** mit deinem bestehenden **E-Mail/Passwort-Moderatorzugang** anmelden.
7. In der Regie **TV öffnen** und den **Handy-Link** testen. Spieler öffnen die Handyansicht auf ihren eigenen Geräten und werden anonym bei Firebase angemeldet.

**Sicherheitshinweis:** Die mitgelieferten Regeln sind eine Ausgangsbasis für private, kleine Shows. Teste sie in der Firebase-Regel-Simulation vor einer öffentlichen Veranstaltung. Gib niemals `".read":true` oder `".write":true` auf Datenbank-Wurzelebene frei. Gehe insbesondere mit Geheimfragen und Medienrechten vorsichtig um. Der öffentlichen TV-Datenstruktur werden nur die **aktuelle Frage** und die **erst aufgedeckte Lösung** mitgeteilt. Die vollständige Show liegt separat in privaten Moderatordaten.

**Kosten:** Je nach Umfang und Firebase-Tarif können Nutzungskosten entstehen. Für den lokalen Modus wird Firebase nicht benötigt.

## Bedienung während einer Show

- **Lobby:** „Show beginnen“ startet das ausgewählte Spiel.
- **Fragen:** „Nächste Frage“ veröffentlicht die nächste Frage. „Lösung aufdecken“ zeigt die hinterlegte Lösung auf dem TV.
- **Handy-Buzzer:** „Buzzer öffnen“ aktiviert den Buzzer (bei passenden Antwortmodi). Der erste Eingangsimpuls gewinnt; der Moderator kann zurücksetzen.
- **Handy-Antworten:** „Eingaben öffnen“ aktiviert Text oder Antwortauswahl. „Auf TV zeigen“ erlaubt die Einblendung einzelner Eingaben, wenn im Builder aktiviert.
- **Wertung:** „Richtig“, „Falsch“, „+ Punkt“, „− Punkt“, „Münze“ – oder den Spielgewinn für ein Team vergeben. Beim Modus „Siegbonus“ zählen Spielpunkte nur für die laufende Runde.
- **Schätzspiel:** richtigen Wert und Schätzungen eintragen; der kleinsten Abweichung werden die konfigurierten Antwortpunkte zugewiesen.
- **Sammelkarten:** Kategorien für Teams abhaken; Sieg am Ende durch den Moderator bestätigen.
- **Risiko:** Teams erhalten ein separates Einsatzkonto aus ihren Gesamtpunkten plus Bonus. Alle Einsatzpunkte auf A–D verteilen und auflösen; die Gesamtwertung wird **nur durch den Kategoriesieg** verändert, sofern der passende Wertungsmodus eingestellt ist.
- **Rückgängig:** nimmt den letzten gespeicherten Moderator-Schritt zurück (nicht automatisch externe, bereits abgeschickte Handy-Antworten).

## Projektdateien

| Datei | Zweck |
|---|---|
| `index.html` | Einstiegspunkt für GitHub Pages |
| `styles.css` | responsives Studio-Design, TV und Handy |
| `app.js` | Oberflächen und Spielabläufe |
| `model.js` | Show-Vorlagen, Spielmodule, Datenmodelle, Altimport |
| `sync.js` | lokaler Sync oder optionale Firebase-Verbindung |
| `firebase-config.js` | **optionale** öffentliche Firebase-Webkonfiguration |
| `firebase-rules-ADDITION.json` | **nur zum Zusammenführen** mit deinen bestehenden Regeln |
| `favicon.svg` | eigenes SHOWSTUDIO-Symbol |

## Technische Checks

Alle modularen Dateien bestehen den JavaScript-Syntaxcheck. Zusätzliche Tests prüfen Show-Erstellung, öffentliches Ausblenden geheimer Antworten, den MÁLAGA-V4-Fragenimport, die Bildschirmsteuerung und die lokale Synchronisierung zwischen zwei Ansichten. **Ein vollständiger Live-Test mit echten Mobilgeräten, Browsermedien und Firebase wurde hier nicht durchgeführt**. Bitte zuerst im lokalen Modus testen und anschließend mit zwei Testgeräten die Cloud-Funktionen durchspielen.

---

*SHOWSTUDIO Beta 1 – ein eigenständiges Gameshow-Baukasten-Projekt. Keine offizielle Verbindung zu Fernsehproduktionen oder deren Marken.*
