import { post, get } from '@/utils/request'
import { DownLoad } from '@/utils/globalFunction'

let id
const setId = (Bid) => {
  id = Bid
  console.log(id)
}
// 获取列表信息接口
const getTableList = (params) => post(`/bff/api/v1/dispatch/details/_page?billNo=${encodeURI(id)}`, params)

// 按照查询条件导出对应文件
const ExportExcel = (params) => DownLoad(`/bff/api/v1/dispatch/_export`, 'post', params, 1)

// 获取发货详情
const getDelivery = (params) => get(`/bff/api/v1/dispatch?billNo=${encodeURI(params)}`)

// 合发单状态请求接口
const getJITNo = (params) => get(`/bff/ods/api/v1/merge/dispatch/r/query_merge_dispatch_no?dispatchNo=${params}`)

export { getTableList, ExportExcel, setId, getDelivery, getJITNo }
