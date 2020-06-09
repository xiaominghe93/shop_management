import axios from 'axios'

const http = axios.create({
  baseURL: 'http://127.0.0.1:8888/api/private/v1/'
})

// 为请求头设置token
http.interceptors.request.use(config => {
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})

http.interceptors.response.use(config => {
  return config
})

export default http
