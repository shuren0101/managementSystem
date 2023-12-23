<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/users' }">{{$t('home')}}</el-breadcrumb-item>
      <el-breadcrumb-item>{{$t('商品管理')}}</el-breadcrumb-item>
      <el-breadcrumb-item>{{$t('分类参数')}}</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 警告区域 -->
      <el-alert :title="$t('note')" type="warning" show-icon closable></el-alert>
      <!-- 选择商品分类区域 -->
      <el-row class="cat_opt">
        <el-col>
          <span class="ma">{{$t('商品分类')}}:</span>
          <!-- 选择商品分类的级联选择框 -->
          <el-cascader :placeholder="$t('请选择')" v-model.trim="selectedCateKeys" :options="cateList" :props="cateProps" @change="handleChange"></el-cascader>
        </el-col>
      </el-row>
      <!-- tab 页签区域 -->
      <el-tabs v-model.trim="activeName" @tab-click="handleTabClick">
        <!-- 添加动态参数面板 -->
        <el-tab-pane :label="$t('动态参数')" name="many">
          <el-button type="primary" size="mini" :disabled="isBtnDisabled" @click="addDialogVisible = true">{{$t('添加参数')}}</el-button>
          <!-- 动态参数表格 -->
          <el-table :data="manyTableData" border stripe>
            <!-- 展开行 -->
            <el-table-column type="expand">
              <template slot-scope="scope">
                <!-- 循环渲染Tag标签 -->

                <el-tag v-for="(item, i) in scope.row.attr_vals" :key="i" closable @close="handleClose(i, scope.row)">{{ item }}</el-tag>
                <!-- 输入文本框 -->
                <el-input class="input-new-tag" v-if="scope.row.inputVisible" v-model.trim="scope.row.inputValue" ref="saveTagInput" size="small" @keyup.enter.native="handleInputConfirm(scope.row)" @blur="handleInputConfirm(scope.row)">
                </el-input>
                <!-- 添加按钮 -->
                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
              </template>
            </el-table-column>
            <!-- 索引列 -->
            <el-table-column type="index"></el-table-column>
            <el-table-column :label="$t('参数名称')" prop="attr_name"></el-table-column>
            <el-table-column :label="$t('operation')">
              <template slot-scope="scope">
                <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.attr_id)">{{$t('edit')}}</el-button>
                <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeParams(scope.row.attr_id)">{{$t('delete')}}
                </el-button>
              </template>
            </el-table-column>
            <template slot="empty">
              <svg-icon name='empty' class="empty"></svg-icon>
            </template>
          </el-table>
        </el-tab-pane>
        <!-- 添加静态属性面板 -->
        <el-tab-pane :label="$t('静态属性')" name="only">
          <el-button type="primary" size="mini" :disabled="isBtnDisabled" @click="addDialogVisible = true">{{$t('添加属性')}}</el-button>
          <!-- 静态参数表格 -->
          <el-table :data="onlyTableData" border stripe>
            <!-- 展开行 -->
            <el-table-column type="expand">
              <template slot-scope="scope">
                <!-- 循环渲染Tag标签 -->

                <el-tag v-for="(item, i) in scope.row.attr_vals" :key="i" closable @close="handleClose(i, scope.row)">{{ item }}</el-tag>
                <!-- 输入文本框 -->
                <el-input class="input-new-tag" v-if="scope.row.inputVisible" v-model.trim="scope.row.inputValue" ref="saveTagInput" size="small" @keyup.enter.native="handleInputConfirm(scope.row)" @blur="handleInputConfirm(scope.row)">
                </el-input>
                <!-- 添加按钮 -->
                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
              </template>
            </el-table-column>
            <!-- 索引列 -->
            <el-table-column type="index"></el-table-column>
            <el-table-column :label="$t('属性名称')" prop="attr_name"></el-table-column>
            <el-table-column :label="$t('operation')">
              <template slot-scope="scope">
                <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.attr_id)">{{$t('edit')}}</el-button>
                <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeParams(scope.row.attr_id)">{{$t('delete')}}
                </el-button>
              </template>
            </el-table-column>
            <template slot="empty">
              <svg-icon name='empty' class="empty"></svg-icon>
            </template>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <!-- 添加参数的对话框 -->
    <dialogBox :title="$t('add') + titleText" :dialogVisible='addDialogVisible' @close="addDialogClosed" @confirm='addParams'>
      <!--内容主体区域-->
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef">
        <el-form-item class="module_title">{{titleText}}</el-form-item>
        <el-form-item prop="attr_name">
          <el-input v-model.trim="addForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
    </dialogBox>

    <!-- 修改参数对话框 -->
    <dialogBox :title="$t('edit') + titleText" :dialogVisible='editDialogVisible' @close="editDialogClosed" @confirm='editParams'>
      <!--内容主体区域-->
      <el-form :model="editForm" :rules="editFormRules" ref="editFormRef">
        <el-form-item class="module_title">{{titleText}}</el-form-item>
        <el-form-item prop="attr_name">
          <el-input v-model.trim="editForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
    </dialogBox>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        // 商品分类列表
        cateList: [],
        // 级联选择框的配置对象
        cateProps: {
          expandTrigger: 'hover',
          value: 'cat_id',
          label: 'cat_name',
          children: 'children',
        },
        // 级联选择框双向绑定到的数组
        selectedCateKeys: [],
        // 被激活的页签的名称
        activeName: 'many',
        // 动态参数数据
        manyTableData: [],
        // 静态参数数据
        onlyTableData: [],
        // 控制添加对话框的显示与隐藏
        addDialogVisible: false,
        // 添加参数表单
        addForm: {},
        // 添加表单验证规则对象
        addFormRules: {
          attr_name: [
            { required: true, message: this.$t('请输入参数名称'), trigger: 'blur' },
          ],
        },
        // 控制添加对话框的显示与隐藏
        editDialogVisible: false,
        // 添加参数表单
        editForm: {},
        // 添加表单验证规则对象
        editFormRules: {
          attr_name: [
            { required: true, message: this.$t('请输入参数名称'), trigger: 'blur' },
          ],
        },
        // 控制按钮与文本框的切换显示
        inputVisible: false,
        // 文本框中输入的内容
        inputValue: '',
      }
    },
    created() {
      this.getCateList()
    },
    methods: {
      async getCateList() {
        // 获取所有的商品分类列表
        const { data: res } = await this.$http.get('categories')
        if (res.meta.status !== 200) {
          return this.$message.error(this.$t('failure'))
        }
        this.cateList = res.data
      },
      // 级联选择框选中项变化，会触发这个函数
      handleChange() {
        this.getParamsData()
      },
      // tab页签点击事件的处理函数
      handleTabClick() {
        this.getParamsData()
      },
      // 获取参数的列表数据
      async getParamsData() {
        if (this.selectedCateKeys.length !== 3) {
          this.selectedCateKeys = []
          this.manyTableData = []
          this.onlyTableData = []
          return
        }
        // 根据所选分类的id,和当前所处的面板获取对应的参数
        const { data: res } = await this.$http.get(
          `categories/${this.cateId}/attributes`, {
            params: { sel: this.activeName },
          }
        )
        if (res.meta.status !== 200) {
          return this.$message.error(this.$t('failure'))
        }
        res.data.forEach((item) => {
          item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
          // 控制文本框的显示与隐藏
          item.inputVisible = false
          // 文本框中输入的值
          item.inputValue = ''
        })
        console.log(res.data)

        if (this.activeName === 'many') {
          this.manyTableData = res.data
        } else {
          this.onlyTableData = res.data
        }
      },
      // 监听对话框的关闭事件
      addDialogClosed() {
        this.addDialogVisible = false;
        this.$refs.addFormRef.resetFields();
      },
      // 点击按钮 添加参数
      addParams() {
        this.$refs.addFormRef.validate(async (valid) => {
          if (!valid) {
            return
          }
          const { data: res } = await this.$http.post(
            `categories/${this.cateId}/attributes`, {
              attr_name: this.addForm.attr_name,
              attr_sel: this.activeName,
            }
          )
          if (res.meta.status !== 201) {
            return this.$message.error(this.$t('adddataF'))
          }
          this.$message.success(this.$t('adddataS'))
          this.addDialogVisible = false
          this.getParamsData()
        })
      },
      // 点击按钮展示修改对话框
      async showEditDialog(id) {
        const { data: res } = await this.$http.get(
          `categories/${this.cateId}/attributes/${id}`, {
            params: { attr_sel: this.activeName },
          }
        )
        if (res.meta.status !== 200) {
          return this.$message.error(this.$t('failure'))
        }
        this.editForm = res.data
        this.editDialogVisible = true
      },
      editDialogClosed() {
        this.editDialogVisible = false;
        this.$refs.editFormRef.resetFields();
      },
      // 点击按钮 修改参数
      editParams() {
        this.$refs.editFormRef.validate(async (valid) => {
          if (!valid) return
          const { data: res } = await this.$http.put(
            `categories/${this.cateId}/attributes/${this.editForm.attr_id}`, {
              attr_name: this.editForm.attr_name,
              attr_sel: this.activeName,
            }
          )
          if (res.meta.status !== 200) {
            return this.$message.error(this.$t('updatedateF'))
          }
          this.$message.success(this.$t('updatedateS'))
          this.getParamsData()
          this.editDialogVisible = false
        })
      },
      // 根据id删除对应的参数项
      async removeParams(id) {
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
        // 删除的业务逻辑
        const { data: res } = await this.$http.delete(
          `categories/${this.cateId}/attributes/${id}`
        )
        if (res.meta.status !== 200) {
          return this.$message.error(this.$t('deldateF'))
        }
        this.$message.success(this.$t('deldateS'))
        this.getParamsData()
      },
      // 文本框失去焦点，或者摁下了Enter都会触发
      async handleInputConfirm(row) {
        if (row.inputValue.trim().length === 0) {
          row.inputValue = ''
          row.inputVisible = false
          return
        }
        // 用户输入了内容
        row.attr_vals.push(row.inputValue.trim())
        row.inputValue = ''
        row.inputVisible = false
        this.sevaAttrVals(row)
      },
      // 将对 attr_vals 的操作保存到数据库
      async sevaAttrVals(row) {
        // 发送请求保存参数
        const { data: res } = await this.$http.put(
          `categories/${this.cateId}/attributes/${row.attr_id}`, {
            attr_name: row.attr_name,
            attr_sel: row.attr_sel,
            attr_vals: row.attr_vals.join(' '),
          }
        )
        if (res.meta.status !== 200) {
          return this.$message.error(this.$t('updatedateF'))
        }
        this.$message.success(this.$t('updatedateS'))
      },
      // 点击按钮，展示文本输入框
      showInput(row) {
        row.inputVisible = true
        this.$nextTick((_) => {
          this.$refs.saveTagInput.$refs.input.focus()
        })
      },
      // 删除对应的参数可选项
      handleClose(i, row) {
        row.attr_vals.splice(i, 1)
        this.sevaAttrVals(row)
      },
    },
    computed: {
      // 如果按钮需要被禁用则返回true 否则返回false
      isBtnDisabled() {
        if (this.selectedCateKeys.length !== 3) {
          return true
        }
        return false
      },
      // 当前选中的三级分类的id
      cateId() {
        if (this.selectedCateKeys.length === 3) {
          return this.selectedCateKeys[2]
        }
        return null
      },
      // 动态计算标题的文本
      titleText() {
        const emp = this.$i18n.locale == 'en' ? ' ' : ''
        if (this.activeName === 'many') {
          return emp + this.$t('动态参数')
        }
        return emp + this.$t('静态属性')
      },
    },
  }
</script>

<style lang="less" scoped>
  .cat_opt {
    margin: 15px 0;
  }

  .ma {
    margin-right: 10px;
  }

  .el-tag {
    margin: 10px;
  }

  .input-new-tag {
    width: 120px;
  }
</style>