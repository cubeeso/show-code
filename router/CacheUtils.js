export default {
    setCache(key,items) {
        window.sessionStorage.setItem(key, JSON.stringify(items));
    },
    getCache(key) {
        return JSON.parse(window.sessionStorage.getItem(key));
    },
    removeCache(key) {
        window.sessionStorage.removeItem(key);
    }
}