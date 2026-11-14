(() => {
  'use strict';
  const get = id => document.getElementById(id);
  const status = get('status');
  let view = {items: [], activeId: '', packages: []};
  let loaded = false;
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
    const {items, activeId, packages} = view;
    const name = packages.find(item => item.id === activeId)?.name;
    const packageSelect = get('package');
    packageSelect.replaceChildren(new Option('Lose Blätter', ''), ...packages.map(item => new Option(item.name, item.id)));
    packageSelect.value = activeId;
    packageSelect.disabled = busy || !loaded;
    get('active-title').textContent = name || 'Lose Blätter';
    get('package-name-label').textContent = name ? 'Name der Kopie' : 'Name des neuen Pakets';
    get('package-name').disabled = busy || !loaded;
    get('save').textContent = name ? 'Paket kopieren' : 'Paket speichern';
    get('save').disabled = busy || !loaded || (!name && !items.length);
    get('export-package').disabled = busy || !loaded || !name || !items.length;
    get('import-package').disabled = busy || !loaded;
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
      const stored = await MaterialMappe.read();
      if (busy || request !== refreshNumber) return;
      view = stored;
      loaded = true;
      render();
    } catch (error) {
      status.textContent = 'Die Materialmappe konnte nicht geladen werden. ' + error.message;
    }
  }

  async function update(change, focusId, message = '') {
    if (busy) return;
    busy = true;
    refreshNumber++;
    render();
    try {
      view = await change();
      status.textContent = message;
    } catch (error) {
      status.textContent = 'Die Änderung konnte nicht gespeichert werden. ' + error.message;
    } finally {
      busy = false;
      render(focusId);
    }
  }

  async function download(kind) {
    if (busy) return;
    busy = true;
    render();
    status.textContent = 'A4-PDF wird erstellt …';
    try {
      view = await MaterialMappe.read();
      const name = view.packages.find(item => item.id === view.activeId)?.name || 'Lerngarten-Materialmappe';
      const filename = name.replace(/[<>:"/\\|?*]/g, '-') + (kind === 'solutions' ? '-Loesungen-A4.pdf' : '-A4.pdf');
      const pages = view.items.flatMap(item => item[kind]);
      if (!pages.length) {
        status.textContent = 'Für dieses Paket sind keine Seiten vorhanden.';
        return;
      }
      const bytes = await LerngartenFont.pdf(pages);
      saveFile(new Blob([bytes], {type: 'application/pdf'}), filename);
      status.textContent = 'A4-PDF mit ' + pageLabel(pages.length) + ' erstellt.';
    } catch (error) {
      status.textContent = 'Das PDF konnte nicht erstellt werden. ' + error.message;
    } finally {
      busy = false;
      render();
    }
  }

  function saveFile(blob, filename) {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.append(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  async function exportPackage() {
    if (busy) return;
    busy = true;
    render();
    status.textContent = 'Paketdatei wird erstellt …';
    try {
      const latest = await MaterialMappe.read();
      if (latest.activeId !== view.activeId) throw Error('Die aktive Zusammenstellung hat sich geändert.');
      view = latest;
      const name = view.packages.find(item => item.id === view.activeId)?.name;
      if (!name || !view.items.length) throw Error('Öffne zuerst ein Paket mit Arbeitsblättern.');
      const blob = await Paketdatei.exportFile(name, view.items);
      saveFile(blob, name.replace(/[<>:"/\\|?*]/g, '-') + '.lerngarten.json');
      status.textContent = 'Paketdatei heruntergeladen.';
    } catch (error) {
      status.textContent = 'Export fehlgeschlagen. ' + error.message;
    } finally {
      busy = false;
      render();
    }
  }

  get('export-package').addEventListener('click', exportPackage);
  const fileInput = get('package-file');
  get('import-package').addEventListener('click', () => fileInput.click());
  fileInput.addEventListener('change', () => {
    const file = fileInput.files[0];
    fileInput.value = '';
    if (!file) return;
    update(async () => {
      const packet = await Paketdatei.readFile(file);
      const imported = await MaterialMappe.importPackage(packet);
      get('package-name').value = '';
      return imported;
    }, '', 'Paket importiert und geöffnet.');
  });
  get('package').addEventListener('change', event => {
    const id = event.target.value;
    get('package-name').value = '';
    update(() => MaterialMappe.openPackage(id), '', id ? 'Paket geöffnet.' : 'Lose Blätter geöffnet.');
  });
  get('save-package').addEventListener('submit', event => {
    event.preventDefault();
    const input = get('package-name');
    const sourceId = view.activeId;
    update(async () => {
      const saved = await MaterialMappe.savePackage(input.value, sourceId);
      input.value = '';
      return saved;
    }, '', sourceId ? 'Paket kopiert und geöffnet.' : 'Paket gespeichert.');
  });
  get('worksheets').addEventListener('click', () => download('worksheets'));
  get('solutions').addEventListener('click', () => download('solutions'));
  window.addEventListener('pageshow', refresh);
  window.addEventListener('focus', refresh);
  refresh();
})();
