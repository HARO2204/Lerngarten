(() => {
  'use strict';
  const get = id => document.getElementById(id);
  const status = get('status');
  const area = get('area');
  const topic = get('topic');
  const sheet = get('sheet');
  let model;
  let busy = false;

  function showOptions(select, labels) {
    select.replaceChildren(...labels.map((label, index) => new Option(label, index)));
  }

  function preview() {
    get('preview').innerHTML = model?.worksheets[Number(sheet.value)] || '';
  }

  function updateButtons() {
    for (const id of ['worksheets', 'solutions', 'coins']) get(id).disabled = busy || !model;
    get('collect').disabled = !model;
  }

  function render() {
    status.textContent = '';
    try {
      model = KlasseZwei.build(area.value, Number(topic.value));
      get('discussion').textContent = model.discussion;
    } catch (error) {
      model = null;
      get('discussion').textContent = '';
      status.textContent = 'Das Paket konnte nicht erstellt werden. ' + error.message;
    }
    preview();
    updateButtons();
  }

  function changeArea() {
    const lesson = KlasseZwei.lessons[area.value];
    get('title').textContent = lesson.title;
    get('intro').textContent = lesson.intro;
    get('topic-label').textContent = lesson.label;
    get('coins').hidden = area.value !== 'shop';
    showOptions(topic, lesson.topics);
    showOptions(sheet, lesson.sheets);
    const url = new URL(location.href);
    url.searchParams.set('werkstatt', area.value);
    history.replaceState(null, '', url);
    render();
  }

  async function download(kind, suffix) {
    if (busy || !model) return;
    busy = true;
    updateButtons();
    status.textContent = 'A4-PDF wird erstellt …';
    try {
      const pages = kind === 'coins' ? [KlasseZwei.coins()] : model[kind];
      const filename = kind === 'coins' ? 'Spielgeld-A4.pdf' : model.title + '-' + suffix + '-A4.pdf';
      const bytes = await LerngartenFont.pdf(pages);
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
      updateButtons();
    }
  }

  area.addEventListener('change', changeArea);
  topic.addEventListener('change', render);
  sheet.addEventListener('change', preview);
  get('worksheets').addEventListener('click', () => download('worksheets', 'Kinderblätter'));
  get('solutions').addEventListener('click', () => download('solutions', 'Lösungen'));
  get('coins').addEventListener('click', () => download('coins'));
  MaterialMappe.bindAdd(get('collect'), status, () => ({
    ...model,
    area: KlasseZwei.lessons[area.value].title + ' · 2. Klasse'
  }));
  window.addEventListener('lerngarten-font-change', render);
  const initialArea = new URLSearchParams(location.search).get('werkstatt');
  if (Object.hasOwn(KlasseZwei.lessons, initialArea)) area.value = initialArea;
  changeArea();
})();
