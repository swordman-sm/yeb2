<template>
  <div>
    <el-container>
      <el-header class="homeHeader">
        <div class="title">
          云E办系统
        </div>
        <el-dropdown class="userInfo" @command="commandHandler">
          <span class="el-dropdown-link">
<!--            下拉菜单<i class="el-icon-arrow-down el-icon&#45;&#45;right"></i>-->
            {{ user.name }}<i><img :src="user.userFace"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="userinfo">个人中心</el-dropdown-item>
            <el-dropdown-item command="setting">设置</el-dropdown-item>
            <el-dropdown-item command="logout">注销登陆</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-header>
      <el-container>
        <el-aside width="200px">
          <!--          <el-menu @select="menuClick">-->
          <el-menu router unique-opened>
            <!--            <el-submenu index="1" v-for="(item,index) in this.$router.options.routes" :key="index"-->
            <el-submenu :index="index+''" v-for="(item,index) in routes" :key="index" v-if="!item.hidden">
              <!--              <template slot="title"><i class="el-icon-location"></i>导航一</template>-->
              <template slot="title"><i :class="item.iconCls" style="color: black;margin-right: 5px"></i>
                <span>{{ item.name }}</span>
              </template>
              <el-menu-item :index="children.path" v-for="(children,index) in item.children">
                {{ children.name }}
              </el-menu-item>
            </el-submenu>
          </el-menu>
        </el-aside>
        <el-main>
          <el-breadcrumb separator-class="el-icon-arrow-right" v-if="this.$router.currentRoute.path!=='/home'">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>{{ this.$router.currentRoute.name }}</el-breadcrumb-item>
          </el-breadcrumb>
          <div class="homeWelcome" v-if="this.$router.currentRoute.path==='/home'">
            欢迎来到云E办系统
          </div>
          <router-view class="routerView"/>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
export default {
  name: "Home",
  data() {
    return {
      user: JSON.parse(window.sessionStorage.getItem('user'))
    }
  },
  methods: {
    // menuClick(index) {
    //   this.$router.push(index)
    // },
    commandHandler(command) {
      if (command === 'logout') {
        //弹窗提示是否要注销登陆
        this.$confirm('是否要注销登陆?', '系统提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          //注销登陆
          this.postRequest('/logout')
          //清空用户信息
          window.sessionStorage.removeItem('tokenStr')
          window.sessionStorage.removeItem('user')
          //替换路由
          this.$router.replace('/')
          //清空菜单缓存信息
          this.$store.commit('initRoutes', [])
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '操作已取消'
          })
        })
      }
      if (command === 'userinfo') {
        this.$router.push('/userinfo')
      }
    }
  },
  computed: {
    // 从 vuex 获取 routes
    routes() {
      return this.$store.state.routes
    },
  }
}
</script>

<style scoped>
.homeHeader {
  background: #409eff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 15px;
  box-sizing: border-box;
}

.homeHeader .title {
  font-size: 30px;
  font-family: 华文楷体;
  color: white;
}

.homeHeader .userInfo {
  cursor: pointer;
}

.el-dropdown-link img {
  width: 40px;
  height: 40px;
  border-radius: 24px;
  margin-left: 8px;
}

.homeWelcome {
  text-align: center;
  font-size: 30px;
  font-family: 华文楷体;
  color: #409eff;
  padding-top: 50px;
}

.routerView {
  margin-top: 10px;
}
</style>