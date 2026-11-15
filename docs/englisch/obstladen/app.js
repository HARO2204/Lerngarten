(() => {
  const get = id => document.getElementById(id);
  const audio = get('audio');
  const status = get('status');
  const selection = get('dialogue');
  const buttons = ['worksheets', 'solutions'].map(get);

  function showDialogue() {
    const index = Number(selection.value);
    const order = Obstladen.orders[index];
    const lines = index === 2 ? [Obstladen.request(order)] : Obstladen.dialogue(order);
    audio.pause();
    audio.src = 'dialog-' + (index + 1) + '.mp3';
    get('transcript').open = false;
    get('lines').replaceChildren(...lines.map((text, i) => {
      const line = document.createElement('li');
      line.textContent = (i === 1 ? 'Shopkeeper: ' : 'Customer: ') + text;
      return line;
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
