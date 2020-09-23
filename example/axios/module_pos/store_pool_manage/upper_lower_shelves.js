import { post } from '@/utils/request'
import { DownLoad } from '@/utils/globalFunction'
// 获取列表信息接口
const getTableList = (params) => post(`/bff/pos/api/v1/store/product/r/query_onffline_list`, params)

// 商品上下架
const getSalePush = (params) => post('/bff/pos/api/v1/store/product/w/onffline', params)

// 批量上下架导入
const batchPush = (params) => post('/bff/pos/no_route/api/v1/store/product/w/import_onffline_list', params)

// 按照查询条件导出对应文件
const ExportExcel = (params) => DownLoad(`/bff/pos/no_route/api/v1/store/product/r/export_onffline_list`, 'post', params)

// 导出excel模板
const ExportExcelModel = (params) => DownLoad(`/bff/common/no_route/api/v1/template/r/download?templateId=POS_STORE_PRODUCT_ONFFLINE_IMPORT_TPL`, 'get', params)

export { getTableList, ExportExcel, getSalePush, batchPush, ExportExcelModel }
