
import { post, get } from '@/utils/request'
import { DownLoad } from '@/utils/globalFunction'

// 获取列表信息接口
const getTableList = (params) => post(`/bff/oos/api/query/v1/order/list`, params)

// 获取Type类型, 新增订单来源类型查询
const getOmsSearchType = () => get(`/bff/oos/api/query/v1/dictionary/query?types=bizType,orderStatus,orderType,orderSourceCode,retrieverReason`)

// 按照查询条件导出对应文件
const ExportExcel = (params) => DownLoad(`/bff/oos/api/query/v1/order/list/export`, 'post', params, 1)

// 获取客商信息
const getCustorm = () => get('/bff/api/v1/vend-cust?vendCusts=custom,shop')

export { getTableList, getOmsSearchType, ExportExcel, getCustorm }
