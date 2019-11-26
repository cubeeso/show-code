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
                    <LoginBox><h1>次元门</h1></LoginBox>
             </div>
                <div class="content ui-content" id="content" v-show="isLogin">
                    <h1>欢迎进入次元世界</h1>
                <!-- 路由出口 <router-view></router-view>  渲染在这里 -->
                </div>
            <div class="foot"> 
                <span class="ui-help"></span>
            </div>
        </div>`,
    computed: {
        isLogin:()=>Store.state.isLogin
    },
    mounted() { //虚拟模板渲染挂载成功后执行
        Store.saveSession();
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
