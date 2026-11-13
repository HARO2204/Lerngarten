(() => {
  const selector = document.getElementById('sheet');
  const preview = document.getElementById('preview');
  const status = document.getElementById('status');
  const buttons = [...document.querySelectorAll('[data-download]')];
  const filenames = {diary: 'Forschertagebuch', cards: 'Schritt-Karten', teacher: 'Ablauf-Lehrkraft'};

  function showPreview() {
    const [kind, page] = selector.value.split(':');
    preview.innerHTML = PflanzenFuehrerschein[kind]()[Number(page)];
  }

  async function download(kind) {
    buttons.forEach(button => { button.disabled = true; });
    status.textContent = 'A4-PDF wird erstellt …';
    try {
      const bytes = await LerngartenFont.pdf(PflanzenFuehrerschein[kind]());
      const url = URL.createObjectURL(new Blob([bytes], {type: 'application/pdf'}));
      const link = document.createElement('a');
      link.href = url;
      link.download = 'Pflanzen-Fuehrerschein-' + filenames[kind] + '-A4.pdf';
      document.body.append(link);
      link.click();
      link.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      status.textContent = 'A4-PDF erstellt.';
    } catch (error) {
      status.textContent = 'PDF konnte nicht erstellt werden. ' + error.message;
    } finally {
      buttons.forEach(button => { button.disabled = false; });
    }
  }

  buttons.forEach(button => button.addEventListener('click', () => download(button.dataset.download)));
  selector.addEventListener('change', showPreview);
  window.addEventListener('lerngarten-font-change', showPreview);
  showPreview();
})();
