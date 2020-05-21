<template>
  <el-container class="home-comtainer">
    <el-header>
      <div class="header-img">
        <img src="../assets/logoShop.png" alt="">
        <span>电商后台管理系统</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <el-container>
      <el-aside width="200px">Aside</el-aside>
      <el-main>Main</el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  methods: {
    logout () {
      console.log(123)
      // 一般情况点击退出 先清楚token然后返回到登录页
      this.$router.push('/login')
    }
  }
}
</script>

<style lang="less" scoped>
.home-comtainer {
  height: 100%;
}

.el-header {
  background-color: #373D41;
  display: flex;
  justify-content: space-between;
  padding-left: 0;
  align-items: center;
  color: #fff;
  font-size: 20px;
  img {
    margin-right: 20px;
  }
  .header-img {
    display: flex;
    align-items: center;
  }
}

.el-aside {
  background-color: #333744;
}

.el-main {
  background-color: #EAEDF1;
}
</style>
