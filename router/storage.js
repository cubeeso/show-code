const keyname = "inputlist";
export default {
    setCache(items) {
        window.sessionStorage.setItem(keyname, JSON.stringify(items || []));
    },
    getCache() {
        return JSON.parse(window.sessionStorage.getItem(keyname) || "[]");
    },
    removeCache() {
        window.sessionStorage.removeItem(keyname);
    }
}