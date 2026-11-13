const UhrzeitWerkstatt = (() => {
  const title = 'Uhrzeit-Werkstatt';
  const sheets = ['Blatt 1 · Mit Hilfe', 'Blatt 2 · Zum Üben', 'Blatt 3 · Zum Knobeln'];
  const ink = '#203d36';
  const accent = '#356b8b';
  const time = (hour, minute) => hour * 60 + minute;
  const digital = value => Math.floor(value / 60) + ':' + String(value % 60).padStart(2, '0');
  const sets = [
    {
      setup: [time(8, 0), time(9, 30), time(10, 0)],
      read: [time(7, 30), time(10, 0)],
      draw: [time(8, 30), time(11, 0)],
      stories: [
        ['Die Jause beginnt um 9:00 Uhr und dauert 30 Minuten. Wann ist sie vorbei?', time(9, 0), 30],
        ['Die Lesestunde beginnt um 10:30 Uhr und dauert 30 Minuten. Wann endet sie?', time(10, 30), 30],
        ['Der Ausflug endet um 11:30 Uhr. Er dauert eine Stunde. Wann beginnt er?', time(10, 30), 60, true]
      ]
    },
    {
      setup: [time(8, 0), time(9, 30), time(10, 15), time(11, 45)],
      read: [time(7, 45), time(10, 15)],
      draw: [time(8, 15), time(11, 45)],
      stories: [
        ['Die Jause beginnt um 9:30 Uhr und dauert 15 Minuten. Wann ist sie vorbei?', time(9, 30), 15],
        ['Die Lesezeit beginnt um 10:45 Uhr und dauert 30 Minuten. Wann endet sie?', time(10, 45), 30],
        ['Das Turnen endet um 11:30 Uhr. Es dauert 45 Minuten. Wann beginnt es?', time(10, 45), 45, true]
      ]
    }
  ];

  function point(x, y, length, fraction) {
    const angle = fraction * 2 * Math.PI;
    return [x + length * Math.sin(angle), y - length * Math.cos(angle)];
  }

  function face(p, x, y, radius, value = null) {
    p.circle(x, y, radius + 1, ink);
    p.circle(x, y, radius, 'white');
    for (let i = 0; i < 60; i++) {
      const tick = i % 5 === 0;
      p.line(...point(x, y, radius - (tick ? 9 : 5), i / 60),
        ...point(x, y, radius - 1, i / 60), ink, tick ? 1.4 : .55);
    }
    for (let i = 1; i <= 12; i++) {
      const [nx, ny] = point(x, y, radius * .76, i / 12);
      p.text(nx, ny + radius * .067, i, radius * .2, true, ink, 'middle');
    }
    if (value !== null) {
      p.line(x, y, ...point(x, y, radius * .5, value / 720), ink, 4);
      p.line(x, y, ...point(x, y, radius * .69, (value % 60) / 60), accent, 2.5);
    }
    p.circle(x, y, 3, ink);
  }

  function setupPage(data, solution) {
    const p = MathA4.page('Uhrzeiten entdecken', '2. Klasse · ' + (solution ? sheets[0] : 'Blatt 1'), {solution});
    p.para(40, 158, 'Der kurze Zeiger zeigt die Stunde. Der lange Zeiger zeigt die Minuten. Bei 8:00 Uhr steht der lange Zeiger auf der 12.', 515, 13);
    p.para(40, 208, 'Stelle jede Uhrzeit zuerst an der Basteluhr ein. Zeichne dann beide Zeiger auf das Blatt.', 515, 13, true);
    data.setup.forEach((value, i) => {
      const x = i % 2 === 0 ? 172 : 423;
      const y = 350 + Math.floor(i / 2) * 218;
      p.text(x, y - 81, digital(value) + ' Uhr', 15, true, ink, 'middle');
      face(p, x, y, 65, solution ? value : null);
    });
    p.para(40, 705, 'Zu zweit: Sag eine Uhrzeit an. Dein Partnerkind stellt sie ein. Tauscht die Rollen.', 515, 13);
    return p.finish();
  }

  function practicePage(data, solution) {
    const p = MathA4.page('Uhrzeiten entdecken', '2. Klasse · ' + (solution ? sheets[1] : 'Blatt 2'), {solution});
    p.para(40, 158, '1. Verbinde jede Uhr mit der passenden Uhrzeit am Vormittag.', 515, 14, true);
    data.read.forEach((value, i) => face(p, 172 + i * 251, 269, 66, value));
    const options = [data.read[1], time(9, 0), data.read[0]];
    options.forEach((value, i) => p.text(113 + i * 184, 404,
      digital(value) + ' Uhr' + (solution && i !== 1 ? (i === 0 ? ' · rechts' : ' · links') : ''), 14, true, ink, 'middle'));
    p.para(40, 476, '2. Zeichne den kurzen Stundenzeiger und den langen Minutenzeiger ein.', 515, 14, true);
    data.draw.forEach((value, i) => {
      const x = 172 + i * 251;
      p.text(x, 537, digital(value) + ' Uhr', 15, true, ink, 'middle');
      face(p, x, 632, 66, solution ? value : null);
    });
    return p.finish();
  }

  function challengePage(data, solution) {
    const p = MathA4.page('Uhrzeiten entdecken', '2. Klasse · ' + (solution ? sheets[2] : 'Blatt 3'), {solution});
    p.para(40, 160, 'Rechne mit der Basteluhr. Schreibe deinen Rechenweg und deine Antwort auf.', 515, 13);
    data.stories.forEach(([question, start, duration, backwards], i) => {
      const y = 222 + i * 179;
      const end = start + duration;
      p.para(40, y, (i + 1) + '. ' + question, 515, 14, true);
      if (solution) {
        p.para(40, y + 59, backwards
          ? digital(end) + ' Uhr − ' + duration + ' min = ' + digital(start) + ' Uhr.'
          : digital(start) + ' Uhr + ' + duration + ' min = ' + digital(end) + ' Uhr.', 515, 14);
      } else {
        p.line(40, y + 67, 555, y + 67);
        p.line(40, y + 111, 555, y + 111);
      }
    });
    return p.finish();
  }

  function craft() {
    const p = MathA4.page('Meine Basteluhr', '2. Klasse · Ausschneidebogen', {names: false});
    p.para(40, 142, 'Du brauchst eine Schere, Karton und eine Musterbeutelklammer.', 515, 13, true);
    p.para(40, 177, 'Klebe Uhr und Zeiger auf Karton. Schneide sie entlang der Außenlinien aus. Lass dir helfen, die drei markierten Punkte zu lochen. Stecke die Klammer durch beide Zeiger und dann durch die Uhr. Öffne sie hinten locker, damit sich die Zeiger drehen.', 515, 13);
    face(p, 297.5, 409, 141);
    const hands = [
      {x: 58, y: 620, length: 74, label: 'Stundenzeiger · kurz'},
      {x: 320, y: 620, length: 102, label: 'Minutenzeiger · lang'}
    ];
    for (const {x, y, length, label} of hands) {
      p.path('M ' + (x - 14) + ' ' + (y - 10) + ' H ' + (x + length - 16) +
        ' V ' + (y - 19) + ' L ' + (x + length) + ' ' + y +
        ' L ' + (x + length - 16) + ' ' + (y + 19) +
        ' V ' + (y + 10) + ' H ' + (x - 14) + ' Z', ink, 1.2, 'white');
      p.circle(x, y, 3, ink);
      p.text(x - 14, y + 43, label, 12);
    }
    p.para(40, 717, 'Probiere es aus: Stelle 8:00 Uhr ein. Drehe den langen Zeiger bis zur 6 und den kurzen Zeiger bis zur Mitte zwischen 8 und 9. Jetzt ist es 8:30 Uhr.', 515, 13);
    return p.finish();
  }

  function build(index) {
    const data = sets[index];
    const renderers = [setupPage, practicePage, challengePage];
    return {
      title,
      discussion: 'Gemeinsamer Einstieg: Stellt den Beginn eurer großen Pause ein. Wo steht der Minutenzeiger am Ende der Pause?',
      worksheets: renderers.map(render => render(data, false)),
      solutions: renderers.map(render => render(data, true))
    };
  }

  return {title, sheets, build, craft};
})();
