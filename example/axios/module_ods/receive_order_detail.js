import { post, get } from '@/utils/request'
import { DownLoad } from '@/utils/globalFunction'

let id
const setId = (Bid) => {
  id = Bid
}
// 获取列表信息接口
const getTableList = (params) => post(`/bff/api/v1/receive/details?billNo=${encodeURI(id)}`, params)

// 按照查询条件导出对应文件
const ExportExcel = (params) => DownLoad(`/bff/api/v1/receive/_export`, 'post', params, 1)

// 获取收货详情
const getReceive = (params) => get(`/bff/api/v1/receive?billNo=${encodeURI(params)}`)

export { getTableList, ExportExcel, setId, getReceive }
