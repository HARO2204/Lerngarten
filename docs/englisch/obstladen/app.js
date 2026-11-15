(() => {
  const get = id => document.getElementById(id);
  const audio = get('audio');
  const status = get('status');
  const selection = get('dialogue');
  const buttons = ['worksheets', 'solutions'].map(get);

  const audioStatus = get('audio-status');
  const applyTempo = Hoertempo.bind(audio, get('listen-speed'));

  function setAudio(source) {
    audio.pause();
    audioStatus.textContent = '';
    audio.src = source;
    applyTempo();
  }

  function showDialogue() {
    const index = Number(selection.value);
    const order = Obstladen.orders[index];
    const lines = index === 2 ? [Obstladen.request(order)] : Obstladen.dialogue(order);
    setAudio('slow-dialog-' + (index + 1) + '.mp3');
    get('transcript').open = false;
    get('lines').replaceChildren(...lines.map((text, i) => {
      const line = document.createElement('li');
      line.textContent = (i === 1 ? 'Shopkeeper: ' : 'Customer: ') + text;
      return line;
    }));
    const sources = lines.length === 1
      ? ['slow-dialog-3.mp3']
      : ['sentence-order-' + (index + 1) + '.mp3', 'sentence-here.mp3', 'sentence-thanks.mp3'];
    const clips = [{label: lines.length === 1 ? 'Bestellung anhören' : 'Ganzen Dialog anhören', source: 'slow-dialog-' + (index + 1) + '.mp3'}];
    if (lines.length > 1) sources.forEach((source, i) => clips.push({label: 'Satz ' + (i + 1), source}));
    get('sentence-buttons').replaceChildren(...clips.map(({label, source}) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.textContent = label;
      button.addEventListener('click', () => {
        setAudio(source);
        audio.play().catch(error => {
          if (error.name !== 'AbortError') audioStatus.textContent = 'Das Hörbeispiel konnte nicht abgespielt werden.';
        });
      });
      return button;
    }));
  }

  function preview() {
    get('preview').innerHTML = Obstladen.build().worksheets[Number(get('sheet').value)];
  }

  async function download(kind, filename) {
    buttons.forEach(button => { button.disabled = true; });
    status.textContent = 'A4-PDF wird erstellt …';
    try {
      const bytes = await LerngartenFont.pdf(Obstladen.build()[kind]);
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
      buttons.forEach(button => { button.disabled = false; });
    }
  }

  selection.addEventListener('change', showDialogue);
  get('sheet').addEventListener('change', preview);
  get('worksheets').addEventListener('click', () => download('worksheets', 'At-the-fruit-shop-A4.pdf'));
  get('solutions').addEventListener('click', () => download('solutions', 'At-the-fruit-shop-Loesungen-A4.pdf'));
  MaterialMappe.bindAdd(get('collect'), status, Obstladen.build);
  window.addEventListener('lerngarten-font-change', preview);
  showDialogue();
  preview();
})();
