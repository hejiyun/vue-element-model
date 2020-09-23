import { post } from '@/utils/request'

// 获取列表信息接口
const getTableList = (params) => post(`/bff/pos/api/v1/sales/inventory/r/query_offline_result`, params)

// 获取店铺信息查询接口:
const getPoolList = () => post('/bff/pos/api/v1/sales/pool/r/query_salePool_list', {})

export { getTableList, getPoolList }
