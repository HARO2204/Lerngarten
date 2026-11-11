(() => {
  'use strict';
  const get = id => document.getElementById(id);
  const status = get('status');
  let items = [];
  let busy = false;
  let refreshNumber = 0;

  function pageLabel(count) {
    return count + (count === 1 ? ' Seite' : ' Seiten');
  }

  function action(text, label, disabled, run) {
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = text;
    button.setAttribute('aria-label', label);
    button.disabled = disabled;
    button.addEventListener('click', run);
    return button;
  }

  function render(focusId) {
    const rows = items.map((item, index) => {
      const row = document.createElement('li');
      row.dataset.id = item.id;
      row.tabIndex = -1;
      const info = document.createElement('div');
      const title = document.createElement('strong');
      title.className = 'material-title';
      title.textContent = item.title;
      const detail = document.createElement('div');
      detail.className = 'small';
      detail.textContent = item.area + ' · ' + pageLabel(item.worksheets.length)
        + (item.solutions.length ? ' · ' + item.solutions.length + (item.solutions.length === 1 ? ' Lösungsseite' : ' Lösungsseiten') : '');
      info.append(title, detail);
      const controls = document.createElement('div');
      controls.className = 'row-actions';
      controls.append(
        action('↑', item.title + ' nach oben', busy || index === 0,
          () => update(() => MaterialMappe.move(item.id, -1), item.id)),
        action('↓', item.title + ' nach unten', busy || index === items.length - 1,
          () => update(() => MaterialMappe.move(item.id, 1), item.id)),
        action('Entfernen', item.title + ' entfernen', busy,
          () => update(() => MaterialMappe.remove(item.id)))
      );
      row.append(info, controls);
      return row;
    });
    get('materials').replaceChildren(...rows);
    const total = items.reduce((sum, item) => sum + item.worksheets.length, 0);
    const answers = items.reduce((sum, item) => sum + item.solutions.length, 0);
    get('count').textContent = pageLabel(total) + ' im A4-Paket'
      + (answers ? ' · ' + pageLabel(answers) + ' im Lösungspaket' : '');
    get('count').hidden = !items.length;
    get('empty').hidden = !!items.length;
    get('worksheets').disabled = busy || !total;
    get('solutions').disabled = busy || !answers;
    if (focusId) rows.find(row => row.dataset.id === focusId)?.focus();
  }

  async function refresh() {
    const request = ++refreshNumber;
    try {
      const stored = await MaterialMappe.list();
      if (busy || request !== refreshNumber) return;
      items = stored;
      render();
    } catch (error) {
      status.textContent = 'Die Materialmappe konnte nicht geladen werden. ' + error.message;
    }
  }

  async function update(change, focusId) {
    if (busy) return;
    busy = true;
    refreshNumber++;
    render();
    try {
      items = await change();
      status.textContent = '';
    } catch (error) {
      status.textContent = 'Die Änderung konnte nicht gespeichert werden. ' + error.message;
    } finally {
      busy = false;
      render(focusId);
    }
  }

  async function download(kind, filename) {
    if (busy) return;
    busy = true;
    render();
    status.textContent = 'A4-PDF wird erstellt …';
    try {
      items = await MaterialMappe.list();
      const pages = items.flatMap(item => item[kind]);
      if (!pages.length) {
        status.textContent = 'Für dieses Paket sind keine Seiten vorhanden.';
        return;
      }
      const bytes = await LerngartenFont.pdf(pages);
      const url = URL.createObjectURL(new Blob([bytes], {type: 'application/pdf'}));
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.append(link);
      link.click();
      link.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      status.textContent = 'A4-PDF mit ' + pageLabel(pages.length) + ' erstellt.';
    } catch (error) {
      status.textContent = 'Das PDF konnte nicht erstellt werden. ' + error.message;
    } finally {
      busy = false;
      render();
    }
  }

  get('worksheets').addEventListener('click', () => download('worksheets', 'Lerngarten-Materialmappe-A4.pdf'));
  get('solutions').addEventListener('click', () => download('solutions', 'Lerngarten-Loesungen-A4.pdf'));
  window.addEventListener('pageshow', refresh);
  window.addEventListener('focus', refresh);
  refresh();
})();
