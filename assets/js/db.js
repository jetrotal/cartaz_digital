const DB = {
  dbName: 'AgendaCache', version: 1, db: null,
  async open() {
    return new Promise((resolve, reject) => {
      const req = indexedDB.open(this.dbName, this.version);
      req.onupgradeneeded = e => {
        const db = e.target.result;
        if (!db.objectStoreNames.contains('events')) db.createObjectStore('events', { keyPath: 'id' });
        if (!db.objectStoreNames.contains('assets')) db.createObjectStore('assets', { keyPath: 'url' });
      };
      req.onsuccess = e => { this.db = e.target.result; resolve(this.db); };
      req.onerror = e => reject(e);
    });
  },
  async put(store, data) {
    if(!this.db) return;
    return new Promise((r, j) => { const tx=this.db.transaction(store,'readwrite'); tx.objectStore(store).put(data); tx.oncomplete=r; tx.onerror=j; });
  },
  async get(store, key) {
    if(!this.db) return null;
    return new Promise((r) => { const tx=this.db.transaction(store,'readonly'); const req=tx.objectStore(store).get(key); req.onsuccess=()=>r(req.result); req.onerror=()=>r(null); });
  },
  async getAll(store) {
    if(!this.db) return [];
    return new Promise((r) => { const tx=this.db.transaction(store,'readonly'); const req=tx.objectStore(store).getAll(); req.onsuccess=()=>r(req.result); });
  }
};
