const MaterialMappe = (() => {
  const databaseName = 'lerngarten-materialmappe';
  const storeName = 'sammlung';
  const collectionKey = 'blaetter';
  let connection;

  function open() {
    if (connection) return connection;
    connection = new Promise((resolve, reject) => {
      const request = indexedDB.open(databaseName, 1);
      request.onupgradeneeded = () => request.result.createObjectStore(storeName);
      request.onsuccess = () => {
        const database = request.result;
        database.onversionchange = () => {
          database.close();
          connection = undefined;
        };
        resolve(database);
      };
      request.onerror = () => reject(request.error);
    }).catch(error => {
      connection = undefined;
      throw error;
    });
    return connection;
  }

  async function list() {
    const database = await open();
    return new Promise((resolve, reject) => {
      const request = database.transaction(storeName).objectStore(storeName).get(collectionKey);
      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
    });
  }

  async function change(update) {
    const database = await open();
    return new Promise((resolve, reject) => {
      const transaction = database.transaction(storeName, 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.get(collectionKey);
      let items;
      request.onsuccess = () => {
        items = request.result || [];
        update(items);
        store.put(items, collectionKey);
      };
      transaction.oncomplete = () => resolve(items);
      transaction.onabort = () => reject(transaction.error || Error('Speichern abgebrochen.'));
    });
  }

  function keepImagePaths(source) {
    if (!source.includes('<image')) return source;
    const document = new DOMParser().parseFromString(source, 'image/svg+xml');
    if (document.querySelector('parsererror')) throw Error('Die Druckseite konnte nicht gelesen werden.');
    for (const image of document.querySelectorAll('image[href]')) {
      const href = image.getAttribute('href');
      if (href && !href.startsWith('data:')) image.setAttribute('href', new URL(href, location.href).href);
    }
    return new XMLSerializer().serializeToString(document.documentElement);
  }

  function add({title, area, worksheets, solutions = []}) {
    if (!worksheets.length) throw Error('Erstelle zuerst ein Arbeitsblatt.');
    const item = {
      id: crypto.randomUUID(),
      title,
      area,
      worksheets: worksheets.map(keepImagePaths),
      solutions: solutions.map(keepImagePaths)
    };
    return change(items => items.push(item));
  }

  function move(id, offset) {
    return change(items => {
      const index = items.findIndex(item => item.id === id);
      const next = index + offset;
      if (index < 0 || next < 0 || next >= items.length) return;
      [items[index], items[next]] = [items[next], items[index]];
    });
  }

  function remove(id) {
    return change(items => {
      const index = items.findIndex(item => item.id === id);
      if (index >= 0) items.splice(index, 1);
    });
  }

  function bindAdd(button, status, snapshot) {
    let saving = false;
    button.addEventListener('click', async () => {
      if (saving) return;
      saving = true;
      button.setAttribute('aria-busy', 'true');
      status.textContent = 'Wird zur Mappe hinzugefügt …';
      try {
        await add(await snapshot());
        status.textContent = 'Zur Materialmappe hinzugefügt.';
      } catch (error) {
        status.textContent = 'Hinzufügen fehlgeschlagen. ' + error.message;
      } finally {
        saving = false;
        button.removeAttribute('aria-busy');
      }
    });
  }

  return {list, move, remove, bindAdd};
})();
