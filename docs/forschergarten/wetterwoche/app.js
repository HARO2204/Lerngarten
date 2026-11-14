(() => {
  const selector = document.getElementById('sheet');
  const status = document.getElementById('status');
  const worksheets = document.getElementById('worksheets');
  const solutions = document.getElementById('solutions');
  const buttons = [worksheets, solutions];

  function preview() {
    document.getElementById('preview').innerHTML = Wetterwoche.pages()[Number(selector.value)];
  }

  async function download(example) {
    buttons.forEach(button => { button.disabled = true; });
    status.textContent = 'A4-PDF wird erstellt …';
    try {
      const pages = Wetterwoche.pages();
      const bytes = await LerngartenFont.pdf(example ? pages.slice(3) : pages.slice(0, 3));
      const url = URL.createObjectURL(new Blob([bytes], {type: 'application/pdf'}));
      const link = document.createElement('a');
      link.href = url;
      link.download = example ? 'Wetterwoche-Beispielauswertung-A4.pdf' : 'Wetterwoche-A4.pdf';
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
  selector.addEventListener('change', preview);
  window.addEventListener('lerngarten-font-change', preview);
  worksheets.addEventListener('click', () => download(false));
  solutions.addEventListener('click', () => download(true));
  preview();
})();
