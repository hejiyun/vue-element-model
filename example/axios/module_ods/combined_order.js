import { post, get } from '@/utils/request'

// 获取列表信息接口
const getTableList = (params) => post(`/bff/ods/api/v1/merge/dispatch/r/query_page`, params)

// 获取数据字典
const getMessage = (params) => post('/bff/api/v1/dict/type/_list', params)

// 获取ODS仓库信息
const getwarehouseType = () => get(`/bff/api/v1/dict/type?typeCode=bill_query_warehouse_type`)

// 获取仓库
const getwarehouseList = (params, data) => get(`/bff/api/v1/warehouses?externalWarehouseInfo=${params}&warehouseTypes=${data}`)

export { getTableList, getMessage, getwarehouseList, getwarehouseType }
