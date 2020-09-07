import { get, post } from './request'

const getPass = (params) => get('/api/v1/getMore', params)
const getPass1 = (params) => get(`/api/v1/sdfj`, params)
const loginIn = (params) => post(`/api/internal/user/login`, params)
const getMenu = () => get('/api/api/v2/cur_available_resource')
const getWarehouse = () => get(`/bff/api/v1/warehouses?externalWarehouseInfo=&warehouseTypes=1,2,3,4,5,6`)

export { getPass, getPass1, loginIn, getMenu, getWarehouse }
