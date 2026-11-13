const KlasseZwei = (() => {
  const lessons = {
    reading: {
      title: 'Eine Geschichte, drei Lesestufen',
      intro: 'Alle lesen dieselbe Geschichte. Die Aufgaben führen vom Ankreuzen zum Begründen mit Textstellen.',
      label: 'Geschichte',
      topics: ['Spuren im Schnee', 'Ein Bad für die Amsel', 'Die Bücherkiste'],
      sheets: ['Blatt 1 · Mit Hilfe', 'Blatt 2 · Zum Üben', 'Blatt 3 · Zum Knobeln']
    },
    shop: {
      title: 'Einkaufen im Klassenladen',
      intro: 'Spielt zu zweit Laden. Lest Preise, legt Beträge mit Spielgeld und gebt Wechselgeld zurück.',
      label: 'Preisliste',
      topics: ['Schulsachen · ganze Euro', 'Obststand · Euro und Cent'],
      sheets: ['Passend bezahlen', 'Beträge verschieden legen', 'Wechselgeld berechnen']
    },
    sentences: {
      title: 'Satzwerkstatt',
      intro: 'Baut Sätze aus Wortkarten, probiert andere Satzanfänge und setzt die passenden Satzzeichen.',
      label: 'Thema',
      topics: ['Am Schulhof', 'Im Garten'],
      sheets: ['Sätze bauen und umstellen', 'Satzzeichen setzen']
    }
  };
  const ink = '#203d36';
  const substitute = text => text.replaceAll('{N}', 'Mia');

  const readingHelp = [
    {
      evidence: 'Sie führen bis zu einer Hecke.',
      words: 'Spuren sind Abdrücke. Eine Hecke besteht aus Sträuchern.',
      question: 'Welches Tier hat die Spuren vermutlich hinterlassen? Nenne zwei Hinweise aus dem Text.',
      answer: 'Vermutlich ein Hase. Die Spuren führen bis zur Hecke. Unter den Zweigen bewegt sich etwas, dann springt dort ein Hase über die Wiese.'
    },
    {
      evidence: 'Neben der Bank steht eine flache Schale mit Wasser.',
      words: 'Eine Amsel ist ein Vogel. Flattern heißt: die Flügel schnell bewegen.',
      question: 'Woran erkennst du, dass die Amsel badet? Nenne zwei Hinweise aus dem Text.',
      answer: 'Die Amsel taucht den Kopf ins Wasser und flattert mit den Flügeln. Kleine Tropfen fliegen durch die Luft.'
    },
    {
      evidence: 'Die großen Bücher legen sie nach unten.',
      words: 'Eine Kiste ist ein großer Behälter. Die Leseecke ist ein Platz zum Lesen.',
      question: 'Wie helfen sich die Kinder beim Aufräumen? Nenne zwei Hinweise aus dem Text.',
      answer: 'Sie legen die großen Bücher zuerst hinein und die kleinen darauf. Mira dreht ein Buch, damit es hineinpasst. Am Ende tragen beide die Kiste gemeinsam.'
    }
  ];

  function box(page, x, y, value, width) {
    page.rect(x, y, width, 35, '#f5f7ed', '#82977b', 5);
    page.text(x + width / 2, y + 23, value, 13, true, ink, 'middle');
  }

  function writingLines(page, y, count) {
    for (let i = 0; i < count; i++) page.line(40, y + i * 32, 555, y + i * 32);
  }

  function pairs(count, render) {
    return {
      worksheets: Array.from({length: count}, (_, index) => render(index, false)),
      solutions: Array.from({length: count}, (_, index) => render(index, true))
    };
  }

  function reading(index) {
    const title = lessons.reading.topics[index];
    const story = newReadingStories.find(item => item.t === title);
    const help = readingHelp[index];
    const sentences = substitute(story.s).match(/[^.!?]+[.!?]/g).map(s => s.trim());
    const middle = Math.ceil(sentences.length / 2);
    const parts = [sentences.slice(0, middle).join(' '), sentences.slice(middle).join(' ')];
    const answers = story.q.slice(0, 2).map(([, choices, answer]) => choices[answer]);

    function render(level, solution) {
      const label = solution ? lessons.reading.sheets[level] : 'Blatt ' + (level + 1);
      const p = MathA4.page(title, 'Lesegarten · 2. Klasse · ' + label, {solution});
      if (solution) {
        if (level < 2) {
          answers.forEach((answer, i) => p.para(40, 167 + i * 49, (i + 1) + '. ' + answer, 515, 14));
          if (level === 1) p.para(40, 268, 'Textbeleg zu Frage 2: „' + help.evidence + '“', 515, 13);
        } else {
          p.para(40, 167, help.question, 515, 14, true);
          p.para(40, 222, help.answer, 515, 14);
        }
        return p.finish();
      }

      let y = 162;
      for (const part of parts) y = p.para(40, y, part, 515, 14) + 16;
      if (level === 0) {
        y = p.para(40, y, 'Wörterhilfe: ' + help.words, 515, 12, true) + 16;
        for (const [i, [question, choices]] of story.q.slice(0, 2).entries()) {
          y = p.para(40, y, (i + 1) + '. ' + substitute(question), 515, 14, true) + 5;
          for (const choice of choices) {
            p.rect(42, y - 11, 12, 12);
            p.text(64, y, choice, 13);
            y += 25;
          }
          y += 15;
        }
      } else if (level === 1) {
        for (const [i, [question]] of story.q.slice(0, 2).entries()) {
          y = p.para(40, y, (i + 1) + '. ' + substitute(question), 515, 14, true) + 19;
          writingLines(p, y, 2);
          y += 80;
        }
        p.para(40, y, 'Unterstreiche im Text die Stelle, die dir bei Frage 2 geholfen hat.', 515, 13, true);
      } else {
        y = p.para(40, y, help.question, 515, 14, true) + 21;
        writingLines(p, y, 5);
      }
      return p.finish();
    }
    return {title, discussion: 'Gemeinsamer Abschluss: Welcher Hinweis hat dir beim Lesen am meisten geholfen?', ...pairs(3, render)};
  }

  const priceLists = [
    {names: ['Bleistift', 'Radiergummi', 'Heft', 'Lineal'], prices: [300, 200, 400, 600], pair: [0, 1], paid: 1000, coins: '1 €, 2 € und 5 €', payments: ['1 × 5 €', '2 € + 2 € + 1 €']},
    {names: ['Apfel', 'Birne', 'Banane', 'Trauben'], prices: [80, 70, 120, 150], pair: [0, 1], paid: 200, coins: '10 ct, 20 ct, 50 ct und 1 €', payments: ['1 € + 50 ct', '50 ct + 50 ct + 50 ct']}
  ];
  const euros = new Intl.NumberFormat('de-AT', {style: 'currency', currency: 'EUR'});
  const money = cents => euros.format(cents / 100);

  function shop(index) {
    const {names, prices, pair, paid, coins, payments} = priceLists[index];
    const total = prices[pair[0]] + prices[pair[1]];
    const purchase = names[pair[0]] + ' und ' + names[pair[1]];
    const title = 'Einkaufen im Klassenladen';
    function render(level, solution) {
      const p = MathA4.page(title, '2. Klasse · ' + lessons.shop.sheets[level], {solution});
      p.text(40, 168, 'Preisliste', 15, true);
      names.forEach((name, i) => {
        const y = 185 + i * 38;
        p.rect(40, y, 515, 35, i % 2 ? 'white' : '#f5f7ed', '#cbd7c4', 4);
        p.text(55, y + 23, name, 14);
        p.text(535, y + 23, money(prices[i]), 14, true, ink, 'end');
      });
      const tasks = [
        [['Was kostet ' + purchase + ' zusammen?', money(total)], ['Lege den Betrag passend. Welche Münzen oder Scheine nimmst du?', 'Zum Beispiel: ' + payments[0] + '.']],
        [['Lege ' + money(total) + ' auf zwei verschiedene Arten. Verwende ' + coins + '.', payments.join(' oder ') + '.'], ['Kontrolliere beide Beträge mit einem Partnerkind. Schreibt je eine Rechnung auf.', 'Beispiel: ' + payments[0] + ' = ' + money(total) + '.']],
        [['Du kaufst ' + purchase + ' und bezahlst mit ' + money(paid) + '. Wie viel bekommst du zurück?', money(paid) + ' − ' + money(total) + ' = ' + money(paid - total) + '.'], ['Prüfe: Preis und Wechselgeld ergeben zusammen den bezahlten Betrag.', money(total) + ' + ' + money(paid - total) + ' = ' + money(paid) + '.']]
      ];
      let y = 379;
      for (const [i, [question, answer]] of tasks[level].entries()) {
        y = p.para(40, y, (i + 1) + '. ' + question, 515, 14, true) + 14;
        if (solution) y = p.para(40, y, answer, 515, 14) + 37;
        else {
          writingLines(p, y, 2);
          y += 95;
        }
      }
      if (!solution) p.para(40, y, 'Spielt den Einkauf. Tauscht danach die Rollen.', 515, 13);
      return p.finish();
    }
    return {title, discussion: 'Vorbereitung: Drucke Spielgeld aus oder nutze das Spielgeld aus der Klasse. Ein Kind kauft ein, das andere kassiert.', ...pairs(3, render)};
  }

  function coins() {
    const p = MathA4.page('Spielgeld für den Klassenladen', 'Lerngarten · Ausschneidebogen');
    p.text(40, 153, 'Schneide die Münzen und Scheine aus. Alle Beträge sind Spielgeld.', 12);
    ['10 ct', '20 ct', '50 ct', '1 €', '2 €'].forEach((value, row) => {
      for (let col = 0; col < 6; col++) {
        const x = 82 + col * 86;
        const y = 207 + row * 82;
        p.circle(x, y, 34, '#82977b');
        p.circle(x, y, 33, 'white');
        p.text(x, y - 1, value, 14, true, ink, 'middle');
        p.text(x, y + 16, 'Spielgeld', 8, false, ink, 'middle');
      }
    });
    for (const [index, value] of ['5 €', '5 €', '10 €', '10 €'].entries()) {
      const x = 40 + (index % 2) * 260;
      const y = 593 + Math.floor(index / 2) * 72;
      p.rect(x, y, 244, 57, 'white', '#82977b', 4);
      p.text(x + 122, y + 26, value, 17, true, ink, 'middle');
      p.text(x + 122, y + 45, 'Spielgeld', 9, false, ink, 'middle');
    }
    return p.finish();
  }

  const sentenceSets = [
    {cards: ['auf dem Schulhof', 'Mia', 'spielt', 'in der Pause'], answers: ['Mia spielt in der Pause auf dem Schulhof.', 'In der Pause spielt Mia auf dem Schulhof.'],
      phrases: ['Lina holt den Ball', 'Wer möchte mitspielen', 'Pass auf'], punct: ['.', '?', '!'],
      question: 'Lina holt den Ball.', converted: 'Holt Lina den Ball?'},
    {cards: ['im Garten', 'Emil', 'arbeitet', 'am Morgen'], answers: ['Emil arbeitet am Morgen im Garten.', 'Am Morgen arbeitet Emil im Garten.'],
      phrases: ['Die Tulpe blüht', 'Wo ist die Gießkanne', 'Vorsicht'], punct: ['.', '?', '!'],
      question: 'Die Tulpe blüht.', converted: 'Blüht die Tulpe?'}
  ];

  function sentences(index) {
    const data = sentenceSets[index];
    const title = 'Satzwerkstatt · ' + lessons.sentences.topics[index];
    function render(sheet, solution) {
      const p = MathA4.page(title, 'Schreibgarten · 2. Klasse · ' + lessons.sentences.sheets[sheet], {solution});
      if (sheet === 0) {
        p.para(40, 165, 'Schneide die Karten aus oder lege sie mit kleinen Zetteln nach.', 515, 13);
        data.cards.forEach((word, i) => box(p, 40 + i * 130, 194, word, 122));
        p.para(40, 290, '1. Baue einen Satz. Schreibe ihn auf. Denke an den Großbuchstaben und den Punkt.', 515, 14, true);
        p.para(40, 456, '2. Beginne mit der Zeitangabe. Stelle die Karten um und schreibe den neuen Satz auf.', 515, 14, true);
        if (solution) {
          p.para(40, 349, 'Beispiel: ' + data.answers[0], 515, 14);
          p.para(40, 515, data.answers[1], 515, 14);
          p.para(40, 584, 'Auch andere sinnvolle Anordnungen sind möglich. Bei der zweiten Aufgabe steht die Zeitangabe zuerst und das Verb an zweiter Stelle.', 515, 13);
        } else {
          writingLines(p, 347, 2);
          writingLines(p, 513, 2);
          p.para(40, 631, 'Unterstreiche in beiden Sätzen das Verb.', 515, 13);
        }
      } else {
        p.para(40, 165, '1. Setze Punkt, Fragezeichen oder Rufzeichen.', 515, 14, true);
        data.phrases.forEach((phrase, i) => p.text(40, 226 + i * 59, phrase + (solution ? data.punct[i] : '  ___'), 16));
        p.para(40, 440, '2. Mach aus diesem Satz eine Frage.', 515, 14, true);
        p.text(40, 486, data.question, 15);
        if (solution) p.text(40, 538, data.converted, 15);
        else writingLines(p, 538, 2);
        if (!solution) p.para(40, 656, 'Lies einem Partnerkind deine Frage vor.', 515, 13);
      }
      return p.finish();
    }
    return {title, discussion: 'Gemeinsamer Abschluss: Lest zwei Sätze mit unterschiedlichen Anfängen vor. Was fällt euch an der Stelle des Verbs auf?', ...pairs(2, render)};
  }

  const builders = {reading, shop, sentences};
  function build(area, index) {
    return builders[area](index);
  }

  return {lessons, build, coins};
})();
