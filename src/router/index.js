import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login'
import Home from '../components/Home.vue'
import Welcom from '../components/Welcom.vue'
import Users from '../components/users/Users.vue'
import Roles from '../components/rights/roles.vue'
import RightsList from '../components/rights/RightsList.vue'

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
      { path: '/rights', component: RightsList }
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
