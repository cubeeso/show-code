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
//标题栏
const TitleBar = {
    template:/*html*/`
        <div class="ui-bar">
             <span title="菜单" class="ui-icon ui-icon-menu"></span>
             <span title="更多" class="ui-icon ui-icon-more" @click="showBuble" ></span>
        </div>
    `,
    methods: {
       showBuble(){//打开气泡
             this.$root.$children[0].$refs.tips.isBub = !this.$root.$children[0].$refs.tips.isBub;
       }
    },
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
                <p>{{Bmsg}}</p>
                <p><button autofocus @click="closeAlert" @keyup.enter="closeAlert">确定</button></p>       
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
                this.$parent.isLogin=true;
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