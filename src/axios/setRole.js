import { get, post } from './request'

// 获取列表信息接口
const getTableList = () => get(`/api/api/v1/role?limit=25&page=1`)

// 获取编辑弹窗内角色信息接口
const getRoleList = () => get(`/api/api/v1/role?limit=0`)

export { getRoleList, getTableList }