const Obstladen = (() => {
  const title = 'At the fruit shop';
  const quantities = ['zero', 'one', 'two', 'three'];
  const orders = [[1, 2], [0, 1], [2, 2], [4, 3], [5, 1], [3, 2]];
  const item = ([index, count]) => quantities[count] + ' ' + Obstsalat.fruit[index][count === 1 ? 0 : 1];
  const request = order => 'Can I have ' + item(order) + ', please?';
  const dialogue = order => [request(order), 'Here you are.', 'Thank you!'];
  const page = (subtitle, options) => MathA4.page(title, 'Englisch · 2. Klasse · ' + subtitle, {kicker: 'ENGLISCHGARTEN · A4', ...options});

  function orderCards() {
    const p = page('Einkaufskarten zum Ausschneiden', {names: false});
    p.para(40, 154, 'Zieh eine Karte. Zeige sie erst nach dem Einkauf zum Vergleichen.', 515, 13);
    orders.forEach((order, i) => {
      const x = 40 + i % 2 * 262;
      const y = 207 + Math.floor(i / 2) * 170;
      p.rect(x, y, 253, 146, '#f2f6eb', '#8ea584', 7);
      p.text(x + 15, y + 33, 'Einkauf ' + (i + 1), 13, true);
      p.para(x + 15, y + 76, item(order), 220, 17);
      p.para(x + 15, y + 116, Obstsalat.fruit[order[0]][2] + ' · ' + order[1] + ' Stück', 220, 12);
    });
    return p.finish();
  }

  function roles() {
    const p = page('Rollenkarten zum Ausschneiden', {names: false});
    const roles = [
      {title: 'Customer · einkaufen', steps: ['Zieh eine Einkaufskarte und bestelle das Obst.', 'Prüfe die Menge und die Obstsorte. Passt alles? Bedanke dich. Sonst wiederhole deine Bestellung.'],
        lines: [request(orders[0]), 'Thank you!']},
      {title: 'Shopkeeper · verkaufen', steps: ['Hör gut zu und leg die passenden Obstkarten auf den Tisch.', 'Vergleicht mit der Einkaufskarte. Tauscht nach dem Gespräch die Rollen.'],
        lines: ['Here you are.']}
    ];
    roles.forEach(({title, steps, lines}, index) => {
      const y = 131 + index * 306;
      p.rect(40, y, 515, 279, '#f2f6eb', '#8ea584', 7);
      p.text(58, y + 34, title, 18, true);
      p.para(58, y + 78, steps[0], 477, 13);
      lines.forEach((line, i) => p.text(58, y + 129 + i * 37, line, 17, true));
      p.para(58, y + 216, steps[1], 477, 13);
    });
    return p.finish();
  }

  function practice() {
    const p = page('Bestellung prüfen');
    p.text(40, 159, '1. Listen to the order.', 16, true);
    p.para(40, 190, 'Hör auf der Webseite die Knobelbestellung oder lass sie vorlesen. Schreib auf, was bestellt wurde.', 515, 13);
    p.text(40, 267, 'Bestellt: ______________________________________', 14);
    p.text(40, 339, '2. Check the order.', 16, true);
    p.para(40, 370, 'Der Laden legt nur einen Apfel auf den Tisch. Stimmt das? Wenn etwas fehlt oder falsch ist, wiederhole die Bestellung höflich.', 515, 13);
    p.rect(40, 442, 203, 82, '#f2f6eb', '#8ea584', 7);
    p.text(58, 491, 'Auf dem Tisch: 1 Apfel', 15, true);
    p.text(40, 578, 'Das sage ich:', 14, true);
    p.line(40, 636, 555, 636);
    p.line(40, 685, 555, 685);
    p.text(40, 745, 'Satzhilfe: Can I have ___ ___, please?', 13);
    return p.finish();
  }

  function solution() {
    const p = page('Vorleseliste und Lösungen', {solution: true});
    orders.slice(0, 2).forEach((order, index) => {
      const y = 151 + index * 164;
      p.text(40, y, 'Hördialog ' + (index + 1), 16, true);
      dialogue(order).forEach((line, i) => p.text(40, y + 33 + i * 28, (i === 1 ? 'Shopkeeper: ' : 'Customer: ') + line, 13));
    });
    p.text(40, 506, 'Knobelbestellung zum Vorlesen', 16, true);
    p.text(40, 543, request(orders[2]), 14, true);
    p.para(40, 589, 'Bestellt wurden zwei Birnen. Der Apfel passt nicht. Das Kind wiederholt: „' + request(orders[2]) + '“', 515, 13);
    p.para(40, 672, 'Beim Rollenspiel stimmen Menge und Obstsorte mit der gezogenen Karte überein. Danach können die Kinder eigene Bestellungen erfinden.', 515, 13);
    return p.finish();
  }

  return {title, orders, dialogue, request, build: () => ({
    title, area: 'Englischgarten', worksheets: [orderCards(), roles(), practice()], solutions: [solution()]
  })};
})();
