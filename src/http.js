import axios from 'axios'
// 引入进度条插件
import NProgress from 'nprogress'

const http = axios.create({
  baseURL: 'http://127.0.0.1:8888/api/private/v1/'
})

// 为请求头设置token
http.interceptors.request.use(config => {
  NProgress.start()
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})

http.interceptors.response.use(config => {
  NProgress.done()
  return config
})

export default http
