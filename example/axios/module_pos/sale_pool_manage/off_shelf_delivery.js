import { post } from '@/utils/request'
import { DownLoad } from '@/utils/globalFunction'
// 获取列表信息接口
const getTableList = (params) => post(`/bff/pos/api/v1/sales/inventory/r/query_offline_list`, params)

// 库存下架
const getSalePull = (params) => post('/bff/pos/api/v1/sales/inventory/w/offline', params)

// 批量下架
const batchPull = (params) => post('/bff/pos/no_route/api/v1/sales/inventory/w/import_offline', params)

// 按照查询条件导出对应文件
const ExportExcel = (params) => DownLoad(`/bff/pos/no_route/api/v1/sales/inventory/r/export_offline_list`, 'post', params)

// 导出excel模板
const ExportExcelModel = (params) => DownLoad(`/bff/common/no_route/api/v1/template/r/download?templateId=POS_SALES_INVENTORY_OFFLINE_IMPORT`, 'get', params)

export { getTableList, ExportExcel, getSalePull, batchPull, ExportExcelModel }
