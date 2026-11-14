const Lernchecks = (() => {
  const ink = '#203d36';
  const topics = [
    {
      name: 'Uhrzeit',
      draw(p, x, y) {
        p.text(x, y + 82, '1. Lies die Uhr ab.', 12, true);
        p.text(x + 124, y + 82, '2. Zeichne 8:30 Uhr.', 12, true);
        UhrzeitWerkstatt.face(p, x + 49, y + 132, 36, 10 * 60);
        UhrzeitWerkstatt.face(p, x + 177, y + 132, 36);
        p.text(x + 12, y + 193, '_____ Uhr', 12);
        p.para(x, y + 222, '3. Warum steht der kurze Zeiger um 8:30 Uhr zwischen 8 und 9?', 225, 12, true);
        p.line(x, y + 276, x + 225, y + 276);
        p.line(x, y + 303, x + 225, y + 303);
      },
      answers: [
        ['1. Uhr ablesen', '10:00 Uhr. Der lange Zeiger zeigt auf die 12, der kurze auf die 10.'],
        ['2. Zeiger einzeichnen', 'Der lange Zeiger zeigt auf die 6. Der kurze steht genau in der Mitte zwischen 8 und 9.'],
        ['3. Erklären', 'Beispiel: Eine halbe Stunde ist vergangen. Der Stundenzeiger ist auf dem Weg von der 8 zur 9 schon halb weitergewandert.']
      ],
      next: 'Steht der kurze Zeiger noch auf der 8? Lass das Kind an der Basteluhr 8:00, 8:30 und 9:00 einstellen und dabei den kurzen Zeiger beobachten.',
      link: './?werkstatt=clock',
      resource: 'Uhrzeit-Werkstatt öffnen'
    },
    {
      name: 'Stellenwerttafel',
      draw(p, x, y) {
        p.text(x, y + 83, '1. Trage 64 in die Tafel ein.', 12, true);
        ['Zehner', 'Einer'].forEach((label, i) => {
          const left = x + i * 110;
          p.rect(left, y + 98, 110, 29, '#e9f1df');
          p.text(left + 55, y + 117, label, 11, true, ink, 'middle');
          p.rect(left, y + 127, 110, 43, 'white');
        });
        p.text(x, y + 201, '2. Welche Zahl ist das?', 12, true);
        p.text(x, y + 229, '3 Zehner und 0 Einer = _______', 12);
        p.text(x, y + 267, '3. Was ist die 6 in 64 wert?', 12, true);
        p.line(x, y + 303, x + 225, y + 303);
      },
      answers: [
        ['1. Stellenwerttafel', '6 in die Zehnerspalte und 4 in die Einerspalte.'],
        ['2. Zahl bilden', '30. Drei Zehner sind 30, die Einerstelle ist 0.'],
        ['3. Stellenwert erklären', 'Die 6 steht für 6 Zehner. Ihr Wert ist 60.']
      ],
      next: 'Wird aus 3 Zehnern und 0 Einern die 3? Legt drei Bündel zu je zehn und übertragt sie in die Stellenwerttafel. Schreibt die 0 in die freie Einerspalte.',
      link: '../mathegarten/lernstufen/',
      resource: 'Drei Lernstufen im Mathegarten öffnen'
    },
    {
      name: 'Leseverständnis',
      draw(p, x, y) {
        p.para(x, y + 82, 'Mila sucht ihren roten Schal. Am Haken hängt nur ihre Jacke. Unter der Bank schaut ein rotes Ende hervor. Dort findet Mila den Schal.', 225, 12);
        p.text(x, y + 175, '1. Was sucht Mila?', 12, true);
        p.line(x, y + 199, x + 225, y + 199);
        p.text(x, y + 225, '2. Wo findet Mila den Schal?', 12, true);
        p.line(x, y + 252, x + 225, y + 252);
        p.para(x, y + 281, '3. Unterstreiche im Text den Satz mit dem roten Hinweis.', 225, 12, true);
      },
      answers: [
        ['1. Gegenstand', 'Mila sucht ihren roten Schal. „Schal“ genügt.'],
        ['2. Ort', 'Unter der Bank.'],
        ['3. Textbeleg', '„Unter der Bank schaut ein rotes Ende hervor.“']
      ],
      next: 'Ist die Antwort richtig, aber der Textbeleg fehlt? Lest die Frage noch einmal gemeinsam. Lasst das Kind die Wörter „rotes Ende“ im Text suchen und den ganzen Satz markieren.',
      link: './?werkstatt=reading',
      resource: 'Drei Lesestufen öffnen'
    }
  ];

  function build(index) {
    const {name, draw, answers, next, link, resource} = topics[index];
    const heading = 'Lerncheck · ' + name;
    const p = MathA4.page(heading, '2. Klasse · Vier Karten zum Ausschneiden', {kicker: 'LERNGARTEN · A4', names: false});
    for (let i = 0; i < 4; i++) {
      const x = 40 + i % 2 * 261;
      const y = 118 + Math.floor(i / 2) * 332;
      p.rect(x, y, 253, 324, 'white');
      p.text(x + 13, y + 24, name + ' · 5 Minuten', 13, true);
      p.text(x + 13, y + 53, 'Name: ____________________', 11);
      draw(p, x + 13, y);
    }
    const key = MathA4.page(heading, '2. Klasse · Für die Lehrkraft', {kicker: 'LERNGARTEN · A4', solution: true});
    answers.forEach(([label, answer], i) => {
      const y = 160 + i * 117;
      key.text(40, y, label, 16, true);
      key.para(40, y + 30, answer, 515, 14);
    });
    key.text(40, 527, 'So könnt ihr weiterüben', 17, true);
    key.para(40, 566, next, 515, 14);
    return {
      title: heading,
      discussion: 'Drucke die Seite einmal für je vier Kinder und schneide die Karten entlang der Ränder aus.',
      followUp: {link, resource},
      worksheets: [p.finish()],
      solutions: [key.finish()]
    };
  }

  return {build, topics: topics.map(topic => topic.name)};
})();
