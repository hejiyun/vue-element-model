import { post, get } from '@/utils/request'
import { DownLoad } from '@/utils/globalFunction'

// 获取列表信息接口
const getTableList = (params) => post(`/bff/api/v1/receive/_page`, params)

// 按照查询条件导出对应文件
const ExportExcel = (params) => DownLoad(`/bff/api/v1/receive/_export`, 'post', params, 1)

// 获取数据字典
const getMessage = (params) => post('/bff/api/v1/dict/type/_list', params)

// 获取客商信息
const getCustorm = () => get('/bff/api/v1/vend-cust')

// 获取ODS仓库信息
const getwarehouseType = () => get(`/bff/api/v1/dict/type?typeCode=bill_query_warehouse_type`)

// 获取仓库
const getwarehouseList = (params, data) => get(`/bff/api/v1/warehouses?externalWarehouseInfo=${params}&warehouseTypes=${data}`)

export { getTableList, ExportExcel, getMessage, getCustorm, getwarehouseList, getwarehouseType }
