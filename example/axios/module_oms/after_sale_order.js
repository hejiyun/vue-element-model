
import { post, get } from '@/utils/request'

// 获取列表信息接口
const getTableList = (params) => post(`/bff/oos/api/query/v1/ro/list`, params)

// 获取Type类型, 新增订单来源类型查询
const getOmsSearchType = () => get(`/bff/oos/api/query/v1/dictionary/query?types=bizType,returnOrderType,returnOrderStatus`)

// 获取客商信息
const getCustorm = () => get('/bff/api/v1/vend-cust?vendCusts=custom,shop')

export { getTableList, getOmsSearchType, getCustorm }
