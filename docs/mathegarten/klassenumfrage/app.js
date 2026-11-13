(() => {
  const get = id => document.getElementById(id);
  const mode = get('mode');
  const status = get('status');
  const buttons = [get('worksheets'), get('solutions')];
  const ownFields = ['question', 'choice1', 'choice2', 'choice3', 'choice4'].map(get);
  let packet;
  let busy = false;

  function updateButtons() {
    buttons.forEach(button => { button.disabled = busy || !packet; });
  }

  function render() {
    const example = mode.value === 'example';
    get('own').hidden = example;
    get('example').hidden = !example;
    get('solutions').hidden = !example;
    status.textContent = '';
    try {
      const [question, ...labels] = ownFields.map(input => input.value.trim());
      packet = Klassenumfrage.build(example ? Klassenumfrage.examples[Number(get('example-topic').value)] : {question, labels});
    } catch (error) {
      packet = null;
      status.textContent = error.message;
    }
    get('preview').innerHTML = packet?.worksheets[Number(get('sheet').value)] || '';
    updateButtons();
  }

  async function download(kind) {
    if (busy || !packet?.[kind].length) return;
    busy = true;
    updateButtons();
    status.textContent = 'A4-PDF wird erstellt …';
    try {
      const bytes = await LerngartenFont.pdf(packet[kind]);
      const url = URL.createObjectURL(new Blob([bytes], {type: 'application/pdf'}));
      const link = document.createElement('a');
      link.href = url;
      link.download = 'Unsere-Klasse-in-Zahlen-' + (kind === 'solutions' ? 'Loesungen' : 'Kinderblaetter') + '-A4.pdf';
      document.body.append(link);
      link.click();
      link.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      status.textContent = 'PDF mit 3 A4-Seiten erstellt.';
    } catch (error) {
      status.textContent = 'Das PDF konnte nicht erstellt werden. ' + error.message;
    } finally {
      busy = false;
      updateButtons();
    }
  }

  ownFields.forEach(input => input.addEventListener('input', render));
  [mode, get('example-topic'), get('sheet')].forEach(input => input.addEventListener('change', render));
  buttons.forEach(button => button.addEventListener('click', () => download(button.id)));
  window.addEventListener('lerngarten-font-change', render);
  render();
})();
