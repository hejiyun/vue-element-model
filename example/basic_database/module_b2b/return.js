import { InputC, SelectC, DateC, Upload, HeadSelect } from '@component/Form/ExportItem.js'
import { getTableList } from '@/axios/module_b2b/return'

const config = {
  searchBar: [
    {
      cmp: InputC,
      prop: 'retOrderNo',
      placeholder: '请输入销售退货单号',
      label: '销售退货单号'
    },
    {
      cmp: SelectC,
      prop: 'retOrderStatus',
      placeholder: '请选择退货单状态',
      multiple: true,
      options: [],
      mapping: ['code', 'value'],
      label: '销售退货单状态'
    },
    {
      cmp: HeadSelect,
      prop: 'warehouseCode',
      options: [],
      filterable: true,
      placeholder: '请选择仓库',
      mapping: ['warehouseCode', 'warehouseName'],
      label: '收货仓'
    },
    {
      cmp: SelectC,
      prop: 'retType',
      placeholder: '退货类型',
      multiple: true,
      options: [],
      mapping: ['code', 'value'],
      label: '退货类型'
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
    },
    {
      cmp: DateC,
      prop: 'createTime',
      label: '开单日期',
      splitKey: ['begin', 'end']
    }
  ],
  tableCofig: {
    height: 200,
    tableHeader: [
      { label: '销售退货单号', prop: 'retOrderNo' }, {
        label: '销售退货单状态',
        prop: 'retOrderStatusName'
      }, { label: '收货仓', prop: 'receiveWarehouseName' },
      { label: '退货类型', prop: 'retType' }, {
        label: '客户代码',
        prop: 'customerCode'
      }, { label: '客户简称', prop: 'customerName' }, { label: '开单日期', prop: 'createTime', width: '240', sort: true },
      { label: '最后更新时间', prop: 'lastUpdateTime', width: '240', sort: true },
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
    prop: 'warehouseCode',
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
    cmp: HeadSelect,
    prop: 'retType',
    options: [],
    rules: {
      required: true, message: '请选择退货类型', trigger: 'change'
    },
    filterable: true,
    placeholder: '请选择仓库',
    mapping: ['code', 'value'],
    label: '退货类型'
  },
  {
    label: '文件',
    prop: 'file',
    cmp: Upload,
    FileTypeList: ['xlsx']
  }
] }

export { config, importConfig }
