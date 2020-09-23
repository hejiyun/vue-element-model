import { post, get } from '@/utils/request'

// 获取列表信息接口
const getTableList = (params) => post(`/bff/pos/api/v1/sales/inventory/r/query_transfer_detail`, params)

// 分货详情
const getSaleInfo = (params) => get(`/bff/pos/api/v1/sales/inventory/r/query_transfer_info?billNo=${params}`)

export { getTableList, getSaleInfo }
