const SchoolbagStationen = (() => {
  const words = [['pencil', 'Bleistift'], ['book', 'Buch'], ['ruler', 'Lineal'], ['pen', 'Kugelschreiber']];
  const answerWords = words.map(([en, de]) => en + ' = ' + de).join(' · ');
  const prompts = ['Show me your ruler.', 'Show me your book.', 'Show me your pencil.', 'Show me your pen.'];
  const ask = 'Have you got a pencil?';
  const yes = 'Yes, I have.';
  const no = 'No, I haven’t.';
  function card(p, x, y, title, lines) {
    p.rect(x, y, 244, 155, '#f2f6eb', '#8ea584', 6);
    p.text(x + 14, y + 31, title, 15, true);
    lines.forEach((line, i) => p.para(x + 14, y + 63 + i * 38, line, 216, 12));
  }
  return {
    title: 'In my schoolbag',
    stations: {
      listen: {
        title: 'Hören und Zeigen',
        materials: 'Bleistift, Buch, Lineal und Kugelschreiber',
        draw(p) {
          p.para(40, 207, 'Legt die vier Schulsachen auf den Tisch. Ein Kind liest einen Satz vor. Das andere hört zu und zeigt auf den passenden Gegenstand. Wechselt danach die Rollen.', 515, 15);
          prompts.forEach((line, i) => {
            const y = 321 + 80 * i;
            p.rect(40, y, 515, 56, '#f2f6eb', '#8ea584', 6);
            p.text(57, y + 35, line, 16, true);
          });
          p.para(40, 692, 'Tipp: Wer zuhört, schaut auf die Schulsachen. Die Lehrkraft kann die Sätze zuerst vorlesen.', 515, 13);
        },
        answer: 'Vorleseliste:\n' + prompts.join('\n') + '\nIn dieser Reihenfolge zeigen: Lineal, Buch, Bleistift, Kugelschreiber.'
      },
      match: {
        title: 'Lesen und Zuordnen',
        materials: 'Vier echte Schulsachen, Schere und Bleistift',
        draw(p) {
          p.para(40, 205, 'Schneide die vier Wortkarten aus. Lies die Wörter und lege jede Karte neben die passende Schulsache. Prüft eure Zuordnung zu zweit.', 515, 15);
          words.forEach(([word], i) => {
            const x = 40 + (i % 2) * 263;
            const y = 326 + Math.floor(i / 2) * 102;
            p.rect(x, y, 248, 78, '#f2f6eb', '#8ea584', 6);
            p.text(x + 124, y + 47, word, 21, true, '#203d36', 'middle');
          });
          p.para(40, 588, 'Schreibe zwei englische Wörter aus dem Kopf auf. Prüfe sie danach mit den Karten.', 515, 14);
          p.line(40, 670, 555, 670);
          p.line(40, 714, 555, 714);
        },
        answer: answerWords + '.'
      },
      speak: {
        title: 'Sprechen und Spielen',
        materials: 'Schulsachen und zwei Rollenkarten auf dieser Seite',
        draw(p) {
          p.para(40, 207, 'Schneidet die Rollenkarten aus. Kind B wählt zwei Schulsachen und versteckt sie unter dem Tisch. Kind A fragt nach. Tauscht nach zwei Fragen die Rollen.', 515, 15);
          card(p, 40, 334, 'Kind A · Fragen', [ask, 'Have you got a ruler?']);
          card(p, 311, 334, 'Kind B · Antworten', [yes, no]);
          p.text(40, 559, 'Wortbank', 14, true);
          p.text(40, 596, words.map(([word]) => word).join(' · '), 16);
          p.para(40, 676, 'Probiert auch Fragen mit einem der anderen Wörter aus der Wortbank.', 515, 14);
        },
        answer: 'A: ' + ask + ' B: ' + yes + '\nA: Have you got a ruler? B: ' + no + '\nDie Antwort hängt davon ab, was Kind B gewählt hat.'
      }
    }
  };
})();
