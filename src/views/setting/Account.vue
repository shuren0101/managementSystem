<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/users' }">{{$t('home')}}</el-breadcrumb-item>
      <el-breadcrumb-item>{{$t('setting')}}</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path:'/account' }">{{$t('您的账号')}}</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区 -->
    <el-card>
      <el-form :model="Info" :rules="editFormRules" ref="editFormRef">
        <el-form-item class="module_title">
          {{$t('username')}}
        </el-form-item>
        <el-form-item>
          <el-input v-model.trim="Info.username" disabled></el-input>
        </el-form-item>
        <el-form-item class="module_title">
          {{$t('email')}}
        </el-form-item>
        <el-form-item prop="email">
          <el-input v-model.trim="Info.email"></el-input>
        </el-form-item>
        <el-form-item class="module_title">
          {{$t('phone')}}
        </el-form-item>
        <el-form-item prop="mobile">
          <el-input v-model.trim="Info.mobile"></el-input>
        </el-form-item>
      </el-form>
      <div class="btns" v-show="isChange">
        <el-button @click="$refs.editFormRef.resetFields()">{{$t('cancel')}}</el-button>
        <el-button type="primary" @click="editUserInfo">{{$t('confirm')}}</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
  import { mapState } from 'vuex';
  export default {
    data() {
      // 验证邮箱的规则
      var checkEmail = (rule, value, cb) => {
        // 验证邮箱的正则表达式
        const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
        if (regEmail.test(value)) {
          // 合法邮箱
          return cb();
        }
        cb(new Error(this.$t('请输入合法的邮箱')))
      }
      var checkMobile = (rule, value, cb) => {
        // 验证手机号的正则表达式
        const regMobile = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
        if (regMobile.test(value)) {
          return cb();
        }
        cb(new Error(this.$t('请输入合法的手机号')))
      }
      return {
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
        Info: { username: null, email: null, mobile: null },
        isChange: false,
      }
    },
    created() {
      this.Info = JSON.parse(JSON.stringify(this.userInfo));
    },
    computed: {
      ...mapState(['userInfo'])
    },
    watch: {
      Info: {
        handler(newVal, oldVal) {
          if (JSON.stringify(oldVal) == "{}") return;
          if (JSON.stringify(newVal) != JSON.stringify(this.userInfo)) {
            this.isChange = true;
          } else {
            this.isChange = false;
          }
        },
        deep: true
      },
    },
    methods: {
      // 修改用户信息并提交
      editUserInfo() {
        this.$refs.editFormRef.validate(async (valid) => {
          if (!valid) return this.$message.error(this.$t('formatErr'))
          // 发起修改用户信息的数据请求
          const { data: res } = await this.$http.put(
            'users/' + this.Info.id, {
              email: this.Info.email,
              mobile: this.Info.mobile,
            }
          )
          if (res.meta.status !== 200) {
            return this.$message.error(this.$t('updatedateF'))
          }
          this.userInfo = this.Info;
          // 提示修改成功
          this.$message.success(this.$t('updatedateS'))
        })
      },
    }
  }
</script>

<style lang="less" scoped>
  .el-card {}

  .btns {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: flex-end;
  }
</style>