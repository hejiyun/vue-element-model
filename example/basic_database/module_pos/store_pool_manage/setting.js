import { InputC, SelectC, HeadSelect } from '@component/Form/ExportItem.js'
import { getTableList } from '@/axios/module_pos/store_pool_manage/setting'

const config = {
  searchBar: [
    {
      cmp: HeadSelect,
      prop: 'poolCode',
      options: [],
      placeholder: '请选择店铺',
      filterable: true,
      mapping: ['poolCode', 'poolName'],
      label: '店铺'
    }, {
      cmp: InputC,
      prop: 'vendor',
      placeholder: '请输入供应商ID',
      label: '供应商ID'
    },
    {
      cmp: SelectC,
      prop: 'bizMode',
      options: [],
      mapping: ['itemCode', 'itemCode'],
      placeholder: '请选择业务模式',
      label: '业务模式'
    },
    {
      cmp: SelectC,
      prop: 'poolStatus',
      options: [],
      mapping: ['itemCode', 'itemName'],
      placeholder: '请选择店铺状态',
      label: '店铺状态'
    }
  ],
  tableCofig: {
    height: 180,
    tableHeader: [
      { label: '店铺名称', prop: 'poolName', width: '240' }, { label: '店铺编码', prop: 'poolCode', width: '240' }, { label: '供应商ID', prop: 'vendor', width: '240' }, { label: '业务模式', prop: 'bizMode', width: '120' }, {
        label: '店铺状态',
        prop: 'poolStatusShow'
      },
      { label: '操作', prop: 'btn', operate: true }
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
