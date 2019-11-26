import Storage from "../router/CacheUtils.js";
// store 共享数据
const store = {
    debug:true,
    state:{
        isLogin:false,//登陆状态
        items: Storage.getCache("dataList") || [],//表表数据
        isToast:false,//轻提示
        isAlert:false,//弹窗
        isBub:false,//气泡
        toastMsg:"",//轻提示内容
        alertMsg:""//弹窗内容
    },
    setLoginAction(newValue){ //设置登陆状态
        if(this.debug)console.log("setLoginAction trigger with",newValue)
        this.state.isLogin = newValue;
    },
    removeItem(index) {//删除数组内数据
        this.state.items.splice(index, 1);
    },
    putItem(item) {//添加组建内数据
        this.state.items.push(item);
    },
    copyItem(item) {//复制数据
        this.state.items.push(item);
    },
    removeAllItem() {
        this.state.items = [];
    },
    copyAllItem() {
        this.state.items = [...this.state.items, ...this.state.items];
    },
    showToast(msg) {
        this.state.toastMsg = msg;
        this.state.isToast = true; //打开提示窗
        clearTimeout(this.state.temp);
        this.state.temp = setTimeout(() => {
            this.state.isToast = false; //关闭提示窗
        }, 2000);
    },
    showBuble(){
        this.state.isBub = !this.state.isBub;
    },
    closeBuble(){
        this.state.isBub === true?this.state.isBub =false:"";
    },
    showAlert(msg) {
        this.state.alertMsg = msg;
        this.state.isAlert = true; //打开提示窗
    },
    closeAlert(){
        this.state.isAlert = false; //打开提示窗
        this.state.alertMsg = "";
    },
    destroySession() {
        if (this.state.isLogin) {
            setTimeout(() => {
                this.setLoginAction(false);//自动回话过期
                this.showAlert("会话过期");
                Storage.setCache("isLogin", this.state.isLogin);
            }, 30000);//30秒会话过期
         }
    },
    saveSession(){
        Storage.setCache("isLogin", this.state.isLogin);
        window.addEventListener('beforeunload', (e) => {//监听页面刷新
            Storage.setCache("dataList", this.state.items);
            
        });
    }
};
export default Vue.observable(store);