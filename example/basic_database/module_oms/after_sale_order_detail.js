import { getTableList } from '@/axios/module_oms/after_sale_order_detail'

const pageConfig = {
  defaultParamter: {
    uid: '', // 单id
    returnNo: '' // 单号
  },
  request: getTableList
}

const detailText = {
  // OMS售后详情
  OMSReceiveDetailOptions: [{
    label: '售后单号',
    key: 'returnNo'
  }, {
    label: '售后单创建时间',
    key: 'createTime'
  }, {
    label: '单据状态',
    key: 'returnStatusName'
  },
  {
    label: '交易单号',
    key: 'orderNo',
    type: 'link',
    to: '/OMS/OrderDetail',
    onlyLink: true
  }, {
    label: '收货单号',
    key: 'receiptNo',
    type: 'link',
    to: '/ODS/ReceiveList/ReceiveDetail',
    onlyLink: true
  }, {
    label: '外部单号',
    key: 'externalNo'
  }, {
    label: '单据类型',
    key: 'returnTypeName'
  }, {
    label: '业务类型',
    key: 'bizTypeName'
  }, {
    label: '客店代码',
    key: 'shopCode'
  }, {
    label: '客店名称',
    key: 'shopName'
  }],
  OMSReceiveDetailOptions1: [{
    label: '客户姓名',
    key: 'senderName'
  }, {
    label: '手机',
    key: 'senderMobile'
  }, {
    label: '客户寄件省市区',
    key: 'provinceAndCity',
    span: 24
  },
  {
    label: '详细地址',
    key: 'senderAddress',
    span: 24
  }, {
    label: '快递公司',
    key: 'logisticName',
    span: 24
  }, {
    label: '快递单号',
    key: 'logisticOrder'
  }],
  OMSReceiveDetailOptions2: [{
    label: '仓库账套',
    key: 'warehouseAccount'
  },
  {
    label: '仓库代码',
    key: 'warehouseExternalCode'
  },
  {
    label: '仓库名称',
    key: 'warehouseName'
  }
  ]
}

const TableText = {
  // OMS售后单详情
  OMSproductDetailtableHeader: [
    { label: '品牌', prop: 'brandName' }, { label: '货号简称', prop: 'shortName' },
    { label: '货号', prop: 'productCode' }, { label: '尺码', prop: 'skuSize' }, { label: 'SKU条码', prop: 'barcode' }, { label: '颜色', prop: 'colorName' },
    { label: '售后数量', prop: 'quantity' }, { label: '收货数量', prop: 'actualQuantity' }
  ]
}
export { detailText, TableText, pageConfig }
