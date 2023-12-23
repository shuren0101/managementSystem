<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/users' }">{{$t('home')}}</el-breadcrumb-item>
      <el-breadcrumb-item>{{$t('数据统计')}}</el-breadcrumb-item>
      <el-breadcrumb-item>{{$t('数据报表')}}</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <div id="main"></div>
    </el-card>
  </div>
</template>

<script>
  import _ from 'lodash'
  export default {
    data() {
      return {
        options: {
          title: {
            text: this.$t('用户来源'),
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'cross',
              label: {
                backgroundColor: '#E9EEF3',
              },
            },
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true,
          },
          xAxis: [{
            boundaryGap: false,
          }, ],
          yAxis: [{
            type: 'value',
          }, ],
        },
      }
    },
    created() {},
    // 此时页面上的元素已经被渲染完毕了
    async mounted() {
      // 3.基于准备好的dom，初始化echarts实例
      let echarts = require('echarts')
      var myChart = echarts.init(document.getElementById('main'))

      // 4.指定图表的配置项和数据
      const { data: res } = await this.$http.get('reports/type/1')
      if (res.meta.status !== 200) {
        return this.$message.error(this.$t('failure'))
      }
      const result = _.merge(res.data, this.options)
      // 5.使用刚指定的配置项和数据显示图表。
      myChart.setOption(result)
    }
  }
</script>

<style lang="less" scoped>
  #main {
    width: 750px;
    height: 400px;
  }
</style>