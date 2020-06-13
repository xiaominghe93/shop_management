<template>
  <div class="login-container">
    <!-- logo图像 -->
    <div class="login-box">
      <div class="avatar-img">
        <img src="../assets/logo.png" alt />
      </div>
      <!-- 登录表单 -->
      <div class="login-form">
        <el-form ref="loginFormRef" :rules="loginFormRules" :model="loginForm" label-width="0px">
          <el-form-item prop="username">
            <el-input v-model="loginForm.username" prefix-icon="iconfont icon-user"></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              v-model="loginForm.password"
              type="password"
              prefix-icon="iconfont icon-lock-f"
            ></el-input>
          </el-form-item>
          <!-- 登录与重置 -->
          <el-form-item class="login-btn">
            <el-button type="primary" @click="login">登录</el-button>
            <el-button type="info" @click="resetLoginForm">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 登录表单的绑定数据
      loginForm: {
        username: 'admin',
        password: '123456'
      },
      // 表单的验正规则
      loginFormRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 9, message: '长度在 3 到 9 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 重置表单
    resetLoginForm() {
      this.$refs.loginFormRef.resetFields()
    },
    // 登录 预验证
    login() {
      this.$refs.loginFormRef.validate(async valid => {
        if (!valid) return this.$msg.warning('输入格式不正确')
        const { data: res } = await this.$http.post('login', this.loginForm)
        if (res.meta.status !== 200) return this.$msg.error(res.meta.msg)
        window.sessionStorage.setItem('token', res.data.token)
        this.$msg.success(res.meta.msg)
        this.$router.push('/home')
      })
    }
  }
}
</script>

<style scoped>
.login-container {
  background-color: #2b4b6b;
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.login-box {
  width: 450px;
  height: 300px;
  background-color: #fff;
  position: relative;
}

.avatar-img {
  width: 130px;
  height: 130px;
  position: absolute;
  left: 50%;
  margin-left: -65px;
  margin-top: -65px;
  border: 1px solid #ddd;
  border-radius: 50%;
  padding: 10px;
  box-shadow: 0 0 10px #ddd;
  background-color: #fff;
}

.avatar-img img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background-color: #eee;
  border: 1px solid #ddd;
}

.login-form {
  position: absolute;
  top: 100px;
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
}

.login-form input {
  padding: 0 30px;
}

.login-form .login-btn {
  display: flex;
  justify-content: flex-end;
}
</style>
