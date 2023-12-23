<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/users' }">{{$t('home')}}</el-breadcrumb-item>
      <el-breadcrumb-item>{{$t('订单管理')}}</el-breadcrumb-item>
      <el-breadcrumb-item>{{$t('订单列表')}}</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <el-row>
        <el-col :span="8">
          <el-input :placeholder="$t('请输入内容')" v-model.trim="queryInfo.query" clearable @clear="getOrderList">
            <el-button slot="append" icon="el-icon-search" @click="getOrderList"></el-button>
          </el-input>
        </el-col>
      </el-row>

      <!-- 订单列表数据 -->
      <el-table :data="orderList" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column :label="$t('订单编号')" prop="order_number"></el-table-column>
        <el-table-column :label="$t('订单价格')" prop="order_price"></el-table-column>
        <el-table-column :label="$t('是否付款')" prop="order_pay">
          <template slot-scope="scope">
            <el-tag type="success" v-if="scope.row.order_pay === '1'">{{$t('已付款')}}</el-tag>
            <el-tag type="danger" v-else>{{$t('未付款')}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column :label="$t('是否发货')" prop="is_send">
          <template slot-scope="scope">
            <el-tag type="success" v-if="scope.row.is_send === '是'">{{$t('yes')}}</el-tag>
            <el-tag type="danger" v-else>{{$t('no')}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column :label="$t('下单时间')" prop="create_time">
          <template slot-scope="scope">
            {{ scope.row.create_time | dateFormat }}
          </template>
        </el-table-column>
        <el-table-column :label="$t('operation')">
          <template>
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="showBox"> </el-button>
            <!--物流按钮-->
            <el-button type="success" size="mini" icon="el-icon-location" @click="showProgress"></el-button>
          </template>
        </el-table-column>
        <template slot="empty">
          <svg-icon name='empty' class="empty"></svg-icon>
        </template>
      </el-table>
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="queryInfo.pagenum" :page-sizes="[5, 10, 15]" :page-size="queryInfo.pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </el-card>
    <!--修改地址对话框-->
    <dialogBox :title="$t('修改地址')" :dialogVisible='addressVisible' @close="addressDialogClosed" @confirm='addressDialogClosed'>
      <!--内容主体区域-->
      <el-form :model="addressForm" :rules="addressFormRules" ref="addressFormRef">
        <el-form-item class="module_title">{{$t('address1')}}</el-form-item>
        <el-form-item prop="address1">
          <el-cascader :placeholder="$t('请选择')" :options="cityData" v-model.trim="addressForm.address1"></el-cascader>
        </el-form-item>
        <el-form-item class="module_title">{{$t('address2')}}</el-form-item>
        <el-form-item prop="address2">
          <el-input v-model.trim="addressForm.address2"></el-input>
        </el-form-item>
      </el-form>
    </dialogBox>
    <!--物流进度对话框-->
    <el-dialog :title="$t('物流进度')" :visible.sync="progressVisible">
      <!--timeline时间线-->
      <el-timeline>
        <el-timeline-item v-for="(activity, index) in progressInfo" :key="index" :timestamp="activity.time">
          {{ activity.context }}
        </el-timeline-item>
      </el-timeline>
    </el-dialog>
  </div>
</template>

<script>
  import cityData from './citydata.js'
  export default {
    data() {
      return {
        queryInfo: {
          query: '',
          pagenum: 1,
          pagesize: 10,
        },
        total: 0,
        orderList: [],
        addressVisible: false,
        addressForm: {
          address1: [],
          address2: '',
        },
        addressFormRules: {
          address1: [{
            required: true,
            message: this.$t('请选择省市区县'),
            trigger: 'blur',
          }, ],
          address2: [{
            required: true,
            message: this.$t('请填写详细地址'),
            trigger: 'blur',
          }, ],
        },
        cityData,
        progressVisible: false, // 控制物流进度对话框是否显示
        progressInfo: [], // 物流信息列表
      }
    },
    created() {
      this.getOrderList()
    },
    methods: {
      async getOrderList() {
        const { data: res } = await this.$http.get('orders', {
          params: this.queryInfo,
        })
        if (res.meta.status !== 200) {
          return this.$message.error(this.$t('failure'))
        }
        this.$message.success(this.$t('succeed'))
        console.log(res.data.goods)
        this.orderList = res.data.goods
        this.total = res.data.total
      },
      // 监听 pageSize 改变的事件
      handleSizeChange(newSize) {
        this.queryInfo.pagesize = newSize
        this.getOrderList()
      },
      // 监听 当前页码值 改变的事件
      handleCurrentChange(newPage) {
        this.queryInfo.pagenum = newPage
        this.getOrderList()
      },
      showBox() {
        this.addressVisible = true
      },
      // 修改地址对话框的关闭事件
      addressDialogClosed() {
        this.addressVisible = false;
        this.$refs.addressFormRef.resetFields(); // 清空表单
        this.addressForm.address1 = [];
      },
      // 展示物流进度的对话框
      async showProgress() {
        // const { data: res } = await this.$http.get('/kuaidi/804909574412544580')
        // if (res.meta.status !== 200) {
        //   return this.$message.error('获取物流信息失败！')
        // }
        // this.$message.success('获取物流信息成功！')
        // console.log(res)
        this.progressInfo = [{
            time: '2018-05-10 09:39:00',
            ftime: '2018-05-10 09:39:00',
            context: '已签收,感谢使用顺丰,期待再次为您服务',
            location: ''
          },
          {
            time: '2018-05-10 08:23:00',
            ftime: '2018-05-10 08:23:00',
            context: '【北京市】北京海淀育新小区营业点派件员 顺丰速运95338正在为您派件',
            location: ''
          },
          {
            time: '2018-05-10 07:32:00',
            ftime: '2018-05-10 07:32:00',
            context: '快件到达 【北京海淀育新小区营业点】',
            location: ''
          },
          {
            time: '2018-05-10 02:03:00',
            ftime: '2018-05-10 02:03:00',
            context: '快件在【北京顺义集散中心】已装车,准备发往 【北京海淀育新小区营业点】',
            location: ''
          },
          {
            time: '2018-05-09 23:05:00',
            ftime: '2018-05-09 23:05:00',
            context: '快件到达 【北京顺义集散中心】',
            location: ''
          },
          {
            time: '2018-05-09 21:21:00',
            ftime: '2018-05-09 21:21:00',
            context: '快件在【北京宝胜营业点】已装车，准备发往 【北京顺义集散中心】',
            location: ''
          },
          {
            time: '2018-05-09 13:07:00',
            ftime: '2018-05-09 13:07:00',
            context: '顺丰速运 已收取快件',
            location: ''
          },
          {
            time: '2018-05-09 12:25:03',
            ftime: '2018-05-09 12:25:03',
            context: '卖家发货',
            location: ''
          },
          {
            time: '2018-05-09 12:22:24',
            ftime: '2018-05-09 12:22:24',
            context: '您的订单将由HLA（北京海淀区清河中街店）门店安排发货',
            location: ''
          },
          {
            time: '2018-05-09 21:36:04',
            ftime: '2018-05-09 21:36:04',
            context: '商品已下单',
            location: ''
          }
        ]
        this.progressVisible = true
      },
    },
  }
</script>
<style lang="less" scoped>
  @import '../../plugins/timeline/timeline.css';
  @import '../../plugins/timeline-item/timeline-item.css';

  .el-cascader {
    width: 100%;
  }
</style>