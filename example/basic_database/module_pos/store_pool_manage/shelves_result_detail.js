import { getTableList } from '@/axios/module_pos/store_pool_manage/shelves_result_detail'

const config = {
  editSearchBar: true,
  tableCofig: {
    height: 140,
    tableHeader: [
      { label: '工单号', prop: 'billNo' }, { label: '商品名称', prop: 'productName' },
      { label: '商品条码', prop: 'productNo' }, { label: '是否成功', prop: 'processStatusShow' },
      { label: '失败原因', prop: 'resultMsg', width: '120' }
    ],
    tableData: []
  },
  pageConfig: {
    defaultParamter: {
      billNo: ''
    },
    request: getTableList
  }
}

export { config }
