import { post, get } from '@/utils/request'

// 获取列表信息接口
const getTableList = (params) => post(`/bff/pos/api/v1/sales/inventory/r/query_transfer_detail`, params)

// 分货详情
const getSaleInfo = (params) => get(`/bff/pos/api/v1/sales/inventory/r/query_transfer_info?billNo=${params}`)

// // 获取字典数据接口: 业务模式和店铺状态
// const getTypeCode = (params) => post('/api/v1/dict/type/_list', params)

// 保存草稿
const saveText = (params) => post('/bff/pos/api/v1/sales/inventory/w/save_transfer', params)

// 提交分货
const submitSelect = (params) => post('/bff/pos/api/v1/sales/inventory/w/submit_transfer', params)

// 编辑草稿
const EditText = (params) => post('/api/v1/salePool/inventoryTransfer/edit', params)

// // 废弃草稿
const cancelText = (params) => post('/bff/pos/api/v1/sales/inventory/w/discard_transfer', params)

// // 删除选中
const deleteItem = (params) => post('/bff/pos/api/v1/sales/inventory/w/delete_transfer_detail', params)

// // 商品上下架
const getWareHouseList = (params) => post('/bff/pos/api/v1/sales/pool/r/query_transfer_relatedpool_list', params)

// 添加商品
const addProduct = (params) => post('/bff/pos/api/v1/sales/product/r/query_list', params)

// 测试已有
const testHas = (params) => post('/bff/pos/api/v1/sales/inventory/r/query_transfer_product', params)

// 查询已有
const searchHas = (params) => post('/bff/pos/api/v1/sales/inventory/r/query_transfer_detail', params)

export { saveText, submitSelect, EditText, cancelText, deleteItem, addProduct, getWareHouseList, searchHas, testHas,
  getTableList, getSaleInfo }
