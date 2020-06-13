<template>
  <div>
    <!-- 面包屑导航 -->
    <Breadcrumb :secondNav="'商品管理'" :thirdNav="'参数列表'"></Breadcrumb>

    <!-- 卡片视图 -->
    <el-card>
      <el-alert title="注意：只允许为第三级分类设置相关参数！" type="warning" show-icon :closable="false"></el-alert>

      <!-- 选择分类的选择器 -->
      <div>
        选择商品分类：
        <el-cascader :options="category" :props="defaultProps" size="medium " @change="getCatId"></el-cascader>
      </div>

      <!-- 利用标签页展示动态参数与静态参数 -->
      <el-tabs v-model="activeName" @tab-click="tabClick">
        <el-tab-pane label="动态参数" name="dynamicAttri">
          <el-button type="primary" size="mini" @click="addParamsBtn('many')">添加参数</el-button>
          <el-table :data="goodsAttribute" border stripe>
            <el-table-column type="expand" width="50">
              <template slot-scope="scope">
                <el-tag
                  v-for="(item, index) in scope.row.attr_vals"
                  :key="index"
                  style="margin-right: 10px;margin-bottom: 10px;"
                  closable
                  @close="deleteAttrParams(scope.row, index)"
                >{{item}}</el-tag>
                <el-input
                  class="input-new-tag"
                  v-if="inputVisible"
                  v-model="inputValue"
                  ref="saveTagInput"
                  size="small"
                  @change="handleInputConfirm(scope.row)"
                ></el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput">+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column type="index" width="50"></el-table-column>
            <el-table-column label="参数名" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="primary"
                  icon="el-icon-edit"
                  @click="editParamsbtn(scope.row,'many')"
                >编辑</el-button>
                <el-button
                  size="mini"
                  type="danger"
                  icon="el-icon-delete"
                  @click="deleteAttr(scope.row.attr_id, 'many')"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="静态属性" name="staticParam">
          <el-button type="primary" size="mini" @click="addParamsBtn('only')">添加属性</el-button>
          <el-table :data="goodsAttribute" border stripe>
            <el-table-column type="expand" width="50">
              <template slot-scope="scope">
                <el-tag
                  v-for="(item, index) in scope.row.attr_vals"
                  :key="index"
                  style="margin-right: 10px;margin-bottom: 10px;"
                  closable
                  @close="deleteAttrParams(scope.row, index)"
                >{{item}}</el-tag>
                <el-input
                  class="input-new-tag"
                  v-if="inputVisible"
                  v-model="inputValue"
                  ref="saveTagInput"
                  size="small"
                  @change="handleInputConfirm(scope.row)"
                ></el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput">+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column type="index" width="50"></el-table-column>
            <el-table-column label="参数名" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="primary"
                  icon="el-icon-edit"
                  @click="editParamsbtn(scope.row,'only')"
                >编辑</el-button>
                <el-button
                  size="mini"
                  type="danger"
                  icon="el-icon-delete"
                  @click="deleteAttr(scope.row.attr_id, 'only')"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <!-- 添加动态参数与静态属性的dialog -->
    <el-dialog
      :title="typeBtn==='many'? '动态参数':'静态属性'"
      :visible.sync="paramAddDialogVisible"
      width="30%"
      @close="resetParamsForm"
    >
      <el-form :model="paramsAddForm" :rules="paramsFormRules" ref="paramsAddFormRef">
        <el-form-item :label="typeBtn==='many'? '动态参数':'静态属性'" prop="attr_name">
          <el-input v-model="paramsAddForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="paramAddDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addParamsConfirm">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改动态参数静态与属性的dialog -->
    <el-dialog
      :title="typeBtnEdit==='many'? '动态参数': '静态属性'"
      :visible.sync="paramEditDialogVisible"
      width="30%"
    >
      <el-form :model="paramsEditForm" :rules="paramsFormRules" ref="paramsEditFormRef">
        <el-form-item :label="typeBtnEdit==='many'? '动态参数': '静态属性'" prop="attr_name">
          <el-input v-model="paramsEditForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="paramEditDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editParamsConfirm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Breadcrumb from '../common/Breadcrumb'

export default {
  data() {
    return {
      defaultProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
        expandTrigger: 'hover'
      },
      // 选择后的分类id
      categoryValue: [],
      // 全部分类数据
      category: [],
      // 全部参数或者属性
      goodsAttribute: [],
      // 标签也默认显示
      activeName: 'dynamicAttri',
      // 添加修改参数对话框的显示与隐藏
      paramAddDialogVisible: false,
      paramsAddForm: {},
      paramsFormRules: {
        attr_name: [
          { required: true, message: '动态参数不能为空', trigger: 'blur' }
        ]
      },
      // 编辑参数与属性对话框的显示与隐藏
      paramEditDialogVisible: false,
      // 添加按钮属于动态参数还是静态属性
      paramsEditForm: {
        attr_name: '',
        attr_sel: '',
        attr_vals: ''
      },
      // 添加按钮的类型
      typeBtn: '',
      typeBtnEdit: '',
      attrId: '',
      inputVisible: false,
      inputValue: ''
    }
  },
  created() {
    this.getCategory()
  },
  methods: {
    // 获取所有分类参数
    // 获取分类
    async getCategory() {
      const { data: res } = await this.$http.get('categories')
      if (res.meta.status !== 200) return
      this.category = res.data
    },
    // 根据分类Id获取分类参数
    async getCateAttribute(id, type) {
      const { data: res } = await this.$http.get(
        `categories/${id}/attributes?sel=${type}`
      )

      if (res.meta.status !== 200) return this.$msg.error('分类参数获取失败')
      res.data = this.attrValsArr(res.data)
      this.goodsAttribute = res.data
    },
    // 将分类参数中attr_vals转为数组
    attrValsArr(data) {
      data.map(item => {
        if (!item.attr_vals) {
          item.attr_vals = []
          return
        }
        item.attr_vals = item.attr_vals.split(',')
      })
      return data
    },
    // 获取选中的分类的值
    getCatId(value) {
      this.categoryId = value[2]
      this.getCateAttribute(value[2], 'many')
    },
    // 切换标签
    tabClick(tab) {
      let type = ''
      if (tab.label === '动态参数') {
        type = 'many'
      } else {
        type = 'only'
      }
      if (!this.categoryId) return this.$msg.error('请选择分类')
      this.getCateAttribute(this.categoryId, type)
    },
    // 添加参数或者属性按钮
    addParamsBtn(type) {
      this.typeBtn = type
      this.paramsAddForm.attr_sel = type
      this.paramAddDialogVisible = true
    },

    // 确认添加动态参数
    addParamsConfirm() {
      this.$refs.paramsAddFormRef.validate(async valid => {
        if (!valid) return this.$msg.info('输入正确的内容')
        const { data: res } = await this.$http.post(
          `categories/${this.categoryId}/attributes`,
          this.paramsAddForm
        )
        if (res.meta.status !== 201) return this.$msg.error('添加参数失败')
        this.getCateAttribute(this.categoryId, this.typeBtn)
        this.$msg.success(res.meta.msg)
        this.paramAddDialogVisible = false
      })
    },
    // dialog关闭时清空ParamsForm
    resetParamsForm() {
      this.$refs.paramsAddFormRef.resetFields()
    },

    // 点击编辑
    editParamsbtn(parAtrrObj, type) {
      this.typeBtnEdit = type
      this.paramsEditForm.attr_name = parAtrrObj.attr_name
      this.paramsEditForm.attr_sel = parAtrrObj.attr_sel
      this.attrId = parAtrrObj.attr_id
      this.paramEditDialogVisible = true
    },
    // 编辑完成的提交
    editParamsConfirm() {
      this.$refs.paramsEditFormRef.validate(async valid => {
        if (!valid) return this.$msg.error('请输入正确的内容')
        const { data: res } = await this.$http.put(
          `categories/${this.categoryId}/attributes/${this.attrId}`,
          this.paramsEditForm
        )
        if (res.meta.status !== 200) return this.$msg.error('更新失败')
        this.getCateAttribute(this.categoryId, this.typeBtnEdit)
        this.$msg.success(res.meta.msg)
        this.paramEditDialogVisible = false
      })
    },
    async deleteAttr(id, type) {
      const reslut = await this.$confirm(
        '此操作将永久删除该属性, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)
      if (reslut !== 'confirm') return this.$msg.infor('取消了删除')
      const { data: res } = await this.$http.delete(
        `categories/${this.categoryId}/attributes/${id}`
      )
      if (res.meta.status !== 200) return this.$msg.error('删除失败')
      this.getCateAttribute(this.categoryId, type)
      this.$msg.success(res.meta.msg)
    },
    // 添加删除attr_vals
    showInput() {
      this.inputVisible = true
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },

    async handleInputConfirm(catAttr) {
      this.paramsEditForm.attr_name = catAttr.attr_name
      this.paramsEditForm.attr_sel = catAttr.attr_sel
      const inputValue = this.inputValue
      if (inputValue) {
        catAttr.attr_vals.push(inputValue)
        this.paramsEditForm.attr_vals = catAttr.attr_vals.join(',')
        const { data: res } = await this.$http.put(
          `categories/${this.categoryId}/attributes/${catAttr.attr_id}`,
          this.paramsEditForm
        )

        this.$msg.success(res.meta.msg)
      }
      this.inputVisible = false
      this.inputValue = ''
    },
    // 关闭tag是删除该特征
    async deleteAttrParams(catAttr, index) {
      this.paramsEditForm.attr_name = catAttr.attr_name
      this.paramsEditForm.attr_sel = catAttr.attr_sel
      catAttr.attr_vals.splice(index, 1)
      this.paramsEditForm.attr_vals = catAttr.attr_vals.join(',')
      const { data: res } = await this.$http.put(
        `categories/${this.categoryId}/attributes/${catAttr.attr_id}`,
        this.paramsEditForm
      )
      if (res.meta.status !== 200) return this.$msg.error('删除失败')
      this.$msg.success(res.meta.msg)
    }
  },
  components: {
    Breadcrumb
  }
}
</script>

<style scoped>
.el-cascader ul {
  height: 204px;
}

.input-new-tag {
  width: 90px;
}

.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
</style>
