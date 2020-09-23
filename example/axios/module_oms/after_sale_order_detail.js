import { post, get } from '@/utils/request'

// 获取列表信息接口
const getTableList = (params) => post(`/bff/oos/api/query/v1/ro/items/list`, params)

// 获取售后单详情
const getOmsSouhouDetailMsg = (id, No) => get(id ? `/bff/oos/api/query/v1/ro/get?uid=${id}&returnNo=${No}&types=base,warehouse,delivery` : `/bff/oos/api/query/v1/ro/get?returnNo=${No}&types=base,warehouse,delivery`)

export { getTableList, getOmsSouhouDetailMsg }
