<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/users' }">{{$t('home')}}</el-breadcrumb-item>
      <el-breadcrumb-item>{{$t('权限管理')}}</el-breadcrumb-item>
      <el-breadcrumb-item>{{$t('角色列表')}}</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <!-- 添加角色按钮区域 -->
      <el-row>
        <el-button type="primary" @click="addDialogVisible = true">
          {{$t('添加角色')}}
        </el-button>
      </el-row>
      <!-- 角色列表区域 -->
      <el-table :data="rolelist" border stripe>
        <!-- 展开列 -->
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row :class="['bdbottom', i1 === 0 ? 'bdtop' : '', 'vcenter']" v-for="(item1, i1) in scope.row.children" :key="item1.id">
              <!-- 渲染一级权限 -->
              <el-col :span="5">
                <el-tag closable @close="removeRightById(scope.row, item1.id)">{{ item1.authName }}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 渲染二级和三级权限 -->
              <el-col :span="19">
                <!-- 通过 for 循环嵌套渲染二级权限 -->
                <el-row :class="[i2 === 0 ? '' : 'bdtop', 'vcenter']" v-for="(item2, i2) in item1.children" :key="item2.id">
                  <el-col :span="6">
                    <el-tag type="success" closable @close="removeRightById(scope.row, item2.id)">{{ item2.authName }}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-tag type="warning" v-for="item3 in item2.children" :key="item3.id" closable @close="removeRightById(scope.row, item3.id)">{{ item3.authName }}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <!-- 索引列 -->
        <el-table-column type="index"></el-table-column>
        <el-table-column :label="$t('角色名称')" prop="roleName"></el-table-column>
        <el-table-column :label="$t('角色描述')" prop="roleDesc"></el-table-column>
        <el-table-column :label="$t('operation')">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" icon="el-icon-edit" @click="showEditDialog(scope.row.id)">
              {{$t('edit')}}
            </el-button>
            <el-button size="mini" type="danger" icon="el-icon-delete" @click="removeUserById(scope.row.id)">{{$t('delete')}}</el-button>
            <el-button type="warning" size="mini" icon="el-icon-setting" @click="showSetRightDialog(scope.row)">{{$t('权限分配')}}</el-button>
          </template>
        </el-table-column>
        <template slot="empty">
          <svg-icon name='empty' class="empty"></svg-icon>
        </template>
      </el-table>
    </el-card>
    <!--添加角色的对话框-->
    <dialogBox :title="$t('添加角色')" :dialogVisible='addDialogVisible' @close="addDialogClosed" @confirm='addRole'>
      <!--内容主体区域-->
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef">
        <el-form-item class="module_title">{{$t('角色名称')}}</el-form-item>
        <el-form-item prop="roleName">
          <el-input v-model.trim="addForm.roleName"></el-input>
        </el-form-item>
        <el-form-item class="module_title">{{$t('角色描述')}}</el-form-item>
        <el-form-item prop="roleDesc">
          <el-input v-model.trim="addForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
    </dialogBox>
    <!-- 分配权限对话框 -->
    <dialogBox :title="$t('权限分配')" :dialogVisible='setRightDialogVisible' @close="setRightDialogClosed" @confirm='allotRights'>
      <!--内容主体区域-->
      <!-- 树形控件 -->
      <el-tree :data="rightslist" :props="treeProps" show-checkbox node-key="id" default-expand-all :default-checked-keys="defKeys" ref="treeRef"></el-tree>
    </dialogBox>
    <!--编辑用户角色的对话框-->
    <dialogBox :title="$t('修改角色信息')" :dialogVisible='editDialogVisible' @close="editDialogClosed" @confirm='editRoleInfo'>
      <!--内容主体区域-->
      <el-form :model="editForm" :rules="addFormRules" ref="editFormRef">
        <el-form-item class="module_title">{{$t('角色名称')}}</el-form-item>
        <el-form-item prop="roleName">
          <el-input v-model.trim="editForm.roleName"></el-input>
        </el-form-item>
        <el-form-item class="module_title">{{$t('角色描述')}}</el-form-item>
        <el-form-item prop="roleDesc">
          <el-input v-model.trim="editForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
    </dialogBox>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        rolelist: [], // 所有角色列表数据
        setRightDialogVisible: false, // 控制分配权限对话框的显示与隐藏
        rightslist: [], // 所有权限数据
        // 树形控件的属性绑定对象
        treeProps: {
          label: 'authName',
          children: 'children',
        },
        defKeys: [], // 默认选择的节点Id值数组
        roleId: '', // 当前即将分配权限的角色id
        addDialogVisible: false, // 控制添加角色对话框是否显示
        // 添加角色的表单数据
        addForm: {
          roleName: '',
          roleDesc: '',
        },
        // 添加用户表单的验证规则对象
        addFormRules: {
          roleName: [
            { required: true, message: this.$t('请输入角色名称'), trigger: 'blur' },
            {
              min: 2,
              max: 10,
              message: this.$t('roleTips'),
              trigger: 'blur',
            },
          ],
          roleDesc: [
            { required: true, message: this.$t('请输入角色描述'), trigger: 'blur' },
            {
              min: 2,
              max: 10,
              message: this.$t('roleTips'),
              trigger: 'blur',
            },
          ],
        },
        editDialogVisible: false, // 控制修改角色信息对话框是否显示
        // 修改角色信息的表单数据
        editForm: {
          roleName: '',
          roleDesc: '',
        },
      }
    },
    created() {
      this.getRolesList()
    },
    methods: {
      // 获取所有角色的列表函数
      async getRolesList() {
        const { data: res } = await this.$http.get('roles')
        if (res.meta.status !== 200) {
          return this.$message.error(this.$t('failure'))
        }
        this.rolelist = res.data
      },
      // 监听 添加用户对话框的关闭事件
      addDialogClosed() {
        this.addDialogVisible = false
        // 表单内容重置为空
        this.$refs.addFormRef.resetFields() // 通过ref引用调用resetFields方法
      },
      // 根据Id删除对应的数据
      async removeRightById(role, rightId) {
        // 弹框提示用户是否删除
        const confirmResult = await this.$confirm(
          this.$t('deluserTips'),
          '', {
            confirmButtonText: this.$t('confirm'),
            cancelButtonText: this.$t('cancel'),
            type: 'warning',
          }
        ).catch((err) => err)

        if (confirmResult !== 'confirm') {
          return this.$message.info(this.$t('cancelO'))
        }
        const { data: res } = await this.$http.delete(
          `roles/${role.id}/rights/${rightId}`
        )
        if (res.meta.status !== 200) {
          return this.$message.error(this.$t('deldateF'))
        }
        this.$message.success(this.$t('deldateS'))
        role.children = res.data
      },
      // 展示分配权限的对话框
      async showSetRightDialog(role) {
        this.roleId = role.id
        // 获取所有权限数据
        const { data: res } = await this.$http.get('rights/tree')
        if (res.meta.status !== 200) {
          return this.$message.error(this.$t('failure'))
        }
        this.getLeafKeys(role, this.defKeys)
        // 把获取到的权限数据保存到data中
        this.rightslist = res.data
        this.setRightDialogVisible = true
      },
      // 通过递归的形式,获取角色下所有三级权限的id,并保存到 defkeys 数组中
      getLeafKeys(node, arr) {
        if (!node.children) {
          return arr.push(node.id)
        }
        node.children.forEach((item) => this.getLeafKeys(item, arr))
      },
      // 监听分配权限对话框的关闭事件
      setRightDialogClosed() {
        this.setRightDialogVisible = false;
        this.defKeys = [];
      },
      // 点击为角色分配权限
      async allotRights() {
        const keys = [
          ...this.$refs.treeRef.getCheckedKeys(),
          ...this.$refs.treeRef.getHalfCheckedKeys(),
        ]
        // console.log(keys)
        const idStr = keys.join(',')
        const { data: res } = await this.$http.post(
          `roles/${this.roleId}/rights`, { rids: idStr }
        )
        if (res.meta.status !== 200) {
          return this.$message.error(this.$t('updatedateF'))
        }
        this.$message.success(this.$t('updatedateS'))
        this.getRolesList()
        this.setRightDialogVisible = false
      },
      // 点击按钮 添加新角色
      addRole() {
        this.$refs.addFormRef.validate(async (valid) => {
          // console.log(valid)
          if (!valid) return
          // 可以发起添加角色的网络请求
          const { data: res } = await this.$http.post('roles', this.addForm)
          if (res.meta.status !== 201) return this.$message.error(this.$t('adddataF'))
          this.$message.success(this.$t('adddataS'))
          // 隐藏添加角色的对话框
          this.addDialogVisible = false
          // 重新发起请求角色列表
          this.getRolesList()
        })
      },
      // 监听 修改角色状态
      async showEditDialog(id) {
        this.editDialogVisible = true
        const { data: res } = await this.$http.get('roles/' + id)
        if (res.meta.status !== 200) {
          return this.$message.error(this.$t('failure'))
        }
        this.editForm = res.data
      },
      // 监听 修改角色信息对话框的关闭事件
      editDialogClosed() {
        this.editDialogVisible = false;
        // 表单内容重置为空
        this.$refs.editFormRef.resetFields(); // 通过ref引用调用resetFields方法
      },
      // 点击按钮 修改角色信息
      editRoleInfo() {
        this.$refs.editFormRef.validate(async (valid) => {
          if (!valid) return
          // 可以发起修改用户信息的网络请求
          const { data: res } = await this.$http.put(
            'roles/' + this.editForm.roleId,
            this.editForm
          )
          if (res.meta.status !== 200) {
            return this.$message.error(this.$t('updatedateF'))
          }
          this.$message.success(this.$t('updatedateS'))
          // 关闭对话框
          this.editDialogVisible = false
          // 重新发起请求角色列表
          this.getRolesList()
        })
      },
      // 根据ID删除对应的用户信息
      async removeUserById(id) {
        const confirmResult = await this.$confirm(
          this.$t('deluserTips'),
          '', {
            confirmButtonText: this.$t('confirm'),
            cancelButtonText: this.$t('cancel'),
            type: 'warning',
          }
        ).catch((err) => err)

        // 如果用户确认删除，则返回值为字符串 confirm
        // 如果用户取消删除，则返回值为字符串 cancel

        if (confirmResult !== 'confirm') {
          return this.$message.info(this.$t('cancelO'))
        }
        const { data: res } = await this.$http.delete('roles/' + id)
        if (res.meta.status !== 200) {
          return this.$message.error(this.$t('deldateF'))
        }
        this.$message.success(this.$t('deldateS'))
        this.getRolesList()
      },
    },
  }
</script>

<style lang="less" scoped>
  .el-tag {
    margin: 7px;
  }

  .bdtop {
    border-top: 1px solid #eee;
  }

  .bdbottom {
    border-bottom: 1px solid #eee;
  }

  .vcenter {
    display: flex;
    align-items: center;
  }
</style>