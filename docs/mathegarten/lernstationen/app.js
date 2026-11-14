(() => {
  const get = id => document.getElementById(id);
  const topic = get('topic');
  const slugs = {literacy: 'lesen', english: 'englisch'};
  const areas = {math: 'Mathegarten', literacy: 'Lesegarten', english: 'Englischgarten'};
  const stationOptions = get('station-options');
  const optional = get('optional');
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

  function changeTopic() {
    const {title, stations} = Lernstationen.topics[topic.value];
    get('preview-heading').textContent = title;
    const names = Object.entries(stations);
    stationOptions.replaceChildren(...names.map(([id, station], index) => {
      const label = document.createElement('label');
      const check = document.createElement('input');
      check.type = 'checkbox';
      check.name = 'station';
      check.value = id;
      check.checked = index < 2;
      label.append(check, ' ' + station.title);
      return label;
    }));
    optional.replaceChildren(new Option('Alle drei sind Pflicht', ''), ...names.map(([id, station]) => new Option(station.title, id)));
    const url = new URL(location.href);
    if (slugs[topic.value]) url.searchParams.set('thema', slugs[topic.value]);
    else url.searchParams.delete('thema');
    history.replaceState(null, '', url);
    render();
  }

  function render() {
    const checks = [...stationOptions.querySelectorAll('input')];
    const {stations} = Lernstationen.topics[topic.value];
    const selected = checks.filter(check => check.checked).map(check => check.value);
    const all = selected.length === checks.length;
    get('choice').hidden = !all;
    status.textContent = '';
    get('preparation').textContent = selected.length
      ? 'Vorbereitung: ' + selected.map(id => stations[id].materials).join(' · ') + '.'
      : '';
    const previous = selector.selectedOptions[0]?.textContent;
    try {
      packet = Lernstationen.build(selected, all ? optional.value : '', topic.value);
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
    const title = packet.title.replaceAll(' ', '-');
    busy = true;
    updateButtons();
    status.textContent = 'A4-PDF wird erstellt …';
    try {
      const bytes = await LerngartenFont.pdf(pages);
      const url = URL.createObjectURL(new Blob([bytes], {type: 'application/pdf'}));
      const link = document.createElement('a');
      link.href = url;
      link.download = title + '-' + (kind === 'solutions' ? 'Loesung' : 'Stationen') + '-A4.pdf';
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

  topic.addEventListener('change', changeTopic);
  stationOptions.addEventListener('change', render);
  optional.addEventListener('change', render);
  selector.addEventListener('change', preview);
  get('worksheets').addEventListener('click', () => download('worksheets'));
  get('solutions').addEventListener('click', () => download('solutions'));
  MaterialMappe.bindAdd(get('collect'), status, () => ({...packet, area: areas[topic.value] + ' · Lernstationen'}));
  window.addEventListener('lerngarten-font-change', render);
  const slug = new URLSearchParams(location.search).get('thema');
  topic.value = Object.keys(slugs).find(key => slugs[key] === slug) || 'math';
  changeTopic();
})();
