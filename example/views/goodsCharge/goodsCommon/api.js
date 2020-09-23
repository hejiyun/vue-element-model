import { post } from '@/utils/request'
import { postAxios } from '@/utils/axiosWrap'
export default {
  importPrice: (params) => postAxios('/bff/api/v1/pricing/price/import', params, { timeout: 20000 }), // 商品指导价导入
  templateDownload: '/bff/api/v1/pricing/price/templateDownload', // 商品指导价模板下载
  manage: (params) => post('/bff/api/v1/pricing/price/manage', params), // 商品指导价查询
  export: '/bff/api/v1/pricing/price/export', // 商品指导价导出
  totalConfig: (params) => post('/bff/api/v1/pricing/monitor/config', params), // 全局价格监控设置
  lookConfig: (params) => post('/bff/api/v1/pricing/monitor/configDetail', params), // 查询全局价格监控设置
  priceDetail: (params) => post('/bff/api/v1/pricing/price/detail', params), // 商品指导定价详情
  warnInfo: (params) => post('/bff/api/v1/pricing/warn/info', params), // 预警查询
  warnConfig: (params) => post('/bff/api/v1/pricing/warn/infoConfirm', params), // 预警配置操作
  operateLog: (params) => post('/bff/api/v1/pricing/price/operateLog', params) // 商品指导操作日志
}
