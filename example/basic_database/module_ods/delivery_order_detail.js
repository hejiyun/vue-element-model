import { getTableList } from '@/axios/module_ods/delivery_order_detail'

const config = {
  editSearchBar: true,
  tableCofig: {
    height: 280,
    tableHeader: [
      { label: '品牌', prop: 'brand', width: '180' }, { label: '货品简称', prop: 'productShortName', showOverFlowTooltip: true }, {
        label: '货号',
        prop: 'materialCode',
        width: '120'
      },
      { label: '尺码', prop: 'sizeName', width: '90' }, { label: 'SKU条码', prop: 'barCode', width: '140' }, {
        label: '颜色',
        prop: 'color',
        width: '100'
      },
      {
        label: '预计发货量',
        prop: 'estimateTotalAmount',
        width: '100'
      },
      { label: '实物占库数量', prop: 'occupiedQty', width: '100' }, // 增加实物占库数, 修改结束
      { label: '实际发货量', prop: 'amount', width: '100' }, {
        label: '发货差异',
        prop: 'differenceAmount',
        width: '120',
        sort: 'custom',
        cellStyle: true
      }, { label: '零售单价', prop: 'retailPrice', width: '90' }, { label: '结算单价', prop: 'price', width: '90' },
      { label: '箱号', prop: 'boxNo', width: '90' },
      { label: '快递公司', prop: 'deliveryCompanyName', showOverFlowTooltip: true, width: '100' }, {
        label: '快递单号',
        prop: 'deliveryExpressBillNo',
        width: '300'
      }
    ],
    tableData: [],
    changeCell: [9],
    mergeTable: 'deliveryInfoList',
    mergeTableColumnIndex: [11, 12, 13]
  },
  pageConfig: {
    request: getTableList
  }
}
const options = [{
  label: '发货单号',
  key: 'billNo', // data中对应的字段
  span: 8
}, {
  label: '关联的合发单号',
  key: 'billNo', // data中对应的字段
  operation: true,
  span: 8
}, {
  label: '订单号',
  key: 'orderNo',
  type: 'link',
  to: '/TradingPlatform/List/ListDetail',
  span: 8
}, {
  label: '来源单号',
  key: 'sourceBillNo',
  span: 12
},
{
  label: '网店交易单号',
  key: 'shopBillNo',
  span: 12
}, {
  label: '发货单状态',
  key: 'billStatusName'
}, {
  label: '发货单生成时间',
  key: 'createTime'
}, {
  label: '发货单下发时间',
  key: 'billDate'
}, {
  label: '发货时间',
  key: 'deliveryTime'
}, {
  label: '业务类型',
  key: 'bizTypeName'
}, {
  label: '客商编码',
  key: 'vendCustCode'
},
{
  label: '客商名称',
  key: 'vendCustName',
  span: 12
}, {
  label: '调拨类型',
  key: 'allocateType'
}, {
  label: '调拨方式名称',
  key: 'allocateModeName'
}, {
  label: '调拨优先级',
  key: 'allocatePriority',
  span: 12
}, { // 增加详情信息展示
  label: '发运方式',
  key: 'transportMethodName'
}, {
  label: '所属批次',
  key: 'batchMark'
}, {
  label: '预计到货时间',
  key: 'expectArrivalTime'
}, {
  label: '其他单号',
  key: 'otherBillNo' // 修改结束
}, {
  label: '发货仓代码',
  key: 'fromExternalWarehouseCode'
}, {
  label: '发货仓名称',
  key: 'fromExternalWarehouseName'
}, {
  label: '目的仓代码',
  key: 'toExternalWarehouseCode'
}, {
  label: '目的仓名称',
  key: 'toExternalWarehouseName'
},
{
  label: '收件人省市区',
  key: 'provinceCityArea'
}, {
  label: '收件人地址',
  key: 'address'
}, {
  label: '收件人姓名',
  key: 'contact'
}, {
  label: '收件人电话',
  key: 'phone'
}, {
  label: '是否打印发票',
  key: 'PrintInvoiceFlag',
  type: 'radio'
}, {
  label: '是否货票同行',
  key: 'WithInvoiceFlag',
  type: 'radio',
  span: 12
}, {
  label: '备注',
  key: 'remark'
}]
export { config, options }
