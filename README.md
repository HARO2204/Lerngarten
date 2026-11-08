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

Auch Lernwörter, Diktat-Woche, Wortarten, Rechtschreibung, Satzbau, Wochenpakete, Lesen, Mathematik, Detektivmission, Sachunterricht und Lehrerbereich verwenden die ausgewählte Schrift für die erstellten Vorlagen. Die Materialwerkstatt und die Lernwoche exportieren eigene Schrift direkt als PDF; die übrigen Arbeitsblattgeneratoren verwenden bei eigener Schrift den Browser-Druckdialog (**Als PDF sichern**). Fertige Beispiel-PDFs werden nicht umgeschrieben.

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
