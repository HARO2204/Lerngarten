const Teilen = (() => {
  const title = 'Teilen und Verteilen';
  const sheets = ['Blatt 1 · Mit Hilfe', 'Blatt 2 · Zum Üben', 'Blatt 3 · Zum Knobeln'];

  function build(index) {
    const rows = Einmaleins.selections[index];
    const page = number => MathA4.page(title, '2. Klasse · Blatt ' + number + ' · ' + Einmaleins.topics[index]);
    const sizes = rows.length === 1 ? [rows[0], rows[0]] : rows;
    const tasks = sizes.map((size, i) => {
      const groups = [4, 3, 5][i];
      return {size, groups, total: size * groups};
    });
    const help = page(1);
    help.para(40, 161, 'Verteile die Plättchen gerecht. Lege immer ein Plättchen nach dem anderen zu einem Kind. Alle sollen gleich viele bekommen.', 515, 13);
    tasks.forEach(({size, groups, total}, i) => {
      const y = 231 + i * 170;
      help.text(40, y, (i + 1) + '. Verteile ' + total + ' Plättchen an ' + groups + ' Kinder.', 14, true);
      for (let j = 0; j < total; j++) help.circle(48 + (j % 25) * 19, y + 24 + Math.floor(j / 25) * 14, 3, '#31574a');
      for (let j = 0; j < groups; j++) {
        const x = 40 + j * 102;
        help.rect(x, y + 54, 95, 49, '#f5f7ed');
        help.text(x + 8, y + 69, 'Kind ' + (j + 1), 10);
      }
      help.text(40, y + 132, total + ' : ' + groups + ' = _____  ·  Jedes Kind bekommt _____ Plättchen.', 13);
    });

    const practice = page(2);
    practice.para(40, 161, 'Bilde gleich große Gruppen. Zeichne die Gruppen. Wie viele brauchst du? Ergänze die Rechnung und prüfe mit einer Malaufgabe.', 515, 13);
    tasks.forEach(({size, groups}, i) => {
      const total = size * (groups + 1);
      const y = 230 + i * 170;
      practice.text(40, y, (i + 1) + '. Du hast ' + total + ' Plättchen. In jede Schale kommen ' + size + '.', 14, true);
      practice.rect(40, y + 19, 515, 79, 'white');
      practice.text(40, y + 125, total + ' : ' + size + ' = _____ Schalen', 14);
      practice.text(296, y + 125, 'Probe: _____ · _____ = _____', 13);
    });

    const challenge = page(3);
    challenge.para(40, 161, 'Die gleiche Menge, zwei Fragen. Vergleiche die Aufgaben.', 515, 14);
    tasks.forEach(({size, groups, total}, i) => {
      const y = 219 + i * 184;
      challenge.para(40, y, (i + 1) + 'a. ' + total + ' Plättchen werden an ' + groups + ' Kinder verteilt. Wie viele bekommt jedes Kind?', 515, 13, true);
      challenge.text(40, y + 51, 'Rechnung: ____________________', 13);
      challenge.para(40, y + 83, (i + 1) + 'b. In jede Schale kommen ' + size + ' der ' + total + ' Plättchen. Wie viele Schalen brauchst du?', 515, 13, true);
      challenge.text(40, y + 132, 'Rechnung: ____________________', 13);
      challenge.text(40, y + 158, 'Welche Malrechnung passt zu beiden? ____________________', 13);
    });
    if (tasks.length < 3) {
      challenge.para(40, 615, 'Erkläre, was die beiden Faktoren in deiner Malrechnung bedeuten.', 515, 13, true);
      challenge.line(40, 670, 555, 670);
      challenge.line(40, 708, 555, 708);
    } else {
      challenge.para(40, 765, 'Erkläre zu zweit: Welche Zahl gibt die Anzahl der Gruppen an?', 515, 12, true);
    }

    // Each section uses the same numbers and order as the corresponding worksheet.
    const key = MathA4.page(title, '2. Klasse · ' + Einmaleins.topics[index], {solution: true});
    key.text(40, 150, 'Blatt 1 · Verteilen', 15, true);
    tasks.forEach(({size, groups, total}, i) => key.text(40, 183 + i * 29,
      (i + 1) + '. ' + total + ' : ' + groups + ' = ' + size + ' Plättchen pro Kind.', 13));
    key.text(40, 291, 'Blatt 2 · Gruppen bilden', 15, true);
    tasks.forEach(({size, groups}, i) => {
      const count = groups + 1;
      const total = size * count;
      key.text(40, 324 + i * 29, (i + 1) + '. ' + total + ' : ' + size + ' = ' + count + ' Schalen. Probe: ' + count + ' · ' + size + ' = ' + total + '.', 13);
    });
    key.text(40, 432, 'Blatt 3 · Vergleichen', 15, true);
    tasks.forEach(({size, groups, total}, i) => key.text(40, 465 + i * 33,
      (i + 1) + 'a. ' + total + ' : ' + groups + ' = ' + size + '     b. ' + total + ' : ' + size + ' = ' + groups + '     Probe: ' + groups + ' · ' + size + ' = ' + total, 13));
    key.para(40, 598, 'Die erste Zahl in der Malrechnung gibt hier die Anzahl der Gruppen an. Die zweite Zahl sagt, wie viele Plättchen in jeder Gruppe liegen. Beim Verteilen ist die Gruppenzahl vorgegeben. Beim Gruppenbilden ist die Größe jeder Gruppe vorgegeben.', 515, 14);
    return {
      title: title + ' · ' + Einmaleins.topics[index],
      discussion: 'Für den Einstieg reichen 20 Plättchen. Verteilt sie auf vier Kinder und legt sie danach in Fünfergruppen.',
      followUp: {link: './?werkstatt=check&thema=teilen', resource: '5-Minuten-Lerncheck zum Teilen öffnen'},
      worksheets: [help.finish(), practice.finish(), challenge.finish()],
      solutions: [key.finish()]
    };
  }

  return {build, sheets};
})();
