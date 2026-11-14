const Wetterwoche = (() => {
  const weather = [['Sonnig', 'sunny'], ['Bewölkt', 'cloudy'], ['Regen', 'rainy'], ['Schnee', 'snowy']];
  const days = ['Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag'];
  const exampleDays = [0, 1, 2, 0, 1];
  const counts = weather.map((_, i) => exampleDays.filter(day => day === i).length);
  const ink = '#203d36';

  function page(title, kicker, names = true) {
    return MathA4.page(title, 'Wetterwoche · 2. Klasse', {kicker: kicker + ' · A4', names});
  }

  function observe() {
    const p = page('Unser Wetter am Morgen', 'SACHUNTERRICHT');
    p.para(40, 164, 'Kreuze jeden Morgen genau ein Feld an. Wenn es regnet oder schneit, wähle den Niederschlag. Sonst entscheide zwischen sonnig und bewölkt. Ist schulfrei, lass die Zeile leer.', 515, 13);
    p.text(40, 234, 'Woche vom ________________ bis ________________', 13, true);
    const columns = ['Wochentag', ...weather.map(([name]) => name)];
    const widths = [131, 96, 96, 96, 96];
    let x = 40;
    columns.forEach((name, col) => {
      const w = widths[col];
      p.rect(x, 267, w, 41, '#eaf2e3');
      p.text(x + w / 2, 293, name, 12, true, ink, 'middle');
      days.forEach((day, i) => {
        const y = 308 + i * 63;
        p.rect(x, y, w, 63, 'white');
        if (col === 0) p.text(x + 12, y + 37, day, 13);
        else p.rect(x + w / 2 - 8, y + 23, 16, 16, 'white', ink);
      });
      x += w;
    });
    p.para(40, 677, 'Sprecht zu zweit: What’s the weather like today?', 515, 14, true);
    p.para(40, 721, 'Am Freitag zählst du deine Kreuze und überträgst sie in die Strichliste.', 515, 13);
    return p.finish();
  }

  function chart(example = false) {
    const p = page(example ? 'Beispielauswertung' : 'Strichliste und Säulendiagramm', 'MATHEGARTEN');
    p.para(40, 163, example
      ? 'Beispielwoche: ' + exampleDays.map((day, i) => days[i] + ' ' + weather[day][0].toLowerCase()).join(', ') + '.'
      : '1. Trage für jedes Wetter einen Strich pro beobachtetem Tag ein. Zähle die Striche und schreibe die Anzahl dazu.', 515, 13);
    p.text(50, 237, 'Wetter', 12, true);
    p.text(239, 237, 'Strichliste', 12, true);
    p.text(445, 237, 'Tage', 12, true);
    weather.forEach(([name], i) => {
      const y = 251 + i * 35;
      p.rect(40, y, 515, 35, 'white');
      for (const x of [217, 421]) p.line(x, y, x, y + 35);
      p.text(50, y + 22, name, 13);
      if (example) {
        for (let mark = 0; mark < counts[i]; mark++) p.line(245 + mark * 9, y + 8, 245 + mark * 9, y + 25, ink, 1.4);
        p.text(453, y + 23, counts[i], 13);
      }
    });
    p.text(40, 423, '2. Male die Säulen bis zur passenden Anzahl an Tagen aus.', 13, true);
    const base = 644;
    for (let n = 0; n <= 5; n++) {
      const y = base - n * 37;
      p.line(75, y, 553, y, n === 0 ? ink : '#a9b6a2');
      p.text(62, y + 4, n, 11, false, ink, 'end');
    }
    p.line(75, base - 185, 75, base, ink);
    p.text(80, 451, 'Tage', 10, true);
    weather.forEach(([name], i) => {
      const x = 134 + i * 120;
      if (example && counts[i]) p.rect(x - 27, base - counts[i] * 37, 54, counts[i] * 37, '#a7cfdb', ink);
      for (const edge of [x - 27, x + 27]) p.line(edge, base - 185, edge, base);
      p.text(x, base + 24, name, 12, true, ink, 'middle');
    });
    p.para(40, 713, example ? 'Am häufigsten war es sonnig und bewölkt. Beides kam an zwei Tagen vor.'
      : '3. Welches Wetter kam am häufigsten vor? Bei Gleichstand nenne alle passenden Antworten.', 515, 13, true);
    if (!example) p.line(40, 767, 555, 767);
    return p.finish();
  }

  function english() {
    const p = page('What’s the weather like today?', 'ENGLISCHGARTEN', false);
    p.para(40, 155, 'Seht aus dem Fenster. Kind A fragt nach dem Wetter. Kind B antwortet mit dem passenden Wort. Dann tauscht ihr.', 515, 14);
    [['Kind A · fragen', 'What’s the weather like today?'], ['Kind B · antworten', 'It’s sunny.']].forEach(([label, phrase], i) => {
      const y = 244 + i * 109;
      p.rect(40, y, 515, 91, '#edf3e6', '#9caf91', 7);
      p.text(56, y + 29, label, 12, true);
      p.text(56, y + 62, phrase, 18, true);
    });
    p.text(40, 501, 'Wortkarten zum Ausschneiden', 15, true);
    weather.forEach(([de, en], i) => {
      const x = 40 + i % 2 * 263;
      const y = 532 + Math.floor(i / 2) * 101;
      p.rect(x, y, 250, 84, 'white', '#9caf91', 6);
      p.text(x + 15, y + 33, 'It’s ' + en + '.', 16, true);
      p.text(x + 15, y + 60, de, 12);
    });
    return p.finish();
  }

  return {pages: () => [observe(), chart(), english(), chart(true)]};
})();
