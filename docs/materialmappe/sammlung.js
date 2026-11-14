const MaterialMappe = (() => {
  const databaseName = 'lerngarten-materialmappe';
  const storeName = 'sammlung';
  const collectionKey = 'blaetter';
  const packagesKey = 'unterrichtspakete';
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

  // Keep the active materials at the original key for all worksheet generators.
  async function transact(update) {
    const database = await open();
    return new Promise((resolve, reject) => {
      const transaction = database.transaction(storeName, update ? 'readwrite' : 'readonly');
      const store = transaction.objectStore(storeName);
      const materials = store.get(collectionKey);
      const packages = store.get(packagesKey);
      let result;
      let failure;
      packages.onsuccess = () => {
        const state = packages.result || {activeId: '', draft: [], saved: []};
        const current = {items: materials.result || [], state};
        if (update) {
          try {
            update(current);
            store.put(current.items, collectionKey);
            store.put(state, packagesKey);
          } catch (error) {
            failure = error;
            transaction.abort();
            return;
          }
        }
        result = {
          items: current.items,
          activeId: state.activeId,
          packages: state.saved.map(({id, name}) => ({id, name}))
        };
      };
      transaction.oncomplete = () => resolve(result);
      transaction.onabort = () => reject(failure || transaction.error || Error('Speichern abgebrochen.'));
    });
  }

  function change(update) {
    return transact(current => update(current.items));
  }

  function archive(current) {
    const {state, items} = current;
    if (state.activeId) state.saved.find(item => item.id === state.activeId).items = items;
    else state.draft = items;
  }

  function openPackage(id) {
    return transact(current => {
      const {state} = current;
      if (state.activeId === id) return;
      const target = id && state.saved.find(item => item.id === id);
      if (id && !target) throw Error('Dieses Paket ist nicht mehr verfügbar.');
      archive(current);
      current.items = target ? target.items : state.draft;
      if (target) target.items = [];
      else state.draft = [];
      state.activeId = id;
    });
  }

  function savePackage(name, sourceId) {
    return transact(current => {
      const {state, items} = current;
      const cleanName = name.trim();
      if (!cleanName || cleanName.length > 80) throw Error('Gib einen Namen mit 1 bis 80 Zeichen ein.');
      if (state.saved.some(item => item.name.localeCompare(cleanName, 'de', {sensitivity: 'accent'}) === 0)) {
        throw Error('Es gibt schon ein Paket mit diesem Namen.');
      }
      if (state.activeId !== sourceId) throw Error('Die aktive Zusammenstellung hat sich geändert. Wähle das Paket erneut aus.');
      if (!items.length && !sourceId) throw Error('Füge vor dem Speichern mindestens ein Blatt hinzu.');
      // A copy retains the original. Saving the draft moves it to the new package.
      if (sourceId) archive(current);
      const id = crypto.randomUUID();
      state.saved.push({id, name: cleanName, items: []});
      state.activeId = id;
    });
  }

  function importPackage({name, items}) {
    return transact(current => {
      const {state} = current;
      const occupied = candidate => state.saved.some(item =>
        item.name.localeCompare(candidate, 'de', {sensitivity: 'accent'}) === 0);
      let uniqueName = name;
      for (let i = 2; occupied(uniqueName); i++) {
        const suffix = ' (' + i + ')';
        uniqueName = name.slice(0, 80 - suffix.length).trimEnd() + suffix;
      }
      archive(current);
      const id = crypto.randomUUID();
      state.saved.push({id, name: uniqueName, items: []});
      current.items = items;
      state.activeId = id;
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

  return {read: () => transact(), move, remove, bindAdd, openPackage, savePackage, importPackage};
})();
