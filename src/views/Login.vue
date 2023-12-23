<template>
  <div class="login">
    <!-- 展示 -->
    <div class="login_container_left " :class="turn ? 'book-page-left':''">
      <!-- 正面 -->
      <div class="book-page-front arc center">
        <div class="Login_banner">
          <svg-icon name="Login-banner"></svg-icon>
        </div>
      </div>
      <!-- 反面 -->
      <div class="book-page-back"></div>
    </div>
    <!-- 登录 -->
    <div class="login_container_right" :class="turn ? 'book-page-right':''">
      <!-- 正面 -->
      <div class="book-page-front">
        <div class="translate" @click="handleSetLanguage">
          <svg-icon name='translate'></svg-icon>
        </div>
        <div class="login_box center">
          <!--表单区域-->
          <el-form ref="loginFormRef" :model="loginForm" :rules="loginFormRules" class="login_form">
            <el-form-item>
              <div class="title">
                {{$t('Welcome')}}
              </div>
            </el-form-item>
            <el-form-item prop="username">
              <el-input prefix-icon="iconfont icon-user" v-model.trim="loginForm.username"></el-input>
            </el-form-item>
            <el-form-item prop="password">
              <el-input prefix-icon="iconfont icon-3702mima" v-model.trim="loginForm.password" show-password></el-input>
            </el-form-item>
            <el-form-item class="btns">
              <el-button type="primary" @click="submitLogin">{{ $t('Login') }}</el-button>
              <!-- <el-button type="info" @click="resetLoginForm">{{ $t('Reset') }}</el-button> -->
            </el-form-item>
          </el-form>
        </div>
      </div>
      <!-- 反面 -->
      <div class="book-page-back"></div>
    </div>
  </div>
</template>

<script>
  import { mapActions } from 'vuex';
  export default {
    data() {
      return {
        turn: false,
        remember: false,
        language: this.$i18n.locale == 'zh',
        // 登录表单的数据绑定对象
        loginForm: {
          username: '',
          password: '',
        },
        // 表单的验证规则对象
        loginFormRules: {
          username: [
            { required: true, message: '请输入登录名称', trigger: 'blur' },
            {
              min: 3,
              max: 10,
              message: '长度在 3 到 10 个字符',
              trigger: 'blur',
            },
          ],
          password: [
            { required: true, message: '请输入登录密码', trigger: 'blur' },
            {
              min: 6,
              max: 15,
              message: '长度在 6 到 15 个字符',
              trigger: 'blur',
            },
          ],
        },
      }
    },
    methods: {
      ...mapActions(['setUserInfo']),
      // 点击重置按钮 重置表单
      resetLoginForm() {
        this.$refs.loginFormRef.resetFields()
      },
      // 点击登录按钮
      submitLogin() {
        this.$refs.loginFormRef.validate(async (valid) => {
          if (!valid) return
          const { data: res } = await this.$http.post('login', this.loginForm) // data重定向为res
          if (res.meta.status !== 200) return this.$message.error('登录失败')
          this.setUserInfo(res.data)
          this.turn = true
          this.$message.success('登录成功')
          // 将登录成功之后的token保存到客户端的sessionStorage中
          window.sessionStorage.setItem('token', res.data.token)
          // 通过编程式导航跳转到后台主页，路由地址是 /users
          setTimeout(() => {
            this.$router.push('/users')
          }, 1000);
        })
      },
      handleSetLanguage() {
        const language = this.$i18n.locale;
        this.$i18n.locale = language == 'zh' ? 'en' : 'zh';
      },
    },
  }
</script>

<style lang="less" scoped>
  .title {
    font-family: Poppins;
    font-style: normal;
    font-weight: 700;
    font-size: 32px;
    line-height: 40px;
    color: #120e5c;
    text-align: center;
    padding-bottom: 48px;
    position: relative;

    &:after {
      content: "";
      width: 24px;
      height: 0;
      border: 1px solid #e5e5eb;
      position: absolute;
      bottom: 24px;
      left: 50%;
      margin-left: -12px;
      border-radius: 4px;
    }
  }

  .login {
    width: 100%;
    height: 100%;
    background: url(../assets/banner.png) no-repeat center 0px;
    display: flex;
    overflow: hidden;
    position: relative;
    perspective: 1000px;

    &::before {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-attachment: fixed;
      backdrop-filter: blur(10px);
      z-index: -2;
    }
  }

  .login_container_left,
  .login_container_right {
    height: 100%;
    position: relative;
  }

  .login_container_left {
    width: 60%;
    background-color: #fff;
  }

  .arc {
    position: relative;

    &:before {
      content: "";
      position: absolute;
      width: 150px;
      height: 120%;
      background-color: #fff;
      right: 0;
      top: 50%;
      border-radius: 0 50% 50% 0;
      transform: translate(50%, -50%);
      z-index: 2;
    }
  }

  .login_container_right {
    width: 40%;
    background-color: #eff0fb;

  }

  .login_box {
    width: 450px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    display: flex;
    flex-direction: column;
    align-content: center;
    justify-content: center;

    img {
      max-width: 100%;
      max-height: 100%;
      object-fit: contain;
    }
  }

  .login_form {
    width: 100%;
    box-sizing: border-box;
  }

  .Login_banner {
    font-size: 800px;
  }

  .translate {
    position: absolute;
    top: 10px;
    right: 20px;
    font-size: 40px;
    cursor: pointer;
  }

  ::v-deep .el-input__inner {
    height: 52px;
    line-height: 52px;
  }

  .el-button {
    width: 100%;
    height: 52px;
  }

  .book-page-left {
    animation-name: turn_left;
    animation-duration: 2s;
    /* 设置动画保持最后一帧的样式 */
    animation-fill-mode: forwards;
    transform-origin: left center;
  }

  .book-page-right {
    animation-name: turn_right;
    animation-duration: 2s;
    /* 设置动画保持最后一帧的样式 */
    animation-fill-mode: forwards;
    transform-origin: right center;
  }

  // 正面
  .book-page-front {
    width: 100%;
    height: 100%;
    position: absolute;
    z-index: 1;
  }

  // 反面
  .book-page-back {
    width: 100%;
    height: 100%;
    position: absolute;
    transform: rotateY(180deg);
    z-index: 0;
  }

  /* 翻页动画 */
  @keyframes turn_left {
    from {
      transform: rotateY(0deg);
    }

    to {
      transform: rotateY(-180deg);
    }
  }

  @keyframes turn_right {
    from {
      transform: rotateY(0deg);
    }

    to {
      transform: rotateY(180deg);
    }
  }
</style>