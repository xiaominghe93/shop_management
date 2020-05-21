<template>
  <div>
      <el-button type="info" @click="logout">退出</el-button>
  </div>
</template>

<script>
export default {
  methods: {
    logout () {
      // 一般情况点击退出 先清楚token然后返回到登录页
      this.$router.push('/login')
    }
  }

}
</script>

<style>

</style>
