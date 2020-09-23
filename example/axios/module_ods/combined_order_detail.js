import { post, get } from '@/utils/request'
import { DownLoad } from '@/utils/globalFunction'

// 获取列表信息接口
const getTableList = (params) => post(`/bff/ods/api/v1/merge/dispatch/r/query_details`, params)

// 按照查询条件导出对应文件
const ExportExcel = (params) => DownLoad(`/bff/ods/no_route/api/v1/merge/dispatch/r/export_list`, 'post', params)

// 合发单状态请求接口
const getDetail = (params) => get(`/bff/ods/api/v1/merge/dispatch/r/query_info?mergeDispatchNo=${params}`)

export { getTableList, ExportExcel, getDetail }
