
import { post, get } from '@/utils/request'

// 获取列表信息接口
const getTableList = (params) => post(`/bff/oos/api/query/v1/order/items/list`, params)

// 获取详情信息
const getOmsDetailMsg = (id, No) => get(id ? `/bff/oos/api/query/v1/order/get?uid=${id}&types=base,delivery,invoice,payment,returnOrders,dispatchBill&orderNo=${No}` : `/bff/oos/api/query/v1/order/get?orderNo=${No}&types=base,delivery,invoice,payment,returnOrders,dispatchBill`)

// 获取Type类型, 新增订单来源类型查询
const getOmsSearchType = () => get(`/bff/oos/api/query/v1/dictionary/query?types=bizType,orderStatus,orderType,orderSource,retrieverReason`)

// 获取渠道信息
const getchannelType = (params, data) => get(`/bff/api/v1/channels?channelInfo=${params}&bizTypes=${data}`)

// 点击取消按钮
const cancelBtn = (params) => post(`/bff/ofc/order/manual/api/v1/cancelDispatch`, params)

// 重新占库
const recapitalization = (params) => post(`/bff/ofc/order/manual/api/v1/manualRetriever`, params)

// 自动占库
const autocapitalization = (No, Id) => post(`/bff/ofc/order/retriever/exec/oncemore?orderNo=${No}&itemId=${Id}`)

// 指定渠道占库
const channelcapitalization = (params) => post(`/bff/api/v1/channel_inventory/_page`, params)

// 提交指定渠道占库
const submitChannelcapitalization = (params) => post(`/bff/ofc/order/retriever/exec/specify`, params)

export { getTableList, getOmsDetailMsg, getOmsSearchType, getchannelType,
  cancelBtn, recapitalization, autocapitalization, channelcapitalization,
  submitChannelcapitalization }
