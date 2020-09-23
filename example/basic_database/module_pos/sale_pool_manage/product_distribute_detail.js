import { getTableList } from '@/axios/module_pos/sale_pool_manage/product_distribute_detail'

const config = {
  editSearchBar: true,
  tableCofig: {
    height: 140,
    tableHeader: [
      { label: '商品条码', prop: 'productNo' }, { label: '商品货号', prop: 'productCode' },
      { label: '商品名称', prop: 'productName' }, { label: '品牌', prop: 'brandName' },
      { label: '尺码', prop: 'sizeName', width: '120' },
      { label: '吊牌价', prop: 'skuPrice', width: '120' }, { label: '类别', prop: 'productTypeValue' },
      { label: '项目', prop: 'productProjectValue', width: '120' }, { label: '系列', prop: 'productSeriesValue' },
      { label: '款型', prop: 'productPatternValue' }, { label: '申请数量', prop: 'expectQty' },
      { label: '实际分货数量', prop: 'actualQty' }
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
const header = [
  {
    prop: 'billNo',
    disabled: true,
    label: '分货记录流水号'
  },
  {
    prop: 'sourceName',
    disabled: true,
    label: '调出商品池'
  },
  {
    prop: 'destName',
    disabled: true,
    label: '调入商品池'
  },
  {
    prop: 'operator',
    disabled: true,
    label: '操作人'
  }
]
export { config, header }
