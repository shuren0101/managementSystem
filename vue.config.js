var webpack = require('webpack')
const cdn = {
  // 模块名称和模块作用域命名（对应window里面挂载的变量名称）
  externals: {
    vue: 'Vue',
    vuex: 'Vuex',
    'vue-router': 'VueRouter',
    moment: 'moment',
    axios: 'axios'
  },
  // cdn的css链接
  css: [

  ],
  // 通过cdn方式使用
  js: [
    'https://cdn.jsdelivr.net/combine/npm/vue@2.6.11,npm/vuex@3.6.2,npm/vue-router@3.5.3,npm/axios@0.21.4,npm/moment@2.29.1/moment.min.js' // 必须先引入moment，否则“TypeError: Cannot read property 'default' of undefined”
    // 'https://cdn.jsdelivr.net/npm/moment@2.29.1/locale/zh-cn.js', // 日期选择控件等将默认显示为英文，中文需引入语言包，
  ]
}

const path = require('path')

function resolve(dir) {
  return path.join(__dirname, dir)
}

module.exports = {
  publicPath: process.env.VUE_APP_BASE_URL,
  lintOnSave: false,
  chainWebpack: config => {
    // 移除prefetch插件，避免加载多余的资源
    config.plugins.delete('prefetch')
    // 移除 preload 插件，避免加载多余的资源
    config.plugins.delete('preload')
    // 配置cdn引入
    config.plugin('html').tap((args) => {
      args[0].cdn = cdn
      return args
    })
    // 疏忽/moment/locale下的所有文件
    config.plugin('ignore').use(new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/))

    // svg配置
    config.module
      .rule('svg')
      .exclude.add(resolve('src/assets/icons'))
      .end()
    config.module
      .rule('icons')
      .test(/\.svg$/)
      .include.add(resolve('src/assets/icons'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]'
      })
      .end()
  },
}