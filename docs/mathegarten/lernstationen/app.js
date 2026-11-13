(() => {
  const get = id => document.getElementById(id);
  const checks = [...document.querySelectorAll('[name=station]')];
  const buttons = ['worksheets', 'solutions', 'collect'].map(get);
  const selector = get('sheet');
  const status = get('status');
  let packet;
  let busy = false;

  function updateButtons() {
    buttons.forEach(button => { button.disabled = busy || !packet; });
  }

  function preview() {
    get('preview').innerHTML = packet?.worksheets[Number(selector.value)] || '';
  }

  function render() {
    const selected = checks.filter(check => check.checked).map(check => check.value);
    const all = selected.length === checks.length;
    get('choice').hidden = !all;
    status.textContent = '';
    get('preparation').textContent = selected.length
      ? 'Vorbereitung: ' + selected.map(id => Lernstationen.stations[id].materials).join(' · ') + '.'
      : '';
    const previous = selector.selectedOptions[0]?.textContent;
    try {
      packet = Lernstationen.build(selected, all ? get('optional').value : '');
      const labels = packet.labels;
      selector.replaceChildren(...labels.map((label, index) => new Option(label, index)));
      selector.value = Math.max(0, labels.indexOf(previous));
      get('count').textContent = selected.length + ' Stationen · ' + packet.worksheets.length + ' A4-Seiten · 1 Lösungsblatt';
    } catch (error) {
      packet = null;
      selector.replaceChildren();
      get('count').textContent = error.message;
    }
    selector.disabled = !packet;
    preview();
    updateButtons();
  }

  async function download(kind) {
    if (busy || !packet) return;
    const pages = packet[kind];
    busy = true;
    updateButtons();
    status.textContent = 'A4-PDF wird erstellt …';
    try {
      const bytes = await LerngartenFont.pdf(pages);
      const url = URL.createObjectURL(new Blob([bytes], {type: 'application/pdf'}));
      const link = document.createElement('a');
      link.href = url;
      link.download = 'Messen-im-Schulalltag-' + (kind === 'solutions' ? 'Loesung' : 'Stationen') + '-A4.pdf';
      document.body.append(link);
      link.click();
      link.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      status.textContent = 'A4-PDF erstellt.';
    } catch (error) {
      status.textContent = 'PDF konnte nicht erstellt werden. ' + error.message;
    } finally {
      busy = false;
      updateButtons();
    }
  }

  checks.forEach(check => check.addEventListener('change', render));
  get('optional').addEventListener('change', render);
  selector.addEventListener('change', preview);
  get('worksheets').addEventListener('click', () => download('worksheets'));
  get('solutions').addEventListener('click', () => download('solutions'));
  MaterialMappe.bindAdd(get('collect'), status, () => ({...packet, area: 'Mathegarten · Lernstationen'}));
  window.addEventListener('lerngarten-font-change', render);
  render();
})();
