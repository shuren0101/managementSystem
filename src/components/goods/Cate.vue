<template>
  <div>
    <!--面包屑导航区域-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!--卡片视图区域-->
    <el-card>
      <!--添加分类按钮区域-->
      <el-row>
        <el-col>
          <el-button type="primary" @click="showAddCateDialog"
            >添加分类</el-button
          >
        </el-col>
      </el-row>
      <!--分类列表区域-->
      <tree-table
        class="treeTable"
        :data="cateList"
        :columns="columns"
        :selection-type="false"
        :expand-type="false"
        show-index
        index-text="#"
        border
        :show-row-hover="false"
      >
        <template slot="isok" scope="scope">
          <i v-if="!scope.row.cat_deleted" class="el-icon-success"></i>
          <i v-else class="el-icon-error"></i>
        </template>
        <!--排序的作用域插槽-->
        <template slot="order" scope="scope">
          <el-tag v-if="scope.row.cat_level == 0">一级</el-tag>
          <el-tag v-else-if="scope.row.cat_level == 1" type="success"
            >二级</el-tag
          >
          <el-tag v-else type="warning">三级</el-tag>
        </template>
        <!--操作的作用域插槽-->
        <template slot="operate" scope="scope">
          <el-button
            size="mini"
            type="primary"
            icon="el-icon-edit"
            @click="editCateDialog(scope.row.cat_id)"
          >
            编辑
          </el-button>
          <el-button
            size="mini"
            type="danger"
            icon="el-icon-delete"
            @click="delCateDialog(scope.row.cat_id)"
          >
            删除
          </el-button>
        </template>
      </tree-table>
      <!--分页区域-->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[3, 5, 10, 15]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>
    <!--添加分类的对话框-->
    <el-dialog
      title="添加分类"
      :visible.sync="addCateDialogVisible"
      width="50%"
      @close="addCateDialogClosed"
    >
      <!--添加分类表单区域-->
      <el-form
        :model="addCateForm"
        :rules="addCateFormRules"
        ref="addCateFormRef"
        label-width="90px"
      >
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类">
          <!--级联选择器-->
          <!-- options用来指定数据源  props用来指定配置对象-->
          <el-cascader
            v-model="selectedKeys"
            :options="parentCateList"
            :props="cascaderProps"
            @change="parentCateChanged"
            clearable
            ref="cascaderRef"
            @expand-change="cascaderClick"
            @visible-change="cascaderClick"
          ></el-cascader>
        </el-form-item>
      </el-form>
      <!--底部按钮区域-->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCate">确 定</el-button>
      </span>
    </el-dialog>
    <!--编辑商品分类的对话框-->
    <el-dialog
      title="编辑分类信息"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editDialogClosed"
    >
      <!--内容主体区域-->
      <el-form
        :model="editForm"
        :rules="addCateFormRules"
        ref="editFormRef"
        label-width="90px"
      >
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="editForm.cat_name"></el-input>
        </el-form-item>
      </el-form>
      <!--底部按钮区域-->
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editCateInfo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 查询条件
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5,
      },
      cateList: [], // 商品分类列表数据
      total: 0, // 总数据条数
      // 为table表格各列的配置定义
      columns: [
        {
          label: '分类名称', // 列标题名称
          prop: 'cat_name', // 对应列内容的属性名
        },
        {
          label: '是否有效',
          type: 'template', // 表示：把当前列定义为模板列
          template: 'isok', // 表示当前这列使用的模板名称
        },
        {
          label: '排序',
          type: 'template', // 表示：把当前列定义为模板列
          template: 'order', // 表示当前这列使用的模板名称
        },
        {
          label: '操作',
          type: 'template', // 表示：把当前列定义为模板列
          template: 'operate', // 表示当前这列使用的模板名称
        },
      ],
      addCateDialogVisible: false, // 控制添加分类对话框是否显示
      // 添加分类的表单数据对象
      addCateForm: {
        cat_name: '', // 将要添加的分类名称
        cat_pid: 0, // 父分类的ID
        cat_level: 0, // 要添加分类的等级，默认要添加的是一级分类
      },
      // 添加分类表单的验证规则对象
      addCateFormRules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' },
        ],
      },
      parentCateList: [], // 父级分类列表数据
      // 指定级联选择器的配置对象
      cascaderProps: {
        expandTrigger: 'hover', // 次级菜单的展开方式 click / hover
        checkStrictly: true, // 允许选择任意一级的选项
        value: 'cat_id', // 指定选中值的属性
        label: 'cat_name', // 指定选中标签的名称
        children: 'children', // 指定父子嵌套的属性
      },
      // 选中的父级分类的ID数组
      selectedKeys: [],
      editDialogVisible: false, // 控制编辑分类的对话框是否显示
      // 编辑分类信息的表单数据
      editForm: {
        cat_name: '',
      },
    }
  },
  created() {
    this.getCateList()
  },
  methods: {
    // 获取商品分类数据
    async getCateList() {
      const { data: res } = await this.$http.get('categories', {
        params: this.queryInfo,
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品分类失败')
      }
      console.log(res.data)
      this.cateList = res.data.result
      // 带参数请求，返回的数据多一层result，还有总数total，当前页pagenum，当然页条数pagesize
      this.total = res.data.total
    },
    // 监听 pagesize 改变
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getCateList()
    },
    // 监听pagenum 改变
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.getCateList()
    },
    // 点击按钮 弹出添加分类对话框
    showAddCateDialog() {
      // 获取父级分类的数据列表
      this.getParentCateList()
      this.addCateDialogVisible = true
    },
    // 获取父级分类的数据列表
    async getParentCateList() {
      const { data: res } = await this.$http.get('categories', {
        params: { type: 2 },
      })
      console.log(res)
      if (res.meta.status !== 200) {
        return this.$message.error('获取父级分类数据失败')
      }
      this.parentCateList = res.data
    },
    // 选择项发生变化时触发这个函数
    parentCateChanged() {
      console.log(this.selectedKeys)
      // 如果 selectedKeys 数据中的 length 大于0，则证明选中了父级分类
      // 反之，就说明没有选中任何父级分类
      if (this.selectedKeys.length > 0) {
        // 选择最后一项当作父分类ID赋值
        this.addCateForm.cat_pid = this.selectedKeys[
          this.selectedKeys.length - 1
        ]
        // 为当前要添加的分类的等级赋值
        this.addCateForm.cat_level = this.selectedKeys.length
        return
      } else {
        // 父分类ID赋值
        this.addCateForm.cat_pid = 0
        // 为当前要添加的分类的等级赋值
        this.addCateForm.cat_level = 0
      }
      console.log(this.addCateForm)
    },
    // 解决bug：点击圆圈后是自动收起下拉；点击文字label同样实现效果
    cascaderClick() {
      let that = this
      setTimeout(function () {
        document.querySelectorAll('.el-cascader-node__label').forEach((el) => {
          el.onclick = function () {
            this.previousElementSibling.click()
            that.$refs.cascaderRef.dropDownVisible = false
          }
        })
        document
          .querySelectorAll('.el-cascader-panel .el-radio')
          .forEach((el) => {
            el.onclick = function () {
              that.$refs.cascaderRef.dropDownVisible = false
            }
          })
      }, 100)
    },
    // 监听 添加分类对话框的关闭事件
    addCateDialogClosed() {
      // 表单内容重置为空
      this.$refs.addCateFormRef.resetFields() // 通过ref引用调用resetFields方法
      // 选中的父级分类的ID数组 重置为空
      this.selectedKeys = []
      // 父分类id 和 当前分类等级 重置为空
      this.addCateForm.cat_pid = 0
      this.addCateForm.cat_level = 0
    },
    // 点击按钮，添加新的分类
    addCate() {
      // console.log(this.addCateForm)
      this.$refs.addCateFormRef.validate(async (valid) => {
        if (!valid) return
        // 可以发起添加分类的网络请求
        const { data: res } = await this.$http.post(
          'categories',
          this.addCateForm
        )
        if (res.meta.status !== 201) {
          this.$message.error('添加商品分类失败！')
        }
        this.$message.success('添加商品分类成功！')
        this.getCateList()
        this.addCateDialogVisible = false
      })
    },
    // 监听 编辑分类对话框
    async editCateDialog(id) {
      // 发起根据 id 查询分类的网络请求
      const { data: res } = await this.$http.get('categories/' + id)
      if (res.meta.status !== 200) {
        this.$message.error('查询分类信息失败')
      }
      this.editForm = res.data
      this.editDialogVisible = true
    },
    // 监听 编辑分类信息对话框的关闭事件
    editDialogClosed() {
      // 表单内容重置为空
      this.$refs.editFormRef.resetFields() // 通过ref引用调用resetFields方法
    },
    // 点击按钮 修改角色信息
    editCateInfo() {
      this.$refs.editFormRef.validate(async (valid) => {
        if (!valid) return
        // 可以发起修改用户信息的网络请求
        const { data: res } = await this.$http.put(
          'categories/' + this.editForm.cat_id,
          { cat_name: this.editForm.cat_name }
        )
        if (res.meta.status !== 200) {
          return this.$message.error('编辑商品分类失败！')
        }
        this.$message.success('编辑商品分类成功！')
        this.getCateList()
        this.editDialogVisible = false
      })
    },
    // 监听 删除分类对话框
    async delCateDialog(id) {
      console.log(id)
      // 弹框 询问用户是否删除
      const confirmResult = await this.$confirm(
        '此操作将永久删除该分类, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }
      ).catch((err) => err)

      // 如果用户确认删除，则返回值为字符串 confirm
      // 如果用户取消删除，则返回值为字符串 cancel
      // console.log(confirmResult)
      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消删除')
      }
      // console.log('确认删除')
      const { data: res } = await this.$http.delete('categories/' + id)
      if (res.meta.status !== 200) {
        return this.$message.error('删除分类失败！')
      }
      this.$message.success('删除分类成功！')
      this.getCateList()
    },
  },
}
</script>

<style lang="less" scoped>
.el-icon-success {
  color: lightgreen;
}

.el-icon-error {
  color: red;
}

.treeTable {
  margin-top: 15px;
}

.el-cascader {
  width: 100%;
}
</style>