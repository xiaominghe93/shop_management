<template>
  <div>
    <!-- 面包屑导航 -->
    <Breadcrumb :secondNav="'商品管理'" :thirdNav="'添加商品'"></Breadcrumb>

    <!-- 卡片视图 -->
    <el-card>
      <!-- 标签页信息标题 -->
      <el-alert title="添加商品" type="info" show-icon center :closable="false"></el-alert>

      <!-- 步骤条 -->
      <div class="steps">
        <el-steps :active="active" finish-status="success" align-center>
          <el-step title="基本信息"></el-step>
          <el-step title="商品参数"></el-step>
          <el-step title="商品属性"></el-step>
          <el-step title="商品图片"></el-step>
          <el-step title="商品内容"></el-step>
          <el-step title="完成"></el-step>
        </el-steps>
      </div>

      <!-- 标签页步骤 -->
      <el-form
        :model="goodsInfoForm"
        :rules="goodsInfoRules"
        ref="goodsInfoRef"
        label-width="100px"
        :label-position="'top'"
      >
        <el-tabs :tab-position="'left'" @tab-click="handleClick" :before-leave="beforeLeave">
          <el-tab-pane label="基本信息">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="goodsInfoForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input type="number" v-model="goodsInfoForm.goods_price"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input type="number" v-model="goodsInfoForm.goods_number"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input type="number" v-model="goodsInfoForm.goods_weight"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <el-cascader
                v-model="goodsInfoForm.goods_cat"
                :options="category"
                :props="defaultProps"
                size="medium "
                @change="getCatId"
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数">
            <el-form-item :label="item.attr_name" v-for="item in goodsParams" :key="item.attr_id">
              <el-checkbox-group v-model="item.attr_vals" @change="goodsParamsClick">
                <el-checkbox
                  border
                  v-for="attr_val in item.attr_vals"
                  :label="attr_val"
                  :key="attr_val"
                ></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性">
            <el-form-item
              v-for="item in goodsAttribute"
              :key="item.attr_id"
              :label="item.attr_name"
            >
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片">
            <el-upload
              action="http://127.0.0.1:8888/api/private/v1/upload"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :on-success="uploadSuccess"
              list-type="picture"
              :headers="headers"
            >
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容">
            <el-form-item>
              <quill-editor v-model="goodsInfoForm.goods_introduce"></quill-editor>
            </el-form-item>
            <el-button type="primary" @click="addGoods">添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>

    <!-- 图片预览对话框 -->
    <el-dialog title="预览" :visible.sync="previewDialogVisible" width="50%">
      <img :src="previewImgUrl" alt style="width: 100%;" />
    </el-dialog>
  </div>
</template>

<script>
import Breadcrumb from '../common/Breadcrumb'
import _ from 'lodash'

export default {
  data() {
    // 验证数字不能为负值
    var checkNumber = (rule, value, cb) => {
      const regNumber = /^\d+(\.\d+)?$/
      if (regNumber.test(value)) {
        return cb()
      }
      cb(new Error('请输入正确的数值'))
    }
    return {
      active: 0,
      // 添加新商品的表单
      goodsInfoForm: {
        goods_name: '',
        goods_price: 0,
        goods_number: 0,
        goods_weight: 0,
        goods_introduce: '',
        goods_cat: [],
        attrs: [],
        pics: []
      },
      // 新商品表单的验证
      goodsInfoRules: {
        goods_name: [
          { required: true, message: '商品名称不能为空', trigger: 'blur' }
        ],
        goods_price: [
          { required: true, message: '商品价格不能为空', trigger: 'blur' },
          { validator: checkNumber, trigger: 'blur' }
        ],
        goods_number: [
          { required: true, message: '商品数量不能为空', trigger: 'blur' },
          { validator: checkNumber, trigger: 'blur' }
        ],
        goods_weight: [
          { required: true, message: '商品重量不能为空', trigger: 'blur' },
          { validator: checkNumber, trigger: 'blur' }
        ],
        goods_cat: [
          { required: true, message: '商品分类不能为空', trigger: 'blur' }
        ]
      },
      category: [],
      defaultProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
        expandTrigger: 'hover'
      },
      // 商品动态参数
      goodsParams: [],
      // 商品静态属性
      goodsAttribute: [],
      // 为图片上传设置请求头
      headers: {
        Authorization: window.sessionStorage.getItem('token')
      },
      previewDialogVisible: false,
      previewImgUrl: ''
    }
  },
  components: {
    Breadcrumb
  },
  created() {
    this.getCategory()
  },
  methods: {
    // tab标签切换
    handleClick(tab) {
      this.active = parseInt(tab.index)
      if (tab.index === '1') {
        this.getCateAttribute(this.goodsInfoForm.goods_cat[2], 'many')
      } else if (tab.index === '2') {
        this.getCateAttribute(this.goodsInfoForm.goods_cat[2], 'only')
      }
    },
    // 获取分类
    async getCategory() {
      const { data: res } = await this.$http.get('categories')
      console.log(res)
      if (res.meta.status !== 200) return
      this.category = res.data
    },
    // 根据分类Id获取分类参数
    async getCateAttribute(id, type) {
      const { data: res } = await this.$http.get(
        `categories/${id}/attributes?sel=` + type
      )
      if (res.meta.status !== 200) return this.$msg.error('分类参数获取失败')
      if (type === 'many') {
        res.data.forEach(item => {
          if (!item.attr_vals) {
            item.attr_vals = []
            return
          }
          item.attr_vals = item.attr_vals.split(' ')
        })
        console.log(res.data)
        this.goodsParams = res.data
      } else {
        this.goodsAttribute = res.data
        console.log(this.goodsAttribute)
      }
    },
    // 获取选中的值
    getCatId(value) {
      if (this.goodsInfoForm.goods_cat.length !== 3) {
        this.goodsInfoForm.goods_cat = []
      }
    },
    // 切换标签页之前的函数
    beforeLeave(activeName, oldActiveName) {
      if (oldActiveName === '0' && this.goodsInfoForm.goods_cat.length !== 3) {
        this.$msg.error('请选择商品分类')
        return false
      }
    },
    goodsParamsClick(value) {
      console.log(value)
    },
    // 删除图片
    handleRemove(file) {
      const filePath = file.response.data.tmp_path
      const removeIndex = this.goodsInfoForm.pics.findIndex(
        x => x.pic === filePath
      )
      this.goodsInfoForm.pics.splice(removeIndex, 1)
    },
    // 预览图片
    handlePreview(file) {
      this.previewImgUrl = file.response.data.url
      this.previewDialogVisible = true
    },
    // 文件上传成功
    uploadSuccess(response) {
      if (response.meta.status !== 200) return this.$msg.error('图片上传失败')
      const picInfo = { pic: response.data.tmp_path }
      this.goodsInfoForm.pics.push(picInfo)
    },
    // 完成表单输入后 添加商品
    addGoods() {
      this.$refs.goodsInfoRef.validate(async valid => {
        if (!valid) return this.$msg.error('输入正确的商品信息')
        // 进行深拷贝避免改变goods_cat后元数据受影响报错
        const addForm = _.cloneDeep(this.goodsInfoForm)
        addForm.goods_cat = addForm.goods_cat.join(',')
        // 将动态参数 和 静态属性改造赋值给addform
        this.goodsParams.forEach(item => {
          const newInfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals.join(',')
          }
          addForm.attrs.push(newInfo)
        })
        this.goodsAttribute.forEach(item => {
          const newInfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals
          }
          addForm.attrs.push(newInfo)
        })
        const { data: res } = await this.$http.post('goods', addForm)
        console.log(res)
        if (res.meta.status !== 201) return this.$msg.error('创建商品失败')
        this.$msg.success(res.meta.msg)
        this.$router.push('/goods')
      })
    }
  }
}
</script>

<style scoped>
.el-alert {
  margin-bottom: 20px;
}

.el-button {
  margin-top: 20px;
}
</style>
