import { InputC, DateC, HeadSelect } from '@component/Form/ExportItem.js'
import { getTableList } from '@/axios/module_pos/store_pool_manage/inventory_push_flow'

const config = {
  searchBar: [
    {
      cmp: InputC,
      prop: 'id',
      placeholder: '请输入查询流水号',
      label: '流水号'
    },
    {
      cmp: HeadSelect,
      prop: 'poolCode',
      options: [],
      placeholder: '请选择店铺',
      filterable: true,
      mapping: ['poolCode', 'poolName'],
      label: '店铺'
    },
    {
      cmp: InputC,
      prop: 'productNo',
      placeholder: '请输入商品条码',
      label: '商品条码'
    },
    {
      cmp: DateC,
      prop: 'applyTime',
      label: '推送日期',
      splitKey: ['startTime', 'endTime']
    }
  ],
  tableCofig: {
    height: 180,
    tableHeader: [
      { label: '流水号', prop: 'id' }, { label: '店铺名称', prop: 'poolName' }, { label: '店铺编码', prop: 'poolCode' },
      { label: '商品条码', prop: 'productNo' },
      { label: '商品货号', prop: 'productCode', width: '120' }, { label: '品牌', prop: 'brandName', width: '120' },
      { label: '常态编码', prop: 'cooperationNo' }, { label: '推送数量', prop: 'saleQty' },
      { label: '推送状态', prop: 'resultCode' },
      { label: '错误提示', prop: 'resultMsg', width: '120' }, { label: '同步时间', prop: 'createAt' }
    ],
    tableData: []
  },
  pageConfig: {
    request: getTableList
  }
}

export { config }
