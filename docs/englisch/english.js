(() => {
  'use strict';

  const topics = {
    colours: {
      title: 'Colours',
      words: [
        {en: 'red', de: 'Rot', colour: '#df4c4c'},
        {en: 'blue', de: 'Blau', colour: '#377acb'},
        {en: 'yellow', de: 'Gelb', colour: '#f4d345'},
        {en: 'green', de: 'Grün', colour: '#55a557'},
        {en: 'orange', de: 'Orange', colour: '#f09243'},
        {en: 'purple', de: 'Lila', colour: '#9469bd'}
      ],
      sentence: 'It is red.'
    },
    animals: {
      title: 'Animals',
      image: 'animals.jpg',
      words: [
        {en: 'cat', de: 'Katze'},
        {en: 'dog', de: 'Hund'},
        {en: 'bird', de: 'Vogel'},
        {en: 'fish', de: 'Fisch'},
        {en: 'rabbit', de: 'Kaninchen'},
        {en: 'mouse', de: 'Maus'}
      ],
      sentence: 'I can see a cat.'
    },
    school: {
      title: 'School things',
      image: 'school.jpg',
      words: [
        {en: 'book', de: 'Buch'},
        {en: 'pencil', de: 'Bleistift'},
        {en: 'ruler', de: 'Lineal'},
        {en: 'schoolbag', de: 'Schultasche'},
        {en: 'scissors', de: 'Schere'},
        {en: 'rubber', de: 'Radiergummi'}
      ],
      sentence: 'I can see a book.'
    }
  };

  const get = id => document.getElementById(id);
  const theme = get('theme');
  const solutions = get('solutions');
  const printStatus = get('printStatus');
  const audioStatus = get('audioStatus');
  const viewButtons = [...document.querySelectorAll('[data-view]')];
  let view = 'cards';
  let quizOrder = [];
  let step = 0;
  let exporting = false;

  function currentTopic() {
    return topics[theme.value];
  }

  const player = new Audio();

  function speak(word) {
    player.pause();
    player.src = EnglishAudio[word];
    audioStatus.textContent = '';
    player.play().catch(error => {
      if (error.name !== 'AbortError') {
        audioStatus.textContent = 'Das Hörbeispiel konnte nicht abgespielt werden.';
      }
    });
  }

  function picture(topic, index, decorative = false) {
    const word = topic.words[index];
    const element = document.createElement('span');
    element.className = 'picture';
    if (decorative) element.setAttribute('aria-hidden', 'true');
    else {
      element.setAttribute('role', 'img');
      element.setAttribute('aria-label', word.de);
    }
    if (word.colour) {
      element.classList.add('colour');
      element.style.backgroundColor = word.colour;
    } else {
      element.style.backgroundImage = 'url(' + topic.image + ')';
      element.style.backgroundPosition = (index % 3) * 50 + '% ' + Math.floor(index / 3) * 100 + '%';
    }
    return element;
  }

  function showCards() {
    const topic = currentTopic();
    const cards = topic.words.map((word, index) => {
      const card = document.createElement('article');
      card.className = 'word-card';
      const title = document.createElement('h2');
      title.lang = 'en';
      title.textContent = word.en;
      const meaning = document.createElement('p');
      meaning.textContent = word.de;
      const audio = document.createElement('button');
      audio.type = 'button';
      audio.textContent = 'Anhören';
      audio.setAttribute('aria-label', word.en + ' anhören');
      audio.addEventListener('click', () => speak(word.en));
      card.append(picture(topic, index, true), title, meaning, audio);
      return card;
    });
    get('wordCards').replaceChildren(...cards);
  }

  function shuffle(values) {
    const shuffled = [...values];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  function startQuiz() {
    step = 0;
    quizOrder = shuffle(currentTopic().words.map((_, index) => index));
    showQuestion();
  }

  function showQuestion(focus = false) {
    const finished = step === quizOrder.length;
    get('quizQuestion').hidden = finished;
    get('restart').hidden = !finished;
    get('progress').textContent = finished ? 'Du hast alle sechs Wörter richtig zugeordnet.'
      : 'Wort ' + (step + 1) + ' von ' + quizOrder.length;
    if (finished) {
      get('restart').focus();
      return;
    }
    const topic = currentTopic();
    const answer = quizOrder[step];
    const word = topic.words[answer];
    get('quizWord').textContent = word.en;
    get('quizSpeak').onclick = () => speak(word.en);
    get('feedback').textContent = '';
    get('next').hidden = true;
    const wrongChoices = shuffle(quizOrder.filter(index => index !== answer)).slice(0, 2);
    const buttons = shuffle([answer, ...wrongChoices]).map(index => {
      const button = document.createElement('button');
      button.type = 'button';
      button.append(picture(topic, index));
      button.addEventListener('click', () => {
        if (index !== answer) {
          get('feedback').textContent = 'Versuch es noch einmal.';
          return;
        }
        button.classList.add('correct');
        for (const choice of buttons) choice.disabled = true;
        get('feedback').textContent = 'Richtig! ' + word.en + ' heißt ' + word.de + '.';
        get('next').textContent = step === quizOrder.length - 1 ? 'Fertig' : 'Weiter';
        get('next').hidden = false;
        get('next').focus();
      });
      return button;
    });
    get('choices').replaceChildren(...buttons);
    if (focus) get('quizSpeak').focus();
  }

  function worksheetPage(topic, answer) {
    const title = (answer ? 'Lösung · ' : '') + topic.title;
    const page = DailyTools.page(title, 'ENGLISCHGARTEN · 2. KLASSE');
    page.text(44, 113, 'Name: _________________________    Datum: _______________', 11);
    page.text(44, 146, '1. Match the words and pictures.', 15, true);
    page.text(44, 168, 'Schreibe den passenden Buchstaben zum englischen Wort.', 11.5);

    const left = 78;
    const top = 186;
    const cell = 146;
    if (topic.image) page.image(left, top, cell * 3, cell * 2, topic.image);
    topic.words.forEach((word, index) => {
      const x = left + index % 3 * cell;
      const y = top + Math.floor(index / 3) * cell;
      if (word.colour) page.rect(x + 28, y + 25, 90, 85, word.colour, '#84957d', 8);
      page.rect(x + 4, y + 4, 26, 26, '#ffffff', '#84957d', 5);
      page.text(x + 17, y + 22, String.fromCharCode(65 + index), 13, true, '#274638', 'middle');
    });

    const order = [2, 5, 0, 4, 1, 3];
    order.forEach((index, position) => {
      const x = 47 + position % 3 * 170;
      const y = 512 + Math.floor(position / 3) * 43;
      page.text(x, y, topic.words[index].en, 17, true);
      page.line(x + 103, y + 3, x + 140, y + 3);
      if (answer) page.text(x + 122, y, String.fromCharCode(65 + index), 16, true, '#274638', 'middle');
    });

    page.line(44, 589, 551, 589);
    page.text(44, 624, '2. Read and copy.', 15, true);
    page.text(44, 647, 'Lies den Satz laut und schreibe ihn ab.', 11.5);
    page.text(44, 686, topic.sentence, 19);
    if (answer) page.text(44, 736, topic.sentence, 17);
    page.line(44, 742, 551, 742);
    return page.finish(answer ? 'Lösungsblatt' : 'Arbeitsblatt');
  }

  function pages() {
    const topic = currentTopic();
    const result = [worksheetPage(topic, false)];
    if (solutions.checked) result.push(worksheetPage(topic, true));
    return result;
  }

  function renderPrintPreview(worksheets) {
    get('preview').innerHTML = worksheets.map(svg => '<div class="sheet">' + svg + '</div>').join('');
  }

  function showWorksheet() {
    const worksheets = pages();
    renderPrintPreview(worksheets);
    printStatus.textContent = worksheets.length === 1 ? 'Eine A4-Seite.' : 'Zwei A4-Seiten mit Lösungsblatt.';
    if (theme.value === 'colours') printStatus.textContent += ' Für dieses Arbeitsblatt bitte in Farbe drucken.';
  }

  function showView(nextView) {
    if (nextView !== view) {
      player.pause();
      EnglishDialogues.pause();
      audioStatus.textContent = '';
    }
    view = nextView;
    get('vocabularyTheme').hidden = view === 'dialogues';
    for (const button of viewButtons) {
      const selected = button.dataset.view === view;
      button.setAttribute('aria-pressed', String(selected));
      get(button.dataset.view).hidden = !selected;
    }
    if (view === 'cards') showCards();
    if (view === 'quiz' && !quizOrder.length) startQuiz();
    if (view === 'worksheet') showWorksheet();
  }

  for (const button of viewButtons) {
    button.addEventListener('click', () => showView(button.dataset.view));
  }
  theme.addEventListener('change', () => {
    player.pause();
    audioStatus.textContent = '';
    quizOrder = [];
    showView(view);
  });
  get('next').addEventListener('click', () => {
    step++;
    showQuestion(true);
  });
  get('restart').addEventListener('click', startQuiz);
  solutions.addEventListener('change', showWorksheet);
  window.addEventListener('lerngarten-font-change', () => {
    if (view === 'worksheet') showWorksheet();
  });
  get('print').addEventListener('click', () => {
    showWorksheet();
    window.print();
  });
  get('dialoguePrint').addEventListener('click', () => window.print());
  window.addEventListener('beforeprint', () => {
    if (view === 'dialogues') renderPrintPreview(EnglishDialogues.pages());
    else showWorksheet();
    document.body.classList.add('printing');
  });
  window.addEventListener('afterprint', () => document.body.classList.remove('printing'));

  async function downloadPdf(makePages, filename, status, button) {
    if (exporting) return;
    exporting = true;
    button.disabled = true;
    status.textContent = 'A4-PDF wird erstellt …';
    try {
      const bytes = await LerngartenFont.pdf(makePages());
      const url = URL.createObjectURL(new Blob([bytes], {type: 'application/pdf'}));
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.append(link);
      link.click();
      link.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      status.textContent = 'A4-PDF erstellt.';
    } catch (error) {
      status.textContent = 'Das PDF konnte nicht erstellt werden. ' + error.message;
    } finally {
      exporting = false;
      button.disabled = false;
    }
  }

  get('pdf').addEventListener('click', () => {
    downloadPdf(pages, 'Englischgarten-' + theme.value + '-A4.pdf', printStatus, get('pdf'));
  });
  get('dialoguePdf').addEventListener('click', () => {
    const filename = 'Englischgarten-Dialog-' + get('dialogueTopic').value + '-A4.pdf';
    downloadPdf(EnglishDialogues.pages, filename, get('dialoguePrintStatus'), get('dialoguePdf'));
  });

  MaterialMappe.bindAdd(get('worksheetToFolder'), get('worksheetFolderStatus'), () => {
    const topic = currentTopic();
    return {
      title: topic.title,
      area: 'Englischgarten',
      worksheets: [worksheetPage(topic, false)],
      solutions: [worksheetPage(topic, true)]
    };
  });

  MaterialMappe.bindAdd(get('dialogueToFolder'), get('dialogueFolderStatus'), () => {
    const dialogue = get('dialogueTopic');
    const title = dialogue.selectedOptions[0].textContent;
    const item = dialogue.value === 'school' ? ' · ' + get('dialogueObject').selectedOptions[0].textContent : '';
    return {
      title: title + item,
      area: 'Englischgarten · Mini-Dialoge',
      worksheets: EnglishDialogues.pages()
    };
  });

  showView('cards');
})();
