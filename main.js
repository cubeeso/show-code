import Store from "./stateManage/Store.js";
import { Tips, TitleBar, LoginBox, DemoBox } from "./components/Base.js";
//主App
const App = {
  template: /*html*/ `
        <div id="app" >
            <div class="head">
                <TitleBar :isLogin="isLogin"></TitleBar>
                <Tips ></Tips>
            </div>
            <div class="content ui-home" v-show="!isLogin">
                    <LoginBox><h1> WELCOME&nbsp;</h1></LoginBox>
             </div>
                <div class="content ui-content"  v-show="isLogin">
                    <div id="content"><h1>闯入次元</h1></div> <!--挂载新数据 -->
                <!-- 路由出口 <router-view></router-view>  渲染在这里 -->
                </div>
                
                <div class="foot"> 
                    <transition name="fade">
                    <div  v-show = "isRegist">
                        <span class="ui-back" @click="back" >点我返回</span>
                        <span class="ui-help" @click="back"></span>
                    </div>
                    </transition>
                </div>
        </div>`,
  computed: {
    isLogin: () => Store.state.isLogin,
    isRegist: () => Store.state.isRegist
  },
  mounted() {
    //虚拟模板渲染挂载成功后执行
    Store.saveSession();
  },
  methods: {
    back() {
      Store.setRegist(false);
    }
  },
  components: {
    //引用的组件
    Tips,
    TitleBar,
    LoginBox,
    DemoBox
  }
};

//创建Vue实例
var vm = new Vue({
  render: h => h(App)
}).$mount("#app");
