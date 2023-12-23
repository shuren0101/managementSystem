<template>
  <!--对话框-->
  <el-dialog :title="title" :visible.sync="visible" @close="_click('close')">
    <!--内容主体区域-->
    <slot></slot>
    <!--底部按钮区域-->
    <span slot="footer">
      <el-button @click="visible = false">{{$t('cancel')}}</el-button>
      <el-button type="primary" @click="_click('confirm')">{{$t('confirm')}}</el-button>
    </span>
  </el-dialog>
</template>
<script>
  export default {
    data() {
      return {
        visible: this.dialogVisible
      }
    },
    props: {
      title: {
        type: String,
        default: ''
      },
      dialogVisible: {
        type: Boolean,
        default: false
      }
    },
    watch: {
      dialogVisible(val) {
        this.visible = val;
      }
    },
    methods: {
      _click(methodName) {
        this.$emit(methodName)
      },
    }
  }
</script>
<style lang="less" scoped>

</style>