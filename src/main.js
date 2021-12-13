import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import 'font-awesome/css/font-awesome.css';
import store from './store'
import {postRequest, getRequest, putRequest, deleteRequest} from "@/utils/api";
import {initMenu} from "@/utils/menus";

Vue.config.productionTip = false

Vue.use(ElementUI)
// 插件形式使用请求
Vue.prototype.postRequest = postRequest
Vue.prototype.getRequest = getRequest
Vue.prototype.putRequest = putRequest
Vue.prototype.deleteRequest = deleteRequest

//注册全局前置守卫防止菜单在缓存中丢失
router.beforeEach(((to, from, next) => {
    //to 前往的路由地址
    //from 来源路由地址
    //next() 放行
    //用户登录成功时 将token存入sessionStorage 如果携带token 初始化菜单  放行
    if (window.sessionStorage.getItem('tokenStr')) {
        //初始化菜单到vuex缓存中
        initMenu(router, store)
        //获取用户信息(判断是否存在)
        if (!window.sessionStorage.getItem('user')) {
            return getRequest('/admin/info').then(resp => {
                if (resp) {
                    //sessionStorage存储用户信息
                    window.sessionStorage.setItem('user', JSON.stringify(resp))
                    //同步用户信息,编辑用户
                    next()
                }
            })
        }
        next()
    } else {
        if (to.path === '/') {
            next()
        } else {
            next('/?redirect=' + to.path)
        }
    }
}))

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')
