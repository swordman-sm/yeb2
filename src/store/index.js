import Vue from "vue";
import Vuex from "vuex"

Vue.use(Vuex)

const store = new Vuex.Store({
    state: {
        routes: [],
    },
    //同步执行
    mutations: {
        // 初始化路由 菜单
        initRoutes(state, data) {
            state.routes = data
        }
    },
    //异步执行
    // actions: {}
})

export default store