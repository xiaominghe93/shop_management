<template>
  <el-breadcrumb separator-class="el-icon-arrow-right" style="margin-bottom: 15px;">
    <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>{{userManage}}</el-breadcrumb-item>
    <el-breadcrumb-item>{{userList}}</el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script>
export default {
  props: ['userManage', 'userList']
}
</script>

<style>
</style>
