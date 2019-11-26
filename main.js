import Store from "./stateManage/Store.js";
import {
    Tips,
    TitleBar,
    LoginBox,
    DemoBox
} from "./components/Base.js";
//主App
const App = {
    template: /*html*/ `
        <div id="app" >
            <div class="head">
                <TitleBar :isLogin="isLogin"></TitleBar>
                <Tips ></Tips>
            </div>
            <div class="content ui-home" v-show="!isLogin">
                    <LoginBox><h1>欢迎登陆</h1></LoginBox>
             </div>
             <transition name="fade">
                <div class="content ui-content" v-show="isLogin">
               <DemoBox></DemoBox>
                <!-- 路由出口 <router-view></router-view>  渲染在这里 -->
                </div>
            </transition>
            <div class="foot"> 
                <span class="ui-help"></span>
            </div>
        </div>`,
    computed: {
        isLogin:()=>Store.state.isLogin
    },
    mounted() { //虚拟模板渲染挂载成功后执行
        Store.saveSession();
        // this.destroySession();
    },
    components: { //引用的组件
        Tips,
        TitleBar,
        LoginBox,
        DemoBox
    }
};

//创建Vue实例
var vm = new Vue({
    render: h => h(App),
}).$mount('#app');