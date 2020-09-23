import { get, post, patch } from '@/utils/request'

// 获取列表信息接口
const getTableList = (params) => get(`/api/api/V2/resource`, params)

const setResource = (params) => post(`/api/api/v1/resource`, params)
const editRole = (params) => patch(`/api/api/v1/resource`, params)

export { editRole, setResource, getTableList }

