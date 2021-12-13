import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from "../views/Login";
import Home from "@/views/Home";
import FriendChat from "@/views/chat/FriendChat";

Vue.use(VueRouter)

export default new VueRouter({
    routes: [
        {
            path: '/',
            name: 'Login',
            component: Login,
            hidden: true
        },
        {
            path: '/home',
            name: 'Home',
            component: Home,
            children: [
                {
                    path: '/chat',
                    name: '在线聊天',
                    component: FriendChat
                }
            ]
        },
    ]
})
