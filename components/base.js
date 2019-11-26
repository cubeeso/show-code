import Store from "../stateManage/Store.js";
//基础输入组件
const BaseInput = {
    template: /*html*/ `
      <div class="ui-input" >
            <input placeholder="请输入" v-focus  v-model="it" @keyup.enter="put" />
    </div>`,
    data() {
        return {
            it: "",
        };
    },
    directives: {
        focus: {
            inserted(el) {
                el.focus(); //等同于autofocus    可兼容苹果浏览器是无效
            }
        }
    },
    computed: {
        items:()=>Store.state.items
    },
    methods:{
        put(el){
            if (Store.state.items.includes(this.it)) {
                Store.showToast("数据已经存在");
                return;
            }
            el.target.value="";
            Store.putItem(this.it);
            Store.showToast("添加成功");
        }
    }
};
//基础list组件
const BaseList = {
    template: /*html*/ `
        <div class="ui-list">
             <p v-for="(item,index) in items" :key="index" >
                <span>{{item}}</span>
                <span class="ui-icon ui-icon-copy" @click="copy(item)"></span>
                <span class="ui-icon ui-icon-del" @click="remove(index)"></span>
               </p>
         </div >`,
    computed: {
        items:()=>Store.state.items
    },
    methods:{
        copy(item){
            Store.copyItem(item);
            Store.showToast("复制成功");
        },
        remove(index){
            Store.removeItem(index);
            Store.showToast("删除成功");
        }
    }
};

//组合功能
const DemoBox = {
    template:/*html*/`
        <div>
            <h1>key in some thing</h1>
            <BaseInput ></BaseInput>
            <BaseList  ></BaseList>
        </div>
    `,
    components:{
        BaseInput,
        BaseList
    }
};
//菜单框
const MenuBox = {
    template: /*html*/ `
        <div>
        <div class="ui-boxbg" v-show="isShowMenu"  @click = "$emit('show-menu')" > </div>
        <transition name="slide">
             <div class="ui-menubox" v-show="isShowMenu">
                  <p class="ui-menu" v-for="(it,i) in menuData" :key="i" @click="toPage(i)">{{it.menuName}}</p>
             </div>
        </transition>
        </div>
    `,
    props:["isShowMenu"],
    data(){
        return {
            menuData:[{
                id:"0",
                "menuName":"测试菜单"
            },{
                id:"1",
                "menuName":"测试菜单2"
            },{
                id:"2",
                "menuName":"测试菜单3"
            },{
                id:"3",
                "menuName":"测试菜单4"
            },],
        }
    },
    methods:{
        toPage(i){
            //this.$parent.showAlert(this.menuData[i].menuName);
        }
    }
};
//标题栏
const TitleBar = {
    template:/*html*/`
        <div>
            <div class="ui-bar">
                <span title="菜单" class="ui-icon ui-icon-menu" @click="showMenu"  v-show="isLogin"></span>
                <span title="更多" class="ui-icon ui-icon-more" @click="showBuble" v-show="isLogin" ></span>
            </div>
            <MenuBox :isShowMenu = "isShowMenu" @show-menu="showMenu" ></MenuBox>
        </div>
    `,
    props:["isLogin"],
    data(){
        return{
            isShowMenu:false
        }
    },
    methods: {
       showBuble(){//打开气泡
             Store.showBuble();
       },
       showMenu(){
            this.isShowMenu = !this.isShowMenu;
       }
    },
    components:{
        MenuBox
    }
};
//提示组件
const Tips = {
    template:/*html*/ `
        <div class="ui-tips">
            <transition name="fade">
             <div class="ui-toast" v-show="isToast" >{{toastMsg}}</div>
            </transition>
            <div class="ui-boxbg" v-show="isAlert||isBub"  @click = "closeBuble" > </div>
            <transition name="show">
                <div class="ui-box ui-alert" v-show="isAlert" >
                <p class="ui-msg">{{alertMsg}}</p>
                <p><button autofocus class="ui-button-ok"  @click="closeAlert" @keyup.enter="closeAlert">确定</button></p>       
                </div>
            </transition>
            <transition name="show">
                <div class="ui-box ui-buble" v-show="isBub" >
                    <span title="复制缓存" class="ui-icon ui-icon-copy" @click="copyAll"></span>
                    <span title="清空缓存" class="ui-icon ui-icon-del"  @click="removeAll"></span>
                </div>
            </transition>
        </div>`,
    //props: ["conf"]
    computed: {
        isToast:()=>Store.state.isToast,
        isAlert:()=>Store.state.isAlert,
        isBub:()=>Store.state.isBub,
        toastMsg:()=>Store.state.toastMsg,
        alertMsg:()=>Store.state.alertMsg,
    },
    methods: {
        copyAll(){
            if (Store.state.items.length == 0) {
                Store.showAlert("没有数据");
                return;
            }
            if (Store.state.items.length > 2000) {
                Store.showAlert("缓存数据过大,无法复制");
                return;
            }
            Store.copyAllItem();
            Store.showAlert("复制缓存成功");
        },
        removeAll(){
            if (Store.state.items.length == 0) {
                Store.showAlert("没有数据");
                return;
            }
            Store.removeAllItem();
            Store.showAlert("清空缓存成功");
        },
        closeAlert(){
            if(this.alertMsg=="登陆成功"){
                Store.setLoginAction(true);
                //this.$parent.destroySession();
            }
            Store.closeAlert();
        },
        closeBuble(){
            Store.closeBuble();
        }
    },
};

//登陆框
const LoginBox = {
    template:/*html*/`
        <div class="ui-input">
            <slot></slot>
            <input type="text" autofocus placeholder="用户名" v-model="username"/>
            <input type="password" placeholder="密码" v-model="password" @keyup.enter="checkAuth"/>
            <button class="ui-button" @click="checkAuth">登陆</button>
        </div>
    `,
    data(){
        return {
            username:"",
            password:""
        }
    },
    methods: {
        checkAuth(){
            if(this.username==="admin"&&this.password==="admin"){
                Store.showAlert("登陆成功");
            }else{
                Store.showAlert("用户名密码错误");
            }
        }
    },
};

export {
    Tips,
    TitleBar,
    LoginBox,
    DemoBox
}