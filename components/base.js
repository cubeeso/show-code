//基础输入组件
const BaseInput = {
    template: /*html*/ `
      <div class="ui-input" >
            <input placeholder="请输入" v-focus  v-model="it" @keyup.enter="$emit('put-event',it,$event.target)" />
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
    }
};
//基础list组件
const BaseList = {
    template: /*html*/ `
        <div class="ui-list">
             <p v-for="(item,index) in items" :key="index" >
                <span>{{item}}</span>
                <span class="ui-icon ui-icon-copy" @click="$emit('copy-event',item)"></span>
                <span class="ui-icon ui-icon-del" @click="$emit('remove-event',index)"></span>
               </p>
         </div >`,
    props: ["items"]
};
//菜单框
const MenuBox = {
    template: /*html*/ `
        <div>
        <div class="ui-boxbg" v-show="isShow"  @click = "$emit('show-menu')" > </div>
        <transition name="slide">
             <div class="ui-menubox" v-show="isShow">
                  <p class="ui-menu" v-for="(it,i) in menuData" :key="i" @click="toPage(i)">{{it.menuName}}</p>
             </div>
        </transition>
        </div>
    `,
    props:["isShow"],
    data(){
        return {
            isShowMenu:false,
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
            <MenuBox :isShow = "isShowMenu" @show-menu="showMenu" ></MenuBox>
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
             this.$root.$children[0].$refs.tips.isBub = !this.$root.$children[0].$refs.tips.isBub;//不推荐使用,使用vuex或者中央事件总线
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
             <div class="ui-toast" v-show="isToast" >{{Amsg}}</div>
            </transition>
            <div class="ui-boxbg" v-show="isAlert||isBub"  @click = "closeBub" > </div>
            <transition name="show">
                <div class="ui-box ui-alert" v-show="isAlert" >
                <p class="ui-msg">{{Bmsg}}</p>
                <p><button autofocus class="ui-button-ok"  @click="closeAlert" @keyup.enter="closeAlert">确定</button></p>       
                </div>
            </transition>
            <transition name="show">
                <div class="ui-box ui-buble" v-show="isBub" >
                    <span title="复制缓存" class="ui-icon ui-icon-copy" @click="$emit('copyall-event')"></span>
                    <span title="清空缓存" class="ui-icon ui-icon-del"  @click="$emit('removeall-event')"></span>
                </div>
            </transition>
        </div>`,
    //props: ["conf"]
    data(){
        return {
            isToast:false,
            isAlert:false,
            isBub:false,
            Amsg:"",
            Bmsg:""
        }
    },
    methods: {
        closeAlert(){
            this.isAlert = false;
            if(this.Bmsg=="登陆成功"){
                this.$parent.isLogin=true;//不推荐用法  逆向修改父组件属性 造成维护困难
                //this.$parent.destroySession();
            }
        },
        closeBub(){
            this.isBub === true?this.isBub =false:"";
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
    computed: {
    },
    methods: {
        checkAuth(){
            if(this.username==="admin"&&this.password==="admin"){
                this.$parent.showAlert("登陆成功");
            }else{
                this.$parent.showAlert("用户名密码错误");
            }
        }
    },
};

export {
    BaseList,
    BaseInput,
    Tips,
    TitleBar,
    LoginBox
}