import { InputC } from '@component/Form/ExportItem.js'
import { getTableList } from '@/axios/module_pos/sale_pool_manage/off_shelf_delivery_log_detail'

const config = {
  searchBar: [
    {
      cmp: InputC,
      prop: 'productNo',
      placeholder: '请输入商品条码',
      label: '商品条码'
    }, {
      cmp: InputC,
      prop: 'productCode',
      placeholder: '请输入商品货号',
      label: '商品货号'
    }
  ],
  tableCofig: {
    height: 180,
    tableHeader: [
      { label: '工单号', prop: 'billNo', operate: true },
      { label: '销售商品池名称', prop: 'poolName' }, { label: '销售商品池编码', prop: 'poolCode' },
      { label: '商品条码', prop: 'productNo' },
      { label: '商品货号', prop: 'productCode', width: '120' }, { label: '品牌', prop: 'brandName', width: '120' },
      { label: '申请下架库存数', prop: 'expectQty' }, { label: '实际下架库存数', prop: 'actualQty', width: '200' },
      { label: '处理状态', prop: 'processStatusDesc', width: '200' }, { label: '错误原因', prop: 'failReason', width: '200' },
      { label: '操作日期', prop: 'submitTime' },
      { label: '操作人', prop: 'operator', width: '120' }
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
