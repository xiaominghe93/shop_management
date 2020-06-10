<template>
  <div>
    <!-- 面包屑导航 -->
    <Breadcrumb :secondNav="'用户管理'" :thirdNav="'用户列表'" />
    <!-- 卡片试图 -->
    <el-card shadow="always">
      <!-- 搜索与添加用户 -->
      <div class="user-head">
        <el-row :gutter="20">
          <el-col :span="10">
            <el-input
              placeholder="请输入内容"
              class="input-with-select"
              v-model="userId"
              clearable
              @clear="clearSearchInput"
            >
              <el-button slot="append" icon="el-icon-search" @click="userIdSearch(userId)"></el-button>
            </el-input>
          </el-col>
          <el-col :span="4">
            <el-button type="primary" @click="dialogVisible = true">添加用户</el-button>
          </el-col>
        </el-row>
      </div>

      <!-- 用户列表数据 -->
      <el-table :data="usersList" border stripe style="width: 100%">
        <el-table-column type="index" label="#" width="50"></el-table-column>
        <el-table-column prop="username" label="姓名" width="180"></el-table-column>
        <el-table-column prop="email" label="邮箱" width="180"></el-table-column>
        <el-table-column prop="mobile" label="电话"></el-table-column>
        <el-table-column prop="role_name" label="角色"></el-table-column>
        <el-table-column label="状态">
          <!-- 用作用域插槽来获取每一行的数据 -->
          <template slot-scope="scope">
            <el-switch
              @change="userState(scope.row)"
              v-model="scope.row.mg_state"
              active-color="#13ce66"
              inactive-color="#ff4949"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template v-slot="scope">
            <el-tooltip effect="dark" content="编辑角色" placement="top" :enterable="false">
              <el-button
                type="primary"
                icon="el-icon-edit"
                size="mini"
                @click="editUserInfor(scope.row)"
              ></el-button>
            </el-tooltip>
            <el-tooltip effect="dark" content="删除角色" placement="top" :enterable="false">
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
                @click="deletUser(scope.row.id)"
              ></el-button>
            </el-tooltip>
            <el-tooltip effect="dark" content="分配角色" placement="top" :enterable="false">
              <el-button
                type="warning"
                icon="el-icon-setting"
                size="mini"
                @click="setRole(scope.row)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="pageTotal"
      ></el-pagination>

      <!-- 添加用户的对话框 -->
      <el-dialog title="添加用户" :visible.sync="dialogVisible" width="30%">
        <el-form :model="addForm" :rules="addFormrules" ref="userInfoRef" label-width="100px">
          <el-form-item label="用户名" prop="username">
            <el-input v-model="addForm.username"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="addForm.password"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="addForm.email"></el-input>
          </el-form-item>
          <el-form-item label="手机" prop="mobile">
            <el-input v-model="addForm.mobile"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="cancleAddUser">取 消</el-button>
          <el-button type="primary" @click="sentAddUserInfo">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 编辑用户信息 -->
      <el-dialog title="编辑用户" :visible.sync="editDialogVisible" width="30%">
        <el-form :model="editForm" :rules="editFormRules" ref="editUserInfoRef" label-width="100px">
          <el-form-item label="用户名">
            <el-input v-model="editForm.username" disabled></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="editForm.email"></el-input>
          </el-form-item>
          <el-form-item label="手机" prop="mobile">
            <el-input v-model="editForm.mobile"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="cancleEditUser">取 消</el-button>
          <el-button type="primary" @click="sentEditUserInfo">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 分配角色 -->
      <el-dialog title="提示" :visible.sync="setRoleDialogVisible" width="50%" @close="cloaseSetRole">
        <div>
          <p>当前的用户: {{editForm.username}}</p>
          <p>当前的角色: {{editForm.role_name}}</p>
          <p>
            当前的角色:
            <el-select v-model="roleId" placeholder="请选择">
              <el-option
                v-for="item in rolesList"
                :key="item.id"
                :label="item.roleName"
                :value="item.id"
              ></el-option>
            </el-select>
          </p>
        </div>

        <span slot="footer" class="dialog-footer">
          <el-button @click="setRoleDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="setRoleConfirm">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import Breadcrumb from '../common/Breadcrumb'
export default {
  data() {
    // 验证邮箱的规则
    var checkEmail = (rule, value, cb) => {
      // 验证邮箱的正则表达式
      const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
      if (regEmail.test(value)) {
        // 合法的邮箱
        return cb()
      }
      // 不合法邮箱
      cb(new Error('请输入合法的邮箱'))
    }
    // 验证手机的规则
    var checkMobile = (rule, value, cb) => {
      // 验证手机的正则表达式
      const regMobile = /^(0|86|17951)?(13[0-9]|15[0123456789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
      if (regMobile.test(value)) {
        // 合法手机号
        return cb()
      }
      // 不合法手机号
      cb(new Error('请输入合法的手机号'))
    }
    return {
      usersList: [],
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 2
      },
      pageTotal: null,
      addForm: {},
      addFormrules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 9, message: '长度在 3 到 9 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入电话', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      },
      dialogVisible: false,
      // 根据id查询用户
      userId: '',
      serchUser: [],
      editDialogVisible: false,
      // 编辑用户信息
      editForm: {},
      editFormRules: {
        // 编辑用户信息时的输入验证规则
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入电话', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      },
      // 分配角色对话框显示与隐藏
      setRoleDialogVisible: false,
      // 所有角色信息
      rolesList: [],
      roleId: ''
    }
  },
  components: {
    Breadcrumb
  },
  created() {
    this.getUsersList()
    this.getRoles()
  },
  methods: {
    // 获取用户列表
    async getUsersList() {
      const { data: res } = await this.$http.get('users', {
        params: this.queryInfo
      })
      if (res.meta.status !== 200) return this.$msg.error(res.meta.msg)
      this.usersList = res.data.users
      this.pageTotal = res.data.total
    },
    // 监听pagesize改变事件
    handleSizeChange(pagesize) {
      this.queryInfo.pagesize = pagesize
      this.getUsersList()
    },
    // 监听页码值改变时会触发
    handleCurrentChange(newpage) {
      this.queryInfo.pagenum = newpage
      this.getUsersList()
    },
    // 用户状态发生改变触发
    async userState(userInfo) {
      userInfo.mg_state = !userInfo.mg_state
      const { data: res } = await this.$http.put(
        `users/${userInfo.id}/state/${userInfo.mg_state}`
      )
      if (res.meta.status !== 200) return this.$msg.error(res.meta.msg)
      this.getUsersList()
      this.$msg.success(res.meta.msg)
    },
    // 点击对话框确认按钮 发送新添加用户信息
    sentAddUserInfo() {
      // 进行预校验 成功后提交
      this.$refs.userInfoRef.validate(async valid => {
        if (!valid) return this.$msg.warning('输入格式不正确')
        const { data: res } = await this.$http.post('users', this.addForm)
        if (res.meta.status !== 201) return this.$msg.error(res.meta.msg)
        this.getUsersList()
        this.$msg.success(res.meta.msg)
        this.$refs.userInfoRef.resetFields()
        this.dialogVisible = false
      })
    },
    // 取消添加用户
    cancleAddUser() {
      this.$refs.userInfoRef.resetFields()
      this.dialogVisible = false
    },
    // 根据id查询用户
    async userIdSearch(id) {
      const { data: res } = await this.$http.get(`users/${id}`)
      this.serchUser.push(res.data)
      this.usersList = this.serchUser
    },
    // 清空查询框
    clearSearchInput() {
      this.getUsersList()
    },
    // 编辑用户信息
    editUserInfor(userInfo) {
      this.editForm = userInfo
      this.editDialogVisible = true
    },
    // 编辑用户信息确认
    sentEditUserInfo() {
      this.$refs.editUserInfoRef.validate(async valid => {
        if (!valid) return this.$msg.warning('输入格式不正确')
        const { data: res } = await this.$http.put(
          `users/${this.editForm.id}`,
          this.editForm
        )
        if (res.meta.status !== 200) return this.$msg.error(res.meta.msg)
        this.getUsersList()
        this.$msg.success(res.meta.msg)
        this.$refs.editUserInfoRef.resetFields()
        this.editDialogVisible = false
      })
    },
    // 取消编辑用户信息
    cancleEditUser() {
      this.editDialogVisible = false
      this.$refs.editUserInfoRef.resetFields()
    },
    // 删除用户
    deletUser(id) {
      // 此处也可以使用变量将confirm的结果接收 根据结果来完成删除与取消
      this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          const { data: res } = await this.$http.delete(`users/${id}`)
          if (res.meta.status !== 200) return this.$msg.warning(res.meta.msg)
          this.getUsersList()
          this.$msg.success(res.meta.msg)
        })
        .catch(() => {
          this.$msg.info('取消了删除')
        })
    },
    // 分配角色按钮点击
    setRole(userInfo) {
      this.editForm = userInfo
      this.setRoleDialogVisible = true
    },
    // 获取所有可分配到角色
    async getRoles() {
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) return this.$msg.error(res.meta.msg)
      this.rolesList = res.data
      this.$msg.success(res.meta.msg)
    },
    // 分配角色确定
    async setRoleConfirm() {
      if (!this.roleId) return this.$msg.error('请确认要分配的角色')
      const { data: res } = await this.$http.put(
        `users/${this.editForm.id}/role`,
        {
          rid: this.roleId
        }
      )
      if (res.meta.status !== 200) return this.$msg.error('分配角色失败')
      this.getUsersList()
      this.$msg.success(res.meta.msg)
      this.setRoleDialogVisible = false
    },
    // 关闭分配角色的对话框
    cloaseSetRole() {
      this.roleId = ''
      this.editForm = {}
    }
  }
}
</script>

<style lang="less" scoped>
.user-head {
  margin-bottom: 15px;
}
</style>>
