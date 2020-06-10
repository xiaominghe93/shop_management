<template>
  <div>
    <!-- 面包屑导航 -->
    <Breadcrumb :secondNav="'权限管理'" :thirdNav="'权限列表'"></Breadcrumb>

    <!-- 卡片式图 -->
    <el-card>
      <el-table :data="allRightsList" border stripe>
        <el-table-column type="index" label="#" width="50"></el-table-column>
        <el-table-column prop="authName" label="权限名称"></el-table-column>
        <el-table-column prop="path" label="路径"></el-table-column>
        <el-table-column prop="level" label="权限等级">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.level === '0'">一级</el-tag>
            <el-tag type="success" v-else-if="scope.row.level === '1'">二级</el-tag>
            <el-tag type="warning" v-else>三级</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import Breadcrumb from '../common/Breadcrumb'
export default {
  data() {
    return {
      allRightsList: []
    }
  },
  created() {
    this.getAllRightsList()
  },
  methods: {
    async getAllRightsList() {
      const { data: res } = await this.$http.get('rights/' + 'list')
      if (res.meta.status !== 200) return this.$msg.error('获取权限列表失败')
      this.allRightsList = res.data
      this.$msg.success(res.meta.msg)
    }
  },
  components: {
    Breadcrumb
  }
}
</script>

<style>
</style>
