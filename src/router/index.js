import Vue from 'vue';
import Router from 'vue-router';
const Login = () =>
    import ('../components/Login.vue');
const Home = () =>
    import ('../components/Home.vue');
const Welcome = () =>
    import ('../components/welcome.vue');
const User = () =>
    import ('../components/user/User.vue');
const Rights = () =>
    import ('../components/power/Rights.vue');
const Roles = () =>
    import ('../components/power/Roles.vue');
const Cate = () =>
    import ('../components/goods/Cate.vue');
const Params = () =>
    import ('../components/goods/Params.vue');
const List = () =>
    import ('../components/goods/List.vue');
const Add = () =>
    import ('../components/goods/Add.vue');
const Order = () =>
    import ('../components/order/Order.vue');
const Report = () =>
    import ('../components/report/Report.vue');

Vue.use(Router);

const router = new Router({
    routes: [
        { path: '/', redirect: '/login' }, // 重定向
        { path: '/login', component: Login },
        {
            path: '/home',
            component: Home,
            redirect: '/welcome',
            children: [
                { path: '/welcome', component: Welcome },
                { path: '/users', component: User }, // 用户列表
                { path: '/rights', component: Rights }, // 权限列表
                { path: '/roles', component: Roles }, // 角色列表
                { path: '/categories', component: Cate }, // 商品分类
                { path: '/params', component: Params }, // 分类参数
                { path: '/goods', component: List }, // 商品列表
                { path: '/goods/add', component: Add }, // 添加商品
                { path: '/orders', component: Order }, // 订单列表
                { path: '/reports', component: Report } // 数据报表
            ]
        }
    ]
});

// 挂载路由导航守卫
router.beforeEach((to, from, next) => {
    // to：将要访问的路径
    // from：代表从哪个路径跳转而来
    // next是一个函数，表示放行； next() 放行 next('./login') 强制跳转

    // 如果用户访问的是登录页，直接放行
    if (to.path === '/login') return next()
        // 从sessionStorage中获取到保存的token值
    const tokenStr = window.sessionStorage.getItem('token');
    // 没有token强制跳转到登录页
    if (!tokenStr) return next('/login')
    next()
});

export default router;