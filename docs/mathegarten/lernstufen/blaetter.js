const Lernstufen = (() => {
  const titles = {line: 'Zahlen am Zahlenstrahl', place: 'Zahlen in der Stellenwerttafel'};
  const levels = ['Mit Hilfe', 'Zum Üben', 'Zum Knobeln'];
  const ranges = [20, 50, 100, 1000];
  const ink = '#203d36';

  function numbers(max, seed) {
    let state = seed >>> 0;
    const pick = (min, max) => {
      state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
      return min + Math.floor(state / 4294967296 * (max - min + 1));
    };
    const step = max / 10;
    const anchor = step * pick(2, 4);
    const second = step * pick(6, 8);
    const between = anchor + Math.floor(step / 2);
    const tens = pick(1, Math.min(8, Math.floor(max / 10) - 1));
    const ones = pick(2, 8);
    const hundreds = max === 1000 ? pick(1, 7) * 100 : 0;
    return {max, step, anchor, second, between, common: hundreds + tens * 10 + ones, zero: hundreds + tens * 10, ones};
  }

  function makePage(topic, max, level, answer) {
    const range = 'Zahlenraum 0 bis ' + max;
    const label = range + ' · Blatt ' + (level + 1);
    return MathA4.page(titles[topic], answer ? label + ' · ' + levels[level] : label, {solution: answer});
  }

  function axis(page, d, y, {labels, ticks = 10, from = 0, to = d.max, points = []}) {
    const left = 57;
    const width = 480;
    const x = value => left + (value - from) / (to - from) * width;
    page.line(left, y, left + width, y, ink, 1.4);
    for (let i = 0; i <= ticks; i++) {
      const value = from + i * (to - from) / ticks;
      const xx = x(value);
      page.line(xx, y - 6, xx, y + 6, ink, 1);
      if (labels === 'all' || i === 0 || i === ticks) page.text(xx, y + 27, value, 12, false, ink, 'middle');
    }
    for (const [value, label] of points) {
      page.circle(x(value), y, 4.5);
      page.text(x(value), y - 17, label, 13, true, ink, 'middle');
    }
  }

  function rule(page, y, text, answer) {
    page.text(40, y, text, 13, true);
    if (answer) page.para(40, y + 30, answer, 510, 12);
    else {
      page.line(40, y + 38, 555, y + 38);
      page.line(40, y + 73, 555, y + 73);
    }
  }

  function linePage(d, level, answer) {
    const p = makePage('line', d.max, level, answer);
    const labels = level === 0 ? 'all' : 'ends';
    p.para(40, 164, level === 0
      ? 'Die Zahlen unter den Strichen helfen dir. Markiere Zahlen mit einem Punkt.'
      : 'Gleich große Abstände bedeuten gleich große Zahlenschritte.', 515, 13);

    p.text(40, 219, '1. Lies die Zahl am Punkt A ab.', 14, true);
    axis(p, d, 275, {labels, points: [[d.anchor, 'A']]});
    p.text(40, 329, 'A = ' + (answer ? d.anchor : '________________'), 15);

    if (level === 2) {
      const from = d.second - 2 * d.step;
      const to = d.second + 2 * d.step;
      p.text(40, 390, '2. Welche Zahl liegt genau in der Mitte?', 14, true);
      axis(p, d, 453, {labels, ticks: 4, from, to, points: answer ? [[d.second, d.second]] : []});
      p.text(40, 509, 'Mitte = ' + (answer ? d.second : '________________'), 15);
      rule(p, 597, '3. Erkläre, wie du die Mitte gefunden hast.', answer
        ? 'Beispiel: Zwischen ' + from + ' und ' + to + ' liegen ' + (to - from) + '. Die Hälfte davon ist ' + (to - from) / 2 + '. Ich rechne ' + from + ' + ' + (to - from) / 2 + ' = ' + d.second + '.'
        : '');
    } else {
      const targets = level === 0 ? [d.anchor, d.second] : [d.between, d.second];
      p.text(40, 390, '2. Markiere ' + targets.join(' und ') + ' mit je einem Punkt.', 14, true);
      axis(p, d, 453, {labels, points: answer ? targets.map(n => [n, n]) : []});
      if (level === 0) {
        p.text(40, 573, '3. Welche Zahl steht einen Strich rechts von ' + d.anchor + '?', 14, true);
        p.text(40, 621, answer ? d.anchor + d.step : '________________', 15);
      } else {
        const from = d.anchor;
        const to = d.anchor + d.step;
        p.text(40, 573, '3. Welche Zahl ist größer? Kreise sie ein.', 14, true);
        p.text(40, 621, from + '      ' + to + (answer ? '      →      ' + to + ' ist größer.' : ''), 16);
      }
    }
    return p.finish();
  }

  function table(p, d, rows) {
    const columns = NumberWorkshop.columns(d.max);
    const width = 515 / (columns.length + 1);
    const headings = ['Zahl', ...columns.map(c => c.name + ' (' + c.key + ')')];
    [headings, ...rows].forEach((row, r) => {
      row.forEach((value, c) => {
        const x = 40 + c * width;
        const y = 224 + r * 51;
        p.rect(x, y, width, 51, r === 0 ? '#edf2e5' : 'white');
        p.text(x + width / 2, y + 32, value, r === 0 ? 11.5 : 17, r === 0, ink, 'middle');
      });
    });
  }

  function placePage(d, level, answer) {
    const p = makePage('place', d.max, level, answer);
    const digit = n => NumberWorkshop.digits(n, d.max);
    const columns = NumberWorkshop.columns(d.max);
    const row = (n, shown) => [shown ? n : '', ...digit(n).map((value, i) =>
      answer || (!shown && (level !== 2 || i < columns.length - 1)) || (level === 0 && shown && i === columns.length - 2) ? value : '')];
    const example = d.max === 1000 ? 134 : 12;
    p.para(40, 160, level === 0
      ? 'Eine Stelle pro Spalte. Das erste Beispiel zeigt dir, wie es geht.'
      : 'Ergänze die leeren Felder. Achte auf die Nullen.' + (level === 2 ? ' Die letzte Zahl ist um 1 größer als die Zahl darüber.' : ''), 515, 13);
    const second = d.zero;
    const last = d.zero + 1;
    const rows = level === 0 ? [[example, ...digit(example)]] : [];
    rows.push(row(d.common, true), row(second, true));
    const lastRow = row(last, false);
    if (answer) lastRow[0] = last;
    rows.push(lastRow);
    table(p, d, rows);

    if (level === 0) {
      p.para(40, 518, '1. Trage die Ziffern ein. Lies dann die Zahl in der letzten Zeile ab.', 515, 13, true);
      rule(p, 574, '2. Welche Ziffer steht bei ' + d.common + ' in der Einerspalte?', answer ? 'Es sind ' + d.ones + ' Einer.' : '');
    } else if (level === 1) {
      p.para(40, 475, '1. Zerlege ' + d.common + ' in Stellenwerte.', 515, 13, true);
      const expression = digit(d.common).map((n, i) => (answer ? n : '___') + ' ' + columns[i].key).join(' + ');
      p.text(40, 522, d.common + ' = ' + expression, 16);
      rule(p, 593, '2. Warum steht bei ' + d.zero + ' eine 0 in der Einerspalte?', answer ? 'Die Zahl hat keine losen Einer. Die 0 hält die Einerstelle frei.' : '');
    } else {
      const take = d.common + 10 > d.max;
      const newNumber = d.common + (take ? -10 : 10);
      const change = take ? 'Nimm einen Zehner weg.' : 'Füge einen Zehner hinzu.';
      p.para(40, 475, '1. Verändere ' + d.common + '. ' + change + ' Die Einer bleiben gleich.', 515, 13, true);
      p.text(40, 523, 'Neue Zahl = ' + (answer ? newNumber : '________________'), 16);
      const extra = d.max <= 50 ? d.zero : d.max;
      rule(p, 593, '2. Erkläre mit der Tafel, warum ' + extra + ' und ' + (extra / 10) + ' verschiedene Zahlen sind.', answer
        ? 'Bei ' + extra + ' steht die Ziffer ' + String(extra)[0] + ' eine Spalte weiter links als bei ' + (extra / 10) + '. Ihr Wert ist dadurch zehnmal so groß.'
        : '');
    }
    return p.finish();
  }

  function build(topic, max, seed) {
    if (!Object.hasOwn(titles, topic) || !ranges.includes(max)) throw Error('Bitte Thema und Zahlenraum prüfen.');
    const d = numbers(max, seed);
    const render = topic === 'line' ? linePage : placePage;
    return {
      title: titles[topic] + ' · bis ' + max,
      discussion: topic === 'line'
        ? 'Gemeinsamer Einstieg: Zeig Punkt A am Zahlenstrahl. Welche Zahl ist es? Gemeinsamer Abschluss: Lasst euch unterschiedliche Wege zu ' + d.anchor + ' erklären.'
        : 'Gemeinsamer Einstieg: Zerlegt ' + d.common + ' an der Tafel. Gemeinsamer Abschluss: Besprecht, warum ' + d.zero + ' eine 0 bei den Einern braucht.',
      worksheets: levels.map((_, level) => render(d, level, false)),
      solutions: levels.map((_, level) => render(d, level, true))
    };
  }

  return {build};
})();
