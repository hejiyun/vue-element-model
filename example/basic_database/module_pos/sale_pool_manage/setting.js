import { SelectC, HeadSelect } from '@component/Form/ExportItem.js'
import { getTableList } from '@/axios/module_pos/sale_pool_manage/setting'

const config = {
  searchBar: [
    {
      cmp: HeadSelect,
      prop: 'poolCode',
      options: [],
      placeholder: '请选择销售商品池',
      filterable: true,
      mapping: ['poolCode', 'poolName'],
      label: '销售商品池'
    },
    {
      cmp: SelectC,
      prop: 'poolStatus',
      options: [],
      mapping: ['itemCode', 'itemName'],
      placeholder: '请选择销售商品池状态',
      label: '商品池状态'
    }
  ],
  tableCofig: {
    height: 180,
    tableHeader: [
      { label: '销售商品池名称', prop: 'poolName' }, { label: '销售商品池编码', prop: 'poolCode' },
      { label: '共享/独占', prop: 'shareMode', operate: true }, { label: '商品池状态', prop: 'poolStatusShow' },
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
