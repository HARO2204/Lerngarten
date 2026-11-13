const Klassenumfrage = (() => {
  const title = 'Unsere Klasse in Zahlen';
  const examples = [
    {question: 'Welches Obst magst du am liebsten?', labels: ['Apfel', 'Birne', 'Banane', 'Trauben'], counts: [8, 3, 6, 4]},
    {question: 'Welches Tier magst du am liebsten?', labels: ['Hund', 'Katze', 'Pferd', 'Kaninchen'], counts: [7, 9, 3, 5]}
  ];
  const ink = '#203d36';
  const colors = ['#b9d4a3', '#e7c685', '#b3d6e3', '#d7bad8'];

  function tally(p, x, y, count) {
    for (let i = 0; i < count; i++) {
      const left = x + Math.floor(i / 5) * 44;
      const offset = i % 5;
      if (offset === 4) p.line(left - 3, y + 17, left + 27, y + 1, ink, 1.4);
      else p.line(left + offset * 7, y, left + offset * 7, y + 18, ink, 1.4);
    }
  }

  function table(p, labels, counts, solution) {
    p.rect(40, 172, 515, 33, '#edf2e5');
    p.text(52, 194, 'Antwort', 12, true);
    p.text(192, 194, 'Strichliste', 12, true);
    p.text(482, 194, 'Stimmen', 12, true);
    labels.forEach((label, i) => {
      const y = 205 + i * 37;
      p.rect(40, y, 515, 37, 'white');
      p.line(179, y, 179, y + 37);
      p.line(467, y, 467, y + 37);
      p.text(52, y + 24, label, Math.min(13, 113 / Math.max(1, MathA4.width(label, 1))));
      if (counts) tally(p, 198, y + 9, counts[i]);
      if (solution) p.text(510, y + 24, counts[i], 14, true, ink, 'middle');
    });
  }

  function chart(p, labels, counts, level, solution) {
    const top = 434;
    const bottom = 684;
    const left = 75;
    const right = 548;
    const max = counts ? 10 : 30;
    const step = (bottom - top) / max;
    const column = (right - left) / labels.length;
    for (let i = 0; i <= max; i++) {
      const y = bottom - i * step;
      const labeled = i % (counts ? 1 : 5) === 0;
      p.line(left, y, right, y, labeled ? '#9ba991' : '#d6dfd1', labeled ? .9 : .5);
      if (labeled) p.text(65, y + 3, i, 9, false, ink, 'end');
    }
    p.line(left, top, left, bottom, ink, 1.3);
    p.line(left, bottom, right, bottom, ink, 1.3);
    p.text(left, top - 10, 'Stimmen', 10, true);
    labels.forEach((label, i) => {
      const x = left + column * (i + .5);
      if (solution) p.rect(x - 27, bottom - counts[i] * step, 54, counts[i] * step, colors[i], ink);
      if (solution || level === 0) p.text(x, bottom + 20, label, Math.min(11, 105 / Math.max(1, MathA4.width(label, 1))), false, ink, 'middle');
      else p.line(x - 46, bottom + 21, x + 46, bottom + 21);
    });
  }

  function questionLines(p, y, text) {
    p.para(40, y, text, 515, 13, true);
    p.line(40, y + 31, 555, y + 31);
  }

  function render(data, level, solution) {
    const {question, labels, counts} = data;
    const p = MathA4.page(title, '2. Klasse · Blatt ' + (level + 1), {solution});
    p.para(40, 149, question, 515, 13, true);
    table(p, labels, counts, solution);
    if (level < 2) {
      p.para(40, 379, level === 0
        ? (counts ? 'Zähle die Striche. Schreibe die Stimmenzahl in die Tabelle.' : 'Sammle die Stimmen als Striche. Trage dann die Anzahl ein.') + ' Male jede Säule bis zur passenden Zahl aus.'
        : (counts ? 'Zähle die Striche und ergänze die Tabelle.' : 'Übertrage eure Striche und Stimmen in die Tabelle.') + ' Beschrifte die Säulen und male sie bis zur passenden Zahl aus.', 515, 12);
      chart(p, labels, counts, level, solution);
      const total = solution ? counts.reduce((sum, value) => sum + value, 0) : '__________';
      p.text(40, 754, 'Stimmen insgesamt: ' + total, 13, true);
    } else if (solution) {
      const highest = counts.indexOf(Math.max(...counts));
      const lowest = counts.indexOf(Math.min(...counts));
      p.para(40, 389, 'Beispielfrage: Welche Antwort hat die meisten Stimmen? ' + labels[highest] + ' (' + counts[highest] + ').', 515, 13);
      p.para(40, 458, 'Beispielfrage: Wie viele Stimmen hat ' + labels[highest] + ' mehr als ' + labels[lowest] + '? ' + (counts[highest] - counts[lowest]) + ' Stimmen.', 515, 13);
      p.para(40, 527, 'Auch andere Fragen sind möglich. Prüft die Antworten anhand der Tabelle oder des Diagramms.', 515, 13);
    } else {
      p.para(40, 389, (counts ? 'Zähle zuerst die Striche und ergänze die Tabelle.' : 'Übertrage die Striche und Stimmen eurer Umfrage in die Tabelle.') +
        ' Nutze dein Säulendiagramm oder das Diagramm eines Partnerkindes.', 515, 12);
      questionLines(p, 466, '1. Schreibe eine Frage zu den Ergebnissen.');
      questionLines(p, 550, '2. Schreibe eine Frage, bei der man zwei Antworten vergleichen muss.');
      questionLines(p, 634, '3. Tauscht eure Fragen. Schreibe eine Antwort mit Erklärung auf.');
    }
    return p.finish();
  }

  function build(data) {
    if (!data.question.trim() || data.labels.some(label => !label.trim()) ||
        new Set(data.labels.map(label => label.toLocaleLowerCase('de-AT'))).size !== 4) {
      throw Error('Gib eine Frage und vier verschiedene Antworten ein.');
    }
    return {
      worksheets: [0, 1, 2].map(level => render(data, level, false)),
      solutions: data.counts ? [0, 1, 2].map(level => render(data, level, true)) : []
    };
  }

  return {examples, build};
})();
