import { InputC, SelectC, DateC } from '@component/Form/ExportItem.js'
import { getTableList } from '@/axios/module_pos/store_pool_manage/shelves_result'

const config = {
  searchBar: [
    {
      cmp: InputC,
      prop: 'billNo',
      placeholder: '请输入查询工单号',
      label: '工单号'
    },
    {
      cmp: DateC,
      prop: 'applyTime',
      label: '申请日期',
      splitKey: ['applyStartTime', 'applyEndTime']
    },
    {
      cmp: SelectC,
      prop: 'onffLineType',
      options: [],
      mapping: ['itemCode', 'itemName'],
      placeholder: '请选择类型',
      label: '申请类型'
    }
  ],
  tableCofig: {
    height: 180,
    tableHeader: [
      { label: '工单号', prop: 'billNo' }, { label: '申请类型', prop: 'onffLineTypeShow' },
      { label: '总申请条码数量', prop: 'totalProductNo' }, { label: '操作成功数量', prop: 'totalSuccess' },
      { label: '工单状态', prop: 'workFlowStatusShow' },
      { label: '申请日期', prop: 'applyDate', width: '120' }, { label: '申请人', prop: 'applicant' },
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

export { config }
