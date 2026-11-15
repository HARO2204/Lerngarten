const Rasterwege = (() => {
  const title = 'Wege auf dem Raster';
  const ink = '#203d36';
  const directions = {
    rechts: [1, 0, '→'],
    links: [-1, 0, '←'],
    oben: [0, -1, '↑'],
    unten: [0, 1, '↓']
  };
  const places = [
    {at: [1, 4], letter: 'T', name: 'Gartentor'},
    {at: [5, 1], letter: 'B', name: 'Beet'},
    {at: [3, 3], letter: 'G', name: 'Gießkanne'},
    {at: [6, 4], letter: 'A', name: 'Apfelbaum'}
  ];
  const from = places[0].at;
  const clues = [[[2, 'rechts'], [1, 'oben']], [[5, 'rechts']]];
  const samples = [
    [[4, 'rechts'], [3, 'oben']],
    [[3, 'oben'], [4, 'rechts']],
    [[1, 'unten'], [4, 'rechts'], [4, 'oben']]
  ];

  function points(start, steps) {
    let [x, y] = start;
    return [start, ...steps.map(([count, direction]) => {
      const [dx, dy] = directions[direction];
      x += dx * count;
      y += dy * count;
      return [x, y];
    })];
  }

  function words(steps) {
    return steps.map(([count, direction]) => count + ' nach ' + direction).join(', ');
  }

  function map(p, x, y, cell, width, height, locations, route = []) {
    const center = ([col, row]) => [x + (col + .5) * cell, y + (row + .5) * cell];
    p.rect(x, y, width * cell, height * cell, '#f6f8f0');
    for (let col = 1; col < width; col++) p.line(x + col * cell, y, x + col * cell, y + height * cell, '#9cac95');
    for (let row = 1; row < height; row++) p.line(x, y + row * cell, x + width * cell, y + row * cell, '#9cac95');
    if (route.length) {
      const path = route.map((point, i) => (i ? 'L ' : 'M ') + center(point).join(' ')).join(' ');
      p.path(path, '#487a60', 3);
    }
    for (const {at, letter} of locations) {
      const [cx, cy] = center(at);
      p.circle(cx, cy, cell * .29, '#dce8d1');
      p.text(cx, cy + cell * .13, letter, cell * .42, true, ink, 'middle');
    }
  }

  function legend(p, y) {
    p.text(40, y, places.map(({letter, name}) => letter + ' = ' + name).join('    ·    '), 12);
  }

  function lines(p, start, count) {
    for (let i = 0; i < count; i++) p.line(40, start + i * 37, 555, start + i * 37);
  }

  function build() {
    const page = number => MathA4.page(title, '2. Klasse · Blatt ' + number);
    const help = page(1);
    help.para(40, 161, 'Starte beim Gartentor (T). Ein Schritt führt in ein Nachbarkästchen. Zeichne die Wege von der Mitte eines Kästchens zur nächsten. Starte für jede Pfeilspur wieder bei T.', 515, 13);
    map(help, 105, 225, 53, 8, 6, places);
    legend(help, 572);
    clues.forEach((steps, i) => {
      const y = 628 + i * 65;
      help.text(40, y, (i + 1) + '. ' + steps.map(([count, direction]) => count + directions[direction]).join('    '), 17, true);
      help.text(211, y, 'Ich lande bei ____________________.', 14);
      help.text(40, y + 24, words(steps), 12);
    });

    const practice = page(2);
    practice.para(40, 161, 'Zeichne einen Weg vom Gartentor zum Beet. Gehe nur nach rechts, links, oben oder unten. Jede Bewegung in ein Nachbarkästchen zählt als ein Schritt.', 515, 13);
    practice.text(40, 249, 'Dein Weg', 14, true);
    practice.text(312, 249, 'Für dein Partnerkind', 14, true);
    map(practice, 40, 270, 29, 8, 6, places);
    map(practice, 312, 270, 29, 8, 6, places);
    legend(practice, 484);
    practice.para(40, 615, 'Beschreibe deinen Weg mit Zahlen und Richtungen. Decke dein Raster ab. Lies deinen Weg vor und lass dein Partnerkind auf dem zweiten Raster zeichnen.', 515, 13, true);
    lines(practice, 692, 2);

    const challenge = page(3);
    challenge.para(40, 161, 'Zeichne zwei verschiedene Wege vom Tor zum Beet. Nutze für jeden Weg ein eigenes Raster. Schreibe die Anzahl der Schritte darunter.', 515, 13);
    for (let i = 0; i < 2; i++) {
      const x = 40 + i * 269;
      challenge.text(x, 224, 'Weg ' + (i + 1), 14, true);
      map(challenge, x, 249, 30, 8, 6, places.slice(0, 2));
      challenge.text(x, 463, 'Schritte: ______', 13);
    }
    challenge.para(40, 528, 'Welcher deiner Wege ist kürzer? Wenn beide gleich lang sind, schreibe das auf. Gibt es mehrere gleich kurze Wege, die so kurz wie möglich sind?', 515, 13, true);
    challenge.para(40, 620, 'Wie viele Schritte braucht der kürzeste Weg? Erkläre mit der Lage von Tor und Beet, warum es nicht kürzer geht.', 515, 13);
    lines(challenge, 700, 2);

    const key = MathA4.page(title, '2. Klasse · Für die Lehrkraft', {solution: true});
    key.text(40, 150, 'Blatt 1 · Ziele der Pfeilspuren', 15, true);
    clues.forEach((steps, i) => {
      const route = points(from, steps);
      const target = places.find(({at}) => at.every((value, j) => value === route.at(-1)[j]));
      key.text(40, 182 + i * 28, (i + 1) + '. ' + words(steps) + ' → ' + target.name + ' (' + target.letter + ').', 13);
    });
    key.text(40, 268, 'Blatt 2 · Ein möglicher Weg', 15, true);
    key.text(40, 297, words(samples[0]) + '. Andere Wege sind möglich.', 13);
    map(key, 40, 318, 18, 8, 6, places.slice(0, 2), points(from, samples[0]));
    key.text(40, 476, 'Blatt 3 · Wege vergleichen', 15, true);
    samples.forEach((steps, i) => {
      const count = steps.reduce((sum, [length]) => sum + length, 0);
      key.text(40, 510 + i * 32, 'Beispiel ' + (i + 1) + ': ' + words(steps) + ' → ' + count + ' Schritte.', 13);
    });
    key.para(40, 636, 'Sieben Schritte sind das Minimum: Das Beet liegt vier Kästchen rechts und drei oberhalb des Tors. Die Schritte nach rechts und nach oben können in verschiedener Reihenfolge kommen. Die ersten beiden Beispiele sind gleich kurz.', 515, 13);
    return {
      title,
      discussion: 'Einstieg am Bodenraster: Lege ein Raster mit Start und Ziel. Ein Kind sagt den Weg aus Sicht aller Kinder vor, ein anderes geht ihn Schritt für Schritt. Auf dem Blatt gehst du immer von Kästchenmitte zu Kästchenmitte.',
      followUp: {link: './?werkstatt=check&thema=rasterwege', resource: '5-Minuten-Lerncheck zu Rasterwegen öffnen'},
      worksheets: [help.finish(), practice.finish(), challenge.finish()],
      solutions: [key.finish()]
    };
  }

  function check(p, x, y) {
    p.para(x, y + 80, 'Starte bei S. Zeichne 2 Schritte nach rechts und 1 nach oben.', 225, 12, true);
    map(p, x + 48, y + 127, 24, 5, 4, [
      {at: [1, 2], letter: 'S'},
      {at: [3, 1], letter: 'A'},
      {at: [3, 3], letter: 'B'}
    ]);
    p.text(x, y + 259, 'Ich lande bei ______.', 12);
    p.text(x, y + 290, 'Mein Weg hat ______ Schritte.', 12);
  }

  return {build, check};
})();
