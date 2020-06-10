<template>
  <div>
    <!-- 面包屑导航 -->
    <Breadcrumb :secondNav="'权限管理'" :thirdNav="'角色列表'"></Breadcrumb>

    <!-- 卡片视图 -->
    <el-card>
      <!-- 添加角色 -->
      <el-button type="primary" @click="rolesDialogVisible = true">添加角色</el-button>

      <el-table :data="rolesList" border stripe style="width: 100%;">
        <el-table-column width="50" type="expand">
          <template slot-scope="scope">
            <Rightsrender @deleteRights="deleteRightsById($event, scope.row)" :rights="scope.row.children"></Rightsrender>
          </template>
        </el-table-column>
        <el-table-column type="index" label="#" width="50"></el-table-column>
        <el-table-column prop="roleName" label="角色名称"></el-table-column>
        <el-table-column prop="roleDesc" label="角色描述"></el-table-column>
        <el-table-column label="操作" width="300">
          <template slot-scope="scope">
            <el-button
              type="primary"
              size="mini"
              icon="el-icon-edit"
              @click="editRoles(scope.row)"
            >编辑</el-button>
            <el-button
              type="danger"
              size="mini"
              icon="el-icon-delete"
              @click="deleteRole(scope.row.id)"
            >删除</el-button>
            <el-button
              type="warning"
              size="mini"
              icon="el-icon-setting"
              @click="allotRights(scope.row)"
            >分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 添加与编辑角色对话框 -->
    <el-dialog title="角色信息" :visible.sync="rolesDialogVisible" width="50%" @close="closeReset">
      <!-- 添加角色的表单 -->
      <el-form
        :model="rolesForm"
        :rules="rolesFormRules"
        ref="rolesFormRulesForm"
        label-width="100px"
        v-if="addEditShow"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="rolesForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="rolesForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>

      <!-- 编辑角色的表单 -->
      <el-form
        :model="editRolesForm"
        :rules="rolesFormRules"
        ref="rolesFormRulesForm"
        label-width="100px"
        v-else
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="editRolesForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="editRolesForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="rolesDialogVisible = false">取 消</el-button>
        <!-- 添加dialog提交 -->
        <el-button type="primary" @click="addRoles" v-if="addEditShow">确 定</el-button>
        <!-- 编辑dialog提交 -->
        <el-button type="primary" @click="sendEditRoles" v-else>确 定</el-button>
      </span>
    </el-dialog>

    <!-- 分配权限 -->
    <el-dialog title="分配权限" @close="resetDefaultKey" :visible.sync="allotRightsVisible" width="30%">
      <el-tree
        :data="allRightsLsit"
        default-expand-all
        :props="defaultProps"
        show-checkbox
        node-key="id"
        :default-checked-keys="defaultKey"
        ref="treeRef"
      ></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="allotRightsVisible = false">取 消</el-button>
        <el-button type="primary" @click="allotRightsConfirm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Breadcrumb from '../common/Breadcrumb'
import Rightsrender from '../common/Rightsrender'

export default {
  data() {
    return {
      rolesList: [],
      rolesDialogVisible: false,
      rolesForm: {
        id: '',
        roleName: '',
        roleDesc: ''
      },
      editRolesForm: {},
      rolesFormRules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' },
          { min: 3, max: 6, message: '长度在 3 到 6 个字符', trigger: 'blur' }
        ],
        roleDesc: [
          { required: true, message: '请输入角色描述', trigger: 'blur' },
          { min: 2, max: 6, message: '长度在 2 到 6 个字符', trigger: 'blur' }
        ]
      },
      // 控制添加角色和编辑角色对话框中表单的对应显示
      addEditShow: true,
      allotRightsVisible: false,
      // 该角色权限数据列表
      rightsLsit: [],
      // 所有的可分配的权限列表
      allRightsLsit: [],
      defaultProps: {
        children: 'children',
        label: 'authName'
      },
      // 当前角色的id
      roleId: '',
      // 默认选中的节点
      defaultKey: []
    }
  },
  created() {
    this.getRoles()
  },
  methods: {
    // 获取角色列表
    async getRoles() {
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) return this.$msg.error(res.meta.msg)
      this.rolesList = res.data
      this.$msg.success(res.meta.msg)
    },
    // 添加角色
    addRoles() {
      this.$refs.rolesFormRulesForm.validate(async valid => {
        if (!valid) return this.$msg.warning('请输入正确的格式')
        const { data: res } = await this.$http.post('roles', this.rolesForm)
        if (res.meta.status !== 201) return this.$msg.error(res.meta.msg)
        this.getRoles()
        this.$msg.success(res.meta.msg)
        this.rolesDialogVisible = false
      })
    },
    // 点击编辑角色 对话框显示为编辑dialog
    editRoles(roles) {
      this.rolesDialogVisible = true
      this.addEditShow = false
      this.editRolesForm = roles
    },
    // 编辑角色完成后提交
    async sendEditRoles() {
      const { data: res } = await this.$http.put(
        `roles/${this.editRolesForm.id}`,
        this.editRolesForm
      )
      if (res.meta.status !== 200) return this.$msg.error(res.meta.msg)
      this.getRoles()
      this.rolesDialogVisible = false
      this.$msg.success('修改角色信息成功')
    },
    // dialog关闭时重置表单
    closeReset() {
      this.addEditShow = true
      this.$refs.rolesFormRulesForm.resetFields()
    },
    // 删除角色
    async deleteRole(id) {
      const reslut = await this.$confirm(
        '此操作将永久删除该角色, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)
      if (reslut !== 'confirm') return this.$msg.warning('取消删除成功')
      const { data: res } = await this.$http.delete('roles/' + id)
      if (res.meta.status !== 200) return this.$msg.error('删除角色失败')
      this.getRoles()
      this.$msg.success('删除角色成功')
    },
    // 根据Id来删除权限
    async deleteRightsById(rightId, role) {
      const { data: res } = await this.$http.delete(
        `roles/${role.id}/rights/${rightId}`
      )
      if (res.meta.status !== 200) return this.$msg.error(res.meta.msg)
      role.children = res.data
      this.$msg.success(res.meta.msg)
    },
    // 获取所有可分配的权限列表
    async getAllRightsList() {
      const { data: res } = await this.$http.get('rights/' + 'tree')
      if (res.meta.status !== 200) return this.$msg.error('获取权限列表失败')
      this.allRightsLsit = res.data
    },
    // 通过递归的方法来获取默认选中的节点并赋值给defaultKey数组
    getDefaultKey(node, arr) {
      if (!node.children) return arr.push(node.id)
      node.children.forEach(item => this.getDefaultKey(item, arr))
    },
    // 分配权限
    allotRights(role) {
      this.roleId = role.id
      this.getAllRightsList()
      this.getDefaultKey(role, this.defaultKey)
      this.allotRightsVisible = true
    },
    // 关闭分配权限对话框时重置defaultKey
    resetDefaultKey() {
      this.defaultKey = []
    },
    // 分配权限完成 发送所选的权限
    async allotRightsConfirm() {
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys()
      ]
      const idStr = keys.join(',')

      const { data: res } = await this.$http.post(
        `roles/${this.roleId}/rights`,
        { rids: idStr }
      )
      if (res.meta.status !== 200) return this.$msg.error('分配权限失败')
      this.getRoles()
      this.$msg.success(res.meta.msg)
      this.allotRightsVisible = false
    }
  },
  components: {
    Breadcrumb,
    Rightsrender
  }
}
</script>

<style>
</style>
