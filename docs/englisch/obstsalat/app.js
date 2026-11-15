(() => {
  const get = id => document.getElementById(id);
  const audio = new Audio();
  const applyTempo = Hoertempo.bind(audio, get('listen-speed'), .84);
  const status = get('status');
  let busy = false;

  function play(recipe, step) {
    const message = get('audio-status');
    message.textContent = '';
    audio.pause();
    audio.src = 'audio-' + (recipe + 1) + '-' + (step + 1) + '.mp3';
    applyTempo();
    audio.play().catch(error => {
      if (error.name !== 'AbortError') message.textContent = 'Das Hörbeispiel konnte nicht abgespielt werden.';
    });
  }

  function showRecipe() {
    audio.pause();
    get('audio-status').textContent = '';
    get('transcript').open = false;
    const index = Number(get('recipe').value);
    const recipe = Obstsalat.recipes[index];
    get('steps').replaceChildren(...recipe.map((_, step) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.textContent = 'Schritt ' + (step + 1) + ' anhören';
      button.addEventListener('click', () => play(index, step));
      return button;
    }));
    get('script').replaceChildren(...recipe.map(step => {
      const line = document.createElement('li');
      line.textContent = Obstsalat.phrase(step);
      return line;
    }));
  }

  function preview() {
    get('preview').innerHTML = Obstsalat.build().worksheets[Number(get('sheet').value)];
  }

  async function download(kind, filename) {
    if (busy) return;
    busy = true;
    status.textContent = 'A4-PDF wird erstellt …';
    try {
      const bytes = await LerngartenFont.pdf(Obstsalat.build()[kind]);
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

  get('recipe').addEventListener('change', showRecipe);
  get('sheet').addEventListener('change', preview);
  get('puzzle').addEventListener('click', () => play(0, 1));
  get('worksheets').addEventListener('click', () => download('worksheets', 'Fruit-salad-A4.pdf'));
  get('solutions').addEventListener('click', () => download('solutions', 'Fruit-salad-Loesungen-A4.pdf'));
  MaterialMappe.bindAdd(get('collect'), status, Obstsalat.build);
  window.addEventListener('lerngarten-font-change', preview);
  showRecipe();
  preview();
})();
