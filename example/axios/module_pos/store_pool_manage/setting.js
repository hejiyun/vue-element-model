import { post, get } from '@/utils/request'

// 获取列表信息接口
const getTableList = (params) => post(`/bff/pos/api/v1/store/pool/r/query_list`, params)

// 获取字典数据接口: 业务模式和店铺状态
const getTypeCode = (params) => post('/bff/pos/api/v1/common/dict/r/query_list', params)

// 获取销售商品池列表
const getSaleList = (params) => post('/bff/pos/api/v1/store/pool/r/query_salespool_list', params) // 新增角色

// 获取店铺商品池配置信息
const getSaleInfo = (params) => post('/bff/pos/api/v1/store/pool/r/query_info', params) //

// 店铺商品池创建
const createdPool = (params) => post('/bff/pos/api/v1/store/pool/w/create', params)

// 店铺商品池修改
const updataPool = (params) => post('/bff/pos/api/v1/store/pool/w/update_info', params)

// 配置弹窗获取品牌
const getBrands = () => get('/bff/api/v1/brands')

// 配置弹窗获取货号
const getProductCodes = (params) => get(`/bff/pdc/api/v1/product/getSpusByProductCodes?productCodes=${params}`)

// 配置弹窗获取条码
const getProductNos = (params) => get(`/bff/pdc/api/v1/product/getSkusByBarCodes?barCodes=${params}`)

// 获取店铺信息查询接口:
const getPoolList = () => post(`/bff/pos/api/v1/store/pool/r/query_storePool_list`, {})

export { getTableList, getTypeCode, getSaleInfo, createdPool, updataPool, getSaleList, getBrands,
  getProductCodes, getProductNos, getPoolList }
