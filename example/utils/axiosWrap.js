import Axios from './request.js'
// get 请求
export var getAxios = (url, params, config) => {
  let axiosBase = {
    method: 'get',
    url: url,
    params: params
  }
  if (!config) {
    config = {}
  }
  axiosBase = Object.assign(axiosBase, config)
  return Axios(axiosBase)
}
// post 请求
export var postAxios = (url, data, config) => {
  let axiosBase = {
    method: 'post',
    url: url,
    data: data
  }
  if (!config) {
    config = {}
  }
  axiosBase = Object.assign(axiosBase, config)
  return Axios(axiosBase)
}
