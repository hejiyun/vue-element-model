import { post } from '@/utils/request'

// // 获取字典数据接口: 业务模式和店铺状态
// const getTypeCode = (params) => post('/api/v1/dict/type/_list', params)

// 保存草稿
const saveText = (params) => post('/bff/pos/api/v1/sales/inventory/w/save_transfer', params)

// 提交分货
const submitSelect = (params) => post('/bff/pos/api/v1/sales/inventory/w/submit_transfer', params)

// // 商品上下架
const getWareHouseList = (params) => post('/bff/pos/api/v1/sales/pool/r/query_transfer_relatedpool_list', params)

// 添加商品
const addProduct = (params) => post('/bff/pos/api/v1/sales/product/r/query_list', params)

export { saveText, submitSelect, addProduct, getWareHouseList }
