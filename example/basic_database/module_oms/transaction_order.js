import { InputC, SelectC, HeadSelect, DateC, CheckBox } from '@component/Form/ExportItem.js'
import { getTableList } from '@/axios/module_oms/transaction_order'
import { getCurrentTime } from '@/utils/globalFunction'

const arr = getCurrentTime()

const pageConfig = {
  noGetList: true,
  request: getTableList
}
const searchOptions = [
  {
    cmp: InputC,
    prop: 'orderNo',
    placeholder: '请输入交易单号',
    label: '交易单号'
  },
  {
    cmp: InputC,
    prop: 'externalNo',
    placeholder: '请输入外部单号',
    label: '外部单号'
  },
  {
    cmp: InputC,
    prop: 'platformNo',
    placeholder: '请输入平台单号',
    label: '平台单号'
  },
  {
    cmp: SelectC,
    prop: 'bizTypes',
    options: [],
    multiple: true,
    placeholder: '全部',
    mapping: ['dicKey', 'dicValue'],
    label: '业务类型'
  },
  {
    cmp: SelectC,
    prop: 'orderType',
    options: [],
    multiple: true,
    placeholder: '全部',
    mapping: ['dicKey', 'dicValue'],
    label: '单据类型'
  },
  {
    cmp: SelectC,
    prop: 'orderStatus',
    options: [],
    multiple: true,
    placeholder: '全部',
    mapping: ['dicKey', 'dicValue'],
    label: '单据状态'
  },
  {
    cmp: InputC,
    prop: 'receiverNameLike',
    placeholder: '请输入收件人姓名',
    label: '收件人姓名'
  },
  {
    cmp: InputC,
    prop: 'receiverMobileLike',
    placeholder: '请输入收件人电话',
    label: '收件人电话'
  },
  {
    cmp: HeadSelect,
    prop: 'shopCode',
    options: [],
    placeholder: '全部',
    filterable: true,
    mapping: ['vendCustCode', 'vendCustName'],
    label: '客店名称'
  },
  {
    cmp: SelectC,
    prop: 'orderSourceCode',
    options: [],
    multiple: true,
    placeholder: '全部',
    mapping: ['dicKey', 'dicValue'],
    label: '订单来源'
  },

  {
    cmp: DateC,
    prop: 'changeTime',
    label: '平台单生成时间',
    splitKey: ['orderCreateTimeStart', 'orderCreateTimeEnd']
  },
  {
    cmp: DateC,
    prop: 'createTime',
    label: '交易单创建时间',
    splitKey: ['orderTransactTimeStart', 'orderTransactTimeEnd'],
    setDefaultValue: arr
  },
  {
    cmp: CheckBox,
    prop: 'inadequate',
    placeholder: '缺货',
    label: ''
  }
]

export { searchOptions, pageConfig }
