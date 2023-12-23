<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/users' }">{{$t('home')}}</el-breadcrumb-item>
      <el-breadcrumb-item>{{$t('用户管理')}}</el-breadcrumb-item>
      <el-breadcrumb-item>{{$t('用户列表')}}</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区 -->
    <el-card class="box-card">
      <!-- 搜索与添加区域 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input :placeholder="$t('请输入内容')" v-model.trim="queryInfo.query" clearable @clear="getUserList">
            <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible = true">{{$t('添加用户')}}</el-button>
        </el-col>
      </el-row>
      <!-- 用户列表区域 -->
      <el-table :data="userlist" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column :label="$t('name')" prop="username"></el-table-column>
        <el-table-column :label="$t('email')" prop="email"></el-table-column>
        <el-table-column :label="$t('phone')" prop="mobile"></el-table-column>
        <el-table-column :label="$t('role')" prop="role_name"></el-table-column>
        <el-table-column :label="$t('state')" prop="mg_state">
          <template slot-scope="scope">
            <el-switch v-model.trim="scope.row.mg_state" @change="userStateChanged(scope.row)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column :label="$t('operation')">
          <template slot-scope="scope">
            <!-- 修改按钮 -->
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.id)"></el-button>
            <!-- 删除按钮 -->
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeUserById(scope.row.id)"></el-button>
            <!-- 分配角色按钮 -->
            <el-tooltip effect="dark" :content="$t('setting')" placement="top" :enterable="false">
              <el-button type="warning" icon="el-icon-setting" size="mini" @click="setRole(scope.row)"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
        <template slot="empty">
          <svg-icon name='empty' class="empty"></svg-icon>
        </template>
      </el-table>

      <!-- 分页区域 -->
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="queryInfo.pagenum" :page-sizes="[1, 2, 5, 10]" :page-size="queryInfo.pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </el-card>
    <!-- 添加用户的对话框 -->
    <dialogBox :title="$t('添加用户')" :dialogVisible='addDialogVisible' @close="addDialogClosed" @confirm='addUser'>
      <!-- 内容主体区域 -->
      <el-form :model="addForm" :rules="addFormRules" ref="addFromRef">
        <el-form-item class="module_title">{{$t('username')}}</el-form-item>
        <el-form-item prop="username">
          <el-input v-model.trim="addForm.username"></el-input>
        </el-form-item>
        <el-form-item class="module_title">{{$t('pwd')}}</el-form-item>
        <el-form-item prop="password">
          <el-input type="password" v-model.trim="addForm.password"></el-input>
        </el-form-item>
        <el-form-item class="module_title">{{$t('email')}}</el-form-item>
        <el-form-item prop="email">
          <el-input v-model.trim="addForm.email"></el-input>
        </el-form-item>
        <el-form-item class="module_title">{{$t('phone')}}</el-form-item>
        <el-form-item prop="mobile">
          <el-input v-model.trim="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
    </dialogBox>
    <!-- 修改用户的对话框 -->
    <dialogBox :title="$t('修改用户')" :dialogVisible='editDialogVisible' @close="editDialogClosed" @confirm='editUserInfo'>
      <!-- 内容主体区域 -->
      <el-form :model="editForm" :rules="editFormRules" ref="editFormRef">
        <el-form-item class="module_title">{{$t('username')}}</el-form-item>
        <el-form-item>
          <el-input v-model.trim="editForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item class="module_title">{{$t('email')}}</el-form-item>
        <el-form-item prop="email">
          <el-input v-model.trim="editForm.email"></el-input>
        </el-form-item>
        <el-form-item class="module_title">{{$t('phone')}}</el-form-item>
        <el-form-item prop="mobile">
          <el-input v-model.trim="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>
    </dialogBox>
    <!-- 分配角色对话框 -->
    <dialogBox :title="$t('分配角色')" :dialogVisible='setRoleDialogVisible' @close="setRoleDialogClosed" @confirm='saveRoleInfo'>
      <!-- 内容主体区域 -->
      <el-form>
        <el-form-item class="module_title">{{$t('username')}}</el-form-item>
        <el-form-item>{{userInfo.username}}</el-form-item>
        <el-form-item class="module_title">{{$t('role')}}</el-form-item>
        <el-form-item>{{userInfo.role_name}}</el-form-item>
        <el-form-item class="module_title">{{$t('分配新角色')}}</el-form-item>
        <el-form-item>
          <el-select v-model.trim="selectedRoleId" :placeholder="$t('请选择')">
            <el-option v-for="item in rolesList" :key="item.id" :label="item.roleName" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </dialogBox>
  </div>
</template>

<script>
  export default {
    data() {
      // 验证邮箱的规则
      var checkEmail = (rule, value, cb) => {
        // 验证邮箱的正则表达式
        const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
        if (regEmail.test(value)) {
          // 合法邮箱
          return cb()
        }
        cb(new Error(this.$t('请输入合法的邮箱')))
      }
      var checkMobile = (rule, value, cb) => {
        // 验证手机号的正则表达式
        const regMobile = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/

        if (regMobile.test(value)) {
          return cb()
        }
        cb(new Error(this.$t('请输入合法的手机号')))
      }
      return {
        // 获取用户列表的参数对象
        queryInfo: {
          query: '',
          // 当前的页数
          pagenum: 1,
          // 当前每页显示多少条数据
          pagesize: 10,
        },
        userlist: [],
        total: 0,
        // 控制添加用户对话框的显示与隐藏
        addDialogVisible: false,
        // 控制分配角色对话框的显示与隐藏
        setRoleDialogVisible: false,
        // 需要被分配角色的用户信息
        userInfo: {},
        // 所有角色的数据列表
        rolesList: [],
        // 已选中的角色id值
        selectedRoleId: '',
        // 添加用户的表单数据
        addForm: {
          username: '',
          password: '',
          email: '',
          mobile: '',
        },
        // 添加表单的验证规则对象
        addFormRules: {
          username: [
            { required: true, message: this.$t('请输入用户名'), trigger: 'blur' },
            {
              min: 3,
              max: 10,
              message: this.$t('usernameTips'),
              trigger: 'blur',
            },
          ],
          password: [
            { required: true, message: this.$t('请输入密码'), trigger: 'blur' },
            {
              min: 6,
              max: 15,
              message: this.$t('pwdTips'),
              trigger: 'blur',
            },
          ],
          email: [
            { required: true, message: this.$t('请输入邮箱'), trigger: 'blur' },
            { validator: checkEmail, trigger: 'blur' },
          ],
          mobile: [
            { required: true, message: this.$t('请输入手机号'), trigger: 'blur' },
            { validator: checkMobile, trigger: 'blur' },
          ],
        },
        // 控制修改用户对话框的显示与隐藏
        editDialogVisible: false,
        // 查询到的用户信息对象
        editForm: {},
        // 修改表单的验证规则对象
        editFormRules: {
          email: [
            { required: true, message: this.$t('请输入邮箱'), trigger: 'blur' },
            { validator: checkEmail, trigger: 'blur' },
          ],
          mobile: [
            { required: true, message: this.$t('请输入手机号'), trigger: 'blur' },
            { validator: checkMobile, trigger: 'blur' },
          ],
        },
      }
    },
    created() {
      this.getUserList()
    },
    methods: {
      async getUserList() {
        const { data: res } = await this.$http.get('users', {
          params: this.queryInfo,
        })
        if (res.meta.status !== 200) {
          return this.$message.error(this.$t('failure'))
        }
        this.userlist = res.data.users
        this.total = res.data.total
      },
      // 监听 pagesize 改变的事件
      handleSizeChange(val) {
        this.queryInfo.pagesize = val
        this.getUserList()
      },
      // 监听 页码值 改变的事件
      handleCurrentChange(val) {
        this.queryInfo.pagenum = val
        this.getUserList()
      },
      // 监听 switch 开关状态的改变
      async userStateChanged(userinfo) {
        const { data: res } = await this.$http.put(
          `users/${userinfo.id}/state/${userinfo.mg_state}`
        )
        if (res.meta.status !== 200) {
          userinfo.mg_state = !userinfo.mg_state
          return this.$message.error(this.$t('updatedateF'))
        }
        this.$message.success(this.$t('updatedateS'))
      },
      // 监听添加用户对话框的关闭事件
      addDialogClosed() {
        this.addDialogVisible = false;
        this.$refs.addFromRef.resetFields()
      },
      // 点击按钮，添加新用户
      addUser() {
        this.$refs.addFromRef.validate(async (valid) => {
          if (!valid) return
          // 可以发起添加用户的网络请求
          const { data: res } = await this.$http.post('users', this.addForm)
          if (res.meta.status !== 201) {
            this.$message.error(this.$t('adddataF'))
          }
          this.$message.success(this.$t('adddataS'))
          // 隐藏添加的对话框
          this.addDialogVisible = false
          // 重新获取用户列表数据
          this.getUserList()
        })
      },
      // 展示编辑用户的对话框
      async showEditDialog(id) {
        const { data: res } = await this.$http.get('users/' + id)
        if (res.meta.status !== 200) {
          return this.$message.error(this.$t('failure'))
        }
        this.editForm = res.data
        this.editDialogVisible = true
      },
      // 监听修改用户对话框的关闭事件
      editDialogClosed() {
        this.editDialogVisible = false;
        this.$refs.editFormRef.resetFields()
      },
      // 修改用户信息并提交
      editUserInfo() {
        this.$refs.editFormRef.validate(async (valid) => {
          if (!valid) return this.$message.error(this.$t('formatErr'))
          // 发起修改用户信息的数据请求
          const { data: res } = await this.$http.put(
            'users/' + this.editForm.id, {
              email: this.editForm.email,
              mobile: this.editForm.mobile,
            }
          )
          if (res.meta.status !== 200) {
            return this.$message.error(this.$t('updatedateF'))
          }
          // 关闭对话框
          this.editDialogVisible = false
          // 刷新数据列表
          this.getUserList()
          // 提示修改成功
          this.$message.success(this.$t('updatedateS'))
        })
      },
      // 根据Id删除对应的用户信息
      async removeUserById(id) {
        // 弹窗询问用户是否删除数据
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
        const { data: res } = await this.$http.delete('users/' + id)
        if (res.meta.status !== 200) {
          return this.$message.error(this.$t('deldateF'))
        }
        this.$message.success(this.$t('deldateS'))
        this.getUserList()
      },
      // 展示分类角色的对话框
      async setRole(userInfo) {
        this.userInfo = userInfo
        // 在展示对话框之前，获取所有角色的列表
        const { data: res } = await this.$http.get('roles')
        if (res.meta.status !== 200) {
          return this.$message.error(this.$t('failure'))
        }
        this.rolesList = res.data
        this.setRoleDialogVisible = true
      },
      // 点击按钮分配角色
      async saveRoleInfo() {
        if (!this.selectedRoleId) {
          return this.$message.error(this.$t('请选择'))
        }

        const { data: res } = await this.$http.put(
          `users/${this.userInfo.id}/role`, {
            rid: this.selectedRoleId,
          }
        )
        if (res.meta.status !== 200) {
          return this.$message.error(this.$t('updatedateF'))
        }
        this.$message.success(this.$t('updatedateS'))
        this.getUserList()
        this.setRoleDialogVisible = false
      },
      // 监听分配角色对话框的关闭事件
      setRoleDialogClosed() {
        this.setRoleDialogVisible = false;
        this.selectedRoleId = '';
        this.userInfo = {};
      },
    },
  }
</script>

<style lang="less" scoped></style>