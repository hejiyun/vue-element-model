// ODS发货单列表页搜索框
const deliveryListOptions = [{
  type: 'input',
  name: 'mergeDispatchNo',
  placeholder: '请输入合发单号',
  label: '合发单号:'
}, {
  type: 'select',
  name: 'billStatusList',
  multiple: true,
  options: [],
  placeholder: '全部',
  label: '合发单状态:',
  index: 0
}, {
  type: 'lazySelect',
  name: 'fromExternalWarehouseCodeList',
  options: [],
  placeholder: '全部',
  label: '发货仓:'
}, {
  type: 'select',
  multiple: true,
  options: [],
  name: 'toExternalWarehouseCodeList',
  placeholder: '全部',
  label: '目的仓:',
  index: 1
},
{
  type: 'input',
  name: 'phone',
  placeholder: '请输入关键字',
  defaultValue: '',
  label: '收件人电话:'
},

{
  type: 'input',
  name: 'expressBillNo',
  placeholder: '请输入发货单号',
  label: '快递单号:'
},
{
  type: 'input',
  name: 'dispatchNo',
  placeholder: '请输入关键字',
  defaultValue: '',
  label: '发货单号:'
},
{
  type: 'daterange',
  name: 'mergeTime',
  defaultValue: [new Date().setTime(new Date().getTime() - 3600 * 1000 * 24 * 7), new Date()],
  placeholder: '',
  label: '合发单生成时间:'
}, {
  type: 'daterange',
  name: 'deliveryTime',
  placeholder: '',
  label: '发货时间:'
}, {
  type: 'checkbox',
  name: 'hasDiffExpectQty',
  placeholder: '预计发货与实际发货有差异'
}]

const deliverytableHeader = [
  { label: '合发单号', prop: 'mergeDispatchNo', width: '280' }, {
    label: '合发状态',
    prop: 'billStatusName',
    width: '100'
  }, { label: '业务类型', prop: 'bizType', width: '140' },
  { label: '收件人电话', prop: 'phone', width: '120' },
  { label: '发货单号', prop: 'dispatchBillNo', width: '160', showOverFlowTooltip: true },
  { label: '发货仓名称', prop: 'departWarehouseName', width: '250' }, { label: '合发单生成时间', prop: 'mergeCreateTime', width: '160', showOverFlowTooltip: true }, {
    label: '发货时间',
    prop: 'deliveryTime',
    width: '180',
    showOverFlowTooltip: true
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
  }]

const detailOptions = [{
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

const deliveryDetailtableHeader = [
  { label: '合发单号', prop: 'mergeDispatchNo', width: '180' }, { label: '发货单号', prop: 'dispatchNo', width: '180' }, { label: '拣货单号', prop: 'otherBillNo', width: '180' },
  { label: '订单号', prop: 'orderNo', width: '180' },
  { label: '品牌', prop: 'brand', width: '180' }, {
    label: '货品',
    prop: 'materialCode',
    width: '120'
  },
  { label: '尺码', prop: 'sizeName', width: '90' }, { label: 'SKU条码', prop: 'barCode', width: '140' },
  {
    label: '预计发货量',
    prop: 'expectAmount',
    width: '100'
  },
  { label: '实际发货量', prop: 'actualAmount', width: '100' }, // 增加实物占库数, 修改结束
  {
    label: '发货差异',
    prop: 'differenceAmount',
    width: '120',
    sort: 'custom',
    cellStyle: true
  }, { label: '零售单价', prop: 'retailPrice', width: '90' }, { label: '结算单价', prop: 'price', width: '90' },
  { label: '快递公司', prop: 'deliveryCompanyCode', showOverFlowTooltip: true, width: '100' }, {
    label: '快递单号',
    prop: 'deliveryExpressBillNo',
    width: '300'
  }]

export { deliveryDetailtableHeader, detailOptions, deliverytableHeader, deliveryListOptions }
