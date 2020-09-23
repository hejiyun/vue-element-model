import { InputC, SelectC, HeadSelect, DateC, LazySelect, CheckBox } from '@component/Form/ExportItem.js'
import { getTableList } from '@/axios/module_ods/receive_order'
import { getCurrentTime } from '@/utils/globalFunction'

const arr = getCurrentTime()

const config = {
  searchBar: [
    {
      cmp: InputC,
      prop: 'billNo',
      placeholder: '请输入收货单号',
      label: '收货单号'
    },
    {
      cmp: SelectC,
      prop: 'billStatusList',
      options: [],
      multiple: true,
      placeholder: '全部',
      mapping: ['dictCode', 'dictValue'],
      label: '收货单状态'
    },
    {
      cmp: LazySelect,
      prop: 'toExternalWarehouseCodeList',
      AllList: [],
      optionHeader: ['仓库代码/externalWarehouseCode', '仓库名称/warehouseName', '仓库类型/warehouseTypeName'],
      placeholder: '请选择收货仓',
      label: '收货仓'
    },
    {
      cmp: LazySelect,
      prop: 'fromExternalWarehouseCodeList',
      AllList: [],
      optionHeader: ['仓库代码/externalWarehouseCode', '仓库名称/warehouseName', '仓库类型/warehouseTypeName'],
      placeholder: '请选择发货仓',
      label: '发货仓'
    },
    {
      cmp: HeadSelect,
      prop: 'vendCustCode',
      options: [],
      filterable: true,
      placeholder: '请选择客商',
      mapping: ['vendCustCode', 'vendCustName'],
      label: '客商名称'
    },
    {
      cmp: SelectC,
      prop: 'bizTypeList',
      options: [],
      multiple: true,
      placeholder: '全部',
      mapping: ['dictCode', 'dictValue'],
      label: '业务类型'
    },
    {
      cmp: InputC,
      prop: 'orderNo',
      placeholder: '请输入订单号',
      label: '订单号'
    },
    {
      cmp: InputC,
      prop: 'sourceBillNo',
      placeholder: '请输入来源单号',
      label: '来源单号'
    },
    {
      cmp: InputC,
      prop: 'shopBillNo',
      placeholder: '请输入网店交易单号',
      label: '网店交易单号'
    },
    {
      cmp: InputC,
      prop: 'externalBillNo',
      placeholder: '请输入外部单号',
      label: '外部单号'
    },
    {
      cmp: DateC,
      prop: 'createTime',
      label: '收货单生成时间',
      splitKey: ['fromCreateTime', 'toCreateTime'],
      setDefaultValue: arr
    },
    {
      cmp: DateC,
      prop: 'deliveryTime',
      label: '收货时间',
      splitKey: ['fromReceiveTime', 'toReceiveTime']
    }, {
      cmp: CheckBox,
      prop: 'hasDiffExpectQty',
      placeholder: '预计发货与实际发货有差异',
      label: ''
    }
  ],
  tableCofig: {
    height: 180,
    tableHeader: [
      { label: '收货单号', prop: 'billNo', width: '280', operate: true }, {
        label: '收货单状态',
        prop: 'billStatusName',
        width: '100'
      }, { label: '业务类型', prop: 'bizTypeName', width: '160' },
      { label: '来源单号', prop: 'sourceBillNo', width: '200' },
      { label: '网店交易单号', prop: 'shopBillNo', width: '200' },
      { label: '外部单号', prop: 'externalBillNo', width: '200' },
      { label: '订单号', prop: 'orderNo', width: '260', operate: true }, { label: '客商名称', prop: 'vendCustName', width: '240' }, {
        label: '收货仓名称',
        prop: 'toExternalWarehouseName',
        width: '280'
      },
      { label: '收货单生成时间', prop: 'createTime', width: '180' }, { label: '预计收货数量', prop: 'expectQty', width: '100' }, {
        label: '实际收货数量',
        prop: 'actualQty',
        width: '100'
      }, { label: '收货差异', prop: 'diffQty', width: '90' },
      {
        label: '操作',
        prop: 'btn',
        fixed: 'right',
        operate: true,
        width: '180'
      }
    ],
    tableData: [],
    changeCell: [12]
  },
  pageConfig: {
    noGetList: true,
    request: getTableList
  }
}

export { config }
