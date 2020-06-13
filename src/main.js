import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
// 引入全局样式
import './assets/css/global.css'
// 引入矢量图样式
import './assets/font/iconfont.css'
// 引入富文本编辑器vue-fill-editor
import VueQuillEditor from 'vue-quill-editor'
// 引入富文本编辑器的样式
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

// 引入设置的axios
import http from './http'

// 引入table-tree组件
import ZkTable from 'vue-table-with-tree-grid'
// 注册table-tree组件
Vue.component('table-tree', ZkTable)

// 注册富文本编辑器组件
Vue.use(VueQuillEditor)

Vue.prototype.$http = http
Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
