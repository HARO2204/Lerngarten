const LinealWerkstatt = (() => {
  const title = 'Forschen mit dem Lineal';
  const cm = 72 / 2.54;
  const ink = '#203d36';
  const examples = [3, 5];
  const stretches = [4, 7];
  const objects = [
    ['Bleistift', 'Miss vom Ende bis zur Spitze.'],
    ['Radiergummi', 'Miss die längste Seite.'],
    ['Heft', 'Miss die lange Kante am Heftrand.'],
    ['Klebestift', 'Miss vom Boden bis zur Oberkante des Deckels.']
  ];
  const names = {children: 'Kinderblaetter', solutions: 'Loesungsblatt', cards: 'Messkarten'};

  function page(label, options) {
    return MathA4.page(title, '2. Klasse · ' + label, options);
  }

  function segment(p, x, y, length) {
    const end = x + length * cm;
    p.line(x, y, end, y, ink, 2);
    for (const tick of [x, end]) p.line(tick, y - 5, tick, y + 5, ink, 1.3);
  }

  function ruler(p, x, y, start, length) {
    p.rect(x - 11, y, 7 * cm + 22, 37, '#f8edc9', '#ae925c', 4);
    for (let mark = 0; mark <= 70; mark++) {
      const whole = mark % 10 === 0;
      const xx = x + mark * cm / 10;
      p.line(xx, y, xx, y + (whole ? 15 : mark % 5 === 0 ? 10 : 6), '#6b5630', whole ? 1.2 : .6);
      if (whole) p.text(xx, y + 30, mark / 10, 11, true, ink, 'middle');
    }
    p.text(x + 7 * cm + 22, y + 29, 'cm', 10);
    segment(p, x + start * cm, y - 10, length);
  }

  function help() {
    const p = page('Blatt 1');
    p.para(40, 161, 'Lege die Null an den Anfang der Strecke. Lies am anderen Ende die Länge in Zentimetern (cm) ab.', 515, 13);
    p.para(40, 224, '1. Wo liegt die Null am Anfang der Strecke? Kreuze das richtige Bild an.', 515, 13, true);
    [1, 0].forEach((start, i) => {
      const x = 63 + i * 262;
      p.rect(x - 8, 253, 12, 12);
      p.text(x + 13, 264, 'Bild ' + (i + 1), 12);
      ruler(p, x, 300, start, examples[0]);
    });
    p.para(40, 389, '2. Lies die Länge der Strecke ab.', 515, 13, true);
    ruler(p, 63, 431, 0, examples[1]);
    p.text(337, 453, 'Länge: ______ cm', 13);
    p.para(40, 509, '3. Miss beide Strecken mit deinem Lineal.', 515, 13, true);
    stretches.forEach((length, i) => {
      const y = 552 + i * 57;
      p.text(40, y + 4, i === 0 ? 'A' : 'B', 13, true);
      segment(p, 70, y, length);
      p.text(337, y + 4, '______ cm', 13);
    });
    p.text(40, 711, 'Druckkontrolle bei 100 %: Dieser Strich muss 5 cm lang sein.', 11);
    segment(p, 40, 739, 5);
    return p.finish();
  }

  function practice() {
    const p = page('Blatt 2');
    p.para(40, 166, 'Schätze zuerst. Miss dann mit dem Lineal und runde auf ganze Zentimeter. Liegt die Länge genau zwischen zwei Zentimeterstrichen, nimm die größere Zahl.', 515, 13);
    const columns = [40, 311, 431, 555];
    ['Gegenstand', 'Geschätzt', 'Gemessen'].forEach((heading, i) => {
      p.rect(columns[i], 227, columns[i + 1] - columns[i], 38, '#edf3e2');
      p.text(columns[i] + 12, 251, heading, 13, true);
    });
    objects.forEach(([object, tip], row) => {
      const y = 265 + row * 79;
      columns.slice(0, -1).forEach((left, i) => p.rect(left, y, columns[i + 1] - left, 79, 'white'));
      p.text(52, y + 27, object, 14, true);
      p.para(52, y + 50, tip, 240, 11);
      p.text(326, y + 45, '_____ cm', 13);
      p.text(447, y + 45, '_____ cm', 13);
    });
    p.text(40, 628, 'Was war am längsten? Um wie viele Zentimeter war es', 13, true);
    p.text(40, 650, 'länger als der kürzeste Gegenstand?', 13, true);
    p.line(40, 689, 555, 689);
    p.line(40, 729, 555, 729);
    return p.finish();
  }

  function challenge() {
    const p = page('Blatt 3');
    p.para(40, 164, 'Zeichne zweimal eine 8 cm lange Strecke. Markiere auf jeder Strecke eine andere Teilstelle. Beide Teilstrecken sollen jeweils ganze Zentimeter lang sein.', 515, 14);
    for (let i = 0; i < 2; i++) {
      const y = 258 + i * 159;
      p.text(40, y, (i + 1) + '. Zeichnung', 14, true);
      p.rect(40, y + 18, 515, 78, 'white');
      p.text(40, y + 126, '______ cm + ______ cm = 8 cm', 14);
    }
    p.para(40, 601, 'Erkläre: Was passiert mit der zweiten Teilstrecke, wenn du die erste um 1 cm länger machst?', 515, 14, true);
    p.line(40, 667, 555, 667);
    p.line(40, 706, 555, 706);
    return p.finish();
  }

  function solution() {
    const p = page('Lösungsblatt', {solution: true});
    p.text(40, 151, 'Blatt 1 · Ablesen und messen', 15, true);
    p.para(40, 185, '1. Bild 2. Die Null liegt am linken Streckenende.\n2. ' + examples[1] + ' cm.\n3. Strecke A: ' + stretches[0] + ' cm. Strecke B: ' + stretches[1] + ' cm.', 515, 13);
    p.text(40, 293, 'Blatt 2 · Gegenstände messen', 15, true);
    p.para(40, 327, 'Die Längen hängen von den Gegenständen in der Klasse ab. Vergleicht zu zweit eure Messungen am selben Gegenstand. Für die letzte Frage rechnet ihr: längste Länge minus kürzeste Länge.', 515, 13);
    p.text(40, 432, 'Blatt 3 · Strecken zerlegen', 15, true);
    p.para(40, 466, 'Zwei mögliche Zerlegungen: 2 cm + 6 cm und 3 cm + 5 cm.', 515, 13);
    [[2, 6], [3, 5]].forEach(([a, b], i) => {
      const y = 526 + 79 * i;
      segment(p, 40, y, a + b);
      const middle = 40 + a * cm;
      p.line(middle, y - 8, middle, y + 8, '#416d4c', 1.5);
      p.text(40 + a * cm / 2, y + 25, a + ' cm', 12, false, ink, 'middle');
      p.text(middle + b * cm / 2, y + 25, b + ' cm', 12, false, ink, 'middle');
    });
    p.para(40, 687, 'Wird die erste Teilstrecke um 1 cm länger, wird die zweite um 1 cm kürzer. Zusammen bleiben es 8 cm.', 515, 13);
    return p.finish();
  }

  function cards() {
    const p = page('Messkarten für die Partnerarbeit', {names: false});
    objects.forEach(([object, tip], i) => {
      const x = 40 + i % 2 * 260;
      const y = 143 + Math.floor(i / 2) * 301;
      p.rect(x, y, 251, 281, '#f5f7ed', '#9caf91', 7);
      p.text(x + 15, y + 33, object, 16, true);
      p.para(x + 15, y + 69, tip, 220, 12, true);
      p.para(x + 15, y + 121, 'Ein Kind schätzt und misst. Das andere Kind prüft, ob die Null richtig liegt. Dann tauscht ihr die Rollen.', 220, 12);
      p.text(x + 15, y + 222, 'Geschätzt: ______ cm', 12);
      p.text(x + 15, y + 253, 'Gemessen: ______ cm', 12);
    });
    return p.finish();
  }

  const packs = {children: [help, practice, challenge], solutions: [solution], cards: [cards]};
  return {packs, names};
})();

if (typeof document !== 'undefined' && document.getElementById('sheet')) {
  const selector = document.getElementById('sheet');
  const status = document.getElementById('status');
  const buttons = [...document.querySelectorAll('[data-pack]')];

  function preview() {
    const [kind, index] = selector.value.split(':');
    document.getElementById('preview').innerHTML = LinealWerkstatt.packs[kind][Number(index)]();
  }

  async function download(kind) {
    buttons.forEach(button => { button.disabled = true; });
    status.textContent = 'A4-PDF wird erstellt …';
    try {
      const bytes = await LerngartenFont.pdf(LinealWerkstatt.packs[kind].map(render => render()));
      const url = URL.createObjectURL(new Blob([bytes], {type: 'application/pdf'}));
      const link = document.createElement('a');
      link.href = url;
      link.download = 'Forschen-mit-dem-Lineal-' + LinealWerkstatt.names[kind] + '-A4.pdf';
      document.body.append(link);
      link.click();
      link.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      status.textContent = 'A4-PDF erstellt. Bitte bei 100 % drucken.';
    } catch (error) {
      status.textContent = 'PDF konnte nicht erstellt werden. ' + error.message;
    } finally {
      buttons.forEach(button => { button.disabled = false; });
    }
  }

  selector.addEventListener('change', preview);
  window.addEventListener('lerngarten-font-change', preview);
  buttons.forEach(button => button.addEventListener('click', () => download(button.dataset.pack)));
  preview();
}
