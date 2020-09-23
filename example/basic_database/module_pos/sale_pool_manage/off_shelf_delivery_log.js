import { InputC, HeadSelect, DateC } from '@component/Form/ExportItem.js'
import { getTableList } from '@/axios/module_pos/sale_pool_manage/off_shelf_delivery_log'

const config = {
  searchBar: [
    {
      cmp: HeadSelect,
      prop: 'poolCode',
      options: [],
      placeholder: '请选择销售商品池',
      filterable: true,
      mapping: ['poolCode', 'poolName'],
      label: '销售池'
    },
    {
      cmp: InputC,
      prop: 'billNo',
      placeholder: '请输入查询工单号',
      label: '工单号'
    },
    {
      cmp: DateC,
      prop: 'submitTime',
      label: '申请日期',
      splitKey: ['submitTimeBegin', 'submitTimeEnd']
    }
  ],
  tableCofig: {
    height: 180,
    tableHeader: [
      { label: '工单号', prop: 'billNo' }, { label: '申请日期', prop: 'submitTime' },
      { label: '商品申请下架总数', prop: 'expectQty' }, { label: '商品实际下架总数', prop: 'actualQty' },
      { label: '操作人', prop: 'operator', width: '120' },
      { label: '操作', prop: 'btn', operate: true, width: '200' }
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

export { config }
