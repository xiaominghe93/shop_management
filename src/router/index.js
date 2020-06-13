import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login'
import Home from '../components/Home.vue'
import Welcom from '../components/Welcom.vue'
import Users from '../components/users/users.vue'
import Roles from '../components/rights/roles.vue'
import RightsList from '../components/rights/rightsList.vue'
import Goods from '../components/goods/goods.vue'
import addGoods from '../components/common/addGoods.vue'
import params from '../components/goods/params.vue'
import goodsSort from '../components/goods/goods_sort.vue'
import orders from '../components/orders/orders.vue'
import report from '../components/report/report.vue'

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
