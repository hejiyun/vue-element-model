import { post } from '@/utils/request'
import { DownLoad } from '@/utils/globalFunction'

// 获取列表信息接口
const getTableList = (params) => post(`/bff/pos/api/v1/store/product/r/query_onffline_detail`, params)

// 按照查询条件导出对应文件
const ExportExcel = (params) => DownLoad(`/bff/pos/no_route/api/v1/store/product/r/export_onffline_detail`, 'post', params)

export { getTableList, ExportExcel }
