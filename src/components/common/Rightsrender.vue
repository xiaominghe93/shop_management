<template>
  <div class="right-render">
    <!-- 一级权限 -->
    <el-row v-for="item in rights" :key="item.id" class="item">
      <el-col :span="5" class="tag">
        <el-tag closable @close="deleteRights(item.id)">{{item.authName}}</el-tag>
        <i class="el-icon-caret-right"></i>
      </el-col>

      <el-col :span="19" class="child-item">
        <!-- 二级权限 -->
        <el-row v-for="childItem in item.children" :key="childItem.id" class="item">
          <el-col :span="6" class="tag">
            <el-tag type="success" closable @close="deleteRights(childItem.id)">{{childItem.authName}}</el-tag>
            <i class="el-icon-caret-right"></i>
          </el-col>

          <el-col :span="18" class="child-item">
            <!-- 三级权限 -->
            <el-tag
              type="warning"
              v-for="childitemlast in childItem.children"
              :key="childitemlast.id"
              closable
              @close="deleteRights(childitemlast.id)"
            >{{childitemlast.authName}}</el-tag>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  props: ['rights'],
  methods: {
    async deleteRights(id) {
      const reslut = await this.$confirm(
        '此操作将永久删除该权限, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)
      if (reslut !== 'confirm') return this.$msg.warning('取消删除成功')
      this.$emit('deleteRights', id)
    }
  }
}
</script>

<style scoped>
.right-render {
  border-top: 1px solid #eee;
  border-bottom: 1px solid #eee;
}

.item {
  display: flex;
  align-items: center;
  border-bottom: 1px solid #eee;
  margin-bottom: 10px;
}

.item:first-child {
  margin-top: 10px;
}

.item:last-child {
  border-bottom: 0;
  margin-bottom: 0;
}

.el-tag {
  margin-bottom: 15px;
  margin-right: 10px;
}
</style>
