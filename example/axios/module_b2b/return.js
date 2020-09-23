import { post, get } from '@/utils/request'

// 获取列表信息接口
const getTableList = (params) => post(`/bff/b2b/api/v1/ret_order/_list`, params)

// 获取店铺信息查询接口:
const getCustormer = (params) => get(`/bff/b2b/api/v1/customer?customerName=${params}`)

// 获取仓库信息
const getwarehouse = (params) => get(`/bff/api/v1/warehouses?externalWarehouseInfo=${params}`)

// 权限菜单请求接口
const getRole = () => get('/bff/b2b/api/v2/auth/createRetOrder')

// 导入退货单
const createOrder = (params) => post(`/b2b_order/api/v1/import/ret_order`, params, { timeout: 180000 })

// 获取退货类型状态接口
const getSearchTypeObj = () => get(`/bff/b2b/api/v1/_dict`)

export { getTableList, getCustormer, getwarehouse, getRole, createOrder, getSearchTypeObj }
