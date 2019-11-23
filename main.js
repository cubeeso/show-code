import Vue from 'https://cdn.jsdelivr.net/npm/vue@2.6.10/dist/vue.esm.browser.js';
import Storage from "./router/storage.js";
import {
    BaseList,
    BaseInput,
    Tips,
    TitleBar,
    LoginBox
} from "./components/base.js";
//混入的钩子函数
const mix = {
    created() {
        setTimeout(()=>{
            if(this.isLogin){
                this.isLogin = false; //自动回话过期
                this.showAlert("会话过期");
                Storage.setCache("isLogin",this.isLogin);
            }
        },10000);
    },
    mounted() {
        window.addEventListener('beforeunload', (e) => {
            Storage.setCache("dataList",this.items);
            Storage.setCache("isLogin",this.isLogin);
        });
    }
};

//主App
const App = {
    template: /*html*/ `
        <div id="app" >
            <div class="head">
                <TitleBar ></TitleBar>
                <Tips ref="tips" v-on="{'copyall-event':copyAll,'removeall-event':removeAll}"></Tips>
            </div>
            <div class="content ui-home" v-show="!isLogin">
                    <LoginBox><h1>欢迎登陆</h1></LoginBox>
             </div>
             <transition name="fade">
                <div class="content ui-content" v-show="isLogin">
                    <h1>key in some thing</h1>
                    <BaseInput @put-event="put"></BaseInput>
                    <BaseList :items="items" v-on="{'remove-event':remove,'copy-event':copy}"></BaseList>
                </div>
            </transition>
            <div class="foot"> 
                <span class="ui-help"></span>
            </div>
        </div>`,
    data() {
        return {
            items: Storage.getCache("dataList") || [],
            isLogin:Storage.getCache("isLogin") ||false
        }
    },
    methods: {
        showToast(msg) {
            this.$refs.tips.Amsg = msg;
            this.$refs.tips.isToast = true; //打开提示窗
            clearTimeout(this.$data.to);
            this.$data.to = setTimeout(() => {
                this.$refs.tips.isToast = false; //关闭提示窗
            }, 2000);
        },
        showAlert(msg) {
            this.$refs.tips.Bmsg = msg;
            this.$refs.tips.isAlert = true; //打开提示窗
        },
        remove(index) {
            this.items.splice(index, 1);
            this.showToast("删除成功");
        },
        put(item, _this) {
            _this.value = "";
            if (this.items.includes(item)) {
                this.showAlert("数据已经存在");
                return;
            }
            this.items.push(item);
            this.showToast("添加成功");
        },
        copy(item, _this) {
            this.items.push(item);
            this.showToast("复制成功");
        },
        removeAll() {
            if (this.items.length == 0) {
                this.showAlert("没有数据");
                return;
            }
            this.items = [];
            this.showAlert("清空缓存成功");
        },
        copyAll() {
            if (this.items.length == 0) {
                this.showAlert("没有数据");
                return;
            }
            if (this.items.length > 2000) {
                this.showAlert("缓存数据过大,无法复制");
                return;
            }
            this.items = [...this.items, ...this.items];
            this.showAlert("复制缓存成功");
        }
    },
    watch: {

    },
    components: {
        BaseList,
        BaseInput,
        Tips,
        TitleBar,
        LoginBox
    },
    mixins: [mix]
};

//创建Vue实例
var vm = new Vue({
    render: h => h(App),
}).$mount('#app')