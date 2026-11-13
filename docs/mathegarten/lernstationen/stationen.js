const Lernstationen = (() => {
  const title = 'Messen im Schulalltag';
  const ink = '#203d36';
  const stations = {
    ruler: {title: 'Mit dem Lineal messen', materials: 'Lineal und zwei verschieden lange Bleistifte', draw: ruler},
    clock: {title: 'Uhrzeit an der Basteluhr', materials: 'Basteluhr, Schere, Karton und Musterbeutelklammer zum Vorbereiten', draw: clock},
    survey: {title: 'Strichliste und Säulendiagramm', materials: 'Buntstifte und Lineal', draw: survey}
  };
  const votes = [
    ['Apfel', 7], ['Birne', 3], ['Banane', 5], ['Trauben', 4]
  ];
  const subtitle = '2. Klasse · Messen im Schulalltag';

  function lines(p, y, count) {
    for (let i = 0; i < count; i++) p.line(40, y + i * 37, 555, y + i * 37);
  }

  function ruler(p) {
    p.para(40, 203, '1. Lege zwei verschieden lange Bleistifte bereit. Nenne sie A und B. Schätze ihre Länge in ganzen Zentimetern.', 515, 14, true);
    p.para(40, 286, '2. Miss vom Ende bis zur Spitze. Lege die Null des Lineals am Ende an. Runde auf den nächstgelegenen ganzen Zentimeter. Bei genau einem halben Zentimeter runde auf.', 515, 14, true);
    p.para(40, 385, '3. Trag deine Ergebnisse ein.', 515, 14, true);
    for (const [i, label] of ['Stift', 'Geschätzt', 'Gemessen'].entries()) {
      const x = 40 + i * 171;
      p.rect(x, 415, 171, 43, '#eef4e7');
      p.text(x + 15, 442, label, 13, true);
      for (let r = 0; r < 2; r++) {
        p.rect(x, 458 + r * 55, 171, 55, 'white');
        p.text(x + 15, 491 + r * 55, i === 0 ? ['A', 'B'][r] : '________ cm', 14);
      }
    }
    p.para(40, 615, '4. Welcher Stift ist länger? Um wie viele Zentimeter? Wenn beide gerundeten Längen gleich sind, schreibe „0 cm Unterschied“.', 515, 14, true);
    lines(p, 696, 2);
  }

  function clock(p) {
    p.para(40, 203, '1. Stell 9:30 Uhr an der Basteluhr ein. Dann beginnt die Jause.', 515, 14, true);
    p.para(40, 256, '2. Die Jause dauert 15 Minuten. Drehe die Zeiger auf die Uhrzeit, zu der sie endet.', 515, 14, true);
    p.para(40, 321, '3. Zeichne beide Zeiger in die Uhr ein und schreib die Uhrzeit darunter.', 515, 14, true);
    const x = 297.5;
    const y = 487;
    const point = (r, i) => [x + r * Math.sin(i * Math.PI / 6), y - r * Math.cos(i * Math.PI / 6)];
    p.circle(x, y, 108, ink);
    p.circle(x, y, 106, 'white');
    for (let i = 1; i <= 12; i++) {
      p.line(...point(98, i), ...point(105, i), ink, 1.4);
      const [tx, ty] = point(83, i);
      p.text(tx, ty + 5, i, 16, true, ink, 'middle');
    }
    p.circle(x, y, 3, ink);
    p.text(40, 635, 'Die Jause endet um __________ Uhr.', 15);
    p.para(40, 692, 'Partnercheck: Auf welcher Zahl steht der lange Zeiger? Zwischen welchen Zahlen steht der kurze Zeiger?', 515, 13);
    lines(p, 749, 1);
  }

  function survey(p) {
    p.para(40, 198, 'Die Klasse hat abgestimmt. Welches Obst mögen die Kinder am liebsten?', 515, 13);
    p.text(40, 229, '1. Zähle die Striche. Schreib die Anzahl neben jede Strichliste.', 13, true);
    votes.forEach(([name, count], row) => {
      const y = 257 + row * 31;
      p.text(45, y + 12, name, 13);
      for (let i = 0; i < count; i++) {
        const x = 183 + Math.floor(i / 5) * 49;
        const mark = i % 5;
        if (mark === 4) p.line(x - 4, y + 14, x + 26, y, ink, 1.4);
        else p.line(x + mark * 7, y, x + mark * 7, y + 15, ink, 1.4);
      }
      p.text(330, y + 12, '______ Stimmen', 12);
    });
    p.text(40, 406, '2. Male die Säulen bis zur passenden Stimmenzahl aus.', 13, true);
    const baseline = 639;
    for (let i = 0; i <= 8; i++) {
      const y = baseline - i * 22;
      p.line(75, y, 550, y);
      p.text(64, y + 4, i, 11, false, ink, 'end');
    }
    p.line(75, baseline - 176, 75, baseline, ink, 1.5);
    votes.forEach(([name], i) => {
      const x = 137 + i * 117;
      for (const edge of [x - 25, x + 25]) p.line(edge, baseline - 176, edge, baseline);
      p.text(x, baseline + 24, name, 12, true, ink, 'middle');
    });
    p.text(40, 718, '3. Wie viele Stimmen hat Apfel mehr als Birne?', 13, true);
    lines(p, 754, 1);
  }

  function build(selected, optional) {
    if (selected.length < 2) throw Error('Wähle mindestens zwei Stationen aus.');
    const items = selected.map((id, index) => ({id, number: index + 1, optional: id === optional, ...stations[id]}));
    const worksheets = items.map(item => {
      const p = MathA4.page(item.title, subtitle + ' · Station ' + item.number + (item.optional ? ' · Wahlstation' : ''));
      p.para(40, 160, 'Material: ' + item.materials, 515, 12);
      item.draw(p);
      return p.finish();
    });
    const route = MathA4.page('Mein Laufzettel', subtitle);
    route.para(40, 168, 'Kreuze jede Station an, die du erledigt hast. Bearbeite zuerst die Pflichtstationen.', 515, 14);
    items.forEach((item, index) => {
      const y = 240 + index * 106;
      route.rect(40, y, 515, 83, '#f5f7ed', '#9caf91', 8);
      route.rect(56, y + 27, 15, 15, 'white');
      route.text(87, y + 36, item.number + '. ' + item.title, 15, true);
      route.text(87, y + 61, item.optional ? 'Wahlstation' : 'Pflichtstation', 12);
    });
    route.para(40, 614, 'Das konnte ich gut erklären:', 515, 14, true);
    lines(route, 656, 2);
    worksheets.push(route.finish());
    const labels = [...items.map(item => 'Station ' + item.number + ' · ' + item.title), 'Laufzettel'];
    if (selected.includes('clock')) {
      worksheets.push(UhrzeitWerkstatt.craft());
      labels.push('Basteluhr zum Ausschneiden');
    }

    const answers = {
      ruler: 'Die Längen hängen von den beiden Stiften ab. Prüft zuerst, ob die Null am Stiftende lag. Zieht die kürzere von der längeren gemessenen Länge ab. Beispiel: 15 cm − 11 cm = 4 cm.',
      clock: '9:30 Uhr + 15 Minuten = 9:45 Uhr. Der lange Zeiger zeigt auf die 9. Der kurze Zeiger steht zwischen 9 und 10, näher bei 10.',
      survey: votes.map(([name, count]) => name + ': ' + count).join(' · ') +
        '. Die Säulen haben dieselben Höhen wie die Stimmenzahlen. Apfel hat ' + (votes[0][1] - votes[1][1]) + ' Stimmen mehr als Birne.'
    };
    const key = MathA4.page(title, subtitle, {solution: true});
    items.forEach((item, index) => {
      const y = 155 + index * 180;
      key.text(40, y, 'Station ' + item.number + ' · ' + item.title, 15, true);
      key.para(40, y + 33, answers[item.id], 515, 14);
    });
    return {title, labels, worksheets, solutions: [key.finish()]};
  }

  return {build, stations};
})();
