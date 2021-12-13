<template>
  <div>
    <el-form
        v-loading="loading"
        element-loading-text="正在登陆......"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(0, 0, 0, 0.8)" :rules="rules" ref="loginForm" :model="loginForm"
        class="loginContainer">
      <h3 class="loginTitle">系统登录</h3>
      <el-form-item prop="username">
        <el-input type="text" auto-complete="false" v-model="loginForm.username" placeholder="请输入用户名"></el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input type="password" auto-complete="false" v-model="loginForm.password" placeholder="请输入密码"></el-input>
      </el-form-item>
      <el-form-item prop="code">
        <el-input type="text" auto-complete="false" v-model="loginForm.code" placeholder="点击图片更换验证码"
                  style="width: 250px;margin-right: 5px;"></el-input>
        <img :src="captchaUrl" @click="updateCaptcha">
      </el-form-item>
      <el-checkbox v-model="checked" class="loginRemember">记住我</el-checkbox>
      <el-button type="primary" style="width: 100%" @click="submitLogin">登陆</el-button>
    </el-form>
  </div>
</template>

<script>

export default {
  name: "Login",
  data() {
    return {
      captchaUrl: '/captcha?time=' + new Date(),
      loginForm: {
        username: "admin",
        password: "123",
        code: ''
      },
      checked: true,
      loading: false, // 加载中
      rules: {
        username: [{required: true, message: '请输入用户名', trigger: 'blur'}],
        password: [{required: true, message: '请输入密码', trigger: 'blur'}],
        code: [{required: true, message: '请输入验证码', trigger: 'blur'}]
      }
    }
  },
  methods: {
    submitLogin() {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          this.loading = true
          this.postRequest("/login", this.loginForm).then(resp => {
            this.loading = false
            if (resp) {
              //存储用户token到sessionStorge
              const tokenStr = resp.obj.tokenHead + resp.obj.token;
              window.sessionStorage.setItem('tokenStr', tokenStr)

              // this.$message({
              //   message: '登陆成功',
              //   type: 'success'
              // });

              //跳转到首页
              //路由跳转,可以回退到上一页
              // this.$router.push('/home')
              //路由替换,无法回退到上一页
              this.$router.replace('/home')
              //  页面跳转 拿到用户要跳转的路径
              let path = this.$route.query.redirect;
              //用户可能输入首页地址或者错误地址,让他跳转到首页,否则跳转到他输入的地址
              this.$router.replace((path === '/' || path === undefined) ? '/home' : path)
            }
          })
          // this.$message({
          //   message: '恭喜你，这是一条成功消息',
          //   type: 'success'
          // });
        } else {
          this.$message.error('请输入所有字段');
          return false;
        }
      });
    },
    updateCaptcha() {
      this.captchaUrl = '/captcha?time=' + new Date();
    }
  }
}
</script>

<style scoped>
.loginContainer {
  /*边框*/
  border-radius: 15px;
  /*background-clip属性的通俗作用就是指定元素背景所在的区域,有四种取值
  1.border-box是默认值，表示元素的背景从border区域（包括border）以内开始保留背景
  2.padding-box表示元素的背景从padding区域(包括padding)以内开始保留
  3.content-box表示元素的背景从内容区域以内开始保留
  4.text表示元素的背景保留在前景内容中（文字），和其形状大小相同,目前仅支持chrome浏览器*/
  background-clip: padding-box;
  /*内边距*/
  margin: 180px auto;
  width: 380px;
  padding: 15px 35px 15px 35px;
  background: #fff;
  border: 1px solid #eaeaea;
  box-shadow: 0 0 25px #cac6c6;
}

.loginTitle {
  margin: 0 auto 40px auto;
  text-align: center;
}

.loginRemember {
  text-align: left;
  margin: 0 0 15px 0;
}

/*验证码*/
.el-form-item__content {
  /*弹性布局*/
  display: flex;
  align-items: center;
}
</style>
