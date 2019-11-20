const keyname = "inputlist";
export default {
    setCache(items) {
        alert(2)
        window.sessionStorage.setItem(keyname, JSON.stringify(items || []));
    },
    getCache() {
        return JSON.parse(window.sessionStorage.getItem(keyname) || "[]");
    },
    removeCache() {
        window.sessionStorage.removeItem(keyname);
    }
}