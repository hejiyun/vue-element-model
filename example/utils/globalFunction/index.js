import { getToken } from '@/utils/auth'
import axios from 'axios'
import request from '../request'

// 空参处理
export const getparams = (params) => {
  let newQueryString = ''
  for (const key in params) {
    if (params[key] !== '') {
      if (newQueryString !== '') {
        newQueryString += '&'
      }
      newQueryString += `${key}=${params[key]}`
    }
  }
  return newQueryString
}

// 保存审计日志
export const saveAuditLog = async function(response) {
  try {
    const config = response.config
    const token = getToken()
    const url = config.url
    const method = config.method
    if (token && method !== 'get' && await notInBlackList(url, method)) {
      const systemId = '10'
      const href = document.location.href
      const statusCode = response.status
      const time = Date.now()
      const data = `${systemId};${url};${method};${href};${statusCode};${time};${token}`
      navigator.sendBeacon('/bff/api/v1/audit_log', data)
    }
  } catch (error) {
    console.log('save audit log failed')
    console.dir(error)
  }
}

// 判断审计接口是否在黑名单内
let blackList
export const notInBlackList = async function(url, method) {
  if (!blackList) {
    const response = await axios.get('/bff/api/v1/audit_log/black_list?systemId=10')
    blackList = response.data || []
  }
  for (const i of blackList) {
    if (method === i.method && RegExp(i.requestPath).test(url)) {
      return false
    }
  }
  return true
}

export const DownLoad = async function(url, method, params, type) {
  const res = await request({
    method: method,
    timeout: (params && params.hasOwnProperty('timeout')) ? params.timeout : 60000,
    url: url,
    data: params,
    responseType: type ? null : 'blob'
  })
  if (res.data.code) {
    this.$message.warning(`${res.data.msg}`)
    return
  }
  let blob
  if (type) {
    blob = new Blob(['\ufeff' + res.data], { type: 'text/csv;charset=utf-8' })
  } else {
    blob = new Blob([res.data], { type: 'text/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8' })
  }
  const Fileurl = window.URL.createObjectURL(blob)
  // 通过创建a标签实现
  const link = document.createElement('a')
  link.href = Fileurl
  // 对下载的文件命名
  link.download = decodeURI(res.headers['content-disposition'].split('=')[1]) || '导出数据表.csv'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

export const getCurrentTime = function() {
  let date = new Date()
  const Y = date.getFullYear()
  const M = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1)
  const D = date.getDate() < 10 ? ('0' + date.getDate()) : date.getDate()
  const D2 = date.getDate() - 7 < 10 ? ('0' + (date.getDate() - 7)) : date.getDate() - 7
  const hours = date.getHours()
  const minutes = date.getMinutes() < 10 ? ('0' + date.getMinutes()) : date.getMinutes()
  const seconds = date.getSeconds() < 10 ? ('0' + date.getSeconds()) : date.getSeconds()
  date = Y + '-' + M + '-' + D + ' ' + hours + ':' + minutes + ':' + seconds
  const data2 = Y + '-' + M + '-' + D2 + ' ' + hours + ':' + minutes + ':' + seconds
  console.log(date) // 2019-10-12 15:19:33
  return [data2, date]
}
