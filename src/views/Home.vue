<template>
  <el-container class="home-container">
    <!-- 侧边栏 -->
    <el-aside :width="isCollapse ? '64px' : '260px'">
      <router-link to="/users">
        <div class="home">
          <svg-icon name="shouye"></svg-icon>
          <span v-show="!isCollapse">{{ $t('home') }}</span>
        </div>
      </router-link>
      <div class="toggle-button" @click="toggleCollapse">|||</div>
      <!--左侧导航菜单-->
      <el-menu :unique-opened="true" :collapse="isCollapse" :collapse-transition="false" :router="true" :default-active="$route.path">
        <!-- 一级菜单 -->
        <el-submenu :index="item.id + ''" v-for="item in menuList" :key="item.id">
          <!-- 一级菜单模板区域 -->
          <template slot="title">
            <div :class="isCollapse ? '' : 'center_start'">
              <svg-icon :name="iconsObject[item.id]"></svg-icon>
              <span>{{ $t(item.authName) }}</span>
            </div>
          </template>
          <!-- 二级菜单-->
          <el-menu-item :index="'/' + subItem.path" v-for="subItem in item.children" :key="subItem.id" @click="saveNavState">
            <template slot="title">
              <div class="center_start">
                <svg-icon name="fenlei"></svg-icon>
                <span>{{ $t(subItem.authName) }}</span>
              </div>
            </template>
          </el-menu-item>
        </el-submenu>
      </el-menu>
      <div class="setting">
        <el-dropdown trigger="click" @command="handleCommand">
          <div style="width:100%;height:100%">
            <svg-icon name="shezhi"></svg-icon>
            <span v-show="!isCollapse">{{$t('setting')}}</span>
          </div>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="1">
              <svg-icon name="zhanghao"></svg-icon>
              <span>{{$t('您的账号')}}</span>
            </el-dropdown-item>
            <el-dropdown-item command="2">
              <svg-icon name="shujuditu1"></svg-icon>
              <span>{{$t('language')}}</span>
            </el-dropdown-item>
            <el-dropdown-item command="3">
              <svg-icon name="tuichu"></svg-icon>
              <span>{{$t('Exit')}}</span>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </el-aside>
    <!-- 右侧内容主体 -->
    <el-main>
      <!-- 路由占位符 -->
      <router-view></router-view>
    </el-main>
    <div class="login" v-show="loginAcitve">
      <!-- <div class="login"> -->
      <div class="login_container_left" :class="loginAcitve ? 'book-page-left':''">
        <!-- 正面 -->
        <div class="book-page-front arc"></div>
        <!-- 反面 -->
        <div class="book-page-back"></div>
      </div>
      <div class="login_container_right" :class="loginAcitve ? 'book-page-right':''">
        <!-- 正面 -->
        <div class="book-page-front"></div>
        <!-- 反面 -->
        <div class="book-page-back"></div>
      </div>
    </div>
  </el-container>
</template>

<script>
  import { mapState } from 'vuex';
  export default {
    data() {
      return {
        language: this.$i18n.locale,
        menuList: [], // 左侧菜单数据
        iconsObject: {
          //一级菜单图标对象 125 103这些是menuList一级菜单的id
          125: 'shijian',
          103: 'renzheng',
          101: 'dianpu',
          102: 'biaoqian',
          145: 'gaishuai',
        },
        isCollapse: false, // 菜单是否折叠
        activePath: '', // 激活状态值
        loginAcitve: false
      }
    },
    created() {
      this.getMenuList()
      this.activePath = window.sessionStorage.getItem('activePath')
    },
    computed: {
      ...mapState(['userInfo']),
    },
    watch: {
      userInfo(val) {
        this.userInfo = val
      }
    },
    methods: {
      handleCommand(command) {
        switch (command) {
          case "1":
            this.$router.push({ path: '/account' })
            break;
          case "2":
            this.$router.push({ path: '/translate' })
            break;
          default:
            this.logout();
            break;
        }
      },
      // 点击切换左侧菜单的折叠与展开
      toggleCollapse() {
        this.isCollapse = !this.isCollapse
      },
      logout() {
        // 清空token
        window.sessionStorage.clear('token');
        this.loginAcitve = true;
        // 跳转到登录页
        // this.$router.push('/login');
        setTimeout(() => {
          this.$router.push('/login')
        }, 1200);
      },
      // 获取左侧菜单数据
      async getMenuList() {
        const { data: res } = await this.$http.get('menus')
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
        this.menuList = res.data;
      },
      // 保存菜单链接的激活状态
      saveNavState(item) {
        this.activePath = item.index
        // 将点击之后的index地址保存到客户端的sessionStorage中
        window.sessionStorage.setItem('activePath', item.index)
      },
    },
  }
</script>

<style lang="less" scoped>
  .home-container {
    height: 100%;
  }

  .home,
  .setting {
    width: 100%;
    height: 56px;
    line-height: 56px;
    padding: 0 20px;
    cursor: pointer;

    display: flex;
    align-items: center;
    justify-content: flex-start;

    &:hover {
      background-color: #eff0fb;
    }
  }

  .setting {
    position: absolute;
    bottom: 0;
  }

  a:-webkit-any-link,
  .home span,
  .setting span {
    text-decoration: none;
    color: #303133;
    line-height: 56px;
    font-size: 14px;
  }

  span {
    margin-left: 11px;
  }

  .el-aside {
    box-shadow: 2px 0 20px rgba(0, 0, 0, .04);
    transition: all .6s ease-out;
    -o-transition: all .6s ease-out;
    -moz-transition: all .6s ease-out;
    -webkit-transition: all .6s ease-out;

    position: relative;

    &::-webkit-scrollbar {
      display: none;
    }

    /*el-menu边框线*/
    .el-menu {
      border-right: none;
    }
  }

  svg {
    font-size: 24px;
  }

  .toggle-button {
    background: #eff0fb;
    color: #2c23e5;
    font-size: 10px;
    line-height: 24px;
    text-align: center;
    letter-spacing: 0.2em;
    cursor: pointer;
  }

  .el-dropdown-menu__item {
    span {
      margin-left: 11px;
    }
  }

  .login {
    width: 100%;
    height: 100%;
    // background-color: #2c23e5;
    // background: url(../assets/banner.png) no-repeat center 0px;
    display: flex;
    overflow: hidden;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
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
    transform-style: preserve-3d;
  }

  .login_container_left {
    width: 60%;
    background-color: #fff;
    z-index: 1;
  }

  .login_container_right {
    width: 40%;
    background-color: #eff0fb;
  }

  .arc {
    position: relative;

    &:before {
      content: "";
      position: absolute;
      width: 150px;
      height: 120%;
      background-color: #fff;
      left: 0;
      top: 50%;
      border-radius: 50% 0 0 50%;
      transform: translate(-50%, -50%);
      z-index: 2;
    }
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
    transform: rotateY(180deg);
    z-index: 1;
  }

  // 反面
  .book-page-back {
    width: 100%;
    height: 100%;
    position: absolute;
    z-index: 0;
  }

  /* 翻页动画 */
  @keyframes turn_left {
    from {
      transform: rotateY(-180deg);
    }

    to {
      transform: rotateY(0deg);
    }
  }

  @keyframes turn_right {
    from {
      transform: rotateY(180deg);
    }

    to {
      transform: rotateY(0deg);
    }
  }
</style>