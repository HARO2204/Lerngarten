(() => {
  'use strict';
  const get = id => document.getElementById(id);
  const status = get('status');
  let seed = 1;
  let model;
  let busy = false;

  function preview() {
    get('preview').innerHTML = model ? model.worksheets[Number(get('preview-level').value)] : '';
  }

  function buttons() {
    get('worksheets').disabled = busy || !model;
    get('solutions').disabled = busy || !model;
    get('collect').disabled = !model;
  }

  function render() {
    status.textContent = '';
    try {
      model = Lernstufen.build(get('topic').value, Number(get('range').value), seed);
      get('discussion').textContent = model.discussion;
    } catch (error) {
      model = null;
      get('discussion').textContent = '';
      status.textContent = 'Das Paket konnte nicht erstellt werden. ' + error.message;
    }
    preview();
    buttons();
  }

  async function download(kind, label) {
    if (busy || !model) return;
    const pages = model[kind];
    const filename = 'Lernstufen-' + get('topic').selectedOptions[0].textContent + '-bis-' + get('range').value + '-' + label + '-A4.pdf';
    busy = true;
    buttons();
    status.textContent = 'A4-PDF wird erstellt …';
    try {
      const bytes = await LerngartenFont.pdf(pages);
      const url = URL.createObjectURL(new Blob([bytes], {type: 'application/pdf'}));
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.append(link);
      link.click();
      link.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      status.textContent = 'PDF mit 3 A4-Seiten erstellt.';
    } catch (error) {
      status.textContent = 'Das PDF konnte nicht erstellt werden. ' + error.message;
    } finally {
      busy = false;
      buttons();
    }
  }

  get('topic').addEventListener('change', render);
  get('range').addEventListener('change', render);
  get('preview-level').addEventListener('change', preview);
  get('generate').addEventListener('click', () => {
    seed = (seed + 2654435769) >>> 0;
    render();
  });
  get('worksheets').addEventListener('click', () => download('worksheets', 'Kinderblaetter'));
  get('solutions').addEventListener('click', () => download('solutions', 'Loesungen'));
  MaterialMappe.bindAdd(get('collect'), status, () => ({...model, area: 'Mathegarten · Drei Lernstufen'}));
  window.addEventListener('lerngarten-font-change', render);
  render();
})();
