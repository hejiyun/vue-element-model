import { post, get } from '@/utils/request'

// 获取店铺信息查询接口:
const getPoolList = () => post('/bff/pos/api/v1/sales/pool/r/query_salePool_list', {})

// 获取品牌信息查询接口:
const getBrandList = () => get(`/bff/api/v1/brands`)

export { getPoolList, getBrandList }
