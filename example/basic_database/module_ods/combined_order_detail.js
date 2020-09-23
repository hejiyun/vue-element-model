import { getTableList } from '@/axios/module_ods/combined_order_detail'

const config = {
  editSearchBar: true,
  tableCofig: {
    height: 360,
    tableHeader: [
      { label: '合发单号', prop: 'mergeDispatchNo', width: '280' }, {
        label: '合发状态',
        prop: 'billStatusName',
        width: '100'
      }, { label: '业务类型', prop: 'bizType', width: '140' },
      { label: '收件人电话', prop: 'phone', width: '120' },
      { label: '发货单号', prop: 'dispatchBillNo', width: '160' },
      { label: '发货仓名称', prop: 'departWarehouseName', width: '250' }, { label: '合发单生成时间', prop: 'mergeCreateTime', width: '160' }, {
        label: '发货时间',
        prop: 'deliveryTime',
        width: '180'
      },
      { label: '快递单号', prop: 'expressBillNo', width: '100' },
      { label: '预计发货数量', prop: 'expectAmount', width: '100' }, {
        label: '实际发货数量',
        prop: 'actualAmount',
        width: '100'
      }, {
        label: '发货差异',
        prop: 'diffQty',
        width: '100'
      }
    ],
    tableData: [],
    changeCell: [10]
  },
  pageConfig: {
    defaultParamter: {
      mergeDispatchNo: this.$route.params.id
    },
    request: getTableList
  }
}
const options = [{
  label: '合发单号',
  key: 'mergeDispatchNo', // data中对应的字段
  span: 24
}, {
  label: '合发单状态',
  key: 'billStatusName'
}, {
  label: '合发单生成时间',
  key: 'mergeCreateTime'
}, {
  label: '合发单下发时间',
  key: 'dispatchTime'
}, {
  label: '发货时间',
  key: 'deliveryTime'
}, {
  label: '业务类型',
  key: 'bizType'
}, { // 增加详情信息展示
  label: '发运方式',
  key: 'transportMethodName'
}, {
  label: '所属批次',
  key: 'batchMark'
}, {
  label: '预计到货时间',
  key: 'expectArrivalTime'
}, {
  label: '发货仓代码',
  key: 'fromExternalWarehouseCode'
}, {
  label: '发货仓名称',
  key: 'fromExternalWarehouseName'
}, {
  label: '目的仓代码',
  key: 'toExternalWarehouseCode'
}, {
  label: '目的仓名称',
  key: 'toExternalWarehouseName'
},
{
  label: '收件人省市区',
  key: 'provinceCityArea'
}, {
  label: '收件人地址',
  key: 'address'
}, {
  label: '收件人姓名',
  key: 'contact'
}, {
  label: '收件人电话',
  key: 'phone'
}]
export { config, options }
