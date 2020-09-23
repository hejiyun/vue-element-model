import { getTableList } from '@/axios/module_ods/receive_order_detail'

const config = {
  editSearchBar: true,
  tableCofig: {
    height: 360,
    tableHeader: [
      { label: '品牌', prop: 'brand' }, { label: '货品简称', prop: 'productShortName', width: '180' }, {
        label: '货号',
        prop: 'materialCode',
        width: '180'
      },
      { label: '尺码', prop: 'sizeName', width: '100' }, { label: 'SKU条码', prop: 'barCode' }, {
        label: '颜色',
        prop: 'color',
        width: '180'
      },
      { label: '预计收货量', prop: 'expectQty', width: '100' }, {
        label: '实际收货量',
        prop: 'actualQty',
        width: '100'
      }, { label: '收货差异', prop: 'diffQty', width: '120', sort: true }
    ],
    tableData: [],
    changeCell: [8]
  },
  pageConfig: {
    request: getTableList
  }
}
const options = [{
  label: '收货单号',
  key: 'billNo',
  span: 12
}, {
  label: '订单号',
  key: 'orderNo',
  type: 'link',
  to: '/TradingPlatform/returnList/creditDetail',
  span: 12
}, {
  label: '来源单号',
  key: 'sourceBillNo',
  span: 12
},
{
  label: '网店交易单号',
  key: 'shopBillNo'
}, {
  label: '外部单号',
  key: 'externalBillNo'
},
{
  label: '收货单状态',
  key: 'billStatusName'
}, {
  label: '收货单生成时间',
  key: 'createTime'
}, {
  label: '收货单生效时间',
  key: 'billDate'
}, {
  label: '收货时间',
  key: 'receiveTime'
}, {
  label: '业务类型',
  key: 'bizTypeName'
}, {
  label: '客商编码',
  key: 'vendCustCode'
},
{
  label: '客商名称',
  key: 'vendCustName',
  span: 12
}, {
  label: '调拨类型',
  key: 'allocateType'
}, {
  label: '调拨方式名称',
  key: 'allocateModeName'
}, {
  label: '调拨优先级',
  key: 'allocatePriority',
  span: 12
}, {
  label: '收货仓代码',
  key: 'toExternalWarehouseCode'
}, {
  label: '收货仓名称',
  key: 'toExternalWarehouseName'
}, {
  label: '发货仓代码',
  key: 'fromExternalWarehouseCode'
}, {
  label: '发货仓名称',
  key: 'fromExternalWarehouseName'
},
{
  label: '寄件人省市区',
  key: 'provinceCityArea'
}, {
  label: '寄件人地址',
  key: 'address'
}, {
  label: '寄件人姓名',
  key: 'contact'
}, {
  label: '寄件人电话',
  key: 'phone'
}, {
  label: '快递公司',
  key: 'expressCompanyCode'
}, {
  label: '快递单号',
  key: 'expressBillNo',
  span: 12
}, {
  label: '备注',
  key: 'remark'
}]
export { config, options }
