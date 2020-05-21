import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
// 引入全局样式
import './assets/css/global.css'
// 引入矢量图样式
import './assets/font/iconfont.css'

// 引入设置的axios
import http from './http'

Vue.prototype.$http = http
Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
