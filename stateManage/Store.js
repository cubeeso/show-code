import Storage from "../router/CacheUtils.js";
// store 共享数据
const store = {
    debug:true,
    state:{
        isLogin:Storage.getCache("isLogin")||false,//登陆状态
        isRegist:false,//登陆状态
        items: Storage.getCache("dataList") || [],//表表数据
        isToast:false,//轻提示
        isMenuShow:false,//菜单
        isAlert:false,//弹窗
        isConfirm:false,//弹窗
        isBub:false,//气泡
        toastMsg:"",//轻提示内容
        alertMsg:"",//弹窗内容
        userData: Storage.getData("userList") || []
    },
    addUser(user){
        this.state.userData.push(user);
        console.log("新用户注册成功!");
        Storage.setData("userList", this.state.userData);
    },
    setLoginAction(newValue){ //设置登陆状态
        if(this.debug)console.log("setLoginAction trigger with",newValue)
        this.state.isLogin = newValue;
        this.destroySession();//定时自动销毁缓存
    },
    setRegist(newValue){ //设置注册状态
        this.state.isRegist = newValue;
    },
    switchMenu(swi){ //菜单开关
        swi != undefined?this.state.isMenuShow = swi:this.state.isMenuShow = !this.state.isMenuShow;
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
    removeAllItem() {//清空缓存
        this.state.items = [];
    },
    copyAllItem() {//复制缓存
        this.state.items = [...this.state.items, ...this.state.items];
    },
    showToast(msg) {//弹出轻提示
        this.state.toastMsg = msg;
        this.state.isToast = true; //打开提示窗
        clearTimeout(this.state.temp);
        this.state.temp = setTimeout(() => {
            this.state.isToast = false; //关闭提示窗
        }, 2000);
    },
    showBuble(){//显示气泡框
        this.state.isBub = !this.state.isBub;
    },
    closeBuble(){//关闭气泡框
        this.state.isBub === true?this.state.isBub =false:"";
    },
    showAlert(msg) {//打开弹框
        this.state.alertMsg = msg;
        this.state.isAlert = true; //打开提示窗
    },
    showConfirm(msg) {//打开弹框
        this.state.alertMsg = msg;
        this.state.isConfirm = true; //打开提示窗
    },
    closeAlert(){//关闭弹框
        this.state.isAlert = false; //打开提示窗
        this.state.isConfirm = false; //关闭提示窗
        this.state.alertMsg = "";
    },
    destroySession() {//销毁session
        if (this.state.isLogin) {
            setTimeout(() => {
                this.setLoginAction(false);//自动回话过期
                this.showAlert("会话过期");
                Storage.setCache("isLogin", this.state.isLogin);
            }, 120000);//30秒会话过期
         }
    },
    saveSession(){//保存session缓存
        window.addEventListener('beforeunload', (e) => {//监听页面刷新
            Storage.setCache("isLogin", this.state.isLogin);
            Storage.setCache("dataList", this.state.items);
        });
    },
};
export default Vue.observable(store);