const Obstsalat = (() => {
  const title = 'Let’s make a fruit salad!';
  const fruit = [
    ['apple', 'apples', 'Apfel'],
    ['banana', 'bananas', 'Banane'],
    ['pear', 'pears', 'Birne'],
    ['bunch of grapes', 'bunches of grapes', 'Traubenrispe'],
    ['strawberry', 'strawberries', 'Erdbeere'],
    ['orange', 'oranges', 'Orange']
  ];
  const numbers = ['zero', 'one', 'two', 'three'];
  const recipes = [
    [[1, 2], [0, 1], [4, 3]],
    [[2, 1], [5, 3], [3, 2]]
  ];
  const phrase = ([index, count]) => 'Put ' + numbers[count] + ' ' + fruit[index][count === 1 ? 0 : 1] + ' in the bowl.';
  const page = (label, options) => MathA4.page(title, 'Englisch · 2. Klasse · ' + label, {kicker: 'ENGLISCHGARTEN · A4', ...options});

  // Small, labelled drawings remain readable in greyscale.
  const art = [
    ['M 25 13 C 9 3 3 20 10 34 C 15 44 21 44 25 41 C 32 44 37 41 42 32 C 49 18 41 6 25 13 Z', '#e7a39a'],
    ['M 7 14 Q 22 34 42 16 L 44 8 L 49 10 Q 47 35 28 40 Q 13 44 4 22 Z', '#f4d475'],
    ['M 22 10 C 15 12 18 24 11 29 C 0 43 20 48 28 44 C 43 45 48 35 36 24 C 31 19 34 10 22 10 Z', '#cddc85'],
    ['M 25 9 C 20 3 14 4 12 8 M 25 9 L 31 3', '#d3b5dd'],
    ['M 7 15 Q 13 6 25 12 Q 40 7 44 17 Q 42 31 25 45 Q 9 33 7 15 Z', '#e7a39a'],
    ['M 25 10 C 4 10 2 35 17 43 C 35 51 48 35 44 23 C 43 14 34 10 25 10 Z', '#f7c58e']
  ];

  function icon(p, index, x, y) {
    const [path, color] = art[index];
    if (index === 3) {
      for (const [dx, dy] of [[15, 16], [30, 16], [10, 27], [24, 27], [37, 27], [16, 37], [31, 37], [23, 45]]) {
        p.circle(x + dx, y + dy, 8, '#6c5276');
        p.circle(x + dx, y + dy, 6.8, color);
      }
    }
    const translated = path.replace(/(-?\d+) (-?\d+)/g, (_, dx, dy) => (x + Number(dx)) + ' ' + (y + Number(dy)));
    p.path(translated, '#6f503b', 1.1, index === 3 ? 'none' : color);
  }

  function bowl() {
    const p = page('Rezeptmatte', {names: false});
    p.para(40, 150, 'Hör gut zu. Lege für jede Obstsorte so viele Karten in die Schüssel, wie du hörst.', 515, 14);
    p.path('M 44 251 H 551 Q 539 666 480 729 H 115 Q 56 666 44 251 Z', '#9caf91', 2, '#f6f8ef');
    p.line(44, 251, 551, 251, '#54765c', 3);
    p.text(298, 216, 'The bowl', 18, true, '#274638', 'middle');
    return p.finish();
  }

  function cards() {
    const p = page('18 Obstkarten zum Ausschneiden', {names: false});
    fruit.forEach(([en, , de], index) => {
      for (let copy = 0; copy < 3; copy++) {
        const x = 40 + copy * 173;
        const y = 126 + index * 106;
        p.rect(x, y, 164, 96, 'white', '#82977b', 5);
        icon(p, index, x + 56, y + 4);
        p.text(x + 82, y + 70, en, 13, true, '#274638', 'middle');
        p.text(x + 82, y + 86, de, 9, false, '#274638', 'middle');
      }
    });
    return p.finish();
  }

  function activity() {
    const p = page('Partnerrezept und Knobelaufgabe');
    p.text(40, 162, '1. Make up a recipe.', 16, true);
    p.para(40, 191, 'Wähle drei verschiedene Obstsorten und je eine Menge von eins bis drei. Schreibe dein Rezept auf. Lies es vor. Dein Partnerkind legt die Karten. Vergleicht und tauscht die Rollen.', 515, 13);
    p.text(40, 274, 'Satzhilfe: Put ___ ___ in the bowl.', 14, true);
    p.text(40, 303, 'one · two · three', 13);
    p.para(40, 331, 'apple / apples · banana / bananas · pear / pears · bunch of grapes / bunches of grapes · strawberry / strawberries · orange / oranges', 515, 11);
    for (const y of [396, 433, 470]) p.line(40, y, 555, y);
    p.text(40, 516, '2. Find the mistake.', 16, true);
    p.para(40, 545, 'Hör auf der Webseite den Knobelsatz an oder lass ihn vorlesen. Was ist zu viel? Streiche eine Karte durch und erkläre deine Korrektur.', 515, 13);
    for (let i = 0; i < 2; i++) {
      const x = 40 + i * 130;
      p.rect(x, 608, 119, 83, 'white');
      icon(p, 0, x + 34, 614);
      p.text(x + 60, 676, 'apple', 12, true, '#274638', 'middle');
    }
    p.line(40, 742, 555, 742);
    return p.finish();
  }

  function key() {
    const p = page('Vorleseliste und Lösungen', {solution: true});
    recipes.forEach((recipe, index) => {
      const top = 157 + index * 184;
      p.text(40, top, 'Rezept ' + (index + 1), 16, true);
      recipe.forEach((step, i) => {
        const [which, count] = step;
        p.text(40, top + 34 + i * 32, (i + 1) + '. ' + phrase(step), 13);
        p.text(435, top + 34 + i * 32, count + ' × ' + fruit[which][2], 12);
      });
    });
    p.text(40, 523, 'Partnerrezept', 16, true);
    p.para(40, 551, 'Beide Kinder vergleichen die ausgesprochene Menge und Obstsorte mit den gelegten Karten. Rezepte können verschieden sein.', 515, 13);
    p.text(40, 628, 'Knobelaufgabe', 16, true);
    p.para(40, 659, phrase(recipes[0][1]) + ' Auf dem Blatt sind zwei Äpfel. Ein Apfel ist zu viel. Mögliche Korrektur: Take one apple out.', 515, 13);
    return p.finish();
  }

  return {title, fruit, recipes, phrase, build: () => ({
    title, area: 'Englischgarten', worksheets: [bowl(), cards(), activity()], solutions: [key()]
  })};
})();
