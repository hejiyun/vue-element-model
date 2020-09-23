import { post } from '@/utils/request'
import { DownLoad } from '@/utils/globalFunction'

// 获取列表信息接口
const getTableList = (params) => post(`bff/pos/api/v1/common/inventoryLog/r/query_sync_log`, params)

// 获取店铺信息查询接口:
const getPoolList = () => post(`/bff/pos/api/v1/store/pool/r/query_storePool_list`, {})

// 按照查询条件导出对应文件
const ExportExcel = (params) => DownLoad(`/bff/pos/no_route/api/v1/common/inventoryLog/r/exportInventorySyncLog`, 'post', params)

export { ExportExcel, getPoolList, getTableList }
