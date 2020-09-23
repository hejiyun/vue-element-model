import { post } from '@/utils/request'
import { DownLoad } from '@/utils/globalFunction'

// 获取字典数据接口: 业务模式和店铺状态
const getTypeCode = (params) => post('/bff/pos/api/v1/common/dict/r/query_list', params)

// 获取列表信息接口
const getTableList = (params) => post(`/bff/pos/api/v1/sales/inventory/r/query_transfer_list`, params)

// 获取调入/调出商品池
const getWareHouseList = (params) => post('/bff/pos/api/v1/sales/pool/r/query_transfer_relatedpool_list', params)

// 批量分货
const selectMore = (params) => post('/bff/pos/no_route/api/v1/sales/inventory/w/import_transfer_list', params)

// 导出excel模板
const ExportExcelModel = (params) => DownLoad(`/bff/common/no_route/api/v1/template/r/download?templateId=POS_IMPORT_TRANSFER_LIST`, 'get', params)

export { getTableList, getWareHouseList, selectMore, ExportExcelModel, getTypeCode }
