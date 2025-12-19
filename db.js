// db.js - Database wrapper
class CoffeeForgeDB {
    constructor() {
        this.dbName = 'CoffeeForgeProfiles';
        this.version = 1;
        this.db = null;
    }
    
    async init() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, this.version);
            
            request.onerror = () => reject(request.error);
            request.onsuccess = () => {
                this.db = request.result;
                resolve(this.db);
            };
            
            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                
                // Create stores for each module
                const modules = ['roast', 'water', 'grind', 'brew', 'milk', 'caffeine', 'tasting'];
                modules.forEach(module => {
                    if (!db.objectStoreNames.contains(module)) {
                        const store = db.createObjectStore(module, { keyPath: 'id', autoIncrement: true });
                        store.createIndex('name', 'name', { unique: false });
                        store.createIndex('timestamp', 'timestamp', { unique: false });
                    }
                });
            };
        });
    }
    
    async saveProfile(module, name, data) {
        const transaction = this.db.transaction([module], 'readwrite');
        const store = transaction.objectStore(module);
        
        const profile = {
            name: name,
            data: data,
            timestamp: Date.now()
        };
        
        return new Promise((resolve, reject) => {
            const request = store.add(profile);
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }
    
    async loadProfile(module, id) {
        const transaction = this.db.transaction([module], 'readonly');
        const store = transaction.objectStore(module);
        
        return new Promise((resolve, reject) => {
            const request = store.get(id);
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }
    
    async getAllProfiles(module) {
        const transaction = this.db.transaction([module], 'readonly');
        const store = transaction.objectStore(module);
        
        return new Promise((resolve, reject) => {
            const request = store.getAll();
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }
    
    async deleteProfile(module, id) {
        const transaction = this.db.transaction([module], 'readwrite');
        const store = transaction.objectStore(module);
        
        return new Promise((resolve, reject) => {
            const request = store.delete(id);
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }
    
    async getProfileCount(module) {
        const transaction = this.db.transaction([module], 'readonly');
        const store = transaction.objectStore(module);
        
        return new Promise((resolve, reject) => {
            const request = store.count();
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }
}

// Initialize globally
const db = new CoffeeForgeDB();
db.init().then(() => console.log('CoffeeForge DB ready'));