import { InputC, SelectC, DateC, Upload, HeadSelect } from '@component/Form/ExportItem.js'
import { getTableList } from '@/axios/module_pos/sale_pool_manage/product_distribute'

const config = {
  searchBar: [
    {
      cmp: InputC,
      prop: 'billNo',
      placeholder: '请输入分货工单号',
      label: '分货工单号'
    },
    {
      cmp: HeadSelect,
      prop: 'sourceCode',
      options: [],
      placeholder: '请选择调入商品池',
      filterable: true,
      mapping: ['poolCode', 'poolName'],
      label: '调入商品池'
    },
    {
      cmp: HeadSelect,
      prop: 'destCode',
      options: [],
      placeholder: '请选择调出商品池',
      filterable: true,
      mapping: ['poolCode', 'poolName'],
      label: '调出商品池'
    },
    {
      cmp: InputC,
      prop: 'operatorLike',
      placeholder: '请输入操作人',
      label: '操作人'
    },
    {
      cmp: DateC,
      prop: 'submitTime',
      label: '申请日期',
      splitKey: ['submitTimeBegin', 'submitTimeEnd']
    },
    {
      cmp: SelectC,
      prop: 'workFlowStatusCodes',
      options: [],
      multiple: true,
      mapping: ['itemCode', 'itemName'],
      placeholder: '请选择单据状态',
      label: '单据状态'
    }
  ],
  tableCofig: {
    height: 180,
    tableHeader: [
      { label: '分货工单号', prop: 'billNo' }, { label: '调出商品池', prop: 'sourceName' },
      { label: '调入商品池', prop: 'destName' }, { label: '商品条码总数', prop: 'detailSize' },
      { label: '商品总数', prop: 'expectQty' },
      { label: '操作日期', prop: 'submitTime', width: '120' }, { label: '操作人', prop: 'operator' },
      { label: '单据状态', prop: 'workFlowStatusDesc', width: '120' },
      { label: '操作', prop: 'btn', operate: true, width: '120' }
    ],
    tableData: []
  },
  pageConfig: {
    defaultParamter: {
      orderByList: [{ columnName: 'id', order: 'desc' }]
    },
    request: getTableList
  }
}
const shelvesConfig = [
  {
    prop: 'sourceCode',
    options: [],
    placeholder: '请选择调入商品池',
    filterable: true,
    mapping: ['poolCode', 'poolName'],
    label: '调入商品池'
  },
  {
    prop: 'destCode',
    options: [],
    placeholder: '请选择调出商品池',
    filterable: true,
    mapping: ['poolCode', 'poolName'],
    label: '调出商品池'
  },
  {
    label: '文件',
    prop: 'file',
    cmp: Upload,
    FileTypeList: ['xlsx']
  }
]
export { config, shelvesConfig }
