# vue_shop

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).



**项目目标**

- 能够基于Vue初始化项目
- 能够基于Vue技术栈进行项目开发
- 能够使用Vue的第三方组件进行项目开发
- 能够说出前后端分离的开发模式



[TOC]



# 1. 项目概述

## 1.1 电商项目基本业务概述

根据不同的应用场景，电商系统一般都提供了PC端、移动APP、移动Web、微信小程序等多种终端访问方式。

## 1.2 电商后台管理系统的功能

电商后台管理系统用于管理用户账号、商品分类、商品信息、订单、数据统计等业务功能。

## 1.3 电商后台管理系统的开发模式（前后端分离）

电商后台管理系统整体采用前后端分离的开发模式，其中前端项目是<font color="red">基于Vue技术栈的SPA项目</font>。

> 用户--->前段项目（SPA）--->后端项目--->数据库

## 1.4 电商后台管理系统的技术选型

1. 前端项目技术栈
   - Vue
   - Vue-router
   - Element-UI
   - Axios
   - Echarts
2. 后端项目技术栈
   - Node.js
   - Express
   - Jwt
   - Mysql
   - Sequelize

# 2. 项目初始化

## 2.1 前端项目初始化步骤

### 1. 安装 Vue 脚手架

1. 下载并配置node.js，下载vue3.0

   [node下载地址](http://nodejs.cn/download/) [安装 | Vue CLI (vuejs.org)](https://cli.vuejs.org/zh/guide/installation.html)

2. npm: `npm install -g vue-cli` ;cnpm: `cnpm install -g vue-cli`

   cnpm 安装 `npm install -g cnpm --registry=http://registry.npm.taobao.org` *淘宝镜像*

   > 若已安装 Vue 脚手架，通过 `vue -V` ：检查Vue脚手架版本是否在 3.0 及以上，若为 2.x ，需卸载重新安装
   >
   > npm : `npm uninstall -g vue-cli` 
   >
   > cnpm : `cnpm uninstall -g vue-cli`

3. 检查安装

   `vue -V` ：检查Vue脚手架是否安装成功( `-V` 中的 `V` 为**大写**)

   `cnpm -v` ：检查cnpm是否安装成功

   > 1. 提示“无法识别”
   >
   > `npm install -g npm` （更新npm版本）
   >
   > 2. 安装失败
   >
   > `npm cache clean` （清除缓存）

### 2. 通过 Vue 脚手架创建项目

   win+R---cmd---vue ui（可视化）

   ![1621841221619](C:\Users\华之殇\AppData\Roaming\Typora\typora-user-images\1621841221619.png)

   出现以上情况，会自动打开网页，若未跳转，可复制 `http://localhost:8000` 在浏览器中打开网页。

   创建-->选择文件夹路径-->在此创建新项目

   ![1621841407116](C:\Users\华之殇\AppData\Roaming\Typora\typora-user-images\1621841407116.png)

   ![1621842390911](C:\Users\华之殇\AppData\Roaming\Typora\typora-user-images\1621842390911.png)

   手动-->下一步

### 3. 配置 Vue 路由

   选择功能-->勾选Babel、Router、使用配置文件-->下一步-->创建项目![1621846505449](C:\Users\华之殇\AppData\Roaming\Typora\typora-user-images\1621846505449.png)

### 4. 配置 Element-UI 组件库

   插件-->添加插件 ` vue-cli-plugin-element`    ![1621847545275](C:\Users\华之殇\AppData\Roaming\Typora\typora-user-images\1621847545275.png)

  ![1621847688138](C:\Users\华之殇\AppData\Roaming\Typora\typora-user-images\1621847688138.png)

  完成安装

### 5. 配置 axios 库

   依赖-->安装依赖-->运行依赖-->axios-->安装axios

   ![1621849506461](C:\Users\华之殇\AppData\Roaming\Typora\typora-user-images\1621849506461.png)

### 6. 注册账户及公钥

1. 注册账户

2. 创建公钥

   在右上方（头像）-->设置-->左侧（SSH公钥）-->怎样生成公钥 -->公钥管理 -->[生成/添加SSH公钥 - Gitee.com](https://gitee.com/help/articles/4181) -->

   ![1621924205436](C:\Users\华之殇\AppData\Roaming\Typora\typora-user-images\1621924205436.png)

3. 找到 `.ssh/id_rsa.pub` 文件，用记事本打开复制内容到公钥

   ![1621925322920](C:\Users\华之殇\AppData\Roaming\Typora\typora-user-images\1621925322920.png)

   ![1621925471226](C:\Users\华之殇\AppData\Roaming\Typora\typora-user-images\1621925471226.png)

   添加成功

   ![1621925515611](C:\Users\华之殇\AppData\Roaming\Typora\typora-user-images\1621925515611.png)

4. 添加后，在终端（Terminal）中输入

   `ssh -T git@gitee.com`

   首次使用需要确认并添加主机到本机SSH可信列表。若返回 `Hi XXX! You've successfully authenticated, but Gitee.com does not provide shell access.` 内容，则证明添加成功。

### 7. 初始化 Git 远程仓库

 [GitHub](https://github.com/) [Gitee - 码云](https://gitee.com/) 

1. 创建仓库

   点击右上方 `+` -->新建仓库 -->仓库名称不能与其他仓库名称一致 -->关闭 `使用Readme文件初始化这个仓库` -->创建

2. 全局设置用户信息

   根据创建后的网页信息，进行Git全局设置

3. 在创建好的项目文件夹中打开 `Windows PowerShell` 

   输入 `git status` 检查项目状态

   输入 `git add .` 将文件添加到暂存区（ `add` 与 `.` 之间有空格）

   输入 `git commit -m "add files"` 在**本地提交**文件（ `add files` 是提交日志）

   再次输入 `git status` 会出现

   > On branch master  处于主分支
   > nothing to commit, working tree clean  没有需要提交的，工作树是干净的

### 8. 将本地项目托管到 Github 或 <font color="red">码云</font>中

1. `git remote add origin https://gitee.com/BambooEdge/vue_shop.git` 

2. `git push -u origin master` 

   > 在这里出现了 `Incorrect username or password (access token)` 因为之前配置过的用户名密码与现在不一致，需要更改:
   >
   > 控制面板-->搜索“凭据管理器”-->找到 `git:https://gitee.com` --> 编辑 --> 更改后保存
   >
   > 建议不勾选 `禁止命令行推送暴露个人邮箱`

3. 刷新网页

## 2.2 后台项目的环境安装配置

### 1.  使用 `phpstudy_pro` 创建数据库

① 安装 phpstudy_pro
② 在 phpstudy_pro 软件管理中安装 MySQL (例:MySQL5.7.26) 
③ 在 phpstudy_pro 数据库中点击左上角的创建数据库 
④ 输入 数据库名称(mydb) 用户名(admin) 密码(123456),参考 api 资源目录 config>default.json `db_config` 里的 `"user"` 和 `"password"` 

```json
"db_config" : {
    "protocol" : "mysql",
    "host" : "127.0.0.1",
    "database" : "mydb",		// 数据库名称
    "user" : "admin",		    // 用户名
    "password" : "123456",		// 密码
    "port" : 3306			    // 启动端口
}
```

⑤ 找到对应的数据库点击 操作 -- 导入 

⑥ 选择文件 mydb.sql 后,点击确认,等待数据库导入

⑦ 当状态为正常时,则导入成功 

### 2. 配置项目相关信息

 使用命令行窗口打开 `vue_api` 先执行 `npm install` ,再执行 `node app.js` 

### 3. 启动项目

<font color="red">平时启动需开启MySQL运行api</font>

### 4. 使用 `Postman` 测试后台项目接口是否正常

![1621932620636](C:\Users\华之殇\AppData\Roaming\Typora\typora-user-images\1621932620636.png)

# 3. 登录/退出功能

## 3.1 登录概述

### 1. 登录业务流程

1. 在登录页面输入用户名和密码
2. 调用后台接口进行验证
3. 通过验证之后，根据后台的响应状态跳转到项目主页

### 2. 登录业务的相关技术点

- http 是无状态的
- 通过 cookie 在客户端记录状态
- 过 session 在服务器端记录状态
- 通过 token 方式维持状态

## 3.2 登录——token原理分析

1. 登录页面输入用户名和密码进行登录
2. 服务器验证通过之后生成该用户的token并返回
3. 客户端存储该token
4. 后续所有的请求都携带该token发送请求
5. 服务器验证token是否通过

## 3.3 登录功能实现

### 1. 登录页面的布局

通过 `Element UI` 组件实现布局

- el-form
- el-form-item
- el-input
- el-button
- 字体图标 [iconfont-阿里巴巴矢量图标库](https://www.iconfont.cn/)

 `element.js` 

```javascript
import Vue from 'vue';
import { Button, Form, FormItem, Input, Message } from 'element-ui';
Vue.use(Button);
Vue.use(Form);
Vue.use(FormItem);
Vue.use(Input);
// 挂载到Vue全局
Vue.prototype.$message = Message // 没有这一行，使用Element组件会报错
```

### 2.实现登录功能

> git staus  查看状态
>
> git checkout -b login  创建一个login分支
>
> git branch  查看分支

> 安装开发依赖 `less`  `less-loader` 报错
>
> `less` 版本太高
>
> `npm install less@3.9.0 -s` 
>
> `npm install less-loader@5.0.0 -s` 

① 通过 axios 调用登录验证接口

 `main.js`

```javascript
import axios from 'axios';
// 配置请求的根路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/';
Vue.prototype.$http = axios;
```



② 登录成功之后保持用户 token 信息
③ 跳转到项目主页

```javascript
login() {
    this.$refs.loginFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post('login', this.loginForm)
        if (res.meta.status !== 200) return this.$message.error('登录失败!')
        this.$message.success('登录成功')
        // 1. 将登录成功之后的 token，保存到客户端的 sessionStorage 中
        //  1.1 项目中出了登录之外的其他API接口，必须在登录之后才能访问
        //  1.2 token 只应在当前网站打开期间生效，所以将 token 保存在 sessionStorage 中
        window.sessionStorage.setItem('token', res.data.token)
        // 2. 通过编程式导航跳转到后台主页，路由地址是 /home
        this.$router.push('/home')
    })
}
```

### 3. 路由导航守卫控制访问权限

如果用户没有登录，但是直接通过URL访问特定页面，需要重新导航到登录页面。

```javascript
	// 挂载路由导航守卫
router.beforeEach((to, from, next) => {
    // to 将要访问的路径
    // from 代表从哪个路径调转而来
    // next 是一个函数，表示放行
    //      next() 放行  next('/login) 强制跳转
    if (to.path === '/login') return next()
    // 获取token
    const tokenStr = window.sessionStorage.getItem('token')
    if (!tokenStr) return next('/login')
    next()
})
```

### 4. Vue 直接操作 DOM

- 通过 ref 标注 DOM 元素

```javascript
// 在 DOM 元素上通过 ref 属性标注，属性名称自定义  
<div ref="info">hello</div>
```

- 通过 $refs 获取 DOM 元素

```javascript
// 通过 Vue 实例的 $refs 获取标记 ref 属性的元素  
let info = this.$refs.info.innerHTML 
console.log(info) // hello 
```

### 5. 基于 Element-UI 进行表单验证

Element-UI表单验证规则 :

```javascript
loginFormRules: {    // 登录名称的验证规则    
    username: [{ required: true, message: '请输入用户名称', trigger: 'blur' }],
        password: [{ required: true, message: '请输入用户密码', trigger: 'blur' }]  } 

// 进行表单验证  
this.$refs.loginFormRef.validate(async valid => {    
    // 如果验证失败，直接退出后续代码的执行    
    if (!valid) return    
    // 验证通过后这里完成登录成功后的相关操作（保存token、跳转到主页）  }) 
```

## 3.4 退出功能实现原理

基于 token 的方式实现退出比较简单，只需要销毁本地的 token 即可。这样，后续的请求就不会携带 token ，必须重新登录生成一个新的 token 之后才可以访问页面。

```javascript
// 清空token   
window.sessionStorage.clear()   
// 跳转到登录页   
this.$router.push('/login') 
```

