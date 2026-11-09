# Lerngarten · Volksschule

Statische Website mit Lesegarten, Schreibgarten, Mathegarten, Detektivmission,
Forschergarten, Wochenplan und Materialwerkstatt.

## Website veröffentlichen

In GitHub unter **Settings → Pages → Build and deployment**:
**Deploy from a branch**, Branch **main**, Ordner **/docs**, dann **Save**.
Die Website-Adresse nach erfolgreicher Veröffentlichung:
https://haro2204.github.io/Lerngarten/

## Lokal öffnen

Im Repository `python3 -m http.server 8000 --directory docs` ausführen und
http://localhost:8000 öffnen. Es ist kein Build und keine Installation nötig.

## Inhalte und Schriften

Diese GitHub-Fassung liefert ausschließlich Druckschrift mit. Eigene Schreibschriften können lokal im Browser geladen werden. Die Schulschrift,
ihre Vektorformen und die drei Schulschrift-Beispiel-PDFs sind ausgeschlossen.
Die Druckschrift-Werkstatt bleibt unter `schreibgarten/druckschrift.html`
erreichbar. Die Druckschrift-Lizenz und die PDF-Lib-Lizenz liegen bei den Assets.
Die ursprünglichen ChatGPT Sites werden durch diesen Export nicht geändert.

Entwürfe bleiben browser- und websiteabhängig gespeichert. Vorhandene Entwürfe
von der bisherigen Website dort als Datei sichern und hier wieder öffnen.

## Stand und Weiterarbeit

Export vom 8. November 2026 aus den gespeicherten Projektquellen:
Lerngarten Version 7, Lesen Version 5, Schreiben Version 22 sowie Mathematik,
Detektivmission und Forschergarten jeweils Version 1.
Der frühere Chatverlauf und unveröffentlichte Änderungen sind nicht enthalten.
Alle Website-Dateien liegen in `docs/`; Verlinkungen zwischen den Lernbereichen
sind relativ und funktionieren auch unter dem GitHub-Pages-Projektpfad.


## Eigene Schreibschrift

In jedem Lernbereich **Meine Schreibschrift** öffnen und eine **TTF-, OTF-, WOFF- oder WOFF2-Datei** bis 10 MB laden. Eine handgeschriebene Seite, ein Bild oder ein PDF ist noch keine Schriftdatei. Die Datei wird mit FontFace geprüft und – falls möglich – in IndexedDB auf diesem Gerät gespeichert. Sie wird weder ins Repository noch an einen Server übertragen. Die aktive Auswahl gilt auf derselben Website für alle Lernbereiche. Entfernen ist über denselben Bereich möglich.

Die **Schrift-Werkstatt** unter `schreibgarten/druckschrift.html` unterstützt eigene Buchstaben, Wörter und Sätze, Nachspuren, kräftige Vorlagen, leere Linien, gemischte Schriften je Zeile, Wiederholungen, 3–6 mm Linienbänder und Hoch-/Querformat. Schreibschrift bleibt beim Zeichnen als zusammenhängender Text erhalten, einschließlich der von der Schrift unterstützten Ligaturen. PDF-Export: 300-dpi-Seitenbilder ohne erforderliche Schriftinstallation am Druckgerät. Druckschrift-PDFs bleiben vektorbasiert.

Auch Lernwörter, Diktat-Woche, Wortarten, Rechtschreibung, Satzbau, Wochenpakete, Lesen, Mathematik, Detektivmission, Sachunterricht und Lehrerbereich verwenden die ausgewählte Schrift für die erstellten Vorlagen. Die Materialwerkstatt und die Lernwoche exportieren eigene Schrift direkt als PDF; Mathe-Mix, Zahlenwerkstatt und Diktat-Woche exportieren ebenfalls direkt als PDF. Die übrigen Arbeitsblattgeneratoren verwenden bei eigener Schrift den Browser-Druckdialog (**Als PDF sichern**). Fertige Beispiel-PDFs werden nicht umgeschrieben.

Entwurfsdateien enthalten keine Schriftdatei. Auf einem anderen Gerät dieselbe Schrift erneut laden. Verbindungen, Umlaute, ß und Zeilenhöhe vor dem Drucken prüfen; das Ergebnis hängt von den Zeichen und Verbindungen in der eigenen Schrift ab.

## Konflikte und Gefühle

Im Sachunterricht als siebtes Thema auswählbar; direkter Einstieg:
`docs/forschergarten/?thema=konflikte-gefuehle`.

Enthält 7 illustrierte Kinderseiten und optional 2 Lehrkraftseiten: Gefühlsübersicht, Konfliktlabor mit vier wechselnden Fällen, Friedensweg, Situationskarten, acht Gefühlskarten und sechs Hilfekarten. Drei Unterstützungsstufen, beide Schulstufen, Schreiblinien sowie eigene Schrift werden berücksichtigt. Persönliche Gefühle werden nicht gespeichert oder bewertet; das Bildschirmquiz fragt nur nach hilfreichen Handlungen.

Die beiden Bildtafeln wurden für dieses Material generiert und liegen unter `docs/forschergarten/gefuehle/`. Webansicht, Druck und 300-dpi-PDF verwenden dieselbe SVG-Seitenaufteilung. Die bestehenden sechs Themen und deren Startpaket bleiben erhalten. Das Unterrichtskonzept mit Lernfolge und Quellen steht in `docs/forschergarten/gefuehle/konzept.md`.

### Klassenplakate

Unter Sachunterricht → Konflikte und Gefühle → Klassenplakate stehen drei illustrierte A4-Plakate zur Verfügung: „Unser Friedensweg“, „So hören wir zu“ und „Hier bekommen wir Hilfe“. Einzelplakate oder das Dreierpaket lassen sich drucken und als PDF herunterladen. Für das Hilfe-Plakat können zwei Ansprechpersonen und Treffpunkte eingetragen werden; leere Felder bleiben auf dem Ausdruck beschreibbar. Diese Angaben werden nicht automatisch gespeichert. Das ursprüngliche Lernpaket bleibt bei 7 Kinderseiten plus optional 2 Lehrkraftseiten.

Direkter Einstieg: `docs/forschergarten/?thema=konflikte-gefuehle&material=plakate`.

## Freundschaft und Zusammenhalt

Achtes Sachunterrichtsthema mit neuen Illustrationen: zwei Bildergeschichten, ein Gemeinschaftsblatt, zwei wechselnde Teamaufgaben aus vier Varianten und acht freundliche Satzkarten. Das Paket umfasst 7 Kinderseiten plus optional 2 Lehrkraftseiten. Texte und Hilfen sind auf die 1./2. Schulstufe und drei Unterstützungsstufen abgestimmt. Schriftwahl, Schreiblinien, PDF und Druck werden unterstützt. Die Aussagen im Bildschirmquiz betreffen respektvolle Handlungen, keine Bewertung persönlicher Freundschaften.

Direkter Einstieg: `docs/forschergarten/?thema=freundschaft-zusammenhalt`. Das Konzept und die Bildbeschreibung liegen unter `docs/forschergarten/freundschaft/`.

## Themenwochen zu Gefühlen und Freundschaft

Die beiden sozialen Themen stehen auch unter `docs/wochenplan.html` zur Verfügung. Die Startvorlagen wählen Lesen, Schreiben, Sachunterricht und Gemeinschaft mit 4 Pflichtaufgaben und 2 Wahlangeboten (1 davon bearbeiten). Mathematik ist optional. Neben dem Aufgabenplan entsteht ein Vorschlag von Montag bis Freitag mit Verweisen auf die tatsächlich ausgewählten Aufgaben und deren Pflicht-/Wahlstatus. Aufgaben, Hilfen und Lösungen beziehen sich auf die jeweilige Geschichte. Persönliche Gefühle und Freundschaften werden nicht bewertet.

Plan, Wochenablauf, Arbeitsblätter und Lehrkraftmaterial lassen sich in der Vorschau wählen, als PDF exportieren sowie als Entwurf sichern und wieder öffnen. Bestehende Themenindizes bleiben stabil. Die Bilder stammen aus den bereits eingebetteten Sachunterrichtsmaterialien. Für soziale Themen verwendet der PDF-Export dieselbe illustrierte Seitenaufteilung wie die Vorschau. Lernwörter aus diesen Wochen lassen sich auch in der Materialwerkstatt übernehmen.

- `docs/wochenplan.html?thema=konflikte-gefuehle`
- `docs/wochenplan.html?thema=freundschaft-zusammenhalt`


## Flexible Mathematik und A4-Vorlagen

Im Mathegarten lassen sich Plus, Minus, Lückenaufgaben, Nachbarzahlen, Zahlenfolgen, Kopfrechenschlangen, Rechenhäuser, Zahlenpyramiden, verliebte Zahlen und Sachaufgaben frei mischen. Jede Aufgabenart erhält eine eigene Anzahl; Zahlenräume 10, 20, 50, 100 und 1000 sowie drei Hilfestufen sind wählbar. Verliebte Zahlen ergänzen sich immer zu 10. Die Mischung kann lokal als JSON gespeichert und wieder geöffnet werden. Arbeitsblätter und zugehörige Lösungen verteilen sich auf feste A4-Seiten statt auf eine Seite verkleinert zu werden.

Die Zahlenwerkstatt unter `docs/mathegarten/zahlenwerkstatt.html` bietet Zahlenstrahlen, Rechensprünge, Stellenwerttabellen und Materialbilder bis 1000. Gleichmäßige Abstände und Stellenwerte werden rechnerisch erzeugt; Lösungen sind optional.

Die Diktat-Woche bleibt mit sechs Lernwörtern und fünf Tagen auf genau einer A4-Seite im Querformat. Die Höhe des vierlinigen Schreibbands ist auf 9, 12, 15 oder 18 mm einstellbar (Abstand zwischen benachbarten Linien 3 bis 6 mm). Vorschau und PDF verwenden dieselbe feste Geometrie.

## Rätselgarten und Matheolympiade

- `docs/raetselgarten/`: „Das verschwundene Gartentor“, eine kooperative Mission für die 2. Klasse. Vier Stationen verbinden Lesen, Rechnen, Geheimschrift und Pflanzenwachstum. Neue Rätselsätze, Zahlenräume 20/50/100, Codeprüfung am Bildschirm, gestufte Hilfen und A4-PDF. Kinderbasis: drei Seiten; optional Hilfen, Urkunde sowie zwei Lehrkraftseiten mit Lösungen, Ablauf und Schlussgeschichte. Die Titelillustration wurde eigens generiert; genaue Rätselhinweise und Wachstumskarten entstehen als SVG.
- `docs/olympiade/`: Matheolympiade mit 13 frei wählbaren Themen, Zahlenräumen 20/50/100 und drei Hilfestufen. Jede Station ist eine A4-Seite. Laufzettel, Tipps, Urkunde, Ablauf und Lösungen sind zuschaltbar; Lösungen sind zusätzlich separat als PDF abrufbar. Auswahl und Aufgabensatz lassen sich lokal als JSON sichern und wieder öffnen. Die Stationen verwenden dieselben geprüften Modelle wie Mathe-Mix und Zahlenwerkstatt; eine optionale Titelangabe erlaubt Stationsüberschriften ohne Verhaltensänderung am bestehenden Mathe-Mix.

Beide Bereiche sind auf der Startseite verlinkt. Pädagogische Konzepte und Durchführung stehen jeweils in `konzept.md`. Eigene Schriftdateien bleiben weiterhin ausschließlich im Browser. Die erzeugten Seiten verwenden den bestehenden Font- und PDF-Export.
