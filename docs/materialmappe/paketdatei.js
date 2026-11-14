const Paketdatei = (() => {
  const format = 'lerngarten-unterrichtspaket';
  const maxBytes = 64 * 1024 * 1024;
  const svgNamespace = 'http://www.w3.org/2000/svg';
  const xmlns = 'http://www.w3.org/2000/xmlns/';
  const rasterMime = /^image\/(?:jpeg|png|webp|gif)$/i;
  const rasterData = /^data:image\/(?:jpeg|png|webp|gif);base64,[A-Za-z0-9+/]+={0,2}$/i;
  const elements = new Set('svg title desc g rect path line circle ellipse polygon polyline text tspan image'.split(' '));
  const attributes = new Set(('viewBox width height x y x1 x2 y1 y2 cx cy r rx ry d points transform ' +
    'fill stroke stroke-width stroke-dasharray stroke-linecap stroke-linejoin font-family font-size font-weight ' +
    'text-anchor textLength lengthAdjust preserveAspectRatio opacity fill-opacity stroke-opacity role aria-label').split(' '));
  const paint = /^(?:#[a-f0-9]{3,8}|[a-z]+|rgba?\([\d.,%\s]+\))$/i;

  function invalid() {
    return Error('Die Datei enthält eine ungültige Druckseite.');
  }

  function parsePage(source) {
    if (typeof source !== 'string' || !/^\s*<svg[\s>]/.test(source)) throw invalid();
    const document = new DOMParser().parseFromString(source, 'image/svg+xml');
    const root = document.documentElement;
    if (document.doctype || root.localName !== 'svg' || root.namespaceURI !== svgNamespace ||
        !/^0 0 595\.28 841\.89$/.test(root.getAttribute('viewBox'))) throw invalid();
    return root;
  }

  function validatePage(source) {
    const root = parsePage(source);
    for (const element of [root, ...root.querySelectorAll('*')]) {
      if (element.namespaceURI !== svgNamespace || !elements.has(element.localName)) throw invalid();
      for (const attribute of element.attributes) {
        const {name, value, namespaceURI} = attribute;
        if (namespaceURI === xmlns && (value === svgNamespace || value === 'http://www.w3.org/1999/xlink')) continue;
        if (name === 'href' && !namespaceURI && element.localName === 'image' && rasterData.test(value)) continue;
        if (namespaceURI || !attributes.has(name) || (['fill', 'stroke'].includes(name) && !paint.test(value))) throw invalid();
      }
      if (element.localName === 'image' && !rasterData.test(element.getAttribute('href') || '')) throw invalid();
    }
    // Serialize just the SVG element, dropping any surrounding XML instructions.
    return new XMLSerializer().serializeToString(root);
  }

  async function embedPage(source, cache) {
    const root = parsePage(source);
    for (const image of root.querySelectorAll('image')) {
      const href = image.getAttribute('href') || image.getAttributeNS('http://www.w3.org/1999/xlink', 'href');
      if (rasterData.test(href || '')) continue;
      if (!href) throw invalid();
      const url = new URL(href, location.href);
      if (url.origin !== location.origin) throw Error('Ein Bild liegt außerhalb des Lerngartens.');
      if (!cache.has(url.href)) {
        const response = await fetch(url, {redirect: 'error'});
        if (!response.ok) throw Error('Ein Arbeitsblattbild konnte nicht geladen werden.');
        const blob = await response.blob();
        if (!rasterMime.test(blob.type)) throw invalid();
        const data = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result);
          reader.onerror = () => reject(reader.error);
          reader.readAsDataURL(blob);
        });
        cache.set(url.href, data);
      }
      image.setAttribute('href', cache.get(url.href));
      image.removeAttributeNS('http://www.w3.org/1999/xlink', 'href');
    }
    return validatePage(new XMLSerializer().serializeToString(root));
  }

  async function exportFile(name, items) {
    const cache = new Map();
    const materials = [];
    for (const {title, area, worksheets, solutions} of items) {
      const material = {title, area, worksheets: [], solutions: []};
      for (const source of worksheets) material.worksheets.push(await embedPage(source, cache));
      for (const source of solutions) material.solutions.push(await embedPage(source, cache));
      materials.push(material);
    }
    const blob = new Blob([JSON.stringify({format, version: 1, name, materials})], {type: 'application/json'});
    if (blob.size > maxBytes) throw Error('Die Paketdatei darf höchstens 64 MB groß sein.');
    return blob;
  }

  async function readFile(file) {
    if (file.size > maxBytes) throw Error('Die Paketdatei darf höchstens 64 MB groß sein.');
    let packet;
    try {
      packet = JSON.parse(await file.text());
    } catch {
      throw Error('Diese Datei ist kein Lerngarten-Unterrichtspaket.');
    }
    if (packet?.format !== format || packet.version !== 1 ||
        typeof packet.name !== 'string' || !packet.name.trim() || packet.name.length > 80 ||
        !Array.isArray(packet.materials) || !packet.materials.length) {
      throw Error('Diese Datei ist kein unterstütztes Lerngarten-Unterrichtspaket.');
    }
    const items = packet.materials.map(item => {
      if (typeof item?.title !== 'string' || typeof item.area !== 'string' ||
          !Array.isArray(item.worksheets) || !item.worksheets.length || !Array.isArray(item.solutions)) throw invalid();
      return {
        id: crypto.randomUUID(),
        title: item.title,
        area: item.area,
        worksheets: item.worksheets.map(validatePage),
        solutions: item.solutions.map(validatePage)
      };
    });
    return {name: packet.name.trim(), items};
  }

  return {exportFile, readFile};
})();
