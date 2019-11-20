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
    props:["items"]
};
//主App
const App = {
    template: `<div id="app" >
        <h1>key in something</h1>
        <BaseInput @put-event="put"></BaseInput>
        <BaseList :items="items" v-on="{'remove-event':remove,'copy-event':copy}"></BaseList>
    </div>`,
    data() {
        return {
            items: Storage.getCache() || []
        }
    },
    methods:{
        remove(index){
            this.items.splice(index,1);
        },
        put(item,_this){
            _this.value="";
            this.items.push(item);
        },
        copy(item,_this){
            this.items.push(item);
        },
    },
    watch: {
        items: function (val, oldval) {
           // 
        }
    },
    components: {
        BaseList,
        BaseInput,
    },
    beforeDestroy() {
        Storage.setCache(this.items);
    }
};
//创建Vue实例
var vm = new Vue({
    render: h => h(App),
}).$mount('#app')