<template>
  <div>
    <!-- 面包屑导航 -->
    <Breadcrumb :secondNav="'商品管理'" :thirdNav="'商品分类'"></Breadcrumb>

    <!-- 卡片视图 -->
    <el-card>
      <el-button type="primary">添加分类</el-button>

      <!-- table-tree -->
      <table-tree
        :data="goodsCategory"
        :columns="columns"
        :selection-type="false"
        :expand-type="false"
        show-index
        index-text="#"
        border
      >
        <template slot="isok" slot-scope="scope">
          <i
            class="el-icon-success"
            v-if="scope.row.cat_deleted === false"
            style="color: lightgreen;"
          ></i>
          <i class="el-icon-error" v-else style="color: red;"></i>
        </template>
        <template slot="sort" slot-scope="scope">
          <el-tag v-if="scope.row.cat_level === 0">一级</el-tag>
          <el-tag v-else-if="scope.row.cat_level === 1" type="success">二级</el-tag>
          <el-tag v-else type="warning">三级</el-tag>
        </template>
        <template slot="operate">
          <el-button size="mini" icon="el-icon-edit" type="primary">编辑</el-button>
          <el-button size="mini" icon="el-icon-delete" type="danger">删除</el-button>
        </template>
      </table-tree>

      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="goodsCatparams.pagenum"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="goodsCatparams.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>
  </div>
</template>

<script>
import Breadcrumb from '../common/Breadcrumb'

export default {
  data() {
    return {
      goodsCategory: [],
      goodsCatparams: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      total: 0,
      columns: [
        {
          label: '分类名称',
          prop: 'cat_name'
        },
        {
          label: '是否有效',
          type: 'template',
          template: 'isok'
        },
        {
          label: '排序',
          type: 'template',
          template: 'sort'
        },
        {
          label: '操作',
          type: 'template',
          template: 'operate'
        }
      ]
    }
  },
  created() {
    this.getGoodsCategory()
  },
  methods: {
    // 获取全部商品分类
    async getGoodsCategory() {
      const { data: res } = await this.$http.get('categories', {
        params: this.goodsCatparams
      })
      if (res.meta.status !== 200) return this.$msg.error('获取商品分类失败')
      this.goodsCategory = res.data.result
      this.total = res.data.total
      this.$msg.success(res.meta.msg)
    },
    // pangesize改变时候
    handleSizeChange(pagesize) {
      this.goodsCatparams.pagesize = pagesize
      this.getGoodsCategory()
    },
    // 页码值改变时
    handleCurrentChange(pagenum) {
      this.goodsCatparams.pagenum = pagenum
      this.getGoodsCategory()
    }
  },
  components: {
    Breadcrumb
  }
}
</script>

<style>
</style>
