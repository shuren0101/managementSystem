<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/users' }">{{$t('home')}}</el-breadcrumb-item>
      <el-breadcrumb-item>{{$t('商品管理')}}</el-breadcrumb-item>
      <el-breadcrumb-item>{{$t('商品列表')}}</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input :placeholder="$t('请输入内容')" v-model.trim="queryInfo.query" clearable @clear="getGoodsList">
            <el-button slot="append" icon="el-icon-search" @click="getGoodsList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="goAddpage">{{$t('添加商品')}}</el-button>
        </el-col>
      </el-row>
      <!-- table表格区域 -->
      <el-table :data="goodslist" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column :label="$t('商品名称')" prop="goods_name"></el-table-column>
        <el-table-column :label="$t('商品价格')" prop="goods_price"></el-table-column>
        <el-table-column :label="$t('商品重量')" prop="goods_weight"></el-table-column>
        <el-table-column :label="$t('创建时间')" prop="add_time">
          <template slot-scope="scope">
            {{ scope.row.add_time | dateFormat }}
          </template>
        </el-table-column>
        <el-table-column :label="$t('operation')">
          <template slot-scope="scope">
            <!--修改按钮-->
            <el-button type="primary" size="mini" icon="el-icon-edit" @click="showEditDialog(scope.row.goods_id)"></el-button>
            <!--删除按钮-->
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeById(scope.row.goods_id)"></el-button>
          </template>
        </el-table-column>
        <template slot="empty">
          <svg-icon name='empty' class="empty"></svg-icon>
        </template>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="queryInfo.pagenum" :page-sizes="[5, 10, 15, 20]" :page-size="queryInfo.pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total" background>
      </el-pagination>
    </el-card>
    <!--编辑参数的对话框-->
    <dialogBox :title="$t('编辑商品')" :dialogVisible='editDialogVisible' @close="editDialogClosed" @confirm='editGoods'>
      <!--内容主体区域-->
      <el-form :model="editForm" :rules="editFormRules" ref="editFormRef">
        <el-form-item class="module_title">{{$t('商品名称')}}</el-form-item>
        <el-form-item prop="goods_name">
          <el-input v-model.trim="editForm.goods_name"></el-input>
        </el-form-item>
        <el-form-item class="module_title">{{$t('商品价格')}}</el-form-item>
        <el-form-item prop="goods_price">
          <el-input v-model.trim="editForm.goods_price"></el-input>
        </el-form-item>
        <el-form-item class="module_title">{{$t('商品数量')}}</el-form-item>
        <el-form-item prop="goods_number">
          <el-input v-model.trim="editForm.goods_number"></el-input>
        </el-form-item>
        <el-form-item class="module_title">{{$t('商品重量')}}</el-form-item>
        <el-form-item prop="goods_weight">
          <el-input v-model.trim="editForm.goods_weight"></el-input>
        </el-form-item>
        <el-form-item class="module_title">{{$t('商品介绍')}}</el-form-item>
        <el-form-item prop="goods_introduce">
          <el-input v-model.trim="editForm.goods_introduce"></el-input>
        </el-form-item>
      </el-form>
    </dialogBox>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        // 查询参数对象
        queryInfo: {
          query: '',
          pagenum: 1,
          pagesize: 10,
        },
        // 商品列表
        goodslist: [],
        // 总数据条数
        total: 0,
        editDialogVisible: false, // 控制编辑商品对话框是否显示
        // 编辑商品的表单数据对象
        editForm: {
          goods_name: '',
          goods_price: null,
          goods_number: null,
          goods_weight: null,
          goods_introduce: '',
          goods_cat: [],
        },
        // 编辑商品的验证规则对象
        editFormRules: {
          goods_name: [
            { required: true, message: this.$t('请输入商品名称'), trigger: 'blur' },
          ],
          goods_price: [
            { required: true, message: this.$t('请输入商品价格'), trigger: 'blur' },
          ],
          goods_number: [
            { required: true, message: this.$t('请输入商品数量'), trigger: 'blur' },
          ],
          goods_weight: [
            { required: true, message: this.$t('请输入商品重量'), trigger: 'blur' },
          ],
        },
      }
    },
    created() {
      this.getGoodsList()
    },
    methods: {
      // 根据分页获取对应的商品列表
      async getGoodsList() {
        const { data: res } = await this.$http.get('goods', {
          params: this.queryInfo,
        })
        if (res.meta.status !== 200) {
          return this.$message.error(this.$t('failure'))
        }
        this.$message.success(this.$t('succeed'))

        this.goodslist = res.data.goods
        this.total = res.data.total
      },
      handleSizeChange(newSize) {
        this.queryInfo.pagesize = newSize
        this.getGoodsList()
      },
      handleCurrentChange(newPage) {
        this.queryInfo.pagenum = newPage
        this.getGoodsList()
      },
      // 监听 展示编辑商品的对话框
      async showEditDialog(id) {
        this.editDialogVisible = true
        const { data: res } = await this.$http.get('goods/' + id)
        if (res.meta.status !== 200) {
          return this.$message.error(this.$t('failure'))
        }
        this.editForm = res.data
      },
      // 监听 编辑商品对话框的关闭事件
      editDialogClosed() {
        this.editDialogVisible = false;
        // 表单内容重置为空
        this.$refs.editFormRef.resetFields();
      },
      // 点击确认 编辑修改商品
      editGoods() {
        this.$refs.editFormRef.validate(async (valid) => {
          // console.log(valid)
          if (!valid) return
          // 可以发起修改商品信息的网络请求
          const { data: res } = await this.$http.put(
            'goods/' + this.editForm.goods_id, {
              goods_name: this.editForm.goods_name,
              goods_price: this.editForm.goods_price,
              goods_number: this.editForm.goods_number,
              goods_weight: this.editForm.goods_weight,
              goods_introduce: this.editForm.goods_introduce,
              goods_cat: this.editForm.goods_cat,
            }
          )
          if (res.meta.status !== 200) {
            return this.$message.error(this.$t('updatedateF'))
          }
          this.$message.success(this.$t('updatedateS'))
          // 关闭对话框
          this.editDialogVisible = false
          // 重新发起请求商品列表
          this.getGoodsList()
        })
      },
      async removeById(id) {
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
        const { data: res } = await this.$http.delete(`goods/${id}`)
        if (res.meta.status !== 200) {
          return this.$message.error(this.$t('deldateF'))
        }
        this.$message.success(this.$t('deldateS'))
        this.getGoodsList()
      },
      goAddpage() {
        this.$router.push('/goods/add')
      },
    },
  }
</script>

<style lang="less" scoped></style>