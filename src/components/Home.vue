<template>
  <el-container class="home-container">
    <!-- 头部 -->
    <el-header>
      <div>
        <img src="../assets/logo.png" alt="" />
        <span>电商后台管理系统</span>
      </div>
      <div>
        <!-- <el-dropdown class="international-icon" @command="handleSetLanguage">
          <i class="el-icon-s-tools"></i>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="zh" :disabled="language === 'zh'">中文</el-dropdown-item>
            <el-dropdown-item command="en" :disabled="language === 'en'">English</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown> -->
        <el-button type="info" @click="logout">{{ $t('Exit') }}</el-button>
      </div>
    </el-header>
    <!-- 主体 -->
    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <div class="toggle-button" @click="toggleCollapse">|||</div>
        <!--左侧导航菜单-->
        <el-menu
          background-color="#333744"
          text-color="#fff"
          active-text-color="#409eff"
          :unique-opened="true"
          :collapse="isCollapse"
          :collapse-transition="false"
          :router="true"
          :default-active="$route.path"
        >
          <!-- 一级菜单 -->
          <el-submenu :index="item.id + ''" v-for="item in menuList" :key="item.id">
            <!-- 一级菜单模板区域 -->
            <template slot="title">
              <i :class="iconsObject[item.id]"></i>
              <span>{{ item.authName }}</span>
            </template>
            <!-- 二级菜单-->
            <el-menu-item :index="'/' + subItem.path" v-for="subItem in item.children" :key="subItem.id" @click="saveNavState">
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>{{ subItem.authName }}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 右侧内容主体 -->
      <el-main>
        <!-- 路由占位符 -->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      language: this.$i18n.locale,
      menuList: [], // 左侧菜单数据
      iconsObject: {
        //一级菜单图标对象 125 103这些是menuList一级菜单的id
        125: 'iconfont icon-user',
        103: 'iconfont icon-tijikongjian',
        101: 'iconfont icon-shangpin',
        102: 'iconfont icon-danju',
        145: 'iconfont icon-baobiao',
      },
      isCollapse: false, // 菜单是否折叠
      activePath: '', // 激活状态值
    }
  },
  created() {
    this.getMenuList()
    this.activePath = window.sessionStorage.getItem('activePath')
  },
  methods: {
    // 点击切换左侧菜单的折叠与展开
    toggleCollapse() {
      this.isCollapse = !this.isCollapse
    },
    logout() {
      // 清空token
      window.sessionStorage.clear('token')
      // 跳转到登录页
      this.$router.push('/login')
    },
    // 获取左侧菜单数据
    async getMenuList() {
      const { data: res } = await this.$http.get('menus')
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.menuList = res.data
      console.log(this.menuList)
      console.log(this.$i18n.setLocaleMessage('en', res.data[0].path))
    },
    // 保存菜单链接的激活状态
    saveNavState(item) {
      console.log(item.index)
      this.activePath = item.index
      // 将点击之后的index地址保存到客户端的sessionStorage中
      window.sessionStorage.setItem('activePath', item.index)
    },
    handleSetLanguage(command) {
      this.language = this.$i18n.locale = command
      this.$message.success('To switch between ' + command)
    },
  },
}
</script>

<style lang="less" scoped>
.home-container {
  height: 100%;
}
.el-header {
  background: #373d41;
  color: #fff;
  display: flex;
  justify-content: space-between;
  padding-left: 0;
  align-items: center;
  font-size: 20px;
  > div {
    display: flex;
    align-items: center;
    span {
      margin-left: 15px;
    }
  }
}
.el-aside {
  background: #333744;
  /*el-menu边框线*/
  .el-menu {
    border-right: none;
  }
}
.el-main {
  background: #eaedf1;
}
.iconfont {
  margin-right: 10px;
}
.toggle-button {
  background: #4a5064;
  color: #fff;
  font-size: 10px;
  line-height: 24px;
  text-align: center;
  letter-spacing: 0.2em;
  cursor: pointer;
}
</style>