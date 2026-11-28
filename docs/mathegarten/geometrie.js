const GeometrySheets = (() => {
  const names = {segment: 'Strecke', ray: 'Strahl', line: 'Gerade'};
  const definitions = {
    segment: 'Eine Strecke hat zwei Endpunkte.',
    ray: 'Ein Strahl hat einen Anfangspunkt. Er geht in einer Richtung unbegrenzt weiter.',
    line: 'Eine Gerade hat keine Endpunkte. Sie geht in beide Richtungen unbegrenzt weiter.'
  };

  function figure(p, kind, x1, y1, x2, y2) {
    p.line(x1, y1, x2, y2, '#294a39', 1.5);
    const angle = Math.atan2(y2 - y1, x2 - x1);
    function arrow(x, y, direction) {
      const backX = x - 8 * Math.cos(direction);
      const backY = y - 8 * Math.sin(direction);
      p.path('M ' + x + ' ' + y + ' L ' +
        (backX + 3.5 * Math.sin(direction)) + ' ' + (backY - 3.5 * Math.cos(direction)) +
        ' L ' + (backX - 3.5 * Math.sin(direction)) + ' ' +
        (backY + 3.5 * Math.cos(direction)) + ' Z', '#294a39', .7, '#294a39');
    }
    if (kind === 'segment' || kind === 'ray') p.circle(x1, y1, 3.5);
    if (kind === 'segment') p.circle(x2, y2, 3.5);
    else arrow(x2, y2, angle);
    if (kind === 'line') arrow(x1, y1, angle + Math.PI);
  }

  function pages(size = 14, answers = false) {
    if (![14, 17, 20].includes(size)) throw Error('Bitte eine angebotene Schriftgröße wählen.');
    const output = [];
    const title = 'Strecke, Strahl und Gerade';
    const subtitle = 'Geometrie · Erkennen, zuordnen und zeichnen';
    for (const solution of answers ? [false, true] : [false]) {
      let p = MathA4.page(title, subtitle, {solution});
      p.text(40, 157, '1. Erkennen', size + 2, true);
      const kinds = ['segment', 'ray', 'line'];
      kinds.forEach((kind, i) => {
        const y = 192 + i * 128;
        p.text(40, y, names[kind], size, true);
        p.para(40, y + 27, definitions[kind], 300, size, false, 1.25);
        figure(p, kind, 380, y + 29, 535, y + 29);
      });
      p.para(40, 566, 'Wie heißen diese drei Figuren? Schreibe den Namen dazu.', 515, size);
      const exercises = ['ray', 'segment', 'line'];
      exercises.forEach((kind, i) => {
        const x = 52 + i * 173;
        p.text(x, 629, String(i + 1) + '.', size, true);
        figure(p, kind, x + 8, 686, x + 118, 653);
        p.text(x, 728, solution ? names[kind] : '____________', size);
      });
      output.push(p.finish());

      p = MathA4.page(title, subtitle, {solution});
      p.text(40, 157, '2. Zuordnen und begründen', size + 2, true);
      const statements = [
        ['Ich habe genau zwei Endpunkte.', 'Strecke'],
        ['Ich habe einen Anfangspunkt und gehe in einer Richtung immer weiter.', 'Strahl'],
        ['Ich gehe in beide Richtungen immer weiter.', 'Gerade'],
        ['Meine beiden Endpunkte heißen A und B. Meine Länge ist 4 cm.', 'Strecke']
      ];
      statements.forEach(([question, answer], i) => {
        const y = 203 + i * 136;
        p.para(40, y, (i + 1) + '. ' + question, 515, size, false, 1.3);
        p.text(40, y + 73, 'Das ist eine / ein: ' + (solution ? answer : '________________'), size);
      });
      p.para(40, 748, solution
        ? 'Eine Gerade und ein Strahl passen nur als Ausschnitt auf das Blatt.'
        : 'Erkläre: Woran erkennst du einen Strahl in der Zeichnung?', 515, Math.min(size, 14));
      output.push(p.finish());

      p = MathA4.page(title, subtitle, {solution});
      p.text(40, 157, '3. Zeichnen mit dem Lineal', size + 2, true);
      const tasks = [
        'Zeichne eine 4 cm lange Strecke. Markiere die Endpunkte A und B.',
        'Markiere A und B selbst. Zeichne einen Strahl, der bei A beginnt und durch B geht.',
        'Markiere C und D selbst. Zeichne eine Gerade, die durch beide Punkte geht.'
      ];
      tasks.forEach((task, i) => {
        const y = 200 + i * 183;
        p.para(40, y, (i + 1) + '. ' + task, 515, size, false, 1.25);
        if (solution) {
          const top = y + 98;
          if (i === 0) {
            const end = 92 + 4 * 595.28 / 21;
            figure(p, 'segment', 92, top, end, top);
            p.text(88, top + 26, 'A', size);
            p.text(end - 4, top + 26, 'B', size);
            p.text(305, top + 6, '4 cm', size);
          } else {
            figure(p, i === 1 ? 'ray' : 'line', 92, top, 480, top);
            const first = i === 1 ? 92 : 195;
            if (i === 2) p.circle(first, top, 3.5);
            p.circle(330, top, 3.5);
            p.text(first - 4, top + 26, i === 1 ? 'A' : 'C', size);
            p.text(326, top + 26, i === 1 ? 'B' : 'D', size);
          }
        } else {
          p.line(40, y + 153, 555, y + 153, '#cbd7c4', .6);
        }
      });
      p.para(40, 750, solution
        ? 'Bei 2 und 3 sind andere Lagen möglich. Entscheidend sind Endpunkte und Pfeile.'
        : 'Prüfe: Stimmen Endpunkte, Pfeile und Beschriftungen?', 515, 11);
      output.push(p.finish());
    }
    return output;
  }

  return {pages};
})();

const geometryGet = id => document.getElementById(id);
let geometryPages = [];

function renderGeometry() {
  try {
    geometryPages = GeometrySheets.pages(Number(geometryGet('size').value), geometryGet('answers').checked);
    geometryGet('preview').innerHTML = geometryPages.map(svg => '<article class="sheet">' + svg + '</article>').join('');
    geometryGet('status').textContent = geometryPages.length + ' A4-Seite(n). Beim Drucken 100 % wählen.';
  } catch (error) {
    geometryGet('status').textContent = error.message;
  }
}

geometryGet('size').addEventListener('change', renderGeometry);
geometryGet('answers').addEventListener('change', renderGeometry);
geometryGet('print').addEventListener('click', () => window.print());
geometryGet('pdf').addEventListener('click', async () => {
  const button = geometryGet('pdf');
  button.disabled = true;
  geometryGet('status').textContent = 'A4-PDF wird erstellt …';
  try {
    const bytes = await LerngartenFont.pdf(geometryPages);
    const url = URL.createObjectURL(new Blob([bytes], {type: 'application/pdf'}));
    const link = document.createElement('a');
    link.href = url;
    link.download = 'Strecke-Strahl-Gerade.pdf';
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    geometryGet('status').textContent = geometryPages.length + ' A4-Seite(n) als PDF erstellt.';
  } catch (error) {
    geometryGet('status').textContent = error.message;
  } finally {
    button.disabled = false;
  }
});
window.addEventListener('lerngarten-font-change', renderGeometry);
renderGeometry();
