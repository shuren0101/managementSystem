<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/users' }">{{$t('home')}}</el-breadcrumb-item>
      <el-breadcrumb-item>{{$t('商品管理')}}</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/goods' }">{{$t('商品列表')}}</el-breadcrumb-item>
      <el-breadcrumb-item>{{$t('添加商品')}}</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <!-- 提示区域 -->
      <el-alert :title="$t('添加商品信息')" type="info" center show-icon :closable="false"></el-alert>
      <!-- 步骤条区域 -->
      <el-steps :active="activeIndex - 0" finish-status="success" align-center>
        <el-step :title="$t('基本信息')"></el-step>
        <el-step :title="$t('商品参数')"></el-step>
        <el-step :title="$t('商品属性')"></el-step>
        <el-step :title="$t('商品图片')"></el-step>
        <el-step :title="$t('商品内容')"></el-step>
        <el-step :title="$t('complete')"></el-step>
      </el-steps>
      <!-- tab栏区域 -->
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-position="top">
        <el-tabs :tab-position="'left'" v-model.trim="activeIndex" :before-leave="berforeTabLeave" @tab-click="tabClicked">
          <el-tab-pane :label="$t('基本信息')" name="0">
            <el-form-item class="module_title">{{$t('商品名称')}}</el-form-item>
            <el-form-item prop="goods_name">
              <el-input v-model.trim="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item class="module_title">{{$t('商品价格')}}</el-form-item>
            <el-form-item prop="goods_price">
              <el-input v-model.trim="addForm.goods_price" type="number"></el-input>
            </el-form-item>
            <el-form-item class="module_title">{{$t('商品重量')}}</el-form-item>
            <el-form-item prop="goods_weight">
              <el-input v-model.trim="addForm.goods_weight"></el-input>
            </el-form-item>
            <el-form-item class="module_title">{{$t('商品数量')}}</el-form-item>
            <el-form-item prop="goods_number">
              <el-input v-model.trim="addForm.goods_number" type="number"></el-input>
            </el-form-item>
            <el-form-item class="module_title">{{$t('商品分类')}}</el-form-item>
            <el-form-item prop="goods_cat">
              <el-cascader :placeholder="$t('请选择')" v-model.trim="addForm.goods_cat" :options="catelist" :props="cateProps" @change="handleChange"></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane :label="$t('商品参数')" name="1">
            <!-- 渲染表单的Item项 -->
            <el-form-item :label="item.attr_name" v-for="item in manyTableData" :key="item.attr_id">
              <!-- 复选框组 -->
              <el-checkbox-group v-model.trim="item.attr_vals">
                <el-checkbox :label="cb" v-for="(cb, i) in item.attr_vals" :key="i" border></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane :label="$t('商品属性')" name="2">
            <el-form-item :label="item.attr_name" v-for="item in onlyTableData" :key="item.attr_id">
              <el-input v-model.trim="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane :label="$t('商品图片')" name="3">
            <el-upload action="http://127.0.0.1:8888/api/private/v1/upload" :on-preview="handlePreview" :on-remove="handleRemove" list-type="picture" :headers="headerObj" :on-success="handleSuccess">
              <el-button size="small" type="primary">{{$t('点击上传')}}</el-button>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane :label="$t('商品内容')" name="4">
            <!-- 富文本编辑器组件 -->
            <quill-editor v-model.trim="addForm.goods_introduce"></quill-editor>
            <!-- 添加商品的按钮 -->
            <el-button type="primary" class="btnAdd" @click="add">{{$t('添加商品')}}</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>

    <!-- 图片预览 -->
    <el-dialog title="图片预览" :visible.sync="previewVisible" width="50%">
      <img :src="previewPath" alt="" class="previewImg" />
    </el-dialog>
  </div>
</template>

<script>
  import _ from 'lodash'
  export default {
    data() {
      return {
        activeIndex: '0',
        addForm: {
          goods_name: '',
          goods_price: 0,
          goods_weight: 0,
          goods_number: 0,
          // 商品所属的分类数组
          goods_cat: [],
          // 图片的数组
          pics: [],
          // 商品的详情描述
          goods_introduce: '',
          attrs: [],
        },
        addFormRules: {
          goods_name: [
            { required: true, message: this.$t('请输入商品名称'), trigger: 'blur' },
          ],
          goods_price: [
            { required: true, message: this.$t('请输入商品价格'), trigger: 'blur' },
          ],
          goods_weight: [
            { required: true, message: this.$t('请输入商品重量'), trigger: 'blur' },
          ],
          goods_number: [
            { required: true, message: this.$t('请输入商品数量'), trigger: 'blur' },
          ],
          goods_cat: [
            { required: true, message: this.$t('请选中商品分类'), trigger: 'blur' },
          ],
        },
        // 商品分类列表
        catelist: [],
        cateProps: {
          expandTrigger: 'hover',
          label: 'cat_name',
          value: 'cat_id',
          children: 'children',
        },
        // 动态参数列表数据
        manyTableData: [],
        // 静态属性列表数据
        onlyTableData: [],
        // 图片上传组件的headers请求头对象
        headerObj: {
          Authorization: window.sessionStorage.getItem('token'),
        },
        previewPath: '',
        previewVisible: false,
      }
    },
    created() {
      this.getCateList()
    },
    methods: {
      // 获取所有商品分类数据
      async getCateList() {
        const { data: res } = await this.$http.get('categories')
        if (res.meta.status !== 200) {
          return this.$message.error(this.$t('failure'))
        }
        this.catelist = res.data
      },
      // 级联选择器选中项变化会触发这个函数
      handleChange() {
        if (this.addForm.goods_cat.length !== 3) {
          this.addForm.goods_cat = []
        }
      },
      berforeTabLeave(activeName, oldActiveName) {
        if (oldActiveName === '0' && this.addForm.goods_cat.length !== 3) {
          this.$message.error(this.$t('请选中商品分类'))
          return false
        }
      },
      async tabClicked() {
        // 证明访问的是动态参数面板
        if (this.activeIndex === '1') {
          const { data: res } = await this.$http.get(
            `categories/${this.cateId}/attributes`, {
              params: { sel: 'many' },
            }
          )
          if (res.meta.status !== 200) {
            return this.$message.error(this.$t('failure'))
          }
          res.data.forEach((item) => {
            item.attr_vals =
              item.attr_vals.length === 0 ? '' : item.attr_vals.split(' ')
          })
          this.manyTableData = res.data
        } else if (this.activeIndex === '2') {
          // 证明访问的是静态参数面板
          const { data: res } = await this.$http.get(
            `categories/${this.cateId}/attributes`, {
              params: { sel: 'only' },
            }
          )
          if (res.meta.status !== 200) {
            return this.$message.error(this.$t('failure'))
          }

          this.onlyTableData = res.data
        }
      },
      // 处理图片预览效果
      handlePreview(file) {
        this.previewPath = file.response.data.url
        this.previewVisible = true
      },
      // 处理移除图片的操作
      handleRemove(file) {
        // 1.获取将要删除的图片的临时路径
        const filePath = file.response.data.temp_path
        // 2. 从pics 数组中找到这个图片对应的索引值
        const i = this.addForm.pics.findIndex((x) => x.pic === filePath)
        // 3. 调用数组 splice 方法把图片信息对象从 pics数组中移除
        this.addForm.pics.splice(i, 1)
      },
      // 监听图片上传成功的事件
      handleSuccess(response) {
        // 1. 拼接得到一个图片信息对象
        const picInfo = {
          pic: response.data.tmp_path,
        }
        // 2. 将图片信息对象,push到pics数组中
        this.addForm.pics.push(picInfo)
        console.log(this.addForm)
      },
      add() {
        this.$refs.addFormRef.validate(async (valid) => {
          if (!valid) {
            this.activeIndex = '0';
            tabClicked();
            this.$message.error(this.$t('请添加必要的表单项'));
            return;
          }
          // 执行添加的业务逻辑
          // lodash cloneDeep(obj)
          const form = _.cloneDeep(this.addForm)
          form.goods_cat = form.goods_cat.join(',')
          // 处理动态参数
          this.manyTableData.forEach((item) => {
            const newInfo = {
              attr_id: item.attr_id,
              attr_value: item.attr_vals.join(' '),
            }
            this.addForm.attrs.push(newInfo)
          })
          // 处理静态属性
          this.onlyTableData.forEach((item) => {
            const newInfo = {
              attr_id: item.attr_id,
              attr_value: item.attr_vals,
            }
            this.addForm.attrs.push(newInfo)
          })
          form.attrs = this.addForm.attrs
          // 发起请求添加商品
          // 商品的名称必须是唯一的
          const { data: res } = await this.$http.post('goods', form)
          if (res.meta.status !== 201) {
            return this.$message.error(res.meta.msg)
          }
          this.$message.success(this.$t('adddataS'))
          this.$router.push('/goods')
        })
      },
    },
    computed: {
      cateId() {
        if (this.addForm.goods_cat.length === 3) {
          return this.addForm.goods_cat[2]
        }
        return null
      },
    },
  }
</script>

<style lang="less" scoped>
  .el-checkbox {
    margin: 0 10px 0 0 !important;
  }

  .el-alert {
    margin-bottom: 10px;
  }

  .el-steps {
    margin: 20px 0;
  }

  .previewImg {
    width: 100%;
  }

  .btnAdd {
    margin-top: 15px;
  }
</style>