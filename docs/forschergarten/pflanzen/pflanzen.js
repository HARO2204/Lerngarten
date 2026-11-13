const PflanzenFuehrerschein = (() => {
  const ink = '#294a39';
  const leaf = '#dceabf';
  const subtitle = '2. Klasse · Pflanzen-Führerschein';
  function page(title, names = false) {
    return MathA4.page(title, subtitle, {kicker: 'SACHUNTERRICHT · A4', names});
  }

  function cup(p, x, y) {
    p.path(`M ${x} ${y} l 10 58 h 66 l 10 -58`, '#648897', 2, '#ecf5f7');
    p.path(`M ${x+10} ${y+46} q 5 -15 17 -9 q 11 -12 24 -2 q 12 -9 25 8 l -2 13 h -62 Z`, '#adbbb1', 1, 'white');
    p.line(x, y, x+86, y, '#648897', 2);
  }

  function seed(p, x, y) {
    p.path(`M ${x} ${y} c -21 -16 -37 16 -17 25 c 8 4 20 -1 20 -9 c -10 3 -12 -8 -3 -16 Z`, '#81563f', 1.3, '#d4a17c');
  }

  function plant(p, x, y) {
    p.path(`M ${x} ${y} q -7 -36 7 -57 M ${x} ${y} q 4 16 -7 28 m 5 -14 l 10 9`, ink, 2);
    p.path(`M ${x+3} ${y-42} q -27 -4 -33 -22 q 22 -3 33 22 Z M ${x+3} ${y-42} q 2 -19 28 -22 q -4 19 -28 22 Z`, ink, 1.2, leaf);
  }

  function cards() {
    const p = page('Vier Schritte für deine Bohne');
    const tasks = [
      ['1. Bohne vorbereiten', 'Lege die Bohne an die Becherwand auf feuchte Watte. Die Watte soll feucht sein. Am Boden soll kein Wasser stehen. Zeichne die Bohne an Tag 1.'],
      ['2. Nachsehen und pflegen', 'Stelle den Becher an einen hellen Platz. Prüfe die Watte. Wenn sie trocken wird, gib ein paar Tropfen Wasser dazu. Zeichne, was du siehst.'],
      ['3. Spross messen', 'Sobald ein Spross zu sehen ist, halte ein Lineal daneben. Miss seine Höhe von der Watte bis zur Spitze. Trage die Höhe in dein Tagebuch ein.'],
      ['4. Zeichnungen vergleichen', 'Lege mit einem Partnerkind zwei Zeichnungen nebeneinander. Zeigt einander, was zuerst zu sehen war und was später dazugekommen ist.']
    ];
    tasks.forEach(([title, text], i) => {
      const x = 40 + (i % 2) * 262;
      const y = 135 + Math.floor(i / 2) * 308;
      p.rect(x, y, 250, 292, '#f6f8ef', '#aebda4', 9);
      p.text(x+14, y+30, title, 15, true);
      p.para(x+14, y+206, text, 221, 12, false, 1.35);
      if (i === 0 || i === 1) {
        cup(p, x+75, y+110);
        seed(p, x+105, y+124);
      }
      if (i === 1) {
        p.path(`M ${x+145} ${y+60} q -24 30 0 30 q 24 0 0 -30 Z`, '#648897', 1.2, '#c5e5ee');
      }
      if (i === 2) {
        cup(p, x+65, y+110);
        plant(p, x+108, y+153);
        p.rect(x+158, y+72, 25, 82, '#f5e1b4', '#997b54', 3);
        for (let j = 0; j < 8; j++) p.line(x+158, y+151-j*10, x+(j%2 ? 167 : 173), y+151-j*10, '#705638', 1);
        p.text(x+187, y+155, '0', 10);
      }
      if (i === 3) {
        p.rect(x+46, y+69, 69, 106, 'white');
        p.rect(x+133, y+69, 69, 106, 'white');
        seed(p, x+86, y+112);
        plant(p, x+166, y+148);
      }
    });
    return p.finish();
  }

  function observations(labels, first) {
    const p = page('Mein Forschertagebuch', true);
    labels.forEach((label, index) => {
      const y = 159 + index * 311;
      p.text(40, y, label + ' · Datum: _______________', 14, true);
      p.para(40, y+26, first && index === 0
        ? 'Zeichne die Bohne so, wie sie heute aussieht.'
        : 'Zeichne, was du siehst. Schreibe dazu, was sich verändert hat.', 515, 12);
      p.rect(40, y+46, 515, 155, 'white', '#9aaf94', 7);
      p.line(40, y+232, 555, y+232);
      p.text(40, y+262, first && index === 0
        ? 'So sieht meine Bohne am Anfang aus.'
        : 'Sprosshöhe: ______ cm', 12);
      if (!(first && index === 0)) {
        p.rect(211, y+251, 12, 12);
        p.text(231, y+262, 'Noch kein Spross sichtbar', 12);
      }
    });
    return p.finish();
  }

  function compare() {
    const p = page('Was hat sich verändert?', true);
    p.para(40, 165, 'Lege deine Zeichnung vom Pflanztag neben eine spätere Zeichnung. Zeige beide einem Partnerkind.', 515, 14);
    const prompts = ['Am Anfang habe ich gesehen …', 'Später habe ich bemerkt …', 'Das war bei uns gleich oder verschieden …'];
    prompts.forEach((prompt, i) => {
      const y = 242 + i*103;
      p.text(40, y, prompt, 14, true);
      p.line(40, y+35, 555, y+35);
      p.line(40, y+66, 555, y+66);
    });
    p.rect(40, 563, 515, 191, '#edf3e2', '#aabf9c', 10);
    p.text(59, 599, 'Mein Pflanzen-Führerschein', 20, true);
    ['Ich habe eine Bohne vorbereitet und die Watte geprüft.',
      'Ich habe an mehreren Tagen genau hingeschaut und gezeichnet.',
      'Ich habe erklärt, was sich verändert hat oder gleich geblieben ist.'].forEach((task, i) => {
      p.rect(60, 620+i*29, 12, 12);
      p.text(81, 631+i*29, task, 12);
    });
    p.text(59, 735, 'Datum: _______________   Unterschrift: _______________________', 11);
    return p.finish();
  }

  function teacher() {
    const p = page('Ablauf für die Lehrkraft');
    const sections = [
      ['Vorbereiten', 'Pro Kind einen durchsichtigen Becher, etwas Watte, eine unbehandelte getrocknete Bohne und ein Tagebuch bereitlegen. Lineale für später bereithalten. Schritt-Karten für Paare oder den Tisch ausdrucken.'],
      ['Pflanztag · etwa 20 Minuten', 'Vermutungen sammeln: Was verändert sich zuerst? Die Bohne zwischen feuchter Watte und Becherwand platzieren, damit sie sichtbar bleibt. Die erste Zeichnung anfertigen und die Becher an einen hellen Platz stellen.'],
      ['Drei Beobachtungen · je etwa 10 Minuten', 'Termine frei wählen, zum Beispiel nach 2, 5 und 8 Tagen. Vor einem Wochenende die Watte prüfen und bei Bedarf leicht nachfeuchten. Die Kinder zeichnen auch, wenn noch keine Veränderung sichtbar ist. Erst messen, wenn ein Spross erkennbar ist.'],
      ['Vergleichen · etwa 15 Minuten', 'Paare vergleichen frühere und spätere Zeichnungen. Im Plenum mögliche Beobachtungen sammeln: Die Bohne quillt, eine Wurzel erscheint, später wächst ein Spross. Auch verzögerte oder ausbleibende Keimung gehört zur Beobachtung.'],
      ['Pflege und Abschluss', 'Bei Schimmel den Ansatz entsorgen und bei Bedarf neu beginnen. Die Versuchsbohnen bleiben Beobachtungsmaterial. Den Führerschein anhand der drei Tätigkeiten ausfüllen.']
    ];
    let y = 142;
    for (const [title, body] of sections) {
      p.text(40, y, title, 15, true);
      y = p.para(40, y+25, body, 515, 12, false, 1.4) + 24;
    }
    return p.finish();
  }

  return {
    cards: () => [cards()],
    diary: () => [observations(['Pflanztag', 'Erste Beobachtung'], true),
      observations(['Zweite Beobachtung', 'Dritte Beobachtung'], false), compare()],
    teacher: () => [teacher()]
  };
})();
