<template>
  <el-breadcrumb separator-class="el-icon-arrow-right" style="margin-bottom: 15px;">
    <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>{{secondNav}}</el-breadcrumb-item>
    <el-breadcrumb-item>{{thirdNav}}</el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script>
export default {
  props: ['secondNav', 'thirdNav']
}
</script>

<style>
</style>
