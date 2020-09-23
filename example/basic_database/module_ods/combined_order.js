import { InputC, SelectC, DateC, LazySelect, CheckBox } from '@component/Form/ExportItem.js'
import { getTableList } from '@/axios/module_ods/combined_order'
import { getCurrentTime } from '@/utils/globalFunction'

const arr = getCurrentTime()

const config = {
  editSearchBar: true,
  tableCofig: {
    height: 180,
    tableHeader: [
      { label: '合发单号', prop: 'mergeDispatchNo', width: '280' }, {
        label: '合发状态',
        prop: 'billStatusName',
        width: '100'
      }, { label: '业务类型', prop: 'bizType', width: '140' },
      { label: '收件人电话', prop: 'phone', width: '120' },
      { label: '发货单号', prop: 'dispatchBillNo', width: '160' },
      { label: '发货仓名称', prop: 'departWarehouseName', width: '250' }, { label: '合发单生成时间', prop: 'mergeCreateTime', width: '160' }, {
        label: '发货时间',
        prop: 'deliveryTime',
        width: '180'
      },
      { label: '快递单号', prop: 'expressBillNo', width: '100' },
      { label: '预计发货数量', prop: 'expectAmount', width: '100' }, {
        label: '实际发货数量',
        prop: 'actualAmount',
        width: '100'
      }, {
        label: '发货差异',
        prop: 'diffQty',
        width: '100'
      }
    ],
    tableData: [],
    changeCell: [11]
  },
  pageConfig: {
    noGetList: true,
    request: getTableList
  }
}
const searchOptions = [
  {
    cmp: InputC,
    prop: 'mergeDispatchNo',
    placeholder: '请输入合发单号',
    label: '合发单号',
    setDefaultValue: ''
  },
  {
    cmp: SelectC,
    prop: 'billStatusList',
    options: [],
    multiple: true,
    placeholder: '全部',
    mapping: ['dictCode', 'dictValue'],
    label: '合发单状态'
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
    cmp: SelectC,
    prop: 'toExternalWarehouseCodeList',
    options: [],
    multiple: true,
    placeholder: '全部',
    mapping: ['dictCode', 'dictValue'],
    label: '目的仓'
  },
  {
    cmp: InputC,
    prop: 'phone',
    placeholder: '请输入收件人电话',
    label: '收件人电话'
  },
  {
    cmp: InputC,
    prop: 'expressBillNo',
    placeholder: '请输入快递单号',
    label: '快递单号'
  },
  {
    cmp: InputC,
    prop: 'dispatchNo',
    placeholder: '请输入发货单号',
    label: '发货单号'
  },
  {
    cmp: DateC,
    prop: 'mergeTime',
    label: '合发单生成时间',
    splitKey: ['fromMergeCreateTime', 'toMergeCreateTime'],
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
]

export { config, searchOptions }
