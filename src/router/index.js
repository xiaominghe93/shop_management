import Vue from 'vue'
import VueRouter from 'vue-router'

const Login = () => import(/* webpackChunkName: "Login_Home_Welcom" */ '../components/Login')
const Home = () => import(/* webpackChunkName: "Login_Home_Welcom" */ '../components/Home')
const Welcom = () => import(/* webpackChunkName: "Login_Home_Welcom" */ '../components/Welcom')
// import Login from '../components/Login'
// import Home from '../components/Home.vue'
// import Welcom from '../components/Welcom.vue'

const Users = () => import(/* webpackChunkName: "Users_Roles_RightsList" */ '../components/users/Users.vue')
const Roles = () => import(/* webpackChunkName: "Users_Roles_RightsList" */ '../components/rights/roles.vue')
const RightsList = () => import(/* webpackChunkName: "Users_Roles_RightsList" */ '../components/rights/rightsList.vue')
// import Users from '../components/users/Users.vue'
// import Roles from '../components/rights/roles.vue'
// import RightsList from '../components/rights/rightsList.vue'

const Goods = () => import(/* webpackChunkName: "Goods_add_params" */ '../components/goods/goods.vue')
const addGoods = () => import(/* webpackChunkName: "Goods_add_params" */ '../components/goods/addGoods.vue')
const params = () => import(/* webpackChunkName: "Goods_add_params" */ '../components/goods/params.vue')
// import Goods from '../components/goods/goods.vue'
// import addGoods from '../components/goods/addGoods.vue'
// import params from '../components/goods/params.vue'

const goodsSort = () => import(/* webpackChunkName: "goodsSort_orders_report" */ '../components/goods/goods_sort.vue')
const orders = () => import(/* webpackChunkName: "goodsSort_orders_report" */ '../components/orders/orders.vue')
const report = () => import(/* webpackChunkName: "goodsSort_orders_report" */ '../components/report/report.vue')
// import goodsSort from '../components/goods/goods_sort.vue'
// import orders from '../components/orders/orders.vue'
// import report from '../components/report/report.vue'

Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  {
    path: '/home',
    component: Home,
    redirect: '/welcom',
    children:
      [
        { path: '/welcom', component: Welcom },
        { path: '/users', component: Users },
        { path: '/roles', component: Roles },
        { path: '/rights', component: RightsList },
        { path: '/goods', component: Goods },
        { path: '/add', component: addGoods },
        { path: '/params', component: params },
        { path: '/goods_sort', component: goodsSort },
        { path: '/orders', component: orders },
        { path: '/report', component: report }

      ]
  }
]

const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  const tokenStr = window.sessionStorage.getItem('token')
  if (to.path === '/login') return next()
  if (!tokenStr) return next('/login')
  next()
})

export default router
