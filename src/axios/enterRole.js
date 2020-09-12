import { get, post } from './request'

// 获取列表信息接口
const getTableList = () => post(`/api/internal/user/list?page=1&limit=20`, {noload:true})

// 获取编辑弹窗内角色信息接口
const getRoleList = () => get(`/api/api/v1/role?limit=0`)

export { getRoleList, getTableList }