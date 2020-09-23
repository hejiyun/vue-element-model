import { InputC, SelectC, DateC, Upload, HeadSelect } from '@component/Form/ExportItem.js'
import { getTableList } from '@/axios/module_b2b/order'

const config = {
  searchBar: [
    {
      cmp: InputC,
      prop: 'orderNo',
      placeholder: '请输入订单号',
      label: '订单号'
    },
    {
      cmp: InputC,
      prop: 'manualBillNo',
      placeholder: '请输入手工单号',
      label: '手工单号'
    },
    {
      cmp: SelectC,
      prop: 'billType',
      placeholder: '请选择类型',
      multiple: true,
      options: [
        { value: 'FUTURE', label: '期货' },
        { value: 'SPECIAL', label: '特价' },
        { value: 'SPOT', label: '现货' },
        { value: 'OTHER', label: '其他' }
      ],
      label: '订单类型'
    },
    {
      cmp: SelectC,
      prop: 'orderStatus',
      placeholder: '请选择状态',
      multiple: true,
      options: [
        { value: 'WAIT_OCCUPY_INVENTORY', label: '待占库' },
        { value: 'OCCUPYING_INVENTORY', label: '占库中' },
        { value: 'OCCUPYING_INVENTORY_FINISH', label: '占库完成' },
        { value: 'OCCUPYING_INVENTORY_FAILED', label: '占库失败' },
        { value: 'AGREE_APPROVAL', label: '审批通过' },
        { value: 'DOING_APPROVAL', label: '审批中' },
        { value: 'REFUSE_APPROVAL', label: '审批不通过' },
        { value: 'ORDER_CONFIRMATION', label: '订单确认中' },
        { value: 'ORDER_CONFIRMED', label: '订单已确认' },
        { value: 'DISPATCH_CONFIRMATION', label: '发货单确认中' },
        { value: 'DISPATCH_CONFIRMED', label: '发货中' },
        { value: 'PARTIAL_DELIVERY', label: '部分发货' },
        { value: 'SHIPPED', label: '已发货' },
        { value: 'CANCELING', label: '订单取消中' },
        { value: 'CANCELLED', label: '订单已取消' }
      ],
      label: '订单状态'
    },
    {
      cmp: DateC,
      prop: 'createTime',
      label: '订单日期',
      splitKey: ['startDate', 'endDate']
    },
    {
      cmp: InputC,
      prop: 'customerShortName',
      placeholder: '请输入查询客户简称',
      label: '客户简称'
    },
    {
      cmp: InputC,
      prop: 'customerCode',
      placeholder: '请输入查询客户代码',
      label: '客户代码'
    }
  ],
  tableCofig: {
    height: 200,
    tableHeader: [
      { label: '订单号', prop: 'orderNo' }, { label: '手工单号', prop: 'manualBillNo' },
      { label: '订单类型', prop: 'billTypeDesc' }, { label: '订单状态', prop: 'orderStatus' },
      { label: '客户代码', prop: 'customerCode' }, { label: '客户简称', prop: 'customerShortName' },
      { label: '订单日期', prop: 'createDate', sort: true
      }, { label: '最后更新时间', prop: 'lastUpdateDate', sort: true, width: '160' },
      { label: '操作', prop: 'btn', fixed: 'left', operate: true, width: '100' }
    ],
    tableData: []
  },
  pageConfig: {
    request: getTableList
  }
}

const importConfig = { options: [
  {
    cmp: HeadSelect,
    prop: 'customerCode',
    options: [],
    rules: {
      required: true, message: '请选择客户', trigger: 'change'
    },
    filterable: true,
    placeholder: '请选择客户',
    mapping: ['customerCode', 'shortNameValue'],
    label: '客户'
  },
  {
    cmp: InputC,
    prop: 'manualNo',
    placeholder: '请输入手工单号',
    label: '手工单号'
  },
  {
    cmp: HeadSelect,
    prop: 'bwWarehouseCode',
    options: [],
    rules: {
      required: true, message: '请选择仓库', trigger: 'change'
    },
    filterable: true,
    placeholder: '请选择仓库',
    mapping: ['warehouseCode', 'warehouseName'],
    label: '仓库'
  },
  {
    label: '类型',
    prop: 'billType',
    rules: { required: true, message: '请选择类型', trigger: 'change' },
    operate: true
  },
  {
    label: '文件',
    prop: 'file',
    cmp: Upload,
    FileTypeList: ['xlsx']
  }
] }
const resurceoptions = [ // 弹窗其他类型下子类型
  {
    value: 'CLAIM_COMPENSATE',
    label: '索赔'
  },
  {
    value: 'TRANSFER_REPOSITORY',
    label: '转仓'
  },
  {
    value: 'CHARGE_ACCOUNT',
    label: '走账'
  },
  {
    value: 'TRANSFER_PRODUCT',
    label: '货品中转'
  },
  {
    value: 'OTHER',
    label: '其他'
  }
]

const orderStatus = { // 订单状态变量
  WAIT_OCCUPY_INVENTORY: '待占库',
  OCCUPYING_INVENTORY: '占库中',
  OCCUPYING_INVENTORY_FAILED: '占库失败',
  OCCUPYING_INVENTORY_FINISH: '占库完成',
  DISPATCH_CONFIRMATION: '发货单确认中',
  DISPATCH_CONFIRMED: '发货中',
  AGREE_APPROVAL: '审批通过',
  DOING_APPROVAL: '审批中',
  REFUSE_APPROVAL: '审批不通过',
  WAITING_FOR_PAYMENT: '待付款',
  COLLECTION_CONFIRMATION: '审批通过',
  PAID: '已付款',
  ORDER_CONFIRMATION: '订单确认中',
  ORDER_CONFIRMED: '订单已确认',
  IN_DELIVERY: '发货中',
  SHIPPED: '已发货',
  CANCELLED: '订单已取消',
  CANCELING: '订单取消中',
  PARTIAL_DELIVERY: '部分发货'
}
export { config, importConfig, resurceoptions, orderStatus }
