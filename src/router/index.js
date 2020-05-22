import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login'
import Home from '../components/Home.vue'
import Welcom from '../components/Welcom.vue'
import Users from '../components/users/Users.vue'

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
      { path: '/users', component: Users }
    ]
  }
]

const router = new VueRouter({
  routes
})

export default router
