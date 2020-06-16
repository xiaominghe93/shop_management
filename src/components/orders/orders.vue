<template>
  <div>
    <!-- 面包屑导航 -->
    <Breadcrumb :secondNav="'订单管理'" :thirdNav="'订单列表'"></Breadcrumb>

    <!-- 卡牌视图 -->
    <el-card>
      <!-- 搜索订单 -->
      <div class="orders-head">
        <el-input>
          <el-button slot="append" icon="el-icon-search"></el-button>
        </el-input>
      </div>

      <!-- 表格区域 -->
      <el-table border stripe :data="ordersList">
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="订单编号" prop="order_number"></el-table-column>
        <el-table-column label="订单价格" prop="order_price" width="50"></el-table-column>
        <el-table-column label="支付方式">
          <template slot-scope="scope">
            <el-tag type="primary" v-if="scope.row.pay_status === '1'">支付宝</el-tag>
            <el-tag type="success" v-else-if="scope.row.pay_status === '2'">微信</el-tag>
            <el-tag type="warning" v-else>银行卡</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="是否付款">
          <template slot-scope="scope">
            <el-tag type="danger" v-if="scope.row.pay_status === '0'">未付款</el-tag>
            <el-tag type="success" v-else>已付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="是否发货" prop="is_send" width="50"></el-table-column>
        <el-table-column label="下单时间">
          <template slot-scope="scope">{{scope.row.create_time | timeFormat}}</template>
        </el-table-column>
        <el-table-column label="操作">
          <template>
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="showAddressDialog">编辑</el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="ordersParams.pagenum"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="ordersParams.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>

    <!-- 编辑地址的对话框 -->
    <el-dialog
      title="提示"
      :visible.sync="addressDialogVisible"
      width="50%"
      @close="closeAddressDialog"
    >
      <el-form
        :model="addressForm"
        :rules="addressFormRules"
        ref="addressFormRef"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="所在城市" prop="addressCity">
          <el-cascader :options="cityData" v-model="addressForm.addressCity"></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="addressCommunity">
          <el-input v-model="addressForm.addressCommunity"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addressDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addressDialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Breadcrumb from '../common/Breadcrumb'
import citydata from './citydata'
export default {
  data() {
    return {
      ordersList: [],
      ordersParams: {
        query: '',
        pagenum: 1,
        pagesize: 5
      },
      total: 0,
      addressDialogVisible: false,
      addressForm: {
        addressCity: [],
        addressCommunity: ''
      },
      addressFormRules: {
        addressCity: [{ required: true, message: '请输入所在区县', trigger: 'blur' }],
        addressCommunity: [{ required: true, message: '请输详细地址', trigger: 'blur' }]
      },
      cityData: citydata
    }
  },
  created() {
    this.getOrdersList()
  },

  // 日期过滤器
  filters: {
    timeFormat(value) {
      const date = new Date(value * 1000)
      const year = date.getFullYear()
      const month = date
        .getMonth()
        .toString()
        .padStart(2, 0)
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
      return year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second
    }
  },
  methods: {
    // 获取订单列表
    async getOrdersList() {
      const { data: res } = await this.$http.get('orders', {
        params: this.ordersParams
      })
      if (res.meta.status !== 200) return this.$msg.error('获取订单失败')
      this.ordersList = res.data.goods
      this.total = res.data.total
      this.$msg.success(res.meta.msg)
    },
    handleSizeChange(pagesize) {
      this.ordersParams.pagesize = pagesize
      this.getOrdersList()
    },
    handleCurrentChange(pagenum) {
      this.ordersParams.pagenum = pagenum
      this.getOrdersList()
    },
    showAddressDialog() {
      this.addressDialogVisible = true
    },
    closeAddressDialog() {
      this.$refs.addressFormRef.resetFields()
      this.addressDialogVisible = false
    }
  },
  components: {
    Breadcrumb
  }
}
</script>

<style scoped>
.orders-head {
  width: 25%;
}

.el-cascader {
  width: 100%;
}
</style>
