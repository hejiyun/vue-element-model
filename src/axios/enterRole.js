import { get, post } from './request'

// 获取列表信息接口
const getTableList = (params) => post(`/api/internal/user/list`, params)

// 获取编辑弹窗内角色信息接口
const getRoleList = () => get(`/api/api/v1/role?limit=0`)

export { getRoleList, getTableList }