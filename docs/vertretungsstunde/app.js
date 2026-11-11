(() => {
  'use strict';
  const get = id => document.getElementById(id);
  const phaseKeys = Object.keys(Vertretung.options);
  const outputs = [
    ['plan-pdf', 'plan', 'Ablauf'],
    ['work-pdf', 'worksheets', 'Arbeitsblaetter'],
    ['solutions-pdf', 'solutions', 'Loesungen']
  ];
  let seed = 1;
  let model;
  let busy = false;

  for (const key of phaseKeys) {
    for (const [subject, label] of Object.entries(Vertretung.subjects)) {
      const group = document.createElement('optgroup');
      group.label = label;
      Vertretung.options[key].forEach((option, index) => {
        if (option.subject === subject) group.append(new Option(option.title, index));
      });
      get(key).append(group);
    }
    get(key).addEventListener('change', render);
  }

  function selectSuggestion() {
    const subject = get('subject').value;
    for (const [phaseIndex, key] of phaseKeys.entries()) {
      const matching = Vertretung.options[key].map((option, index) => option.subject === subject ? index : -1).filter(index => index >= 0);
      const variant = Math.floor((seed - 1) / 2 ** phaseIndex) % matching.length;
      get(key).value = matching[variant];
    }
    render();
  }

  function setButtons() {
    for (const [id] of outputs) get(id).disabled = busy || !model;
    get('collect').disabled = !model;
  }

  function render() {
    const grade = Number(get('grade').value);
    const duration = Number(get('duration').value);
    const selection = Object.fromEntries(phaseKeys.map(key => [key, Number(get(key).value)]));
    get('status').textContent = '';
    try {
      model = Vertretung.build({grade, duration, seed, selection});
      get('plan-details').textContent = grade + '. Klasse · ' + duration + ' Minuten';
      let elapsed = 0;
      for (const phase of model.phases) {
        get(phase.key + '-time').textContent = elapsed + '–' + (elapsed + phase.minutes) + ' Min.';
        get(phase.key + '-note').textContent = phase.note;
        elapsed += phase.minutes;
      }
      get('equipment').textContent = 'Material: ' + model.equipment;
      const count = model.worksheets.length;
      get('preview-label').textContent = 'Vorschau der Arbeitsblätter · ' + count + (count === 1 ? ' A4-Seite' : ' A4-Seiten');
      get('preview').innerHTML = model.worksheets.join('');
      get('preview-box').hidden = false;
    } catch (error) {
      model = null;
      get('preview-box').hidden = true;
      get('status').textContent = 'Der Stundenablauf konnte nicht erstellt werden. ' + error.message;
    }
    setButtons();
  }

  async function download(kind, filename) {
    if (busy || !model) return;
    const pages = model[kind];
    busy = true;
    setButtons();
    get('status').textContent = 'A4-PDF wird erstellt …';
    try {
      const bytes = await LerngartenFont.pdf(pages);
      const url = URL.createObjectURL(new Blob([bytes], {type: 'application/pdf'}));
      const link = document.createElement('a');
      link.href = url;
      link.download = 'Vertretungsstunde-' + filename + '-A4.pdf';
      document.body.append(link);
      link.click();
      link.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      get('status').textContent = 'A4-PDF erstellt.';
    } catch (error) {
      get('status').textContent = 'Das PDF konnte nicht erstellt werden. ' + error.message;
    } finally {
      busy = false;
      setButtons();
    }
  }

  get('subject').addEventListener('change', () => { seed = 1; selectSuggestion(); });
  get('grade').addEventListener('change', render);
  get('duration').addEventListener('change', render);
  get('generate').addEventListener('click', () => { seed++; selectSuggestion(); });
  for (const [id, kind, filename] of outputs) get(id).addEventListener('click', () => download(kind, filename));
  MaterialMappe.bindAdd(get('collect'), get('status'), () => ({
    title: model.title,
    area: 'Vertretungsstunde',
    worksheets: model.worksheets,
    solutions: model.solutions
  }));
  window.addEventListener('lerngarten-font-change', render);
  selectSuggestion();
})();
