const Vertretung = (() => {
  const subjects = {math: 'Mathematik', read: 'Deutsch · Lesen', english: 'Englisch'};
  const times = {30: [5, 15, 5, 5], 45: [5, 25, 10, 5], 50: [5, 30, 10, 5], 60: [10, 35, 10, 5]};
  const ranges = [20, 100, 1000, 1000];

  const stories = [
    ['Der rote Ball',
      'Mia hat einen roten Ball. Der Ball rollt unter die Bank. Ben holt ihn. Mia sagt Danke. Nun spielen beide im Hof.',
      [['Welche Farbe hat der Ball?', 'Rot.'], ['Wohin rollt der Ball?', 'Unter die Bank.'], ['Wer holt den Ball?', 'Ben.'], ['Wo spielen die Kinder?', 'Im Hof.']]],
    ['Die Spur am Zaun',
      'Vor der Schule entdeckt Samira kleine Pfotenabdrücke im Schnee. Sie führen vom Tor zum Zaun. Dort enden sie unter einer Lücke. Samira will schon zurückgehen, da sieht sie hinter dem Zaun eine Katze. An ihren Pfoten klebt Schnee. Die Katze schüttelt sich und springt auf eine Mauer. Samira zeichnet die Spur später in ihr Heft.',
      [['Wo entdeckt Samira die Spur?', 'Vor der Schule, im Schnee.'], ['Wohin führt die Spur?', 'Vom Tor zum Zaun, bis zu einer Lücke.'], ['Welches Tier hat die Spur vermutlich hinterlassen? Nenne einen Hinweis.', 'Eine Katze. Sie sitzt hinter dem Zaun und hat Schnee an den Pfoten.'], ['Was macht Samira später?', 'Sie zeichnet die Spur in ihr Heft.']]],
    ['Das Schild im Schulgarten',
      'Die dritte Klasse stellt ein Schild neben die jungen Bohnen. Darauf steht: „Bitte hier nicht gießen.“ Am nächsten Tag hängen die Blätter schlaff herunter. Leon schlägt vor, das Schild sofort wegzuwerfen. Ida schaut genauer hin. Über den Pflanzen hängt die neue Markise. Seit sie ausgefahren ist, kommt selbst bei Regen kaum Wasser ins Beet. Das Schild stammt noch aus der Zeit, als es tagelang geregnet hatte. Die Kinder prüfen die Erde mit einem Finger. Sie ist trocken. Nun gießen sie langsam und schreiben ein neues Schild: „Erst prüfen, dann gießen.“',
      [['Warum wird das erste Schild zum Problem?', 'Es gilt noch für die frühere Regenzeit. Die Erde ist jetzt trocken.'], ['Welche Rolle spielt die Markise?', 'Sie hält einen großen Teil des Regens vom Beet ab.'], ['Wie prüfen die Kinder die Erde?', 'Sie fühlen mit einem Finger, ob sie trocken ist.'], ['Warum ist das neue Schild hilfreicher?', 'Es sagt, dass man je nach Zustand der Erde entscheidet.']]],
    ['Die stille Ecke im Schulhof',
      'Ein Teil des Schulhofs soll in der großen Pause ruhiger werden. Nura schlägt vor, dort eine Bank aufzustellen. Emil findet das unnötig. Wer Ruhe brauche, könne in die Bibliothek gehen, sagt er. Die Bibliothek ist aber nur zweimal pro Woche geöffnet. Die Klasse sammelt Vorschläge und testet sie. Eine Bank direkt neben dem Fußballfeld bleibt fast leer. Hinter dem Geräteschuppen wird dieselbe Bank rasch zum Treffpunkt. Dort können zwei Gruppen gleichzeitig spielen, ohne einander zu stören. Am Freitag legt Nura zwei Zettel auf den Tisch: „Beliebtester Ort“ und „Was noch fehlt“. Beim zweiten Zettel steht am Ende am häufigsten: „Schatten am Nachmittag.“',
      [['Warum löst die Bibliothek das Problem nur teilweise?', 'Sie ist nur zweimal pro Woche geöffnet.'], ['Was zeigt der Test mit derselben Bank an zwei Orten?', 'Der Standort ist wichtig. Hinter dem Schuppen wird die Bank häufiger genutzt.'], ['Welche Verbesserung wünschen sich viele Kinder?', 'Schatten am Nachmittag.'], ['Was könnte die Klasse als Nächstes testen? Begründe.', 'Beispiel: Einen Platz unter einem Baum testen, weil er nachmittags Schatten geben könnte.']]]
  ];

  const english = [
    [['red', 'rot'], ['blue', 'blau'], ['green', 'grün'], ['yellow', 'gelb'], ['black', 'schwarz'], ['white', 'weiß']],
    [['pen', 'Stift'], ['book', 'Buch'], ['ruler', 'Lineal'], ['bag', 'Tasche'], ['pencil', 'Bleistift'], ['eraser', 'Radiergummi']],
    [['rabbit', 'Kaninchen'], ['horse', 'Pferd'], ['duck', 'Ente'], ['sheep', 'Schaf'], ['frog', 'Frosch'], ['goat', 'Ziege']],
    [['cloudy', 'bewölkt'], ['sunny', 'sonnig'], ['windy', 'windig'], ['rainy', 'regnerisch'], ['warm', 'warm'], ['cold', 'kalt']]
  ];
  const topics = ['Colours', 'School things', 'Animals', 'Weather'];

  const starters = [
    {subject: 'math', title: 'Kopfrechenschlange', note: ({grade, time}) => {
      const tasks = grade === 1 ? '6, dann +2, +1, −3, +2' : grade === 2 ? '24, dann +6, −10, +9, +1' : '240, dann +60, −100, +90, +10';
      const answer = grade === 1 ? '8, 9, 6, 8' : grade === 2 ? '30, 20, 29, 30' : '300, 200, 290, 300';
      return 'Schreibe an die Tafel: ' + tasks + '. Alle rechnen bei jedem Schritt mit dem letzten Ergebnis weiter. Ergebnisse: ' + answer + '. ' +
        (time > 5 ? 'Lass danach zu zweit eine eigene Schlange erfinden und tauschen.' : 'Lass einen Rechenweg erklären.');
    }},
    {subject: 'math', title: 'Meine Zahl, deine Zahl', note: ({grade}) => 'Ein Kind nennt eine Zahl zwischen 1 und ' + (ranges[grade - 1] - 1) + '. Das nächste Kind nennt die Zahl davor und die Zahl danach. Macht eine Proberunde gemeinsam, dann geht es paarweise weiter.'},
    {subject: 'read', title: 'Wortspur an der Tafel', note: () => 'Schreibe „Schulhof“, „Spur“ und „Überraschung“ an die Tafel. Lies die Wörter bei Bedarf vor. Die Kinder erfinden mit einem Partnerkind einen Satz mit mindestens einem Wort. Sammelt zwei Beispiele.'},
    {subject: 'read', title: 'Ein Satz wandert', note: () => 'Schreibe „Heute finde ich etwas Seltsames.“ an die Tafel und lies den Satz vor. Die Kinder verändern ein Wort, sodass der Satz sinnvoll bleibt. Sammelt Vorschläge und lest die neuen Sätze gemeinsam.'},
    {subject: 'english', title: 'Hello-Runde', note: () => 'Modelliere „Hello, I’m … What’s your name?“ und „I’m …“. Die Kinder sprechen den Mini-Dialog zu zweit und wechseln die Rollen. Lass bei Bedarf zuerst alle gemeinsam nachsprechen.'},
    {subject: 'english', title: 'Zählen mit Bewegung', note: () => 'Zählt gemeinsam auf Englisch bis zehn. Klatscht bei jeder Zahl einmal. Lass ein Kind drei bis sechs Klatscher vorgeben. Die anderen nennen die Anzahl auf Englisch.'}
  ];

  const endings = [
    {subject: 'math', title: 'Partnercheck und Rechenfrage', note: ({grade, work}) => {
      const [question, answer] = grade === 1 ? ['8 + 2', 10] : grade === 2 ? ['37 + 3', 40] : ['397 + 3', 400];
      return (work.subject === 'math' ? 'Lass die Kinder ein Ergebnis aus dem Blatt zu zweit vergleichen und erklären. ' : '') +
        'Schreibe ' + question + ' an die Tafel. Jedes Kind rechnet still und erklärt anschließend dem Partnerkind seinen Rechenweg. Lösung: ' + answer + '.';
    }},
    {subject: 'math', title: 'Zahl des Tages', note: ({grade}) => 'Schreibe ' + [10, 50, 250, 500][grade - 1] + ' an die Tafel. Die Kinder suchen zwei Zahlen, die zusammen diese Zahl ergeben. Sammelt verschiedene Lösungen und prüft sie gemeinsam.'},
    {subject: 'read', title: 'Ein Satz zum Schluss', note: ({work}) => work.subject === 'read'
      ? 'Lass jedes Kind eine wichtige Stelle im Text markieren. Die Kinder erklären zu zweit, warum die Stelle wichtig ist. Höre anschließend zwei Beispiele im Plenum.'
      : 'Schreibe „Auf dem Schulhof ist es plötzlich still.“ an die Tafel. Lest den Satz gemeinsam. Die Kinder vermuten zu zweit, was passiert sein könnte, und begründen ihre Idee.'},
    {subject: 'read', title: 'Stimmt das?', note: ({work}) => work.subject === 'read'
      ? 'Zu zweit erfindet jedes Kind eine richtige oder falsche Aussage zur Geschichte. Das Partnerkind entscheidet und zeigt die passende Textstelle.'
      : 'Lies vor: „Ali legt sein Heft in die rote Tasche.“ Sage danach: „Die Tasche ist blau.“ Die Kinder zeigen mit dem Daumen, ob das stimmt, und erklären ihre Antwort. Wiederholt es mit eigenen Sätzen.'},
    {subject: 'english', title: 'Wortstaffel', note: ({work}) => work.subject === 'english'
      ? 'Lass die Kinder das Blatt umdrehen. Zu zweit sagen sie abwechselnd ein englisches Wort aus der Stunde. Sammelt die Wörter anschließend an der Tafel und sprecht sie gemeinsam.'
      : 'Schreibe red, blue und green mit der deutschen Bedeutung an die Tafel. Sprich vor. Die Kinder zeigen auf etwas in der genannten Farbe und geben danach selbst ein Wort vor.'},
    {subject: 'english', title: 'Goodbye im Tandem', note: () => 'Sprich vor: „See you!“ und „Bye!“ Die Kinder verabschieden sich damit von zwei Partnerkindern. Wer möchte, sagt davor noch „Thank you!“.'}
  ];

  const work = [
    {subject: 'math', title: 'Mathe-Mix', note: 'Die Kinder rechnen selbstständig im passenden Zahlenraum. Bei einer schwierigen Aufgabe dürfen sie zunächst weitergehen.', pages: mathPages},
    {subject: 'math', title: 'Häuser und Pyramiden', note: 'Zeige an der Tafel, dass zwei Zahlen zusammen die Dachzahl ergeben. In der Pyramide werden jeweils zwei benachbarte Steine addiert.', pages: mathPages},
    {subject: 'read', title: 'Lesen und Textstellen finden', note: 'Die Kinder lesen den Text und beantworten die Fragen. Bei Bedarf den Text einmal vorlesen. Wer fertig ist, markiert die Stellen, die seine Antworten belegen.', pages: readingPages},
    {subject: 'read', title: 'Lesen und weitererzählen', note: 'Die Kinder lesen den Text, lösen zwei Fragen und erfinden eine Fortsetzung. In der 1. Klasse dürfen sie die Fortsetzung zeichnen.', pages: readingPages},
    {subject: 'english', title: 'Englische Wörter zuordnen', note: 'Lies die englischen Wörter mit der deutschen Bedeutung auf dem Lösungsblatt einmal vor. Die Kinder ordnen die Wörter zu und schreiben sie ab. Wer fertig ist, deckt die Wortbank ab und übt aus dem Kopf.', pages: englishPages},
    {subject: 'english', title: 'Englische Mini-Dialoge', note: 'Lies den Beispieldialog einmal mit einem Kind vor. Danach bereiten die Kinder eigene Dialoge mit der Wortbank vor und spielen sie zu zweit.', pages: englishPages}
  ];

  function mathPages({grade, duration, seed}, variant) {
    const settings = MathMix.defaults();
    const short = duration === 30;
    Object.keys(settings.counts).forEach(key => { settings.counts[key] = 0; });
    Object.assign(settings, {max: ranges[grade - 1], level: grade === 1 ? 1 : grade === 4 ? 3 : 2, seed});
    Object.assign(settings.counts, variant === 0
      ? {add: short ? 3 : 4, sub: short ? 3 : 4, missing: 2, snake: 1, story: grade > 1 && !short ? 1 : 0}
      : {house: short ? 2 : 3, pyramid: short ? 2 : 3, lovers: grade === 1 ? 2 : 0});
    if (duration >= 50) settings.counts.sequence = duration === 60 ? 3 : 2;
    const model = MathMix.build(settings);
    const worksheets = MathMix.pages(model, false, work[variant].title);
    return {worksheets, solutions: MathMix.pages(model, true, work[variant].title).slice(worksheets.length)};
  }

  function worksheet(title, body, solution) {
    const page = DailyTools.page(title, 'VERTRETUNGSSTUNDE · LERNGARTEN');
    if (!solution) page.text(44, 111, 'Name: __________________________________', 12);
    let y = solution ? 120 : 143;
    for (const block of body) {
      if (block.heading) {
        page.text(44, y, block.heading, 13, true);
        y += 23;
      }
      if (block.text) y = page.para(44, y, block.text, 507, 13, 1.42);
      for (let line = 0; line < (block.lines || 0); line++) {
        y += 25;
        page.line(44, y, 551, y);
      }
      if (block.draw) {
        page.rect(44, y, 507, 180, 'white', '#b9c7ac', 7);
        y += 180;
      }
      y += 12;
    }
    if (y > 799) throw Error('Eine Druckseite ist zu lang.');
    return page.finish(solution ? 'Lösungen' : 'Arbeitsblatt');
  }

  function readingPages({grade, duration}, variant) {
    const [title, story, questions] = stories[grade - 1];
    const creative = variant === 3;
    const chosen = questions.slice(0, creative ? 2 : duration === 30 ? 3 : 4);
    const blocks = [{heading: 'Lies die Geschichte.', text: story}];
    blocks.push(...chosen.map(([question], index) => ({text: (index + 1) + '. ' + question, lines: grade >= 3 && !creative ? 2 : 1})));
    if (creative) blocks.push({heading: 'Wie geht es weiter?', text: grade === 1 ? 'Zeichne, was danach passieren könnte.' : 'Schreibe eine Fortsetzung mit mindestens drei Sätzen.', lines: grade === 1 ? 0 : 4, draw: grade === 1});
    if (!creative && duration >= 50) blocks.push({text: 'Extra im Heft: Erfinde eine Frage zur Geschichte. Tausche sie mit einem Partnerkind.'});
    const answers = chosen.map(([question, answer], index) => ({text: (index + 1) + '. ' + question + '\n' + answer}));
    if (creative) answers.push({text: 'Für die Fortsetzung gibt es mehrere Lösungen. Sie soll zur Geschichte passen.'});
    return {worksheets: [worksheet(title, blocks)], solutions: [worksheet('Lösungen · ' + title, answers, true)]};
  }

  function englishPages({grade, duration, seed}, variant) {
    const words = english[grade - 1].slice(0, duration === 30 ? 4 : 6);
    const bank = words.map(([en, de]) => en + ' = ' + de).join('  ·  ');
    const topic = topics[grade - 1];
    if (variant === 5) {
      const [first, second] = words.map(([en]) => en);
      const frames = [
        ['What colour is it?', 'It’s '],
        ['What have you got?', 'I’ve got a '],
        ['What animal can you see?', 'I can see a '],
        ['What’s the weather like?', 'It’s ']
      ];
      const [question, beginning] = frames[grade - 1];
      const article = word => beginning.endsWith(' a ') && /^[aeiou]/i.test(word) ? beginning.slice(0, -2) + 'an ' : beginning;
      const example = word => 'A: ' + question + '\nB: ' + article(word) + word + '.';
      return {
        worksheets: [worksheet('Mini-Dialoge · ' + topic, [
          {heading: 'Wortbank', text: bank},
          {heading: 'So klingt der Dialog', text: example(first)},
          {heading: 'Jetzt seid ihr dran', text: 'Spielt den Dialog mit einem anderen Wort. Wechselt die Rollen. Schreibt danach einen Dialog mit zwei Zeilen auf.', lines: 2},
          {text: duration >= 50 ? 'Extra: Spielt zwei weitere Dialoge und lasst das Partnerkind auf das passende Wort in der Wortbank zeigen.' : 'Probiert den Dialog danach ohne Ablesen.'}
        ])],
        solutions: [worksheet('Beispieldialoge · ' + topic, [{text: example(first)}, {text: example(second)}, {text: 'Weitere Wörter aus der Wortbank sind möglich.'}], true)]
      };
    }
    const rotation = 1 + seed % (words.length - 1);
    const mixed = [...words.slice(rotation), ...words.slice(0, rotation)];
    return {
      worksheets: [worksheet('Wörter zuordnen · ' + topic, [
        {heading: 'Wortbank', text: mixed.map(([en]) => en).join('  ·  ')},
        {text: 'Schreibe zu jedem deutschen Wort das passende englische Wort.'},
        ...words.map(([, de], i) => ({text: (i + 1) + '. ' + de + '   ____________________________'})),
        {heading: 'Abdecken und wiederholen', text: duration >= 50 ? 'Decke die Wortbank ab. Schreibe alle Wörter, die du noch weißt, ins Heft. Prüfe und verbessere sie.' : 'Decke die Wortbank ab. Sage drei englische Wörter aus dem Kopf.'}
      ])],
      solutions: [worksheet('Lösungen · ' + topic, words.map(([en, de], i) => ({text: (i + 1) + '. ' + de + ' = ' + en})), true)]
    };
  }

  const options = {start: starters, work, end: endings};
  const labels = ['Einstieg', 'Arbeitsphase', 'Abschluss', 'Reserve'];

  function build(settings) {
    const {grade, duration, selection} = settings;
    const activeWork = work[selection.work];
    const phases = Object.keys(options).map((key, index) => {
      const option = options[key][selection[key]];
      return {key, label: labels[index], title: option.title, minutes: times[duration][index],
        note: typeof option.note === 'function' ? option.note({...settings, time: times[duration][index], work: activeWork}) : option.note};
    });
    phases.push({key: 'reserve', label: labels[3], title: 'Bei Bedarf nutzen', minutes: times[duration][3],
      note: 'Wenn Zeit übrig ist: Die Kinder erfinden eine eigene Aufgabe zur Arbeitsphase und tauschen sie mit einem Partnerkind. Bei Bedarf nutzt du die Zeit zum Fertigwerden.'});
    const pages = activeWork.pages(settings, selection.work);
    const title = activeWork.title + ' · ' + grade + '. Klasse';
    const equipment = 'Tafel, Stifte, Hefte und je Kind ein Satz Arbeitsblätter.';
    const plan = DailyTools.page('Vertretungsstunde', 'ABLAUF FÜR DIE LEHRKRAFT · LERNGARTEN');
    plan.text(44, 113, grade + '. Klasse · ' + duration + ' Minuten', 13, true);
    plan.para(44, 141, 'Material: ' + equipment, 507, 12);
    let y = 183;
    let elapsed = 0;
    for (const phase of phases) {
      plan.text(44, y, elapsed + '–' + (elapsed + phase.minutes) + ' Min. · ' + phase.label, 11, true, '#58704e');
      elapsed += phase.minutes;
      y = plan.para(44, y + 22, phase.title, 507, 14) + 5;
      y = plan.para(44, y, phase.note, 507, 12) + 24;
    }
    if (y > 802) throw Error('Der Ablauf ist für eine A4-Seite zu lang.');
    return {phases, title, equipment, plan: [plan.finish('Stundenablauf')], ...pages};
  }

  return {subjects, times, options, build};
})();
