import Vue from 'https://cdn.jsdelivr.net/npm/vue@2.6.10/dist/vue.esm.browser.js'
import Storage from "./router/storage.js"
//基础输入组件
const BaseInput = {
    template: `<div class="ui-input" ><input placeholder="请输入" v-model="it" @keyup.enter="$emit('put-event',it,$event.target)" /></div>`,
    data() {
        return {
            it: "",
        };
    }
};
//基础list组件
const BaseList = {
    template: `<div class="ui-list"> <ol >
            <li v-for="(item,index) in items" :key="index" ><span @click="$emit('copy-event',item)">复制</span><span>{{item}}</span> <span @click="$emit('remove-event',index)">删除</span></li>
             </ol> </div >`,
    props: ["items"]
};
const mix = {
    mounted() {
        window.addEventListener('beforeunload', (e) => {
            Storage.setCache(this.items);
            console.log("存储数据");
        });
    }
};
//轻提示组件
const Toast = {
    template: `<transition name="fade"><div class="ui-toast" v-show="conf.isShow" >{{conf.msg}}</div></transition>`,
    props: ["conf"]
};
//主App
const App = {
    template: `<div id="app" >
        <Toast :conf="conf"></Toast>
		<h2><span @click="copyAll">复制缓存</span><span @click="removeAll">清除缓存</span></h2>
        <h1>key in something</h1>
        <BaseInput @put-event="put"></BaseInput>
        <BaseList :items="items" v-on="{'remove-event':remove,'copy-event':copy}"></BaseList>
    </div>`,
    data() {
        return {
            items: Storage.getCache() || [],
            conf: {
                isShow: false,
                msg: ""
            }
        }
    },
    methods: {
        showToast(msg) {
            this.conf.msg = msg;
            this.conf.isShow = true; //打开提示窗
            setTimeout(() => {
                this.conf.isShow = false; //关闭提示窗
            }, 2000);
        },
        remove(index) {
            this.items.splice(index, 1);
            this.showToast("删除成功");
        },
        put(item, _this) {
            _this.value = "";
            this.items.push(item);
            this.showToast("添加成功");
        },
        copy(item, _this) {
            this.items.push(item);
            this.showToast("复制成功");
        },
        removeAll() {
            if (this.items.length == 0) {
                this.showToast("缓存为空");
                return;
            }
            this.items = [];
            this.showToast("清空成功");
        },
        copyAll() {
            if (this.items.length == 0) {
                this.showToast("数据已经为空");
                return;
            }
            this.items = [...this.items, ...this.items];
            this.showToast("复制成功");
        }
    },
    watch: {
        items: function (val, oldval) {
            // 
        }
    },
    components: {
        BaseList,
        BaseInput,
        Toast
    },
    mixins: [mix]
};

//创建Vue实例
var vm = new Vue({
    render: h => h(App),
}).$mount('#app')