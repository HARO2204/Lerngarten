const Spiegelbilder = (() => {
  const title = 'Spiegelbilder entdecken';
  const topics = ['Senkrechte Spiegelachsen', 'Senkrechte und waagrechte Spiegelachsen'];
  const sheets = ['Blatt 1 · Mit Hilfe', 'Blatt 2 · Zum Üben', 'Blatt 3 · Zum Knobeln'];
  const ink = '#203d36';
  const axis = '#805a32';
  const edge = 10;
  const middle = edge / 2;
  const house = [[5, 1], [2, 4], [2, 8], [5, 8]];
  const stairs = [[2, 7], [2, 4], [3, 4], [3, 3], [4, 3], [4, 2], [5, 2]];
  const corner = [[5, 2], [2, 4], [3, 7], [5, 8]];
  const reflect = points => points.map(([x, y]) => [edge - x, y]);

  function grid(p, x, y, unit, horizontal = false) {
    for (let i = 0; i <= edge; i++) {
      p.line(x + i * unit, y, x + i * unit, y + edge * unit, '#c9d5c6');
      p.line(x, y + i * unit, x + edge * unit, y + i * unit, '#c9d5c6');
    }
    const point = ([col, row]) => horizontal ? [x + row * unit, y + col * unit] : [x + col * unit, y + row * unit];
    return {
      axis(alternate = false) {
        const ends = alternate ? [[0, middle], [edge, middle]] : [[middle, 0], [middle, edge]];
        p.line(...point(ends[0]), ...point(ends[1]), axis, 1.5, alternate ? '2 3' : '5 3');
      },
      shape(points, color = ink, dots = false) {
        p.path(points.map((pos, i) => (i ? 'L ' : 'M ') + point(pos).join(' ')).join(' '), color, 2);
        if (dots) points.forEach(pos => p.circle(...point(pos), 2.7, color));
      }
    };
  }

  function draw(p, x, y, unit, task, horizontal, solved = false) {
    const g = grid(p, x, y, unit, horizontal);
    g.axis();
    if (task === 'help' && !solved) g.axis(true);
    const points = {help: house, practice: stairs, challenge: corner}[task];
    g.shape(points, ink, task !== 'help');
    if (task === 'help' || solved || task === 'challenge') {
      const right = reflect(points);
      if (task === 'challenge' && !solved) right[1] = [7, 4];
      g.shape(right, solved && task !== 'help' ? '#376a4f' : ink, task !== 'help');
    }
  }

  function build(index) {
    const combined = index === 1;
    const section = n => MathA4.page(title, '2. Klasse · Blatt ' + n + ' · ' + topics[index]);
    const help = section(1);
    help.para(40, 162, 'Falte ein Blatt Papier. Zeichne an der Faltkante ein halbes Herz und schneide es aus. Klappe es auf. Die Faltlinie ist die Spiegelachse.', 515, 13);
    help.para(40, 264, 'Welche gestrichelte Linie teilt die Figur in zwei Spiegelhälften? Zieh sie nach. Prüfe mit einem kleinen Spiegel.', 515, 13, true);
    draw(help, 40, 348, 18, 'help', false);
    draw(help, 318, 348, 18, 'help', combined);
    help.text(40, 581, 'Lege den Spiegel mit seiner Kante auf die Linie.', 13);
    help.para(40, 648, 'Was siehst du im Spiegel, wenn du ihn auf die andere Linie stellst?', 515, 13);
    help.line(40, 697, 555, 697);
    help.line(40, 733, 555, 733);

    const practice = section(2);
    practice.para(40, 162, 'Spiegle die Punkte. Zähle für jeden Punkt die Kästchen bis zur Achse. Geh auf der anderen Seite gleich weit von der Achse weg. Verbinde die Punkte in derselben Reihenfolge.', 515, 13);
    practice.text(40, 260, '1. Ergänze die fehlende Hälfte.', 14, true);
    draw(practice, 54, 286, 20, 'practice', false);
    practice.text(40, 539, '2. Ergänze die fehlende Hälfte.', 14, true);
    const second = grid(practice, 54, 563, 19, combined);
    second.axis();
    second.shape(corner, ink, true);

    const challenge = section(3);
    challenge.para(40, 163, 'Auf der gegenüberliegenden Seite ist ein Punkt falsch. Vergleiche seine Entfernung zur Achse mit dem passenden Punkt auf der ersten Seite.', 515, 13);
    challenge.text(40, 258, '1. Kreise den falschen Punkt ein.', 14, true);
    draw(challenge, 48, 300, 23, 'challenge', combined);
    challenge.para(306, 322, 'Hinweis: Die erste Hälfte liegt ' + (combined ? 'oberhalb' : 'links') + ' der Achse.', 225, 13);
    challenge.para(40, 583, '2. Markiere die richtige Stelle. Verbinde sie mit den Nachbarpunkten.', 515, 13, true);
    challenge.para(40, 645, '3. Erkläre, wie du den Fehler gefunden hast.', 515, 13, true);
    challenge.line(40, 701, 555, 701);
    challenge.line(40, 745, 555, 745);

    const key = MathA4.page(title, '2. Klasse · ' + topics[index], {solution: true});
    key.text(40, 150, 'Blatt 1 · Die richtige Spiegelachse', 14, true);
    draw(key, 48, 174, 10, 'help', false, true);
    draw(key, 193, 174, 10, 'help', combined, true);
    key.para(330, 195, 'Links: senkrecht. Rechts: ' + (combined ? 'waagrecht.' : 'senkrecht.'), 222, 12);
    key.text(40, 322, 'Blatt 2 · Ergänzte Spiegelbilder', 14, true);
    draw(key, 48, 346, 10, 'practice', false, true);
    const solved = grid(key, 193, 346, 10, combined);
    solved.axis();
    solved.shape(corner, ink, true);
    solved.shape(reflect(corner), '#376a4f', true);
    key.text(40, 501, 'Blatt 3 · Fehler verbessert', 14, true);
    draw(key, 48, 525, 13, 'challenge', combined, true);
    key.para(213, 549, 'Der falsche Punkt liegt zwei Kästchen von der Achse entfernt. Sein Partnerpunkt liegt drei Kästchen entfernt. Der Punkt auf der zweiten Hälfte muss also ein Kästchen weiter von der Achse weg.', 335, 13);
    return {
      title: title + ' · ' + topics[index],
      discussion: 'Für den Einstieg brauchst du Papier, eine Schere und einen kleinen Spiegel. Für die Rasteraufgaben reicht ein Bleistift.',
      followUp: {link: './?werkstatt=check&thema=spiegelbilder', resource: '5-Minuten-Lerncheck zu Spiegelbildern öffnen'},
      worksheets: [help.finish(), practice.finish(), challenge.finish()],
      solutions: [key.finish()]
    };
  }

  function check(p, x, y) {
    p.para(x, y + 79, 'Ergänze das Spiegelbild rechts von der gestrichelten Achse.', 225, 12, true);
    draw(p, x + 38, y + 123, 13, 'practice', false);
    p.text(x, y + 277, 'Wie weit ist der unterste Punkt rechts', 11);
    p.text(x, y + 296, 'von der Achse weg? ____ Kästchen', 11);
  }

  return {build, sheets, topics, check};
})();
