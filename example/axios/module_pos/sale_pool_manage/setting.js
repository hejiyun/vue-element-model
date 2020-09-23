import { post } from '@/utils/request'

// 获取列表信息接口
const getTableList = (params) => post(`/bff/pos/api/v1/sales/pool/r/query_list`, params)

// 获取字典数据接口: 业务模式和店铺状态
const getTypeCode = (params) => post('/bff/pos/api/v1/common/dict/r/query_list', params)

// // 销售商品池配置信息
const PoolInfo = (params) => post('/bff/pos/api/v1/sales/pool/r/query_info', params)

// 销售商品池创建
const createdPool = (params) => post('/bff/pos/api/v1/sales/pool/w/create', params)

// // 销售商品池修改
const updataPool = (params) => post('/bff/pos/api/v1/sales/pool/w/update_info', params)

// // 销售商品池列表
const getPoolList = () => post('/bff/pos/api/v1/sales/pool/r/query_salePool_list', {})

export { getTableList, getTypeCode, PoolInfo, createdPool, updataPool, getPoolList }
