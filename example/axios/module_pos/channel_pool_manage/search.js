import { post } from '@/utils/request'
import { DownLoad } from '@/utils/globalFunction'

// 获取列表信息接口
const getTableList = (params) => post(`/bff/pos/api/v1/channel/product/r/query_list`, params)

// 按照查询条件导出对应文件
const ExportExcel = (params) => DownLoad(`/bff/pos/no_route/api/v1/sales/product/r/export_list`, 'post', params)

export { getTableList, ExportExcel }
