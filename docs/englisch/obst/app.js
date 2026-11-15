(() => {
  const get = id => document.getElementById(id);
  const audio = new Audio();
  const audioStatus = get('audio-status');
  const status = get('status');
  const selector = get('fruit');
  const sheet = get('sheet');
  let quiz = [];
  let step = 0;
  let busy = false;

  function play(key, feedback = audioStatus) {
    audio.pause();
    audio.src = ObstAudio[key];
    feedback.textContent = '';
    audio.play().catch(error => {
      if (error.name !== 'AbortError') feedback.textContent = 'Das Hörbeispiel konnte nicht abgespielt werden.';
    });
  }

  function button(text, run) {
    const element = document.createElement('button');
    element.type = 'button';
    element.textContent = text;
    element.addEventListener('click', run);
    return element;
  }

  function shuffle(items) {
    return items.map(value => ({value, order: Math.random()})).sort((a, b) => a.order - b.order).map(item => item.value);
  }

  function showQuiz() {
    const finished = step === quiz.length;
    const next = get('quiz-next');
    const listen = get('quiz-listen');
    const feedback = get('feedback');
    get('progress').textContent = finished ? 'Alle sechs Wörter geschafft.' : 'Wort ' + (step + 1) + ' von ' + quiz.length;
    listen.disabled = finished;
    next.disabled = !finished;
    next.textContent = finished ? 'Noch einmal üben' : 'Nächstes Wort';
    feedback.textContent = '';
    if (finished) {
      get('choices').replaceChildren();
      next.focus();
      return;
    }
    const answer = quiz[step];
    listen.onclick = () => play(answer.en, feedback);
    const distractors = shuffle(Obst.fruit.filter(item => item !== answer)).slice(0, 2);
    const choices = shuffle([answer, ...distractors]).map(item => button(item.de, () => {
      if (item !== answer) {
        feedback.textContent = 'Hör noch einmal hin und versuche es erneut.';
        return;
      }
      choices.forEach(choice => { choice.disabled = true; });
      feedback.textContent = 'Richtig! ' + answer.en + ' heißt ' + answer.de + '.';
      next.disabled = false;
      next.focus();
    }));
    get('choices').replaceChildren(...choices);
  }

  get('quiz-next').addEventListener('click', () => {
    if (step === quiz.length) {
      quiz = shuffle(Obst.fruit);
      step = 0;
    } else step++;
    showQuiz();
    if (step !== quiz.length) get('quiz-listen').focus();
  });
  quiz = shuffle(Obst.fruit);
  showQuiz();

  get('words').replaceChildren(...Obst.fruit.map(item => {
    const control = button('', () => play(item.en));
    control.setAttribute('aria-label', item.en + ' anhören');
    const word = document.createElement('strong');
    word.lang = 'en';
    word.textContent = item.en;
    const translation = document.createElement('span');
    translation.textContent = item.de;
    control.append(word, translation);
    return control;
  }));
  selector.replaceChildren(...Obst.fruit.map(item => new Option(item.de, item.en)));
  function updateQuestion() {
    const item = Obst.fruit.find(item => item.en === selector.value);
    get('question').textContent = Obst.question(item);
  }
  selector.addEventListener('change', updateQuestion);
  get('dialogue-listen').addEventListener('click', () => play('ask-' + selector.value));
  get('yes').addEventListener('click', () => play('yes'));
  get('no').addEventListener('click', () => play('no'));
  updateQuestion();

  function preview() {
    get('preview').innerHTML = Obst.build().worksheets[Number(sheet.value)];
  }

  async function download(kind, filename) {
    if (busy) return;
    busy = true;
    status.textContent = 'A4-PDF wird erstellt …';
    try {
      const bytes = await LerngartenFont.pdf(Obst.build()[kind]);
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
      busy = false;
    }
  }
  get('worksheets').addEventListener('click', () => download('worksheets', 'My-favourite-fruit-A4.pdf'));
  get('solutions').addEventListener('click', () => download('solutions', 'My-favourite-fruit-Loesungen-A4.pdf'));
  MaterialMappe.bindAdd(get('collect'), status, Obst.build);
  sheet.addEventListener('change', preview);
  window.addEventListener('lerngarten-font-change', preview);
  preview();
})();
