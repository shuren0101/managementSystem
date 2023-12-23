<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/users' }">{{$t('home')}}</el-breadcrumb-item>
      <el-breadcrumb-item>{{$t('setting')}}</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path:'/translate' }">{{$t('language')}}</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区 -->
    <el-card>
      <el-form>
        <el-form-item class="module_title">
          {{$t('language')}}
        </el-form-item>
        <el-form-item>
          <el-select v-model.trim="value" :placeholder="$t('请选择')" @change='handleSetLanguage'>
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        options: [{
          value: 'zh',
          label: '中文'
        }, {
          value: 'en',
          label: 'English'
        }],
        value: this.$i18n.locale
      }
    },
    methods: {
      handleSetLanguage() {
        const language = this.$i18n.locale;
        this.$i18n.locale = language == 'zh' ? 'en' : 'zh';
      },
    }
  }
</script>

<style lang="less" scoped>

</style>