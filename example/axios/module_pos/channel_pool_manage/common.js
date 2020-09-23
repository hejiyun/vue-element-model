import { post, get } from '@/utils/request'

// // 店铺商品池创建
const getPoolList = (params) => post('/bff/pos/api/v1/channel/pool/r/query_list', params)

// // 店铺商品池修改
const getBrandList = () => get('/bff/api/v1/brands')

export { getPoolList, getBrandList }
