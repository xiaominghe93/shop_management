<template>
  <div>
    <!-- 面包屑导航 -->
    <Breadcrumb :secondNav="'商品管理'" :thirdNav="'商品列表'"></Breadcrumb>

    <!-- 卡片视图 -->
    <el-card>
      <!-- 搜索与添加商品 -->
      <div class="goods-head">
        <el-row :gutter="20">
          <!-- 搜索框 -->
          <el-col :span="8">
            <el-input v-model="goodsParam.query" clearable @clear="getGoodsLsit">
              <el-button slot="append" icon="el-icon-search" @click="getGoodsLsit"></el-button>
            </el-input>
          </el-col>
          <!-- 添加商品 -->
          <el-col :span="16">
            <el-button type="primary" @click="$router.push('/add')">添加商品</el-button>
          </el-col>
        </el-row>
      </div>

      <!-- 商品列表 -->
      <el-table border stripe :data="goodsList">
        <el-table-column type="index" label="#" width="50"></el-table-column>
        <el-table-column prop="goods_name" label="商品名称"></el-table-column>
        <el-table-column prop="goods_price" label="商品价格(元)" width="100"></el-table-column>
        <el-table-column prop="goods_weight" label="商品重量" width="100"></el-table-column>
        <el-table-column prop="add_time" label="创建时间" width="150"></el-table-column>
        <el-table-column label="操作" width="200">
          <template>
            <el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini"></el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="goodsParam.pagenum"
        :page-sizes="[10, 15, 20]"
        :page-size="100"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>

    <!-- 添加与编辑商品对话框 -->
    <el-dialog title="提示" :visible.sync="addEditdialogVisible" width="30%">
      <span>这是一段信息</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addEditdialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addEditdialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Breadcrumb from '../common/Breadcrumb'
export default {
  data() {
    return {
      goodsList: [],
      // goods列表获取请求参数
      goodsParam: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      total: 0,
      addEditdialogVisible: false
    }
  },
  created() {
    this.getGoodsLsit()
  },
  methods: {
    // 获取商品列表数据
    async getGoodsLsit() {
      const { data: res } = await this.$http.get('goods', {
        params: this.goodsParam
      })
      console.log(res)
      if (res.meta.status !== 200) return this.$msg.error('获取商品失败')
      this.goodsList = this.timeFormat(res.data.goods)
      this.total = res.data.total
      this.$msg.success(res.meta.msg)
    },
    // 改造时间格式
    timeFormat(data) {
      data.map(item => {
        const ndate = new Date(item.add_time * 1000)
        item.add_time = this.formatDate(ndate)
      })
      return data
    },
    // 时间戳改为正常时间格式
    formatDate(date) {
      const year = date.getFullYear()
      const month = (date.getMonth() + 1).toString().padStart(2, 0)
      const day = date
        .getDay()
        .toString()
        .padStart(2, 0)
      const hour = date
        .getHours()
        .toString()
        .padStart(2, 0)
      const second = date
        .getSeconds()
        .toString()
        .padStart(2, 0)
      const minute = date
        .getMinutes()
        .toString()
        .padStart(2, 0)
      return `${year}-${month}-${day} ${hour}:${second}:${minute}`
    },
    // 每页展示条数改变
    handleSizeChange(pagesize) {
      this.goodsParam.pagesize = pagesize
      this.getGoodsLsit()
    },
    // 页码改变时
    handleCurrentChange(pagenum) {
      this.goodsParam.pagenum = pagenum
      this.getGoodsLsit()
    }
  },
  components: {
    Breadcrumb
  }
}
</script>

<style>
</style>
