import { post } from '@/utils/request'

// 获取列表信息接口
const getTableList = (params) => post(`/bff/pos/api/v1/store/product/r/query_onffline_result`, params)

// 获取字典数据接口: 业务模式和店铺状态
const getTypeCode = (params) => post('/bff/pos/api/v1/common/dict/r/query_list', params)

export { getTableList, getTypeCode }
