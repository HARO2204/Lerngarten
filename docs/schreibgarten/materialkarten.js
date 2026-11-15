const packs = new Map([
  ['nomen', {
    title: 'Nomen und Artikel',
    goal: 'Wir lesen Nomen, finden den passenden Artikel und achten auf den großen Anfangsbuchstaben.',
    prep: 'Für zwei Kinder. Schneide die drei Sortierschilder und die zwölf Wortkarten aus. Legt das Lösungsblatt zur Seite.',
    steps: [
      'Zieht abwechselnd eine Karte und lest das Wort vor.',
      'Sprecht das Wort mit seinem Artikel und legt es zum passenden Schild.',
      'Prüft am Schluss mit dem Lösungsblatt. Schreibt drei Wörter mit Artikel ins Heft.'
    ],
    example: 'Beispiel: Ich ziehe „Hund“. Ich sage „der Hund“ und lege die Karte zu „der“.',
    extra: 'Schreibt die Mehrzahl zu Hund, Blume und Kind. Welcher Artikel passt jetzt?',
    signs: ['der', 'die', 'das'],
    cardTitle: '12 Wortkarten',
    cardInstruction: 'Schneidet entlang der gestrichelten Linien. Mischt die Karten.',
    cards: [
      ['Hund', 'der Hund'], ['Blume', 'die Blume'], ['Kind', 'das Kind'],
      ['Buch', 'das Buch'], ['Tisch', 'der Tisch'], ['Sonne', 'die Sonne'],
      ['Schule', 'die Schule'], ['Ball', 'der Ball'], ['Pferd', 'das Pferd'],
      ['Baum', 'der Baum'], ['Haus', 'das Haus'], ['Wolke', 'die Wolke']
    ],
    check: 'Zusatz: die Hunde, die Blumen, die Kinder. In der Mehrzahl verwenden wir hier „die“.'
  }],
  ['saetze', {
    title: 'Satzanfang und Satzzeichen',
    goal: 'Wir unterscheiden Aussagen, Fragen und Ausrufe und schreiben das erste Wort im Satz groß.',
    prep: 'Für zwei Kinder. Schneide die drei Sortierschilder und die zwölf Satzkarten aus. Haltet ein Heft bereit.',
    steps: [
      'Zieht abwechselnd eine Karte und lest den Satz laut vor.',
      'Überlegt: Sage ich etwas, frage ich etwas oder rufe ich etwas? Legt die Karte zum passenden Schild.',
      'Schreibt je eine Aussage, eine Frage und einen Ausruf ins Heft. Beginnt groß und setzt das passende Zeichen. Prüft mit dem Lösungsblatt.'
    ],
    example: 'Beispiel: „wo ist mein Stift“ wird zu „Wo ist mein Stift?“',
    extra: 'Erfindet zu „Pause“ eine Aussage, eine Frage und einen Ausruf. Lest euch eure drei Sätze vor.',
    signs: ['Aussage .', 'Frage ?', 'Ausruf !'],
    cardTitle: '12 Satzkarten',
    cardInstruction: 'Schneidet die Karten aus. Das erste Wort ist kleingeschrieben und das Satzzeichen fehlt.',
    cards: [
      ['heute lesen wir', 'Heute lesen wir.'], ['wo ist mein Stift', 'Wo ist mein Stift?'],
      ['hurra, wir spielen im Hof', 'Hurra, wir spielen im Hof!'], ['wann beginnt die Pause', 'Wann beginnt die Pause?'],
      ['oje, mein Saft ist umgekippt', 'Oje, mein Saft ist umgekippt!'], ['im Garten wächst eine Blume', 'Im Garten wächst eine Blume.'],
      ['pass auf, da kommt ein Ball', 'Pass auf, da kommt ein Ball!'], ['der Hund schläft', 'Der Hund schläft.'],
      ['wer hat den Ball', 'Wer hat den Ball?'], ['die Kinder malen ein Bild', 'Die Kinder malen ein Bild.'],
      ['wow, der Turm ist hoch', 'Wow, der Turm ist hoch!'], ['wie spät ist es', 'Wie spät ist es?']
    ],
    check: 'Beispiel für den Zusatz: „Jetzt ist Pause.“ · „Wie lange dauert die Pause?“ · „Hurra, endlich Pause!“'
  }]
]);

const pack = packs.get(new URLSearchParams(location.search).get('thema')) ?? packs.get('nomen');

for (const [id, value] of [
  ['title', pack.title], ['goal', pack.goal], ['prep', pack.prep], ['example', pack.example],
  ['extra', pack.extra], ['card-title', pack.cardTitle], ['card-instruction', pack.cardInstruction],
  ['check', pack.check]
]) {
  document.getElementById(id).textContent = value;
}

function fillList(id, values, showNumbers = false) {
  const list = document.getElementById(id);
  values.forEach((value, index) => {
    const item = document.createElement('li');
    item.textContent = value;
    if (showNumbers) {
      const number = document.createElement('span');
      number.className = 'number';
      number.textContent = index + 1;
      number.setAttribute('aria-hidden', 'true');
      item.prepend(number);
    }
    list.append(item);
  });
}

fillList('steps', pack.steps);
fillList('signs', pack.signs);
fillList('cards', pack.cards.map(([prompt]) => prompt), true);
fillList('solutions', pack.cards.map(([, solution]) => solution));
document.title = pack.title + ' · Materialbox';
document.getElementById('print').addEventListener('click', () => window.print());
