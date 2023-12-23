<template>
  <div>
    <!--面包屑导航区域-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/users' }">{{$t('home')}}</el-breadcrumb-item>
      <el-breadcrumb-item>{{$t('权限管理')}}</el-breadcrumb-item>
      <el-breadcrumb-item>{{$t('权限列表')}}</el-breadcrumb-item>
    </el-breadcrumb>
    <!--卡片视图区域-->
    <el-card>
      <el-table :data="rightsList" border stripe>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="authName" :label="$t('权限名称')"></el-table-column>
        <el-table-column prop="path" :label="$t('Path')"></el-table-column>
        <el-table-column prop="level" :label="$t('权限等级')">
          <!-- 作用域插槽 -->
          <template slot-scope="scope">
            <el-tag v-if="scope.row.level == 0">{{$t('一级')}}</el-tag>
            <el-tag v-else-if="scope.row.level == 1" type="success">
              {{$t('二级')}}
            </el-tag>
            <el-tag v-else type="warning">{{$t('三级')}}</el-tag>
          </template>
        </el-table-column>
        <template slot="empty">
          <svg-icon name='empty' class="empty"></svg-icon>
        </template>
      </el-table>
    </el-card>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        rightsList: [], // 权限列表数据
      }
    },
    created() {
      this.getRightsList() // 获取所有权限
    },
    methods: {
      // 获取权限列表
      async getRightsList() {
        const { data: res } = await this.$http.get('rights/list')
        if (res.meta.status !== 200) {
          return this.$message.error(this.$('failure'))
        }
        this.rightsList = res.data
      },
    },
  }
</script>

<style lang="less" scoped>
</style>