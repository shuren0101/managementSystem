import Vue from 'vue';
import App from './App.vue';
import store from './store/index.js';
import router from './router';
import './plugins/element.js';
import './assets/css/element-variables.scss'
import i18n from './assets/locales';
// 导入全局样式表
import './assets/css/global.less';
// 导入字体样式
import './assets/fonts/iconfont.css';
import './assets/fonts/iconfont.js';
// 引入全局icons
import '@/assets/icons';
import axios from 'axios';
import TreeTable from 'vue-table-with-tree-grid';
// 导入富文本编辑器
import VueQuillEditor from 'vue-quill-editor';
// require styles 导入富文本编辑器对应的样式
import 'quill/dist/quill.core.css'; // import styles
import 'quill/dist/quill.snow.css'; // for snow theme
import 'quill/dist/quill.bubble.css'; // for bubble theme
// 导入 Nprogress 包对应的js和css
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import DialogBox from '@/components/DialogBox' // 

// 配置请求的根路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/';
// axios请求拦截
axios.interceptors.request.use(config => {
  // console.log(config)
  NProgress.start();
  // 为请求头对象，添加token验证的Authorization字段
  config.headers.Authorization = window.sessionStorage.getItem('token');
  // 最后必须return config
  return config;
});
// 在 response 拦截器中，隐藏进度条 NProgress.done();
axios.interceptors.response.use(config => {
  NProgress.done();
  return config;
});

Vue.prototype.$http = axios
Vue.config.productionTip = false
Vue.component('tree-table', TreeTable);
Vue.component('dialogBox', DialogBox);
// 将富文本编辑器注册为全局可用的组件
Vue.use(VueQuillEditor);
Vue.filter('dateFormat', function(dateStr) {
  const dt = new Date(dateStr * 1000) // 时间戳为毫秒需*1000
  const y = dt.getFullYear()
  const m = (dt.getMonth() + 1 + '').padStart(2, '0')
  const d = (dt.getDate() + '').padStart(2, '0')
  const hh = (dt.getHours() + '').padStart(2, '0')
  const mm = (dt.getMinutes() + '').padStart(2, '0')
  const ss = (dt.getSeconds() + '').padStart(2, '0')
  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})
new Vue({
  el: '#app',
  router,
  store,
  i18n,
  render: h => h(App)
}).$mount('#app')