import axios from 'axios'
import { Message } from 'element-ui'
import store from '@/store'
import { getToken, setToken } from '@/utils/auth'
import Vue from 'vue'
import { saveAuditLog } from './globalFunction/index'

var loadingCount = 0

// 创建axios对象
const service = axios.create({
  baseURL: process.env.BASE_API, // api 的 base_url
  timeout: 5000 // request timeout
})

// 请求拦截
service.interceptors.request.use(
  config => {
    // 流量统计中文转换
    loadingCount++
    // 判定请求参数中属性noload为true的http请求,视为不需要加载loading动画,
    const noload = JSON.parse(sessionStorage.getItem('noload'))
    !noload && Vue.prototype.$mloading.show()
    sessionStorage.removeItem('noload')
    if (store.getters.token) {
      // 让每个请求携带token-- ['X-Token']为自定义key 请根据实际情况自行修改
      config.headers['Authorization'] = getToken()
    }
    return config
  },
  error => {
    // Do something with request error
    loadingCount--
    if (loadingCount === 0) {
      Vue.prototype.$mloading.hide()
    }

    console.log(error) // for debug
    Promise.reject(error)
  }
)

// 响应拦截
service.interceptors.response.use(
  response => {
    // 系统API返回统一处理
    loadingCount--
    if (loadingCount === 0) {
      Vue.prototype.$mloading.hide()
    }
    const status = response.status
    const msg = response.statusText
    // 保存审计日志
    saveAuditLog(response)
    if (status === 200 || status === 0 || status === 204) {
      return Promise.resolve(response)
    } else {
      window.VUE_SCOPE.$message.error(msg || '请求失败，请重试')
      return Promise.reject(
        msg
      )
    }
  },
  error => {
    saveAuditLog(error.response)
    loadingCount--
    if (loadingCount === 0) {
      Vue.prototype.$mloading.hide()
    }
    // 响应码状态码400异常处理
    if (error.response.status === 400) {
      if (error.request.responseType === 'blob') {
        const reader = new FileReader()
        reader.readAsText(error.response.data, 'utf-8')
        reader.onload = function() {
          const bldata = JSON.parse(reader.result)// 此处的msg就是后端返回的msg内容
          Message({
            message: bldata.msg || '请求参数错误',
            type: 'error',
            duration: 2000
          })
        }
      } else {
        Message({
          message: error.response.data.msg || '服务器出错了,请稍后重试',
          type: 'error',
          duration: 2000
        })
      }

      return Promise.reject(error)
    }
    // 响应状态码500异常处理
    if (error.response.status === 500) {
      Message({
        message: error.response.data.msg || '服务器出错了,请稍后重试',
        type: 'error',
        duration: 2000
      })
      return Promise.reject(error)
    }
    if (error.response.data.code === '3000035') {
      this.$notify({
        title: '提示',
        message: '登陆超时',
        duration: 2000
      })
      return Promise.reject(error)
    }
    if (error.response.status === 401) {
      const code = error.response.data.errorCode ? error.response.data.errorCode : error.response.data.code
      const msg = error.response.data.errorMsg ? error.response.data.errorMsg : error.response.data.msg
      if (code === '4011005' && error.response.data.newAccessToken) {
        setToken(error.response.data.newAccessToken || error.response.data.token || error.response.data.data)
        store.dispatch('UpdateToken', error.response.data.newAccessToken || error.response.data.token || error.response.data.data).then(() => {
          Promise.resolve()
        })
      } else if (code === '4011007') {
        location.reload()
        // Promise.resolve()
      } else if (code === '041101001' || code === '041101002') {
        if (code === '041101001') {
          // location.reload()
          Message({
            message: '没有权限访问, 请联系相关人员',
            type: 'error',
            duration: 2000
          })
        } else {
          setToken(error.response.data.data.newAccessToken || error.response.data.data.token || error.response.data.data)
          store.dispatch('UpdateToken', error.response.data.data.newAccessToken || error.response.data.data.token || error.response.data.data).then(() => {
            Promise.resolve()
          })
        }
      } else {
        if (code === '4001') {
          console.log('登陆失败')
        } else {
          if (msg) {
            Message({
              message: msg,
              type: 'error',
              duration: 5000
            })
          } else {
            Message({
              message: '网络异常,请稍后重试',
              type: 'error',
              duration: 5000
            })
          }
        }
      }
    }
    return Promise.reject(error)
  }
)

Vue.prototype.$axios = service
export default service

const get = (url, params, config) => {
  // 在内部通过传递进来的值使用session判断本次请求是否需要loading动画
  if (params && params['noload']) {
    sessionStorage.setItem('noload', true)
    delete params['noload']
  }
  let axiosBase = {
    method: 'get',
    url: url,
    params: params
  }
  !config && (config = {})
  axiosBase = Object.assign(axiosBase, config)
  return service(axiosBase)
}

const post = (url, params, config) => {
  // 在内部通过传递进来的值使用session判断本次请求是否需要loading动画
  if (params && params['noload']) {
    sessionStorage.setItem('noload', true)
    delete params['noload']
  }
  let axiosBase = {
    method: 'post',
    url: url,
    data: params
  }
  !config && (config = {})
  axiosBase = Object.assign(axiosBase, config)
  return service(axiosBase)
}
const del = (url, params, config) => {
  // 在内部通过传递进来的值使用session判断本次请求是否需要loading动画
  if (params && params['noload']) {
    sessionStorage.setItem('noload', true)
    delete params['noload']
  }
  let axiosBase = {
    method: 'delete',
    url: url,
    data: params
  }
  !config && (config = {})
  axiosBase = Object.assign(axiosBase, config)
  return service(axiosBase)
}
const patch = (url, params, config) => {
  // 在内部通过传递进来的值使用session判断本次请求是否需要loading动画
  if (params && params['noload']) {
    sessionStorage.setItem('noload', true)
    delete params['noload']
  }
  let axiosBase = {
    method: 'patch',
    url: url,
    data: params
  }
  !config && (config = {})
  axiosBase = Object.assign(axiosBase, config)
  return service(axiosBase)
}

export {
  get,
  post,
  del,
  patch
}

