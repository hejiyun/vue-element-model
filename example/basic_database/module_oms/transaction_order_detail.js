import { getTableList } from '@/axios/module_oms/transaction_order_detail'

const pageConfig = {
  defaultParamter: {
    orderNo: ''
  },
  request: getTableList
}

const detailText = {
  // OMS详情展示
  // 订单信息
  OMSOrderDetailOptions: [{
    label: '交易单号',
    key: 'orderNo'
  }, {
    label: '交易订单创建时间',
    key: 'orderTransactTime'
  }, {
    label: '平台单号',
    key: 'platformNo'
  },
  {
    label: '平台订单生成时间',
    key: 'orderCreateTime'
  }, {
    label: '外部单号',
    key: 'externalNo'
  }, {
    label: '单据状态',
    key: 'orderStatusName'
  }, {
    label: '单据类型',
    key: 'orderTypeName'
  }, {
    label: '业务类型',
    key: 'bizTypeName'
  }, {
    label: '客店代码',
    key: 'shopCode'
  }, {
    label: '客店名称',
    key: 'shopCodeName'
  },
  {
    label: '订单备注',
    key: 'remark'
  }, {
    label: '订单来源', // 增加订单来源
    key: 'orderSourceValue'
  }],
  // 配送信息
  OMSOrderDetailOptions1: [{
    label: '收件人',
    key: 'receiverName'
  }, {
    label: '手机',
    key: 'receiverMobile'
  }, {
    label: '收件人省市区',
    key: 'provinceAndCity',
    span: 24
  },
  {
    label: '详细地址',
    key: 'receiverAddress',
    span: 24
  }, {
    label: '配送方式',
    key: 'logisticApproach'
  }, {
    label: '指定快递',
    key: 'logisticName'
  }, {
    label: '指定快递单号',
    key: 'logisticOrder',
    span: 24
  }, {
    label: '配送时间',
    key: 'availableDeliveryPeriod'
  }],
  // 支付信息
  OMSOrderDetailOptions2: [{
    label: '商品总金额',
    key: 'totalAmount'
  }, {
    label: '运费金额',
    key: 'shipFee'
  }, {
    label: '平台优惠金额',
    key: 'platDiscountAmount'
  },
  {
    label: '商家优惠金额',
    key: 'merchantDiscountAmount'
  }, {
    label: '订单金额',
    key: 'amount'
  }, {
    label: '支付时间',
    key: 'orderPaidTime'
  }, {
    label: '支付方式',
    key: 'payTypeName'
  }, {
    label: '支付状态',
    key: 'payStatusName'
  }],
  // 发票信息
  OMSOrderDetailOptions3: [{
    label: '寄送方式',
    key: 'invoiceTypeName'
  }, {
    label: '发票类型',
    key: 'sendType'
  }]
}

const TableText = {
  // OMS订单详情表头
  // 发货单列表信息
  OMSSendDetailtableHeader: [
    { label: '发货单号', prop: 'billNo', width: '200' }, { label: '发货单状态', prop: 'billStatus', width: '100' }, { label: '其他单号', prop: 'extraNo', width: '150' }, { label: '发货仓名称', prop: 'warehouseName', width: '140' },
    { label: '发货单创建时间', prop: 'createTime' }, { label: '是否存在差异', prop: 'isDiff', width: '100' }
  ],
  // 售后单列表信息
  OMSSendDetailtableHeader1: [
    { label: '售后单号', prop: 'returnNo' }, { label: '售后单状态', prop: 'returnStatusName', width: '100' }, { label: '售后单创建时间', prop: 'createTime', width: '180' }
  ],
  // 商品详情信息
  OMSSendDetailtableHeader2: [
    { label: '品牌', prop: 'brandName' }, { label: '货品简称', prop: 'shortName' }, { label: '货号', prop: 'productCode' },
    { label: '尺码', prop: 'skuSize' }, { label: 'SKU条码', prop: 'barcode' }, { label: '颜色', prop: 'colorName' },
    { label: '商品结算单价', prop: 'balaPrice' }, { label: '单件优惠', prop: 'accountName' }, { label: '商品数量', prop: 'quantity' },
    { label: '占库渠道', prop: 'channelShowName', width: '200' }, { label: '预计渠道占库数', prop: 'expectedQty', width: '120' }, { label: '渠道占库数', prop: 'channelQty' }, // 增加渠道占库等4项
    { label: '实物占库数量', prop: 'occupyQty' }, { label: '发货数量', prop: 'dispatchQty' } // 修改结束
  ]
}
export { detailText, TableText, pageConfig }
