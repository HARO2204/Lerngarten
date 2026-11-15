const Obst = (() => {
  const title = 'My favourite fruit';
  const fruit = [
    {en: 'apple', de: 'Apfel', plural: 'apples'},
    {en: 'banana', de: 'Banane', plural: 'bananas'},
    {en: 'pear', de: 'Birne', plural: 'pears'},
    {en: 'grapes', de: 'Trauben', plural: 'grapes'},
    {en: 'strawberry', de: 'Erdbeere', plural: 'strawberries'},
    {en: 'orange', de: 'Orange', plural: 'oranges'}
  ];
  const order = [2, 0, 5, 1, 3, 4];
  const question = item => 'Do you like ' + item.plural + '?';
  const page = (subtitle, options) => MathA4.page(title, 'Englisch · 2. Klasse · ' + subtitle, {kicker: 'ENGLISCHGARTEN · A4', ...options});

  function worksheet(solution) {
    const p = page('Match and ask', {solution});
    p.text(40, 156, '1. Match the words.', 16, true);
    p.para(40, 183, 'Schreibe den passenden Buchstaben zum englischen Wort.', 515, 13);
    fruit.forEach((item, index) => {
      const y = 226 + index * 39;
      p.text(40, y, (index + 1) + '. ' + item.en, 15);
      p.text(236, y, solution ? String.fromCharCode(65 + order.indexOf(index)) : '____', 15);
      p.text(341, y, String.fromCharCode(65 + index) + ' · ' + fruit[order[index]].de, 15);
    });
    p.text(40, 488, '2. Ask a partner.', 16, true);
    p.para(40, 517, solution
      ? 'Beispieldialog: „Do you like apples?“ – „Yes, I do.“ Oder: „No, I don’t.“ Welche Antwort passt, entscheidet das Partnerkind.'
      : 'Frage dein Partnerkind nach zwei Obstsorten. Kreuze seine Antwort an. Wechselt dann die Rollen.', 515, 13);
    ['apples', 'bananas'].forEach((word, index) => {
      const y = 594 + index * 67;
      p.text(40, y, 'Do you like ' + word + '?', 15);
      p.rect(305, y - 13, 13, 13, 'white');
      p.text(326, y, 'Yes', 13);
      p.rect(417, y - 13, 13, 13, 'white');
      p.text(438, y, 'No', 13);
    });
    return p.finish();
  }

  function cards() {
    const p = page('Wort- und Rollenkarten zum Ausschneiden', {names: false});
    fruit.forEach((item, index) => {
      const x = 40 + (index % 3) * 173;
      const y = 143 + Math.floor(index / 3) * 115;
      p.rect(x, y, 164, 102, '#f1f5e9', '#9caf91', 6);
      p.text(x + 12, y + 39, item.en, 16, true);
      p.text(x + 12, y + 71, item.de, 13);
    });
    [
      ['Kind A · Ask', 'Do you like apples?', 'Do you like pears?'],
      ['Kind B · Answer', 'Yes, I do.', 'No, I don’t.']
    ].forEach(([label, first, second], index) => {
      const x = 40 + index * 261;
      p.rect(x, 409, 253, 217, '#f1f5e9', '#9caf91', 6);
      p.text(x + 14, 449, label, 16, true);
      p.text(x + 14, 502, first, 15);
      p.text(x + 14, 551, second, 15);
    });
    p.para(40, 691, 'Wählt ein anderes Obst und spielt den Dialog noch einmal. Beim Fragen verwendet ihr die Mehrzahl: apples, bananas, pears, grapes, strawberries oder oranges.', 515, 13);
    return p.finish();
  }

  return {title, fruit, question, build: () => ({title, area: 'Englischgarten', worksheets: [worksheet(false), cards()], solutions: [worksheet(true)]})};
})();
