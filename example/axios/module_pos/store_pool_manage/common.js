import { post, get } from '@/utils/request'
// 获取字典数据接口: 业务模式和店铺状态
const getTypeCode = (params) => post('/bff/pos/api/v1/common/dict/r/query_list', params)

// 获取店铺信息查询接口:
const getPoolList = () => post(`/bff/pos/api/v1/store/pool/r/query_storePool_list`, {})

// 获取品牌信息查询接口:
const getBrandList = () => get(`/bff/api/v1/brands`)

export { getTypeCode, getPoolList, getBrandList }
