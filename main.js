import Vue from 'https://cdn.jsdelivr.net/npm/vue@2.6.10/dist/vue.esm.browser.js'
import Storage from "./router/storage.js"
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
             <span title="更多" class="ui-icon ui-icon-more" v-on="$listeners"  @click="showBuble" ></span>
        </div>
    `,
    methods: {
       showBuble(){//打开气泡
             this.$root.$children[0].$refs.tips.isBub = !this.$root.$children[0].$refs.tips.isBub;
       }
    },
};
//混入的钩子函数
const mix = {
    mounted() {
        window.addEventListener('beforeunload', (e) => {
            Storage.setCache(this.items);
            this.showToast("数据已缓存");
        });
    }
};
//提示组件
const Tips = {
    template:/*html*/ `
        <div class="ui-tips">
            <transition name="fade">
             <div class="ui-toast" v-show="isToast" >{{Amsg}}</div>
            </transition>
            <transition name="show">
                <div class="ui-box ui-alert" v-show="isAlert" >
                 <p>{{Bmsg}}</p>
                 <p><button @click="closeAlert">确定</button></p>       
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
        }
    },
};
//主App
const App = {
    template:/*html*/ `
        <div id="app" >
            <div class="head">
                <TitleBar v-on="{'copyall-event':copyAll,'removeall-event':removeAll}"></TitleBar>
            </div>
            <div class="content">
                <Tips ref="tips"></Tips>
                <h1>key in some thing</h1>
                <BaseInput @put-event="put"></BaseInput>
                <BaseList :items="items" v-on="{'remove-event':remove,'copy-event':copy}"></BaseList>
            </div>
            <div class="foot"> 我是底栏</div>
        </div>`,
    data() {
        return {
            items: Storage.getCache() || [],
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
        showAlert(msg){
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
        TitleBar
    },
    mixins: [mix]
};

//创建Vue实例
var vm = new Vue({
    render: h => h(App),
}).$mount('#app')