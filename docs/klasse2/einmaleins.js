const Einmaleins = (() => {
  const selections = [[2, 5, 10], [2], [5], [10], [2, 5], [2, 10], [5, 10]];
  const title = 'Einmaleins entdecken';
  const sheets = ['Blatt 1 · Mit Hilfe', 'Blatt 2 · Zum Üben', 'Blatt 3 · Zum Knobeln'];
  const topics = selections.map(rows => rows.map(row => row + 'er').join(', ') + (rows.length === 1 ? '-Reihe' : '-Reihen'));
  const ink = '#203d36';

  function dots(p, x, y, rows, columns, spacing = 16) {
    for (let row = 0; row < rows; row++) {
      for (let column = 0; column < columns; column++) {
        p.circle(x + column * spacing, y + row * spacing, 3.5, ink);
      }
    }
  }

  function writeLines(p, y, count) {
    for (let i = 0; i < count; i++) p.line(40, y + i * 34, 555, y + i * 34);
  }

  function build(index) {
    const rows = selections[index];
    // Three exercises per page, cycling through the selected rows.
    const groups = [3, 4, 2].map((count, i) => ({count, size: rows[i % rows.length]}));
    const product = ({count, size}) => count * size;
    const expression = ({count, size}) => count + ' · ' + size;
    const sum = ({count, size}) => Array(count).fill(size).join(' + ');
    const page = n => MathA4.page(title, '2. Klasse · Blatt ' + n + ' · ' + topics[index]);

    const help = page(1);
    help.para(40, 163, 'Lege jede Aufgabe mit Plättchen. Zeichne für jede Gruppe eine Reihe mit gleich vielen Punkten. Ergänze die Plusrechnung und die Malrechnung.', 515, 13);
    groups.forEach(({count, size}, i) => {
      const y = 239 + i * 167;
      help.text(40, y, (i + 1) + '. ' + count + ' Gruppen mit je ' + size + ' Plättchen', 14, true);
      help.rect(40, y + 16, 515, 77, 'white');
      help.text(40, y + 123, 'Plus: ____________________ = _____', 13);
      help.text(307, y + 123, 'Mal: _____ · _____ = _____', 13);
    });

    const practice = page(2);
    practice.para(40, 163, 'Verbinde jedes Punktefeld mit seiner Malaufgabe. Zähle zuerst die Reihen von oben nach unten, dann die Punkte in einer Reihe. Rechne aus.', 515, 13);
    groups.forEach(({count, size}, i) => {
      const y = 255 + i * 150;
      practice.rect(40, y - 18, 216, 99, '#f4f7ee');
      practice.text(52, y + 5, ['A', 'B', 'C'][i], 14, true);
      dots(practice, 89, y + 4, count, size);
      practice.rect(383, y - 18, 172, 99, 'white');
      practice.text(409, y + 35, expression(groups[(i + 2) % groups.length]) + ' = ____', 17);
    });
    practice.para(40, 733, 'Tipp: Eine Reihe entspricht einer Gruppe.', 515, 12);

    const challenge = page(3);
    challenge.para(40, 163, 'Lies jedes Punktefeld in zwei Richtungen. Zähle einmal die waagrechten Reihen und einmal die senkrechten Spalten. Schreibe beide Malaufgaben.', 515, 13);
    groups.forEach(({count, size}, i) => {
      const y = 237 + i * 126;
      challenge.text(40, y, (i + 1) + '.', 14, true);
      dots(challenge, 86, y, count, size);
      challenge.text(301, y + 8, 'Reihen:  ____ · ____ = ____', 13);
      challenge.text(301, y + 47, 'Spalten: ____ · ____ = ____', 13);
    });
    challenge.para(40, 638, 'Warum bleibt die Anzahl der Punkte gleich, wenn du die Faktoren tauschst?', 515, 14, true);
    writeLines(challenge, 700, 2);

    const key = MathA4.page(title, '2. Klasse · ' + topics[index], {solution: true});
    key.text(40, 155, 'Blatt 1 · Gruppen legen und zeichnen', 15, true);
    groups.forEach((group, i) => {
      const y = 190 + i * 47;
      key.text(40, y, (i + 1) + '. ' + group.count + ' Reihen mit je ' + group.size + ' Punkten', 13);
      key.text(40, y + 20, sum(group) + ' = ' + product(group) + '   ·   ' + expression(group) + ' = ' + product(group), 13);
    });
    key.text(40, 352, 'Blatt 2 · Punktefelder zuordnen', 15, true);
    groups.forEach((group, i) =>
      key.text(40, 385 + i * 30, ['A', 'B', 'C'][i] + ' gehört zur ' + ['mittleren', 'unteren', 'oberen'][i] + ' Aufgabe. ' + expression(group) + ' = ' + product(group), 13));
    key.text(40, 494, 'Blatt 3 · Tauschaufgaben', 15, true);
    groups.forEach((group, i) =>
      key.text(40, 528 + i * 30, (i + 1) + '. ' + expression(group) + ' = ' + group.size + ' · ' + group.count + ' = ' + product(group), 14));
    key.para(40, 641, 'Beim Wechsel von Reihen zu Spalten zählen wir dieselben Punkte anders. Es kommt kein Punkt dazu und keiner geht weg.', 515, 13);
    return {
      title: title + ' · ' + topics[index],
      discussion: 'Legt zum Einstieg eine Malaufgabe gemeinsam. Sprecht dabei aus, wie viele Gruppen ihr legt und wie viele Plättchen in jeder Gruppe liegen.',
      followUp: {link: './?werkstatt=check&thema=einmaleins', resource: '5-Minuten-Lerncheck zum Einmaleins öffnen'},
      worksheets: [help.finish(), practice.finish(), challenge.finish()],
      solutions: [key.finish()]
    };
  }

  return {build, sheets, topics};
})();
