const EnglishDialogues = (() => {
  const get = id => document.getElementById(id);
  const topic = get('dialogueTopic');
  const object = get('dialogueObject');
  const help = get('dialogueHelp');
  const player = get('dialoguePlayer');
  const audioStatus = get('dialogueAudioStatus');
  const schoolWords = {
    pencil: 'ein Bleistift',
    book: 'ein Buch',
    ruler: 'ein Lineal',
    schoolbag: 'eine Schultasche',
    rubber: 'ein Radiergummi'
  };

  function current() {
    if (topic.value === 'hello') {
      return {
        key: 'hello',
        title: 'Sich begrüßen',
        turns: [
          {role: 'A', en: 'Hello! What’s your name?', de: 'Hallo! Wie heißt du?'},
          {role: 'B', en: 'Hi! I’m Mia. What’s your name?', de: 'Hallo! Ich bin Mia. Wie heißt du?'},
          {role: 'A', en: 'I’m Leo.', de: 'Ich bin Leo.'},
          {role: 'B', en: 'Nice to meet you!', de: 'Schön, dich kennenzulernen!'}
        ],
        practice: 'Sprecht das Gespräch zu zweit. Tauscht danach die Rollen und verwendet eure eigenen Namen.'
      };
    }

    const word = object.value;
    const german = schoolWords[word];
    return {
      key: word,
      title: 'Nach einer Schulsache fragen',
      turns: [
        {role: 'A', en: 'What’s this?', de: 'Was ist das?'},
        {role: 'B', en: 'It’s a ' + word + '.', de: 'Das ist ' + german + '.'}
      ],
      practice: 'Zeigt auf eine Schulsache und spielt das Gespräch. Tauscht die Rollen und nehmt danach eine andere Schulsache.'
    };
  }

  function renderLines(dialogue) {
    const lines = dialogue.turns.map(turn => {
      const row = document.createElement('li');
      row.className = turn.role === 'A' ? 'role-a' : 'role-b';
      const role = document.createElement('span');
      role.className = 'dialogue-role';
      role.textContent = 'Rolle ' + turn.role;
      const content = document.createElement('div');
      const english = document.createElement('p');
      english.lang = 'en';
      english.textContent = turn.en;
      const translation = document.createElement('p');
      translation.className = 'translation';
      translation.hidden = !help.checked;
      translation.textContent = turn.de;
      content.append(english, translation);
      row.append(role, content);
      return row;
    });
    get('dialogueLines').replaceChildren(...lines);
  }

  function render() {
    const dialogue = current();
    get('objectChoice').hidden = topic.value !== 'school';
    get('dialoguePractice').textContent = dialogue.practice;
    renderLines(dialogue);
    player.pause();
    audioStatus.textContent = '';
    player.src = EnglishDialogueAudio[dialogue.key];
  }

  function roleCards(dialogue) {
    const page = DailyTools.page('Rollenkarten · ' + dialogue.title, 'ENGLISCHGARTEN · PARTNERARBEIT');
    for (const [index, role] of ['A', 'B'].entries()) {
      const top = index === 0 ? 108 : 446;
      const shade = role === 'A' ? '#f0f4e9' : '#f7efe1';
      page.rect(44, top, 507, 310, shade, '#aab99c', 9);
      page.text(62, top + 36, 'Rolle ' + role, 21, true);
      page.para(62, top + 64, 'Lies deine Sätze an der passenden Stelle.', 469, 12);
      let y = top + 113;
      dialogue.turns.forEach((turn, i) => {
        if (turn.role !== role) return;
        page.para(62, y, (i + 1) + '. ' + turn.en, 469, 17);
        y += 49;
      });
      page.para(62, top + 236, dialogue.practice, 469, 12.5);
    }
    page.line(44, 432, 551, 432);
    return page.finish('Rollenkarten');
  }

  function takeHome(dialogue) {
    const page = DailyTools.page('Englisch zum Mitnehmen', 'ENGLISCHGARTEN · 2. KLASSE');
    page.text(44, 115, 'Name: ____________________________    Datum: _______________', 11);
    page.text(44, 157, dialogue.title, 18, true);
    page.para(44, 185, 'Lies das Gespräch laut. Du kannst es mit jemandem nachspielen oder beide Rollen selbst sprechen.', 507, 12);
    dialogue.turns.forEach((turn, i) => {
      const y = 232 + i * 55;
      page.rect(44, y, 507, 45, turn.role === 'A' ? '#f0f4e9' : '#f7efe1', '#c7d3bd', 6);
      page.text(58, y + 28, 'Rolle ' + turn.role, 11, true);
      page.text(124, y + 28, turn.en, 16);
    });
    page.line(44, 484, 551, 484);
    const hello = dialogue.key === 'hello';
    page.text(44, 525, hello ? 'Jetzt mit deinem Namen' : 'Jetzt mit einer anderen Schulsache', 17, true);
    page.para(44, 553, hello
      ? 'Schreibe deinen Namen in die Lücke. Sprich den ganzen Satz.'
      : 'Wähle ein Wort aus der Liste. Schreibe es in die Lücke und sprich den ganzen Satz.', 507, 12);
    page.text(44, 614, hello ? 'I’m ____________________________.' : 'It’s a ____________________________.', 19);
    if (!hello) {
      page.para(44, 657, 'pencil · book · ruler · schoolbag · rubber', 507, 13);
    }
    return page.finish('Übungsblatt zum Mitnehmen');
  }

  topic.addEventListener('change', render);
  object.addEventListener('change', render);
  help.addEventListener('change', () => renderLines(current()));
  player.addEventListener('error', () => {
    audioStatus.textContent = 'Das Hörbeispiel konnte nicht abgespielt werden.';
  });
  render();

  return {
    pages() {
      const dialogue = current();
      return [roleCards(dialogue), takeHome(dialogue)];
    },
    pause() { player.pause(); }
  };
})();
